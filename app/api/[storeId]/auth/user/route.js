import { verify } from 'jsonwebtoken';

export async function GET(req) {
    const allowedOrigins = ['http://localhost:3000', 'https://guptaswitchgears.com'];
    const origin = req.headers.get('origin') || '';

    const corsHeaders = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Vary': 'Origin',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return new Response(JSON.stringify({ user: null, authenticated: false }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            });
        }

        const decoded = verify(token, process.env.JWT_SECRET);

        return new Response(JSON.stringify({ user: decoded, authenticated: true }), {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('JWT verification failed:', error);
        return new Response(JSON.stringify({ user: null, authenticated: false }), {
            status: 401,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
        });
    }
}
