import { calculateNameVibration } from "@/modules/numerology/nameVibration";
export const cartasCiganas = [
  "Carta 1 - O Cavaleiro",
  "Carta 2 - O Trevo ou os Obstáculos",
  "Carta 3 - O Navio ou o Mar",
  "Carta 4 - A Casa",
  "Carta 5 - A Árvore",
  "Carta 6 - As Nuvens",
  "Carta 7 - A Cobra ou Serpente",
  "Carta 8 - O Caixão",
  "Carta 9 - As Flores",
  "Carta 10 - A Foice",
  "Carta 11 - O Chicote",
  "Carta 12 - Os Pássaros",
  "Carta 13 - A Criança",
  "Carta 14 - A Raposa",
  "Carta 15 - O Urso",
  "Carta 16 - A Estrela",
  "Carta 17 - A Cegonha",
  "Carta 18 - O Cachorro",
  "Carta 19 - A Torre",
  "Carta 20 - O Jardim",
  "Carta 21 - A Montanha",
  "Carta 22 - O Caminho",
  "Carta 23 - O Rato",
  "Carta 24 - O Coração",
  "Carta 25 - O Anel",
  "Carta 26 - Os Livros",
  "Carta 27 - A Carta",
  "Carta 28 - O Cigano",
  "Carta 29 - A Cigana",
  "Carta 30 - Os Lírios",
  "Carta 31 - O Sol",
  "Carta 32 - A Lua",
  "Carta 33 - A Chave",
  "Carta 34 - O Peixe",
  "Carta 35 - A Âncora",
  "Carta 36 - A Cruz",
];

export const tarot = [
  "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador",
  "O Hierofante", "Os Enamorados", "O Carro", "A Força", "O Eremita",
  "A Roda da Fortuna", "A Justiça", "O Pendurado", "A Morte", "A Temperança",
  "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
];

export const orixas = [
  "Exu", "Ogum", "Oxóssi", "Xangô", "Iemanjá", "Iansã", "Omolu",
  "Nanã", "Oxum", "Obá", "Ewá", "Logunedé", "Ossain", "Ibeji", "Ifá", "Babá Egum",
  "Oxalá", "Oxaguian", "Obaluaê", "Oxumaré", "Egunitá"
];

export const focos = [
  "Emocional", "Trabalho", "Saúde", "Amor",
  "Relacionamento", "Financeiro", "Espiritual", "Prosperidade",
  "Família", "Autoconhecimento", "Proteção"
];

/* ============================================================================
 * Perfil energético dos orixás — descrição rica, cores para energizar a semana,
 * dia de pico da energia e áreas onde a força atua na vida do consulente.
 * ========================================================================== */
export interface OrixaPerfil {
  descricao: string;      // descrição extensa da energia
  ondeAjuda: string;      // onde ajuda a vida do consulente
  cores: string[];        // cores para energizar a semana
  diaSemana: string;      // dia de pico da energia
  elemento: string;       // elemento regente
  saudação: string;       // saudação tradicional
}

export const orixaPerfis: Record<string, OrixaPerfil> = {
  Exu: {
    descricao: "Exu é o senhor dos caminhos e da comunicação entre mundos — o mensageiro que abre portas, desfaz amarrações e coloca movimento onde havia estagnação. É o primeiro a ser saudado em qualquer trabalho porque nada acontece sem que ele libere a passagem. Sua energia é ágil, astuta, direta: chega para tirar pedras do caminho e apontar atalhos que só quem conhece as encruzilhadas enxerga.",
    ondeAjuda: "Ajuda quando você sente que a vida travou — processos parados, oportunidades que não vêm, conversas que não avançam. Exu remove obstáculos invisíveis, abre negociações, destrava relacionamentos e desmancha inveja e olho gordo. É essencial para quem quer mudar de fase e não sabe por onde começar.",
    cores: ["Vermelho", "Preto"],
    diaSemana: "Segunda-feira",
    elemento: "Terra e Fogo",
    saudação: "Laroyê, Exu!",
  },
  Ogum: {
    descricao: "Ogum é o guerreiro que abre caminhos com sua espada e ensina a lutar pelo que é seu. Senhor do ferro, das batalhas justas e da coragem que não recua diante do difícil. Sua energia é firme, determinada, protetora — chega quando você precisa de força para enfrentar algo que vinha adiando ou quando precisa se impor com dignidade.",
    ondeAjuda: "Fortalece quem precisa de coragem para tomar decisões duras, encerrar situações abusivas, defender território profissional ou afetivo. Protege trabalhadores, motoristas, empreendedores e todos que dependem da própria força para vencer. Ideal para começos difíceis e conquistas que exigem batalha.",
    cores: ["Azul-escuro", "Vermelho"],
    diaSemana: "Terça-feira",
    elemento: "Fogo e Ferro",
    saudação: "Ogunhê, meu pai!",
  },
  Oxóssi: {
    descricao: "Oxóssi é o caçador das matas, senhor da fartura e do conhecimento vindo da observação. Com seu arco e flecha, ele mira certeiro no alvo — símbolo de foco, sabedoria prática e prosperidade conquistada pela atenção fina. Sua energia é alegre, expansiva, curiosa e nunca desperdiça um tiro.",
    ondeAjuda: "Atrai fartura material, novas oportunidades de trabalho, estudos que dão retorno e networking produtivo. Ideal para quem busca renovação profissional, mudança de área, negócio próprio, colheita de projetos e reconhecimento por mérito. Excelente para estudantes e pesquisadores.",
    cores: ["Verde-escuro", "Verde-claro"],
    diaSemana: "Quinta-feira",
    elemento: "Terra (matas)",
    saudação: "Okê arô, Oxóssi!",
  },
  Xangô: {
    descricao: "Xangô é o rei da justiça, senhor do trovão e do fogo que ilumina a verdade. Com seu machado duplo, corta a mentira e equilibra a balança onde há desigualdade. Sua energia é imponente, sábia, majestosa — chega quando você precisa de clareza para tomar decisões justas ou quando uma verdade precisa vir à tona.",
    ondeAjuda: "Traz vitória em processos, concursos, disputas legais e situações que pedem justiça. Fortalece líderes, juízes, advogados e todos que precisam decidir com equilíbrio. Ideal para quem foi vítima de injustiça e busca reparação, ou para quem precisa impor limites com firmeza e sabedoria.",
    cores: ["Marrom", "Vermelho", "Branco"],
    diaSemana: "Quarta-feira",
    elemento: "Fogo (pedra e trovão)",
    saudação: "Kaô Cabecilê, meu pai Xangô!",
  },
  Iemanjá: {
    descricao: "Iemanjá é a Grande Mãe, senhora dos mares e de todas as águas salgadas — aquela que acolhe todos os filhos sem distinção e lava mágoas com a espuma das ondas. Sua energia é maternal, generosa, curadora e infinita como o mar. Chega para embalar quem precisa de colo e renovar o que está gasto por dentro.",
    ondeAjuda: "Cura feridas emocionais antigas, especialmente as vindas da relação com a mãe ou com a própria maternidade. Fortalece a autoestima feminina, protege gestantes, crianças e vínculos familiares. Ideal para quem passa por lutos, términos ou fases em que precisa se reconectar com a própria essência.",
    cores: ["Azul-claro", "Branco", "Prata"],
    diaSemana: "Sábado",
    elemento: "Água salgada",
    saudação: "Odoyá, minha mãe Iemanjá!",
  },
  Iansã: {
    descricao: "Iansã (Oyá) é a senhora dos ventos, dos raios e dos espíritos que atravessam. Guerreira intensa, dança com o fogo e não teme mudança — pelo contrário, ela mesma é o vento que varre tudo o que precisa ir. Sua energia é ardente, livre, corajosa e transformadora.",
    ondeAjuda: "Impulsiona mudanças urgentes, saídas de relacionamentos ou trabalhos que sufocam, coragem para recomeçar. Fortalece mulheres que precisam se libertar de padrões antigos e assumir a própria voz. Ideal para períodos de transição rápida e para quem precisa afastar energias densas ou espíritos apegados.",
    cores: ["Amarelo", "Vermelho-coral"],
    diaSemana: "Quarta-feira",
    elemento: "Fogo e Ar (ventania)",
    saudação: "Eparrey, Oyá!",
  },
  Omolu: {
    descricao: "Omolu é o senhor das enfermidades e da cura profunda — aquele que conhece a dor porque atravessou todas. Coberto por palha da costa, esconde o rosto para proteger os mortais da intensidade de sua transformação. Sua energia é silenciosa, ancestral, corretiva; trabalha no oculto reorganizando o que ninguém mais consegue.",
    ondeAjuda: "Cura doenças crônicas, questões de pele, sangue e ossos. Trabalha o luto, a depressão e traumas que precisam ser olhados com coragem. Fortalece quem enfrenta processos longos de recuperação (física, emocional ou espiritual) e ensina a maturidade que só vem depois da travessia.",
    cores: ["Preto", "Branco"],
    diaSemana: "Segunda-feira",
    elemento: "Terra (cemitério e chão)",
    saudação: "Atotô, meu pai Omolu!",
  },
  Nanã: {
    descricao: "Nanã é a mais antiga das mães, senhora do barro primordial de onde tudo veio e para onde tudo volta. Sua sabedoria vem da paciência infinita de quem já viu todos os ciclos se cumprirem. Sua energia é lenta, densa, profunda — chega para ensinar que nem tudo precisa acontecer agora.",
    ondeAjuda: "Traz sabedoria em decisões de longo prazo, encerramentos maduros e reconciliação com o passado. Fortalece pessoas mais velhas, avós, e todos que passam por processos de aceitação. Ideal para quem precisa aprender a esperar o tempo certo e reconhecer o valor da experiência acumulada.",
    cores: ["Lilás", "Roxo", "Branco"],
    diaSemana: "Segunda-feira",
    elemento: "Água e Lama",
    saudação: "Saluba, Nanã!",
  },
  Oxum: {
    descricao: "Oxum é a senhora das águas doces, do ouro e do amor — aquela que se olha no espelho e sabe do próprio valor. Doce, mas nunca frágil, ela ensina que autoestima é a chave que abre todas as portas afetivas. Sua energia é acolhedora, sensual, próspera e maternal.",
    ondeAjuda: "Fortalece a autoestima, atrai amor verdadeiro (próprio e recíproco), ajuda em questões de fertilidade e maternidade. Traz prosperidade financeira ligada ao merecimento, cuida da beleza interior e exterior. Ideal para quem precisa se reencantar pela própria vida e reconhecer o próprio valor.",
    cores: ["Amarelo-ouro", "Dourado"],
    diaSemana: "Sábado",
    elemento: "Água doce",
    saudação: "Ora yê yê ô, minha mãe Oxum!",
  },
  Obá: {
    descricao: "Obá é a guerreira do amor absoluto e da lealdade extrema — mulher que sabe o que quer e não recua diante do próprio desejo. Sua energia é intensa, apaixonada, determinada; ensina que amar de verdade inclui também impor limites e reconhecer quando é hora de partir.",
    ondeAjuda: "Fortalece mulheres em relacionamentos difíceis, ensina a diferença entre entrega e submissão. Traz coragem para escolhas afetivas radicais (sair, ficar, recomeçar). Ideal para quem precisa recuperar dignidade em relações desequilibradas e para quem defende causas com paixão.",
    cores: ["Vermelho-vinho", "Coral"],
    diaSemana: "Quarta-feira",
    elemento: "Água (rio revolto)",
    saudação: "Obá Xirê!",
  },
  Ewá: {
    descricao: "Ewá é a senhora dos mistérios sutis, do arco-íris e das visões que chegam ao entardecer. Delicada e enigmática, é a guardiã dos segredos que só se revelam a quem tem olhar treinado. Sua energia é discreta, refinada, mediúnica — chega para aguçar a intuição e afinar a percepção.",
    ondeAjuda: "Desenvolve mediunidade e intuição, protege quem trabalha com o invisível. Traz clareza em situações confusas onde as respostas estão escondidas. Ideal para artistas, videntes, terapeutas e todos que precisam enxergar além das aparências. Fortalece a sensibilidade sem sobrecarregar.",
    cores: ["Rosa", "Amarelo-claro", "Coral"],
    diaSemana: "Sábado",
    elemento: "Água (nascentes) e Ar",
    saudação: "Ri-ro, Ewá!",
  },
  Logunedé: {
    descricao: "Logunedé é o filho da fartura e da doçura — herda de Oxóssi a caça e de Oxum a beleza. Jovem, alegre, dual: seis meses nas matas com o pai, seis meses nas águas com a mãe. Sua energia é leve, brincalhona, abundante — chega trazendo o brilho de quem vive com facilidade o que outros conquistam com esforço.",
    ondeAjuda: "Atrai fartura e amor juntos, favorece jovens, artistas e empreendedores criativos. Ajuda quem precisa reconciliar dualidades (razão/emoção, trabalho/prazer). Ideal para quem quer aliviar o peso da vida adulta e reencontrar leveza sem perder a prosperidade.",
    cores: ["Azul-turquesa", "Amarelo-ouro"],
    diaSemana: "Quinta-feira",
    elemento: "Água doce e Mata",
    saudação: "Loci-loci, Logunedé!",
  },
  Ossain: {
    descricao: "Ossain é o senhor das folhas, guardião dos segredos da cura pela natureza. Sem ele, nenhum orixá tem axé — porque toda força espiritual passa pelas ervas. Sua energia é sábia, silenciosa, curadora; ensina que a natureza tem resposta para tudo, basta saber escutar.",
    ondeAjuda: "Cura pelo corpo e pela alma através de banhos, chás e defumações. Fortalece quem trabalha com terapias naturais, plantas e saberes tradicionais. Ideal para quem enfrenta questões de saúde física e busca tratamentos complementares, ou para quem precisa se reconectar com a Terra e diminuir o ritmo mental.",
    cores: ["Verde-claro", "Branco"],
    diaSemana: "Quinta-feira",
    elemento: "Terra (folhas e ervas)",
    saudação: "Ewê ó, Ossain!",
  },
  Ibeji: {
    descricao: "Ibeji são os gêmeos sagrados, guardiões da infância, da alegria e da inocência que cura. Trazem consigo o riso que desfaz tensões e a leveza que só as crianças conhecem. Sua energia é lúdica, doce, restauradora — chega para lembrar você de brincar novamente com a própria vida.",
    ondeAjuda: "Protege crianças, gestantes e projetos em fase inicial (que precisam de cuidado como bebês). Cura a criança interior ferida, alivia excesso de seriedade e cobrança. Ideal para períodos em que você precisa reencontrar o prazer no simples e desmontar rigidez emocional.",
    cores: ["Azul", "Rosa", "Amarelo"],
    diaSemana: "Domingo",
    elemento: "Ar (leveza)",
    saudação: "Beji Orô!",
  },
  Ifá: {
    descricao: "Ifá (Orunmilá) é o senhor do destino e do oráculo — aquele que testemunhou a criação do mundo e conhece o caminho de cada alma. Sua energia é serena, sábia, reveladora; chega quando você precisa de direção clara em uma encruzilhada importante da vida.",
    ondeAjuda: "Revela o caminho certo em decisões grandes (mudanças de cidade, casamento, escolha profissional). Fortalece quem consulta oráculos, estuda espiritualidade e busca sentido de vida. Ideal para quem sente que está desalinhado do próprio propósito e precisa se recolocar no eixo.",
    cores: ["Verde", "Amarelo", "Branco"],
    diaSemana: "Sexta-feira",
    elemento: "Ar (sabedoria)",
    saudação: "Epa Babá Ifá!",
  },
  "Babá Egum": {
    descricao: "Babá Egum é a força ancestral, o coletivo dos antepassados que continuam trabalhando pela nossa linhagem mesmo depois de partirem. Sua energia é grave, respeitosa, protetora — chega quando você precisa ser lembrado de que não caminha sozinho, seus mortos honrados estão contigo.",
    ondeAjuda: "Conecta com a força ancestral da família, cura padrões transgeracionais, protege a linhagem. Ideal para quem está passando por questões de família, herança, luto ou sente que carrega peso que não é só seu. Fortalece a memória e o respeito pelas próprias raízes.",
    cores: ["Branco", "Preto"],
    diaSemana: "Segunda-feira",
    elemento: "Terra (ancestralidade)",
    saudação: "Ojú Egum!",
  },
  Oxalá: {
    descricao: "Oxalá é o pai maior, o criador da humanidade, senhor da paz e da luz branca que sustenta todos os orixás. Sua energia é serena, calma, elevada — a mais alta vibração espiritual que se pode invocar. Chega para trazer paz onde há agitação e clareza onde há confusão.",
    ondeAjuda: "Traz paz interior profunda, cura o corpo em nível energético, eleva a consciência espiritual. Fortalece pessoas idosas, líderes espirituais e quem precisa se acalmar em meio ao caos. Ideal para quem busca a bênção maior, sente-se perdido ou precisa se reconectar com o sagrado dentro de si.",
    cores: ["Branco"],
    diaSemana: "Sexta-feira",
    elemento: "Ar (céu e altura)",
    saudação: "Epa Babá, meu pai Oxalá!",
  },
  Oxaguian: {
    descricao: "Oxaguian é a face jovem e guerreira de Oxalá — o Oxalá moço que ainda empunha lança e monta cavalo. Traz a força criadora unida à coragem de agir. Sua energia é vibrante, criativa, empreendedora dentro da paz — chega para quem precisa construir algo grande com serenidade.",
    ondeAjuda: "Fortalece jovens líderes, empreendedores espirituais, pessoas que estão criando algo novo (projeto, negócio, obra). Traz coragem sem perder a paz, ação sem perder o eixo. Ideal para quem está começando uma jornada importante e precisa unir fé, criatividade e determinação.",
    cores: ["Branco", "Azul-claro"],
    diaSemana: "Sexta-feira",
    elemento: "Ar e Terra",
    saudação: "Epa Babá Oxaguian!",
  },
  "Obaluaê": {
    descricao: "Obaluaê é a face jovem e ativa de Omolu — o rei da terra que dança curando as feridas do mundo. Traz o mesmo saber sobre dor e cura, mas com energia mais dinâmica, pronta para transformar sofrimento em força. Sua energia é intensa, reveladora, restauradora.",
    ondeAjuda: "Cura enfermidades ativas (agudas), acelera processos de recuperação, transforma dor em sabedoria útil. Fortalece quem trabalha com saúde, cuidados paliativos e transformação de traumas. Ideal para quem precisa atravessar um período difícil de saúde ou emocional com coragem.",
    cores: ["Preto", "Branco", "Vermelho"],
    diaSemana: "Segunda-feira",
    elemento: "Terra e Fogo",
    saudação: "Atotô, Obaluaê!",
  },
  Oxumaré: {
    descricao: "Oxumaré é a serpente-arco-íris que liga o céu e a terra — dual, transforma-se entre masculino e feminino a cada seis meses. Senhor dos ciclos, das mudanças e da riqueza que se renova. Sua energia é fluida, cíclica, próspera — chega para quem precisa aceitar mudanças e confiar no movimento da vida.",
    ondeAjuda: "Traz renovação financeira, cura questões de identidade e fluidez, ajuda a aceitar dualidades sem conflito. Fortalece pessoas em transição (de vida, gênero, carreira) e quem trabalha com ciclos (agricultura, mercado, saúde da mulher). Ideal para atrair prosperidade cíclica e constante.",
    cores: ["Amarelo", "Verde", "Todas as cores do arco-íris"],
    diaSemana: "Quinta-feira",
    elemento: "Água e Ar (arco-íris)",
    saudação: "Arrobôboi, Oxumaré!",
  },
  "Egunitá": {
    descricao: "Egunitá é a orixá do fogo primordial, guardiã das chamas que purificam. Guerreira feminina de intensidade rara, dança com o fogo e ensina a queimar tudo o que não serve mais. Sua energia é ardente, purificadora, libertadora — chega para consumir bloqueios profundos e acender novo propósito.",
    ondeAjuda: "Quebra padrões enraizados, purifica energias densas de ambientes e pessoas, acende a paixão pela vida em quem estava apagado. Fortalece mulheres em processo de reinvenção total. Ideal para quem precisa de uma transformação radical e sente que precisa 'queimar tudo' para renascer.",
    cores: ["Vermelho", "Amarelo-ouro", "Laranja"],
    diaSemana: "Quarta-feira",
    elemento: "Fogo puro",
    saudação: "Egunitá, kolê kolê!",
  },
};

