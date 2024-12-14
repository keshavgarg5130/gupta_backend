import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { currentRatingId: string}},
){
    try {

        if(!params.currentRatingId){
            return new NextResponse("currentRatingId is required", {status:400})
        }

        const currentRating = await prismadb.currentRating.findUnique({
            where:{
                id:params.currentRatingId,
            }

        })
        return NextResponse.json(currentRating)
    }catch(error){console.log("[currentRatingID_GET] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,currentRatingId: string}},
){
    try {
        const {userId} = await auth()
        const body = await req.json()

        const{name, value}= body


        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!name){
            return new NextResponse("name is required", {status:400})
        }
        if(!value){
            return new NextResponse("billboardId is required", {status:400})
        }
        if(!params.currentRatingId){
            return new NextResponse("categoryId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const currentRating = await prismadb.currentRating.updateMany({
            where:{
                id:params.currentRatingId,
},
            data:{
                name,
                value,
            }
        })
        return NextResponse.json(currentRating)
    }catch(error){console.log("[currentRatingId_PATCH] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, currentRatingId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.currentRatingId){
            return new NextResponse("currentRatingId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const currentRating = await prismadb.currentRating.deleteMany({
            where:{
                id:params.currentRatingId,
                }

        })
        return NextResponse.json(currentRating)
    }catch(error){console.log("[currentRatingId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


