import bcrypt from "bcryptjs";
import prismadb from "@/lib/prismadb";
import { generateToken } from "@/lib/utils";

// Allowed origins
const allowedOrigins = ['https://guptaswitchgears.com'];

// Helper to get CORS headers based on origin
function getCorsHeaders(origin: string) {
    return {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Vary': 'Origin',
    };
}

// ✅ REGISTRATION / LOGIN HANDLER
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);

    // Handle preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || password.length < 6 || !params.storeId) {
            return new Response(JSON.stringify({ error: "Invalid input" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const existingUser = await prismadb.user.findUnique({
            where: { storeId: params.storeId, email },
        });

        if (existingUser) {
            // @ts-expect-error/naa
            const isMatched = await bcrypt.compare(password, existingUser.password);
            if (isMatched) {
                const token = generateToken(existingUser);
                return new Response(JSON.stringify({
                    message: "User logged in",
                    token,
                    user: { id: existingUser.id, name: existingUser.name, email: existingUser.email },
                }), {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                        "Set-Cookie": `token=${token}; Path=/; HttpOnly; Max-Age=3000000; SameSite=None; Secure`
                    },
                });
            }

            return new Response(JSON.stringify({ error: "Invalid password" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const storeByUserId = await prismadb.store.findFirst({ where: { id: params.storeId } });
        if (!storeByUserId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismadb.user.create({
            data: { email, password: hashedPassword, storeId: params.storeId },
        });

        const token = generateToken(user);

        return new Response(JSON.stringify({
            message: "Registration successful and user logged in",
            token,
            user: { id: user.id, name: user.name, email: user.email },
        }), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Set-Cookie": `token=${token}; Path=/; HttpOnly; Max-Age=3000000; SameSite=None; Secure`
            },
        });

    } catch (error) {
        console.log("SIGNUP_EMAIL_POST", error);
        return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}


// ✅ USERS FETCH HANDLER
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);

    // Handle preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        if (!params.storeId) {
            return new Response(JSON.stringify({ error: "Store ID is required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const users = await prismadb.user.findMany({ where: { storeId: params.storeId } });
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log("USERS_GET", error);
        return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
