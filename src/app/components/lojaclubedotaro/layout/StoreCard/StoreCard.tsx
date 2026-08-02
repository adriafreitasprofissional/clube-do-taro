interface Props {
  title?: string;
  description?: string;
}

export default function StoreCard({
  title = "Produto",
  description = "Componente temporário.",
}: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/30 bg-[#17142d] p-6 shadow-lg">
      <div className="flex h-40 items-center justify-center rounded-xl bg-[#0d0b1d] text-purple-400">
        Imagem
      </div>

      <h3 className="mt-4 text-lg font-bold text-yellow-400">
        {title}
      </h3>

      <p className="mt-2 text-sm text-purple-200">
        {description}
      </p>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-purple-700 px-4 py-3 font-bold text-white transition hover:bg-purple-600"
      >
        Ver Produto
      </button>
    </div>
  );
}