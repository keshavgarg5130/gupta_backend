import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    {params} : {params:{storeId:string}}

){

   try {
        const productSlug = await prismadb.product.findMany({
            where:{
                storeId: params.storeId,
            },
            select:{
                slug:true,
            }

        })
        return NextResponse.json(productSlug)
    }catch(e){console.log("ProductSlug_GET Error: ]", e);
        return new NextResponse("internal Error", {status: 500})}

}
