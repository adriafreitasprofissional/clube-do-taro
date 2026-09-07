import SliderInput from "../ui/SliderInput";
import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

export default function Passo6({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Etapa 6
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          Relações, culpa e limites
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
          Estas perguntas ajudam a observar como
          suas relações interferem em suas escolhas
          e no seu bem-estar.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Quanto você sente dificuldade para dizer “não” quando algo ultrapassa seus limites?
        </p>

        <SliderInput
          value={Number(
            dados.dificuldadeDizerNao ??
              5
          )}
          leftLabel="Nenhuma dificuldade"
          rightLabel="Muita dificuldade"
          onChange={(value) =>
            setDados({
              ...dados,
              dificuldadeDizerNao:
                value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Quanto você sente culpa ao se priorizar?
        </p>

        <SliderInput
          value={Number(
            dados.culpaPriorizar ??
              5
          )}
          leftLabel="Nenhuma culpa"
          rightLabel="Muita culpa"
          onChange={(value) =>
            setDados({
              ...dados,
              culpaPriorizar:
                value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Quanto você se sente responsável pelos problemas ou emoções de outras pessoas?
        </p>

        <SliderInput
          value={Number(
            dados.responsabilidadeOutros ??
              5
          )}
          leftLabel="Pouco"
          rightLabel="Muito"
          onChange={(value) =>
            setDados({
              ...dados,
              responsabilidadeOutros:
                value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Quando alguém próximo está mal, você costuma deixar suas próprias necessidades em segundo plano?
        </p>

        <ChoiceCard
          value={
            dados.deixaNecessidades ||
            ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              deixaNecessidades:
                value,
            })
          }
          options={[
            "Raramente",
            "Às vezes",
            "Frequentemente",
            "Quase sempre",
          ]}
        />
      </div>
    </div>
  );
}
