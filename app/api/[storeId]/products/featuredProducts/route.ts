import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{



        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const products = await prismadb.product.findMany({where:
                {storeId: params.storeId,
                    isFeatured: true,
                    isArchived: false
                },
            include:{
                images: true,
                category: true,
                currentRating: true,
                poles: true,
                brand: true,
            },
            orderBy:{
                createdAt: 'desc'
            }})
        return NextResponse.json(products)
    }catch (error) {
        console.log('PRODUCTS_GET',error)
        return new NextResponse("Internal error",{status: 500})
    }
}