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
            paymentMethod,
            userDetails,
            shippingDetails,
            gstDetails,
            cartItems,
            pricing,
        } = body;
        console.log(userEmail)
        const order = await prismadb.order.create({
            data: {
                storeId:params.storeId,
                userEmail:userEmail,
                shippingMethod,
                customOrderId,
                gstInvoice,
                paymentMethod,
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
                        price: Number(item.price),
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
        const adminMail = {
            from: process.env.SMTP_EMAIL,
            to: "guptaswitchgears@gmail.com",
            subject: `New Order Received - ${customOrderId}`,
            text: `
    ORDER DETAILS
    =============
    Order ID: ${customOrderId}
    Date: ${new Date().toLocaleString()}
    Customer Email: ${userEmail}
    
    CUSTOMER DETAILS
    ================
    Mobile: ${userDetails?.mobile || 'Not provided'}
    Alt Mobile: ${userDetails?.altMobile || 'Not provided'}
    
    SHIPPING DETAILS
    ================
    ${shippingDetails ? Object.entries(shippingDetails).map(([key, value]) =>
                `${key}: ${value}`).join('\n    ') : 'No shipping details provided'}
    
    GST DETAILS
    ==========
    ${gstDetails ? Object.entries(gstDetails).map(([key, value]) =>
                `${key}: ${value}`).join('\n    ') : 'No GST details provided'}
    
    ORDER SUMMARY
    ============
    Subtotal: ₹${pricing.amount}
    Tax: ₹${pricing.tax}
    Shipping: ₹${pricing.shipping}
    Payment: ${paymentMethod}
    Total: ₹${pricing.total}
    
    ITEMS ORDERED
    ============
    ${cartItems.map((item: CartItem) => `
    - ${item.name}
      Price: ₹${item.price}
      Qty: ${item.quantity}
      Product ID: ${item.productId}
    `).join('')}
    
    RAW DATA
    ========
    ${JSON.stringify(body, null, 2)}
  `,
            html: `
    <h1>New Order Received - ${customOrderId}</h1>
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong> ${customOrderId}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Customer Email:</strong> ${userEmail}</p>
    
    <h2>Customer Details</h2>
    <p><strong>Mobile:</strong> ${userDetails?.mobile || 'Not provided'}</p>
    <p><strong>Alt Mobile:</strong> ${userDetails?.altMobile || 'Not provided'}</p>
    
    <h2>Shipping Details</h2>
    ${shippingDetails ? `
      <ul>
        ${Object.entries(shippingDetails).map(([key, value]) =>
                `<li><strong>${key}:</strong> ${value}</li>`).join('')}
      </ul>
    ` : '<p>No shipping details provided</p>'}
    
    <h2>GST Details</h2>
    ${gstDetails ? `
      <ul>
        ${Object.entries(gstDetails).map(([key, value]) =>
                `<li><strong>${key}:</strong> ${value}</li>`).join('')}
      </ul>
    ` : '<p>No GST details provided</p>'}
    
    <h2>Order Summary</h2>
    <table border="1" cellpadding="5">
      <tr><th>Subtotal</th><td>₹${pricing.amount}</td></tr>
      <tr><th>Tax</th><td>₹${pricing.tax}</td></tr>
      <tr><th>Shipping</th><td>₹${pricing.shipping}</td></tr>
      <tr><th>Total</th><td>₹${pricing.total}</td></tr>
    </table>
    
    <h2>Items Ordered</h2>
    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Product ID</th>
        </tr>
      </thead>
      <tbody>
        ${cartItems.map((item: CartItem) => `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.productId}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <h2>Raw Data</h2>
    <pre>${JSON.stringify(body, null, 2)}</pre>
  `
        };

        await transporter.sendMail(customerMail);
        await transporter.sendMail(adminMail);
        return NextResponse.json({ success: true, orderId: order.customOrderId });
    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
    }
}
