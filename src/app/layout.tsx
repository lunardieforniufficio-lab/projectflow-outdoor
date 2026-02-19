import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { itIT } from "@clerk/localizations";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectFlow — Lunardi & Forni",
  description: "Gestionale cantieri Lunardi & Forni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={itIT}
      appearance={{
        variables: {
          colorPrimary: "#1B8C3A",
          colorBackground: "#111111",
          colorInputBackground: "#1a1a1a",
          colorText: "#e8e8e8",
          colorTextSecondary: "#888888",
          borderRadius: "8px",
        },
        elements: {
          card: {
            backgroundColor: "#111111",
            borderColor: "#222222",
          },
          formButtonPrimary: {
            backgroundColor: "#1B8C3A",
          },
        },
      }}
    >
      <html lang="it" className="dark">
        <body className={`${outfit.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
