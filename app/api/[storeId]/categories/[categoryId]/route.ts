import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { categoryId: string}},
){
    try {

        if(!params.categoryId){
            return new NextResponse("billboardId is required", {status:400})
        }

        const category = await prismadb.category.findUnique({
            where:{
                id:params.categoryId,
            }

        })
        return NextResponse.json(category)
    }catch(error){console.log("[categoryId_GET] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,categoryId: string}},
){
    try {
        const {userId} = await auth()
        const body = await req.json()

        const{name, billboardId}= body


        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!name){
            return new NextResponse("name is required", {status:400})
        }
        if(!billboardId){
            return new NextResponse("billboardId is required", {status:400})
        }
        if(!params.categoryId){
            return new NextResponse("categoryId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const category = await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
},
            data:{
                name,
                billboardId,
            }
        })
        return NextResponse.json(category)
    }catch(error){console.log("[CategoryId_PATCH] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, categoryId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.categoryId){
            return new NextResponse("categoryId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const category = await prismadb.category.deleteMany({
            where:{
                id:params.categoryId,
                }

        })
        return NextResponse.json(category)
    }catch(error){console.log("[CATEGORYId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


