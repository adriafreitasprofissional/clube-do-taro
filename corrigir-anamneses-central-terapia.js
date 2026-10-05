const fs = require("fs");
const path = require("path");

const centralFile = "src/app/admin/terapia/page.tsx";
const pacientesFile = "src/app/admin/terapia/pacientes/page.tsx";
const listaCompat = "src/app/admin/terapia/anamneses/page.tsx";
const detalheCompat = "src/app/admin/terapia/anamneses/[clientId]/page.tsx";

const stamp = new Date().toISOString().replace(/[:.]/g, "-");

function backup(file) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, `${file}.backup-anamneses-${stamp}`);
  }
}

backup(centralFile);
backup(pacientesFile);
backup(listaCompat);
backup(detalheCompat);

// 1) Central de Terapia: Anamneses abre diretamente a área verde correta
{
  let txt = fs.readFileSync(centralFile, "utf8");
  txt = txt.replace(
    'href: "/admin/terapia/anamneses",',
    'href: "/terapia/admin/anamneses",'
  );
  fs.writeFileSync(centralFile, txt, "utf8");
}

// 2) Tela central de Pacientes: "Ver anamnese" também abre a área verde correta
{
  let txt = fs.readFileSync(pacientesFile, "utf8");
  txt = txt.replace(
    'href={`/admin/terapia/anamneses/${paciente.id}`}',
    'href={`/terapia/admin/anamneses/${paciente.id}`}'
  );
  fs.writeFileSync(pacientesFile, txt, "utf8");
}

// 3) Compatibilidade: se algum link antigo ainda apontar para /admin/terapia/anamneses
fs.mkdirSync(path.dirname(listaCompat), { recursive: true });

fs.writeFileSync(
  listaCompat,
  `import { redirect } from "next/navigation";

export default function AdminTerapiaAnamnesesCompat() {
  redirect("/terapia/admin/anamneses");
}
`,
  "utf8"
);

// 4) Compatibilidade do detalhe antigo: redireciona para a tela verde
fs.mkdirSync(path.dirname(detalheCompat), { recursive: true });

fs.writeFileSync(
  detalheCompat,
  `import { redirect } from "next/navigation";

export default async function AdminTerapiaAnamneseCompat({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  redirect(
    \`/terapia/admin/anamneses/\${encodeURIComponent(clientId)}\`
  );
}
`,
  "utf8"
);

console.log("");
console.log("ANAMNESES DA CENTRAL CORRIGIDAS.");
console.log("");
console.log("- O card Anamneses agora abre a ferramenta verde correta.");
console.log("- Ver anamnese em Pacientes também abre a ferramenta verde.");
console.log("- Links antigos /admin/terapia/anamneses continuam funcionando por redirecionamento.");
console.log("");
console.log("Agora rode:");
console.log('$env:NODE_OPTIONS="--max-old-space-size=4096"');
console.log("npm run build");
