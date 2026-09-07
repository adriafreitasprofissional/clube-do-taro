import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default:
      "Terapia em Dia com Ádria Freitas",
    template:
      "%s | Terapia em Dia",
  },
  description:
    "Seu espaço de acompanhamento terapêutico com Ádria Freitas.",
  manifest:
    "/terapia-manifest.json",
  themeColor:
    "#8AA27A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Terapia em Dia",
  },
  icons: {
    icon: [
      {
        url: "/terapia-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/terapia-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple:
      "/terapia-icon-192.png",
  },
};

export default function TerapiaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
