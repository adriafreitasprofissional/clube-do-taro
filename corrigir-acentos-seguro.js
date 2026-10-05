const fs = require("fs");

const files = [
  "src/app/terapia/acesso/[token]/page.tsx",
  "src/app/components/InstallAppPrompt.tsx",
  "src/app/terapia/acesso/[token]/atividades/page.tsx",
  "src/app/terapia/acesso/[token]/atividades/[quizId]/page.tsx",
  "src/app/api/terapia/atividades/route.ts",
  "src/app/api/terapia/admin/client-preview/route.ts",
];

function scoreMojibake(text) {
  const matches = text.match(/Ã|Â|â|ð|�/g);
  return matches ? matches.length : 0;
}

function decodeLatin1Utf8(text) {
  return Buffer.from(text, "latin1").toString("utf8");
}

function repairLine(line) {
  let current = line;

  for (let i = 0; i < 3; i++) {
    if (!/[ÃÂâð]/.test(current)) break;

    const before = scoreMojibake(current);
    const candidate = decodeLatin1Utf8(current);
    const after = scoreMojibake(candidate);

    if (candidate.includes("�")) break;
    if (after >= before) break;

    current = candidate;
  }

  return current;
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`Arquivo não encontrado: ${file}`);
    continue;
  }

  const backup = `${file}.backup-acentos`;

  // Restaura a cópia feita antes da tentativa anterior, se existir.
  if (fs.existsSync(backup)) {
    fs.copyFileSync(backup, file);
    console.log(`Restaurado do backup: ${file}`);
  }

  let text = fs.readFileSync(file, "utf8");

  // Remove BOM ou caractere de substituição apenas no início do arquivo.
  text = text.replace(/^\uFEFF/, "").replace(/^�/, "");

  const newline = text.includes("\r\n") ? "\r\n" : "\n";
  const repaired = text
    .split(/\r?\n/)
    .map(repairLine)
    .join(newline);

  fs.writeFileSync(file, repaired, "utf8");

  const remaining = scoreMojibake(repaired);
  console.log(
    remaining === 0
      ? `Corrigido: ${file}`
      : `Corrigido com ${remaining} trecho(s) ainda suspeito(s): ${file}`
  );
}

console.log("\nConcluído. Agora rode npm run build.");
