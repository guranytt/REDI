import { Resend } from 'resend';
import { render } from '@react-email/components';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { UserOnboardingEmail } from '@/emails/UserOnboardingEmail';
import { VendorOnboardingEmail } from '@/emails/VendorOnboardingEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

export async function sendOrderConfirmation(
  to: string, 
  data: { orderId: string, customerName: string, items: any[], subtotal: number, deliveryFee: number, total: number, vendorName: string }
) {
  try {
    const htmlContent = await render(React.createElement(OrderConfirmationEmail, data));
    
    await resend.emails.send({
      from: 'REDI Orders <orders@redi.delivery>', // Use verified domain in prod
      to,
      subject: `Order Confirmed: #${data.orderId.slice(0, 8).toUpperCase()}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Order Confirmation Email Failed:", error);
    return { success: false, error };
  }
}

export async function sendUserOnboarding(to: string, customerName: string) {
  try {
    const htmlContent = await render(React.createElement(UserOnboardingEmail, { customerName }));
    
    await resend.emails.send({
      from: 'REDI Welcome <welcome@redi.delivery>',
      to,
      subject: 'Welcome to REDI! Let\'s get you something to eat.',
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("User Onboarding Email Failed:", error);
    return { success: false, error };
  }
}

export async function sendVendorOnboarding(to: string, vendorName: string) {
  try {
    const htmlContent = await render(React.createElement(VendorOnboardingEmail, { vendorName }));
    
    await resend.emails.send({
      from: 'REDI Merchants <merchants@redi.delivery>',
      to,
      subject: 'Welcome to REDI! Let\'s set up your store.',
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Vendor Onboarding Email Failed:", error);
    return { success: false, error };
  }
}
