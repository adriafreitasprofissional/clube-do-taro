"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Perfil = {
  id: string;
  nome: string;
  plano: string;
};

export default function PainelProfissionalPage() {
  const router = useRouter();

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [totalConsulentes, setTotalConsulentes] =
    useState(0);

  const [limiteConsulentes, setLimiteConsulentes] =
    useState(10);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    async function carregar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "/api/profissional/consulentes",
        {
          cache: "no-store",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setPerfil(data.profissional);
      setTotalConsulentes(data.total || 0);
      setLimiteConsulentes(data.limite || 10);
      setCarregando(false);
    }

    carregar();
  }, [router]);

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const limiteAtingido =
    totalConsulentes >= limiteConsulentes;

  if (carregando) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#100015",
          color: "white",
          padding: "40px",
        }}
      >
        Abrindo seu painel...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#100015 0%,#260035 55%,#120018 100%)",
        color: "white",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#D8B65B",
            letterSpacing: "3px",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          Clube do Tarô Profissional
        </p>

        <h1
          style={{
            fontSize: "38px",
            marginBottom: "8px",
          }}
        >
          Bem-vinda, {perfil?.nome}
        </h1>

        <div
          style={{
            marginTop: "18px",
            maxWidth: "520px",
            padding: "18px",
            borderRadius: "16px",
            border:
              "1px solid rgba(216,182,91,.35)",
            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <strong
            style={{
              color: "#E7C96F",
            }}
          >
            Plano Fundador
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#D7C8DD",
            }}
          >
            Até {limiteConsulentes} consulentes ativos
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: limiteAtingido
                ? "#F0C56A"
                : "#BCAAC4",
            }}
          >
            {totalConsulentes} de{" "}
            {limiteConsulentes} utilizados
          </p>

          {limiteAtingido && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                borderRadius: "14px",
                background:
                  "rgba(216,182,91,.10)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Você atingiu o limite do seu plano.
                Para cadastrar novos consulentes,
                faça upgrade.
              </p>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Solicitação de upgrade. Em breve você poderá escolher um plano com mais consulentes."
                  )
                }
                style={{
                  marginTop: "12px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#D8B65B",
                  color: "#160018",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Fazer upgrade
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "18px",
            marginTop: "32px",
          }}
        >
          <div style={{ ...card, cursor: "pointer" }} onClick={() => router.push("/profissional/consulentes")}>`r`n            <h2>Consulentes</h2>

            <p>
              Cadastre e organize seus consulentes.
            </p>

            <strong
              style={{
                color: "#E7C96F",
              }}
            >
              {totalConsulentes} /{" "}
              {limiteConsulentes}
            </strong>
          </div>

          <div style={card}>
            <h2>Direcionamentos</h2>
            <p>
              Prepare os direcionamentos semanais.
            </p>
          </div>

          <div style={card}>
            <h2>Áudios e PDFs</h2>
            <p>
              Organize as entregas de cada
              consulente.
            </p>
          </div>

          <div style={card}>
            <h2>Histórico</h2>
            <p>
              Acompanhe o que já foi entregue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={sair}
          style={{
            marginTop: "40px",
            padding: "12px 22px",
            borderRadius: "12px",
            border:
              "1px solid #D8B65B",
            background: "transparent",
            color: "#D8B65B",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  minHeight: "150px",
  padding: "24px",
  borderRadius: "20px",
  border:
    "1px solid rgba(216,182,91,.35)",
  background:
    "rgba(255,255,255,.06)",
};
