import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { LocaleProvider } from "@/lib/locale-context";

export const metadata: Metadata = {
  title: "Sakura Forecast",
  description: "日本全国の桜開花状況マップ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFB7C5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">
        <LocaleProvider>
          {children}
          <BottomNav />
        </LocaleProvider>
      </body>
    </html>
  );
}
