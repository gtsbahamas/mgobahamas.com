import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mobile Go Bahamas | Mobile Topup, Gift Cards & Bill Pay",
  description: "The Mobile Go app offers mobile topup for Aliv, BTC, Digicel, Natcom, digital gift cards, jail funds, and bill pay services in The Bahamas.",
  keywords: ["mobile topup", "bahamas", "gift cards", "bill pay", "aliv", "btc", "digicel", "natcom"],
  openGraph: {
    title: "Mobile Go Bahamas",
    description: "Mobile topup, digital gift cards, and bill pay services in The Bahamas",
    url: "https://www.mgobahamas.com",
    siteName: "Mobile Go Bahamas",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable}`}>
      <body className="antialiased">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
