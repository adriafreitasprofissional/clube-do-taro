import Link from "next/link";

interface Props {
  slug: string;
}

export default function MenuMobile({ slug }: Props) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 md:hidden">
      <Link
        href={`/cliente/${slug}`}
        className="rounded-xl bg-purple-800 p-4 text-center font-bold text-white"
      >
        🔮
        <br />
        Meu Portal
      </Link>

      <Link
        href={`/cliente/${slug}/portal`}
        className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
      >
        ✨
        <br />
        Direcionamentos
      </Link>

      <Link
        href={`https://cursos.magiaoriente.com.br/meus-cursos?slug=${slug}`}
        className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
      >
        📚
        <br />
        Meus Cursos
      </Link>

      <Link
        href={`/cliente/${slug}/mensalidades`}
        className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
      >
        💳
        <br />
        Assinatura
      </Link>

      <Link
        href={`/cliente/${slug}/whatsapp`}
        className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
      >
        💬
        <br />
        WhatsApp
      </Link>

      <Link
        href={`/cliente/${slug}/sorteios`}
        className="rounded-xl bg-[#19172f] p-4 text-center font-semibold text-white"
      >
        🎲
        <br />
        Sorteios
      </Link>

      <Link
        href="/login"
        className="col-span-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4 text-center font-bold text-yellow-300"
      >
        🚪 Sair
      </Link>
    </div>
  );
}