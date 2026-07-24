"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";


const PLANILHA_CONTEUDOS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr7qra9Jsh2IO6vDO_8vVxe-8lkf9zbFeuDPtw5Wny7zHUKIhVa7lIqqshLo_4JbRDUhWjv0sb_5y3/pub?gid=0&single=true&output=csv";

type ConteudoPlanilha = {
  slug: string;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  titulo: string;
  drive_file: string;
  ativo: string;
};

function lerCsv(linha: string) {
  const colunas: string[] = [];
  let atual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];

    if (caractere === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (caractere === "," && !dentroDeAspas) {
      colunas.push(atual.trim().replace(/^"|"$/g, ""));
      atual = "";
    } else {
      atual += caractere;
    }
  }

  colunas.push(atual.trim().replace(/^"|"$/g, ""));
  return colunas;
}
function linkDrive(valor: string, tipo: string) {
  if (!valor) return "";

  const valorLimpo = valor.trim();

  const idEncontrado = valorLimpo.startsWith("http")
    ? valorLimpo.match(/\/d\/([^/]+)/)?.[1]
    : valorLimpo;

  if (!idEncontrado) return "";

  const ehAudio =
    tipo === "audio_individual" || tipo === "audio_geral";

  return ehAudio
    ? `https://drive.google.com/file/d/${idEncontrado}/preview`
    : `https://drive.google.com/file/d/${idEncontrado}/view`;
}

