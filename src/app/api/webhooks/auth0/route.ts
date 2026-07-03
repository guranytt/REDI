import { NextResponse } from 'next/server';
import { sendUserOnboarding, sendVendorOnboarding } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // Optional: Validate webhook secret here
    
    const body = await request.json();
    const { email, name, user_metadata } = body.user;
    
    const isVendor = user_metadata?.isVendor === true;

    if (isVendor) {
      await sendVendorOnboarding(email, name || "Partner");
    } else {
      await sendUserOnboarding(email, name || "Foodie");
    }

    return NextResponse.json({ success: true, message: 'Onboarding email sent' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
