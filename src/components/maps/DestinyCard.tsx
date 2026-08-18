interface Props {
  number: number
  chapter: any
}

export function DestinyCard({
  number,
  chapter,
}: Props) {

  if (!chapter) return null

  return (

    <div className="rounded-xl border border-amber-700 bg-zinc-900 p-6">

      <h3 className="text-2xl font-bold text-amber-300">
        {chapter.title}
      </h3>

      <p className="mt-4 text-5xl font-bold text-yellow-400">
        {number}
      </p>

      <div className="mt-6 whitespace-pre-line leading-8 text-gray-200">
        {chapter.content}
      </div>

    </div>

  )

}