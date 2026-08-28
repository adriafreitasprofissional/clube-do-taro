"use client";

export type AtendimentoDados = {
  tipoAtendimento: string;
  profissional: string;
  data: string;
  horario: string;
  duracao: string;
  observacoes: string;
};

type Props = {
  dados: AtendimentoDados;
  setDados: (dados: AtendimentoDados) => void;
};

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white placeholder:text-purple-300/60 outline-none focus:border-yellow-300/50";

export default function DadosAtendimento({ dados, setDados }: Props) {
  function atualizar(campo: keyof AtendimentoDados, valor: string) {
    setDados({
      ...dados,
      [campo]: valor,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300">
          Dados do atendimento
        </h3>

        <p className="mt-1 text-sm text-purple-300">
          Defina o serviço, profissional, data e horário.
        </p>
      </div>

      <select
        value={dados.tipoAtendimento}
        onChange={(e) => atualizar("tipoAtendimento", e.target.value)}
        className={campo}
      >
        <option value="">Tipo de atendimento</option>
        <option value="Mentoria">Mentoria</option>
        <option value="Terapia Holística">Terapia Holística</option>
        <option value="Terapia TRG">Terapia TRG</option>
        <option value="Psicologia">Psicologia</option>
        <option value="Psiquiatria">Psiquiatria</option>
        <option value="Massoterapia">Massoterapia</option>
        <option value="Fisioterapia">Fisioterapia</option>
        <option value="Reunião Comercial">Reunião Comercial</option>
        <option value="Reunião">Reunião</option>
      </select>

      <input
        value={dados.profissional}
        onChange={(e) => atualizar("profissional", e.target.value)}
        placeholder="Profissional responsável"
        className={campo}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="date"
          value={dados.data}
          onChange={(e) => atualizar("data", e.target.value)}
          className={campo}
        />

        <input
          type="time"
          value={dados.horario}
          onChange={(e) => atualizar("horario", e.target.value)}
          className={campo}
        />
      </div>

      <select
        value={dados.duracao}
        onChange={(e) => atualizar("duracao", e.target.value)}
        className={campo}
      >
        <option value="30">30 minutos</option>
        <option value="45">45 minutos</option>
        <option value="60">1 hora</option>
        <option value="90">1 hora e 30 minutos</option>
        <option value="120">2 horas</option>
      </select>

      <textarea
        value={dados.observacoes}
        onChange={(e) => atualizar("observacoes", e.target.value)}
        placeholder="Observações do atendimento"
        rows={4}
        className={campo}
      />
    </div>
  );
}