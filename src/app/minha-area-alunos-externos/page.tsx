"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MinhaAreaPage() {
  
const [cursos, setCursos] = useState<any[]>([]);

const [slugAluno, setSlugAluno] = useState("");

useEffect(() => {
  carregarCursos();
}, []);

async function carregarCursos() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    setCursos([]);
    return;
  }

  const resposta = await fetch("/api/meus-cursos", {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: "no-store",
  });

  if (!resposta.ok) {
    setCursos([]);
    return;
  }

  const dados = await resposta.json();
  setCursos(dados.cursos || []);
  setSlugAluno(dados.slugAluno || "");
}
async function sair() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}

  const menuStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: 16,
  border: "none",
  background: "transparent",
  color: "#F5F5F5",
  fontSize: 18,
  textAlign: "left",
  cursor: "pointer",
  transition: ".25s",
};

const menuAtivo: React.CSSProperties = {
  ...menuStyle,
  background: "linear-gradient(90deg,#6C2BD9,#8B3DFF)",
  fontWeight: 700,
};

const sairStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px",
  borderRadius: 16,
  background: "transparent",
  border: "1px solid rgba(212,175,55,.35)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
};
  

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        background: "#090611",
        color: "#fff",
      }}
    >
      {/* MENU */}
      <aside
        style={{
          background: "#140B22",
          borderRight: "1px solid rgba(212,175,55,.15)",
          padding: "40px 28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            color: "#9B5CF6",
            fontSize: 15,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Cursos
        </span>

        <h2
          style={{
            color: "#D4AF37",
            marginTop: 8,
            fontSize: 34,
            lineHeight: 1.1,
          }}
        >
          Ãrea do
          <br />
          Aluno
        </h2>

        <div
  style={{
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  <button style={menuAtivo}>ðŸ“š Meus Cursos</button>

  <button style={menuStyle}>â­ Convites Especiais</button>

  <button style={menuStyle}>ðŸ‘¥ Grupo Exclusivo</button>

  <button style={menuStyle}>ðŸ’¬ Suporte</button>

  <button style={menuStyle}>ðŸ’³ Pagamentos</button>

  <button style={menuStyle}>âœ¨ Clube do TarÃ´</button>
</div>

        <div style={{ flex: 1 }} />

       <button
  style={sairStyle}
  onClick={sair}
>
  â†© Sair da conta
</button>

      </aside>

      {/* CONTEÃšDO */}

      <section
        style={{
          padding: "60px",
        }}
      >
        <p
          style={{
            color: "#C28CFF",
            marginBottom: 12,
          }}
        >
          Seu espaÃ§o de estudos
        </p>

        <h1
          style={{
            fontSize: 56,
            color: "#9B5CF6",
            margin: 0,
          }}
        >
          Bem-vindo(a), Aluno
        </h1>

        <div
          style={{
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 999,
            background: "#2A1547",
            border: "1px solid #4A237D",
            color: "#fff",
          }}
        >
          ðŸŽ“ Aluno Convidado
        </div>

        <p
          style={{
            color: "#D4AF37",
            marginTop: 28,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          O CONHECIMENTO LIBERTA
        </p>

        <p
          style={{
            color: "#DDD",
            fontSize: 20,
            maxWidth: 700,
            lineHeight: 1.8,
          }}
        >
          Aqui vocÃª encontra todos os cursos liberados para sua conta.
        </p>

        <div
          style={{
            marginTop: 60,
            borderTop: "1px solid rgba(155,92,246,.25)",
            paddingTop: 40,
          }}
        >
          <h2
            style={{
              color: "#D4AF37",
              fontSize: 34,
              marginBottom: 30,
            }}
          >
            ðŸ“š Meus Cursos
          </h2>

         <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
    gap: 24,
  }}
>
  {cursos.map((curso) => (
    <Link
      key={curso.id}
      href={`https://cursos.magiaoriente.com.br/meus-cursos?slug=${slugAluno}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "#1A102C",
          border: "1px solid rgba(212,175,55,.15)",
          borderRadius: 20,
          padding: 24,
          cursor: "pointer",
        }}
      >
        <h3
          style={{
            color: "#D4AF37",
            marginBottom: 12,
          }}
        >
          {curso.titulo}
        </h3>

        <p
          style={{
            color: "#ddd",
            lineHeight: 1.6,
          }}
        >
          {curso.descricao}
        </p>

        <div
          style={{
            marginTop: 20,
            color: "#9B5CF6",
            fontWeight: 700,
          }}
        >
          Entrar no curso â†’
        </div>
      </div>
    </Link>
  ))}
</div>

        </div>
      </section>
    </main>
  );
}
