import type { Metadata, Viewport } from "next";
import { Poppins, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Godavari Pushkaralu | గోదావరి పుష్కరాలు",
  description:
    "Smart Pilgrim Assistance System for Godavari Pushkaralu - Rajahmundry",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pushkaralu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f2847",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${notoTelugu.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <div className="app-container flex flex-col min-h-dvh bg-white">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
