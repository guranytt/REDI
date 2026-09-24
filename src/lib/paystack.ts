export interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in kobo
  ref: string;
  onClose: () => void;
  callback: (response: { reference: string }) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack SDK"));
    document.body.appendChild(script);
  });
}

export async function payWithPaystack(
  options: Omit<PaystackOptions, 'key'>
): Promise<void> {
  await loadPaystackScript();
  
  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    ...options,
  });
  
  handler.openIframe();
}
