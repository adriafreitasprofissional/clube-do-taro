import { jsPDF } from "jspdf";
import type { Leitura } from "./direcionamento-engine";

/* ============================================================================
 * Cores dos Orixás (hex real, espelhando LeituraResult.tsx)
 * ========================================================================== */
const CorHex: Record<string, string> = {
  "Branco": "#FFFFFF",
  "Preto": "#111111",
  "Vermelho": "#C81E1E",
  "Vermelho-vinho": "#722F37",
  "Vermelho-coral": "#FF4040",
  "Coral": "#FF6B5B",
  "Amarelo": "#F5C518",
  "Amarelo-ouro": "#D4AF37",
  "Amarelo-claro": "#FFF5B7",
  "Dourado": "#D4AF37",
  "Laranja": "#F28C28",
  "Verde": "#2E8B57",
  "Verde-claro": "#98D8A1",
  "Verde-escuro": "#0F5132",
  "Azul": "#1E5AA8",
  "Azul-claro": "#A6D0F5",
  "Azul-escuro": "#0B2A5B",
  "Azul-turquesa": "#40C4C4",
  "Prata": "#C0C0C0",
  "Marrom": "#6E3B1F",
  "Rosa": "#F4A6C0",
  "Lilás": "#C8A2C8",
  "Roxo": "#6A0DAD",
  "Todas as cores do arco-íris": "#E040FB",
};
function hex2rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function corRgb(nome: string): [number, number, number] {
  return hex2rgb(CorHex[nome] || "#B0B0B0");
}

/* ============================================================================
 * Theme
 * ========================================================================== */
type RGB = [number, number, number];
type Theme = {
  isDark: boolean;
  bgBase: RGB;
  bgAccent: RGB;
  gold: RGB;
  goldDeep: RGB;
  goldLight: RGB;
  titleText: RGB;
  bodyText: RGB;
  mutedText: RGB;
  cardBg: RGB;
  cardBorder: RGB;
  divider: RGB;
  emerald: RGB;
  amethyst: RGB;
  rose: RGB;
  wine: RGB;
  neutralCard: RGB;
  strongCard: RGB;
};

const MysticTheme: Theme = {
  isDark: true,
  bgBase: [15, 16, 32],
  bgAccent: [24, 22, 58],
  gold: [212, 175, 55],
  goldDeep: [176, 141, 45],
  goldLight: [240, 215, 140],
  titleText: [240, 215, 140],
  bodyText: [232, 226, 210],
  mutedText: [178, 172, 200],
  cardBg: [26, 24, 52],
  cardBorder: [110, 90, 60],
  divider: [90, 78, 130],
  emerald: [72, 187, 120],
  amethyst: [167, 139, 250],
  rose: [244, 114, 182],
  wine: [220, 90, 110],
  neutralCard: [55, 55, 82],
  strongCard: [212, 175, 55],
};

const PrintTheme: Theme = {
  isDark: false,
  bgBase: [255, 255, 255],
  bgAccent: [248, 245, 238],
  gold: [176, 141, 45],
  goldDeep: [130, 100, 30],
  goldLight: [214, 188, 130],
  titleText: [40, 30, 60],
  bodyText: [30, 30, 40],
  mutedText: [110, 110, 130],
  cardBg: [255, 255, 255],
  cardBorder: [200, 190, 170],
  divider: [200, 190, 170],
  emerald: [46, 139, 87],
  amethyst: [122, 74, 168],
  rose: [190, 90, 130],
  wine: [140, 45, 65],
  neutralCard: [140, 140, 155],
  strongCard: [176, 141, 45],
};

/* ============================================================================
 * Helpers
 * ========================================================================== */
const setFill = (doc: jsPDF, c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] * (1 - t) + b[0] * t),
  Math.round(a[1] * (1 - t) + b[1] * t),
  Math.round(a[2] * (1 - t) + b[2] * t),
];

function sanitizeText(s: string): string {
  if (!s) return "";
  return s
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{1F000}-\u{1F2FF}]/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/[\u2013\u2014]/g, "—")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function measureText(doc: jsPDF, text: string, width: number, fontSize: number, lineHeightRatio = 1.45) {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text || " ", width);
  const lineH = fontSize * lineHeightRatio * 0.3528;
  return { lines, h: lines.length * lineH, lineH };
}

