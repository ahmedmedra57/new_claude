import jsPDF from 'jspdf';
import { createPdf } from './createPdf';

export async function exportChartToPdf(chart) {
  const doc = new jsPDF('p', 'px'); // (1)

  const elements = document.getElementsByClassName(chart); // (2)

  await createPdf(doc, elements); // (3-5)

  doc.save(`charts.pdf`); // (6)}
}
