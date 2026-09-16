import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import InstallAppPrompt from "./components/InstallAppPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cabecalhos = await headers();

  const host = (cabecalhos.get("host") || "")
    .split(":")[0]
    .toLowerCase();

  const dominioTerapia =
    host === "adriafreitasterapeuta.com.br" ||
    host === "www.adriafreitasterapeuta.com.br";

  if (dominioTerapia) {
    return {
      title: {
        default: "Terapia em Dia",
        template: "%s | Terapia em Dia",
      },
      description:
        "Plataforma de acompanhamento terapêutico para pacientes e profissionais.",
      manifest: "/terapia-manifest.json?v=3",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Terapia em Dia",
      },
      icons: {
        icon: [
          {
            url: "/terapia-icon-192-v2.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            url: "/terapia-icon-512-v2.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        apple: "/terapia-icon-192-v2.png",
      },
    };
  }

  return {
    title: "Clube do Tarô",
    description: "Portal exclusivo para assinantes",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Clube do Tarô",
    },
    icons: {
      apple: "/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <InstallAppPrompt />
        {children}
      </body>
    </html>
  );
}
