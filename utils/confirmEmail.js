const nodemailer = require("nodemailer");

const confirmEmail = async (email, name, activationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const response = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Sandy Soft Account Activation for user ${name}`,
    html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">

    <h2>Hello, ${name}</h2>

    <p>Welcome to a space where work moves with intention.</p>

    <p>Your journey with Sandy Soft’s work management platform begins here. Before we unlock the full experience, please take a moment to verify your account.</p>

    <p style="margin: 30px 0;">
    <a href="${activationLink}" style="background-color: #0052cc; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
    Activate My Account
    </a>
    </p>

    <p>This small step opens the door to a more connected, thoughtful, and efficient way to manage what matters.</p>

    <p>If this wasn’t initiated by you, no action is needed.</p>

    <p>We’re glad you’re here. The possibilities start now.</p>

    <p><strong>Warm regards,</strong></p>
    <p><strong>The Sandy Soft Team</strong></p>
    <img src="https://yourdomain.com/images/logo.png" alt="Logo" style="width: 120px; height: auto; display: block; margin-bottom: 20px;" />

      <hr style="margin-top: 40px;" />
      <small style="color: #999;">If you received this message in error, you can safely disregard it.</small>
    </div>

    `,
  });
};

module.exports = confirmEmail;
