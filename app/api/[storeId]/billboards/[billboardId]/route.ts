import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { billboardId: string}},
){
    try {

        if(!params.billboardId){
            return new NextResponse("billboardId is required", {status:400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where:{
                id:params.billboardId,
            }

        })
        return NextResponse.json(billboard)
    }catch(error){console.log("[BillboardId_GET] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,billboardId: string}},
){
    try {
        const {userId} = await auth()
        const body = await req.json()

        const{label, imageUrl}= body


        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!label){
            return new NextResponse("label is required", {status:400})
        }
        if(!imageUrl){
            return new NextResponse("imageUrl is required", {status:400})
        }
        if(!params.billboardId){
            return new NextResponse("billboardId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const billboard = await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId,
},
            data:{
                label,
                imageUrl,
            }
        })
        return NextResponse.json(billboard)
    }catch(error){console.log("[BillboardId_PATCH] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, billboardId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.billboardId){
            return new NextResponse("billboardId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const billboard = await prismadb.billboard.deleteMany({
            where:{
                id:params.billboardId,
                }

        })
        return NextResponse.json(billboard)
    }catch(error){console.log("[BillboardId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


