interface Props {
  text?: string;
}

export default function BuyButton({
  text = "Comprar",
}: Props) {
  return (
    <button
      type="button"
      className="w-full rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400 transition"
    >
      {text}
    </button>
  );
}