import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const PDF_BACKGROUND = "#24183A";
const PDF_TEXT = "#F8F3EA";
const PDF_GOLD = "#D4AF37";
const PDF_BORDER = "#6F568D";

const MAX_CANVAS_DIMENSION = 30000;

function waitForLayout() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Procura uma linha horizontal vazia próxima do limite da página.
 *
 * Isso permite terminar uma página entre linhas/parágrafos,
 * em vez de cortar uma frase no meio.
 */
function findBestCutRow(
  canvas: HTMLCanvasElement,
  desiredRow: number,
  minRow: number,
  maxRow: number
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return desiredRow;
  }

  const start = Math.max(
    minRow,
    desiredRow - 180
  );

  const end = Math.min(
    maxRow,
    desiredRow + 40
  );

  if (end <= start) {
    return desiredRow;
  }

  const imageData = context.getImageData(
    0,
    start,
    canvas.width,
    end - start
  );

  const data = imageData.data;

  let bestRow = desiredRow;
  let bestDistance = Infinity;

  /*
   * Consideramos uma linha vazia quando
   * praticamente não existe conteúdo visível.
   */
  for (
    let row = 0;
    row < end - start;
    row++
  ) {
    let visiblePixels = 0;

    for (
      let x = 0;
      x < canvas.width;
      x += 4
    ) {
      const index =
        (row * canvas.width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      if (a > 20) {
        const brightness =
          r + g + b;

        /*
         * O fundo é escuro.
         * Textos e elementos claros
         * apresentam brilho maior.
         */
        if (brightness > 150) {
          visiblePixels++;
        }
      }
    }

    if (visiblePixels <= 2) {
      const absoluteRow = start + row;
      const distance = Math.abs(
        absoluteRow - desiredRow
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestRow = absoluteRow;
      }
    }
  }

  return bestRow;
}
function trimBottomEmptySpace(
  canvas: HTMLCanvasElement
) {
  const context =
    canvas.getContext("2d");

  if (!context) {
    return canvas;
  }

  const imageData =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

  const data =
    imageData.data;

  let lastContentRow = 0;

  for (
    let y = canvas.height - 1;
    y >= 0;
    y--
  ) {
    let hasContent = false;

    for (
      let x = 0;
      x < canvas.width;
      x += 4
    ) {
      const index =
        (y * canvas.width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      if (
        a > 20 &&
        r + g + b > 180
      ) {
        hasContent = true;
        break;
      }
    }

    if (hasContent) {
      lastContentRow = y;
      break;
    }
  }

  /*
   * Mantém um pequeno respiro
   * depois do último conteúdo.
   */
  const padding = 40;

  const finalHeight =
    Math.min(
      canvas.height,
      lastContentRow + padding
    );

  if (
    finalHeight >=
    canvas.height
  ) {
    return canvas;
  }

  const trimmedCanvas =
    document.createElement(
      "canvas"
    );

  trimmedCanvas.width =
    canvas.width;

  trimmedCanvas.height =
    Math.max(
      finalHeight,
      1
    );

  const trimmedContext =
    trimmedCanvas.getContext(
      "2d"
    );

  if (!trimmedContext) {
    return canvas;
  }

  trimmedContext.fillStyle =
    PDF_BACKGROUND;

  trimmedContext.fillRect(
    0,
    0,
    trimmedCanvas.width,
    trimmedCanvas.height
  );

  trimmedContext.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    trimmedCanvas.height,
    0,
    0,
    canvas.width,
    trimmedCanvas.height
  );

  return trimmedCanvas;
}
function addBackground(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number
) {
  pdf.setFillColor(36, 24, 58);

  pdf.rect(
    0,
    0,
    pageWidth,
    pageHeight,
    "F"
  );
}

function addFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  page: number,
  totalPages: number,
  nome?: string
) {
  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.25);

  pdf.line(
    margin,
    pageHeight - 8,
    pageWidth - margin,
    pageHeight - 8
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(7);

  pdf.setTextColor(
    216,
    201,
    232
  );

  pdf.text(
    "MAPA NUMEROLÓGICO PREMIUM",
    margin,
    pageHeight - 4
  );

  if (nome) {
    pdf.text(
      nome,
      pageWidth / 2,
      pageHeight - 4,
      {
        align: "center",
      }
    );
  }

  pdf.text(
    `${page} / ${totalPages}`,
    pageWidth - margin,
    pageHeight - 4,
    {
      align: "right",
    }
  );
}

