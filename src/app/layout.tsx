import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Monyx | Finanças Simples",
  description: "Organize suas receitas e despesas com inteligência e gráficos interativos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-background text-foreground antialiased md:flex h-screen overflow-hidden">
        <AppProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AppProvider>
      </body>
    </html>
  );
}
