"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Perfil = {
  id: string;
  nome: string;
  email: string;
  plano: string;
  role: string;
};

export default function PainelProfissionalPage() {
  const router = useRouter();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("club_clients")
        .select("id,nome,email,plano,role")
        .ilike("email", session.user.email)
        .maybeSingle();

      if (!data || data.role !== "profissional") {
        router.replace("/login");
        return;
      }

      setPerfil(data);
      setCarregando(false);
    }

    carregar();
  }, [router]);

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

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

        <p style={{ color: "#CDBFD3" }}>
          Plano Fundador
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "18px",
            marginTop: "40px",
          }}
        >
          <div style={card}>
            <h2>Consulentes</h2>
            <p>Cadastre e organize seus consulentes.</p>
          </div>

          <div style={card}>
            <h2>Direcionamentos</h2>
            <p>Prepare os direcionamentos semanais.</p>
          </div>

          <div style={card}>
            <h2>Áudios e PDFs</h2>
            <p>Organize as entregas de cada consulente.</p>
          </div>

          <div style={card}>
            <h2>Histórico</h2>
            <p>Acompanhe o que já foi entregue.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={sair}
          style={{
            marginTop: "40px",
            padding: "12px 22px",
            borderRadius: "12px",
            border: "1px solid #D8B65B",
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
  border: "1px solid rgba(216,182,91,.35)",
  background: "rgba(255,255,255,.06)",
};
