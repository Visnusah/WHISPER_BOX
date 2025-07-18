// HTML template for OTP verification email
const OTPVerificationEmail = ({ otp, userName }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f7;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .greeting {
          font-size: 18px;
          color: #374151;
          margin-bottom: 30px;
        }
        .message {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .otp-container {
          background-color: #f8fafc;
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
        }
        .otp-code {
          font-family: 'Courier New', monospace;
          font-size: 48px;
          font-weight: bold;
          color: #1e40af;
          letter-spacing: 8px;
          margin: 0;
        }
        .otp-label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          color: #92400e;
          font-size: 14px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Verification Code</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${userName || 'there'}! 👋
          </div>
          
          <div class="message">
            You've requested to log in to your Whisper Box account. Please use the verification code below to complete your login:
          </div>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <div class="otp-label">Verification Code</div>
          </div>
          
          <div class="warning">
            ⚠️ This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </div>
          
          <div class="message">
            For your security, never share this code with anyone. Whisper Box staff will never ask for your verification code.
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Whisper Box. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default OTPVerificationEmail;
