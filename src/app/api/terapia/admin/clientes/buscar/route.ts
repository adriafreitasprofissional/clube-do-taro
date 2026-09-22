import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../../_auth";

type Pessoa = {
  id: string;
  nome: string | null;
  nome_referencia: string | null;
  email: string | null;
  whatsapp: string | null;
  slug: string | null;
  status: string | null;
};

export async function GET(
  request: NextRequest
) {
  const admin =
    await getTherapyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Acesso não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const termo =
      String(
        request.nextUrl
          .searchParams
          .get("q") || ""
      ).trim();

    if (
      termo.length < 2
    ) {
      return NextResponse.json({
        pessoas: [],
      });
    }

    const colunas =
      "id, nome, nome_referencia, email, whatsapp, slug, status";

    const buscas = [
      supabaseAdmin
        .from("club_clients")
        .select(colunas)
        .ilike(
          "nome",
          `%${termo}%`
        )
        .limit(8),

      supabaseAdmin
        .from("club_clients")
        .select(colunas)
        .ilike(
          "nome_referencia",
          `%${termo}%`
        )
        .limit(8),

      supabaseAdmin
        .from("club_clients")
        .select(colunas)
        .ilike(
          "email",
          `%${termo}%`
        )
        .limit(8),

      supabaseAdmin
        .from("club_clients")
        .select(colunas)
        .ilike(
          "whatsapp",
          `%${termo}%`
        )
        .limit(8),
    ];

    const resultados =
      await Promise.all(
        buscas
      );

    const mapa =
      new Map<
        string,
        Pessoa
      >();

    for (
      const resultado
      of resultados
    ) {
      if (
        resultado.error
      ) {
        throw resultado.error;
      }

      for (
        const pessoa
        of resultado.data || []
      ) {
        mapa.set(
          pessoa.id,
          pessoa as Pessoa
        );
      }
    }

    const pessoas =
      Array.from(
        mapa.values()
      ).slice(0, 12);

    const ids =
      pessoas.map(
        (pessoa) =>
          pessoa.id
      );

    let vinculos: any[] =
      [];

    if (ids.length) {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from(
          "therapy_client_access"
        )
        .select(
          "client_id, professional, active"
        )
        .in(
          "client_id",
          ids
        )
        .eq(
          "active",
          true
        );

      if (error) {
        throw error;
      }

      vinculos =
        data || [];
    }

    const resposta =
      pessoas.map(
        (pessoa) => {
          const daPessoa =
            vinculos.filter(
              (item: any) =>
                item.client_id ===
                pessoa.id
            );

          return {
            id:
              pessoa.id,
            nome:
              pessoa.nome || "",
            nome_referencia:
              pessoa.nome_referencia ||
              "",
            email:
              pessoa.email || "",
            whatsapp:
              pessoa.whatsapp || "",
            slug:
              pessoa.slug || "",
            status:
              pessoa.status || "",
            vinculado_ao_profissional:
              daPessoa.some(
                (item: any) =>
                  item.professional ===
                  admin.professional
              ),
            vinculado_em_terapia:
              daPessoa.length > 0,
          };
        }
      );

    return NextResponse.json({
      pessoas:
        resposta,
    });
  } catch (
    error: unknown
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao buscar pessoas.",
      },
      { status: 500 }
    );
  }
}
