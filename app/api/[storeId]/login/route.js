import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prismadb from "../../../../lib/prismadb";
 // Prisma client setup

export async function POST(req, { params }) {
    const { storeId } = params; // Get the storeId from the route parameter

    if (!storeId) {
        return new Response(JSON.stringify({ error: "Store ID is required" }), {
            status: 400,
        });
    }

    try {
        const body = await req.json(); // Parse request body
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
                status: 400,
            });
        }

        // Check if the user exists
        const user = await prismadb.user.findFirst({
            where: {
                email,
                storeId, // Ensure the user is associated with the given storeId
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
            });
        }

        // Verify the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, storeId: user.storeId },
            process.env.JWT_SECRET,

        );

        return new Response(
            JSON.stringify({
                message: "Login successful",
                token,
                user: { id: user.id, name: user.name, email: user.email },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
