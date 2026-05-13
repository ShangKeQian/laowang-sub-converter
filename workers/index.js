const jsonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
}

export default {
    async fetch(request) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: jsonHeaders })
        }

        const url = new URL(request.url)
        if (url.pathname === '/' || url.pathname === '/health') {
            return Response.json({
                status: 'ok',
                runtime: 'cloudflare-worker',
                note: 'Use the Node/Vercel runtime for full subscription conversion support.'
            }, { headers: jsonHeaders })
        }

        if (url.pathname === '/api/convert' || url.pathname === '/convert') {
            return Response.json({
                error: 'Cloudflare Worker conversion is disabled in this build',
                message: 'The full converter uses shared Node modules for protocol parsing and YAML/JSON output. Deploy with Vercel, Render, Docker, or the Node server for complete protocol support.'
            }, { status: 501, headers: jsonHeaders })
        }

        return Response.json({ error: 'Not found' }, { status: 404, headers: jsonHeaders })
    }
}
