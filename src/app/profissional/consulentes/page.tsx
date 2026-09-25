"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Consulente = {
  id: string;
  nome: string;
  nome_referencia?: string | null;
  email: string;
  whatsapp?: string | null;
  status: string;
};

export default function ConsulentesProfissionalPage() {
  const router = useRouter();

  const [consulentes, setConsulentes] = useState<Consulente[]>([]);
  const [limite, setLimite] = useState(10);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [nomeReferencia, setNomeReferencia] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  async function tokenAtual() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function carregar() {
    const token = await tokenAtual();

    if (!token) {
      router.replace("/login");
      return;
    }

    const response = await fetch(
      "/api/profissional/consulentes",
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data?.error || "Não foi possível carregar seus consulentes.");
      router.replace("/login");
      return;
    }

    setConsulentes(data.consulentes || []);
    setLimite(data.limite || 10);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (consulentes.length >= limite) {
      alert(
        "Você atingiu o limite de consulentes do seu plano. Faça upgrade para cadastrar novos consulentes."
      );
      return;
    }

    if (!nome.trim() || !email.trim()) {
      alert("Preencha nome e e-mail.");
      return;
    }

    setSalvando(true);

    try {
      const token = await tokenAtual();

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "/api/profissional/consulentes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            nomeReferencia:
              nomeReferencia.trim() || nome.trim(),
            email,
            whatsapp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data?.error ||
            "Não foi possível cadastrar o consulente."
        );
        return;
      }

      setNome("");
      setNomeReferencia("");
      setEmail("");
      setWhatsapp("");

      alert("Consulente cadastrado com sucesso.");

      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main style={pagina}>
        <div style={conteudo}>
          <p>Carregando consulentes...</p>
        </div>
      </main>
    );
  }

  const limiteAtingido =
    consulentes.length >= limite;

  return (
    <main style={pagina}>
      <div style={conteudo}>
        <button
          type="button"
          onClick={() =>
            router.push("/profissional/painel")
          }
          style={voltar}
        >
          ← Voltar ao painel
        </button>

        <p style={rotulo}>
          Clube do Tarô Profissional
        </p>

        <h1 style={titulo}>
          Meus Consulentes
        </h1>

        <p style={subtitulo}>
          Cadastre e organize as pessoas que recebem
          seus direcionamentos.
        </p>

        <div style={contador}>
          <div>
            <strong style={{ color: "#E7C96F" }}>
              Plano Fundador
            </strong>

            <p style={{ margin: "6px 0 0" }}>
              {consulentes.length} de {limite} consulentes utilizados
            </p>
          </div>

          {limiteAtingido && (
            <button
              type="button"
              style={upgrade}
              onClick={() =>
                alert(
                  "Faça upgrade para aumentar seu limite de consulentes."
                )
              }
            >
              Fazer upgrade
            </button>
          )}
        </div>

        {!limiteAtingido && (
          <form
            onSubmit={cadastrar}
            style={formulario}
          >
            <h2 style={{ marginTop: 0 }}>
              + Novo consulente
            </h2>

            <div style={grade}>
              <input
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                placeholder="Nome completo"
                style={input}
              />

              <input
                value={nomeReferencia}
                onChange={(e) =>
                  setNomeReferencia(e.target.value)
                }
                placeholder="Como deseja chamá-lo(a)"
                style={input}
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="E-mail"
                style={input}
              />

              <input
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                placeholder="WhatsApp"
                style={input}
              />
            </div>

            <button
              type="submit"
              disabled={salvando}
              style={botaoCadastrar}
            >
              {salvando
                ? "Cadastrando..."
                : "Cadastrar consulente"}
            </button>
          </form>
        )}

        <section style={{ marginTop: "32px" }}>
          <h2>
            Consulentes cadastrados
          </h2>

          {consulentes.length === 0 ? (
            <div style={vazio}>
              Você ainda não cadastrou nenhum consulente.
            </div>
          ) : (
            <div style={lista}>
              {consulentes.map((consulente) => (
                <div
                  key={consulente.id}
                  style={card}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {consulente.nome_referencia ||
                        consulente.nome}
                    </h3>

                    <p style={emailTexto}>
                      {consulente.email}
                    </p>

                    {consulente.whatsapp && (
                      <p style={emailTexto}>
                        {consulente.whatsapp}
                      </p>
                    )}
                  </div>

                  <span style={status}>
                    Ativo
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const pagina: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#100015 0%,#260035 55%,#120018 100%)",
  color: "white",
  padding: "28px",
};

const conteudo: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const voltar: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#D8B65B",
  cursor: "pointer",
  padding: 0,
  marginBottom: "28px",
};

const rotulo: React.CSSProperties = {
  color: "#D8B65B",
  letterSpacing: "3px",
  fontSize: "12px",
  textTransform: "uppercase",
};

const titulo: React.CSSProperties = {
  fontSize: "38px",
  marginBottom: "8px",
};

const subtitulo: React.CSSProperties = {
  color: "#CDBFD3",
  lineHeight: 1.6,
};

const contador: React.CSSProperties = {
  marginTop: "26px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid rgba(216,182,91,.35)",
  background: "rgba(255,255,255,.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const upgrade: React.CSSProperties = {
  border: "none",
  borderRadius: "12px",
  background: "#D8B65B",
  color: "#160018",
  fontWeight: "bold",
  padding: "12px 18px",
  cursor: "pointer",
};

const formulario: React.CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid rgba(216,182,91,.25)",
  background: "rgba(255,255,255,.06)",
};

const grade: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "14px",
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.15)",
  background: "rgba(255,255,255,.07)",
  color: "white",
};

const botaoCadastrar: React.CSSProperties = {
  marginTop: "18px",
  padding: "14px 20px",
  border: "none",
  borderRadius: "12px",
  background: "#D8B65B",
  color: "#160018",
  fontWeight: "bold",
  cursor: "pointer",
};

const lista: React.CSSProperties = {
  display: "grid",
  gap: "12px",
};

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,.10)",
  background: "rgba(255,255,255,.05)",
};

const emailTexto: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#BFAFC6",
  fontSize: "14px",
};

const status: React.CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "rgba(216,182,91,.12)",
  color: "#E7C96F",
  fontSize: "12px",
  fontWeight: "bold",
};

const vazio: React.CSSProperties = {
  padding: "24px",
  borderRadius: "16px",
  border: "1px dashed rgba(216,182,91,.30)",
  color: "#BFAFC6",
};
