interface Props {
  title?: string;
  price?: string;
}

export default function ProductCard({
  title = "Produto",
  price = "R$ 0,00",
}: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/30 bg-[#17142d] p-5">
      <div className="h-40 rounded-xl bg-[#0d0b1d]" />

      <h3 className="mt-4 text-lg font-bold text-yellow-400">
        {title}
      </h3>

      <p className="mt-2 text-purple-200">{price}</p>
    </div>
  );
}