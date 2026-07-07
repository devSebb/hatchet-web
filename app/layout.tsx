import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { BookDemoProvider } from "@/components/booking/BookDemoProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { defaultMetadata } from "@/lib/config/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
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
