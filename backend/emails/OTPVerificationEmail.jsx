import { 
  Html, 
  Head, 
  Body, 
  Container, 
  Section, 
  Text, 
  Heading, 
  Button,
  Hr 
} from '@react-email/components';

export default function OTPVerificationEmail({ 
  username, 
  otpCode, 
  expiryMinutes = 10 
}) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>🔐 Your Verification Code</Heading>
            <Text style={headerSubtitle}>Whisper Box Security</Text>
          </Section>
          
          <Section style={content}>
            <Text style={greeting}>Hello {username}!</Text>
            
            <Text style={message}>
              We received a request to verify your account. Please use the verification code below to complete your authentication:
            </Text>
            
            <Section style={otpContainer}>
              <Text style={otpCode}>{otpCode}</Text>
            </Section>
            
            <Text style={note}>
              This code will expire in <strong>{expiryMinutes} minutes</strong> for security reasons.
            </Text>
            
            <Text style={warning}>
              If you didn't request this code, please ignore this email or contact our support team.
            </Text>
            
            <Hr style={divider} />
            
            <Text style={footer}>
              Best regards,<br />
              The Whisper Box Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginTop: '30px',
  marginBottom: '30px',
  width: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
};

const header = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  padding: '40px 30px',
  textAlign: 'center',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '40px 30px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 24px 0',
};

const message = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 32px 0',
};

const otpContainer = {
  textAlign: 'center',
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
};

const otpCode = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#1d4ed8',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'Monaco, Menlo, "Courier New", monospace',
};

const note = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center',
  margin: '24px 0',
};

const warning = {
  fontSize: '14px',
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  margin: '24px 0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0',
};
