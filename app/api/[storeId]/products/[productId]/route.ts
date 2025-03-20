import {auth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { productId?: string; productSlug?: string } }
) {
    try {
        const { productId, productSlug } = params;

        if (!productId && !productSlug) {
            return new NextResponse("productId or productSlug is required", { status: 400 });
        }

        const product = await prismadb.product.findFirst({
            where: {
                OR: [
                    { id: productId },
                    { slug: productSlug }
                ]
            },
            include: {
                images: true,
                category: true,
                currentRating: true,
                poles: true,
                brand: true,
            }
        });

        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[ProductId_GET] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string,productId: string}},
){
    try {
        const {userId} = await auth()
        const body = await req.json()

        const{ name, images, mPrice, price, gstRate,description, categoryId,brandId, currentRatingId, polesId, isFeatured, isArchived}= body


        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!name){
            return new NextResponse("name is Required",{status: 400})
        }
        if(!images || !images.length){
            return new NextResponse("image is Required",{status: 400})
        }
        if(!mPrice){
            return new NextResponse("mPrice is Required",{status: 400})
        }if(!price){
            return new NextResponse("price is Required",{status: 400})
        }
        if(!gstRate){
            return new NextResponse("gstRate is Required",{status: 400})
        }if(!description){
            return new NextResponse("description is Required",{status: 400})
        }
        if(!categoryId){
            return new NextResponse("CategoryId is Required",{status: 400})
        }
        if(!params.productId){
            return new NextResponse("productSlug is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        await prismadb.product.update({
            where:{
                id:params.productId,
},
            data: {
                name,
                mPrice,
                price,
                gstRate,
                categoryId,
                brandId,
                currentRatingId,
                polesId,
                isFeatured,
                description,
                isArchived,
                images: {
                    deleteMany: {}
                }
            }
        })
        const product = await prismadb.product.update({
            where:{
                id:params.productId,
            },
            data: {
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url: string}) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch(error){console.log("[ProductId_Patch] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string, productId: string}},
){
    try {
        const {userId} = await auth()



        if(!userId){
            return new NextResponse("unauthorized user", {status:401})
        }
        if(!params.productId){
            return new NextResponse("billboardId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
                userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const product = await prismadb.product.deleteMany({
            where:{
                id:params.productId,
                }

        })
        return NextResponse.json(product)
    }catch(error){console.log("[ProductId_DELETE] Error: ]", error);
        return new NextResponse("internal Error", {status: 500})}

}


