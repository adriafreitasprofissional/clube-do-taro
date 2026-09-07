type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
};

export default function CheckBoxCard({
  values,
  onChange,
  options,
}: Props) {
  function toggle(item: string) {
    if (values.includes(item)) {
      onChange(
        values.filter(
          (valor) => valor !== item
        )
      );
      return;
    }

    onChange([...values, item]);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((item) => {
        const selecionada =
          values.includes(item);

        return (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
              selecionada
                ? "border-[#8AA27A] bg-[#8AA27A] text-white shadow"
                : "border-[#DCCFB8] bg-[#F7F1E4] text-[#5E7357] hover:border-[#8AA27A]"
            }`}
          >
            {selecionada
              ? "✓ "
              : ""}
            {item}
          </button>
        );
      })}
    </div>
  );
}
