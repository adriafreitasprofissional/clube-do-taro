import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

const campo =
  "w-full rounded-2xl border border-[#DCCFB8] bg-[#F7F1E4] p-4 text-[#5E7357] outline-none placeholder:text-[#7A8D73] focus:border-[#8AA27A]";

export default function Passo5({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Etapa 5
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          Saúde e acompanhamentos
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
          Estas informações ajudam Ádria a compreender
          seu contexto de forma mais responsável.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Atualmente você faz algum acompanhamento psicológico, psiquiátrico ou médico relacionado ao seu bem-estar emocional?
        </p>

        <ChoiceCard
          value={
            dados.acompanhamentoSaude ||
            ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              acompanhamentoSaude:
                value,
            })
          }
          options={[
            "Não",
            "Sim",
          ]}
        />

        {dados.acompanhamentoSaude ===
          "Sim" && (
          <textarea
            rows={3}
            value={
              dados.acompanhamentoDescricao ||
              ""
            }
            onChange={(event) =>
              setDados({
                ...dados,
                acompanhamentoDescricao:
                  event.target.value,
              })
            }
            placeholder="Se desejar, conte qual acompanhamento realiza."
            className={`${campo} mt-3 resize-none`}
          />
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Utiliza algum medicamento de uso contínuo?
        </p>

        <ChoiceCard
          value={
            dados.medicamentos || ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              medicamentos: value,
            })
          }
          options={[
            "Não",
            "Sim",
          ]}
        />

        {dados.medicamentos ===
          "Sim" && (
          <textarea
            rows={3}
            value={
              dados.medicamentosDescricao ||
              ""
            }
            onChange={(event) =>
              setDados({
                ...dados,
                medicamentosDescricao:
                  event.target.value,
              })
            }
            placeholder="Quais medicamentos?"
            className={`${campo} mt-3 resize-none`}
          />
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#5E7357]">
          Existe algum diagnóstico ou condição de saúde que considera importante informar?
        </p>

        <ChoiceCard
          value={
            dados.condicaoSaude || ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              condicaoSaude: value,
            })
          }
          options={[
            "Não",
            "Sim",
          ]}
        />

        {dados.condicaoSaude ===
          "Sim" && (
          <textarea
            rows={3}
            value={
              dados.condicaoSaudeDescricao ||
              ""
            }
            onChange={(event) =>
              setDados({
                ...dados,
                condicaoSaudeDescricao:
                  event.target.value,
              })
            }
            placeholder="Qual condição?"
            className={`${campo} mt-3 resize-none`}
          />
        )}
      </div>

      <div className="rounded-2xl border border-[#DCCFB8] bg-[#F7F1E4] p-4">
        <p className="text-xs leading-6 text-[#6C8465]">
          Este acompanhamento não substitui atendimento
          médico, psicológico ou psiquiátrico quando
          esses cuidados forem necessários.
        </p>
      </div>
    </div>
  );
}
