import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { brandId: string}},
){
    try {

        if(!params.brandId){
            return new NextResponse("brandId is required", {status:400})
        }

        const brand = await prismadb.brand.findUnique({
            where:{
                id:params.brandId,
            }

        })
        return NextResponse.json(brand)
    }catch(error){console.log("[brandId_GET] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,brandId: string}},
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
        if(!params.brandId){
            return new NextResponse("categoryId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const brand = await prismadb.brand.updateMany({
            where:{
                id:params.brandId,
},
            data:{
                name,
                billboardId,
            }
        })
        return NextResponse.json(brand)
    }catch(error){console.log("[brandId_PATCH] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, brandId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.brandId){
            return new NextResponse("brandId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const brand = await prismadb.brand.deleteMany({
            where:{
                id:params.brandId,
                }

        })
        return NextResponse.json(brand)
    }catch(error){console.log("[brandId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


