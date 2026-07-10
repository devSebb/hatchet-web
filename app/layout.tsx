import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";

import { BookDemoProvider } from "@/components/booking/BookDemoProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { defaultMetadata } from "@/lib/config/site";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${golosText.variable} h-full antialiased`}>
      <body className="font-body flex min-h-full flex-col">
        <BookDemoProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </BookDemoProvider>
      </body>
    </html>
  );
}
