import { Inter, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beyond Rare | Empowering Rare Disease Communities",
  description: "A digital space designed by one rare disease patient for another to empower individuals through personalized patient forums, resources, and peer support.",
  openGraph: {
    title: "Beyond Rare",
    description: "Empowering people through connection, advocacy, and meaning.",
    url: "https://beyondrare.org",
    siteName: "Beyond Rare",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-gray-800">
        <AppProvider>
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
          <AuthModal />
          <AnalyticsTracker />
          <CookieConsent />
        </AppProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}


