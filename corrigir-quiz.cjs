const fs = require("fs");

const path = "src/app/admin/terapia/quizzes/page.tsx";

let s = fs.readFileSync(path, "utf8");
s = s.replace(/\r\n/g, "\n");

function replaceOnce(oldText, newText, label) {
  if (!s.includes(oldText)) {
    throw new Error("Nao encontrei: " + label);
  }

  s = s.replace(oldText, newText);
}

replaceOnce(
  'import { supabase } from "@/lib/supabase";\n',
  `import { supabase } from "@/lib/supabase";
import {
  ImproveQuestionButton,
  QuizAiAssistant,
  type PerguntaIA,
  type QuizIA,
} from "./QuizAiAssistant";
`,
  "import QuizAiAssistant"
);

replaceOnce(
  "  function prepararPerguntas() {\n",
  `  function converterPerguntaIA(
    pergunta: PerguntaIA
  ): Pergunta {
    const tipo =
      pergunta.type || "single_choice";

    const ehEscolha =
      tipo === "single_choice" ||
      tipo === "multiple_choice";

    const opcoes =
      ehEscolha &&
      Array.isArray(pergunta.options) &&
      pergunta.options.length > 0
        ? pergunta.options
        : ehEscolha
          ? ["", ""]
          : [];

    return {
      id: crypto.randomUUID(),
      type: tipo,
      prompt: pergunta.prompt || "",
      helper: pergunta.helper || "",
      options: opcoes,
      min: Number.isFinite(Number(pergunta.min))
        ? Number(pergunta.min)
        : 0,
      max: Number.isFinite(Number(pergunta.max))
        ? Number(pergunta.max)
        : 10,
      min_label: pergunta.min_label || "",
      max_label: pergunta.max_label || "",
    };
  }

  function aplicarPerguntasIA(
    geradas: PerguntaIA[]
  ) {
    const novas =
      geradas.map(converterPerguntaIA);

    setQuestions((atual) => {
      const existentes =
        atual.filter((pergunta) =>
          pergunta.prompt.trim()
        );

      return existentes.length
        ? [...existentes, ...novas]
        : novas;
    });

    setErro(null);
    setMensagem(
      "Perguntas adicionadas pela IA. Revise antes de publicar."
    );
  }

  function aplicarQuizCompletoIA(
    quiz: QuizIA
  ) {
    if (quiz.title) {
      setTitle(quiz.title);
    }

    if (quiz.subtitle) {
      setSubtitle(quiz.subtitle);
    }

    if (quiz.instructions) {
      setInstructions(quiz.instructions);
    }

    setQuestions(
      quiz.questions.map(
        converterPerguntaIA
      )
    );

    setErro(null);
    setMensagem(
      "Quiz completo criado pela IA. Revise antes de publicar."
    );
  }

  function aplicarMelhoriaIA(
    perguntaId: string,
    gerada: PerguntaIA
  ) {
    const convertida =
      converterPerguntaIA(gerada);

    setQuestions((atual) =>
      atual.map((pergunta) =>
        pergunta.id === perguntaId
          ? {
              ...convertida,
              id: pergunta.id,
            }
          : pergunta
      )
    );

    setErro(null);
    setMensagem(
      "Pergunta aprimorada pela IA."
    );
  }

  function prepararPerguntas() {
`,
  "funcoes IA"
);

replaceOnce(
  "        {/* PERGUNTAS */}\n",
  `        <QuizAiAssistant
          quizType={quizType}
          onApplyQuestions={
            aplicarPerguntasIA
          }
          onApplyFullQuiz={
            aplicarQuizCompletoIA
          }
        />

        {/* PERGUNTAS */}
`,
  "painel IA"
);

replaceOnce(
  `                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moverPergunta(index, -1)}
`,
  `                  <div className="flex flex-wrap gap-2">
                    <ImproveQuestionButton
                      question={pergunta.prompt}
                      quizType={quizType}
                      onImproved={(gerada) =>
                        aplicarMelhoriaIA(
                          pergunta.id,
                          gerada
                        )
                      }
                      onError={setErro}
                    />

                    <button
                      type="button"
                      onClick={() => moverPergunta(index, -1)}
`,
  "botao Melhorar com IA"
);

fs.writeFileSync(path, s, "utf8");

console.log("Pagina do Quiz restaurada e IA conectada sem corromper UTF-8.");
