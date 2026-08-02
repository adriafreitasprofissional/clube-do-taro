export function formatarData(data?: string | null): string {
  if (!data) return "—";

  const texto = String(data).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return "—";
  }

  const [ano, mes, dia] = texto.split("-");

  return `${dia}/${mes}/${ano}`;
}