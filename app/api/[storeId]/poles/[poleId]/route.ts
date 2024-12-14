import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { poleId: string}},
){
    try {

        if(!params.poleId){
            return new NextResponse("currentRatingId is required", {status:400})
        }

        const poles = await prismadb.poles.findUnique({
            where:{
                id:params.poleId,
            }

        })
        return NextResponse.json(poles)
    }catch(error){console.log("[poleID_GET] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,poleId: string}},
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
        if(!params.poleId){
            return new NextResponse("poleId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const poles = await prismadb.poles.updateMany({
            where:{
                id:params.poleId,
},
            data:{
                name,
                value,
            }
        })
        return NextResponse.json(poles)
    }catch(error){console.log("[poleId_PATCH] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, poleId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.poleId){
            return new NextResponse("currentRatingId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const currentRating = await prismadb.poles.deleteMany({
            where:{
                id:params.poleId,
                }

        })
        return NextResponse.json(currentRating)
    }catch(error){console.log("[poleId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


