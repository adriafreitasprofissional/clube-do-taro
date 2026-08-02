interface Props {
  title?: string;
}

export default function ProductInfo({
  title = "Produto",
}: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/30 bg-[#17142d] p-6">
      <h2 className="text-2xl font-bold text-yellow-400">
        {title}
      </h2>

      <p className="mt-4 text-purple-200">
        Informações do produto.
      </p>
    </div>
  );
}