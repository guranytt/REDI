import { Resend } from 'resend';

// Initialize Resend with the API key
// NOTE: Make sure to replace 're_xxxxxxxxx' with your real API key
// or better yet, use process.env.RESEND_API_KEY
const resend = new Resend('re_46WPkZQA_9X8CX5vsvVb6JxfWNVfquuqX');

export async function sendWelcomeEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'adminredidelivery@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
