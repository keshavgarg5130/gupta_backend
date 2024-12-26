import prismadb from "@/lib/prismadb";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("storeId is required", { status: 400 });
        }



        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                isArchived: false,
            },
            select: {
                id: true, // Only fetch the product ID
                category: {
                    select: {
                        id: true, // Fetch specific fields of related category
                        name: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                currentRating: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                poles:{
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("PRODUCTVariation_GET", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}