// REGISTRATION HANDLER WITH AUTO-LOGIN
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import prismadb from "@/lib/prismadb";


// Registration Handler
export async function POST( req: Request,
                            {params} : {params:{storeId:string}} ) {
    try {
        const body = await req.json();
        const { name, email, password, number } = body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!name || name.length < 1) {
            return new Response(JSON.stringify({ error: "Name is required" }), {
                status: 400,
            });
        }
        if (!number || number.length < 10) {
            return new Response(JSON.stringify({ error: "Number is required and must be 10 digits" }), {
                status: 400,
            });
        }
        if (password.length < 6) {
            return new Response(JSON.stringify({ error: "Password must be at least 6 characters long" }), {
                status: 400,
            });
        }
        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
            });
        }
        if (!params.storeId) {
            return new Response(JSON.stringify({ error: "Store ID is required" }), {
                status: 400,
            });
        }

        const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId } });
        if (!storeByUserId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
            });
        }


        // Create a new user
        const user = await prismadb.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                storeId: params.storeId,
            },
        });

        // Generate a JWT token for auto-login
        const secret = process.env.JWT_SECRET || "default_secret";

        const token = jwt.sign(
            { id: user.id, email: user.email, storeId: user.storeId },
            secret,
            { expiresIn: "1h" }
        );

        const successResponse = new Response(JSON.stringify({
            message: "Registration successful and user logged in",
            token,
            user: { id: user.id, name: user.name, email: user.email },
        }), {
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`
            }
        });

        return successResponse;
    } catch (error) {
        console.log("USERS_POST", error);
        return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
        });
    }
}

// FETCH USERS HANDLER
export async function GET(req: Request,
                          {params} : {params:{storeId:string}}) {
    try {
        if (!params.storeId) {
            return new Response(JSON.stringify({ error: "Store ID is required" }), {
                status: 400 });
        }

        const users = await prismadb.user.findMany({ where: { storeId: params.storeId } });
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.log("USERS_GET", error);
        return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500 });
    }
}