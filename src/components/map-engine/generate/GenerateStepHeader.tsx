interface Props {
  gerando: boolean;
  gerarMapa: () => void;
  client: {
    nome: string;
    data_nascimento?: string;
    hora_nascimento?: string;
    cidade_nascimento?: string;
    estado_nascimento?: string;
  };
}

function formatarData(data?: string) {
  if (!data) return "-";

  const [ano, mes, dia] = data.split("-");

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return `${dia} de ${meses[Number(mes) - 1]} de ${ano}`;
}

export function GenerateStepHeader({
  gerando,
  gerarMapa,
  client,
}: Props) {
  return (
    <div className="rounded-[34px] border border-yellow-500/20 bg-[#24183D] p-14">

      <div className="text-center">

        <p className="tracking-[0.6em] uppercase text-sm text-yellow-400">
          MAPA PREMIUM
        </p>

        <h1 className="mt-6 text-5xl font-light text-yellow-300">
          {client.nome}
        </h1>

        <p className="mt-5 text-lg italic text-zinc-300">
          "O destino revela aquilo que sua alma escolheu viver."
        </p>

      </div>

      <button
        onClick={gerarMapa}
        disabled={gerando}
        className="mx-auto mt-12 flex rounded-full border border-yellow-500 px-10 py-5 text-lg font-semibold text-yellow-400 transition-all duration-300 hover:bg-yellow-500 hover:text-[#22163A]"
      >
        ✨ {gerando ? "Gerando mapa..." : "Gerar Mapa Premium"}
      </button>

      <div className="mt-14 rounded-3xl border border-yellow-500/15 bg-[#1A132C] px-12 py-8">

        <div className="grid grid-cols-3 gap-10 text-center">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
              📅 Nascimento
            </p>

            <p className="mt-3 text-xl text-white">
              {formatarData(client.data_nascimento)}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
              🕒 Hora
            </p>

            <p className="mt-3 text-xl text-white">
              {client.hora_nascimento || "-"}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
              📍 Local
            </p>

            <p className="mt-3 text-xl text-white">
              {client.cidade_nascimento} • {client.estado_nascimento}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}