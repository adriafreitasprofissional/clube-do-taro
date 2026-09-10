import Link from "next/link";
import AgendaPage from "../../agenda/page";

export default function TerapiaAgendaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/terapia"
          className="text-sm font-bold text-[#cbd69d]"
        >
          ← Terapia em Dia
        </Link>

        <Link
          href="/admin"
          className="text-sm font-bold text-purple-300"
        >
          Central de Negócios
        </Link>
      </div>

      <AgendaPage />
    </div>
  );
}