import {
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

function rel(
  item: any
) {
  return Array.isArray(item)
    ? item[0] || null
    : item || null;
}

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

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("appointments")
    .select(`
      id,
      client_id,
      service_type,
      scheduled_at,
      status,
      charge_type,
      amount,
      club_clients (
        nome,
        nome_referencia
      )
    `)
    .eq(
      "professional",
      admin.professional
    )
    .order(
      "scheduled_at",
      {
        ascending: false,
      }
    );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  const itens =
    (data || []).map(
      (item: any) => {
        const cliente =
          rel(
            item.club_clients
          );

        return {
          id:
            item.id,
          client_name:
            cliente?.nome_referencia ||
            cliente?.nome ||
            "Cliente",
          service_type:
            item.service_type,
          scheduled_at:
            item.scheduled_at,
          status:
            item.status,
          charge_type:
            item.charge_type,
          amount:
            item.amount ===
              null ||
            item.amount ===
              undefined
              ? null
              : Number(
                  item.amount
                ),
        };
      }
    );

  const valorCadastrado =
    itens.reduce(
      (total, item) =>
        total +
        (item.amount || 0),
      0
    );

  const incluidosPacote =
    itens.filter(
      (item) =>
        item.charge_type ===
        "incluido_pacote"
    ).length;

  const comValor =
    itens.filter(
      (item) =>
        item.amount !== null &&
        item.amount > 0
    ).length;

  return NextResponse.json({
    resumo: {
      valor_cadastrado:
        valorCadastrado,
      itens_com_valor:
        comValor,
      incluidos_pacote:
        incluidosPacote,
      total_sessoes:
        itens.length,
    },
    itens,
  });
}
