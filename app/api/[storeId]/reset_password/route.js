import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required" }, { status: 400 }
            );
        }

        const user = await prismadb.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.email_otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        const now = new Date();
        if (user.email_otp_exp && now > new Date(user.email_otp_exp)) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prismadb.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                email_otp: null,
                email_otp_exp: null,
                verified_email: true,
            },
        });

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
