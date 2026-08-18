import { MapSettings } from "@/types/map"

export class MapModel {

  constructor(
    public settings: MapSettings
  ) {}

  get hasNumerology() {
    return this.settings.numerology
  }

  get hasAstrology() {
    return this.settings.astrology
  }

  get hasNominal() {
    return this.settings.nominal
  }

  get hasCards() {
    return this.settings.cards
  }

}
