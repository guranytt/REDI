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

interface VendorOnboardingEmailProps {
  vendorName: string;
}

export const VendorOnboardingEmail = ({ vendorName = "Partner" }: VendorOnboardingEmailProps) => {
  const previewText = `Welcome to REDI, ${vendorName}! Let's set up your digital storefront.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>REDI <span style={sublogo}>for Vendors</span></Heading>
          </Section>

          <Heading style={heading}>Let's grow your business.</Heading>
          
          <Section style={card}>
            <Text style={paragraph}>Welcome, {vendorName}!</Text>
            <Text style={paragraph}>
              We are thrilled to partner with you. By joining REDI, you're opening your doors to thousands of hungry customers in your city.
            </Text>
            
            <Section style={checklist}>
              <Text style={checklistTitle}>Next Steps for Success:</Text>
              <Text style={checklistItem}>✅ <strong>Upload your Menu:</strong> Add your best-selling dishes and vibrant photos.</Text>
              <Text style={checklistItem}>✅ <strong>Set your Hours:</strong> Let customers know when you're open for orders.</Text>
              <Text style={checklistItem}>✅ <strong>Connect Banking:</strong> Set up your payout details to receive earnings.</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href="https://redi.com/vendor">
                Go to Vendor Dashboard
              </Button>
            </Section>
          </Section>

          <Text style={footer}>
            Need help setting up your store? Contact our dedicated merchant support team at merchants@redi.com.
          </Text>
          <Text style={footerCopy}>
            © 2026 REDI Delivery. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VendorOnboardingEmail;

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
  color: '#111827',
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'Sora, sans-serif',
  margin: '0',
};

const sublogo = {
  color: '#f46919',
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

const checklist = {
  backgroundColor: '#fff7ed', // orange-50
  padding: '20px',
  borderRadius: '12px',
  marginTop: '24px',
  border: '1px solid #ffedd5', // orange-100
};

const checklistTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#c2410c', // orange-700
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const checklistItem = {
  fontSize: '15px',
  color: '#9a3412', // orange-800
  margin: '0 0 8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#111827',
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
