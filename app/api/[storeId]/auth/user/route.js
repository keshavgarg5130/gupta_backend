import { verify } from "jsonwebtoken";
import { cookies } from "next/headers"; // for Next.js App Router

export async function GET (req,res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value; // Assuming "token" is the cookie name

    if (!token) {
        return Response.json({ user: null, authenticated: false }, { status: 401 });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        return Response.json({ user: decoded, authenticated: true }, { status: 200 });
    } catch (e) {
        console.error("Error verifying token:", e);
        return Response.json({ user: null, authenticated: false }, { status: 401 });
    }
}