/* ============================================================================
 * Normalização de nome — apelidos/diminutivos viram o mesmo nome canônico
 * para que a mesma pessoa receba sempre a mesma leitura.
 * ========================================================================== */
/** Normaliza o nome para uma chave estável, sem converter nomes reais em apelidos. */
function chaveCanonical(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(hash);
}

// Permite que `gerarLeitura` defina a semana de referência conforme a data
// escolhida pela usuária — assim mudar a data realmente muda toda a leitura.
let weekOverride: number | null = null;

function weekFromDate(d: Date): number {
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  // número de semana sequencial considerando também o ano (evita colisão entre anos)
  const semanaAno = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return d.getFullYear() * 100 + semanaAno;
}

function currentWeekNumber(): number {
  if (weekOverride !== null) return weekOverride;
  return weekFromDate(new Date());
}

// Primos grandes para misturar bem o hash por categoria (evita clustering
// tipo "6 Omolus na mesma semana"). Cada salt usa um primo diferente.
const SALT_PRIMES = [2654435761, 40503277, 2246822519, 3266489917, 668265263, 374761393, 1597334677, 3812015801];

function pickForPerson<T>(list: T[], nome: string, salt: number = 0): T {
  const h = hashString(chaveCanonical(nome));
  const week = currentWeekNumber();
  const p = SALT_PRIMES[salt % SALT_PRIMES.length];
  // mistura: rotaciona hash, combina com semana e multiplica por primo único
  let x = (h ^ (week * 2654435761)) >>> 0;
  x = Math.imul(x, p) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  x = Math.imul(x, 2246822519) >>> 0;
  x = (x ^ (x >>> 13)) >>> 0;
  return list[x % list.length];
}

export function calcularNumerologia(nome: string): number {
  // Numerologia da semana: combina o nome (identidade) com a semana atual,
  // resultando em um número de 1 a 9 que varia a cada semana para a mesma pessoa.
  const limpo = chaveCanonical(nome).replace(/[^a-z]/g, "");
  let soma = 0;
  for (const char of limpo) {
    soma += char.charCodeAt(0);
  }
  // Mistura com a semana atual usando primo grande para boa dispersão
  const week = currentWeekNumber();
  let x = (soma ^ Math.imul(week + 1, 2654435761)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 2246822519) >>> 0;
  x = (x ^ (x >>> 13)) >>> 0;
  // Reduz a um dígito de 1 a 9
  return (x % 9) + 1;
}

export function getSemanaDatas(): string {
  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - hoje.getDay());
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
  return `${fmt(inicio)} a ${fmt(fim)}`;
}

export function formatarSemana(inicio: Date, fim: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
  return `${fmt(inicio)} a ${fmt(fim)}`;
}

export interface DetalheCarta {
  naipe: string;               // ex: "Ás de Copas"
  /** Elemento do baralho Lenormand (única camada elemental usada) */
  elemento: string;            // ex: "Água"
  reflexo: string;     // como reflete na vida do consulente
  /** O que o naipe específico desta carta acrescenta à interpretação */
  direcionamentoNaipe: string;
  /** Direcionamento do elemento Lenormand para esta carta */
  direcionamentoLenormand: string;
}

/** Parte estática dos detalhes das cartas (geração acrescenta os direcionamentos). */
type DetalheCartaBase = Omit<DetalheCarta, "direcionamentoNaipe" | "direcionamentoLenormand">;



export interface NumerologiaDetalhe {
  numeroSemana: number;
  numeroNome: number;
  /** Direcionamento único que une a vibração da semana à essência do nome */
  mensagemUnificada: string;
  pontosFortes: string[];
  pontosFracos: string[];
  aMelhorar: string[];
}


export interface Leitura {
  nome: string;
  idAssociado: string;
  numerologia: number;
  orixa: string;
  cartaCigana: string;
  cartaTaro: string;
  foco: string;
  semana: string;
  mensagemFoco: string;
  mensagemEspiritual: string;
  mensagemSaude: string;
  mensagemFinal: string;
  significadoCartaCigana: string;
  significadoTaro: string;
  significadoOrixa: string;
  significadoNumerologia: string;
  significadoNaipe: string;
  significadoElemento: string;
  detalheCartaCigana: DetalheCarta;
  sugestoes: string[];
  exercicioMental: { titulo: string; passos: string[] };
  orixaPerfil: OrixaPerfil;
  numerologiaDetalhe: NumerologiaDetalhe;
}


/* ============================================================================
 * Significados dos naipes (correspondência baralho cigano ↔ baralho comum)
 * ========================================================================== */
const naipeSignificados: Record<string, string> = {
  "Ás de Copas": "início de um ciclo afetivo importante na sua vida — uma emoção nova nasce, um vínculo se abre ou um sentimento adormecido volta a pulsar com força.",
  "6 de Copas": "memórias, infância e nostalgia tocando seu presente — algo do passado retorna trazendo cura, encontro com pessoa antiga ou lembrança que reorganiza o agora.",
  "7 de Copas": "muitas opções afetivas e ilusões emocionais — você está vendo possibilidades demais; pede que escolha com pé no chão, sem se perder em fantasias.",
  "8 de Copas": "abandonar o que não nutre mais — uma situação emocional pede que você dê as costas com gratidão e siga em busca de algo mais verdadeiro.",
  "9 de Copas": "realização emocional e desejos atendidos — é a carta do 'sim' do coração, prazer e contentamento batendo à sua porta.",
  "10 de Copas": "harmonia afetiva plena, família, amizades verdadeiras e laços que sustentam — sua vida emocional encontra um lugar de paz e pertencimento.",
  "Valete de Copas": "mensagem amorosa, convite afetivo ou nova fase do coração — alguém ou algo chega com leveza, doçura e proposta sincera.",
  "Dama de Copas": "feminino sensível, intuitivo e acolhedor atuando na sua vida — pode ser você ou alguém à sua volta cuidando emocionalmente da sua jornada.",
  "Rei de Copas": "masculino maduro e equilibrado emocionalmente — figura que oferece estabilidade afetiva, sabedoria nos sentimentos e proteção do coração.",
  "Ás de Ouros": "início de prosperidade material — uma oportunidade concreta de dinheiro, trabalho ou bem material está se abrindo agora.",
  "6 de Ouros": "trocas justas, dar e receber em equilíbrio — generosidade volta para você na mesma medida, em forma de ajuda, dinheiro ou apoio.",
  "7 de Ouros": "colheita parcial e paciência com investimentos — o que você plantou começa a dar fruto, mas pede que continue cultivando.",
  "8 de Ouros": "trabalho dedicado, aprendizado prático e ofício bem feito — atenção aos detalhes e disciplina entregam resultado material concreto.",
  "9 de Ouros": "conquista material por mérito próprio — independência financeira, conforto e a sensação de ter construído algo sólido com as próprias mãos.",
  "10 de Ouros": "patrimônio, segurança familiar e estabilidade duradoura — sua base material está firme e sustenta também as próximas gerações.",
  "Valete de Ouros": "estudo prático, novo projeto material ou notícia financeira positiva — algo concreto começa e pede dedicação e foco.",
  "Dama de Ouros": "feminino próspero, generoso e prático — mulher que multiplica recursos e cuida com pé no chão, pode ser você ou alguém ao redor.",
  "Rei de Ouros": "masculino próspero, empreendedor e estável — figura que constrói abundância e ensina pelo exemplo a relação madura com o dinheiro.",
  "Ás de Espadas": "clareza mental cortante e nova ideia poderosa — uma verdade vem à tona ou uma decisão precisa ser tomada com lucidez.",
  "6 de Espadas": "travessia, transição mental e saída de uma fase difícil — você está atravessando águas para chegar a um lugar mais calmo.",
  "7 de Espadas": "estratégia, cautela e atenção a jogadas alheias — pede inteligência e percepção; nem tudo o que parece é, observe antes de agir.",
  "8 de Espadas": "sensação de bloqueio mental que é mais ilusão que realidade — você se prende a pensamentos limitantes; perceba que a porta não está trancada.",
  "9 de Espadas": "preocupações, ansiedade e pensamentos pesados pedindo cuidado — não rumine sozinha, procure ajuda, fale, escreva, durma melhor.",
  "10 de Espadas": "encerramento doloroso mas necessário no plano mental — um ciclo de pensamento, ideia ou crença termina para que algo verdadeiro nasça.",
  "Valete de Espadas": "informação nova, curiosidade afiada e mensagem inesperada — atenção ao que chega: pode mudar sua perspectiva.",
  "Dama de Espadas": "feminino racional, perspicaz e direto — clareza, independência e a coragem de cortar o que não serve mais.",
  "Rei de Espadas": "masculino lúcido, justo e autoritário no pensamento — figura que decide com cabeça fria e ensina a separar emoção de razão.",
  "Ás de Paus": "início de algo com paixão e vitalidade — energia criativa nova, projeto que acende você, faísca de inspiração pronta para virar fogo.",
  "6 de Paus": "vitória reconhecida e mérito visível — algo seu é celebrado publicamente; momento de receber os louros sem falsa modéstia.",
  "7 de Paus": "defender sua posição com coragem — alguém ou algo desafia o que você construiu; mantenha-se firme no seu lugar.",
  "8 de Paus": "movimento rápido, notícias velozes e ações em série — as coisas aceleram, prepare-se para responder com agilidade.",
  "9 de Paus": "resistência e força para o último esforço — você está quase lá; não desista agora mesmo que esteja cansada.",
  "10 de Paus": "carga pesada que pede divisão — você está assumindo mais do que cabe; aprenda a soltar ou delegar parte do peso.",
  "Valete de Paus": "novo entusiasmo, viagem, aventura ou recado inspirador — algo desperta sua coragem e vontade de explorar.",
  "Dama de Paus": "feminino magnético, criativo e cheio de presença — mulher que ilumina ambientes; cuide para não atrair também os olhares invejosos.",
  "Rei de Paus": "masculino líder, visionário e empreendedor — figura inspiradora que comanda com paixão e abre caminhos para os outros.",
};

const elementoSignificadosVariantes: Record<string, string[]> = {
  "Água": [
    "Água mexe com o que você sente, com sonhos, intuição, vínculos afetivos e tudo o que pede acolhimento. Esta semana pede que você se permita sentir sem pressa: choros guardados, abraços adiados, conversas com o coração. No corpo, regula rins, bexiga e o sistema linfático — beba mais água, tome banhos demorados, aproxime-se do mar, do rio ou da chuva.",
    "Água é a casa das emoções e do que corre por dentro sem fazer barulho. Nesta semana ela pede que você reduza o ritmo, escute sonhos e perceba sentimentos antigos pedindo passagem. Cuide bem dos rins, da bexiga e do sistema linfático — banhos de imersão, chá morno e uma boa lágrima são remédios mais poderosos do que parecem.",
    "Água traz fluidez, sensibilidade e contato com o invisível dos sentimentos. Permita-se chorar, abraçar, perdoar e receber afeto sem se cobrar firmeza o tempo todo. O corpo agradece se você hidratar bastante, evitar excessos de açúcar e álcool e passar algum tempo perto de uma fonte de água — banho, mar, rio, chuva.",
    "Água é o elemento do feminino interior, das marés emocionais e da intuição que avisa antes da razão. Esta semana, suas emoções podem oscilar — não fuja delas, navegue. Cuide da hidratação, do sono e dos rins; banhos com pétalas de rosa, camomila ou alfazema (sempre do pescoço para baixo) ajudam a desaguar o que vinha represado.",
  ],
  "Fogo": [
    "Fogo mexe com vontade, paixão, coragem e iniciativa — é o elemento da ação. Esta semana acende em você o desejo de fazer acontecer, criar, liderar e arriscar. No corpo, rege circulação, fígado e digestão — cuide para não se 'queimar' no excesso: faça pausas, evite reações impulsivas e canalize a chama em projetos concretos.",
    "Fogo é energia em movimento, faísca que empurra para o novo. Esta semana você sente urgência de agir, falar, decidir — use essa força para começar o que vinha adiando, mas evite respostas no calor do impulso. O corpo pede atenção ao fígado, à circulação e ao coração; pratique respiração profunda e movimente-se.",
    "Fogo é coragem, presença e brilho próprio. Nesta semana há uma chama dentro de você pedindo expressão: lance ideias, mostre seu trabalho, defenda seus limites. Cuide do excesso — irritação, insônia e inflamações no corpo são sinais de fogo descontrolado; alimentação leve e pausas frequentes equilibram.",
    "Fogo é o elemento da paixão e do propósito que move. Esta semana acende vontade de virar páginas, encerrar ciclos com fôlego e iniciar projetos. Atenção à pressão arterial, fígado e digestão — beba água fria, evite frituras e álcool em excesso, e canalize a energia em exercício físico ou criação.",
  ],
  "Terra": [
    "Terra mexe com o concreto: corpo, dinheiro, casa, rotina, alimentação e raízes. Esta semana pede pé no chão, organização e cuidado com o que é palpável. No corpo, rege ossos, músculos, pele e digestão — alimente-se com qualidade, mexa-se com regularidade, organize seus espaços; estabilidade nasce de pequenos hábitos consistentes.",
    "Terra é a estrutura, o sustento e tudo o que dá raiz. Nesta semana você é chamada a olhar para o que sustenta seu cotidiano: dinheiro, casa, trabalho, hábitos. Cuidados práticos com ossos, articulações, pele e intestino são prioridade — comida de verdade, sol da manhã e contato com a natureza realinham tudo.",
    "Terra é solidez, paciência e maturidade prática. Esta semana convida a desacelerar para construir com calma o que dura — finanças, projetos, vínculos. Atenção ao corpo físico: estique-se ao acordar, caminhe descalça em grama ou terra firme se puder, e revise se a alimentação anda nutrindo de verdade.",
    "Terra é o elemento que ensina constância e responsabilidade amorosa. Nesta semana, pequenas ações repetidas valem mais do que grandes promessas: organize uma gaveta, pague uma conta antiga, prepare uma refeição com calma. Cuide de ossos, pele e digestão — corpo bem cuidado é base para tudo o que vier.",
  ],
  "Ar": [
    "Ar mexe com pensamento, comunicação, ideias, decisões e relações sociais — é o elemento mental. Esta semana pede clareza, conversas honestas e foco para enxergar com lucidez. No corpo, rege pulmões, sistema nervoso e respiração — respire fundo várias vezes ao dia, evite ruminar pensamentos e cuide do que você consome em informação.",
    "Ar é movimento das ideias, palavras e conexões. Nesta semana, conversas importantes pedem espaço — escute com atenção real e escolha bem o que fala. Cuide dos pulmões, da garganta e do sistema nervoso: respiração consciente, pausas longe de telas e ar livre acalmam o que andava acelerado por dentro.",
    "Ar é lucidez, leveza e capacidade de enxergar de cima. Esta semana favorece decisões que pedem clareza, contratos, estudos e contatos novos. Atenção a pensamentos repetitivos, ansiedade e respiração curta — alongue o tórax, abra janelas, reduza ruído mental e mantenha por perto quem te ajuda a pensar.",
    "Ar é o elemento da mente, do diálogo e das mudanças rápidas. Nesta semana, as coisas podem se mover mais ligeiro do que você espera — confie no raciocínio, mas não decida nada sob ansiedade. Cuide dos pulmões e do sono, beba chás calmantes à noite e diminua o tempo em redes sociais por alguns dias.",
  ],
};