/* ============================================================================
 * Background + Border
 * ========================================================================== */
function drawBackground(doc: jsPDF, w: number, h: number, t: Theme) {
  setFill(doc, t.bgBase);
  doc.rect(0, 0, w, h, "F");

  if (t.isDark) {
    // gradiente radial simulado (mais claro no centro)
    for (let i = 30; i > 0; i--) {
      const alpha = i / 30;
      const c = mix(t.bgBase, t.bgAccent, alpha * 0.6);
      setFill(doc, c);
      doc.circle(w / 2, h / 2, (i / 30) * Math.max(w, h) * 0.55, "F");
    }
    setFill(doc, t.bgBase);
    // repõe borda (deixa vinheta escura)
    doc.rect(0, 0, w, 6, "F");
    doc.rect(0, h - 6, w, 6, "F");

    // partículas douradas
    let seed = 4242;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    setFill(doc, t.gold);
    for (let i = 0; i < 220; i++) {
      doc.circle(rnd() * w, rnd() * h, rnd() * 0.35 + 0.08, "F");
    }
    // estrelas 4-pontas
    setDraw(doc, t.goldLight);
    doc.setLineWidth(0.2);
    for (let i = 0; i < 35; i++) {
      const x = rnd() * w, y = rnd() * h, s = rnd() * 1.1 + 0.5;
      doc.line(x - s, y, x + s, y);
      doc.line(x, y - s, x, y + s);
    }
  } else {
    // print: leve textura creme
    for (let i = 0; i < 30; i++) {
      const c = mix(t.bgBase, t.bgAccent, i / 60);
      setFill(doc, c);
      doc.rect(0, (h / 30) * i, w, h / 30 + 0.5, "F");
    }
  }
}

function drawOrnamentalBorder(doc: jsPDF, w: number, h: number, t: Theme) {
  const m = 8;
  setDraw(doc, t.gold);
  doc.setLineWidth(0.8);
  doc.rect(m, m, w - m * 2, h - m * 2, "S");
  doc.setLineWidth(0.3);
  doc.rect(m + 2, m + 2, w - (m + 2) * 2, h - (m + 2) * 2, "S");
  setFill(doc, t.gold);
  for (const [x, y] of [[m, m], [w - m, m], [m, h - m], [w - m, h - m]] as [number, number][]) {
    doc.circle(x, y, 1.6, "F");
    setFill(doc, t.bgBase);
    doc.circle(x, y, 0.8, "F");
    setFill(doc, t.gold);
    doc.circle(x, y, 0.3, "F");
  }
}

/* ============================================================================
 * Cards
 * ========================================================================== */
function drawCard(doc: jsPDF, x: number, y: number, w: number, h: number, t: Theme, opts: { glow?: boolean; fill?: RGB; border?: RGB } = {}) {
  const fill = opts.fill || t.cardBg;
  const border = opts.border || t.cardBorder;
  if (opts.glow) {
    setDraw(doc, t.goldLight);
    doc.setLineWidth(1.1);
    doc.roundedRect(x - 1, y - 1, w + 2, h + 2, 3.5, 3.5, "S");
  }
  setFill(doc, fill);
  setDraw(doc, border);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, w, h, 3, 3, "FD");
}

function drawDivider(doc: jsPDF, x1: number, x2: number, y: number, t: Theme, accent?: RGB) {
  const c = accent || t.divider;
  setDraw(doc, c);
  doc.setLineWidth(0.2);
  doc.line(x1 + 4, y, x2 - 4, y);
  setFill(doc, c);
  doc.circle((x1 + x2) / 2, y, 0.5, "F");
}

function drawGlyph(doc: jsPDF, cx: number, cy: number, accent: RGB, t: Theme) {
  setDraw(doc, accent);
  doc.setLineWidth(0.25);
  doc.circle(cx, cy, 2.2, "S");
  setFill(doc, accent);
  doc.triangle(cx - 1.5, cy, cx, cy - 1.5, cx + 1.5, cy, "F");
  doc.triangle(cx - 1.5, cy, cx, cy + 1.5, cx + 1.5, cy, "F");
  setFill(doc, t.bgBase);
  doc.circle(cx, cy, 0.3, "F");
}

/* ============================================================================
 * PDF principal (parametrizado por tema)
 * ========================================================================== */
