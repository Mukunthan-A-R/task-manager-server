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
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Printwear Password Reset Request for ${name}`,
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset for ${name}</h2>
        <p>You’ve requested to reset your Printwear password.</p>
        <p>Click the button below to continue. This link will expire in 10 minutes.</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>Thanks,<br/>The Printwear Team</p>
        <img src="" alt="Sandy Soft Logo" style="width: 100px; margin-top: 20px;" />
        <hr style="margin-top: 40px;" />
        <small style="color: #999;">If you received this email by mistake, no further action is required.</small>
      </div>
    `,
  });
};

module.exports = sendPasswordResetEmail;