const elementoSignificados: Record<string, string> = {
  "Água": elementoSignificadosVariantes["Água"][0],
  "Fogo": elementoSignificadosVariantes["Fogo"][0],
  "Terra": elementoSignificadosVariantes["Terra"][0],
  "Ar": elementoSignificadosVariantes["Ar"][0],
};

/* ============================================================================
 * Geração dos direcionamentos de naipe e elementos por carta cigana.
 * Cada carta recebe um texto específico que conecta o naipe/elemento ao seu
 * significado, formando duas camadas complementares (Lenormand + Ádria).
 * ========================================================================== */

/** Tema central de cada carta para costurar os direcionamentos. */
const cartaTemas: Record<string, { tema: string; natureza: string }> = {
  "Carta 1 - O Cavaleiro": { tema: "mensageiro e movimento rápido", natureza: "o cavalo que leva notícias de um lugar a outro" },
  "Carta 2 - O Trevo ou os Obstáculos": { tema: "sorte pequena e obstáculos leves", natureza: "o trevo que cresce entre as pedras" },
  "Carta 3 - O Navio ou o Mar": { tema: "viagem, distância e expansão", natureza: "o barco que atravessa mares" },
  "Carta 4 - A Casa": { tema: "lar, família e base segura", natureza: "o chão firme onde se constrói" },
  "Carta 5 - A Árvore": { tema: "saúde, raízes e crescimento lento", natureza: "a árvore que cresce em silêncio" },
  "Carta 6 - As Nuvens": { tema: "confusão, dúvida e clareza que chega depois", natureza: "a névoa que esconde e depois dissolve" },
  "Carta 7 - A Cobra ou Serpente": { tema: "sabedoria, desejo e atenção", natureza: "a serpente que se move entre folhas" },
  "Carta 8 - O Caixão": { tema: "encerramento, transformação e renascimento", natureza: "o casulo onde algo se transforma" },
  "Carta 9 - As Flores": { tema: "alegria, presentes e reconhecimento", natureza: "a flor que se abre sem pressa" },
  "Carta 10 - A Foice": { tema: "corte, colheita e decisão definitiva", natureza: "a foice que colhe no tempo certo" },
  "Carta 11 - O Chicote": { tema: "disciplina, repetição e tensão", natureza: "o movimento rítmico que molda" },
  "Carta 12 - Os Pássaros": { tema: "comunicação, fofoca e conversa", natureza: "o canto que circula entre as árvores" },
  "Carta 13 - A Criança": { tema: "novidade, inocência e começo puro", natureza: "o broto que acaba de nascer" },
  "Carta 14 - A Raposa": { tema: "astúcia, cautela e inteligência", natureza: "a raposa que observa antes de agir" },
  "Carta 15 - O Urso": { tema: "proteção, autoridade e poder", natureza: "o urso que protege seu território" },
  "Carta 16 - A Estrela": { tema: "esperança, destino e iluminação", natureza: "a estrela que guia no escuro" },
  "Carta 17 - A Cegonha": { tema: "mudança, gestação e renovação", natureza: "a ave que muda de lugar para gerar vida" },
  "Carta 18 - O Cachorro": { tema: "lealdade, amizade e companheirismo", natureza: "o cão que vigia e acompanha" },
  "Carta 19 - A Torre": { tema: "solidão, instituição e isolamento protetor", natureza: "a montanha alta que vê de longe" },
  "Carta 20 - O Jardim": { tema: "vida social, encontros e público", natureza: "o jardim onde flores e ervas convivem" },
  "Carta 21 - A Montanha": { tema: "desafio, bloqueio e superação", natureza: "a montanha que exige paciência" },
  "Carta 22 - O Caminho": { tema: "escolhas, bifurcações e caminhos", natureza: "a trilha que se divide no mato" },
  "Carta 23 - O Rato": { tema: "desgaste, pequenas perdas e ansiedade", natureza: "o rato que roí o que parece seguro" },
  "Carta 24 - O Coração": { tema: "amor, afeto e paixão", natureza: "o coração que pulsa e aquece" },
  "Carta 25 - O Anel": { tema: "compromisso, contrato e vínculo", natureza: "o círculo que une e selaaaa" },
  "Carta 26 - Os Livros": { tema: "segredos, estudos e conhecimento oculto", natureza: "as páginas que guardam mistérios" },
  "Carta 27 - A Carta": { tema: "mensagem, correspondência e notícia", natureza: "a carta que viaja até encontrar quem a espera" },
  "Carta 28 - O Cigano": { tema: "homem marcante, pai ou protetor", natureza: "o fogo que ilumina e aquece" },
  "Carta 29 - A Cigana": { tema: "mulher marcante, mãe ou guia", natureza: "a água que acolhe e intuía" },
  "Carta 30 - Os Lírios": { tema: "paz, maturidade e harmonia familiar", natureza: "o lírio que abre na calma" },
  "Carta 31 - O Sol": { tema: "sucesso, alegria e visibilidade", natureza: "o sol que revela tudo ao clarear" },
  "Carta 32 - A Lua": { tema: "fama, emoção e intuição", natureza: "a lua que reflete luz e move as marés" },
  "Carta 33 - A Chave": { tema: "solução, resposta e abertura", natureza: "a chave que abre o que estava fechado" },
  "Carta 34 - O Peixe": { tema: "abundância, prosperidade e fluxo", natureza: "o cardume que se move em abundância" },
  "Carta 35 - A Âncora": { tema: "estabilidade, segurança e trabalho", natureza: "a âncora que segura no fundo" },
  "Carta 36 - A Cruz": { tema: "dores, provações e destino espiritual", natureza: "a cruz que marca o caminho do aprendizado" },
};

/** Semente por pessoa + semana + contexto — mantém variação sem repetir frases. */
function rngContexto(nome: string, contexto: string): () => number {
  let s = hashString(`${chaveCanonical(nome)}|${contexto}|${currentWeekNumber()}`) >>> 0;
  s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0;
  s = Math.imul(s ^ (s >>> 13), 3266489917) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return mulberry32(s);
}

const naipePontes = [
  (n: string, c: string) => `${n} soma a ${c}:`,
  (n: string, c: string) => `Com ${c}, o ${n} mostra que`,
  (n: string, c: string) => `O ${n} colore ${c} assim:`,
  (n: string, c: string) => `Aqui o ${n} traduz ${c} em`,
];

function gerarDirecionamentoNaipe(carta: string, naipe: string, nome = ""): string {
  const base = naipeSignificados[naipe] || "uma carta do baralho comum que reforça a leitura desta semana.";
  const nomeCarta = carta.split(" - ")[1] || carta;
  const rng = rngContexto(nome, `naipe|${carta}|${naipe}`);
  const ponte = pick(rng, naipePontes)(naipe, nomeCarta);
  return `${ponte} ${base}`;
}

/** Direcionamento curto do elemento (única camada: baralho Lenormand). */
const elementoDirecionamentos: Record<string, string[]> = {
  "Água": [
    "move o campo emocional: o que chega pede para ser sentido antes de ser decidido.",
    "pede acolhimento e escuta interna — a resposta vem pela intuição, não pela pressa.",
    "trabalha vínculos e memórias afetivas; deixe as emoções correrem sem represar.",
  ],
  "Terra": [
    "pede raiz e paciência: o que começou precisa de tempo para amadurecer.",
    "aterra a leitura no concreto — dinheiro, corpo, rotina e passos possíveis.",
    "mostra que constância vale mais do que impulso nesta semana.",
  ],
  "Fogo": [
    "pede coragem e movimento: a energia só se organiza quando você age.",
    "acende iniciativa — comece pelo que estava sendo adiado, ainda que pequeno.",
    "traz força de decisão; use o calor sem queimar pontes.",
  ],
  "Ar": [
    "pede palavra e clareza: nomear a situação já começa a resolvê-la.",
    "move o campo mental — conversas, ideias e informações destravam o caminho.",
    "convida a organizar o pensamento antes de responder.",
  ],
};

function gerarDirecionamentoLenormand(carta: string, elemento: string, nome = ""): string {
  const nomeCarta = carta.split(" - ")[1] || carta;
  const rng = rngContexto(nome, `elemento|${carta}|${elemento}`);
  const pool = elementoDirecionamentos[elemento] ?? ["acrescenta uma nuance própria a esta leitura."];
  return `${elemento} em ${nomeCarta} ${pick(rng, pool)}`;
}

/** Como a carta cigana vibra junto com a carta do Tarô (sem repetir o significado). */
const combinacaoPontes = [
  (c: string, t: string) => `Junto de ${t}, ${c} vibra assim:`,
  (c: string, t: string) => `${c} e ${t} se encontram nesta semana e mostram que`,
  (c: string, t: string) => `A soma de ${c} com ${t} aponta para`,
  (c: string, t: string) => `${t} dá o tom e ${c} dá o movimento:`,
];
const combinacaoFechos = [
  "É essa combinação que define o ritmo dos seus dias.",
  "As duas cartas pedem a mesma coisa por caminhos diferentes.",
  "Uma abre a porta, a outra mostra por onde passar.",
  "Leia as duas juntas: separadas contam só metade.",
];

function gerarVibracaoCombinada(cartaCigana: string, cartaTaro: string, nome = ""): string {
  const nomeCigana = cartaCigana.split(" - ")[1] || cartaCigana;
  const { tema } = cartaTemas[cartaCigana] ?? { tema: "o tema desta carta" };
  const temaTaro = temasTaro[cartaTaro] ?? "transformação interior";
  const rng = rngContexto(nome, `combinacao|${cartaCigana}|${cartaTaro}`);
  const ponte = pick(rng, combinacaoPontes)(nomeCigana, cartaTaro);
  const fecho = pick(rng, combinacaoFechos);
  return `${ponte} ${tema} atravessa ${temaTaro.split(" — ")[0]}. ${fecho}`;
}



/* ============================================================================
 * Detalhes das cartas ciganas — naipe, elemento e reflexo na vida
 * (correspondências tradicionais do Petit Lenormand)
 * ========================================================================== */

const detalhesCiganas: Record<number, DetalheCartaBase> = {
  1: { naipe: "9 de Copas", elemento: "Água", reflexo: "movimento emocional rápido — notícias chegam tocando o coração e mexem com sua rotina afetiva." },
  2: { naipe: "6 de Ouros", elemento: "Terra", reflexo: "obstáculos materiais e práticos passageiros: pequenos atrasos no dinheiro ou no trabalho que pedem paciência e organização." },
  3: { naipe: "10 de Espadas", elemento: "Ar", reflexo: "expansão mental e mudanças de rumo — viagens, novos contatos à distância, decisões que ampliam horizontes." },
  4: { naipe: "Rei de Copas", elemento: "Água", reflexo: "estabilidade afetiva no lar e na família, segurança emocional e proteção dos vínculos íntimos." },
  5: { naipe: "7 de Copas", elemento: "Água", reflexo: "questões que envolvem saúde, tempo de maturação e raízes — nada se resolve na pressa, pede constância." },
  6: { naipe: "Rei de Paus", elemento: "Fogo", reflexo: "fase nebulosa em projetos e decisões: a clareza chega, mas só depois que você reconhece o que está confuso." },
  7: { naipe: "Dama de Paus", elemento: "Fogo", reflexo: "atenção a falsidades, fofocas e tentações — nem toda intensidade que aparece é segura para você agora." },
  8: { naipe: "9 de Ouros", elemento: "Terra", reflexo: "encerramento concreto de um ciclo material ou afetivo: algo está morrendo para que o novo possa nascer." },
  9: { naipe: "Dama de Ouros", elemento: "Terra", reflexo: "alegrias palpáveis, presentes, gestos doces e reconhecimento que florescem no seu cotidiano." },
  10: { naipe: "Valete de Ouros", elemento: "Terra", reflexo: "decisão prática e definitiva — corte limpo no que não rende mais; coragem de finalizar." },
  11: { naipe: "Valete de Paus", elemento: "Fogo", reflexo: "esforço, repetição e disciplina; ações que pedem persistência mesmo quando ninguém vê." },
  12: { naipe: "7 de Ouros", elemento: "Terra", reflexo: "conversas, recados e fofocas — atenção ao que é falado sobre você e ao que você fala sobre os outros." },
  13: { naipe: "Valete de Espadas", elemento: "Ar", reflexo: "começos puros e ingênuos: novos projetos, ideias frescas e situações que pedem leveza." },
  14: { naipe: "9 de Paus", elemento: "Fogo", reflexo: "alguém ou alguma situação age com astúcia perto de você — confie na intuição mais do que nas palavras." },
  15: { naipe: "10 de Paus", elemento: "Fogo", reflexo: "proteção, autoridade e poder pessoal sólido; figura forte que ampara ou que pede que você se imponha." },
  16: { naipe: "6 de Copas", elemento: "Água", reflexo: "esperança renovada nos sentimentos, fé em recomeços e direção iluminada para o coração." },
  17: { naipe: "Dama de Copas", elemento: "Água", reflexo: "gestação de algo novo: um afeto, um projeto, uma fase fértil que pede cuidado maternal consigo mesma." },
  18: { naipe: "10 de Copas", elemento: "Água", reflexo: "amizade verdadeira, lealdade nos vínculos afetivos e apoio sincero em casa e fora dela." },
  19: { naipe: "6 de Espadas", elemento: "Ar", reflexo: "isolamento que protege e prepara: recolhimento mental para enxergar tudo de cima e ganhar perspectiva." },
  20: { naipe: "8 de Espadas", elemento: "Ar", reflexo: "vida social florescendo, encontros, reconhecimento público e oportunidades em grupo." },
  21: { naipe: "8 de Paus", elemento: "Fogo", reflexo: "desafio duro mas formador — provação que constrói grandeza, exige paciência e resistência interior." },
  22: { naipe: "Dama de Espadas", elemento: "Ar", reflexo: "encruzilhada mental: escolhas, bifurcações e a necessidade de pensar com clareza antes de agir." },
  23: { naipe: "7 de Paus", elemento: "Fogo", reflexo: "pequenas perdas e desgastes que liberam o que era supérfluo — corte gastos, energias e contatos que pesam." },
  24: { naipe: "Valete de Copas", elemento: "Água", reflexo: "amor verdadeiro, ternura, afetos sinceros e uma onda de doçura no campo emocional." },
  25: { naipe: "Ás de Paus", elemento: "Fogo", reflexo: "compromissos, alianças, contratos e promessas que selam uma fase com força e propósito." },
  26: { naipe: "10 de Ouros", elemento: "Terra", reflexo: "segredos, estudos, revelações importantes e conhecimento que muda decisões concretas." },
  27: { naipe: "7 de Espadas", elemento: "Ar", reflexo: "mensagem importante a caminho: notícia, e-mail, conversa decisiva ou comunicação que muda algo." },
  28: { naipe: "Ás de Copas", elemento: "Água", reflexo: "presença masculina marcante (parceiro, pai, amigo, protetor) — alguém com energia firme cruza seu caminho ou já está nele." },
  29: { naipe: "Ás de Espadas", elemento: "Ar", reflexo: "presença feminina marcante (parceira, mãe, amiga, guia) — figura intuitiva e perceptiva atua na sua vida." },
  30: { naipe: "Rei de Espadas", elemento: "Ar", reflexo: "paz, harmonia familiar e maturidade afetiva — relações ganhando profundidade serena." },
  31: { naipe: "Ás de Ouros", elemento: "Terra", reflexo: "sucesso, alegria e luz brilhando sobre você — momento de visibilidade positiva e prosperidade." },
  32: { naipe: "8 de Copas", elemento: "Água", reflexo: "reconhecimento, fama, exposição emocional — o que você sente ganha alcance e visibilidade." },
  33: { naipe: "8 de Ouros", elemento: "Terra", reflexo: "soluções concretas chegando: portas se abrindo no material, no profissional e nas burocracias." },
  34: { naipe: "Rei de Ouros", elemento: "Terra", reflexo: "abundância, prosperidade e fluxo financeiro forte — fase fértil para investir e prosperar." },
  35: { naipe: "9 de Espadas", elemento: "Ar", reflexo: "estabilidade, segurança, raízes firmes — momento de fixar o que estava no ar e construir base sólida." },
  36: { naipe: "6 de Paus", elemento: "Fogo", reflexo: "desafios espirituais, provas de fé — algo dói, mas sustenta e amadurece sua jornada." },
};

