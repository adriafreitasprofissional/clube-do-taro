export interface Card {
  position: number
  name: string
  arcana?: string
  meaning?: string
  reversed?: boolean
}

export interface CardsResult {
  success: boolean

  deck?: string
  spread?: string

  cards?: Card[]

  interpretation?: string

  message?: string
}

export class CardsEngine {

  execute(): CardsResult {

    /**
     * TODO
     * Integrar:
     * - Tarot Rider Waite
     * - Baralho Cigano
     * - Baralho da Vovó Cigana
     * - Oráculos
     */

    return {
      success: true,

      deck: "",
      spread: "",

      cards: [],

      interpretation: "",
    }

  }

}