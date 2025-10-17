import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "NSR | Site Oficial",
  description: "Marca de roupas streetwear",
  keywords: ["streetwear", "moda", "roupas modernas", "NSR", "loja", "lookbook", "sobre", "artes", "contato"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
