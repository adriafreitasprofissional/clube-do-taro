import type { AgendaAtendimento } from "./agenda-types";

type Props = {
  atendimentos: AgendaAtendimento[];
  carregando?: boolean;
};

function inicioDoDia(data: Date) {
  const resultado = new Date(data);
  resultado.setHours(0, 0, 0, 0);
  return resultado;
}

function fimDoDia(data: Date) {
  const resultado = new Date(data);
  resultado.setHours(23, 59, 59, 999);
  return resultado;
}

function inicioDaSemana(data: Date) {
  const resultado = inicioDoDia(data);
  resultado.setDate(
    resultado.getDate() - resultado.getDay()
  );
  return resultado;
}

function fimDaSemana(data: Date) {
  const resultado = inicioDaSemana(data);
  resultado.setDate(resultado.getDate() + 6);
  resultado.setHours(23, 59, 59, 999);
  return resultado;
}

function formatarProximo(item?: AgendaAtendimento) {
  if (!item) return "Nenhum";

  const data = new Date(item.scheduled_at);

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgendaResumo({
  atendimentos,
  carregando = false,
}: Props) {
  const agora = new Date();
  const hojeInicio = inicioDoDia(agora);
  const hojeFim = fimDoDia(agora);
  const semanaInicio = inicioDaSemana(agora);
  const semanaFim = fimDaSemana(agora);

  const validos = atendimentos.filter(
    (item) => item.status !== "cancelado"
  );

  const hoje = validos.filter((item) => {
    const data = new Date(item.scheduled_at);
    return data >= hojeInicio && data <= hojeFim;
  });

  const semana = validos.filter((item) => {
    const data = new Date(item.scheduled_at);
    return data >= semanaInicio && data <= semanaFim;
  });

  const clientesAtivos = new Set(
    validos
      .filter(
        (item) => new Date(item.scheduled_at) >= hojeInicio
      )
      .map((item) => item.client_id)
  ).size;

  const proximo = [...validos]
    .filter((item) => new Date(item.scheduled_at) >= agora)
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() -
        new Date(b.scheduled_at).getTime()
    )[0];

  const valor = (numero: number) =>
    carregando ? "..." : String(numero);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-yellow-300">Hoje</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {valor(hoje.length)}
        </p>
        <p className="mt-1 text-xs text-purple-300">
          atendimentos
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-yellow-300">
          Esta semana
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {valor(semana.length)}
        </p>
        <p className="mt-1 text-xs text-purple-300">
          domingo a sábado
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-yellow-300">
          Clientes em agenda
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {valor(clientesAtivos)}
        </p>
        <p className="mt-1 text-xs text-purple-300">
          com próximos atendimentos
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/40 bg-[#28002f] p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-yellow-300">
          Próximo atendimento
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {carregando ? "..." : formatarProximo(proximo)}
        </p>
        <p className="mt-1 truncate text-xs text-purple-300">
          {carregando
            ? "carregando"
            : proximo?.client_name || "horário agendado"}
        </p>
      </div>
    </div>
  );
}
