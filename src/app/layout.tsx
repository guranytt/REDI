import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REDI | Food Delivery in Uyo",
  description:
    "Order from your favourite restaurants in Uyo, Akwa Ibom. Fast, fresh delivery from the best local spots.",
  keywords: "food delivery uyo, order food uyo, redi delivery, akwa ibom food delivery",
  openGraph: {
    title: "REDI | Food Delivery in Uyo",
    description: "Order from your favourite restaurants in Uyo, Akwa Ibom.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakarta.variable} ${playfair.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