const mensagensFoco: Record<string, string[]> = {
  Emocional: [
    "Sua energia emocional pede atenção especial. Permita-se sentir sem julgamento e nomeie o que sente em voz alta — escrever ajuda.",
    "As emoções desta semana são portal de transformação. Acolha cada sentimento e evite tomar decisões definitivas em dias de pico emocional.",
    "O coração pede leveza. Deixe que as emoções fluam como rio em direção ao mar — banhos de descarrego e silêncio funcionam como remédio.",
    "Sua sensibilidade é sua força. Honre cada emoção: marque um café com quem te acolhe e diga não a quem te drena.",
  ],
  Trabalho: [
    "Novos caminhos profissionais se abrem. Confie na intuição em decisões e organize uma lista clara de prioridades para a semana.",
    "Sua dedicação será reconhecida. Mantenha foco e disciplina — entregue o que prometeu antes de aceitar novas demandas.",
    "O universo conspira a favor da sua realização. Torne visível o que você faz, retome um contato que possa somar e mostre seu valor sem timidez.",
    "A criatividade no trabalho será sua aliada. Reserve uma hora por dia para pensar, sem celular, para que ideias originais cheguem.",
  ],
  Saúde: [
    "Cuide do seu templo sagrado. Hidrate-se, durma 7-8h e reduza açúcar e álcool nesta semana — o corpo agradece em poucos dias.",
    "A energia vital precisa de equilíbrio. Caminhe ao ar livre, respire fundo e marque aquele exame ou consulta que vem adiando.",
    "Preste atenção aos sinais do corpo. Tensões na nuca, garganta e estômago são alertas — alongue, respire e suavize a rotina.",
    "Autocuidado é amor próprio. Desligue notificações por uma hora ao dia e dedique esse tempo a algo que recarregue você.",
  ],
  Amor: [
    "O amor se manifesta de formas inesperadas. Abra o coração, mas não confunda intensidade com afinidade verdadeira.",
    "Conexões profundas estão se formando. Seja autêntica — diga o que sente e o que não aceita, com firmeza e doçura.",
    "O amor está mais perto do que imagina. Saia da zona de conforto, aceite convites e vá a lugares novos.",
    "Novas vibrações afetivas chegam. Confie no tempo do coração e não force o passo de quem não quer caminhar contigo.",
  ],
  Relacionamento: [
    "Diálogos sinceros fortalecem laços. Marque uma conversa cara a cara com quem importa e fale do que vem evitando.",
    "Relações passam por renovação. Solte mágoas antigas com um ritual simples — escreva e queime — e abra espaço para o novo.",
    "Harmonia começa dentro de você. Trabalhe sua paciência: respire antes de responder no calor da emoção.",
    "Pessoas importantes trarão mensagens. Esteja atenta às entrelinhas e confirme percepções perguntando, não supondo.",
  ],
  Financeiro: [
    "A prosperidade flui quando há gratidão. Faça uma planilha simples desta semana e identifique um gasto pequeno para cortar.",
    "Novas oportunidades financeiras surgem. Esteja atenta a propostas, indicações e mensagens — não ignore notificações inesperadas.",
    "O universo prepara abundância. Mantenha pensamentos positivos sobre dinheiro e resgate aquele valor parado ou cobrança esquecida.",
    "Ciclos financeiros se renovam. Planeje com fé e ação: defina uma meta clara para o mês e o primeiro passo concreto para atingi-la.",
  ],
  Espiritual: [
    "Sua conexão espiritual se intensifica. Reserve 10 minutos por dia para meditação ou oração silenciosa — cria-se um campo de proteção.",
    "Os guias estão próximos. Anote sonhos, sincronicidades e números repetidos: são mensagens diretas para você.",
    "A espiritualidade é seu escudo. Acenda uma vela branca uma vez na semana e faça um pedido simples e sincero.",
    "Novos dons espirituais despertam. Acolha-os com gratidão e procure uma roda, grupo ou guia para amadurecer com segurança.",
  ],
  Prosperidade: [
    "A abundância pede que você abra espaço. Organize gavetas, doe o que não usa e crie vácuo para o novo entrar.",
    "Prosperidade nasce do merecimento. Repita ao espelho: 'eu recebo com gratidão o que é meu por direito' — e observe as portas se abrirem.",
    "Fluxo financeiro pede movimento. Renegocie uma dívida, cobre um valor esquecido ou apresente uma proposta que estava engavetada.",
    "Fartura chega quando há confiança. Faça uma lista de tudo que já conquistou e agradeça em voz alta antes de pedir o próximo passo.",
  ],
  Família: [
    "Vínculos familiares pedem atenção afetiva. Ligue para quem você ama sem motivo aparente — só para ouvir a voz.",
    "Cure padrões antigos com pequenos gestos. Uma refeição em silêncio, um abraço demorado, uma escuta sem julgar valem mais do que discursos.",
    "Sua linhagem trabalha com você. Coloque uma foto ou objeto de alguém querido em um lugar visível e agradeça a herança recebida.",
    "Harmonia em casa começa por você. Perdoe uma pequena mágoa antiga desta semana — nem precisa contar para ninguém.",
  ],
  Autoconhecimento: [
    "Olhar para dentro é o trabalho mais valente. Reserve 15 minutos por dia para escrever sem editar — deixe a mão falar.",
    "Você é o mistério mais interessante da sua vida. Faça uma pergunta difícil e não fuja da resposta, mesmo que ela mude tudo.",
    "Autoconhecimento se aprofunda com silêncio. Passe um dia da semana com menos telas e mais espelho — literal e simbólico.",
    "Reconheça um padrão que se repete. Nomear é o primeiro passo para transformar; a partir daí, você já não é a mesma pessoa.",
  ],
  Proteção: [
    "Sua energia pede blindagem consciente. Acenda uma vela branca, tome banho com pétalas de rosa e alecrim (do pescoço para baixo) e visualize uma luz azul ao seu redor.",
    "Proteção verdadeira vem de dentro. Afaste-se de conversas densas, ambientes pesados e pessoas que drenam sua vitalidade.",
    "Fortaleça seu campo com gestos simples. Use uma peça de proteção (fio de contas, pedra, medalha) e evite compartilhar planos ainda em gestação.",
    "Seus guias estão em vigília. Confie na intuição que avisa antes: se algo pesar no peito, dê um passo atrás e observe.",
  ],
};

const temasOrixa: Record<string, string> = {
  Exu: "abertura de caminhos, quebra de bloqueios e movimento rápido — Exu remove pedras do trajeto",
  Ogum: "coragem, força guerreira e batalhas vencidas — Ogum corta com sua espada o que trava você",
  Oxóssi: "fartura, prosperidade, novos territórios e caça às oportunidades — Oxóssi guia o tiro certeiro",
  Xangô: "justiça, equilíbrio e decisões firmes — Xangô traz a balança e o machado da verdade",
  Iemanjá: "acolhimento maternal, renovação emocional e cura nos sentimentos — Iemanjá lava mágoas",
  Iansã: "ventos de mudança, libertação e coragem feminina — Iansã varre o que precisa ir embora",
  Omolu: "cura profunda, transformação silenciosa e renascimento — Omolu trabalha no oculto",
  Nanã: "sabedoria ancestral, paciência e maturidade — Nanã ensina o tempo certo das coisas",
  Oxum: "amor, beleza, doçura, autoestima e prosperidade afetiva — Oxum derrama mel no seu caminho",
  Obá: "lealdade, entrega total e força feminina determinada — Obá ensina sobre limites no amor",
  Ewá: "mistério, intuição, clareza espiritual e delicadeza — Ewá ilumina o que é sutil",
  Logunedé: "alegria, juventude, abundância dupla e leveza — Logunedé une fartura e doçura",
  Ossain: "cura através da natureza, ervas e saberes ancestrais — Ossain guia banhos e remédios",
  Ibeji: "leveza, alegria, criança interior e renovação interior — Ibeji devolve o brilho da inocência",
  Ifá: "destino revelado, sabedoria oracular e direção certa — Ifá mostra o caminho exato",
  "Babá Egum": "ancestralidade, proteção dos antepassados e respeito às raízes — Babá sustenta sua linhagem",
  Oxalá: "paz profunda, elevação espiritual e luz maior — Oxalá acalma o que estava em tempestade",
  Oxaguian: "criação com coragem, empreender com fé — Oxaguian une paz e ação em fase de construção",
  "Obaluaê": "cura ativa, transformação da dor em força — Obaluaê dança sobre a ferida e a fecha",
  Oxumaré: "renovação de ciclos, prosperidade que vai e volta — Oxumaré liga céu e terra em movimento",
  "Egunitá": "purificação radical pelo fogo, coragem para renascer — Egunitá queima o que já não serve",
};

const temasTaro: Record<string, string> = {
  "O Louco": "novos começos e salto de fé — é o arcano da coragem pura, de quem confia no caminho mesmo sem ver o próximo passo. Pede leveza, abertura e disposição para arriscar o desconhecido sem se prender ao que ficou para trás.",
  "O Mago": "manifestação e poder pessoal — você tem em mãos as ferramentas necessárias (mente, palavra, ação e vontade). É hora de assumir o protagonismo, formular o pedido com clareza e agir, porque o universo responde a quem se move.",
  "A Sacerdotisa": "intuição profunda e mistérios revelados — guarda saberes que não vêm do raciocínio, mas do silêncio. Convida ao recolhimento, à escuta dos sonhos e à confiança no que sente antes de tudo o que ouve.",
  "A Imperatriz": "abundância, fertilidade e criatividade amorosa — a vida quer florescer através de você. Cuide do corpo, da casa, dos projetos e dos vínculos com generosidade: tudo que você nutrir agora vai dar fruto.",
  "O Imperador": "estrutura, autoridade e estabilidade firme — pede que você ponha ordem onde há bagunça e assuma o comando da própria vida com método e disciplina. Construir base sólida agora sustenta tudo o que vem depois.",
  "O Hierofante": "tradição, fé e orientação espiritual — busca por uma sabedoria mais antiga que você, seja em um mestre, terapeuta, professor ou na própria espiritualidade. Estudo, conselho e respeito aos valores trazem direção.",
  "Os Enamorados": "escolhas do coração e alinhamento de valores — não é só sobre amor romântico, é sobre escolher com integridade. Uma decisão importante pede que você ouça o que sente e diga sim ao que vibra junto com sua verdade.",
  "O Carro": "vitória, movimento decisivo e conquista por mérito — você tem condições de vencer, desde que mantenha foco e direção única. Sem dispersão, sem desviar: o destino se cumpre porque você dirige firme.",
  "A Força": "domínio interior e suavidade poderosa — vencer a feras internas (medo, raiva, ansiedade) com mansidão, não com luta. Coragem aqui é controlar a reação e responder com calma quando tudo pede explosão.",
  "O Eremita": "introspecção e luz que vem do silêncio — momento de recolhimento, autoconhecimento e busca interior. Afaste-se um pouco do barulho do mundo: as respostas que você procura nascem quando você se escuta.",
  "A Roda da Fortuna": "ciclos virando a seu favor — algo que estava parado começa a se mover, e o que estava em movimento vai mudar de direção. Aceite que a vida gira, solte o controle e confie na correnteza.",
  "A Justiça": "equilíbrio, verdades vindo à tona e decisões justas — colheita do que foi semeado. É hora de assumir responsabilidades, fechar pendências e tomar decisões com clareza ética, mesmo que doam.",
  "O Pendurado": "pausa necessária e nova perspectiva — algo precisa ficar suspenso para você enxergar de outro ângulo. Não force, não decida agora: a espera consciente é parte do processo e revela o que pressa esconde.",
  "A Morte": "encerramentos que libertam — uma fase chega ao fim para outra nascer. Não há volta para o que terminou, e tudo bem: deixar morrer o que já não tem vida é o que abre espaço para o verdadeiramente novo.",
  "A Temperança": "harmonia, moderação e mistura de opostos — equilíbrio entre extremos. Cura, paciência e a arte de combinar elementos diferentes (trabalho e descanso, dar e receber, falar e calar) trazem a paz que faltava.",
  "O Diabo": "libertação de apegos e ilusões que prendem — algo te domina (um vício, uma relação, um medo, um padrão). O arcano mostra a corrente para que você perceba que ela está frouxa e pode ser tirada.",
  "A Torre": "ruptura que liberta e verdade exposta — uma estrutura falsa cai de repente. Pode doer, mas é necessário: o que ruiu não tinha base, e o vazio que sobra é o início de algo verdadeiro.",
  "A Estrela": "esperança renovada e luz após a tempestade — uma fase difícil passa e a paz volta. Inspiração, fé e a certeza tranquila de que você está no caminho certo voltam a iluminar suas escolhas.",
  "A Lua": "intuição, sonhos e cura emocional profunda — mergulho no inconsciente, nos medos antigos e nas emoções que ainda não foram olhadas. Aceite a névoa: ela é parte de uma travessia que termina em luz.",
  "O Sol": "alegria, clareza e brilho público — momento solar de sucesso, reconhecimento e felicidade visível. Tudo o que estava escondido é iluminado, e você pode finalmente se mostrar inteira sem medo.",
  "O Julgamento": "renascimento e chamado interior — uma segunda chance bate à porta. Algo que parecia perdido volta com outra cara, e você é convidada a se reconciliar com seu passado para reescrever seu futuro.",
  "O Mundo": "conclusão de um ciclo com plenitude — uma etapa importante se completa em harmonia. Conquista, expansão e a sensação real de chegada: você venceu uma fase, agora celebre antes de iniciar a próxima.",
};

const temasNumero: Record<number, string> = {
  1: "iniciar com coragem e liderar seu próprio caminho — é tempo de começar, não de esperar",
  2: "cultivar parcerias, equilíbrio e diplomacia nas relações — escutar tanto quanto falar",
  3: "expressar sua criatividade, comunicar seu dom e ocupar espaço com leveza",
  4: "construir bases sólidas com disciplina, organização e rotina sustentável",
  5: "abraçar mudanças, novas experiências e flexibilidade — fixar pouco, fluir muito",
  6: "cuidar dos seus, do lar e das responsabilidades afetivas com amor maduro",
  7: "aprofundar espiritualidade, estudo e introspecção — verdades nascem do silêncio",
  8: "manifestar abundância material com responsabilidade, foco e visão de longo prazo",
  9: "encerrar ciclos com sabedoria, compaixão e gratidão pelo que foi vivido",
};

