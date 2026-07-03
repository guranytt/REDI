import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface UserOnboardingEmailProps {
  customerName: string;
}

export const UserOnboardingEmail = ({ customerName = "Foodie" }: UserOnboardingEmailProps) => {
  const previewText = `Welcome to REDI, ${customerName}! Let's get you something to eat.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>REDI</Heading>
          </Section>

          <Heading style={heading}>Welcome to REDI!</Heading>
          
          <Section style={card}>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              We are so excited to have you on board! With REDI, you now have the best local restaurants and super-fast delivery right at your fingertips.
            </Text>
            <Text style={paragraph}>
              Whether you're craving a late-night burger, fresh sushi, or a morning coffee, we've got you covered.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href="https://redi.com/browse">
                Find Food Near You
              </Button>
            </Section>
          </Section>

          <Text style={footer}>
            Need help? Reply to this email and our support team will get right back to you.
          </Text>
          <Text style={footerCopy}>
            © 2026 REDI Delivery. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default UserOnboardingEmail;

const main = {
  backgroundColor: '#f8f9fa',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const header = {
  padding: '24px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#f46919',
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'Sora, sans-serif',
  margin: '0',
};

const heading = {
  fontSize: '28px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: 'bold',
  color: '#111827',
  padding: '0 24px',
  fontFamily: 'Sora, sans-serif',
  textAlign: 'center' as const,
};

const card = {
  padding: '32px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  margin: '24px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const paragraph = {
  margin: '0 0 16px',
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#4b5563',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#f46919',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: '100%',
  padding: '16px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '24px',
  padding: '0 24px',
  textAlign: 'center' as const,
};

const footerCopy = {
  color: '#9ca3af',
  fontSize: '12px',
  padding: '0 24px',
  textAlign: 'center' as const,
  marginTop: '12px',
};
