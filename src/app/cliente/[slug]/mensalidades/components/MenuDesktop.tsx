import Link from "next/link";

interface Props {
  slug: string;
}

export default function MenuDesktop({ slug }: Props) {
  return (
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
          href={`/cliente/${slug}/mensalidades`}
          className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-bold text-white shadow-lg"
        >
          💳 Minha Assinatura
        </Link>
      </nav>

      <Link
        href={`/cliente/${slug}/portal`}
        className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm font-bold text-yellow-300 transition hover:bg-yellow-500/20"
      >
        ← Voltar ao Portal
      </Link>
    </aside>
  );
}