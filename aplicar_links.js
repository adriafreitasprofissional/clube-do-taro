
const fs = require("fs");
const path = require("path");

const root = "C:\\Users\\MICRO\\clube-do-taro";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function replacePortal() {
  const file = path.join(
    root,
    "src",
    "app",
    "cliente",
    "[slug]",
    "page.tsx"
  );

  let text = read(file);

  // Remove a constante antiga do Lovable, se existir.
  text = text.replace(
    /\r?\nconst LINK_MENTORIA\s*=\s*\r?\n\s*"https:\/\/mystic-lunar-flow\.lovable\.app\/";\r?\n/,
    "\n"
  );

  if (text.includes('href={`/cliente/${slug}/agenda-mentoria`}')) {
    console.log("Portal: link interno ja existe.");
    write(file, text);
    return;
  }

  const hrefMarker = "href={LINK_MENTORIA}";
  const hrefIndex = text.indexOf(hrefMarker);

  if (hrefIndex === -1) {
    throw new Error(
      "Nao encontrei href={LINK_MENTORIA} no portal."
    );
  }

  const startMarker = "{ehDiamante && (";
  const start = text.lastIndexOf(startMarker, hrefIndex);

  if (start === -1) {
    throw new Error(
      "Nao encontrei o inicio do card Diamante."
    );
  }

  const closeAnchor = "</a>";
  const close = text.indexOf(closeAnchor, hrefIndex);

  if (close === -1) {
    throw new Error(
      "Nao encontrei o fechamento do card de mentoria."
    );
  }

  const afterClose = text.indexOf(")}", close + closeAnchor.length);

  if (afterClose === -1) {
    throw new Error(
      "Nao encontrei o fechamento do bloco Diamante."
    );
  }

  const oldBlock = text.slice(start, afterClose + 2);

  if (!oldBlock.includes("Agendamento de Mentoria")) {
    throw new Error(
      "O bloco encontrado nao parece ser o card de Agendamento de Mentoria."
    );
  }

  const classMatch = oldBlock.match(/className="([^"]+)"/);
  const className = classMatch
    ? classMatch[1]
    : "rounded-2xl border border-yellow-400/50 bg-yellow-500/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-300";

  const newBlock = `{ehDiamante && (
  <Link
    href={\`/cliente/\${slug}/agenda-mentoria\`}
    className="${className}"
  >
    <p className="text-3xl">🗓️</p>

    <h3 className="mt-4 text-xl font-extrabold text-yellow-300">
      Agendamento de Mentoria
    </h3>

    <p className="mt-3 text-sm leading-6 text-purple-50">
      Veja os horarios individuais e confirme as mentorias em grupo.
    </p>

    <p className="mt-5 text-sm font-bold text-yellow-200">
      Abrir minha agenda →
    </p>
  </Link>
)}`;

  text =
    text.slice(0, start) +
    newBlock +
    text.slice(afterClose + 2);

  write(file, text);
  console.log("Portal: card de mentoria conectado.");
}

function replaceAdminAgenda() {
  const file = path.join(
    root,
    "src",
    "app",
    "admin",
    "agenda",
    "page.tsx"
  );

  let text = read(file);

  if (!text.includes('import Link from "next/link";')) {
    const routerImport =
      'import { useRouter } from "next/navigation";';

    if (!text.includes(routerImport)) {
      throw new Error(
        "Nao encontrei o import useRouter no ADM da Agenda."
      );
    }

    text = text.replace(
      routerImport,
      routerImport + '\nimport Link from "next/link";'
    );
  }

  if (text.includes('href="/admin/agenda/mentorias"')) {
    console.log("ADM: botao Agenda de Mentorias ja existe.");
    write(file, text);
    return;
  }

  const buttonText = "+ Novo atendimento";
  const buttonTextIndex = text.indexOf(buttonText);

  if (buttonTextIndex === -1) {
    throw new Error(
      "Nao encontrei o botao + Novo atendimento."
    );
  }

  const buttonStart = text.lastIndexOf("<button", buttonTextIndex);
  const buttonClose = text.indexOf("</button>", buttonTextIndex);

  if (buttonStart === -1 || buttonClose === -1) {
    throw new Error(
      "Nao consegui localizar o bloco do botao + Novo atendimento."
    );
  }

  const oldButton = text.slice(
    buttonStart,
    buttonClose + "</button>".length
  );

  const newButtons = `<div className="flex flex-wrap gap-3">
            <Link
              href="/admin/agenda/mentorias"
              className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-400/20"
            >
              Agenda de Mentorias
            </Link>

            ${oldButton}
          </div>`;

  text =
    text.slice(0, buttonStart) +
    newButtons +
    text.slice(buttonClose + "</button>".length);

  write(file, text);
  console.log("ADM: botao Agenda de Mentorias adicionado.");
}

try {
  replacePortal();
  replaceAdminAgenda();

  console.log("");
  console.log("SUCESSO");
  console.log("Portal Diamante conectado a agenda interna.");
  console.log("ADM da Agenda ganhou o botao Agenda de Mentorias.");
} catch (error) {
  console.error("");
  console.error("ERRO:");
  console.error(error.message);
  process.exit(1);
}