const significadosCiganas: Record<number, string> = {
  1: "Movimento e notícias a caminho. Um cavaleiro chega trazendo um recado, uma resposta ou um convite que muda o ritmo da sua semana — fique atenta ao primeiro sinal, ele puxa o resto.",
  2: "Obstáculos pequenos e passageiros, como pedras no caminho. Não são bloqueios definitivos: é a vida pedindo paciência, ajuste de rota e a sabedoria de contornar em vez de forçar.",
  3: "Viagens, deslocamentos e ampliação de horizontes. Pode ser viagem física, mudança de ideia, contato com pessoas de longe ou um projeto que cresce além das fronteiras atuais.",
  4: "Lar, família e segurança emocional. Carta de raiz: cuide da sua casa (física e afetiva), reúna os seus, e perceba que sua base é mais sólida do que você anda enxergando.",
  5: "Raízes profundas, crescimento sólido e maturidade. Nada que vale a pena se constrói rápido — a árvore pede constância, saúde, presença e tempo para que tudo amadureça.",
  6: "Incertezas e nuvens passando. Algo está nebuloso, mas a clareza vem na sequência: não tome decisão definitiva em meio à confusão, espere o vento limpar o céu.",
  7: "Tentações, traições ou astúcia rondando. Não é hora de confiar em todo mundo — fique atenta a propostas boas demais, a quem te bajula sem motivo e a fofocas que carregam veneno.",
  8: "Encerramento de um ciclo, luto ou despedida. Algo precisa morrer para o novo nascer — pode ser uma fase, um vínculo, um padrão. O caixão não é punição, é passagem necessária.",
  9: "Alegrias, presentes, gestos floridos e momentos doces. Carta de presente da vida: aceite os elogios, comemore as pequenas vitórias e perceba o que floresce ao seu redor.",
  10: "Corte necessário e decisão definitiva. A foice ceifa o que já não rende mais — tire da sua vida o que pesa, finalize o pendente e tenha coragem para o ponto final.",
  11: "Esforço, repetição e disciplina. O caminho pede constância — não é hora de buscar atalhos, é hora de fazer o que precisa ser feito, todos os dias, mesmo sem aplauso.",
  12: "Conversas, recados, fofocas e boas notícias circulando. Cuide do que fala e do que escuta nesta semana: as palavras têm peso e voam mais rápido do que você imagina.",
  13: "Novos começos, leveza e pureza. Carta da criança: pequenos projetos que nascem agora pedem cuidado de quem cuida de um broto — leveza, brincadeira e ingenuidade saudável.",
  14: "Cautela com falsidades e jogadas espertas. A raposa indica que alguém age com astúcia perto de você — confie na intuição mais do que nas palavras bonitas que estiver ouvindo.",
  15: "Proteção, força, autoridade e poder pessoal. O urso traz amparo de alguém forte (ou pede que você assuma essa força) — é hora de se impor com firmeza, não com agressão.",
  16: "Esperança renovada, fé e direção iluminada. A estrela é promessa de paz após dias difíceis — confie, inspire-se e siga porque o céu está aberto e a sorte caminha contigo.",
  17: "Chegada de algo novo, fertilidade e gestação. Pode ser filho, projeto, fase, mudança importante — algo está sendo gerado e pede cuidado maternal de você consigo mesma.",
  18: "Amizade verdadeira, fidelidade e apoio sincero. O cão lembra que você não está sozinha: alguém de confiança caminha ao seu lado, e essa relação merece cuidado mútuo.",
  19: "Isolamento que protege e prepara. A torre indica recolhimento necessário — afaste-se do barulho por uns dias para enxergar tudo de cima e voltar com clareza maior.",
  20: "Vida social florescente, encontros e felicidade pública. Carta de festa: aceite convites, mostre-se, conecte-se. Boas pessoas vão entrar na sua história nesta semana.",
  21: "Desafio duro mas formador. A montanha pede paciência e resistência interior — não é castigo, é prova que constrói grandeza em quem tem coragem de continuar subindo.",
  22: "Decisões, escolhas e bifurcações. Você está numa encruzilhada — pense com clareza, sinta com honestidade e escolha o caminho que ressoa com quem você é agora, não com quem foi.",
  23: "Pequenas perdas que liberam o supérfluo. O rato rói o que não serve mais — pode ser dinheiro mal gasto, energia mal investida ou contato que drena. Solte sem dó.",
  24: "Amor verdadeiro, afeto, ternura e doçura nos vínculos. Carta linda: abra o coração, expresse o que sente e receba sem culpa o cuidado que vier em sua direção.",
  25: "Compromissos, alianças, contratos e promessas. Algo está sendo selado nesta semana — vínculo, sociedade, acordo. Leia o que assina, prometa só o que pode cumprir.",
  26: "Segredos, estudos e revelações importantes. Os livros indicam que algo escondido vem à tona, ou que um estudo/conhecimento vai mudar suas decisões práticas.",
  27: "Mensagens decisivas a caminho. Notícia, documento, e-mail, conversa importante: algo escrito ou dito vai trazer informação que reorganiza alguma área da sua vida.",
  28: "Presença masculina marcante — parceiro, pai, amigo, protetor. O Cigano simboliza uma figura firme e provedora que cruza (ou já está) seu caminho com energia ativa e decidida.",
  29: "Presença feminina marcante — parceira, mãe, amiga, guia. A Cigana representa uma figura intuitiva e perceptiva que atua na sua vida trazendo cuidado, escuta ou conselho.",
  30: "Paz, harmonia familiar e maturidade afetiva. Os lírios indicam relações ganhando profundidade serena — gratidão pelo que já foi construído com tanto cuidado.",
  31: "Sucesso, alegria e luz brilhando sobre você. Carta solar de visibilidade positiva: o que estava na sombra é iluminado e celebrado — momento de prosperidade e brilho.",
  32: "Reconhecimento, fama e exposição emocional. A lua amplifica o que você sente — tudo fica mais visível, mais intenso. Use a visibilidade para o bem, com responsabilidade.",
  33: "Soluções chegando e portas se abrindo. A chave destrava o que estava emperrado — burocracias, decisões, oportunidades materiais começam finalmente a fluir.",
  34: "Abundância, prosperidade e fluxo material forte. Fase fértil para o dinheiro — invista, multiplique, mas mantenha gratidão e generosidade para a roda continuar girando.",
  35: "Estabilidade, segurança e raízes firmes. A âncora pede que você fixe o que estava no ar — assuma compromissos, construa base sólida e confie no terreno que pisa.",
  36: "Desafios espirituais e prova de fé. A cruz é a carta mais densa do baralho: algo dói e amadurece, mas sustenta — peça ajuda espiritual e confie que tudo tem propósito.",
};

