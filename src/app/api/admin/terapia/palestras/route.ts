import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

const CAMPOS = `
  id,
  professional_id,
  title,
  slug,
  subtitle,
  description,
  category,
  video_url,
  cover_url,
  duration_minutes,
  visibility,
  active,
  created_at,
  updated_at,
  therapy_professionals (
    id,
    name,
    slug
  )
`;

function bearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") || "";

  return authorization.startsWith("Bearer ")
    ? authorization
        .slice("Bearer ".length)
        .trim()
    : "";
}

async function autorizarAdmin(
  request: NextRequest
) {
  const token = bearerToken(request);

  if (!token) {
    return false;
  }

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);

  if (!user?.email) {
    return false;
  }

  const { data: admin } =
    await supabaseAdmin
      .from("club_clients")
      .select("id")
      .ilike("email", user.email)
      .eq("role", "admin")
      .maybeSingle();

  return Boolean(admin);
}

function criarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function profissionalPadrao() {
  const { data, error } =
    await supabaseAdmin
      .from("therapy_professionals")
      .select("id, name, slug")
      .eq("slug", "adria-freitas")
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "Profissional Ádria Freitas não encontrada."
    );
  }

  return data;
}

async function resolverProfissional(
  valor?: unknown
) {
  const id = String(valor || "").trim();

  if (id) {
    const { data, error } =
      await supabaseAdmin
        .from("therapy_professionals")
        .select("id, name, slug")
        .eq("id", id)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  return profissionalPadrao();
}

async function criarSlugUnico({
  title,
  professionalId,
  excluirId,
}: {
  title: string;
  professionalId: string;
  excluirId?: string | null;
}) {
  const base =
    criarSlug(title) || "mini-palestra";

  let slug = base;
  let contador = 2;

  while (true) {
    let consulta =
      supabaseAdmin
        .from("therapy_lectures")
        .select("id")
        .eq(
          "professional_id",
          professionalId
        )
        .eq("slug", slug);

    if (excluirId) {
      consulta =
        consulta.neq("id", excluirId);
    }

    const { data, error } =
      await consulta.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return slug;
    }

    slug = `${base}-${contador}`;
    contador += 1;
  }
}

function normalizarVisibilidade(
  valor: unknown
) {
  const visibility =
    String(valor || "patients").trim();

  if (
    visibility === "public" ||
    visibility === "patients" ||
    visibility === "private"
  ) {
    return visibility;
  }

  return "patients";
}

function normalizarDuracao(valor: unknown) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const numero = Number(valor);

  if (
    !Number.isFinite(numero) ||
    numero <= 0
  ) {
    return null;
  }

  return Math.round(numero);
}

export async function GET(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const professionalId =
    request.nextUrl.searchParams
      .get("professional_id")
      ?.trim();

  let consulta =
    supabaseAdmin
      .from("therapy_lectures")
      .select(CAMPOS)
      .order("created_at", {
        ascending: false,
      });

  if (professionalId) {
    consulta =
      consulta.eq(
        "professional_id",
        professionalId
      );
  }

  const { data, error } =
    await consulta;

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    palestras: data || [],
  });
}

