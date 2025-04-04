import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });

    // Expire the cookie immediately
    response.cookies.set("token", "", {
        httpOnly: true,
        path: "/", // Ensure it clears across the app
        expires: new Date(0),
    });

    return response;
}