async function captureBlock(
  block: HTMLElement
) {
  const clone =
    block.cloneNode(true) as HTMLElement;

  const captureArea =
    document.createElement("div");

  captureArea.style.position =
    "fixed";

  captureArea.style.left =
    "-20000px";

  captureArea.style.top = "0";

  captureArea.style.width =
    "794px";

  captureArea.style.margin = "0";

  captureArea.style.padding = "0";

  captureArea.style.background =
    PDF_BACKGROUND;

  captureArea.style.backgroundColor =
    PDF_BACKGROUND;

  captureArea.style.pointerEvents =
    "none";

  captureArea.style.zIndex =
    "-9999";

  clone.style.position =
    "relative";

  clone.style.left = "0";

  clone.style.top = "0";

  clone.style.width =
    "794px";

  clone.style.maxWidth =
    "794px";

  clone.style.height = "auto";

  clone.style.minHeight = "0";

  clone.style.maxHeight =
    "none";

  clone.style.overflow =
    "visible";

  clone.style.margin = "0";

  clone.style.background =
    PDF_BACKGROUND;

  clone.style.backgroundColor =
    PDF_BACKGROUND;

  clone.style.boxShadow =
    "none";

  clone.style.filter =
    "none";

  clone.style.color =
    PDF_TEXT;

  /*
   * Impede que estilos de página
   * existentes criem alturas artificiais.
   */
  clone.style.breakBefore =
    "auto";

  clone.style.breakAfter =
    "auto";

  clone.style.breakInside =
    "auto";

  clone
    .querySelectorAll("button")
    .forEach((button) => {
      button.remove();
    });

  clone
    .querySelectorAll("*")
    .forEach((node) => {
      const item =
        node as HTMLElement;

      item.style.boxShadow =
        "none";

      item.style.filter =
        "none";

      /*
       * Não deixamos elementos internos
       * criarem uma segunda cor de fundo.
       */
      item.style.backgroundColor =
        "transparent";

      item.style.backgroundImage =
        "none";
    });

  captureArea.appendChild(
    clone
  );

  document.body.appendChild(
    captureArea
  );

  await waitForLayout();

  const width =
    Math.min(
      captureArea.scrollWidth,
      794
    );

  const height =
    captureArea.scrollHeight;

  if (
    width <= 0 ||
    height <= 0
  ) {
    captureArea.remove();

    return null;
  }

  const scale =
    Math.min(
      1.5,
      MAX_CANVAS_DIMENSION /
        Math.max(width, height)
    );

  let canvas:
    | HTMLCanvasElement
    | null = null;

  try {
    canvas =
      await html2canvas(
        captureArea,
        {
          scale,

          useCORS: true,

          backgroundColor:
            PDF_BACKGROUND,

          logging: false,

          width,

          height,

          windowWidth: width,

          windowHeight:
            Math.min(
              height,
              MAX_CANVAS_DIMENSION
            ),

          scrollX: 0,

          scrollY: 0,
        }
      );
  } finally {
    captureArea.remove();
  }

  return canvas;
}

