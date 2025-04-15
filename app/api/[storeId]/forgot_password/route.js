
import nodemailer from "nodemailer";
import crypto from "crypto";
import prismadb from "../../../../lib/prismadb";

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};
export async function POST(request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 })
        }

        const user = await prismadb.user.findUnique({
            where: { email },
        })

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
        }

        const otp = crypto.randomBytes(3).toString("hex").toUpperCase()
        const expiry = new Date()
        expiry.setMinutes(expiry.getMinutes() + 10)

        await prismadb.user.update({
            where: { email },
            data: {
                otp,
                otpExpiry: expiry,
            },
        })

        await sendOtpEmail(email, otp)

        return new Response(JSON.stringify({ message: "OTP sent to your email" }), { status: 200 })
    } catch (error) {
        console.error("Forgot Password Error:", error)
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
    }
}