function numeroDaCartaCigana(carta: string): number {
  const m = carta.match(/Carta\s+(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

const mensagensSaudeBase: ((orixa: string, taro: string) => string)[] = [
  (_o, taro) => `Equilíbrio entre corpo e espírito é essencial. ${taro} indica que mudanças internas refletem na saúde física: cuide-se com amor, marque exames de rotina e respeite seus limites.`,
  (orixa, _t) => `${orixa} pede que você desacelere. Hidrate-se bem, durma cedo pelo menos 3 noites desta semana e ouça o que o corpo sussurra antes que precise gritar.`,
  (_o, taro) => `${taro} traz alerta sobre a área emocional refletida no corpo. Ansiedade e cansaço pedem pausa — reduza cafeína, faça respirações profundas e evite telas antes de dormir.`,
  () => `Movimento é cura. Caminhadas de 30 minutos, alongamento ao acordar ou contato com a natureza no fim de semana vão restaurar sua energia vital.`,
  (orixa) => `A energia de ${orixa} fortalece sua imunidade emocional. Alimente-se com leveza, prefira frutas e verduras frescas e evite excessos que pesam corpo e mente.`,
  () => `Atenção à região do peito, ombros e garganta — emoções não ditas viram tensão física. Permita-se chorar, falar com alguém de confiança ou escrever o que sente.`,
  (_o, taro) => `${taro} aponta regeneração. Banhos de ervas leves (alecrim, manjericão ou alfazema), sempre do pescoço para baixo, descanso e silêncio serão remédios poderosos nesta semana.`,
];

/* ============================================================================
 * Sugestões práticas — listas amplas e variadas
 * ========================================================================== */
const sugestoesPorFoco: Record<string, string[]> = {
  Emocional: [
    "Escreva 3 emoções que sentiu hoje antes de dormir",
    "Faça um banho de alecrim e alfazema (do pescoço para baixo) no domingo para descarregar a semana",
    "Identifique 1 pessoa que te drena e crie distância gentil esta semana",
    "Reserve 20 minutos sozinha por dia, sem celular",
    "Chore se precisar — não engole o que está pedindo passagem",
  ],
  Trabalho: [
    "Faça uma lista das 3 prioridades reais da semana e ignore o resto",
    "Revise como você apresenta o seu trabalho para quem precisa conhecê-lo",
    "Mande mensagem para um contato profissional adormecido",
    "Diga não a uma demanda extra que não cabe no seu prato",
    "Resolva a tarefa mais chata logo cedo — depois o dia flui",
  ],
  Saúde: [
    "Beba pelo menos 2 litros de água por dia",
    "Marque aquele exame ou consulta que vem adiando",
    "Caminhe 30 minutos ao ar livre 3 vezes na semana",
    "Reduza açúcar, álcool ou frituras por 7 dias e observe",
    "Durma com o celular fora do quarto pelo menos 2 noites",
  ],
  Amor: [
    "Aceite um convite que você normalmente recusaria",
    "Cuide da sua autoestima: faça algo que te deixe linda por você",
    "Não responda mensagem ambígua — espere a clareza vir",
    "Liste 3 qualidades inegociáveis em quem você quer ao lado",
    "Acenda uma vela rosa na sexta-feira pedindo amor verdadeiro",
  ],
  Relacionamento: [
    "Marque uma conversa cara a cara com quem importa",
    "Peça desculpa primeiro — mesmo que metade da razão seja sua",
    "Escreva uma mágoa antiga em papel e queime no domingo",
    "Pergunte antes de supor — confirme percepções",
    "Reserve um tempo de qualidade com a família esta semana",
  ],
  Financeiro: [
    "Liste todos os seus gastos fixos em uma planilha simples",
    "Identifique 1 gasto pequeno e recorrente para cortar",
    "Resgate aquele valor parado ou cobrança esquecida",
    "Defina uma meta financeira para o mês e o primeiro passo concreto",
    "Negocie uma dívida ou parcela ainda esta semana",
  ],
  Espiritual: [
    "Acenda uma vela branca uma vez nesta semana e faça um pedido sincero",
    "Anote os sonhos ao acordar por 7 dias seguidos",
    "Faça um banho de ervas leves (alecrim, manjericão ou alfazema) do pescoço para baixo, no sábado",
    "Reserve 10 minutos diários de silêncio ou meditação",
    "Observe números repetidos e sincronicidades — anote-os",
  ],
};

const sugestoesUniversais: string[] = [
  "Cuide de uma planta esta semana — terra reorganiza energia",
  "Tome sol da manhã por 10 minutos pelo menos 3 vezes",
  "Evite decisões importantes em dias de cansaço extremo",
  "Agradeça em voz alta 3 coisas todas as manhãs",
  "Faça uma faxina simbólica em uma gaveta ou armário",
  "Escute uma música que te emocione e chore se precisar",
  "Coloque flores em casa — energizam o ambiente",
  "Reduza tempo em redes sociais por 3 dias e observe a mudança",
];

function gerarSugestoes(nome: string, foco: string, contexto = "", salt = 0): string[] {
  const lista = sugestoesPorFoco[foco] || sugestoesPorFoco.Espiritual;
  // Semente combina pessoa + semana + cartas sorteadas: trocar a carta ou a
  // semana realmente troca o direcionamento prático, sem repetir frases.
  const seed =
    hashString(chaveCanonical(nome) + "|" + foco + "|" + contexto) * 31 +
    currentWeekNumber() * 787 +
    salt;
  const rng = mulberry32(seed);
  return [
    ...sampleN(rng, lista, 2),
    ...sampleN(rng, sugestoesUniversais, 1),
  ];
}

/* ============================================================================
 * Gerador combinatório — fragmentos curtos que se misturam para criar
 * mensagens praticamente únicas a cada semana, sem frases prontas repetidas.
 * ========================================================================== */

// Pequeno PRNG determinístico (Mulberry32) — gera sequência de inteiros
// reprodutível a partir de uma seed; usado para escolher fragmentos.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0);
  };
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[rng() % arr.length];
}

/* ----- Pools para a MENSAGEM ESPIRITUAL (curta, humanizada, sem recap) ----- */
const espVocativos = [
  (n: string) => `${n}, sua alma`,
  (n: string) => `Há em você, ${n}, uma força sutil que`,
  (n: string) => `${n}, no fundo do seu peito algo`,
  (n: string) => `${n}, percebo que o invisível em você`,
  (n: string) => `${n}, sua energia esta semana`,
  (n: string) => `${n}, há um movimento silencioso em você que`,
  (n: string) => `${n}, sua intuição`,
  (n: string) => `${n}, o seu campo espiritual`,
];

const espAcoes = [
  "pede um momento de silêncio antes das respostas",
  "vibra com pedidos antigos prestes a serem ouvidos",
  "se reorganiza por dentro, mesmo sem você notar",
  "está mais aberta do que parece — preste atenção aos sinais miúdos",
  "respira fundo depois de uma fase pesada",
  "sente que algo está se concluindo sem alarde",
  "convida você a recolher-se um pouco antes de florescer de novo",
  "se desnuda de máscaras que pesavam mais do que protegiam",
  "lembra você de coisas que o corpo já sabia",
  "está pedindo gentileza, não disciplina",
];

const espPontes = [
  "Não force a clareza: ela vem.",
  "Confie no que sentir antes de pensar.",
  "Não é hora de explicar — é hora de habitar.",
  "Há sabedoria no que ainda não tem nome.",
  "O invisível trabalha mesmo enquanto você dorme.",
  "Pequenos silêncios curam mais do que muitos conselhos.",
  "O que importa não está no barulho do dia.",
  "Você tem permissão para descansar de si mesma.",
  "Os sinais vêm em camadas — não cobre tudo de uma vez.",
];

const espIntimo = [
  "Acenda uma vela só sua e fique uns minutos olhando a chama.",
  "Pergunte ao espelho o que você precisa ouvir hoje — e escute.",
  "Anote ao acordar a primeira palavra que vier — ela é recado.",
  "Caminhe descalça num pedaço de terra ou grama nesta semana.",
  "Reserve uma noite para não responder ninguém — só você consigo.",
  "Coloque uma música antiga que te emocione e deixe vir o que vier.",
  "Escreva uma carta para si mesma e guarde para abrir em um mês.",
  "Tome um banho longo pensando em soltar o que pesa.",
  "Acolha um sonho desta semana como mensagem — ele tem algo a dizer.",
];

function gerarMensagemEspiritual(nome: string): string {
  const seed = hashString(chaveCanonical(nome)) * 7 + currentWeekNumber() * 131;
  const rng = mulberry32(seed);
  const voc = pick(rng, espVocativos)(nome);
  const acao = pick(rng, espAcoes);
  const ponte = pick(rng, espPontes);
  const intimo = pick(rng, espIntimo);
  return `${voc} ${acao}. ${ponte} ${intimo}`;
}

/* ----- Pools para o CONSELHO DA CIGANA ESTELLA (fecha a leitura) ----- */


const estellaIncentivos = [
  "Você é muito mais forte do que os medos que te visitam — confie no que carrega no peito.",
  "Nada do que dói agora vai vencer o que você tem de luz — siga, minha querida.",
  "Não desista de si mesma: a vida está preparando algo lindo com o seu nome escrito.",
  "Você tem asas, mesmo quando esquece — abra-as sem medo, o vento sopra a seu favor.",
  "Onde outros veem fim, você tem o dom de enxergar recomeço — honre esse dom.",
  "Sua caminhada tem propósito grande, mesmo quando os passos parecem pequenos.",
  "O amor que você planta volta em dobro — continue amando, mesmo quando o mundo endurecer.",
  "Levante a cabeça: você é filha da luz e nenhuma sombra apaga esse brilho.",
  "Tudo o que você entrega com o coração aberto, a vida devolve em forma de milagre.",
];

const estellaBencaos = [
  "Que o amor te cerque, a gratidão te sustente e a fé te empurre para a frente.",
  "Que sua semana seja abraçada por anjos e vestida de coragem doce.",
  "Que os caminhos se abram com leveza e que o coração encontre paz em cada gesto.",
  "Que a luz maior te cubra e que nenhuma tempestade tire o brilho dos seus olhos.",
  "Que você seja lembrada por quem ama e protegida por quem te guarda no invisível.",
  "Que a alegria te encontre nos detalhes e a paz te espere no fim de cada dia.",
  "Que a fartura em amor, saúde e propósito visite sua casa nesta semana.",
];

const estellaAssinaturas = [
  "Com amor infinito, Cigana Estella.",
  "Um beijo na sua alma — Cigana Estella.",
  "Te abraço com carinho, Cigana Estella.",
  "Salve o amor! Cigana Estella.",
  "Sigo contigo em espírito — Cigana Estella.",
  "Com afeto e gratidão, Cigana Estella.",
  "Que assim seja, minha querida. Cigana Estella.",
];

function gerarMensagemFinalDinamica(nome: string): string {
  const seed = hashString(chaveCanonical(nome)) * 13 + currentWeekNumber() * 257;
  const rng = mulberry32(seed);
  const incentivo = pick(rng, estellaIncentivos);
  const bencao = pick(rng, estellaBencaos);
  const assinatura = pick(rng, estellaAssinaturas);
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;
  return `${primeiroNome}, ${incentivo} ${bencao} ${assinatura}`;
}

/* ============================================================================
 * Wrapper para variar QUALQUER descrição fixa por semana — envolve o texto
 * núcleo com aberturas e fechamentos rotativos, dando sensação personalizada.
 * ========================================================================== */
const variaAberturas: Record<string, string[]> = {
  cigana: [
    "Esta carta chega trazendo:", "Sua cigana da semana fala de", "A leitura aponta:",
    "O que essa carta abre para você:", "Olhe esta carta como recado vivo —",
    "A mensagem que ela traz é clara:", "A energia desta carta diz:",
  ],
  taro: [
    "O arcano desta semana mostra:", "Este arcano se apresenta como sinal de",
    "Sua carta do tarô fala de", "A essência deste arcano para você é:",
    "Olhando seu arcano com calma, vemos:", "O recado deste arcano é:",
    "A simbologia desta carta aponta:",
  ],
  orixa: [
    "Sua energia regente nesta semana:", "Quem caminha contigo agora é",
    "O orixá da semana se apresenta assim:", "A força espiritual que te ampara diz:",
    "Esta semana você é guiada por:", "A vibração espiritual em ação:",
  ],
  numero: [
    "A vibração numerológica da semana é clara:", "Seu número da semana fala de",
    "A numerologia aponta:", "O dígito desta semana pede que você",
    "Este número chega como recado de", "A cabala desta semana traz:",
  ],
  naipe: [
    "O naipe correspondente revela:", "Traduzindo no baralho comum, esta carta indica:",
    "A leitura pelo naipe mostra:", "Visto pelo baralho cigano-comum, aponta:",
    "O equivalente em baralho tradicional diz:",
  ],
};

const variaFechamentos: Record<string, string[]> = {
  cigana: [
    "Receba esta mensagem com atenção.", "Esta carta pede presença sua.",
    "Olhe esse recado com carinho.", "Honre esse aviso na sua semana.",
    "Deixe que ela trabalhe em silêncio em você.", "Confie no que ela está te mostrando.",
  ],
  taro: [
    "Este é o convite do arcano.", "Acolha esse chamado.", "Deixe esse símbolo te guiar.",
    "Essa é a orientação desta semana.", "Permita que ele se cumpra em você.",
  ],
  orixa: [
    "Que sua energia te sustente.", "Agradeça em silêncio essa presença.",
    "Acenda uma vela em homenagem se sentir o chamado.", "Confie nessa proteção.",
    "Honre essa força com pequenos gestos.",
  ],
  numero: [
    "Use esta vibração com consciência.", "Que esse número te oriente nas escolhas.",
    "Deixe essa energia trabalhar em você.", "Lembre dessa direção quando bater dúvida.",
  ],
  naipe: [
    "Esse é o sabor desta carta na sua vida.", "Considere essa nuance ao olhar a leitura.",
    "Esse detalhe colore tudo o que vem a seguir.", "Guarde esse simbolismo de fundo.",
  ],
};

function variarTexto(coreText: string, _nome: string, _salt: number, _categoria: keyof typeof variaAberturas): string {
  // Sem aberturas/fechamentos fixos — devolve apenas o texto-núcleo da leitura,
  // que já muda com a carta/orixá/número escolhidos para a semana e para a pessoa.
  return coreText.trim().replace(/[.!?]+$/, "") + ".";
}


interface GerarLeituraOptions {
  semanaInicio?: Date;
  semanaFim?: Date;
  orixaOverride?: string;
  focoOverride?: string;
  cartaCiganaOverride?: string;
  cartaTaroOverride?: string;
}

const orixaPerfilFallback: OrixaPerfil = {
  descricao: "Uma força espiritual amorosa caminha ao seu lado nesta semana, oferecendo proteção e direção sutil.",
  ondeAjuda: "Fortalece sua intuição, protege sua energia e ajuda a discernir os passos certos em momentos de dúvida.",
  cores: ["Branco"],
  diaSemana: "Domingo",
  elemento: "Ar",
  saudação: "Axé!",
};

// Direcionamento do Orixá conforme o FOCO da pessoa naquela semana — garante
// que dois membros da mesma família com focos diferentes recebam mensagens
// diferentes, mesmo caindo o mesmo Orixá. Frase entra na "descricao".
const orixaDirecionamentoFoco: Record<string, ((o: string) => string)[]> = {
  Emocional: [
    (o) => `Nesta semana, ${o} concentra sua força no seu campo emocional — vem acalmar oscilações internas e ajudar você a nomear o que sente antes de reagir.`,
    (o) => `A energia de ${o} agora está voltada para o seu coração: pede que você acolha as próprias emoções sem julgar e permita-se sentir o que vinha empurrando para depois.`,
    (o) => `${o} aparece esta semana como cuidador do seu mundo interno, trazendo firmeza para atravessar humores densos sem se perder deles.`,
    (o) => `A força de ${o} nestes dias trabalha por dentro, dissolvendo mágoas antigas e ensinando você a se escutar com mais ternura.`,
  ],
  Trabalho: [
    (o) => `${o} concentra sua força esta semana no seu campo do trabalho — abre caminhos onde havia trava e traz autoridade para você ocupar seu lugar.`,
    (o) => `A energia de ${o} atua agora na sua vida profissional: mostra qual atitude entrega resultado e onde vale investir seu esforço.`,
    (o) => `Nesta semana, ${o} vem colocar movimento na sua carreira — pede coragem para propor, pedir, negociar ou encerrar o que não serve mais.`,
    (o) => `${o} se manifesta no seu trabalho como sinal de que é hora de agir com estratégia, não com pressa; deixe essa presença guiar suas decisões práticas.`,
  ],
  Saúde: [
    (o) => `A força de ${o} nesta semana volta-se para o seu corpo — pede atenção ao sono, à alimentação e aos sinais físicos que você vinha ignorando.`,
    (o) => `${o} chega para curar em você o que estava fora do eixo: escute o corpo, respeite os limites e busque cuidado antes que o cansaço vire adoecimento.`,
    (o) => `Nestes dias, ${o} trabalha a sua vitalidade — trazendo disposição de volta e afastando peso energético que se acumulava.`,
    (o) => `A vibração de ${o} atua no seu campo da saúde como uma revisão amorosa: hora de retomar hábitos, marcar exames e cuidar do templo que é o seu corpo.`,
  ],
  Amor: [
    (o) => `${o} concentra sua força esta semana no seu campo do amor — vem para desatar nós antigos e abrir espaço para vínculos mais verdadeiros.`,
    (o) => `A energia de ${o} atua agora no seu coração afetivo: mostra o que merece ser cuidado e o que já passou da hora de ir.`,
    (o) => `Nesta semana, ${o} aparece como testemunha do seu amor-próprio — pede que você se escolha primeiro para conseguir se entregar sem se perder.`,
    (o) => `A presença de ${o} nesses dias favorece encontros significativos e reconciliações que precisam de verdade para acontecer.`,
  ],
  Relacionamento: [
    (o) => `${o} volta sua força esta semana para os seus relacionamentos — pede diálogo claro, escuta ativa e coragem para nomear o que vinha calado.`,
    (o) => `A energia de ${o} atua nos seus vínculos, mostrando quais laços te sustentam de verdade e quais estão pedindo ajuste ou despedida.`,
    (o) => `Nestes dias, ${o} ajuda você a se posicionar sem agressividade — dá firmeza para dizer não e leveza para reconstruir pontes que valem a pena.`,
    (o) => `${o} chega para equilibrar entrega e limite: ensina você a estar perto sem se anular e a se afastar sem culpa.`,
  ],
  Financeiro: [
    (o) => `${o} concentra sua força esta semana na sua vida financeira — pede organização, revisão de gastos e coragem para pedir o que é justo.`,
    (o) => `A energia de ${o} atua no seu campo material: abre canais de renda e mostra onde há dinheiro escapando por descuido.`,
    (o) => `Nesta semana, ${o} vem acender no seu bolso o que estava travado — favorece cobranças, negociações e novas fontes de entrada.`,
    (o) => `A presença de ${o} nesses dias trabalha a sua relação com o dinheiro por dentro: crenças antigas de escassez pedem para ser revistas.`,
  ],
  Espiritual: [
    (o) => `${o} concentra sua força esta semana no seu campo espiritual — aproxima você do sagrado e afina sua percepção dos sinais.`,
    (o) => `A energia de ${o} atua agora no seu eixo interno: pede oração simples, silêncio e reconexão com o que você acredita.`,
    (o) => `Nestes dias, ${o} chega como chamado para retomar sua prática espiritual — banho, vela, meditação, o que fizer sentido para você.`,
    (o) => `A vibração de ${o} nesta semana amplia sua mediunidade e sensibilidade; guarde tempo para receber, não só para fazer.`,
  ],
  Prosperidade: [
    (o) => `${o} volta sua força esta semana para a sua prosperidade — favorece colheitas, reconhecimento e retorno de esforços antigos.`,
    (o) => `A energia de ${o} atua agora sobre o que você constrói: mostra onde o solo é fértil e pede paciência com o que ainda amadurece.`,
    (o) => `Nesta semana, ${o} abre canais de abundância — esteja atenta a convites, propostas e oportunidades que chegam por caminhos indiretos.`,
    (o) => `A presença de ${o} nesses dias amplia seu merecimento: aceite ajuda, receba elogios e diga sim para o que multiplica sua vida.`,
  ],
  Família: [
    (o) => `${o} concentra sua força esta semana no seu círculo familiar — pede diálogo, perdão e cuidado com laços que precisam de atenção.`,
    (o) => `A energia de ${o} atua na sua linhagem: cura padrões repetidos e devolve leveza aos encontros dentro de casa.`,
    (o) => `Nestes dias, ${o} traz reaproximação familiar — uma conversa, uma visita ou uma memória vai reorganizar o que estava fora do lugar.`,
    (o) => `A presença de ${o} nesta semana protege quem você ama; peça em silêncio pela sua família e observe as respostas chegarem.`,
  ],
  Autoconhecimento: [
    (o) => `${o} volta sua força esta semana para o seu autoconhecimento — pede pausa, escrita, terapia ou qualquer prática que te faça se olhar de verdade.`,
    (o) => `A energia de ${o} atua no seu espelho interno: mostra padrões que se repetem e convida você a escolher outra resposta desta vez.`,
    (o) => `Nesta semana, ${o} ilumina zonas suas que estavam no escuro — não com julgamento, mas com compreensão amorosa do que te trouxe até aqui.`,
    (o) => `A presença de ${o} nesses dias favorece insights sobre o seu próprio funcionamento; anote o que vier, mesmo que pareça pequeno.`,
  ],
  Proteção: [
    (o) => `${o} concentra sua força esta semana em te proteger — cerca sua energia, afasta olhar pesado e reforça seu campo aurático.`,
    (o) => `A energia de ${o} atua agora como escudo: pede que você reduza exposição a ambientes densos e escolha bem com quem convive.`,
    (o) => `Nesta semana, ${o} chega como guardião — tome um banho de alecrim e alfazema do pescoço para baixo, mantenha um copo de água por perto e confie na sua intuição.`,
    (o) => `A presença de ${o} nesses dias fecha o seu corpo espiritual; qualquer desconforto energético pede oração curta e simples.`,
  ],
};

// Aplicação prática do foco para o "onde ajuda" — outro pool, mais concreto,
// para garantir variação também nessa parte quando muda o foco ou o nome.
const orixaAplicacaoFoco: Record<string, string[]> = {
  Emocional: [
    "Na prática, essa força te ajuda esta semana a atravessar dias mais sensíveis sem se machucar por dentro.",
    "Aproveite para escrever o que sente antes de responder — a energia favorece clareza emocional.",
    "Um bom choro, uma conversa sincera ou um silêncio bem feito vão descarregar o que estava pesando.",
    "Reduza estímulos densos: escolha companhia leve, música calma e pouca tela nesta semana.",
  ],
  Trabalho: [
    "Na prática, é semana boa para propor, negociar, cobrar o que é seu e mostrar o valor do seu trabalho.",
    "Organize a agenda, priorize o que dá resultado e não gaste energia com o que não move sua carreira.",
    "Uma conversa profissional adiada pode ganhar respostas positivas — dê o primeiro passo.",
    "Cuide da postura, do e-mail bem escrito, do detalhe pequeno: esta força multiplica o que é feito com cuidado.",
  ],
  Saúde: [
    "Na prática, marque aquele exame, retome a caminhada, durma mais cedo — o corpo pede constância, não milagre.",
    "Semana boa para banhos de ervas, alimentação leve e diminuir açúcar, álcool e frituras.",
    "Escute os avisos sutis do corpo: cansaço, dor de cabeça e insônia estão pedindo revisão de rotina.",
    "Mova-se todos os dias, mesmo que 15 minutos — a energia parada é o que mais adoece.",
  ],
  Amor: [
    "Na prática, favorece encontros verdadeiros e conversas que precisam acontecer sem rodeios.",
    "Se está sozinha, invista em se sentir bem com você mesma — atração real nasce daí.",
    "Se está em relação, uma pequena atitude carinhosa pode reacender algo que andava morno.",
    "Fuja de repetir padrões antigos: se algo parece 'igual a antes', pare e escute o alerta.",
  ],
  Relacionamento: [
    "Na prática, boa semana para conversar o que estava engolido — com firmeza e sem ataque.",
    "Reveja com quem você compartilha seu tempo: nem toda companhia merece o seu melhor.",
    "Se algum vínculo importante está distante, um gesto simples de retomada pode reabrir o canal.",
    "Aprenda a diferença entre entrega e submissão — esta força te ajuda a se posicionar sem culpa.",
  ],
  Financeiro: [
    "Na prática, organize planilhas, revise assinaturas e corte pequenos gastos que somam muito.",
    "Semana boa para cobrar quem te deve, renegociar dívidas e pedir aumento se cabe no cenário.",
    "Guarde antes de gastar — mesmo que pouco, o hábito abre canal para mais dinheiro entrar.",
    "Evite decisões financeiras impulsivas: durma sobre qualquer compra grande antes de fechar.",
  ],
  Espiritual: [
    "Na prática, retome sua prática espiritual mesmo que curtinha — 5 minutos de silêncio já mudam sua semana.",
    "Acenda uma vela branca em algum momento, agradeça pelo que já tem e peça pelo que precisa.",
    "Escute sonhos, sincronicidades e pequenos sinais: sua intuição está falando mais alto que o costume.",
    "Reduza barulho externo para ouvir o interno — menos redes sociais, mais natureza e oração.",
  ],
  Prosperidade: [
    "Na prática, diga sim para oportunidades que chegam, mesmo que exijam sair da zona conhecida.",
    "Semana boa para apresentar propostas, pedidos e combinados — a energia favorece o retorno positivo.",
    "Agradeça em voz alta pelo que já tem; a gratidão é o portal mais rápido da abundância.",
    "Cuide do dinheiro que já entra com carinho — organizar o pouco atrai o muito.",
  ],
  Família: [
    "Na prática, procure quem anda distante, mande mensagem, marque uma refeição em casa.",
    "Semana boa para conversar sobre temas familiares que ficavam sempre para depois.",
    "Cuide dos mais velhos e dos mais novos com atenção extra — esses vínculos estão pedindo presença.",
    "Se há mágoa antiga na família, escreva o que sente (mesmo sem enviar) — descarrega e cura.",
  ],
  Autoconhecimento: [
    "Na prática, tire um tempo sozinha, sem pressa e sem produtividade — só para se ouvir.",
    "Semana boa para terapia, journaling, meditação e revisão da própria história com afeto.",
    "Anote os gatilhos que aparecerem: eles são mapa para entender o que ainda precisa cura.",
    "Menos comparação com os outros, mais curiosidade sobre si — comece por perguntas simples.",
  ],
  Proteção: [
    "Na prática, tome um banho de ervas leves (alecrim, alfazema ou manjericão), sempre do pescoço para baixo.",
    "Evite discussões desnecessárias, ambientes tóxicos e conversas de fofoca — economize sua energia.",
    "Ande com um cristal, uma medalha ou algo simbólico que te lembre da sua proteção espiritual.",
    "Feche o dia agradecendo e visualizando uma luz branca ao redor do seu corpo e da sua casa.",
  ],
};

// Quebra um texto base em frases para que só um recorte delas apareça em cada
// leitura — assim o mesmo Orixá nunca sai com o mesmo bloco de texto.
function frasesDe(texto: string): string[] {
  return texto
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.trim())
    .filter(Boolean);
}

// Sorteia um recorte das frases mantendo a ordem original (mín. 1, máx. n-1
// quando houver frases suficientes) — cada pessoa recebe um recorte diferente.
function recorteFrases(rng: () => number, texto: string): string {
  const frases = frasesDe(texto);
  if (frases.length <= 1) return texto;
  const quantidade = Math.max(1, Math.min(frases.length - 1, 1 + Math.floor(rng() * (frases.length - 1))));
  const escolhidas = sampleN(rng, frases, quantidade);
  // reordena conforme a ordem natural do texto
  escolhidas.sort((a, b) => frases.indexOf(a) - frases.indexOf(b));
  return escolhidas.join(" ");
}

