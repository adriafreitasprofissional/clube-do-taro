import Link from "next/link";
import { notFound } from "next/navigation";

const clientes: Record<
  string,
  {
    nome: string;
    plano: "bronze" | "prata" | "ouro" | "diamante";
  }
> = {
  gabi: { nome: "Gabi", plano: "bronze" },
  nathali: { nome: "Nathali", plano: "prata" },
  carolmorena: { nome: "Carol Morena", plano: "ouro" },
  carolruiva: { nome: "Carol Ruiva", plano: "diamante" },
  claudinho: { nome: "Claudinho", plano: "bronze" },
  cris: { nome: "Cris", plano: "diamante" },
  dani: { nome: "Dani", plano: "bronze" },
  dorinha: { nome: "Dorinha", plano: "diamante" },
  fefe: { nome: "Fefe", plano: "bronze" },
  helena: { nome: "Helena", plano: "diamante" },
  lilian: { nome: "Lilian", plano: "diamante" },
  luana: { nome: "Luana", plano: "bronze" },
  nena: { nome: "Nena", plano: "bronze" },
  neide: { nome: "Neide", plano: "ouro" },
  natalia: { nome: "Natalia", plano: "bronze" },
  rejiane: { nome: "Rejiane", plano: "bronze" },
  tamilly: { nome: "Tamilly", plano: "ouro" },
  vivi: { nome: "Vivi", plano: "diamante" },
};

const pagamentosPorPlano = {
  bronze: {
    nome: "Plano Bronze",
    valorFormatado: "R$ 27,20",
    linkPagamento:
      "https://invoice.infinitepay.io/plans/adriaescritora/fC6YXan9aP",
  },
  prata: {
    nome: "Plano Prata",
    valorFormatado: "R$ 47,00",
    linkPagamento:
      "https://app.infinitepay.io/plans/share/fpn2fMg9Qd",
  },
  ouro: {
    nome: "Plano Ouro",
    valorFormatado: "R$ 67,00",
    linkPagamento:
      "https://invoice.infinitepay.io/plans/adriaescritora/fvbXy2rRsn",
  },
  diamante: {
    nome: "Plano Diamante",
    valorFormatado: "R$ 147,00",
    linkPagamento:
      "https://invoice.infinitepay.io/plans/adriaescritora/UM4UHqFNPD",
  },
} as const;

export default async function MensalidadesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cliente = clientes[slug];

  if (!cliente) {
    notFound();
  }

  const pagamentoAtual = pagamentosPorPlano[cliente.plano];

  return (
    <main className="min-h-screen bg-[#08070f] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
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
              className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-purple-800/40"
            >
              🔮 Meu Portal
            </Link>

            <Link
              href={`/cliente/${slug}/mensalidades`}
              className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold shadow-lg"
            >
              💳 Minhas Mensalidades
            </Link>
          </nav>

          <Link
            href={`/cliente/${slug}`}
            className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-300"
          >
            ← Voltar ao Portal
          </Link>
        </aside>

        <section className="flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-2xl">
            <Link
              href={`/cliente/${slug}`}
              className="mb-6 inline-flex rounded-xl border border-purple-500/40 bg-[#17142d] px-4 py-3 text-sm font-bold text-purple-200 md:hidden"
            >
              ← Voltar ao Portal
            </Link>

            <div className="mb-7">
              <p className="text-sm text-purple-300">
                Área financeira de {cliente.nome}
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                💳 Minhas Mensalidades
              </h2>
            </div>

            <div className="mb-5 rounded-2xl border border-blue-400/30 bg-[#101827] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-yellow-400">
                💎 {pagamentoAtual.nome}
              </h3>

              <div className="mt-5 grid gap-3 text-sm">
                <p>
                  <strong>Tipo:</strong> Mensal
                </p>
                <p>
                  <strong>Status:</strong> Ativo
                </p>
                <p>
                  <strong>Valor:</strong> {pagamentoAtual.valorFormatado}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-[#19172f] p-6 shadow-xl">
              <p className="text-sm text-purple-200">
                Mensalidade do {pagamentoAtual.nome}
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-yellow-400">
                {pagamentoAtual.valorFormatado}
              </h3>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={pagamentoAtual.linkPagamento}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-red-500"
                >
                  PAGAR AGORA
                </a>

                <a
                  href={pagamentoAtual.linkPagamento}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-blue-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-blue-500"
                >
                  PAGAR COM PIX
                </a>

                <a
                  href={pagamentoAtual.linkPagamento}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-cyan-600 px-5 py-4 text-center text-sm font-extrabold transition hover:bg-cyan-500"
                >
                  PAGAR COM CARTÃO
                </a>
              </div>

              <p className="mt-6 text-center text-xs leading-relaxed text-purple-300">
                Escolha PIX ou cartão no checkout da InfinitePay.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}