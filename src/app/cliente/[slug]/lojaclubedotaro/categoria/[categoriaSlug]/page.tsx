export default async function Page({
  params,
}: {
  params: Promise<{ categoriaSlug: string }>;
}) {
  const { categoriaSlug } = await params;

  return (
    <div>
      Categoria: {categoriaSlug}
    </div>
  );
}