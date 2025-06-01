const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Done it Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Instructions`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
        <h2>Hi ${name},</h2>
        <p>You requested to reset your password on <strong>Done it</strong>.</p>
        <p>Click the button below to proceed. This link will expire in <strong>10 minutes</strong>.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #007bff; padding: 12px 24px; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>— The Done it Team</p>
      </div>
    `,
  });
};

module.exports = sendPasswordResetEmail;
