// Project Capricorn / Gemini bridge v0.2
// Deploy the server/ folder through Cloudflare Workers Builds. GitHub Pages only serves the root website.
// Set GEMINI_API_KEY and CAPRI_ACCESS_TOKEN as Cloudflare *secrets*.
// Optionally set GEMINI_MODEL as a plaintext variable.
const ALLOWED_ORIGIN = 'https://narthalune.github.io';
const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

function respond(status, payload, origin) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  });
  if (origin === ALLOWED_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Max-Age', '600');
  }
  return new Response(JSON.stringify(payload), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const path = new URL(request.url).pathname;
    // Only the Capri website is allowed to make browser requests.
    // This check does not replace the access token: scripts can spoof Origin.
    if (origin && origin !== ALLOWED_ORIGIN) {
      return respond(403, { error: 'This website is not allowed.' }, origin);
    }
    if (request.method === 'OPTIONS') {
      if (path !== '/chat' && path !== '/health') return respond(404, {error:'Not found.'}, origin);
      const h = new Headers({ 'Vary': 'Origin', 'Cache-Control': 'no-store' });
      if (origin === ALLOWED_ORIGIN) {
        h.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
        h.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        h.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        h.set('Access-Control-Max-Age', '600');
      }
      return new Response(null, { status: 204, headers: h });
    }
    if (!env.GEMINI_API_KEY || !env.CAPRI_ACCESS_TOKEN) {
      return respond(503, { error: 'Server secrets are missing. Add them in Cloudflare settings.' }, origin);
    }
    const token = request.headers.get('Authorization') || '';
    if (token !== `Bearer ${env.CAPRI_ACCESS_TOKEN}`) {
      return respond(401, { error: 'Access token is incorrect.' }, origin);
    }
    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    if (path === '/health' && request.method === 'GET') {
      return respond(200, { ok: true, model }, origin);
    }
    if (path !== '/chat' || request.method !== 'POST') {
      return respond(404, { error: 'Endpoint not found.' }, origin);
    }
    if ((request.headers.get('Content-Type') || '').split(';')[0] !== 'application/json') {
      return respond(415, { error: 'Send JSON.' }, origin);
    }
    const size = Number(request.headers.get('Content-Length'));
    if (size > 25000) return respond(413, { error: 'Request too large.' }, origin);
    let input;
    try {
      const raw = await request.text();
      if (raw.length > 25000) return respond(413, { error: 'Request too large.' }, origin);
      input = JSON.parse(raw);
    } catch {
      return respond(400, { error: 'Invalid JSON.' }, origin);
    }
    if (!Array.isArray(input.messages) || !input.messages.length) {
      return respond(400, { error: 'No conversation provided.' }, origin);
    }
    const messages = input.messages.slice(-20)
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string' && m.text.trim())
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{text: m.text.slice(0, 3000)}] }));
    // Gemini expects a conversation beginning with a user turn.
    while (messages.length && messages[0].role !== 'user') messages.shift();
    const chars = messages.reduce((sum,m) => sum + m.parts[0].text.length, 0);
    if (!messages.length || messages[messages.length - 1].role !== 'user' || chars > 15000) {
      return respond(400, {error: 'Conversation is too long or ends without a user message.'}, origin);
    }
    const body = {
      systemInstruction: {parts:[{text:'You are Capri, an original friendly cyberpunk-themed AI companion. Be helpful, warm, playful, and concise. Never claim to have performed actions you cannot perform. You have only the chat context sent by the user. Do not pretend to have synced memory with other devices.'}]},
      contents: messages,
      generationConfig: { maxOutputTokens: 900 }
    };
    let googleResponse;
    try {
      googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });
    } catch {
      return respond(504, { error: 'Could not reach Gemini. Try again.' }, origin);
    }
    if (!googleResponse.ok) {
      const code = googleResponse.status;
      const explanation = code === 429 ? 'Gemini quota reached. Try later or check your quota.' :
        code === 404 ? 'Model not found or not available to this API key. Check GEMINI_MODEL.' :
        code === 400 ? 'Gemini rejected the request. Check model and prompt.' :
        code === 403 || code === 401 ? 'Gemini API key lacks access. Check it in AI Studio.' :
        'Gemini service error. Check API limits and try again.';
      return respond(code === 429 ? 429 : 502, { error: explanation, upstreamStatus: code }, origin);
    }
    let result;
    try { result = await googleResponse.json(); }
    catch { return respond(502, { error: 'Gemini returned an unreadable response.' }, origin); }
    const reply = (result.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || '').join('').trim();
    if (!reply) return respond(502, { error: 'Gemini returned no text. It may have blocked the request.' }, origin);
    return respond(200, { reply: reply.slice(0, 10000), model }, origin);
  }
};