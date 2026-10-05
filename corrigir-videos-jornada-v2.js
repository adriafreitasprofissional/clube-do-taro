const fs = require("fs");

const portalFile =
  "src/app/terapia/acesso/[token]/page.tsx";
const portalApiFile =
  "src/app/api/terapia/portal/route.ts";
const previewApiFile =
  "src/app/api/terapia/admin/client-preview/route.ts";

const stamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

function ensureFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo não encontrado: ${file}`);
  }
}

function backup(file) {
  ensureFile(file);
  const destino = `${file}.backup-videos-v2-${stamp}`;
  fs.copyFileSync(file, destino);
}

function read(file) {
  ensureFile(file);
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
  console.log(`Atualizado: ${file}`);
}

function addContentLinksToSelect(content, label) {
  if (
    /session_title,\s*recording_url,\s*content_links,\s*client_report,/m.test(
      content
    )
  ) {
    console.log(`Já estava corrigido: ${label}`);
    return content;
  }

  const regex =
    /(session_title,\s*\n\s*recording_url,\s*\n)(\s*client_report,)/m;

  if (!regex.test(content)) {
    throw new Error(
      `Não encontrei recording_url/client_report para: ${label}`
    );
  }

  console.log(`Corrigido: ${label}`);

  return content.replace(
    regex,
    `$1        content_links,\n$2`
  );
}

// ======================================================
// 1) API REAL DO PORTAL
// ======================================================
backup(portalApiFile);
let portalApi = read(portalApiFile);

portalApi = addContentLinksToSelect(
  portalApi,
  "content_links na API do portal"
);

write(portalApiFile, portalApi);

// ======================================================
// 2) PREVIEW DO ADM
// ======================================================
backup(previewApiFile);
let previewApi = read(previewApiFile);

previewApi = addContentLinksToSelect(
  previewApi,
  "content_links no Ver como paciente"
);

previewApi = previewApi
  .replaceAll("nÒ£o", "não")
  .replaceAll("NÒ£o", "Não");

write(previewApiFile, previewApi);

// ======================================================
// 3) PORTAL DA PACIENTE
// ======================================================
backup(portalFile);
let portal = read(portalFile);

// Tipo de content_links no PortalData
if (!/content_links\s*:/.test(portal)) {
  const typeRegex =
    /(recording_url:\s*string\s*\|\s*null;\s*\n)(\s*client_report:\s*string\s*\|\s*null;)/m;

  if (!typeRegex.test(portal)) {
    throw new Error(
      "Não encontrei recording_url/client_report no tipo da jornada."
    );
  }

  portal = portal.replace(
    typeRegex,
    `$1  content_links:
    | {
        title: string;
        url: string;
      }[]
    | null;
$2`
  );

  console.log(
    "Corrigido: tipo content_links no portal"
  );
} else {
  console.log(
    "Já estava corrigido: tipo content_links no portal"
  );
}

// Texto residual de PDF, se existir
portal = portal.replaceAll(
  'pdf.text("SESSÒO"',
  'pdf.text("SESSÃO"'
);

// Botão principal: + Abrir jornada / – Fechar jornada
if (
  !portal.includes("+ Abrir jornada") ||
  !portal.includes("– Fechar jornada")
) {
  const journeyButtonRegex =
    /<span\s+className="shrink-0 text-3xl font-light leading-none text-\[#8AA27A\]"\s+aria-hidden="true"\s*>\s*\{jornadaAberta\s*\?\s*"⌄"\s*:\s*"›"\}\s*<\/span>/m;

  if (!journeyButtonRegex.test(portal)) {
    throw new Error(
      "Não encontrei o botão atual de Minha Jornada."
    );
  }

  portal = portal.replace(
    journeyButtonRegex,
    `<span
      className="shrink-0 rounded-xl border border-[#B9C7AE] bg-[#F3F7F0] px-4 py-2 text-sm font-extrabold text-[#5E7357]"
      aria-hidden="true"
    >
      {jornadaAberta
        ? "– Fechar jornada"
        : "+ Abrir jornada"}
    </span>`
  );

  console.log("Corrigido: botão Minha Jornada");
} else {
  console.log("Já estava corrigido: botão Minha Jornada");
}

// Botão dos meses: + Abrir mês / – Fechar mês
if (
  !portal.includes("+ Abrir mês") ||
  !portal.includes("– Fechar mês")
) {
  const monthButtonRegex =
    /<span\s+className="text-3xl font-light leading-none text-\[#8AA27A\]"\s+aria-hidden="true"\s*>\s*\{aberto\s*\?\s*"⌄"\s*:\s*"›"\}\s*<\/span>/m;

  if (!monthButtonRegex.test(portal)) {
    throw new Error(
      "Não encontrei o botão atual dos meses."
    );
  }

  portal = portal.replace(
    monthButtonRegex,
    `<span
      className="shrink-0 rounded-lg border border-[#C8D3C0] bg-white px-3 py-2 text-xs font-extrabold text-[#5E7357]"
      aria-hidden="true"
    >
      {aberto
        ? "– Fechar mês"
        : "+ Abrir mês"}
    </span>`
  );

  console.log("Corrigido: botão dos meses");
} else {
  console.log("Já estava corrigido: botão dos meses");
}

// Substituir o bloco antigo de recording_url pelo novo content_links + fallback
if (
  !portal.includes("sessao.content_links") ||
  !portal.includes('"Abrir conteúdo"')
) {
  const recordingRegex =
    /\{sessao\.recording_url\s*&&\s*\(\s*<a[\s\S]*?href=\{sessao\.recording_url\}[\s\S]*?>\s*▶\s*Assistir gravação\s*<\/a>\s*\)\}/m;

  if (!recordingRegex.test(portal)) {
    throw new Error(
      "Não encontrei o bloco antigo de Assistir gravação."
    );
  }

  const novoBloco = `{Array.isArray(
                                sessao.content_links
                              ) &&
                              sessao.content_links.filter(
                                (conteudo) =>
                                  conteudo?.url
                              ).length > 0 ? (
                                <>
                                  {sessao.content_links
                                    .filter(
                                      (conteudo) =>
                                        conteudo?.url
                                    )
                                    .map(
                                      (
                                        conteudo,
                                        index
                                      ) => (
                                        <a
                                          key={\`\${sessao.id}-conteudo-\${index}\`}
                                          href={
                                            conteudo.url
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566]"
                                        >
                                          ▶{" "}
                                          {conteudo.title?.trim() ||
                                            "Abrir conteúdo"}
                                        </a>
                                      )
                                    )}
                                </>
                              ) : (
                                sessao.recording_url && (
                                  <a
                                    href={
                                      sessao.recording_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566]"
                                  >
                                    ▶ Assistir gravação
                                  </a>
                                )
                              )}`;

  portal = portal.replace(
    recordingRegex,
    novoBloco
  );

  console.log(
    "Corrigido: vídeos e conteúdos em Minha Jornada"
  );
} else {
  console.log(
    "Já estava corrigido: vídeos e conteúdos"
  );
}

write(portalFile, portal);

console.log("");
console.log("CORREÇÃO V2 APLICADA COM SUCESSO.");
console.log("");
console.log("Agora rode:");
console.log('$env:NODE_OPTIONS="--max-old-space-size=4096"');
console.log("npm run build");
