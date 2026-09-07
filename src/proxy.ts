import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = (
    request.headers.get("host") || ""
  )
    .split(":")[0]
    .toLowerCase();

  const dominioTerapia =
    host === "adriafreitasterapias.com.br" ||
    host === "www.adriafreitasterapias.com.br";

  if (
    dominioTerapia &&
    request.nextUrl.pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/terapia";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};