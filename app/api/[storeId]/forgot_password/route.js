
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

export async function POST (req, res) {
    try{
    if (req.method === "POST") {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        try {
            // Check if the user exists
            const user = await prismadb.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Generate a 6-digit OTP
            const otp = crypto.randomBytes(3).toString("hex").toUpperCase(); // Generate a 6-digit OTP
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 10); // OTP expires in 10 minutes

            // Store the OTP and expiry time
            await prismadb.user.update({
                where: { email },
                data: {
                    otp,
                    otpExpiry: expiry,
                },
            });

            // Send OTP to the user via email
            await sendOtpEmail(email, otp);

            return res.status(200).json({ message: "OTP sent to your email" });
        } catch (error) {
            console.error("Error sending OTP", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }}catch(error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });

    }
}
