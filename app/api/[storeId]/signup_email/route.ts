// REGISTRATION HANDLER WITH AUTO-LOGIN
import bcrypt from "bcryptjs";
import prismadb from "@/lib/prismadb";
import {generateToken} from "@/lib/utils";


// Registration Handler
export async function POST(req: Request,
                           {params}: {params: {storeId: string}}) {
    try {
        const body = await req.json();
        const { email, password} = body;
        const existingUser = await prismadb.user.findUnique({
            where: {
                storeId: params.storeId,
                email: email
            }
        })

        const hashedPassword = await bcrypt.hash(password, 10);
        if(existingUser){
            console.log(hashedPassword);
            try{
                //@ts-expect-error/naa
                const isMatched = await bcrypt.compare(password, existingUser.password );
                if(isMatched){

                const token = generateToken(existingUser)
                return new Response(JSON.stringify({
                    message: "User logged in",
                    token,
                    user: {id: existingUser.id, name: existingUser.name, email: existingUser.email},
                }), {
                    headers: {
                        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3000000`
                    }
                });

            }
                return new Response(JSON.stringify({
                    error: "Invalid password",
                }),{
                    status:400
                })}catch (error) {
                console.log("LOGIN_POST", error);
                return new Response(JSON.stringify({ error: "Internal error" }), {
                    status: 500 });
            }
        }

        if (password.length < 6) {
            return new Response(JSON.stringify({error: "Password must be at least 6 characters long"}), {
                status: 400,
            });
        }
        if (!email) {
            return new Response(JSON.stringify({error: "Email is required"}), {
                status: 400,
            });
        }
        if (!params.storeId) {
            return new Response(JSON.stringify({error: "Store ID is required"}), {
                status: 400,
            });
        }

        const storeByUserId = await prismadb.store.findFirst({where: {id: params.storeId}});
        if (!storeByUserId) {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 403,
            });
        }


        // Create a new user
        const user = await prismadb.user.create({
            data: {
                email,
                password: hashedPassword,
                storeId: params.storeId,
            },
        });

        // Generate a JWT token for auto-login_email

        const token = generateToken(user)

        return new Response(JSON.stringify({
            message: "Registration successful and user logged in",
            token,
            user: {id: user.id, name: user.name, email: user.email},
        }), {
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3000000`
            }
        });
    } catch (error) {
        console.log("SIGNUP_EMAIL_POST", error);
        return new Response(JSON.stringify({error: "Internal error"}), {
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