import { google } from "googleapis";
import { Readable } from "stream";

const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function getDriveClient() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const redirectUri =
    process.env.GOOGLE_DRIVE_REDIRECT_URI ||
    "http://localhost:3000/api/google-drive/callback";

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Credenciais do Google Drive não configuradas.");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
}

function escaparQuery(valor: string) {
  return valor.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

async function localizarPasta(nome: string, parentId: string) {
  const drive = getDriveClient();
  const nomeSeguro = escaparQuery(nome);

  const response = await drive.files.list({
    q: [
      `'${parentId}' in parents`,
      `name = '${nomeSeguro}'`,
      `mimeType = '${FOLDER_MIME_TYPE}'`,
      "trashed = false",
    ].join(" and "),
    fields: "files(id,name,parents)",
    pageSize: 10,
    spaces: "drive",
  });

  return response.data.files?.[0] || null;
}

async function criarPasta(nome: string, parentId: string) {
  const drive = getDriveClient();

  const response = await drive.files.create({
    requestBody: {
      name: nome,
      mimeType: FOLDER_MIME_TYPE,
      parents: [parentId],
    },
    fields: "id,name,parents",
  });

  if (!response.data.id) {
    throw new Error(`Não foi possível criar a pasta ${nome}.`);
  }

  return response.data;
}

export async function garantirPasta(
  nome: string,
  parentId: string
) {
  const existente = await localizarPasta(nome, parentId);

  if (existente?.id) {
    return {
      id: existente.id,
      name: existente.name || nome,
      criada: false,
    };
  }

  const nova = await criarPasta(nome, parentId);

  return {
    id: nova.id!,
    name: nova.name || nome,
    criada: true,
  };
}

export async function garantirPastaAssinante({
  slug,
  data = new Date(),
}: {
  slug: string;
  data?: Date;
}) {
  const rootId =
    process.env.GOOGLE_DRIVE_CLUBE_ROOT_FOLDER_ID;

  if (!rootId) {
    throw new Error(
      "GOOGLE_DRIVE_CLUBE_ROOT_FOLDER_ID não configurado."
    );
  }

  const ano = String(data.getFullYear());
  const mes = MESES[data.getMonth()];

  const pastaAno = await garantirPasta(ano, rootId);

  const pastaMes = await garantirPasta(
    mes,
    pastaAno.id
  );

  const pastaAssinantes = await garantirPasta(
    "assinantes",
    pastaMes.id
  );

  const pastaCliente = await garantirPasta(
    slug,
    pastaAssinantes.id
  );

  return {
    ano,
    mes,
    rootFolderId: rootId,
    yearFolderId: pastaAno.id,
    monthFolderId: pastaMes.id,
    subscribersFolderId: pastaAssinantes.id,
    clientFolderId: pastaCliente.id,
    criada: pastaCliente.criada,
  };
}

export async function salvarArquivoDrive({
  folderId,
  nomeArquivo,
  mimeType,
  buffer,
}: {
  folderId: string;
  nomeArquivo: string;
  mimeType: string;
  buffer: Buffer;
}) {
  const drive = getDriveClient();

  const nomeSeguro = escaparQuery(nomeArquivo);

  const existentes = await drive.files.list({
    q: [
      `'${folderId}' in parents`,
      `name = '${nomeSeguro}'`,
      "trashed = false",
    ].join(" and "),
    fields: "files(id,name,webViewLink,webContentLink)",
    pageSize: 10,
  });

  const existente = existentes.data.files?.[0];

  if (existente?.id) {
    const atualizado = await drive.files.update({
      fileId: existente.id,
      media: {
        mimeType,
        body: Readable.from([buffer]),
      },
      fields: "id,name,webViewLink,webContentLink,parents",
    });

    return atualizado.data;
  }

  const criado = await drive.files.create({
    requestBody: {
      name: nomeArquivo,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from([buffer]),
    },
    fields: "id,name,webViewLink,webContentLink,parents",
  });

  return criado.data;
}
