type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export default function SliderInput({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  leftLabel = "Baixo",
  rightLabel = "Alto",
}: Props) {
  return (
    <div className="space-y-3 rounded-2xl border border-[#E8D3C5] bg-[#F7F1E4] p-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value
            )
          )
        }
        className="w-full accent-[#8AA27A]"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-[#6C8465]">
        <span>{leftLabel}</span>

        <span className="rounded-full bg-[#F2DDD0] px-3 py-1 text-sm font-black text-[#5E7357]">
          {value}
        </span>

        <span className="text-right">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}
