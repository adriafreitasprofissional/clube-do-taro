export interface EnergizingColor {
  primary: string
  complementary: string[]
  energy: string
  guidance: string
}

export const ENERGIZING_COLORS: Record<
  number,
  EnergizingColor
> = {
  1: {
    primary: "Vermelho",
    complementary: ["Dourado", "Laranja"],
    energy: "Iniciativa, coragem e liderança.",
    guidance:
      "Use essas cores quando quiser fortalecer sua iniciativa, coragem para agir e capacidade de assumir a liderança."
  },

  2: {
    primary: "Rosa",
    complementary: ["Branco", "Prata"],
    energy: "Harmonia, sensibilidade e cooperação.",
    guidance:
      "Use essas cores para favorecer equilíbrio emocional, receptividade, diálogo e relações mais harmoniosas."
  },

  3: {
    primary: "Amarelo",
    complementary: ["Laranja", "Turquesa"],
    energy: "Criatividade, comunicação e alegria.",
    guidance:
      "Use essas cores quando precisar estimular criatividade, expressão, comunicação e leveza."
  },

  4: {
    primary: "Verde",
    complementary: ["Marrom", "Azul-marinho"],
    energy: "Estabilidade, organização e segurança.",
    guidance:
      "Use essas cores para favorecer concentração, organização, estabilidade e construção de resultados consistentes."
  },

  5: {
    primary: "Turquesa",
    complementary: ["Azul", "Amarelo"],
    energy: "Liberdade, movimento e expansão.",
    guidance:
      "Use essas cores quando precisar estimular movimento, abertura para mudanças, comunicação e novas experiências."
  },

  6: {
    primary: "Rosa",
    complementary: ["Verde", "Azul-claro"],
    energy: "Amor, acolhimento e equilíbrio.",
    guidance:
      "Use essas cores para fortalecer acolhimento, vínculos afetivos, equilíbrio e cuidado consigo e com os outros."
  },

  7: {
    primary: "Índigo",
    complementary: ["Violeta", "Azul profundo"],
    energy: "Introspecção, espiritualidade e conhecimento.",
    guidance:
      "Use essas cores em momentos de estudo, reflexão, meditação e busca por maior conexão interior."
  },

  8: {
    primary: "Dourado",
    complementary: ["Preto", "Verde-esmeralda"],
    energy: "Prosperidade, autoridade e realização.",
    guidance:
      "Use essas cores quando quiser fortalecer determinação, confiança, liderança, prosperidade e foco em resultados."
  },

  9: {
    primary: "Violeta",
    complementary: ["Branco", "Dourado"],
    energy: "Compaixão, espiritualidade e transformação.",
    guidance:
      "Use essas cores para favorecer encerramentos, transformação, espiritualidade, generosidade e conexão com propósitos maiores."
  }
}