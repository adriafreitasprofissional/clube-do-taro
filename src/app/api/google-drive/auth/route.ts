import { google } from "googleapis";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_DRIVE_REDIRECT_URI ||
      "http://localhost:3000/api/google-drive/callback";

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error:
            "GOOGLE_DRIVE_CLIENT_ID ou GOOGLE_DRIVE_CLIENT_SECRET não configurados.",
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const state = randomUUID();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: true,
      scope: ["https://www.googleapis.com/auth/drive"],
      state,
    });

    const response = NextResponse.redirect(authUrl);

    response.cookies.set("google_drive_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("ERRO GOOGLE DRIVE AUTH:", error);

    return NextResponse.json(
      {
        error: "Não foi possível iniciar a autorização do Google Drive.",
      },
      { status: 500 }
    );
  }
}