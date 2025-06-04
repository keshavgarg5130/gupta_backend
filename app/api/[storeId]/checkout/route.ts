import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req: Request,
                           {params} : {params:{storeId:string}}) {
    try {
        const body = await req.json();
        const orderCount = await prismadb.order.count();
        const padded = String(orderCount + 1).padStart(4, "0");

        const customOrderId = `GS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${padded}`;

        type CartItem = {
            productId: string;
            name: string;
            image: string;
            price: number;
            quantity: number;
        };
        const {
            userEmail,
            shippingMethod,
            gstInvoice,
            userDetails,
            shippingDetails,
            gstDetails,
            cartItems,
            pricing,
        } = body;

        const order = await prismadb.order.create({
            data: {
                storeId:params.storeId,
                userEmail:userEmail,
                shippingMethod,
                customOrderId,
                gstInvoice,
                mobile: userDetails.mobile,
                altMobile: userDetails.altMobile,
                ...shippingDetails,
                ...gstDetails,
                amount: parseFloat(pricing.amount),
                tax: parseFloat(pricing.tax),
                shipping: parseFloat(pricing.shipping),
                total: parseFloat(pricing.total),
                items: {
                    create: cartItems.map((item: CartItem) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity,

                    })),
                },
            },
        });
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const customerMail = {
            from: process.env.SMTP_EMAIL,
            to: userEmail,
            subject: "Order received successfully ",
            text: `Thanks for placing your order. Your order no, is ${customOrderId}
             We will send you detailed email with order invoice and delivery details once the payment is verified 
             You can call or whatsapp on (+91 88828 69662) for enquiry or tracking the order status
             or mail at (guptaswitchgears@gmail.com)`,
        };
        const adminMail = {from: process.env.SMTP_EMAIL,
            to: "guptaswitchgears@gmail.com",
            subject: "New Order received",
            text: `order no, is ${customOrderId}
             customer details are${body},`}

        await transporter.sendMail(customerMail);
        await transporter.sendMail(adminMail);
        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
    }
}