function montarOrixaPerfil(orixa: string, nome: string, foco: string): OrixaPerfil {
  const base = orixaPerfis[orixa] ?? orixaPerfilFallback;
  // Semente combina nome + semana + orixá + foco, com mistura forte (avalanche)
  // para que nomes parecidos ("Carol Ruiva" x "Carol Morena") caiam em regiões
  // completamente distintas do gerador.
  const chave = `${chaveCanonical(nome)}|${orixa}|${foco}|${currentWeekNumber()}`;
  let s = hashString(chave) >>> 0;
  s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0;
  s = Math.imul(s ^ (s >>> 13), 3266489917) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  const rng = mulberry32(s);
  const direcionamentosFoco = orixaDirecionamentoFoco[foco] ?? orixaDirecionamentoFoco.Espiritual;
  const aplicacoesFoco = orixaAplicacaoFoco[foco] ?? orixaAplicacaoFoco.Espiritual;
  const direcionamento = pick(rng, direcionamentosFoco)(orixa);
  const aplicacao = pick(rng, aplicacoesFoco);
  const baseDesc = recorteFrases(rng, base.descricao);
  const baseAjuda = recorteFrases(rng, base.ondeAjuda);
  return {
    ...base,
    // Texto direto: sem frases de abertura/fechamento fixas que se repetiam.
    descricao: `${direcionamento} ${baseDesc}`,
    ondeAjuda: `${baseAjuda} ${aplicacao}`,
  };

}


/* ============================================================================
 * Numerologia expandida — soma pitagórica do nome (fixa por pessoa) e perfil
 * detalhado com pontos fortes, pontos a observar e o que precisa melhorar.
 * ========================================================================== */
export function calcularNumerologiaNome(nome: string): number {
  // Usa a Vibração do Nome já corrigida no Clube do Tarô (tabela cabalística).
  return calculateNameVibration(nome);
}

function reduzirNumeroParaPerfil(numero: number): number {
  if (numero >= 1 && numero <= 9) return numero;
  let soma = String(Math.abs(numero))
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);
  while (soma > 9) {
    soma = String(soma)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return soma || 1;
}

interface PerfilNumero {
  essenciaNome: string[];
  essenciaSemana: string[];
  orientacaoSemana: string[];
  pontosFortes: string[];
  pontosFracos: string[];
  aMelhorar: string[];
}

const perfilNumero: Record<number, PerfilNumero> = {
  1: {
    essenciaNome: [
      "Você é uma alma pioneira: nasceu para começar coisas, liderar caminhos e abrir portas que outros nem enxergam. Sua marca é a coragem de dar o primeiro passo.",
      "Sua energia é de fundadora(or) — onde você chega, algo novo nasce. Não à toa você se sente inquieta quando tudo já está pronto.",
      "Traz uma centelha original: sua identidade é forte e independente, feita para conduzir, não para seguir por seguir.",
      "Você carrega o número da vontade — o que decide de verdade, acontece; o difícil é decidir sem interferência dos outros.",
    ],
    essenciaSemana: [
      "A semana pede iniciativa: comece o que vinha adiando, mesmo pequeno.",
      "Vibração de liderança — assuma o timão da sua semana sem esperar consenso.",
      "Energia de recomeço: hoje é bom dia para plantar algo novo.",
      "Sete dias de afirmação — diga sim para o que é seu, não para o que é dos outros.",
    ],
    orientacaoSemana: [
      "Escreva num papel a primeira coisa a fazer e comece por ela antes do meio-dia.",
      "Evite pedir opinião demais — desta vez, decida primeiro e comunique depois.",
      "Reserve um bloco só seu na agenda para tocar o projeto que só depende de você.",
    ],
    pontosFortes: [
      "Coragem para começar",
      "Independência e autonomia",
      "Foco em objetivos claros",
      "Iniciativa que inspira os outros",
      "Capacidade de decidir rápido",
      "Originalidade nas ideias",
      "Autoconfiança que abre portas",
    ],
    pontosFracos: [
      "Impaciência com quem tem outro ritmo",
      "Tendência a agir sozinha demais",
      "Teimosia disfarçada de determinação",
      "Dificuldade de esperar o tempo dos outros",
      "Orgulho que atrapalha pedir ajuda",
      "Explosões quando é contrariada",
    ],
    aMelhorar: [
      "Escutar antes de decidir",
      "Delegar sem controlar cada passo",
      "Aceitar ajuda sem se sentir menor",
      "Reconhecer o mérito de quem caminha ao seu lado",
      "Descansar antes do próximo começo",
      "Trocar teimosia por firmeza consciente",
    ],
  },
  2: {
    essenciaNome: [
      "Sua alma é ponte: você foi feita para unir pessoas, mediar conflitos e trazer harmonia onde há dissonância. Sensibilidade é seu superpoder.",
      "Você é o número da parceria — o que faz em dupla rende muito mais do que o que insiste em fazer sozinha.",
      "Sua marca é a escuta fina: percebe o que ninguém disse e traduz o que ficou entre as palavras.",
      "Carrega a vibração da paz — sua presença acalma ambientes só de chegar.",
    ],
    essenciaSemana: [
      "Semana de parcerias — busque diálogo em vez de imposição.",
      "Vibração de equilíbrio: escute duas vezes antes de falar uma.",
      "Energia de cooperação — o que for feito a dois rende mais do que sozinho.",
      "Dias de ajuste fino: pequenas correções mudam a rota inteira.",
    ],
    orientacaoSemana: [
      "Antes de responder a uma provocação, respire três vezes.",
      "Convide alguém para pensar junto uma decisão que está te travando.",
      "Diga um 'não' pequeno esta semana só para praticar limites.",
    ],
    pontosFortes: [
      "Diplomacia natural",
      "Empatia genuína",
      "Paciência com processos",
      "Talento para reconciliar pessoas",
      "Escuta profunda",
      "Delicadeza que abre corações",
      "Bom senso em conflitos",
    ],
    pontosFracos: [
      "Dificuldade de impor limites",
      "Tendência a se anular pelo outro",
      "Insegurança em decidir sozinha",
      "Absorver emoções alheias como se fossem suas",
      "Adiar decisões para agradar",
      "Medo de desagradar quem ama",
    ],
    aMelhorar: [
      "Aprender a dizer não sem culpa",
      "Reconhecer o próprio valor sem depender de aprovação",
      "Confiar na própria opinião",
      "Colocar-se antes do bem-estar dos outros de vez em quando",
      "Sustentar decisões mesmo sob pressão",
      "Diferenciar cuidar de carregar",
    ],
  },
  3: {
    essenciaNome: [
      "Você carrega o dom da expressão: comunicação, arte e alegria fluem por você. Sua alma vem para colorir o mundo com criatividade e leveza.",
      "Sua energia é solar — onde você entra, o clima melhora sem que você tente.",
      "Você é o número da criatividade: novidade, ideia e conexão são o seu chão.",
      "Traz a marca da palavra viva: sabe encantar, ensinar e curar com o que diz.",
    ],
    essenciaSemana: [
      "Semana de expressar-se: escreva, fale, mostre o seu trabalho.",
      "Vibração criativa — pense fora do óbvio e brinque com as ideias.",
      "Energia social — encontros e conversas trazem oportunidades.",
      "Dias de leveza estratégica: rir também é forma de resolver.",
    ],
    orientacaoSemana: [
      "Poste, publique ou mostre algo que estava guardado numa gaveta.",
      "Marque um encontro sem pauta só para trocar ideia.",
      "Se pegar-se procrastinando, escreva por 10 minutos sem parar e depois avalie.",
    ],
    pontosFortes: [
      "Comunicação envolvente",
      "Criatividade fértil",
      "Otimismo contagiante",
      "Facilidade para se conectar com todo tipo de pessoa",
      "Sensibilidade artística",
      "Bom humor mesmo em dias difíceis",
      "Talento para reinventar o comum",
    ],
    pontosFracos: [
      "Dispersão em muitos projetos",
      "Superficialidade quando o assunto exige profundidade",
      "Fuga do desconforto pelo humor",
      "Dificuldade de manter foco por muito tempo",
      "Necessidade excessiva de aprovação",
      "Impaciência com temas pesados",
    ],
    aMelhorar: [
      "Terminar o que começa",
      "Aprofundar em vez de multiplicar",
      "Aceitar dias sem brilho como parte do processo",
      "Encarar conversas difíceis sem desviar com piada",
      "Escolher poucos projetos e ir até o fim",
      "Guardar energia para quem realmente importa",
    ],
  },
  4: {
    essenciaNome: [
      "Sua essência é construtora: você veio para dar forma sólida ao que outros só sonham. Disciplina, método e responsabilidade são seus alicerces.",
      "Você é o número da base — pessoas se apoiam em você porque sentem chão firme.",
      "Sua marca é a confiabilidade: quando promete, cumpre; quando cuida, cuida bem.",
      "Traz a vibração da estrutura: transforma ideia em rotina, sonho em plano.",
    ],
    essenciaSemana: [
      "Semana de organização — ponha ordem no que estava bagunçado.",
      "Vibração de trabalho firme: método bate inspiração.",
      "Energia de estrutura — reveja rotina, finanças e prazos.",
      "Dias de construção paciente: um tijolo por dia já é obra.",
    ],
    orientacaoSemana: [
      "Faça uma lista das 3 coisas que se resolvidas destravam a semana inteira.",
      "Reserve 20 minutos para olhar a planilha financeira que vem sendo evitada.",
      "Escolha uma pausa não-produtiva no dia (chá, caminhada, música) e cumpra como tarefa.",
    ],
    pontosFortes: [
      "Disciplina e persistência",
      "Praticidade nas soluções",
      "Lealdade nos vínculos",
      "Capacidade de sustentar projetos longos",
      "Senso de responsabilidade",
      "Firmeza diante do caos",
      "Confiabilidade que gera segurança nos outros",
    ],
    pontosFracos: [
      "Rigidez com mudanças",
      "Excesso de controle",
      "Dificuldade de descansar",
      "Teimosia em soltar planos que já não servem",
      "Pouca tolerância com espontaneidade alheia",
      "Peso emocional das próprias cobranças",
    ],
    aMelhorar: [
      "Flexibilizar quando a vida pede",
      "Permitir-se pausa sem culpa",
      "Confiar mais no fluxo e menos na planilha",
      "Aceitar que nem tudo precisa dar certo do jeito planejado",
      "Delegar sem revisar cada detalhe",
      "Reservar tempo para o que não tem utilidade nenhuma",
    ],
  },
  5: {
    essenciaNome: [
      "Você é alma de liberdade: veio para experimentar, viajar, mudar e transformar. Nasceu com asas — usar gaiola não é o seu caminho.",
      "Sua energia é de movimento — parar demais te adoece, movimento te cura.",
      "Você é o número da experiência: aprende no corpo, no chão, no vivido.",
      "Traz a marca do trânsito: entre países, ideias, versões de si mesma, você não repete a mesma pessoa.",
    ],
    essenciaSemana: [
      "Semana de movimento — mude a rota, aceite convites, saia da rotina.",
      "Vibração de novidade: uma janela nova se abre, esteja atenta.",
      "Energia expansiva — o desconhecido tem mais a te ensinar agora.",
      "Dias de reinvenção: uma pequena mudança no visual, na casa ou na agenda destrava por dentro.",
    ],
    orientacaoSemana: [
      "Faça um caminho diferente do usual pelo menos uma vez esta semana.",
      "Aceite um convite que normalmente recusaria por preguiça.",
      "Antes de mudar tudo, pergunte-se: 'estou expandindo ou estou fugindo?'",
    ],
    pontosFortes: [
      "Adaptabilidade rápida",
      "Curiosidade viva",
      "Coragem para o novo",
      "Facilidade com pessoas diferentes",
      "Versatilidade em vários papéis",
      "Instinto para oportunidades",
      "Capacidade de recomeçar quantas vezes for preciso",
    ],
    pontosFracos: [
      "Inconstância nos compromissos",
      "Impulsividade nas decisões",
      "Fuga quando aperta",
      "Aversão a rotina saudável",
      "Dificuldade de aprofundar vínculos",
      "Excessos (comida, festa, gastos) como escape",
    ],
    aMelhorar: [
      "Ficar tempo suficiente para colher o que plantou",
      "Diferenciar liberdade de fuga",
      "Assumir consequências das próprias escolhas",
      "Aceitar uma rotina mínima que sustente sua liberdade",
      "Terminar antes de começar outra coisa",
      "Enraizar em algo (pessoa, lugar, prática) para não se perder",
    ],
  },
  6: {
    essenciaNome: [
      "Sua alma tem vocação de cuidar: família, lar, comunidade — onde há vínculo, você floresce. Amor responsável é sua marca.",
      "Você é o número do coração — sente muito, ama forte, se compromete a fundo.",
      "Sua energia é de acolhimento: pessoas encostam em você porque sentem casa.",
      "Traz a vibração da beleza afetiva: sabe fazer bonito o gesto simples do dia.",
    ],
    essenciaSemana: [
      "Semana de cuidar dos seus — ligue, visite, esteja presente.",
      "Vibração afetiva: uma reconciliação ou reencontro pede espaço.",
      "Energia de lar — arrumar a casa arruma também a alma.",
      "Dias de vínculo: alguém precisa de você e vai se lembrar disso por muito tempo.",
    ],
    orientacaoSemana: [
      "Mande uma mensagem para alguém que você anda deixando de lado.",
      "Reserve uma noite só para cuidar da sua casa como se fosse templo.",
      "Antes de resolver o problema dos outros, pergunte se está pedindo ajuda ou desabafo.",
    ],
    pontosFortes: [
      "Amor generoso",
      "Senso de responsabilidade afetiva",
      "Beleza natural nos gestos",
      "Capacidade de criar lares onde chega",
      "Presença que acalma quem sofre",
      "Comprometimento com quem ama",
      "Sensibilidade estética",
    ],
    pontosFracos: [
      "Assumir problemas alheios como seus",
      "Cobrança exagerada consigo",
      "Sacrifício disfarçado de amor",
      "Ciúme e possessividade sutis",
      "Culpa quando prioriza a si",
      "Dificuldade de aceitar que os outros escolham diferente",
    ],
    aMelhorar: [
      "Cuidar de si com a mesma atenção que cuida dos outros",
      "Soltar o controle emocional sobre quem ama",
      "Aprender a receber, não só dar",
      "Diferenciar amar de resolver a vida do outro",
      "Descansar sem se sentir egoísta",
      "Aceitar ajuda sem devolver logo em seguida",
    ],
  },
  7: {
    essenciaNome: [
      "Você é alma de mistério: veio para estudar, investigar, meditar e conhecer as camadas invisíveis da vida. Silêncio é seu templo.",
      "Sua energia é reflexiva — você precisa de tempo sozinha do mesmo jeito que outros precisam de comida.",
      "Você é o número da investigação: nada te satisfaz até você entender por baixo.",
      "Traz a marca do místico: sonhos, sinais, sincronicidades falam com você o tempo todo.",
    ],
    essenciaSemana: [
      "Semana de introspecção — reserve tempo a sós, sem culpa.",
      "Vibração de estudo e revelação: um livro, um sonho, uma verdade chegam.",
      "Energia espiritual — medite, escreva, escute sinais sutis.",
      "Dias de recolhimento sábio: sair menos vai render mais.",
    ],
    orientacaoSemana: [
      "Reserve uma hora sem celular para ficar só com você mesma.",
      "Anote os sonhos assim que acordar por 3 dias seguidos.",
      "Se sentir que precisa cancelar um compromisso para respirar, cancele sem justificar demais.",
    ],
    pontosFortes: [
      "Intuição afiada",
      "Capacidade analítica profunda",
      "Sabedoria interior",
      "Bom conselheira em silêncio",
      "Percepção espiritual apurada",
      "Discernimento além das aparências",
      "Autonomia intelectual",
    ],
    pontosFracos: [
      "Isolamento excessivo",
      "Frieza com quem sente muito",
      "Perfeccionismo que trava a ação",
      "Desconfiança que afasta pessoas boas",
      "Mente que não desliga",
      "Julgamento silencioso dos outros",
    ],
    aMelhorar: [
      "Compartilhar o que descobre",
      "Aceitar imperfeição no que é humano",
      "Equilibrar mente e coração",
      "Sair da caverna antes de virar hábito",
      "Confiar em quem já provou merecer",
      "Descer da análise e subir no afeto",
    ],
  },
  8: {
    essenciaNome: [
      "Sua alma nasceu para o poder consciente: dinheiro, autoridade, materialização de projetos grandes. Você veio para prosperar e ensinar prosperidade.",
      "Você é o número da realização material — projeto grande te cabe.",
      "Sua energia é de estrutura executiva: sabe organizar recursos e pessoas para chegar longe.",
      "Traz a marca do resultado: onde você aplica intenção séria, o mundo material responde.",
    ],
    essenciaSemana: [
      "Semana de foco material — dinheiro, carreira, decisões estratégicas.",
      "Vibração de conquista: assuma responsabilidade pelo próximo passo grande.",
      "Energia de resultado — cobre o que é seu por direito, sem medo.",
      "Dias de firmeza executiva: hora de encerrar o que não dá lucro (emocional ou financeiro).",
    ],
    orientacaoSemana: [
      "Marque uma conversa que vem sendo adiada sobre dinheiro ou contrato.",
      "Revise o preço do seu trabalho — provavelmente está abaixo do valor.",
      "Guarde uma noite da semana para descansar de verdade, sem produzir nada.",
    ],
    pontosFortes: [
      "Visão de longo prazo",
      "Capacidade de liderança",
      "Ambição saudável",
      "Talento para gestão de recursos",
      "Firmeza em negociações",
      "Foco em resultado",
      "Autoridade natural",
    ],
    pontosFracos: [
      "Obsessão por resultado",
      "Materialismo em excesso",
      "Dureza com quem não acompanha",
      "Confundir valor pessoal com conta bancária",
      "Trabalhar até adoecer",
      "Autoritarismo disfarçado de eficiência",
    ],
    aMelhorar: [
      "Lembrar que ter não é ser",
      "Cuidar do afeto tanto quanto do dinheiro",
      "Descansar antes do colapso",
      "Reconhecer o esforço de quem trabalha com você",
      "Aceitar que nem tudo se mede em métrica",
      "Ganhar dinheiro sem perder gente pelo caminho",
    ],
  },
  9: {
    essenciaNome: [
      "Você é alma antiga: veio para servir, curar e encerrar ciclos. Sua vida tem sabor de missão — ajudar os outros faz parte do seu propósito.",
      "Sua energia é de finalização — o que já se cumpriu, você ajuda a soltar com dignidade.",
      "Você é o número da compaixão vivida: seu peito abraça muito e sente por muitos.",
      "Traz a marca do humanitário: só se sente inteira quando o que faz beneficia alguém além de você.",
    ],
    essenciaSemana: [
      "Semana de encerramentos — solte o que já se cumpriu com gratidão.",
      "Vibração de entrega: sirva, doe, esteja disponível para quem chega.",
      "Energia compassiva — perdoe (inclusive você) antes que o corpo cobre.",
      "Dias de despedida bonita: alguém ou algo pede um até logo maduro.",
    ],
    orientacaoSemana: [
      "Escreva no papel uma coisa que precisa acabar e queime, rasgue ou apague o papel.",
      "Doe algo que ainda serve mas não é mais seu.",
      "Antes de socorrer alguém, pergunte se você mesma já foi socorrida hoje.",
    ],
    pontosFortes: [
      "Compaixão profunda",
      "Generosidade natural",
      "Sabedoria emocional",
      "Capacidade de perdoar de verdade",
      "Visão ampla das situações",
      "Presença curadora",
      "Coragem de encerrar ciclos",
    ],
    pontosFracos: [
      "Melancolia recorrente",
      "Sacrificar-se em excesso",
      "Dificuldade de encerrar de vez",
      "Guardar mágoas em silêncio",
      "Absorver dor coletiva sem filtro",
      "Adiar despedidas necessárias",
    ],
    aMelhorar: [
      "Colocar-se na lista de quem você cuida",
      "Aceitar que nem todos podem ser salvos",
      "Fechar ciclos com clareza, não com culpa",
      "Chorar quando precisar, sem se explicar",
      "Escolher para quem doar tempo e afeto",
      "Sustentar alegria também, não só profundidade",
    ],
  },
};

