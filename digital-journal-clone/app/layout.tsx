import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Journal",
  description: "Digital Journal Website",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}