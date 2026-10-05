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

function backup(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo não encontrado: ${file}`);
  }

  fs.copyFileSync(
    file,
    `${file}.backup-videos-${stamp}`
  );
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
  console.log(`Atualizado: ${file}`);
}

function replaceOnce(content, from, to, label) {
  if (!content.includes(from)) {
    if (content.includes(to)) {
      console.log(`Já estava corrigido: ${label}`);
      return content;
    }

    throw new Error(
      `Não encontrei o trecho esperado para: ${label}`
    );
  }

  console.log(`Corrigido: ${label}`);
  return content.replace(from, to);
}

// ======================================================
// 1) API REAL DO PORTAL: devolver content_links
// ======================================================
backup(portalApiFile);
let portalApi = read(portalApiFile);

if (
  !/session_title,\s*recording_url,\s*content_links,/.test(
    portalApi
  )
) {
  portalApi = replaceOnce(
    portalApi,
    `    session_title,
    recording_url,
    client_report,`,
    `    session_title,
    recording_url,
    content_links,
    client_report,`,
    "content_links na API do portal"
  );
}

write(portalApiFile, portalApi);

// ======================================================
// 2) PREVIEW DO ADM: devolver content_links também
// ======================================================
backup(previewApiFile);
let previewApi = read(previewApiFile);

if (
  !/session_title,\s*recording_url,\s*content_links,/.test(
    previewApi
  )
) {
  previewApi = replaceOnce(
    previewApi,
    `        session_title,
        recording_url,
        client_report,`,
    `        session_title,
        recording_url,
        content_links,
        client_report,`,
    "content_links no Ver como paciente"
  );
}

// Corrige três textos antigos de codificação que ainda podem existir
previewApi = previewApi
  .replaceAll("nÒ£o", "não")
  .replaceAll("NÒ£o", "Não")
  .replaceAll("nÒ£o", "não");

write(previewApiFile, previewApi);

// ======================================================
// 3) PORTAL: tipo, vídeos/conteúdos e botões intuitivos
// ======================================================
backup(portalFile);
let portal = read(portalFile);

// Tipo do content_links
if (!portal.includes("content_links:")) {
  portal = replaceOnce(
    portal,
    `  recording_url: string | null;
  client_report: string | null;`,
    `  recording_url: string | null;
  content_links:
    | {
        title: string;
        url: string;
      }[]
    | null;
  client_report: string | null;`,
    "tipo content_links no portal"
  );
}

// Corrige um texto residual no PDF
portal = portal.replaceAll(
  'pdf.text("SESSÒO"',
  'pdf.text("SESSÃO"'
);

// Botão principal Minha Jornada
const oldJourneyButton = `    <span
      className="shrink-0 text-3xl font-light leading-none text-[#8AA27A]"
      aria-hidden="true"
    >
      {jornadaAberta ? "⌄" : "›"}
    </span>`;

const newJourneyButton = `    <span
      className="shrink-0 rounded-xl border border-[#B9C7AE] bg-[#F3F7F0] px-4 py-2 text-sm font-extrabold text-[#5E7357]"
      aria-hidden="true"
    >
      {jornadaAberta
        ? "– Fechar jornada"
        : "+ Abrir jornada"}
    </span>`;

if (portal.includes(oldJourneyButton)) {
  portal = portal.replace(
    oldJourneyButton,
    newJourneyButton
  );
  console.log("Corrigido: botão Minha Jornada");
} else if (
  portal.includes("+ Abrir jornada") &&
  portal.includes("– Fechar jornada")
) {
  console.log("Já estava corrigido: botão Minha Jornada");
} else {
  throw new Error(
    "Não encontrei o botão atual de Minha Jornada."
  );
}

// Botão de cada mês
const oldMonthButton = `                    <span
                      className="text-3xl font-light leading-none text-[#8AA27A]"
                      aria-hidden="true"
                    >
                      {aberto ? "⌄" : "›"}
                    </span>`;

const newMonthButton = `                    <span
                      className="shrink-0 rounded-lg border border-[#C8D3C0] bg-white px-3 py-2 text-xs font-extrabold text-[#5E7357]"
                      aria-hidden="true"
                    >
                      {aberto
                        ? "– Fechar mês"
                        : "+ Abrir mês"}
                    </span>`;

if (portal.includes(oldMonthButton)) {
  portal = portal.replace(
    oldMonthButton,
    newMonthButton
  );
  console.log("Corrigido: botão dos meses");
} else if (
  portal.includes("+ Abrir mês") &&
  portal.includes("– Fechar mês")
) {
  console.log("Já estava corrigido: botão dos meses");
} else {
  throw new Error(
    "Não encontrei o botão atual dos meses."
  );
}

// Conteúdos/vídeos salvos em content_links
const oldRecordingBlock = `                              {sessao.recording_url && (
                                <a
                                  href={sessao.recording_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex rounded-xl bg-[#8AA27A] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566]"
                                >
                                  ▶ Assistir gravação
                                </a>
                              )}`;

const newRecordingBlock = `                              {Array.isArray(
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
                                          key={\`${"${sessao.id}"}-conteudo-${"${index}"}\`}
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

if (portal.includes(oldRecordingBlock)) {
  portal = portal.replace(
    oldRecordingBlock,
    newRecordingBlock
  );
  console.log(
    "Corrigido: vídeos e conteúdos em Minha Jornada"
  );
} else if (
  portal.includes("sessao.content_links") &&
  portal.includes('"Abrir conteúdo"')
) {
  console.log(
    "Já estava corrigido: vídeos e conteúdos"
  );
} else {
  throw new Error(
    "Não encontrei o bloco antigo de gravação da Jornada."
  );
}

write(portalFile, portal);

console.log("");
console.log("CORREÇÃO APLICADA COM SUCESSO.");
console.log("");
console.log("Agora o portal:");
console.log("- lê os links já salvos em content_links;");
console.log("- mostra todos os vídeos/conteúdos da sessão;");
console.log("- mantém recording_url como compatibilidade antiga;");
console.log("- usa + Abrir jornada / – Fechar jornada;");
console.log("- usa + Abrir mês / – Fechar mês.");
console.log("");
console.log("Agora rode npm run build.");
