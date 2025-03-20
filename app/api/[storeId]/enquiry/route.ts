import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer';


// Sample credentials (in a real scenario, these would be environment variables)
const SMTP_HOST = 'smtp.gmail.com'
const SMTP_PORT = 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const fullName = formData.get('fullName') as string
        const email = formData.get('email') as string
        const mobile = formData.get('mobile') as string
        const productDetails = formData.get('productDetails') as string
        const productList = formData.get('productList') as File | null

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false, // Use TLS
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
        })

        // Prepare email content
        const mailOptions = {
            from: SMTP_USER,
            to: 'sales@guptaswitchgears.com',
            cc: 'ashish@guptaswitchgears.com, guptaswitchgears@gmail.com',
            subject: 'New Quotation Request',
            text: `
        New quotation request from:
        
        Full Name: ${fullName}
        Email: ${email}
        Mobile/WhatsApp: ${mobile}
        
        Product Details:
        ${productDetails}
      `,
            attachments: productList ? [
                {
                    filename: productList.name,
                    content: Buffer.from(await productList.arrayBuffer()),
                },
            ] : [],
        }

        // Send the email
        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true, message: 'Quotation request sent successfully!' })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send quotation request. Please try again.' },
            { status: 500 }
        )
    }
}

