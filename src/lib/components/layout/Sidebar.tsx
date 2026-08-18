import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-60 pt-8">

      <nav className="flex flex-col gap-5 text-lg">

        <a
          href="https://wa.me/55SEUNUMERO"
          target="_blank"
          className="text-white hover:text-yellow-400 transition"
        >
          💬 Suporte
        </a>

        <a
          href="LINK_DO_GRUPO_VIP"
          target="_blank"
          className="text-white hover:text-yellow-400 transition"
        >
          👑 Grupo VIP
        </a>

        <hr className="border-yellow-500/20" />

        <Link
          href="/meus-cursos"
          className="text-white hover:text-yellow-400 transition"
        >
          📚 Meus Cursos
        </Link>

        <Link
          href="/cursos/pombagira"
          className="text-white hover:text-yellow-400 transition"
        >
          ← Voltar ao Curso
        </Link>

        <hr className="border-yellow-500/20" />

        <button className="text-left text-white hover:text-red-400 transition">
          🚪 Sair
        </button>

      </nav>

    </aside>
  );
}