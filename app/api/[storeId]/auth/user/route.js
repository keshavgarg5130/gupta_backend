import { verify } from "jsonwebtoken";

export async function GET(req) {
    // Set CORS headers
    const origin = req.headers.get('origin') || '';
    const allowedOrigins = ['http://localhost:3000', 'https://guptaswitchgeasrs.com']; // You can add more
    const headers = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    };

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    // Get Authorization header
    const authHeader = req.headers.get('authorization');
    console.log("Authorization header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ user: null, authenticated: false }), { status: 401, headers });
    }

    const token = authHeader.split(' ')[1]; // Get token part

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        return new Response(JSON.stringify({ user: decoded, authenticated: true }), { status: 200, headers });
    } catch (error) {
        console.error('Error verifying token:', error);
        return new Response(JSON.stringify({ user: null, authenticated: false }), { status: 401, headers });
    }
}