export async function POST(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body =
      await request.json();

    const title =
      String(
        body.title || ""
      ).trim();

    const videoUrl =
      String(
        body.video_url || ""
      ).trim();

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Informe o título da mini palestra.",
        },
        { status: 400 }
      );
    }

    if (!videoUrl) {
      return NextResponse.json(
        {
          error:
            "Informe o link do vídeo.",
        },
        { status: 400 }
      );
    }

    const profissional =
      await resolverProfissional(
        body.professional_id
      );

    const slug =
      await criarSlugUnico({
        title,
        professionalId:
          profissional.id,
      });

    const registro = {
      professional_id:
        profissional.id,

      title,
      slug,

      subtitle:
        String(
          body.subtitle || ""
        ).trim() || null,

      description:
        String(
          body.description || ""
        ).trim() || null,

      category:
        String(
          body.category || ""
        ).trim() || null,

      video_url: videoUrl,

      cover_url:
        String(
          body.cover_url || ""
        ).trim() || null,

      duration_minutes:
        normalizarDuracao(
          body.duration_minutes
        ),

      visibility:
        normalizarVisibilidade(
          body.visibility
        ),

      active:
        body.active === undefined
          ? true
          : Boolean(body.active),
    };

    const { data, error } =
      await supabaseAdmin
        .from("therapy_lectures")
        .insert(registro)
        .select(CAMPOS)
        .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        palestra: data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao cadastrar mini palestra.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body =
      await request.json();

    const id =
      String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Mini palestra não informada.",
        },
        { status: 400 }
      );
    }

    const { data: atual } =
      await supabaseAdmin
        .from("therapy_lectures")
        .select(
          "id, professional_id, title, slug"
        )
        .eq("id", id)
        .maybeSingle();

    if (!atual) {
      return NextResponse.json(
        {
          error:
            "Mini palestra não encontrada.",
        },
        { status: 404 }
      );
    }

    const title =
      String(
        body.title ??
          atual.title
      ).trim();

    const videoUrl =
      body.video_url !== undefined
        ? String(
            body.video_url || ""
          ).trim()
        : undefined;

    if (!title) {
      return NextResponse.json(
        {
          error:
            "O título não pode ficar vazio.",
        },
        { status: 400 }
      );
    }

    if (
      videoUrl !== undefined &&
      !videoUrl
    ) {
      return NextResponse.json(
        {
          error:
            "O vídeo não pode ficar vazio.",
        },
        { status: 400 }
      );
    }

    let slug = atual.slug;

    if (
      title !== atual.title
    ) {
      slug =
        await criarSlugUnico({
          title,
          professionalId:
            atual.professional_id,
          excluirId: id,
        });
    }

    const alteracoes: Record<
      string,
      unknown
    > = {
      title,
      slug,
      updated_at:
        new Date().toISOString(),
    };

    if (
      body.subtitle !== undefined
    ) {
      alteracoes.subtitle =
        String(
          body.subtitle || ""
        ).trim() || null;
    }

    if (
      body.description !== undefined
    ) {
      alteracoes.description =
        String(
          body.description || ""
        ).trim() || null;
    }

    if (
      body.category !== undefined
    ) {
      alteracoes.category =
        String(
          body.category || ""
        ).trim() || null;
    }

    if (
      body.video_url !== undefined
    ) {
      alteracoes.video_url =
        videoUrl;
    }

    if (
      body.cover_url !== undefined
    ) {
      alteracoes.cover_url =
        String(
          body.cover_url || ""
        ).trim() || null;
    }

    if (
      body.duration_minutes !==
      undefined
    ) {
      alteracoes.duration_minutes =
        normalizarDuracao(
          body.duration_minutes
        );
    }

    if (
      body.visibility !== undefined
    ) {
      alteracoes.visibility =
        normalizarVisibilidade(
          body.visibility
        );
    }

    if (
      body.active !== undefined
    ) {
      alteracoes.active =
        Boolean(body.active);
    }

    const { data, error } =
      await supabaseAdmin
        .from("therapy_lectures")
        .update(alteracoes)
        .eq("id", id)
        .select(CAMPOS)
        .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      palestra: data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar mini palestra.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  if (
    !(await autorizarAdmin(request))
  ) {
    return NextResponse.json(
      {
        error:
          "Acesso administrativo não autorizado.",
      },
      { status: 401 }
    );
  }

  const id =
    request.nextUrl.searchParams
      .get("id")
      ?.trim();

  if (!id) {
    return NextResponse.json(
      {
        error:
          "Mini palestra não informada.",
      },
      { status: 400 }
    );
  }

  /*
   * Não apagamos de verdade.
   * Mantemos histórico de pacientes
   * e apenas desativamos o conteúdo.
   */
  const { error } =
    await supabaseAdmin
      .from("therapy_lectures")
      .update({
        active: false,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}