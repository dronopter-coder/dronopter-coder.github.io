// Geçici görsel üretim Worker'ı: yalnızca işaret görselleri iş akışı sırasında yayında kalır, sonra silinir.
export default {
  async fetch(req, env) {
    if (req.headers.get('x-key') !== env.KEY) return new Response('forbidden', { status: 403 });
    const { prompt, model } = await req.json();
    try {
      const out = await env.AI.run(model || '@cf/black-forest-labs/flux-1-schnell', { prompt, steps: 8 });
      return Response.json({ image: out.image });
    } catch (e) {
      return Response.json({ error: String(e?.message ?? e) }, { status: 500 });
    }
  },
};
