import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing email configuration...');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***hidden***' : 'NOT SET');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
    // Test sending an email
    transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'Test Email from Whisper Box',
      html: '<h1>Email Test Successful!</h1><p>Your SMTP configuration is working correctly.</p>'
    }, (error, info) => {
      if (error) {
        console.log('❌ Email Send Error:', error);
      } else {
        console.log('✅ Test email sent successfully:', info.messageId);
      }
      process.exit(0);
    });
  }
});
