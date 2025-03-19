import ejs from "ejs";
import express from "express";
import path from "path";
import { transporter } from "../mail.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const sendOtp = async (toEmail) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const html = await ejs.renderFile(
            path.join(__dirname, "../views", "mail.ejs"), // Correct path
            { otp }
        );

        const mailOptions = {
            from: "ankushthakur2682@gmail.com",
            to: toEmail,
            subject: "Your OTP code",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("OTP sent: " + info.response);
        return otp;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

let otpStorage = {}; // Temporary storage for OTPs

// Generate and send OTP
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

        otpStorage[email] = { otp, expirationTime };

        // Send OTP via email
        const mailOptions = {
            from: 'ankushthakur2682@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

    const storedOtp = otpStorage[email];

    if (!storedOtp) {
        return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (storedOtp.expirationTime < Date.now()) {
        delete otpStorage[email];
        return res.status(400).json({ error: "OTP has expired" });
    }

    if (storedOtp.otp !== code) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, clear it
    delete otpStorage[email];
    res.status(200).json({ message: "OTP verified successfully" });
});

export { router };