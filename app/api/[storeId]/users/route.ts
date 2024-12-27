import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{
        const body = await req.json()
        const {name, email, password, number} = body;
        const hashedPassword = await bcrypt.hash(password, 10)


        if(!name){
            return new NextResponse("name is Required",{status: 400})
        }
        if(name.length<1)
        {
            return new NextResponse("name is Required",{status: 400})
        }if(!number){
            return new NextResponse("number is Required",{status: 400})
        }
        if(number.length<10)
        {
            return new NextResponse("number is Required of 10 digits",{status: 400})
        }

        if(password.length<6){
            return new NextResponse("password is Required to be more than 6 characters",{status: 400})
        }

        if(!email){
            return new NextResponse("email is Required",{status: 400})
        }
        if(!password){
            return new NextResponse("password is Required",{status: 400})
        }
        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const user = await prismadb.user.create({
            data: {
                name,
                number,
                email,
                password: hashedPassword,
                storeId: params.storeId,
            }
        })
        console.log(user)

    }catch (error) {
        console.log('USERS_POST',error)
        return new NextResponse("Internal error",{status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{

        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const users = await prismadb.user.findMany({where:{storeId:params.storeId,}})
        return NextResponse.json(users)
    }catch (error) {
        console.log('USERS_GET',error)
        return new NextResponse("Internal error",{status: 500})
    }
}