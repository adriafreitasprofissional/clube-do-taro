"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

const router = useRouter();
  const [audioAberto, setAudioAberto] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
const [mesAberto, setMesAberto] = useState<string | null>(null);
  const [direcionamentoAberto, setDirecionamentoAberto] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  
const [conteudosPlanilha, setConteudosPlanilha] = useState<ConteudoPlanilha[]>([]);
const [carregandoConteudos, setCarregandoConteudos] = useState(true);
  
const limitePerguntas =
  plano.toLowerCase() === "bronze"
    ? 1
    : plano.toLowerCase() === "prata"
    ? 2
    : plano.toLowerCase() === "ouro"
    ? 2
    : plano.toLowerCase() === "diamante"
    ? 3
    : 0;

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
        console.log(conteudos);
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

  window.open(conteudo.drive_file, "_blank");
}

if (loading) {
  return <div>Carregando...</div>;
}
if (error) {
  return <div>{error}</div>;
}

return (
  <main
    style={{
      padding: 40,
      display: "grid",
      gridTemplateColumns: "280px 1fr",
      gap: 30,
      alignItems: "start",
    }}
  >
    {/* MENU ESQUERDO */}

   <aside
  style={{
    background: "#1b0227",
    borderRadius: 22,
    padding: 30,
    border: "1px solid rgba(244,212,106,.20)",
    position: "sticky",
    top: 30,
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
  }}
>
      <h2
        style={{
          color: "#ffd000",
          marginBottom: 30,
        }}
      >
        ✨ Direcionamentos
      </h2>

     <h3
  style={{
    color: "#fff",
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "0.3px",
    marginTop: 24,
    marginBottom: 12,
  }}
>
  {nome}
</h3>

      <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(212,164,0,.65)",
    background: "rgba(212,164,0,.08)",
    color: "#ffd54a",
    fontWeight: 700,
    fontSize: 15,
    width: "fit-content",
    marginTop: 10,
  }}
>
  💎 Plano {plano}
</div>
<div
  style={{
    marginTop: 35,
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(244,212,106,.20)",
    background: "rgba(255,255,255,.03)",
  }}
>
  <div
    style={{
      color: "#f4d46a",
      fontWeight: 700,
      fontSize: 17,
      marginBottom: 12,
    }}
  >
    🔮 Direcionamento Particular
  </div>

  <p
    style={{
      color: "#ddd",
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: 16,
    }}
  >
    Receba uma orientação exclusiva da Cigana Estella.
  </p>

  <div
    style={{
      color: "#f4d46a",
      fontWeight: 600,
      fontSize: 14,
      marginBottom: 6,
    }}
  >
    Você possui
  </div>

  <div
    style={{
      color: "#fff",
      fontSize: 26,
      fontWeight: 700,
      marginBottom: 6,
    }}
  >
   {limitePerguntas} pergunta{limitePerguntas > 1 ? "s" : ""}

  </div>

  <div
    style={{
      color: "#bbb",
      fontSize: 14,
      marginBottom: 18,
    }}
  >
    disponível{limitePerguntas > 1 ? "is" : ""} neste mês.
  </div>

  <button
    onClick={() => setDirecionamentoAberto(true)}
    style={{
      width: "100%",
      padding: 14,
      borderRadius: 999,
      border: "none",
      cursor: "pointer",
      background: "linear-gradient(90deg,#6d28d9,#8b5cf6)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 15,
    }}
  >
    ✨ Fazer minha pergunta
  </button>
</div>

      <button
       onClick={() => router.push(`/cliente/${slug}`)}
        style={{
  width: "100%",
  padding: 14,
  borderRadius: 999,
  background: "#6d28d9",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginTop: "auto",
}}
      >
        ← Voltar ao Portal
      </button>
    </aside>

    {/* CONTEÚDO */}

    <section>
      <h1
        style={{
          color: "#f4d46a",
          fontSize: 34,
          marginBottom: 8,
        }}
      >
        Portal de Direcionamentos
      </h1>

      <p
  style={{
    color: "#ddd",
    marginBottom: 35,
  }}
>
  Que os oráculos iluminem seu caminho...
</p>

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
          background: "#6aa1f4",
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
    </div>
  </div>
))}
            </div>
          )}
        </div>
      );
    })}

    </section>

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

<div
  style={{
    marginBottom: 20,
  }}
>
  <p
    style={{
      color: "#fff",
      marginBottom: 10,
      fontWeight: 600,
    }}
  >
    Sua situação precisa de uma resposta antes da próxima leitura semanal?
  </p>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#fff",
      marginBottom: 8,
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      name="urgente"
      checked={urgente === true}
      onChange={() => setUrgente(true)}
    />
    Sim, preciso de uma orientação com urgência.
  </label>

  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#fff",
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      name="urgente"
      checked={urgente === false}
      onChange={() => setUrgente(false)}
    />
    Não, posso aguardar normalmente.
  </label>
</div>

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
  nome_cliente: nome,
  email_cliente: email,
  plano,
  categoria,
  pergunta,
  urgente,
  referencia_mes: new Date().toISOString().slice(0, 7),
  status: "Pendente",
});
   if (error) {
  console.error(error);

  alert(
    `Erro: ${error.message}\nCódigo: ${error.code ?? ""}`
  );

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