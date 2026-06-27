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
      setCarregando(false);
    }

    if (slug) buscarCliente();
  }, [slug]);

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
  slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
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
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-72 flex-col border-r border-purple-900/40 bg-[#100d24] p-6 md:flex">
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

            <Link
              href={`/cliente/${slug}/bonus`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              🎁 Meus Bônus
            </Link>

            <Link
              href={`/cliente/${slug}/mensagem-especial`}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
            >
              💌 Mensagem Especial
            </Link>

            <a
              href={LINK_SORTEIOS}
              target="_blank"
              rel="noreferrer"
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

<Link
  href="/cursos/pombagira"
  className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800/40"
>
  📚 Meus Cursos
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
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                href={`/cliente/${slug}/bonus`}
                className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <p className="text-3xl">🎁</p>
                <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                  
                </h3>
                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Veja seus benefícios, conteúdos liberados e presentes da sua
                  jornada.
                </p>
                <p className="mt-5 text-sm font-bold text-yellow-300">
                  Ver meus bônus →
                </p>
              </Link>

              <Link
                href={`/cliente/${slug}/mensagem-especial`}
                className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <p className="text-3xl">💌</p>
                <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                  Mensagem Especial
                </h3>
                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Uma mensagem reservada para acompanhar sua caminhada.
                </p>
                <p className="mt-5 text-sm font-bold text-yellow-300">
                  Abrir mensagem →
                </p>
              </Link>

              <a
                href={LINK_SORTEIOS}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <p className="text-3xl">🎲</p>
                <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                  Sorteios do Clube
                </h3>
                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Participe dos sorteios exclusivos do Clube do Tarô.
                </p>
                <p className="mt-5 text-sm font-bold text-yellow-300">
                  Ir para sorteios →
                </p>
              </a>

              <a
                href={WHATSAPP_CLUBE_VIP}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60"
              >
                <p className="text-3xl">💬</p>
                <h3 className="mt-4 text-xl font-extrabold text-yellow-400">
                  Clube VIP do Tarô
                </h3>
                <p className="mt-3 text-sm leading-6 text-purple-100">
                  Entre no grupo quando desejar e receba revelações semanais.
                </p>
                <p className="mt-5 text-sm font-bold text-yellow-300">
                  Entrar no grupo →
                </p>
              </a>

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
                <>
                  <a
                    href={WHATSAPP_DIAMANTE}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-cyan-400/40 bg-[#101827] p-6 shadow-xl transition hover:-translate-y-1 hover:border-cyan-300"
                  >
                    <p className="text-3xl">💎</p>
                    <h3 className="mt-4 text-xl font-extrabold text-cyan-300">
                      Grupo Exclusivo Diamante
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-purple-100">
                      Seu grupo reservado para avisos, bônus e conteúdos do
                      Plano Diamante.
                    </p>
                    <p className="mt-5 text-sm font-bold text-cyan-200">
                      Entrar no grupo Diamante →
                    </p>
                  </a>

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
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}