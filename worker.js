const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    // Reenvía directo: worker.dev/players?... → pred.gg/api/v1/players?...
    const predUrl = 'https://pred.gg/api/v1' + url.pathname + url.search;

    console.log('→ pred.gg:', predUrl);

    try {
      const predRes = await fetch(predUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://pred.gg/',
          'Origin': 'https://pred.gg',
        },
      });

      const body = await predRes.text();
      return new Response(body, {
        status: predRes.status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
