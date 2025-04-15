import bcrypt from "bcryptjs";
import prismadb from "../../../../lib/prismadb";

export async function POST (req, res) {

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required" });
        }

        try {

            const user = await prismadb.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (user.email_otp !== otp) {
                return res.status(400).json({ error: "Invalid OTP" });
            }
            const now = new Date();
            if (now > new Date(user.email_otp_expiry)) {
                return res.status(400).json({ error: "OTP has expired" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prismadb.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    email_otp: null,
                    email_otp_expiry: null,
                    email_verified: true,
                },
            });

            return res.status(200).json({ message: "ok" });
        } catch (error) {
            console.error("Error resetting password", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

}
