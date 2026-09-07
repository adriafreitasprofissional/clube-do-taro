import CheckBoxCard from "../ui/CheckBoxCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

const campo =
  "w-full rounded-2xl border border-[#DCCFB8] bg-[#F7F1E4] p-4 text-[#5E7357] outline-none placeholder:text-[#7A8D73] focus:border-[#8AA27A]";

export default function Passo2({
  dados,
  setDados,
}: Props) {
  const areas =
    Array.isArray(dados.areasTrabalho)
      ? dados.areasTrabalho
      : [];

  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Etapa 2
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          O que trouxe você até aqui
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
          Conte com suas palavras o que deseja
          compreender, transformar ou aliviar.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          O que fez você buscar terapia neste momento?
        </label>

        <textarea
          rows={5}
          value={
            dados.motivoPrincipal || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              motivoPrincipal:
                event.target.value,
            })
          }
          placeholder="Conte o que está acontecendo hoje e o que mais tem pesado emocionalmente..."
          className={`${campo} resize-none`}
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-[#5E7357]">
          Quais áreas você sente que precisam de mais atenção?
        </label>

        <CheckBoxCard
          values={areas}
          onChange={(values) =>
            setDados({
              ...dados,
              areasTrabalho: values,
            })
          }
          options={[
            "Ansiedade e preocupação",
            "Dependência emocional",
            "Relacionamentos familiares",
            "Autoestima",
            "Dificuldade de colocar limites",
            "Medos e inseguranças",
            "Luto ou perdas",
            "Traumas ou lembranças difíceis",
            "Sobrecarga emocional",
            "Relacionamento amoroso",
            "Outro",
          ]}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#5E7357]">
          Ao final deste ciclo, o que você gostaria de perceber diferente em sua vida?
        </label>

        <textarea
          rows={4}
          value={
            dados.objetivoCiclo || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              objetivoCiclo:
                event.target.value,
            })
          }
          placeholder="Ex.: conseguir dizer não sem culpa, preocupar-me menos, sentir mais segurança nas minhas decisões..."
          className={`${campo} resize-none`}
        />
      </div>
    </div>
  );
}
