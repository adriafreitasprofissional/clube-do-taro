import { redirect } from "next/navigation";

export default async function AdminTerapiaAnamneseCompat({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  redirect(
    `/terapia/admin/anamneses/${encodeURIComponent(clientId)}`
  );
}
