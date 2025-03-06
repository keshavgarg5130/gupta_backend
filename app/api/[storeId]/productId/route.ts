import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    {params} : {params:{storeId:string}}

){

   try {
        const productId = await prismadb.product.findMany({
            where:{
                storeId: params.storeId,
            },
            select:{
                id:true,
            }

        })
        return NextResponse.json(productId)
    }catch(e){console.log("ProductId_GET Error: ]", e);
        return new NextResponse("internal Error", {status: 500})}

}
