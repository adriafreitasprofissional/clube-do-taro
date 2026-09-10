"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Negocio = {
  nome: string;
  descricao: string;
  icone: string;
  href?: string;
  status?: string;
  destaque?: boolean;
};

const negocios: Negocio[] = [
  {
    nome: "Terapia em Dia",
    descricao:
      "Pacientes, agenda, atendimentos, anamneses, quizzes, atividades e mini palestras.",
    icone: "🌿",
    href: "/admin/terapia",
    status: "ATIVO",
    destaque: true,
  },
  {
    nome: "Clube do Tarô",
    descricao:
      "Assinantes, direcionamentos, atendimentos, mentorias, conteúdos e gestão do Clube.",
    icone: "🔮",
   href: "/admin/clube",
    status: "ATIVO",
  },
  {
    nome: "Cursos",
    descricao:
      "Alunos, cursos, liberações, conteúdos, mentorias e acompanhamento.",
    icone: "🎓",
    status: "CENTRAL EM AJUSTE",
  },
  {
    nome: "Biblioteca Ádria Freitas",
    descricao:
      "Livros, publicações, conteúdos digitais, materiais e biblioteca.",
    icone: "📚",
    status: "EM ORGANIZAÇÃO",
  },
  {
    nome: "Lojas",
    descricao:
      "Loja Mística e Loja Artística: produtos, parceiros, pedidos, grimórios, esculturas e encomendas.",
    icone: "🛍️",
    status: "EM PREPARAÇÃO",
  },
];

export default function AdminPage() {
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    try {
      setSaindo(true);

      await supabase.auth.signOut();

      window.location.href = "/";
    } catch {
      setSaindo(false);
      alert("Não foi possível sair agora.");
    }
  }

  return (
    <main className="central-admin">
      {/* TOPO */}
      <header className="central-topo">
        <div>
          <p className="central-label">
            Administração Geral
          </p>

          <h1>Central de Negócios</h1>

          <p className="central-subtitulo">
            Escolha o ambiente que deseja administrar.
          </p>
        </div>

        <button
          type="button"
          onClick={sair}
          disabled={saindo}
          className="botao-sair"
        >
          {saindo ? "Saindo..." : "🚪 Sair"}
        </button>
      </header>

      {/* NEGÓCIOS */}
      <section className="grade-negocios">
        {negocios.map((negocio) => {
          const conteudo = (
            <div
              className={
                negocio.destaque
                  ? "card-negocio card-destaque"
                  : "card-negocio"
              }
            >
              <div className="card-topo">
                <div className="card-icone">
                  {negocio.icone}
                </div>

                {negocio.status && (
                  <span
                    className={
                      negocio.destaque
                        ? "status status-destaque"
                        : "status"
                    }
                  >
                    {negocio.status}
                  </span>
                )}
              </div>

              <h2>{negocio.nome}</h2>

              <p>{negocio.descricao}</p>

              <div
                className={
                  negocio.href
                    ? "card-acao ativo"
                    : "card-acao"
                }
              >
                {negocio.href
                  ? "Entrar no ambiente →"
                  : "Em preparação"}
              </div>
            </div>
          );

          if (!negocio.href) {
            return (
              <div key={negocio.nome}>
                {conteudo}
              </div>
            );
          }

          return (
            <Link
              key={negocio.nome}
              href={negocio.href}
              className="card-link"
            >
              {conteudo}
            </Link>
          );
        })}
      </section>

      <style jsx>{`
        .central-admin {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding-bottom: 40px;
        }

        .central-topo {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 38px;
        }

        .central-label {
          margin: 0;
          color: #b7c28b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        h1 {
          margin: 10px 0 8px;
          color: #ffffff;
          font-size: clamp(32px, 5vw, 46px);
          line-height: 1.1;
        }

        .central-subtitulo {
          margin: 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 16px;
          line-height: 1.7;
        }

        .botao-sair {
          flex-shrink: 0;
          border: 1px solid rgba(183, 194, 139, 0.25);
          background: rgba(92, 108, 61, 0.2);
          color: #dce5c0;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .botao-sair:hover {
          background: rgba(92, 108, 61, 0.4);
        }

        .botao-sair:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .grade-negocios {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }

        .card-link {
          text-decoration: none;
          display: block;
          height: 100%;
        }

        .card-negocio {
          height: 100%;
          min-height: 215px;
          padding: 24px;
          border-radius: 22px;
          border: 1px solid rgba(183, 194, 139, 0.18);
          background:
            linear-gradient(
              145deg,
              rgba(61, 70, 42, 0.42),
              rgba(27, 31, 20, 0.9)
            );
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          transition:
            transform 0.2s ease,
            border 0.2s ease;
        }

        .card-link:hover .card-negocio {
          transform: translateY(-3px);
          border-color: rgba(183, 194, 139, 0.4);
        }

        .card-destaque {
          border-color: rgba(183, 194, 139, 0.46);
          background:
            linear-gradient(
              145deg,
              rgba(89, 105, 56, 0.8),
              rgba(37, 43, 26, 0.97)
            );
        }

        .card-topo {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .card-icone {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .status {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.58);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .status-destaque {
          background: #b8c68a;
          color: #263019;
        }

        .card-negocio h2 {
          margin: 22px 0 8px;
          color: #ffffff;
          font-size: 21px;
        }

        .card-negocio p {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.65;
          flex: 1;
        }

        .card-acao {
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.34);
          font-size: 13px;
          font-weight: 700;
        }

        .card-acao.ativo {
          color: #cbd69d;
        }

        @media (max-width: 700px) {
          .central-admin {
            padding-bottom: 24px;
          }

          .central-topo {
            flex-direction: column;
            gap: 20px;
            margin-bottom: 28px;
          }

          .central-topo h1 {
            font-size: 34px;
          }

          .botao-sair {
            width: 100%;
            min-height: 50px;
          }

          .grade-negocios {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .card-negocio {
            min-height: 190px;
            padding: 20px;
            border-radius: 19px;
          }

          .card-negocio h2 {
            font-size: 19px;
          }

          .card-negocio p {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}