const nodemailer = require("nodemailer");

const confirmEmail = async (email, name, resetUrl) => {
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
    subject: `Printwear Password Reset Request for ${name}`,
    html: `
<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://yourdomain.com/images/logo.png" alt="Logo" style="width: 120px; height: auto; display: block; margin-bottom: 20px;" />
  
  <h2>Welcome, ${name}!</h2>
  
  <p>Welcome to Done it. Unlock your potential with smarter workflows and enhanced productivity.</p>
  
  <p>Start exploring today!</p>

  <p>If you need help, we’re here.</p>

  <p>Best,</p>
  <p><strong>The Done it Team</strong></p>

  <hr style="margin-top: 40px;" />
  <small style="color: #999;">If this wasn’t you, feel free to disregard.</small>
</div>
    `,
  });
};

module.exports = confirmEmail;
