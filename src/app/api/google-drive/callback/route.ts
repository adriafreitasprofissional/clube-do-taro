import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function salvarRefreshTokenNoEnv(refreshToken: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "A gravação automática do refresh token só pode ser feita localmente."
    );
  }

  const envPath = path.join(process.cwd(), ".env.local");

  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  const linha = `GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}`;

  if (/^GOOGLE_DRIVE_REFRESH_TOKEN=.*$/m.test(envContent)) {
    envContent = envContent.replace(
      /^GOOGLE_DRIVE_REFRESH_TOKEN=.*$/m,
      linha
    );
  } else {
    envContent += `\n${linha}\n`;
  }

  fs.writeFileSync(envPath, envContent, "utf8");
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const returnedState = req.nextUrl.searchParams.get("state");
    const savedState = req.cookies.get("google_drive_oauth_state")?.value;

    if (!code) {
      return NextResponse.json(
        { error: "Código de autorização não recebido." },
        { status: 400 }
      );
    }

    if (!returnedState || !savedState || returnedState !== savedState) {
      return NextResponse.json(
        { error: "Estado OAuth inválido. Autorize novamente." },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_DRIVE_REDIRECT_URI ||
      "http://localhost:3000/api/google-drive/callback";

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Credenciais Google não configuradas." },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        {
          error:
            "O Google não retornou um novo refresh token. Autorize novamente.",
        },
        { status: 400 }
      );
    }

    salvarRefreshTokenNoEnv(tokens.refresh_token);

    const response = NextResponse.json({
      success: true,
      message:
        "Google Drive conectado com sucesso. O token foi salvo diretamente no .env.local. Reinicie o servidor.",
    });

    response.cookies.delete("google_drive_oauth_state");

    return response;
  } catch (error) {
    console.error("ERRO CALLBACK GOOGLE DRIVE:", error);

    return NextResponse.json(
      {
        error: "Erro ao finalizar autorização do Google Drive.",
      },
      { status: 500 }
    );
  }
}