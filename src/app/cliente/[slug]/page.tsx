"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string | null;
  slug: string;
  plano: string | null;
  tipo_assinatura: string | null;
  status: string | null;
  genero: string | null;
};


const WHATSAPP_CLUBE_VIP =
  "https://chat.whatsapp.com/EjjKI3FQSkvE2YIzU5GORp";

const WHATSAPP_DIAMANTE =
  "https://chat.whatsapp.com/ECIcVTVZgSz7jXvqK36FeS";

const LINK_MENTORIA =
  "https://mystic-lunar-flow.lovable.app/";

const LINK_SORTEIOS =
  "https://mystic-draw-fix.lovable.app";


function nomeDoPlano(plano?: string | null) {
  const nomes: Record<string, string> = {
    bronze: "Plano Bronze",
    prata: "Plano Prata",
    ouro: "Plano Ouro",
    diamante: "Plano Diamante",
  };

  return nomes[String(plano || "bronze").toLowerCase()] || "Plano Bronze";
}

export default function PortalDaAssinantePage() {
  const params = useParams();
  const slug = String(params.slug);

  const [cliente, setCliente] = useState<Cliente | null>(null);
const [carregando, setCarregando] = useState(true);

const [recados, setRecados] = useState<any[]>([]);
const [recadoAberto, setRecadoAberto] = useState<any | null>(null);

  useEffect(() => {
    async function buscarCliente() {
      const { data, error } = await supabase
        .from("club_clients")
        .select("id, nome, slug, plano, tipo_assinatura, status, genero")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
  console.error("Erro ao carregar portal:", error);
}

setCliente(data as Cliente | null);

if (data) {
  try {
    const resposta = await fetch(
      `/api/messages?slug=${encodeURIComponent(data.slug)}`,
      {
        cache: "no-store",
      }
    );

    if (resposta.ok) {
      const resultado = await resposta.json();

      setRecados(resultado.recados || []);
    } else {
      console.error(
        "Erro ao carregar recados:",
        await resposta.text()
      );
    }
  } catch (erro) {
    console.error("Erro ao buscar recados:", erro);
  }
}

setCarregando(false);
        }

    if (slug) buscarCliente();
  }, [slug]);

  useEffect(() => {
    const recadoNovo = recados.find((recado) => !recado.lido);

    if (recadoNovo && !recadoAberto) {
      setRecadoAberto(recadoNovo);
    }
  }, [recados, recadoAberto]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Carregando seu portal...
      </main>
    );
  }

  if (!cliente) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Assinante não encontrada.
      </main>
    );
  }

  const plano = String(cliente.plano || "bronze").toLowerCase();
  const primeiroNome =
  (cliente.nome || slug).split(" ")[0];

const generoNormalizado = String(cliente.genero || "")
  .trim()
  .toLowerCase();

const ehHomem =
  generoNormalizado === "homem" ||
  generoNormalizado === "masculino" ||
  generoNormalizado === "male";

const saudacao = ehHomem ? "Bem-vindo" : "Bem-vinda";

