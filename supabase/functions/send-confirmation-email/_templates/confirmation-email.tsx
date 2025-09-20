import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  confirmationUrl: string
  userEmail: string
  isRecovery?: boolean
}

export const ConfirmationEmail = ({
  confirmationUrl,
  userEmail,
  isRecovery = false,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {isRecovery 
        ? "Reset your password for Investment Funds Platform" 
        : "Confirm your email for Investment Funds Platform"
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>
            {isRecovery ? "Password Reset Request" : "Welcome to Investment Funds Platform"}
          </Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello,</Text>
          
          <Text style={text}>
            {isRecovery 
              ? "We received a request to reset your password for your Investment Funds Platform account."
              : "Thank you for signing up for Investment Funds Platform! To complete your account setup, please confirm your email address."
            }
          </Text>

          <Text style={text}>
            {isRecovery 
              ? "Click the button below to reset your password:" 
              : "Click the button below to confirm your email:"
            }
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={confirmationUrl}>
              {isRecovery ? "Reset My Password" : "Confirm Email Address"}
            </Button>
          </Section>

          <Text style={linkText}>
            Or copy and paste this link in your browser:
          </Text>
          <Link href={confirmationUrl} style={link}>
            {confirmationUrl}
          </Link>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>Security Notice:</strong> This {isRecovery ? "reset" : "confirmation"} link will expire in 1 hour. 
              If you didn't {isRecovery ? "request a password reset" : "create an account"}, 
              please ignore this email or contact support.
            </Text>
            
            <Text style={footerText}>
              Investment Funds Platform<br />
              This email was sent to {userEmail}
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const content = {
  padding: '0 24px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '0 auto',
  maxWidth: '200px',
}

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '16px 0 8px',
}

const link = {
  color: '#3b82f6',
  fontSize: '12px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  marginTop: '32px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '8px 0',
}