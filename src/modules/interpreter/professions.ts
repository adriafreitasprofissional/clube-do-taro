export interface ProfessionInterpretation {
  areas: string
  professions: string
  guidance: string
}

export const PROFESSIONS: Record<number, ProfessionInterpretation> = {
  1: {
    areas:
      "Liderança, empreendedorismo, gestão, inovação, autonomia e criação de novos projetos.",

    professions:
      "Empreendedora, gestora, diretora, líder de projetos, consultora, estrategista, profissional autônoma, fundadora de negócios ou especialista que trabalhe com autonomia.",

    guidance:
      "Você tende a se desenvolver melhor quando possui espaço para tomar decisões, iniciar projetos e colocar suas próprias ideias em prática. Ambientes excessivamente controladores podem limitar sua capacidade de realização."
  },

  2: {
    areas:
      "Relacionamentos, mediação, atendimento, cooperação, comunicação e atividades que dependam de sensibilidade humana.",

    professions:
      "Terapeuta, psicóloga, mediadora, consultora, assessora, profissional de atendimento, recursos humanos, relações públicas, professora, orientadora ou trabalhos realizados em parceria.",

    guidance:
      "Seu potencial profissional cresce quando existe possibilidade de colaboração, escuta e construção conjunta. Ambientes muito competitivos ou agressivos podem consumir sua energia."
  },

  3: {
    areas:
      "Comunicação, criatividade, arte, escrita, ensino, imagem, entretenimento e produção de conteúdo.",

    professions:
      "Escritora, jornalista, publicitária, designer, ilustradora, artista, professora, comunicadora, criadora de conteúdo, roteirista, apresentadora ou profissional ligada à expressão criativa.",

    guidance:
      "Você precisa de espaço para expressar ideias e transformar criatividade em algo concreto. Trabalhos excessivamente repetitivos podem reduzir sua motivação."
  },

  4: {
    areas:
      "Organização, planejamento, administração, processos, estrutura, gestão e construção.",

    professions:
      "Administradora, gestora de projetos, analista, planejadora, engenheira, arquiteta, contadora, coordenadora, especialista em processos ou profissional que trabalhe com organização e estrutura.",

    guidance:
      "Você tende a produzir melhor quando existe clareza, método e possibilidade de construir resultados consistentes. Sua força está em transformar ideias em estruturas que funcionam."
  },

  5: {
    areas:
      "Comunicação, vendas, marketing, viagens, eventos, inovação, mídia, negociação e atividades com movimento.",

    professions:
      "Publicitária, profissional de marketing, jornalista, vendedora, representante comercial, consultora, agente de viagens, produtora de eventos, comunicadora, empreendedora ou profissional autônoma.",

    guidance:
      "Você precisa de variedade, movimento e possibilidade de experimentar. Trabalhos muito rígidos e repetitivos podem gerar desmotivação."
  },

  6: {
    areas:
      "Cuidado, educação, estética, relacionamentos, bem-estar, família, arte e criação de ambientes harmoniosos.",

    professions:
      "Terapeuta, professora, psicóloga, cuidadora, designer de interiores, estilista, profissional de estética, consultora, orientadora, decoradora ou empreendedora ligada ao bem-estar.",

    guidance:
      "Você tende a prosperar quando percebe que seu trabalho melhora a vida, o ambiente ou o bem-estar de alguém. É importante, porém, não transformar cuidado profissional em sobrecarga."
  },

  7: {
    areas:
      "Pesquisa, conhecimento, análise, tecnologia, espiritualidade, investigação, escrita e ensino especializado.",

    professions:
      "Pesquisadora, escritora, professora, analista, cientista, programadora, terapeuta, consultora, especialista, estudiosa de espiritualidade ou profissional que trabalhe com investigação e conhecimento.",

    guidance:
      "Você precisa de profundidade e autonomia intelectual. Ambientes superficiais ou que não permitam concentração podem reduzir seu potencial."
  },

  8: {
    areas:
      "Gestão, negócios, administração, finanças, liderança, estratégia, empreendedorismo e realização material.",

    professions:
      "Empreendedora, executiva, administradora, empresária, gestora financeira, consultora, diretora, estrategista, investidora, líder empresarial ou profissional que trabalhe com gestão de recursos.",

    guidance:
      "Você possui potencial para lidar com grandes responsabilidades e resultados. Sua realização cresce quando poder, dinheiro e liderança são utilizados com consciência e propósito."
  },

  9: {
    areas:
      "Educação, arte, comunicação, espiritualidade, assistência, projetos sociais, cura e atividades voltadas ao coletivo.",

    professions:
      "Terapeuta, escritora, artista, professora, psicóloga, assistente social, orientadora, mentora, comunicadora, profissional espiritualista ou empreendedora de projetos com impacto social.",

    guidance:
      "Você tende a encontrar significado quando percebe que seu trabalho contribui para algo maior. Precisa aprender a servir sem assumir responsabilidades que não pertencem a você."
  },

  11: {
    areas:
      "Inspiração, espiritualidade, comunicação, arte, ensino, orientação, criatividade e desenvolvimento humano.",

    professions:
      "Mentora, terapeuta, escritora, professora, artista, comunicadora, orientadora espiritual, palestrante, consultora ou profissional ligada ao desenvolvimento humano.",

    guidance:
      "Sua sensibilidade pode se transformar em uma grande ferramenta profissional quando encontra uma forma concreta de expressão. Estrutura e organização ajudam a transformar inspiração em trabalho."
  },

  22: {
    areas:
      "Grandes projetos, empreendedorismo, gestão, arquitetura, tecnologia, administração, inovação e construção de estruturas duradouras.",

    professions:
      "Empreendedora, executiva, arquiteta, engenheira, gestora de grandes projetos, administradora, estrategista, consultora empresarial ou líder de projetos de grande impacto.",

    guidance:
      "Você possui potencial para construir algo maior do que uma simples ocupação profissional. Grandes visões precisam ser transformadas em etapas concretas para que seu potencial realmente se manifeste."
  },

  33: {
    areas:
      "Ensino, cuidado, terapias, orientação, desenvolvimento humano, espiritualidade, educação e trabalhos de contribuição.",

    professions:
      "Terapeuta, professora, mentora, psicóloga, orientadora, escritora, palestrante, cuidadora, facilitadora de grupos ou profissional ligado ao desenvolvimento humano e espiritual.",

    guidance:
      "Seu trabalho pode ganhar significado quando une conhecimento, acolhimento e contribuição. É essencial manter limites para não transformar vocação de serviço em sacrifício pessoal."
  }
}