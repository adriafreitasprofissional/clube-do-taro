"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CONTEUDOS: Record<
  string,
  {
    nome: string;
    audio: string;
    pdf: string;
  }
> = {
  evelyn: {
    nome: "Evelyn",
    audio:
      "https://drive.google.com/file/d/1Wx4oWQZX8zTUzvywcWnUe9ofxeqVy_6H/preview",
    pdf: "https://drive.google.com/file/d/18kJceaXvQNOlB_GgxX4Ah2f0xoH_LAIs/view",
  },
  bianca: {
    nome: "Bianca",
    audio: "https://drive.google.com/file/d/1rH2rxxj64LsZIbAcjDXwoCAgxlnBvmqy/preview",
    pdf: "https://drive.google.com/file/d/1wSENHfWAJu8szOIshu0tpFx0HcdoVtxs/view",
  },
  carolmorena: {
    nome: "Carol Morena",
    audio: "https://drive.google.com/file/d/1QRpWB6NSy78EIPhKw1LWp1hXANiguHrM/preview",
    pdf: "https://drive.google.com/file/d/1zntmmB7YREXRhHdBq1rJuiIY2gaNomHn/view",
  },
  carolruiva: {
    nome: "Carol Ruiva",
    audio: "https://drive.google.com/file/d/1JujrMkief5np5TWCJC9v7NPGNsCaJH8t/preview",
    pdf: "https://drive.google.com/file/d/1xa2757gj8cuvEfZCYhMWOxDDIOfp86Up/view",
  },
  claudinho: {
    nome: "Claudinho",
    audio: "https://drive.google.com/file/d/16KSkZ96o1G6AC4kevuJ2v39w4WHKTtkD/preview",
    pdf: "https://drive.google.com/file/d/1gYPQsoJEsQubWpxegDFzKJr4HqioZ2X1/view",
  },
  cris: {
    nome: "Cris",
    audio: "https://drive.google.com/file/d/1c3NBP069JYwQACl93iSKoy5JbX6qMY6t/preview",
    pdf: "https://drive.google.com/file/d/1y7Xtz6NmyxJ2I83Q614w5X8lNs0K2FGr/view",
  },
  dani: {
    nome: "Dani",
    audio: "https://drive.google.com/file/d/13e79xfIAFMivPVR7e3TLyrF4Fv_JM4Hx/preview",
    pdf: "https://drive.google.com/file/d/1qQxXH3jzCePK8lpMT_e2L-YqfEAs32ke/view",
  },
  dorinha: {
    nome: "Dorinha",
    audio: "https://drive.google.com/file/d/1khXIkV35Erh-xpH3VasuYFxDwu0XZV_C/preview",
    pdf: "https://drive.google.com/file/d/1JNEN8Q1K9UW02PUamxxFVbOWdq6jLUPu/view",
  },
  fefe: {
    nome: "Fefe",
    audio: "https://drive.google.com/file/d/11uW-sRd82Y7ri24u3iGw0w7-EAZ0OImd/preview",
    pdf: "https://drive.google.com/file/d/16ExZutoWCZjwb8sZL82R2TwM3pz5BO0T/view",
  },
  gabi: {
    nome: "Gabi",
    audio: "https://drive.google.com/file/d/11L1qVrs8C1_qUz6B32P44XdidzuVTfTS/preview",
    pdf: "https://drive.google.com/file/d/1sstnMOJRbhgC9Dgk-WTn4aUunFfOEqgr/view",
  },
  helena: {
    nome: "Helena",
    audio: "https://drive.google.com/file/d/1ai2HUFJdii1gzwtJaWeTIKQY5oUamjmw/preview",
    pdf: "https://drive.google.com/file/d/1svWxVxRJcgXWofGOczIYgVEj9_yI1Nyf/view",
  },
  lilian: {
    nome: "Lilian",
    audio: "https://drive.google.com/file/d/1XzM5c0qwoPqcQl3ijWuz7TiaS4iljpMM/preview",
    pdf: "https://drive.google.com/file/d/1hRGwtIP3lg6ODNBk_Of2uMx3RuYz4Fl0/view",
  },
  luana: {
    nome: "Luana",
    audio: "https://drive.google.com/file/d/1XzM5c0qwoPqcQl3ijWuz7TiaS4iljpMM/preview",
    pdf: "https://drive.google.com/file/d/1hRGwtIP3lg6ODNBk_Of2uMx3RuYz4Fl0/view",
  },
  natalia: {
    nome: "Natalia",
    audio: "https://drive.google.com/file/d/1oMTU4IPpMYR7-2GdhRC2IyaQBI7ZNovT/preview",
    pdf: "https://drive.google.com/file/d/1Nk-U3ZoGOWickUromyi0FY9sYChlNoWO/view",
  },
  neide: {
    nome: "Neide",
    audio: "https://drive.google.com/file/d/1Dbuvl2mJu6c7UdVoSVd5Mzqvuh-dX-QM/preview",
    pdf: "https://drive.google.com/file/d/1r6cS6F9goA6Oh_Ubgzji7BDbvOZlNdjV/view",
  },
  nathali: {
    nome: "Nathali",
    audio: "https://drive.google.com/file/d/1ayZOL6lCR2cwy1Ef2zC75m2X3FEd4l86/preview",
    pdf: "https://drive.google.com/file/d/1uCqB3YxkXj2IVQzOIU8RFWSkzdaS37CZ/view",
  },
  nena: {
    nome: "Nena",
    audio: "https://drive.google.com/file/d/10u-hDHeqmjvb6ItF2pxDV5RMqrKP0CtY/preview",
    pdf: "https://drive.google.com/file/d/1oRpKHoEgrumpCTud4nDTm0G9eRcSWskX/view",
  },
  rejiane: {
    nome: "Rejiane",
    audio: "https://drive.google.com/file/d/1zRX3Pjj7Z9O0lfIRRMlP0Di7jPpoZeLx/preview",
    pdf: "https://drive.google.com/file/d/1qOG0nHek9PN_BOZUCcRrV5YR2p1QCdSZ/view",
  },
  tamilly: {
    nome: "Tamilly",
    audio: "https://drive.google.com/file/d/1LTD7r-ZRCGxyE1Bvvfs8VHS_YiwkplUM/preview",
    pdf: "https://drive.google.com/file/d/14dm-Pafs-kmHpTvnwjdGlTGRProoqH_R/view",
  },
  vivi: {
    nome: "Vivi",
    audio: "https://drive.google.com/file/d/1uOY-k_nnB70wYdeyZMymlL4pn9x_gI0S/preview",
    pdf: "https://drive.google.com/file/d/1HS4_ceSClB5TUTic61qdVH7fL0w_GFsO/view",
  },
};

export default function PortalPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [cliente, setCliente] = useState<any>(null);
  const [audioAberto, setAudioAberto] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("club_clients")
        .select("nome, slug, plano, genero")
        .eq("slug", slug)
        .single();

      setCliente(data);
    }

    if (slug) load();
  }, [slug]);

  const conteudo = CONTEUDOS[slug];

  if (!cliente || !conteudo) {
    return <main style={{ padding: 40, color: "#fff" }}>Conteúdo não encontrado</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#1a001a", color: "#fff", padding: 40 }}>
      <h1>{conteudo.nome}</h1>

      <button onClick={() => setAudioAberto(true)}>
        Ouvir Direcionamento
      </button>

      <a href={conteudo.pdf} target="_blank">
        Baixar PDF
      </a>

      {audioAberto && (
        <div>
          <iframe
            src={conteudo.audio}
            width="100%"
            height="140"
            allow="autoplay"
          />
          <button onClick={() => setAudioAberto(false)}>Fechar</button>
        </div>
      )}
    </main>
  );
}