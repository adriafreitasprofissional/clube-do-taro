"use client";

export type NovoCliente = {
  nome: string;
  nomeReferencia: string;
  email: string;
  whatsapp: string;
  genero: string;
};

type Props = {
  dados: NovoCliente;
  setDados: (dados: NovoCliente) => void;
};

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white placeholder:text-purple-300/60 outline-none focus:border-yellow-300/50";

export default function CadastroCliente({ dados, setDados }: Props) {
  function atualizar(campo: keyof NovoCliente, valor: string) {
    setDados({
      ...dados,
      [campo]: valor,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-yellow-300">
          Novo cliente
        </h3>

        <p className="mt-1 text-sm text-purple-300">
          Dados básicos para identificar o atendimento.
        </p>
      </div>

      <input
        value={dados.nome}
        onChange={(e) => atualizar("nome", e.target.value)}
        placeholder="Nome completo"
        className={campo}
      />

      <input
        value={dados.nomeReferencia}
        onChange={(e) => atualizar("nomeReferencia", e.target.value)}
        placeholder="Nome de referência"
        className={campo}
      />

      <input
        type="email"
        value={dados.email}
        onChange={(e) => atualizar("email", e.target.value)}
        placeholder="E-mail"
        className={campo}
      />

      <input
        value={dados.whatsapp}
        onChange={(e) => atualizar("whatsapp", e.target.value)}
        placeholder="WhatsApp"
        className={campo}
      />

      <select
        value={dados.genero}
        onChange={(e) => atualizar("genero", e.target.value)}
        className={campo}
      >
        <option value="Mulher">Mulher</option>
        <option value="Homem">Homem</option>
        <option value="Não binário">Não binário</option>
        <option value="Outro">Outro</option>
        <option value="Prefiro não informar">
          Prefiro não informar
        </option>
      </select>
    </div>
  );
}