/** Sorteia N itens únicos de uma lista usando um rng determinístico. */
function sampleN<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  const take = Math.min(n, copy.length);
  for (let i = 0; i < take; i++) {
    const idx = rng() % copy.length;
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function gerarNumerologiaDetalhe(
  nome: string,
  numeroSemana: number,
  numeroNome: number
): NumerologiaDetalhe {
  const perfilN = perfilNumero[reduzirNumeroParaPerfil(numeroNome)] ?? perfilNumero[1];
  const perfilS = perfilNumero[numeroSemana] ?? perfilNumero[1];
  const seed = hashString(chaveCanonical(nome)) * 29 + currentWeekNumber() * 613;
  const rng = mulberry32(seed);
  const essSemana = pick(rng, perfilS.essenciaSemana);
  const orientS = pick(rng, perfilS.orientacaoSemana);
  const essNome = pick(rng, perfilN.essenciaNome);
  const pontes = [
    `Sua essência ${numeroNome} atravessa isso assim:`,
    `E o seu ${numeroNome} de nascença responde a essa vibração:`,
    `Isso encontra o ${numeroNome} do seu nome, que`,
    `A sua base ${numeroNome} completa o movimento:`,
  ];
  const ponte = pick(rng, pontes);
  const mensagemUnificada = `Semana ${numeroSemana} com nome ${numeroNome}. ${essSemana} ${ponte} ${essNome} ${orientS}`;
  return {
    numeroSemana,
    numeroNome,
    mensagemUnificada,

    pontosFortes: sampleN(rng, perfilN.pontosFortes, 3),
    pontosFracos: sampleN(rng, perfilN.pontosFracos, 3),
    aMelhorar: sampleN(rng, perfilN.aMelhorar, 3),
  };
}




export function gerarLeitura(nome: string, options: GerarLeituraOptions = {}): Leitura {
  // Define a semana de referência conforme a data escolhida — assim trocar a
  // data realmente muda o orixá, as cartas e todas as mensagens da leitura.
  const previousOverride = weekOverride;
  weekOverride = options.semanaInicio ? weekFromDate(options.semanaInicio) : null;
  try {
    const numerologia = calcularNumerologia(nome);
    const foco = options.focoOverride && focos.includes(options.focoOverride)
      ? options.focoOverride
      : pickForPerson(focos, nome, 0);
    const orixa = options.orixaOverride && orixas.includes(options.orixaOverride)
      ? options.orixaOverride
      : pickForPerson(orixas, nome, 1);
    const cartaCigana = options.cartaCiganaOverride && cartasCiganas.includes(options.cartaCiganaOverride)
      ? options.cartaCiganaOverride
      : pickForPerson(cartasCiganas, nome, 2);
    const cartaTaro = options.cartaTaroOverride && tarot.includes(options.cartaTaroOverride)
      ? options.cartaTaroOverride
      : pickForPerson(tarot, nome, 3);
    const semana =
      options.semanaInicio && options.semanaFim
        ? formatarSemana(options.semanaInicio, options.semanaFim)
        : getSemanaDatas();
    const idAssociado = `CT-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const msgs = mensagensFoco[foco] || mensagensFoco.Espiritual;
    const msgFoco = pickForPerson(msgs, nome, 4);

    const msgSaudeFn = pickForPerson(mensagensSaudeBase, nome, 5);
    const mensagemSaude = msgSaudeFn(orixa, cartaTaro);

    const numCigana = numeroDaCartaCigana(cartaCigana);
    const baseDetalhe =
      detalhesCiganas[numCigana] ?? {
        naipe: "—",
        elemento: "—",
        reflexo: "uma mensagem dos guias para esta semana.",
      };
    const detalheCartaCigana: DetalheCarta = {
      ...baseDetalhe,
      direcionamentoNaipe: gerarDirecionamentoNaipe(cartaCigana, baseDetalhe.naipe, nome),
      direcionamentoLenormand: gerarDirecionamentoLenormand(cartaCigana, baseDetalhe.elemento, nome),
    };

    const sugestoes = gerarSugestoes(nome, foco, cartaCigana + "|" + cartaTaro);

    const exercicioMental = gerarExercicioMental(nome, foco, cartaCigana + "|" + cartaTaro);

    const mensagemFinal = gerarMensagemFinalDinamica(nome);

    // Bloco de baixo não repete a carta: mostra como ela vibra junto com o Tarô.
    const significadoCartaCigana = gerarVibracaoCombinada(cartaCigana, cartaTaro, nome);

    const significadoTaro = variarTexto(
      temasTaro[cartaTaro] ?? "transformação interior",
      nome, 102, "taro"
    );
    const significadoOrixa = variarTexto(
      `${orixa} traz ${temasOrixa[orixa] ?? "proteção espiritual"}.`,
      nome, 103, "orixa"
    );
    const significadoNumerologia = variarTexto(
      `Número ${numerologia}: ${temasNumero[numerologia] ?? "evoluir no seu ritmo"}.`,
      nome, 104, "numero"
    );
    const significadoNaipe = variarTexto(
      naipeSignificados[detalheCartaCigana.naipe] ?? "uma carta do baralho comum que reforça a leitura desta semana.",
      nome, 105, "naipe"
    );
    const elementoBase = elementoSignificadosVariantes[detalheCartaCigana.elemento];
    const significadoElemento = elementoBase
      ? elementoBase[
          mulberry32(hashString(chaveCanonical(nome)) * 19 + currentWeekNumber() * 311)() %
            elementoBase.length
        ]
      : "um elemento da natureza que colore sua semana de forma única.";

    const mensagemEspiritual = gerarMensagemEspiritual(nome);
    const orixaPerfil = montarOrixaPerfil(orixa, nome, foco);
    const numeroNome = calcularNumerologiaNome(nome);
    const numerologiaDetalhe = gerarNumerologiaDetalhe(nome, numerologia, numeroNome);

    // Nesta versão rápida, não fazemos substituições automáticas de gênero para evitar trocas gramaticais erradas.
    const g = <T,>(v: T): T => v;

    return {
      nome,
      idAssociado,
      numerologia,
      orixa,
      cartaCigana,
      cartaTaro,
      foco,
      semana,
      mensagemFoco: g(msgFoco),
      mensagemEspiritual: g(mensagemEspiritual),
      mensagemSaude: g(mensagemSaude),
      mensagemFinal: g(mensagemFinal),
      significadoCartaCigana: g(significadoCartaCigana),
      significadoTaro: g(significadoTaro),
      significadoOrixa: g(significadoOrixa),
      significadoNumerologia: g(significadoNumerologia),
      significadoNaipe: g(significadoNaipe),
      significadoElemento: g(significadoElemento),
      detalheCartaCigana: { ...detalheCartaCigana, reflexo: g(detalheCartaCigana.reflexo), direcionamentoNaipe: g(detalheCartaCigana.direcionamentoNaipe), direcionamentoLenormand: g(detalheCartaCigana.direcionamentoLenormand) },
      sugestoes: g(sugestoes),
      exercicioMental: g(exercicioMental),
      orixaPerfil: { ...orixaPerfil, descricao: g(orixaPerfil.descricao), ondeAjuda: g(orixaPerfil.ondeAjuda), saudação: g(orixaPerfil.saudação) },
      numerologiaDetalhe: g(numerologiaDetalhe),
    };
  } finally {
    weekOverride = previousOverride;
  }
}

/* ============================================================================
 * Exercícios semanais de saúde mental — variam por pessoa e por semana,
 * focados em desacelerar, aliviar ansiedade, dissolver medos e reorganizar o
 * pensamento. Cada exercício tem um título e passos práticos.
 * ========================================================================== */
const exerciciosMentais: { titulo: string; passos: string[] }[] = [
  {
    titulo: "Respiração 4-7-8 para desacelerar a mente",
    passos: [
      "Sente-se com a coluna ereta e os pés no chão.",
      "Inspire pelo nariz contando até 4.",
      "Segure o ar contando até 7.",
      "Expire lentamente pela boca contando até 8.",
      "Repita o ciclo 4 vezes, uma vez pela manhã e outra antes de dormir.",
    ],
  },
  {
    titulo: "Ancoragem 5-4-3-2-1 para crises de ansiedade",
    passos: [
      "Olhe ao redor e nomeie 5 coisas que você está vendo.",
      "Identifique 4 coisas que você pode tocar.",
      "Escute 3 sons diferentes ao seu redor.",
      "Reconheça 2 cheiros do ambiente.",
      "Por fim, nomeie 1 sabor presente na sua boca.",
    ],
  },
  {
    titulo: "Diário do medo — esvaziar para enxergar",
    passos: [
      "Pegue uma folha e escreva todos os medos que sentir essa semana.",
      "Ao lado de cada medo, escreva: 'o que de pior pode acontecer?'.",
      "Na outra coluna, escreva: 'o que eu posso fazer hoje?'.",
      "Releia ao fim da semana e perceba o que era real e o que era projeção.",
      "Queime ou rasgue o papel como gesto de liberação.",
    ],
  },
  {
    titulo: "Pausa dos 3 minutos consciente",
    passos: [
      "Pare o que estiver fazendo e feche os olhos por 1 minuto sentindo o corpo.",
      "Por mais 1 minuto, foque apenas na respiração entrando e saindo.",
      "No último minuto, abra a consciência para os sons, o ambiente e a sua presença ali.",
      "Repita 3 vezes ao dia: ao acordar, no meio do dia e antes de dormir.",
    ],
  },
  {
    titulo: "Banho de descarga mental (do pescoço para baixo)",
    passos: [
      "Antes do banho, escreva em um papel tudo o que está pesando na cabeça.",
      "No banho, importante: molhe apenas do pescoço para baixo — nunca da cabeça aos pés.",
      "Imagine a água lavando os pensamentos enquanto cai sobre os ombros e as costas.",
      "Repita mentalmente: 'o que não é meu, sai; o que é meu, eu cuido com calma'.",
      "Ao sair, descarte o papel (rasgue ou jogue fora).",
    ],
  },
  {
    titulo: "Caminhada lenta de presença",
    passos: [
      "Escolha um trajeto curto (10 a 15 minutos), de preferência em contato com a natureza.",
      "Caminhe na metade do seu ritmo habitual, sem celular.",
      "A cada passo, observe o pé tocando o chão e a respiração.",
      "Se a mente desviar, traga gentilmente de volta para o caminhar.",
      "Faça pelo menos 3 vezes na semana.",
    ],
  },
  {
    titulo: "Lista do alívio — soltar a urgência",
    passos: [
      "Escreva tudo que você 'precisa' fazer essa semana sem filtrar.",
      "Marque com um coração o que é realmente essencial.",
      "Marque com um X o que você está fazendo por culpa ou cobrança.",
      "Adie ou cancele pelo menos 1 item da coluna X.",
      "Observe como o corpo reage ao gesto de soltar.",
    ],
  },
  {
    titulo: "Visualização do lugar seguro",
    passos: [
      "Sente-se confortavelmente e feche os olhos.",
      "Imagine um lugar onde você se sente totalmente em paz (real ou imaginário).",
      "Note as cores, os sons, os cheiros e a temperatura desse lugar.",
      "Fique ali, em silêncio, por 5 minutos respirando devagar.",
      "Use sempre que sentir o peito apertar ou a mente acelerar.",
    ],
  },
  {
    titulo: "Carta para a mente ansiosa",
    passos: [
      "Escreva uma carta para a parte sua que está com medo, como se fosse a uma criança.",
      "Diga a ela o que ela precisa ouvir: 'estou aqui, você está segura, vamos juntas'.",
      "Leia a carta em voz alta para si mesma.",
      "Guarde em um lugar visível para reler quando a ansiedade voltar.",
    ],
  },
  {
    titulo: "Detox de notícias e telas",
    passos: [
      "Escolha um período do dia (ex.: 2h antes de dormir) para não consultar notícias nem redes sociais.",
      "Substitua o tempo por algo que recarregue: livro, banho, música, conversa.",
      "Observe a qualidade do sono e do humor após 4 dias seguidos.",
      "Se possível, mantenha o ritual por todos os 7 dias da semana.",
    ],
  },
  {
    titulo: "Body scan para soltar tensões",
    passos: [
      "Deite-se de barriga para cima, braços ao lado do corpo.",
      "Comece pelos pés e vá percorrendo cada parte do corpo até a cabeça.",
      "Em cada região, observe sem julgar e respire 'soltando' a tensão.",
      "Dedique cerca de 10 minutos ao percurso completo.",
      "Pratique antes de dormir para acalmar o sistema nervoso.",
    ],
  },
  {
    titulo: "Ritual da gratidão escrita",
    passos: [
      "Antes de dormir, escreva 3 coisas pelas quais é grata hoje.",
      "Inclua sempre 1 coisa simples (um café, um abraço, uma luz).",
      "Releia o que escreveu no dia anterior antes de começar.",
      "Faça por 7 dias seguidos e observe a mudança no estado emocional.",
    ],
  },
  {
    titulo: "Reescrevendo o pensamento que assusta",
    passos: [
      "Identifique um pensamento recorrente que esteja te paralisando.",
      "Escreva: 'É verdade? Sempre? Em todos os casos?'.",
      "Reescreva o mesmo pensamento de uma forma mais gentil e realista.",
      "Repita a versão nova em voz alta toda vez que a antiga aparecer.",
    ],
  },
  {
    titulo: "Silêncio de 20 minutos por dia",
    passos: [
      "Reserve 20 minutos sem som algum: nem música, nem TV, nem fala.",
      "Pode ser tomando chá, olhando pela janela ou apenas sentada.",
      "Permita que pensamentos venham e vão sem se prender a nenhum.",
      "Se o silêncio incomodar, é sinal de que você precisa ainda mais dele.",
    ],
  },
];

function gerarExercicioMental(
  nome: string,
  foco: string,
  contexto = ""
): { titulo: string; passos: string[] } {
  // Combina pessoa + semana + foco + cartas para escolher um exercício
  // diferente a cada semana, estável durante a mesma semana para a mesma pessoa.
  const seed =
    hashString(chaveCanonical(nome) + "|" + foco + "|" + contexto) * 23 +
    currentWeekNumber() * 911;
  const rng = mulberry32(seed);
  return exerciciosMentais[rng() % exerciciosMentais.length];
}