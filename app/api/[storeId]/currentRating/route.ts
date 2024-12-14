import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{

        const authData = await auth();
        const { userId } = authData ;


        const body = await req.json()
        const {name, value} = body;


        if(!userId){
            return new NextResponse("Unauthenticated",{status: 401})
        }
        if(!name){
            return new NextResponse("name is Required",{status: 400})
        }
        if(!value){
            return new NextResponse("BillboardId is Required",{status: 400})
        }
        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
            userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const currentRating = await prismadb.currentRating.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            }
        })
        return NextResponse.json(currentRating)
    }catch (error) {
        console.log('CURRENT_RATING_POST',error)
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
        const currentRating = await prismadb.category.findMany({where:{storeId:params.storeId,}})
        return NextResponse.json(currentRating)
    }catch (error) {
        console.log('CURRENT_RATING_GET',error)
        return new NextResponse("Internal error",{status: 500})
    }
}