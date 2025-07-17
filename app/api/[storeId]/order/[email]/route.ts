import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// GET all orders for a user
export async function GET(
    req: Request,
    { params }: { params: { userEmail: string } }
) {
    try {
        const orders = await prismadb.order.findMany({
            where: {
                userEmail: params.userEmail,
            },
            select: {
                id: true,
                customOrderId: true,
                createdAt: true,
                total: true,
                shippingMethod: true,
                PaymentMethod: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("[ORDERS_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}