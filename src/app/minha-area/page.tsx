"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MinhaAreaPage() {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [slugDoCliente, setSlugDoCliente] = useState("");
  const [temCursoPombagira, setTemCursoPombagira] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarArea() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/login";
        return;
      }

      const email = user.email.trim().toLowerCase();

      const { data: cliente, error: erroCliente } = await supabase
        .from("club_clients")
        .select("id, slug, nome")
        .ilike("email", email)
        .maybeSingle();

      if (erroCliente) {
        setErro(`Erro ao localizar cadastro: ${erroCliente.message}`);
        setLoading(false);
        return;
      }

      let idDoAluno = "";
      let nomeExibido = "";
      let slugEncontrado = "";

     if (cliente) {
  nomeExibido = cliente.slug || cliente.nome || "Aluna";
  slugEncontrado = cliente.slug || "";

  const { data: alunoDoCurso, error: erroAlunoDoCurso } = await supabase
    .from("course_students")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (erroAlunoDoCurso) {
    setErro(`Erro ao localizar aluno do curso: ${erroAlunoDoCurso.message}`);
    setLoading(false);
    return;
  }

  if (!alunoDoCurso) {
    setNome(nomeExibido);
    setSlugDoCliente(slugEncontrado);
    setTemCursoPombagira(false);
    setLoading(false);
    return;
  }

  idDoAluno = alunoDoCurso.id;
} else {
        const { data: aluno, error: erroAluno } = await supabase
          .from("course_students")
          .select("id, nome")
          .ilike("email", email)
          .maybeSingle();

        if (erroAluno) {
          setErro(`Erro ao localizar aluno: ${erroAluno.message}`);
          setLoading(false);
          return;
        }

        if (!aluno) {
          setErro("Não encontramos um cadastro de curso para este e-mail.");
          setLoading(false);
          return;
        }

        idDoAluno = aluno.id;
        nomeExibido = aluno.nome || "Aluna";
      }

      const { data: curso, error: erroCurso } = await supabase
        .from("student_courses")
        .select("id")
        .eq("student_id", idDoAluno)
        .eq("course_slug", "pombagira")
        .eq("status", "ativo")
        .maybeSingle();

      if (erroCurso) {
        setErro(`Erro ao localizar curso: ${erroCurso.message}`);
        setLoading(false);
        return;
      }

      setNome(nomeExibido);
      setSlugDoCliente(slugEncontrado);
    setTemCursoPombagira(!!curso || !!cliente);
      setLoading(false);
    }

    carregarArea();
  }, []);

  function voltar() {
    if (slugDoCliente) {
      window.location.href = `/cliente/${slugDoCliente}/portal`;
      return;
    }

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b0b0f",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Carregando sua área...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, #35102f 0%, #0b0b0f 48%, #07070a 100%)",
        color: "#ffffff",
        padding: "clamp(24px, 5vw, 72px) clamp(16px, 6vw, 100px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <button
          onClick={voltar}
          style={{
            background: "rgba(244,212,106,.12)",
            border: "1px solid rgba(244,212,106,.3)",
            color: "#f4d46a",
            padding: "10px 16px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          ← Voltar ao meu portal
        </button>

        <div
          style={{
            borderBottom: "1px solid rgba(214,173,76,.28)",
            paddingBottom: "28px",
            marginBottom: "42px",
          }}
        >
          <p
            style={{
              color: "#d6ad4c",
              margin: "0 0 12px",
              fontWeight: "bold",
              letterSpacing: "1.5px",
              fontSize: "13px",
            }}
          >
            ÁREA DO ALUNO
          </p>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(30px, 4vw, 48px)",
              lineHeight: 1.1,
            }}
          >
            Olá, {nome || "Aluna"}
          </h1>

          <p style={{ color: "#c9c9d1", margin: 0, fontSize: "17px" }}>
            Seus conteúdos, aulas e jornadas espirituais liberados.
          </p>
        </div>

        {erro ? (
          <div
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "rgba(130,20,20,.22)",
              border: "1px solid rgba(255,100,100,.35)",
              color: "#ffd0d0",
            }}
          >
            {erro}
          </div>
        ) : temCursoPombagira ? (
          <a
            href="/cursos/pombagira"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 48%) 1fr",
              width: "100%",
              minHeight: "360px",
              textDecoration: "none",
              color: "#ffffff",
              background:
                "linear-gradient(135deg, rgba(37,18,37,.98), rgba(21,21,28,.98))",
              border: "1px solid rgba(214,173,76,.45)",
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 22px 60px rgba(0,0,0,.45)",
            }}
          >
            <div
              style={{
                minHeight: "360px",
                overflow: "hidden",
                background: "#140d16",
              }}
            >
              <img
                src="/desafio-pombagira/banner-desafio-login.png"
                alt="Desafio Ative o Poder da sua Pombagira"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                padding: "clamp(28px, 5vw, 64px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: "#d6ad4c",
                  fontWeight: "bold",
                  margin: "0 0 18px",
                  letterSpacing: "1.5px",
                  fontSize: "13px",
                }}
              >
                CURSO LIBERADO
              </p>

              <h2
                style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(28px, 3vw, 44px)",
                  lineHeight: 1.1,
                }}
              >
                Desafio Ative o Poder da sua Pombagira
              </h2>

              <p
                style={{
                  color: "#d4d1d7",
                  margin: "0 0 34px",
                  lineHeight: 1.7,
                  fontSize: "17px",
                  maxWidth: "520px",
                }}
              >
                Uma jornada de 7 dias para despertar sua força, conexão e poder
                pessoal.
              </p>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "fit-content",
                  background: "linear-gradient(135deg, #9a22d0, #69129a)",
                  color: "#ffffff",
                  padding: "15px 28px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Acessar curso →
              </span>
            </div>
          </a>
        ) : (
          <div
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#c9c9d1",
            }}
          >
            Você ainda não possui cursos liberados nesta conta.
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 720px) {
          main {
            padding: 28px 16px !important;
          }

          a {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            border-radius: 22px !important;
          }

          a > div:first-child {
            min-height: 230px !important;
            height: 230px !important;
          }

          a > div:last-child {
            padding: 28px 22px 32px !important;
          }
        }
      `}</style>
    </main>
  );
}