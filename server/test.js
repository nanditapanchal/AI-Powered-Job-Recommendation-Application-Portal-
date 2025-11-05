import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"JobRec App" <${process.env.SMTP_USER}>`,
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Hello! This is a test email from JobRec App.',
    html: '<b>Hello! This is a test email from JobRec App.</b>'
  });

  console.log('✅ Test email sent!');
}

sendTestEmail().catch(console.error);
