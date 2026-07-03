import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  vendorName: string;
}

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  items,
  subtotal,
  deliveryFee,
  total,
  vendorName,
}: OrderConfirmationEmailProps) => {
  const previewText = `Your order from ${vendorName} is confirmed!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>REDI</Heading>
          </Section>

          <Heading style={heading}>Order Confirmed</Heading>
          <Text style={paragraph}>Hi {customerName},</Text>
          <Text style={paragraph}>
            Your order <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> from <strong>{vendorName}</strong> has been received and is currently being prepared!
          </Text>

          <Section style={orderTable}>
            <Text style={sectionTitle}>Order Summary</Text>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={itemName}>{item.quantity}x {item.name}</Text>
                <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
              </div>
            ))}
            
            <Hr style={hr} />
            
            <div style={itemRow}>
              <Text style={summaryLabel}>Subtotal</Text>
              <Text style={summaryValue}>${subtotal.toFixed(2)}</Text>
            </div>
            <div style={itemRow}>
              <Text style={summaryLabel}>Delivery Fee</Text>
              <Text style={summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </div>
            
            <Hr style={hr} />
            
            <div style={itemRow}>
              <Text style={totalLabel}>Total</Text>
              <Text style={totalValue}>${total.toFixed(2)}</Text>
            </div>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href="https://redi.com/profile">
              Track Order
            </Button>
          </Section>

          <Text style={footer}>
            If you have any questions, please reply to this email. We're here to help!
          </Text>
          <Text style={footerCopy}>
            © 2026 REDI Delivery. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

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
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: 'bold',
  color: '#111827',
  padding: '0 24px',
  fontFamily: 'Sora, sans-serif',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#374151',
  padding: '0 24px',
};

const orderTable = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '24px',
  border: '1px solid #e5e7eb',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const itemRow = {
  display: 'table',
  width: '100%',
  marginBottom: '8px',
};

const itemName = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#374151',
};

const itemPrice = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#111827',
  fontWeight: 'bold',
  textAlign: 'right' as const,
};

const summaryLabel = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#6b7280',
};

const summaryValue = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#374151',
  textAlign: 'right' as const,
};

const totalLabel = {
  display: 'table-cell',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
};

const totalValue = {
  display: 'table-cell',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#f46919',
  textAlign: 'right' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const buttonContainer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#f46919',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
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
