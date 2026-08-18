interface Props {
  title: string
  value: string | number
}

export function NumerologyCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-2xl bg-[#2B1F46] p-6">
      <p className="text-zinc-400">
        {title}
      </p>

      <p className="mt-3 text-5xl font-bold text-yellow-400">
        {value}
      </p>
    </div>
  )
}