function renderPdf(leitura: Leitura, theme: Theme, filenameSuffix: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const FOOTER = 14;
  const padding = 6;

  drawBackground(doc, W, H, theme);
  drawOrnamentalBorder(doc, W, H, theme);
  let y = 20;

  const newPage = () => {
    doc.addPage();
    drawBackground(doc, W, H, theme);
    drawOrnamentalBorder(doc, W, H, theme);
    y = 20;
  };
  const ensureSpace = (needed: number) => {
    if (y + needed > H - FOOTER) newPage();
  };

  /* ---------- Cabeçalho ---------- */
  setText(doc, theme.gold);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("Clube do Tarô — Ádria Freitas", W / 2, y, { align: "center" });
  y += 2;
  setDraw(doc, theme.gold);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 35, y + 3, W / 2 - 6, y + 3);
  doc.line(W / 2 + 6, y + 3, W / 2 + 35, y + 3);
  setFill(doc, theme.gold);
  doc.circle(W / 2, y + 3, 1, "F");
  y += 10;

  setText(doc, theme.titleText);
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text(sanitizeText(leitura.nome), W / 2, y, { align: "center" });
  y += 7;

  setText(doc, theme.mutedText);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text(`Semana: ${sanitizeText(leitura.semana)}`, W / 2, y, { align: "center" });
  setText(doc, theme.gold);
  doc.setFontSize(8);
  doc.text(`Associada  •  #${leitura.idAssociado}`, W / 2, y + 4, { align: "center" });
  y += 10;

  /* ---------- Indicadores ---------- */
  const indDefs: { label: string; value: string; accent: RGB }[] = [
    { label: "Numerologia", value: String(leitura.numerologia), accent: theme.gold },
    { label: "Energia", value: sanitizeText(leitura.orixa), accent: theme.wine },
    { label: "Carta Cigana", value: sanitizeText(leitura.cartaCigana), accent: theme.emerald },
    { label: "Taro", value: sanitizeText(leitura.cartaTaro), accent: theme.goldDeep },
    { label: "Foco", value: sanitizeText(leitura.foco), accent: theme.amethyst },
  ];
  const indCount = indDefs.length;
  const indW = (W - M * 2 - 5 * (indCount - 1)) / indCount;
  doc.setFont("helvetica", "bold");
  const built = indDefs.map((d) => {
    const v = measureText(doc, d.value, indW - 3, 8.6, 1.25);
    return { ...d, v, h: 4 + 5 + v.h + 3 };
  });
  const indH = Math.max(...built.map((b) => b.h));
  ensureSpace(indH + 6);
  built.forEach((b, i) => {
    const x = M + i * (indW + 5);
    drawCard(doc, x, y, indW, indH, theme);
    setFill(doc, b.accent);
    doc.rect(x, y, indW, 1.4, "F");
    setText(doc, theme.mutedText);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(b.label.toUpperCase(), x + indW / 2, y + 6, { align: "center" });
    setText(doc, theme.titleText);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    b.v.lines.forEach((line: string, j: number) => {
      doc.text(line, x + indW / 2, y + 11 + j * b.v.lineH, { align: "center" });
    });
  });
  y += indH + 6;

  /* ---------- drawSection ---------- */
  const drawSection = (s: { title: string; subtitle: string; text: string; accent: RGB }) => {
    const innerW = W - M * 2 - padding * 2;
    doc.setFont("times", "normal");
    const m = measureText(doc, s.text, innerW, 11, 1.45);
    const headerH = 18;
    let cursor = 0;
    let first = true;
    while (cursor < m.lines.length) {
      const availableH = H - FOOTER - y - headerH - padding;
      if (availableH < m.lineH * 3) { newPage(); continue; }
      const linesPerBlock = Math.min(m.lines.length - cursor, Math.floor(availableH / m.lineH));
      const chunk = m.lines.slice(cursor, cursor + linesPerBlock);
      const blockH = headerH + chunk.length * m.lineH + padding;
      drawCard(doc, M, y, W - M * 2, blockH, theme);
      setFill(doc, s.accent);
      doc.rect(M, y, 1.6, blockH, "F");
      drawGlyph(doc, M + padding + 3, y + 7.6, s.accent, theme);
      setText(doc, theme.titleText);
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.text(first ? s.title : `${s.title} (cont.)`, M + padding + 8, y + 8);
      if (s.subtitle) {
        setText(doc, theme.mutedText);
        doc.setFont("times", "italic");
        doc.setFontSize(9.5);
        doc.text(s.subtitle, M + padding + 8, y + 13.5);
      }
      drawDivider(doc, M + padding, W - M - padding, y + 16.5, theme, s.accent);
      setText(doc, theme.bodyText);
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      chunk.forEach((line: string, idx: number) => {
        doc.text(line, M + padding, y + 21 + idx * m.lineH);
      });
      y += blockH + 5;
      cursor += linesPerBlock;
      first = false;
      if (cursor < m.lines.length) newPage();
    }
  };

  /* ---------- Perfil do Orixá com bolinhas de cor ---------- */
  {
    const perfil = leitura.orixaPerfil;
    const innerW = W - M * 2 - padding * 2;

    doc.setFont("times", "normal");
    const desc = measureText(doc, sanitizeText(perfil.descricao), innerW, 11, 1.45);
    const ondeLabel = "Onde essa energia ajuda a sua vida:";
    const onde = measureText(doc, sanitizeText(perfil.ondeAjuda), innerW, 11, 1.45);
    const diaTxt = `Dia de pico: ${sanitizeText(perfil.diaSemana)}  •  Elemento: ${sanitizeText(perfil.elemento)}  •  Saudação: ${sanitizeText(perfil.saudação)}`;
    const dia = measureText(doc, diaTxt, innerW, 10.5, 1.4);

    const swatchH = 14; // altura reservada p/ label + bolinhas
    const headerH = 20;
    const blockH = headerH + desc.h + 4 + 5 + onde.h + 4 + swatchH + 4 + dia.h + padding;
    ensureSpace(blockH + 5);

    drawCard(doc, M, y, W - M * 2, blockH, theme);
    setFill(doc, theme.wine);
    doc.rect(M, y, 1.6, blockH, "F");
    drawGlyph(doc, M + padding + 3, y + 8, theme.wine, theme);
    setText(doc, theme.titleText);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(`${sanitizeText(leitura.orixa)} — energia espiritual da semana`, M + padding + 8, y + 8.5);
    setText(doc, theme.mutedText);
    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.text(sanitizeText(perfil.saudação), M + padding + 8, y + 14);
    drawDivider(doc, M + padding, W - M - padding, y + 17.5, theme, theme.wine);

    let yy = y + headerH + 2;
    setText(doc, theme.bodyText);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    desc.lines.forEach((line: string, i: number) => doc.text(line, M + padding, yy + i * desc.lineH));
    yy += desc.h + 5;

    setText(doc, theme.gold);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text(ondeLabel, M + padding, yy);
    yy += 5;
    setText(doc, theme.bodyText);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    onde.lines.forEach((line: string, i: number) => doc.text(line, M + padding, yy + i * onde.lineH));
    yy += onde.h + 4;

    // Bolinhas de cores
    setText(doc, theme.gold);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Cores para energizar a semana:", M + padding, yy);
    let cx = M + padding + 66;
    perfil.cores.forEach((nome) => {
      const rgb = corRgb(nome);
      setFill(doc, rgb);
      setDraw(doc, theme.gold);
      doc.setLineWidth(0.3);
      doc.circle(cx, yy - 1.4, 2.2, "FD");
      setText(doc, theme.bodyText);
      doc.setFont("times", "normal");
      doc.setFontSize(9.5);
      const label = sanitizeText(nome);
      doc.text(label, cx + 3.2, yy);
      cx += 3.2 + doc.getTextWidth(label) + 5;
      setText(doc, theme.gold);
      doc.setFont("times", "bold");
      doc.setFontSize(10);
    });
    yy += swatchH - 4;

    setText(doc, theme.mutedText);
    doc.setFont("times", "italic");
    doc.setFontSize(10.5);
    dia.lines.forEach((line: string, i: number) => doc.text(line, M + padding, yy + i * dia.lineH));

    y += blockH + 5;
  }

  /* ---------- Detalhe da Carta Cigana ---------- */
  const det = leitura.detalheCartaCigana;
  drawSection({
    title: sanitizeText(leitura.cartaCigana),
    subtitle: `Naipe: ${sanitizeText(det.naipe)}`,
    text: sanitizeText(det.reflexo),
    accent: theme.amethyst,
  });

  /* ---------- Direcionamento do Naipe ---------- */
  drawSection({
    title: "Direcionamento do Naipe",
    subtitle: sanitizeText(det.naipe),
    text: sanitizeText(det.direcionamentoNaipe),
    accent: theme.goldDeep,
  });

  /* ---------- Elemento (Lenormand) ---------- */
  {
    const neDefs: { title: string; subtitle: string; text: string; accent: RGB }[] = [
      {
        title: "Elemento Cartas Lenormand",
        subtitle: sanitizeText(det.elemento),
        text: sanitizeText(det.direcionamentoLenormand),
        accent: theme.goldDeep,
      },
    ];

    const neGap = 4;
    const neW = W - M * 2;

    doc.setFont("times", "normal");
    const neBuilt = neDefs.map((it) => {
      const titleM = measureText(doc, it.title, neW - 8, 10.5, 1.35);
      const subM = measureText(doc, it.subtitle, neW - 8, 9.5, 1.35);
      const m = measureText(doc, it.text, neW - 8, 10, 1.45);
      return { ...it, titleM, subM, m };
    });
    const neContentH = Math.max(...neBuilt.map((b) => b.titleM.h + 2 + b.subM.h + 3 + b.m.h));
    const neH = 10 + neContentH + 5;
    ensureSpace(neH + 5);
    neBuilt.forEach((it, i) => {
      const x = M + i * (neW + neGap);
      drawCard(doc, x, y, neW, neH, theme);
      setFill(doc, it.accent);
      doc.rect(x, y, neW, 1.4, "F");
      setText(doc, theme.titleText);
      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      it.titleM.lines.forEach((line: string, idx: number) => {
        doc.text(line, x + 5, y + 8 + idx * it.titleM.lineH);
      });
      let yy = y + 8 + it.titleM.h + 1;
      setText(doc, theme.gold);
      doc.setFont("times", "bold");
      doc.setFontSize(9.5);
      it.subM.lines.forEach((line: string, idx: number) => {
        doc.text(line, x + 5, yy + idx * it.subM.lineH);
      });
      yy += it.subM.h + 2;
      drawDivider(doc, x + 4, x + neW - 4, yy, theme, it.accent);
      yy += 3;
      setText(doc, theme.bodyText);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      it.m.lines.forEach((line: string, idx: number) => {
        doc.text(line, x + 5, yy + idx * it.m.lineH);
      });
    });
    y += neH + 5;
  }


  /* ---------- Significados (Cigana + Tarô) ---------- */
  {
    const sigDefs: { title: string; subtitle: string; text: string; accent: RGB }[] = [
      { title: sanitizeText(leitura.cartaCigana), subtitle: "Carta Cigana", text: sanitizeText(leitura.significadoCartaCigana), accent: theme.amethyst },
      { title: sanitizeText(leitura.cartaTaro), subtitle: "Tarô", text: sanitizeText(leitura.significadoTaro), accent: theme.goldDeep },
    ];
    const sigGap = 4;
    const sigW = (W - M * 2 - sigGap) / 2;
    const sigBuilt = sigDefs.map((it) => {
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      const tl = doc.splitTextToSize(it.title, sigW - 8);
      doc.setFont("times", "italic");
      const m = measureText(doc, it.text, sigW - 8, 10, 1.4);
      return { ...it, titleLines: tl, titleH: tl.length * 4, m };
    });
    const sigContentH = Math.max(...sigBuilt.map((b) => 10 + b.titleH + 4 + b.m.h));
    const sigH = sigContentH + 6;
    ensureSpace(sigH + 6);
    sigBuilt.forEach((it, i) => {
      const x = M + i * (sigW + sigGap);
      drawCard(doc, x, y, sigW, sigH, theme);
      setFill(doc, it.accent);
      doc.rect(x, y, sigW, 1.4, "F");
      drawGlyph(doc, x + 5, y + 8, it.accent, theme);
      setText(doc, theme.titleText);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      it.titleLines.forEach((line: string, idx: number) => {
        doc.text(line, x + 10, y + 8.6 + idx * 4);
      });
      setText(doc, theme.bodyText);
      doc.setFont("times", "italic");
      doc.setFontSize(10);
      const textY = y + 12 + it.titleH + 4;
      it.m.lines.forEach((line: string, idx: number) => {
        doc.text(line, x + 4, textY + idx * it.m.lineH);
      });
    });
    y += sigH + 6;
  }

  /* ---------- Numerologia (grid como na tela) ---------- */
  {
    const nd = leitura.numerologiaDetalhe;
    const innerW = W - M * 2 - padding * 2;

    doc.setFont("times", "normal");
    const semTxt = sanitizeText(nd.mensagemUnificada);
    const sem = measureText(doc, semTxt, innerW - 6, 10.5, 1.4);


    // sub-cards
    const subGap = 3;
    const subW = (innerW - subGap * 2) / 3;
    const pf = nd.pontosFortes.map(sanitizeText);
    const po = nd.pontosFracos.map(sanitizeText);
    const am = nd.aMelhorar.map(sanitizeText);
    const buildList = (arr: string[]) => {
      const all: string[] = [];
      arr.forEach((p) => {
        const ls = doc.splitTextToSize(`• ${p}`, subW - 6);
        ls.forEach((l: string) => all.push(l));
      });
      return all;
    };
    const listFontH = 9 * 1.4 * 0.3528;
    const lPf = buildList(pf);
    const lPo = buildList(po);
    const lAm = buildList(am);
    const subContentH = Math.max(lPf.length, lPo.length, lAm.length) * listFontH;
    const subCardH = 8 + subContentH + 4;

    const headerH = 20;
    const boxSem = 6 + sem.h + 3;
    const totalH = headerH + boxSem + 4 + subCardH + padding;

    ensureSpace(totalH + 5);

    drawCard(doc, M, y, W - M * 2, totalH, theme);
    setFill(doc, theme.gold);
    doc.rect(M, y, 1.6, totalH, "F");
    drawGlyph(doc, M + padding + 3, y + 8, theme.gold, theme);
    setText(doc, theme.titleText);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(`Numerologia — Semana ${nd.numeroSemana} · Vibração do Nome ${nd.numeroNome}`, M + padding + 8, y + 8.5);
    setText(doc, theme.mutedText);
    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.text("Vibração da semana e Vibração do Nome", M + padding + 8, y + 14);
    drawDivider(doc, M + padding, W - M - padding, y + 17.5, theme, theme.gold);

    let yy = y + headerH;

    // Vibração da semana
    drawCard(doc, M + padding, yy, innerW, boxSem, theme, {
      fill: theme.isDark ? mix(theme.cardBg, theme.gold, 0.12) : mix(theme.cardBg, theme.gold, 0.06),
      border: theme.gold,
    });
    setText(doc, theme.gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.text(`DIRECIONAMENTO (${nd.numeroSemana} + ${nd.numeroNome})`, M + padding + 3, yy + 4.2);

    setText(doc, theme.bodyText);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    sem.lines.forEach((line: string, i: number) => doc.text(line, M + padding + 3, yy + 8 + i * sem.lineH));
    yy += boxSem + 3;

    yy += 0;


    // 3 sub-cards
    const subs: { title: string; lines: string[]; accent: RGB }[] = [
      { title: "PONTOS FORTES", lines: lPf, accent: theme.emerald },
      { title: "PONTOS A OBSERVAR", lines: lPo, accent: theme.neutralCard },
      { title: "O QUE MELHORAR", lines: lAm, accent: theme.gold },
    ];
    subs.forEach((s, i) => {
      const x = M + padding + i * (subW + subGap);
      drawCard(doc, x, yy, subW, subCardH, theme, {
        fill: theme.isDark ? mix(theme.cardBg, s.accent, 0.14) : mix(theme.cardBg, s.accent, 0.05),
        border: s.accent,
      });
      setFill(doc, s.accent);
      doc.rect(x, yy, subW, 1.2, "F");
      setText(doc, s.accent);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.6);
      doc.text(s.title, x + 3, yy + 5);
      setText(doc, theme.bodyText);
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      s.lines.forEach((line: string, k: number) => {
        doc.text(line, x + 3, yy + 9 + k * listFontH);
      });
    });

    y += totalH + 5;
  }

  /* ---------- Foco / Espiritual / Saúde ---------- */
  [
    { title: "Foco da Semana", subtitle: sanitizeText(leitura.foco), text: sanitizeText(leitura.mensagemFoco), accent: theme.goldDeep },
    { title: "Espiritual", subtitle: "Energia & Sentimento", text: sanitizeText(leitura.mensagemEspiritual), accent: theme.amethyst },
    { title: "Saude", subtitle: "Emocional & Físico", text: sanitizeText(leitura.mensagemSaude), accent: theme.rose },
  ].forEach(drawSection);

  /* ---------- Sugestões práticas ---------- */
  const sugestoes = leitura.sugestoes ?? [];
  if (sugestoes.length > 0) {
    const texto = sugestoes.map((s, i) => `${i + 1}. ${sanitizeText(s)}`).join("\n");
    drawSection({
      title: "Direcionamento Prático da Semana",
      subtitle: "Pequenas atitudes constantes movem mais do que grandes promessas",
      text: texto,
      accent: theme.gold,
    });
  }

  /* ---------- Exercício mental ---------- */
  const ex = leitura.exercicioMental;
  if (ex?.passos?.length) {
    const texto = ex.passos.map((p, i) => `${i + 1}. ${sanitizeText(p)}`).join("\n");
    drawSection({
      title: "Exercício de Saúde Mental da Semana",
      subtitle: sanitizeText(ex.titulo),
      text: texto,
      accent: theme.emerald,
    });
  }

  /* ---------- Conselho da Cigana Estella ---------- */
  {
    const finalPad = 10;
    const innerW = W - M * 2 - finalPad * 2;
    const finalText = sanitizeText(leitura.mensagemFinal);
    doc.setFont("times", "italic");
    const f = measureText(doc, finalText, innerW, 11.5, 1.55);
    const headerFinal = 24;
    let cursor = 0, first = true;
    while (cursor < f.lines.length) {
      const availableH = H - FOOTER - y - headerFinal - finalPad;
      if (availableH < f.lineH * 3) { newPage(); continue; }
      const linesPerBlock = Math.min(f.lines.length - cursor, Math.floor(availableH / f.lineH));
      const chunk = f.lines.slice(cursor, cursor + linesPerBlock);
      const blockH = headerFinal + chunk.length * f.lineH + finalPad;

      drawCard(doc, M, y, W - M * 2, blockH, theme, {
        glow: first,
        fill: theme.isDark ? mix(theme.cardBg, theme.rose, 0.1) : theme.cardBg,
        border: theme.rose,
      });
      setFill(doc, theme.rose);
      doc.rect(M, y, W - M * 2, 1.4, "F");
      if (first) {
        setText(doc, theme.titleText);
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.text("Conselho da Cigana Estella", W / 2, y + 9, { align: "center" });
        setText(doc, theme.mutedText);
        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.text("Palavra de amor, gratidão e incentivo para a sua semana", W / 2, y + 14, { align: "center" });
      }
      setText(doc, theme.bodyText);
      doc.setFont("times", "italic");
      doc.setFontSize(11.5);
      chunk.forEach((line: string, idx: number) => {
        const trimmed = line.trim();
        const lw = doc.getTextWidth(trimmed);
        doc.text(trimmed, M + (W - M * 2) / 2 - lw / 2, y + headerFinal + idx * f.lineH);
      });
      y += blockH + 5;
      cursor += linesPerBlock;
      first = false;
      if (cursor < f.lines.length) newPage();
    }
  }


  /* ---------- Rodapé ---------- */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setText(doc, theme.gold);
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.text("Direcionamento Sagrado  -  Clube do Tarô", W / 2, H - 3.5, { align: "center" });
  }

  const slug = sanitizeText(leitura.nome).replace(/\s+/g, "-").toLowerCase();
  doc.save(`direcionamento-${slug}-${filenameSuffix}.pdf`);
}

/* ============================================================================
 * Exports
 * ========================================================================== */
export function gerarPdfMistico(leitura: Leitura) {
  renderPdf(leitura, MysticTheme, "mistico");
}
export function gerarPdfImpressao(leitura: Leitura) {
  renderPdf(leitura, PrintTheme, "impressao");
}
/** Compat: mantém a função antiga apontando para a versão de impressão. */
export function gerarPdfLeitura(leitura: Leitura) {
  gerarPdfImpressao(leitura);
}
