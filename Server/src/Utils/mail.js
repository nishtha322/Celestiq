const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class Mail {

    async sendRegistrationOtp(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Celestiq Account",
            text: `Hello,

Your OTP for email verification is: ${otp}

This OTP is valid for 5 minutes.

If you did not create this account, please ignore this email.

Team Celestiq`,
        };

        await transporter.sendMail(mailOptions);
    }

    async sendForgotPasswordOtp(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Celestiq Password",
            text: `Hello,

Your OTP for password reset is: ${otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.

Team Celestiq`,
        };

        await transporter.sendMail(mailOptions);
    }
}

module.exports = new Mail();