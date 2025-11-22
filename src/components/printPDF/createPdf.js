import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';

export async function createPdf(doc, elements) {
  let top = 20;
  const padding = 10;

  for (let i = 0; i < elements.length; i++) {
    const el = elements.item(i);
    const imgData = await htmlToImage.toPng(el,{ skipFonts: true });

    let elHeight = el.offsetHeight;
    let elWidth = el.offsetWidth;

    const pageWidth = doc.internal.pageSize.getWidth();

    if (elWidth > pageWidth) {
      const ratio = pageWidth / elWidth;
      elHeight = elHeight * ratio - padding;
      elWidth = elWidth * ratio - padding * 2;
    }

    const pageHeight = doc.internal.pageSize.getHeight();

    if (top + elHeight > pageHeight) {
      doc.addPage();
      top = 20;
    }

    doc.addImage(imgData, 'PNG', padding, top, elWidth, elHeight, `image${i}`);
    top += elHeight;
  }
}
