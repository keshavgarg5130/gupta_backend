import { verify } from "jsonwebtoken";
import { cookies } from "next/headers"; // for Next.js App Router

export async function GET () {
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