export async function generatePdf(
  _resultado?: any,
  nome?: string
) {
  const element =
    document.getElementById(
      "premium-pdf"
    );

  if (!element) {
    alert(
      "Conteúdo do PDF não encontrado."
    );

    return;
  }

  console.log(
    "PDF: iniciando"
  );

  const pdf =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 12;

  const contentWidth =
    pageWidth - margin * 2;

  const contentHeight =
    pageHeight - margin * 2;

  const blocks =
    Array.from(
      element.children
    ) as HTMLElement[];

  if (blocks.length === 0) {
    alert(
      "Nenhum conteúdo encontrado para o PDF."
    );

    return;
  }

  let pageNumber = 0;

  for (
    let blockIndex = 0;
    blockIndex < blocks.length;
    blockIndex++
  ) {
    const block =
      blocks[blockIndex];

    if (!block) {
      continue;
    }

    console.log(
      `PDF: preparando bloco ${
        blockIndex + 1
      } de ${blocks.length}`
    );

    const capturedCanvas =
  await captureBlock(block);

if (!capturedCanvas) {
  continue;
}

if (
  capturedCanvas.width <= 0 ||
  capturedCanvas.height <= 0
) {
  continue;
}

const canvas =
  trimBottomEmptySpace(
    capturedCanvas
  );

const imageWidth =
  contentWidth;

    const imageHeight =
      (canvas.height *
        imageWidth) /
      canvas.width;

    /*
     * BLOCO INTEIRO EM UMA PÁGINA
     */
    if (
      imageHeight <= contentHeight
    ) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      addBackground(
        pdf,
        pageWidth,
        pageHeight
      );

      pdf.addImage(
        canvas.toDataURL(
          "image/png"
        ),
        "PNG",
        margin,
        margin,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      pageNumber++;

      continue;
    }

    /*
     * CAPÍTULO MAIOR QUE UMA PÁGINA.
     *
     * Aqui está a principal correção:
     * procuramos uma linha vazia antes
     * de cada corte.
     */
    const pixelsPerPage =
      Math.floor(
        (contentHeight *
          canvas.width) /
          imageWidth
      );

    let sourceY = 0;

    while (
      sourceY < canvas.height
    ) {
      const remaining =
        canvas.height -
        sourceY;

      if (
        remaining <=
        pixelsPerPage
      ) {
        if (pageNumber > 0) {
          pdf.addPage();
        }

        addBackground(
          pdf,
          pageWidth,
          pageHeight
        );

        const finalCanvas =
          document.createElement(
            "canvas"
          );

        finalCanvas.width =
          canvas.width;

        finalCanvas.height =
          remaining;

        const finalContext =
          finalCanvas.getContext(
            "2d"
          );

        if (!finalContext) {
          throw new Error(
            "Não foi possível preparar a última página."
          );
        }

        finalContext.fillStyle =
          PDF_BACKGROUND;

        finalContext.fillRect(
          0,
          0,
          finalCanvas.width,
          finalCanvas.height
        );

        finalContext.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          remaining,
          0,
          0,
          canvas.width,
          remaining
        );

        const finalHeightMm =
          (remaining *
            imageWidth) /
          canvas.width;

        pdf.addImage(
          finalCanvas.toDataURL(
            "image/png"
          ),
          "PNG",
          margin,
          margin,
          imageWidth,
          finalHeightMm,
          undefined,
          "FAST"
        );

        pageNumber++;

        break;
      }

      /*
       * Limite ideal para esta página.
       */
      const desiredRow =
        sourceY +
        pixelsPerPage;

      /*
       * Procuramos um espaço vazio
       * próximo do limite.
       */
      const cutRow =
        findBestCutRow(
          canvas,
          desiredRow,
          sourceY + 250,
          desiredRow
        );

      /*
       * Proteção para evitar
       * cortes pequenos demais.
       */
      const minimumSlice =
        Math.max(
          400,
          Math.floor(
            pixelsPerPage * 0.55
          )
        );

      let actualCut =
        cutRow;

      if (
        actualCut -
          sourceY <
        minimumSlice
      ) {
        actualCut =
          desiredRow;
      }

      const sliceHeight =
        actualCut -
        sourceY;

      if (
        sliceHeight <= 0
      ) {
        break;
      }

      if (pageNumber > 0) {
        pdf.addPage();
      }

      addBackground(
        pdf,
        pageWidth,
        pageHeight
      );

      const sliceCanvas =
        document.createElement(
          "canvas"
        );

      sliceCanvas.width =
        canvas.width;

      sliceCanvas.height =
        sliceHeight;

      const context =
        sliceCanvas.getContext(
          "2d"
        );

      if (!context) {
        throw new Error(
          "Não foi possível preparar a página."
        );
      }

      context.fillStyle =
        PDF_BACKGROUND;

      context.fillRect(
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height
      );

      context.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      const sliceHeightMm =
        (sliceHeight *
          imageWidth) /
        canvas.width;

      pdf.addImage(
        sliceCanvas.toDataURL(
          "image/png"
        ),
        "PNG",
        margin,
        margin,
        imageWidth,
        sliceHeightMm,
        undefined,
        "FAST"
      );

      pageNumber++;

      sourceY =
        actualCut;
    }
  }

  if (pageNumber === 0) {
    alert(
      "Não foi possível criar nenhuma página."
    );

    return;
  }

  /*
   * RODAPÉ
   */
  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    addFooter(
      pdf,
      pageWidth,
      pageHeight,
      margin,
      page,
      totalPages,
      nome
    );
  }

  console.log(
    `PDF: ${totalPages} páginas criadas`
  );

  /*
   * ABRE FORA DO SISTEMA
   */
  const blob =
    pdf.output("blob");

  const url =
    URL.createObjectURL(blob);

  const newWindow =
    window.open(
      url,
      "_blank"
    );

  if (!newWindow) {
    alert(
      "O navegador bloqueou a abertura do PDF. Permita pop-ups."
    );

    return;
  }

  console.log(
    "PDF: aberto com sucesso"
  );
}