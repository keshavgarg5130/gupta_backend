import { NextResponse } from "next/server";

import prismadb from "../../../../../../lib/prismadb";
import {generateToken} from "../../../../../../lib/utils";

export async function GET(req ,{params}) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });


        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
                code,
            }),
        }).then(res => res.json());

        if (!tokenResponse.access_token) {
            return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
        }

        // Fetch User Info
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        console.log(userInfo);
        if (!userInfo.email) return NextResponse.json({ error: "User info retrieval failed. Try log-in via email" }, { status: 400 });

        let user = await prismadb.user.findUnique({
            where: { email: userInfo.email },
        });
        if (!user.googleId){
            await prismadb.user.update({
                where: { email: userInfo.email },
                data: {
                    googleId: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    verified_email: userInfo.verified_email,
                    storeId: params.storeId
                },
            })
        }
        // If new user, save to database
        if (!user) {
            user = await prismadb.user.create({
                data: {
                    googleId: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    verified_email: userInfo.verified_email,
                    storeId: params.storeId
                },
            });
        }

        // Generate JWT Token for session
        const token = generateToken(user)

        return new Response(null, {
            status: 302,
            headers: {
                "Location": "http://localhost:3000/",
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3000000; SameSite=None; Secure`
            }
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
