const fs = require("fs");

const p = "src/app/components/sections/Hero/Hero.tsx";
const linhas = fs.readFileSync(p, "utf8").split(/\r?\n/);

if (!linhas[45]?.includes("VAGAS MENSAIS ESGOTADAS")) {
  throw new Error("Linha esperada não encontrada. Nada foi alterado.");
}

linhas.splice(
  40,
  7,
  '  <a',
  '    href="#planos-mensais"',
  '    className="rounded-full bg-[#D4AF37] px-8 py-4 text-center font-semibold text-[#1B1235] shadow-lg transition hover:scale-105"',
  '  >',
  '    Quero Conhecer Clube Mensal',
  '  </a>'
);

fs.writeFileSync(p, linhas.join("\n"), "utf8");

console.log("OK - botão mensal do topo liberado.");