const tituloGuardiao = ehHomem ? "Guardião" : "Guardiã";
  const temConvites = plano === "prata" || plano === "ouro";
  const ehDiamante = plano === "diamante";

  return (
    <main className="min-h-screen bg-[#08070f] text-white">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        
        <aside className="flex flex-col w-full md:w-72 border-b md:border-b-0 md:border-r border-purple-900/40 bg-[#100d24] p-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">
              Clube do Tarô
            </p>

            <h1 className="mt-2 text-xl font-bold text-yellow-400">
              Área da Assinante
            </h1>
          </div>

          <nav className="flex flex-1 flex-col gap-3">
            <Link
              href={`/cliente/${slug}`}
              className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold text-white shadow-lg"
            >
              🔮 Meu Portal
            </Link>

            <Link
              href={`/cliente/${slug}/portal`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              ✨ Meus Direcionamentos
            </Link>

            <a
             href={`${LINK_SORTEIOS}?slug=${slug}`}
              
              rel="noreferrer"target="_blank"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              🎲 Sorteios do Clube
            </a>

            <a
              href={WHATSAPP_CLUBE_VIP}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              💬 Grupo Exclusivo WhatsApp
            </a>

            <Link
              href={`/cliente/${slug}/mensalidades`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              💳 Minhas Mensalidades
            </Link>

           
          </nav>

          <Link
  href="/login"
  className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
>
  🚪 Sair
</Link>

        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <p className="text-sm text-purple-300">Seu espaço exclusivo</p>

              <h2 className="mt-2 text-3xl font-extrabold text-yellow-400">
                {saudacao}, {tituloGuardiao} {primeiroNome}
              </h2>

              <span className="mt-4 inline-flex rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300">
                💎 {nomeDoPlano(plano)}
              </span>

              <p className="mt-5 max-w-2xl text-base leading-7 text-purple-100">
                Que os oráculos iluminem seus caminhos e revelem as respostas
                que sua alma precisa neste momento.
              </p>
              {recados.filter((recado) => !recado.lido).length > 0 && (
  <button
    type="button"
    onClick={() =>
      setRecadoAberto(
        recados.find((recado) => !recado.lido) || null
      )
    }
    className="group relative mt-6 flex w-full max-w-2xl items-center gap-4 overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-purple-950/60 via-[#19132d] to-yellow-500/5 px-5 py-4 text-left shadow-[0_0_25px_rgba(212,175,55,0.08)] transition duration-500 hover:-translate-y-0.5 hover:border-yellow-400/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.16)]"
  >
    {/* brilho sutil passando pelo aviso */}
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-300/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

    {/* estrela */}
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/5">
      <span className="animate-[pulse_3s_ease-in-out_infinite] text-3xl text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]">
        ✦
      </span>
    </span>

    <div className="relative min-w-0">
      <p className="text-base font-extrabold tracking-wide text-yellow-300">
        VOCÊ TEM UM RECADO DA ÁDRIA
      </p>

      <p className="mt-1 text-sm leading-5 text-purple-200">
        Há uma mensagem especial esperando por você.
      </p>
    </div>

    <span className="relative ml-auto shrink-0 text-xl text-yellow-300 transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  </button>
)}
            </div>

            <div className="grid max-w-4xl gap-6 md:grid-cols-2">
              <Link
                href={`/cliente/${slug}/portal`}
                className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <p className="text-3xl">✨</p>
                <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                  Meus Direcionamentos
                </h3>
                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Acesse seus áudios, PDFs, leituras e conteúdos mensais.
                </p>
                <p className="mt-5 text-sm font-bold text-yellow-300">
                  Abrir direcionamentos →
                </p>
              </Link>

              <Link


  href={`https://cursos.magiaoriente.com.br/meus-cursos?slug=${slug}`}
  
  className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
>
  <p className="text-3xl">📚</p>

  <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
    Meus Cursos
  </h3>

  <p className="mt-3 text-sm leading-6 text-purple-100">
    Acesse todos os seus cursos exclusivos.
  </p>

  <p className="mt-5 text-sm font-bold text-yellow-300">
    Abrir meus cursos →
  </p>
</Link>

              {temConvites && (
                <Link
                  href={`/cliente/${slug}/convites`}
                  className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
                >
                  <p className="text-3xl">✨</p>
                  <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                    Convites Especiais
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-purple-100">
                    Veja convites para encontros, lives e experiências do clube.
                  </p>
                  <p className="mt-5 text-sm font-bold text-yellow-300">
                    Ver convites →
                  </p>
                </Link>
              )}

              {ehDiamante && (
  <a
    href={LINK_MENTORIA}
    target="_blank"
    rel="noreferrer"
    className="rounded-2xl border border-yellow-400/50 bg-yellow-500/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-300"
  >
    <p className="text-3xl">🗓️</p>

    <h3 className="mt-4 text-xl font-extrabold text-yellow-300">
      Agendamento de Mentoria
    </h3>

    <p className="mt-3 text-sm leading-6 text-purple-50">
      Escolha o melhor horário para sua mentoria exclusiva.
    </p>

    <p className="mt-5 text-sm font-bold text-yellow-200">
      Agendar mentoria →
    </p>
  </a>
)}
        
            </div>
            {recados.length > 0 && (
              <div className="mt-8 w-full max-w-4xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl text-yellow-300">✦</span>

                  <h3 className="text-lg font-extrabold text-yellow-300">
                    Recados da Ádria
                  </h3>
                </div>

                <div className="space-y-3">
                  {recados.map((recado) => (
                    <button
                      key={recado.id}
                      type="button"
                      onClick={() => setRecadoAberto(recado)}
                      className="group w-full rounded-2xl border border-purple-500/20 bg-[#19172f] p-4 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-yellow-400/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-lg text-yellow-300">
                          ✦
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-bold text-white">
                              {recado.titulo}
                            </p>

                            <span
                              className={
                                recado.lido
                                  ? "text-xs text-green-300"
                                  : "text-xs font-bold text-yellow-300"
                              }
                            >
                              {recado.lido ? "Lido ✓" : "Novo"}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-purple-200">
                            {recado.mensagem}
                          </p>

                          <p className="mt-2 text-xs text-purple-400">
                            {new Date(
                              recado.created_at
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>

                        <span className="text-yellow-300 opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      {recadoAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={() => setRecadoAberto(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-yellow-400/30 bg-[#120d22] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-4 text-4xl text-yellow-300">
                ✦
              </div>

              <p className="text-xs uppercase tracking-[0.25em] text-purple-300">
                Clube do Tarô
              </p>

              <h3 className="mt-3 text-2xl font-extrabold text-yellow-300">
                Você tem um recado da Ádria
              </h3>
            </div>

            <div className="mt-7 rounded-2xl border border-purple-500/20 bg-[#19172f] p-5">
              <h4 className="text-lg font-bold text-white">
                {recadoAberto.titulo}
              </h4>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-purple-100">
                {recadoAberto.mensagem}
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch("/api/messages", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      messageId: recadoAberto.id,
                      slug,
                    }),
                  });

                  setRecados((anteriores) =>
                    anteriores.map((recado) =>
                      recado.id === recadoAberto.id
                        ? {
                            ...recado,
                            lido: true,
                            lido_em: new Date().toISOString(),
                          }
                        : recado
                    )
                  );

                  setRecadoAberto(null);
                } catch (erro) {
                  console.error(
                    "Erro ao registrar leitura:",
                    erro
                  );

                  setRecadoAberto(null);
                }
              }}
              className="mt-6 w-full rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
            >
              ✦ OK, Ádria
            </button>

          
          </div>
        </div>
      )}

    </main>
  );
}