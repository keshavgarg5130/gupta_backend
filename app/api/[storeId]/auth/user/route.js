import { verify } from "jsonwebtoken";
import { cookies } from "next/headers"; // <--- important

export async function GET(req) {
    const origin = req.headers.get('origin') || '';
    const allowedOrigins = ['http://localhost:3000', 'https://guptaswitchgears.com/'];
    const corsHeaders = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    const cookieStore = cookies(); // <--- get cookies
    const token = cookieStore.get('token')?.value; // <--- get token cookie
    console.log(token)

    if (!token) {
        return new Response(JSON.stringify({ user: null, authenticated: false }), { status: 401, headers : {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Set-Cookie': `token=${token}; Path=/; HttpOnly; Max-Age=3000000; SameSite=None; Secure`
            }});
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        return new Response(JSON.stringify({ user: decoded, authenticated: true }), { status: 200, headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Set-Cookie': `token=${token}; Path=/; HttpOnly; Max-Age=3000000; SameSite=None; Secure`
            } });
    } catch (error) {
        console.error('Error verifying token:', error);
        return new Response(JSON.stringify({ user: null, authenticated: false }), { status: 401, headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Set-Cookie': `token=${token}; Path=/; HttpOnly; Max-Age=3000000; SameSite=None; Secure`
            } });
    }
}