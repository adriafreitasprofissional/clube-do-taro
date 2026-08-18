import { LifeLessonCard } from "./LifeLessonCard"
import { DestinyCard } from "./DestinyCard"

interface Props {
  numerology: any
  interpretation: any
}

export function NumerologySection({
  numerology,
  interpretation,
}: Props) {

  const chapters = interpretation?.chapters ?? []

  const lifeLesson = chapters.find(
    (c: any) => c.id === "lifeLesson"
  )

  const destiny = chapters.find(
    (c: any) => c.id === "destiny"
  )

  return (

    <section className="space-y-8">

      <h2 className="text-3xl font-bold">
        Numerologia Cabalística
      </h2>

      <LifeLessonCard
        number={numerology.lifeLesson}
        chapter={lifeLesson}
      />

      <DestinyCard
        number={numerology.destiny}
        chapter={destiny}
      />

    </section>

  )

}