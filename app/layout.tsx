import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Irisa AI | Early Detection, Lifelong Vision",
  description: "An Integrated Deep Learning Framework for Early Detection of Vision Disorders using fundus image analysis and advanced computer vision.",
  keywords: ["AI", "Medical Research", "Vision Disorders", "Deep Learning", "Irisa AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${outfit.variable} font-outfit antialiased selection:bg-brand-blue/30 selection:text-brand-blue`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

