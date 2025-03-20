import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { productSlug?: string } }
) {
    try {
        const { productSlug } = params;

        if ( !productSlug) {
            return new NextResponse("productId or productSlug is required", { status: 400 });
        }

        const product = await prismadb.product.findFirst({
            where:
                    { slug: productSlug },
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
        console.error("[ProductSlug_GET] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
