export interface Cliente {
  id: string;
  slug: string;
  nome: string;

  plano: string;
  status: string;

  tipo_assinatura: "mensal" | "anual" | "cortesia";

  valor_mensal: number;
  valor_anual: number;

  data_inicio: string | null;
  data_fim_assinatura: string | null;

  proximo_vencimento: string | null;
  dia_vencimento: number | null;
}