export default function PortalPremium() {
  const params = useParams();
  const slug = params.slug as string;

  const [audioAberto, setAudioAberto] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
const [mesAberto, setMesAberto] = useState<string | null>(null);
  const [direcionamentoAberto, setDirecionamentoAberto] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [conteudosPlanilha, setConteudosPlanilha] = useState<ConteudoPlanilha[]>([]);
const [carregandoConteudos, setCarregandoConteudos] = useState(true);
  
useEffect(() => {
    async function carregarCliente() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("club_clients")
          .select("plano, nome, slug")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw new Error(error.message);

       if (data) {

  setNome(
    data.slug.charAt(0).toUpperCase() + data.slug.slice(1)
  );

  setPlano(data.plano || "");

}
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados do cliente.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) carregarCliente();
  }, [slug]);

  useEffect(() => {
    async function carregarConteudosDaPlanilha() {
      try {
        const resposta = await fetch(PLANILHA_CONTEUDOS_CSV, {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar a planilha de conteúdos.");
        }

        const texto = await resposta.text();
        const linhas = texto
          .split(/\r?\n/)
          .map((linha) => linha.trim())
          .filter(Boolean);

        const cabecalho = lerCsv(linhas[0]).map((item) =>
          item.toLowerCase().trim()
        );

        const conteudos = linhas.slice(1).map((linha) => {
          const valores = lerCsv(linha);
          const item: Record<string, string> = {};

          cabecalho.forEach((coluna, indice) => {
            item[coluna] = valores[indice] || "";
          });

          return {
            slug: (item.slug || "").toLowerCase().trim(),
            ano: (item.ano || "").trim(),
            mes: (item.mes || "").toLowerCase().trim(),
            semana: (item.semana || "").trim(),
            tipo: (item.tipo || "").toLowerCase().trim(),
            titulo: (item.titulo || "").trim(),
            drive_file: (item.drive_file || "").trim(),
            ativo: (item.ativo || "").toLowerCase().trim(),
          };
        });

        setConteudosPlanilha(conteudos);
      } catch (err) {
        console.error("Erro ao carregar planilha:", err);
      } finally {
        setCarregandoConteudos(false);
      }
    }

    carregarConteudosDaPlanilha();
  }, []);
  
  const meses = [
  ...new Set(
    conteudosPlanilha
      .filter(
        (item) =>
          item.slug === slug &&
          item.ano === "2026" &&
          item.ativo === "sim"
      )
      
      .map((item) => item.mes)
  ),
].sort((a, b) => {
  const ordem = [
    "janeiro",
    "fevereiro",
    "março",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  return ordem.indexOf(a) - ordem.indexOf(b);
});

function conteudosDoMes(mes: string) {
  return conteudosPlanilha.filter(
    (item) =>
      item.slug === slug &&
      item.ano === "2026" &&
      item.mes === mes &&
      item.ativo === "sim"
  );
}
function buscarConteudo(
  mes: string,
  semana: string,
  tipo: string
) {
  return conteudosPlanilha.find(
    (item) =>
      item.slug === slug &&
      item.ano === "2026" &&
      item.mes === mes &&
      item.semana === semana &&
      item.tipo === tipo &&
      item.ativo === "sim"
  );
}

function abrirAudio(mes: string, semana: string) {
  const conteudo = buscarConteudo(
    mes,
    semana,
    "audio_individual"
  );

  if (!conteudo) {
    alert("Áudio ainda não disponível.");
    return;
  }

  const url = linkDrive(
    conteudo.drive_file,
    conteudo.tipo
  );

  console.log(url);

  setAudioUrl(url);
  setAudioAberto(true);
}

 function abrirPdf(mes: string, semana: string) {
  const conteudo = buscarConteudo(
    mes,
    semana,
    "pdf_individual"
  );

  if (!conteudo) {
    alert("PDF ainda não disponível.");
    return;
  }

}
if (loading) {
  return <div>Carregando...</div>;
}
if (error) {
  return <div>{error}</div>;
}

return (
  <main style={{ padding: 40 }}>
   
    {meses.map((mes) => {
      const conteudos = conteudosDoMes(mes);

      return (
        <div key={mes} style={{ marginBottom: 20 }}>
          <div
            onClick={() =>
              setMesAberto(mesAberto === mes ? null : mes)
            }
            style={{
              padding: 20,
              borderRadius: 18,
              background: "#2a0738",
              color: "#f4d46a",
              cursor: "pointer",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {mesAberto === mes ? "▼" : "▶"}{" "}
            {mes.charAt(0).toUpperCase() + mes.slice(1)}
          </div>

          {mesAberto === mes && (
            <div
              style={{
                marginTop: 15,
                marginLeft: 20,
                display: "grid",
                gap: 10,
              }}
            >
              
{Array.from(
  new Set(conteudos.map((c) => c.semana))
).map((semana) => (

  <div
    key={semana}
    style={{
      background: "#1b0227",
      borderRadius: 20,
      padding: 24,
      border: "1px solid rgba(244,212,106,.20)",
      marginBottom: 20,
    }}
  >

    <h3
      style={{
        color: "#f4d46a",
        marginBottom: 10,
      }}
    >
      ✦ {semana}ª Semana
    </h3>

    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}
    >

      <button
  onClick={() => abrirAudio(mes, semana)}
  style={{
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "12px 20px",
    cursor: "pointer",
  }}
>
  🎧 Ouvir Direcionamento
</button>

      <button
        onClick={() => abrirPdf(mes, semana)}
        style={{
          background: "#f4d46a",
          color: "#2a0738",
          border: "none",
          borderRadius: 999,
          padding: "12px 20px",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        📄 Baixar PDF
      </button>

      {semana === "3" && (
        <button
          onClick={() => setDirecionamentoAberto(true)}
          style={{
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "12px 20px",
    cursor: "pointer",
  }}
        >
          🔮 Direcionamento Exclusivo
        </button>
      )}

    </div>

  </div>

))}


            </div>
          )}
        </div>
      );
        })}

    {audioAberto && (
      <div
        onClick={() => setAudioAberto(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "90%",
            maxWidth: 700,
            background: "#1b0227",
            borderRadius: 20,
            padding: 24,
          }}
        >
          <h2
            style={{
              color: "#f4d46a",
              marginBottom: 20,
            }}
          >
            🎧 Direcionamento da Semana
          </h2>

          <iframe
  key={audioUrl}
  src={audioUrl}
  title="Direcionamento"
  width="100%"
  height="180"
  allow="autoplay"
  allowFullScreen
  style={{
    border: "none",
    borderRadius: 12,
    background: "#fff",
  }}
/>

          <button
            onClick={() => {
              setAudioAberto(false);
              setAudioUrl("");
            }}
            style={{
              marginTop: 20,
              background: "hsl(263, 70%, 50%)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    )}
{direcionamentoAberto && (
  <div
    onClick={() => setDirecionamentoAberto(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "95%",
        maxWidth: 620,
        background: "#1b0227",
        borderRadius: 24,
        padding: 28,
        border: "1px solid rgba(244,212,106,.25)",
      }}
    >
      <h2
        style={{
          color: "#f4d46a",
          marginBottom: 20,
        }}
      >
        🔮 Direcionamento Exclusivo
      </h2>

      <p style={{ color: "#fff", marginBottom: 18 }}>
        Escolha a área da sua pergunta.
      </p>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: "#2a0738",
          color: "#f4d46a",
          border: "1px solid rgba(244,212,106,.30)",
          marginBottom: 20,
        }}
      >
        <option value="">Escolha o tema...</option>
        <option>❤️ Amor</option>
        <option>💰 Trabalho</option>
        <option>🌿 Saúde</option>
        <option>✨ Espiritualidade</option>
        <option>👨‍👩‍👧 Relacionamentos</option>
        <option>🧠 Emocional</option>
      </select>

      <textarea
        value={pergunta}
        onChange={(e) => setPergunta(e.target.value)}
        placeholder="Digite sua pergunta..."
        rows={6}
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 12,
          background: "#2a0738",
          color: "#fff",
          border: "1px solid rgba(244,212,106,.30)",
          resize: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24,
        }}
      >
    <button
  onClick={async () => {
    if (!categoria || !pergunta.trim()) {
      alert("Escolha um tema e escreva sua pergunta.");
      return;
    }

    const { error } = await supabase
      .from("exclusive_questions")
      .insert({
        slug,
        nome,
        categoria,
        pergunta,
        status: "pendente",
      });

    if (error) {
      alert("Erro ao enviar sua pergunta.");
      console.error(error);
      return;
    }

    alert("Pergunta enviada com sucesso! 💜");

    setCategoria("");
    setPergunta("");
    setDirecionamentoAberto(false);
  }}
  style={{
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "12px 24px",
    cursor: "pointer",
  }}
>
  ✨ Enviar Pergunta
</button>

        <button
          onClick={() => setDirecionamentoAberto(false)}
          style={{
            background: "#4b0f63",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}
  </main>
);
}