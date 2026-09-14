import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { garantirPastaAssinante } from "@/lib/google-drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nome,
      nomeReferencia,
      email,
      whatsapp,
      tipoAssinatura = "assinatura",
      plano,
      genero = "",
      senhaInicial,
      dataInicio = new Date().toISOString().slice(0, 10),
    } = body;

    let senha = senhaInicial;

    if (!senha) {
      senha = crypto
        .randomUUID()
        .replace(/-/g, "")
        .substring(0, 8);
    }

    // 1. Gerar slug da assinante
    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

    // 2. Criar usuário no Supabase Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: {
          display_name: nome,
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const authId = authUser.user?.id;

    if (!authId) {
      return NextResponse.json(
        { error: "Não foi possível obter o ID do usuário." },
        { status: 400 }
      );
    }

    // 3. Criar assinante no banco
    const { data: cliente, error: clientError } =
      await supabaseAdmin
        .from("club_clients")
        .insert({
          id: authId,
          nome,
          nome_referencia: nomeReferencia,
          email,
          whatsapp,
          plano: plano.toLowerCase(),
          genero,
          tipo_assinatura: tipoAssinatura,
          senha_inicial: senha,
          data_inicio: dataInicio,
          slug,
          status: "Ativo",
          produto: "Clube do Tarô",
          acesso_app: true,
          direcionamento_exclusivo: true,
        })
        .select()
        .single();

    if (clientError) {
      // Se falhar no club_clients, remove o usuário do Auth
      await supabaseAdmin.auth.admin.deleteUser(authId);

      console.error(
        "ERRO AO CRIAR CLIENTE:",
        clientError
      );

      return NextResponse.json(
        {
          error: clientError.message,
          auth_user_removed: true,
        },
        { status: 400 }
      );
    }

    const clienteId = cliente.id;

    console.log(
      "CLIENTE ID DA TABELA:",
      clienteId
    );

    // 4. Criar ou localizar pasta da assinante no Google Drive
    // Falha no Drive NÃO impede o cadastro da assinante.
    let driveFolderId: string | null = null;
    let driveFolderStatus:
      | "ok"
      | "erro" = "ok";

    try {
      const dataPasta = new Date();

      const pastaDrive =
        await garantirPastaAssinante({
          slug,
          data: dataPasta,
        });

      driveFolderId =
        pastaDrive.clientFolderId;

      // 5. Registrar pasta do mês no Supabase
      const {
        error: driveDatabaseError,
      } = await supabaseAdmin
        .from("club_client_drive_folders")
        .upsert(
          {
            client_id: clienteId,
            year: dataPasta.getFullYear(),
            month:
              dataPasta.getMonth() + 1,
            drive_folder_id:
              pastaDrive.clientFolderId,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "client_id,year,month",
          }
        );

      if (driveDatabaseError) {
        console.error(
          "ERRO AO REGISTRAR PASTA DO DRIVE NO SUPABASE:",
          driveDatabaseError
        );

        driveFolderStatus = "erro";
      } else {
        console.log(
          `PASTA GOOGLE DRIVE DA ASSINANTE: ${slug}`,
          pastaDrive.clientFolderId
        );

        console.log(
          pastaDrive.criada
            ? "NOVA PASTA CRIADA"
            : "PASTA EXISTENTE LOCALIZADA"
        );
      }
    } catch (driveError) {
      driveFolderStatus = "erro";

      console.error(
        "ERRO GOOGLE DRIVE - CADASTRO CONTINUA NORMALMENTE:",
        driveError
      );
    }

    // 6. Cadastro concluído
    return NextResponse.json({
      success: true,
      userId: clienteId,
      slug,
      drive: {
        status: driveFolderStatus,
        folderId: driveFolderId,
      },
    });
  } catch (error) {
    console.error(
      "ERRO GERAL AO CRIAR ASSINANTE:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}