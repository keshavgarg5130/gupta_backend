import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET single order details
export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const order = await prismadb.order.findUnique({
            where: {
                id: params.orderId,
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDER_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}