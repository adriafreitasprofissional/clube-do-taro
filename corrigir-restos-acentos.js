const fs = require("fs");

const files = [
  "src/app/terapia/acesso/[token]/page.tsx",
  "src/app/terapia/acesso/[token]/atividades/page.tsx",
  "src/app/terapia/acesso/[token]/atividades/[quizId]/page.tsx",
  "src/app/components/InstallAppPrompt.tsx",
];

const replacements = new Map([
  ["VisualizaÃ§Ã£o", "Visualização"],
  ["visualizaÃ§Ã£o", "visualização"],
  ["serÃ¡", "será"],
  ["jÃ¡", "já"],
  ["ComeÃ§ar", "Começar"],
  ["gravaÃ§Ã£o", "gravação"],
  ["relatÃ³rio", "relatório"],
  ["RelatÃ³rio", "Relatório"],
  ["CLUBE DO TARÃ”", "CLUBE DO TARÔ"],
  ["Clube do TarÃ´", "Clube do Tarô"],
  ["InÃ­cio", "Início"],
  ["Ã ", "à"],
  ["Ã vontade", "à vontade"],
  ["â€”", "—"],
  ["â†", "←"],
  ["â†’", "→"],
  ["â†", "←"],
  ["âœ“", "✓"],
  ["âœ¦", "✦"],
  ["â–¶", "▶"],
  ["â‹®", "⋮"],
  ["â€œ", "“"],
  ["â€", "”"],
  ["Ã—", "×"],
  ["ðŸ“", "📝"],
  ["ðŸ§©", "🧩"],
  ["ðŸŒ¿", "🌿"],
  ["ðŸ“„", "📄"],
  ["ðŸ“…", "📅"],
]);

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`Arquivo não encontrado: ${file}`);
    continue;
  }

  let text = fs.readFileSync(file, "utf8");
  const original = text;

  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }

  // Remove BOM ou caractere inválido apenas se estiver no início.
  text = text.replace(/^\uFEFF/, "").replace(/^�/, "");

  fs.writeFileSync(file, text, "utf8");

  console.log(
    text === original
      ? `Sem alteração: ${file}`
      : `Corrigido: ${file}`
  );
}

console.log("\nConcluído.");
