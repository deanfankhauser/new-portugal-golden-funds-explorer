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

interface WelcomeEmailProps {
  userEmail: string
  loginUrl: string
}

export const WelcomeEmail = ({
  userEmail,
  loginUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Investment Funds Platform - Start exploring investment opportunities</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Welcome to Investment Funds Platform! 🎉</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Hello and welcome!</Text>
          
          <Text style={text}>
            Congratulations! Your email has been confirmed and your Investment Funds Platform account is now active. 
            You're all set to explore our comprehensive database of investment funds and discover opportunities 
            that match your investment goals.
          </Text>

          <Section style={featuresSection}>
            <Heading style={h2}>What you can do now:</Heading>
            <Text style={featureText}>• Browse and compare hundreds of investment funds</Text>
            <Text style={featureText}>• Use advanced filters to find funds that match your criteria</Text>
            <Text style={featureText}>• Save and track your favorite investment opportunities</Text>
            <Text style={featureText}>• Access detailed fund information and performance data</Text>
            <Text style={featureText}>• Connect with fund managers directly</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Start Exploring Funds
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={tipsSection}>
            <Heading style={h3}>Pro Tips for Getting Started:</Heading>
            <Text style={text}>
              1. <strong>Complete your profile</strong> - Add your investment preferences to get personalized recommendations
            </Text>
            <Text style={text}>
              2. <strong>Use the fund comparison tool</strong> - Compare multiple funds side-by-side to make informed decisions
            </Text>
            <Text style={text}>
              3. <strong>Set up alerts</strong> - Get notified when new funds matching your criteria are added
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Need help getting started? Our support team is here to assist you. 
              Simply reply to this email or visit our help center.
            </Text>
            
            <Text style={footerText}>
              Best regards,<br />
              The Investment Funds Platform Team
            </Text>
            
            <Text style={footerText}>
              This email was sent to {userEmail}
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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
  backgroundColor: '#f8fafc',
}

const content = {
  padding: '0 24px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px 0',
}

const h3 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 12px 0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const featuresSection = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
}

const featureText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '8px 0',
}

const tipsSection = {
  backgroundColor: '#fef3c7',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 28px',
  margin: '0 auto',
  maxWidth: '220px',
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
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '12px 0',
}
