const fs = require("fs");

const files = [
  "src/app/terapia/acesso/[token]/page.tsx",
  "src/app/components/InstallAppPrompt.tsx",
  "src/app/terapia/acesso/[token]/atividades/page.tsx",
  "src/app/terapia/acesso/[token]/atividades/[quizId]/page.tsx",
  "src/app/api/terapia/atividades/route.ts",
  "src/app/api/terapia/admin/client-preview/route.ts",
];

function pareceMojibake(texto) {
  return /Ã|Â|â|ð/.test(texto);
}

function corrigir(texto) {
  return Buffer.from(texto, "latin1").toString("utf8");
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`Arquivo não encontrado: ${file}`);
    continue;
  }

  const original = fs.readFileSync(file, "utf8");

  if (!pareceMojibake(original)) {
    console.log(`Sem problema aparente: ${file}`);
    continue;
  }

  const backup = `${file}.backup-acentos`;
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(file, backup);
  }

  const corrigido = corrigir(original);
  fs.writeFileSync(file, corrigido, "utf8");

  console.log(`Corrigido: ${file}`);
}

console.log("\nConcluído.");