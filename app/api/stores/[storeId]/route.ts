import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string}},
){
    try {
        const {userId} = await auth()
        const body = await req.json()

        const{name}= body


        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!name){
            return new NextResponse("name is required", {status:400})
        }
        if(!params.storeId){
            return new NextResponse("StoreId is required", {status:400})
        }
        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId,
                userId},
            data:{
                name
            }
        })
        return NextResponse.json(store)
    }catch(error){console.log("[StoreId_PATCH] Error: ]", error);
    return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.storeId){
            return new NextResponse("StoreId is required", {status:400})
        }
        const store = await prismadb.store.deleteMany({
            where:{
                id:params.storeId,
                userId}

        })
        return NextResponse.json(store)
    }catch(error){console.log("[StoreId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}



