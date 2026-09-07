type Props = {
  dados: any;
  setDados: (dados: any) => void;
  nomeCliente: string;
  emailCliente: string;
};

const campo =
  "w-full rounded-2xl border border-[#DCCFB8] bg-[#F7F1E4] p-4 text-[#5E7357] outline-none placeholder:text-[#7A8D73] focus:border-[#8AA27A]";

export default function Passo1({
  dados,
  setDados,
  nomeCliente,
  emailCliente,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Etapa 1
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          Sobre você
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
          Vamos começar com algumas informações
          básicas para organizar seu acompanhamento.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          Nome
        </label>

        <input
          value={nomeCliente}
          readOnly
          className={`${campo} cursor-not-allowed bg-[#EFE5D3]`}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          Data de nascimento
        </label>

        <input
          type="date"
          value={
            dados.dataNascimento || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              dataNascimento:
                event.target.value,
            })
          }
          className={campo}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          Telefone / WhatsApp
        </label>

        <input
          value={dados.telefone || ""}
          onChange={(event) =>
            setDados({
              ...dados,
              telefone:
                event.target.value,
            })
          }
          placeholder="Seu telefone"
          className={campo}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          E-mail
        </label>

        <input
          type="email"
          value={
            dados.email ||
            emailCliente ||
            ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              email:
                event.target.value,
            })
          }
          placeholder="Seu e-mail"
          className={campo}
        />
      </div>
    </div>
  );
}
