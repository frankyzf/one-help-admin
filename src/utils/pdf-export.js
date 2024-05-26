/* eslint-disable no-await-in-loop */
/**
 * 导出页面为PDF
 */
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { A4_WIDTH, A4_HEIGHT } from '@/config/constant';

async function html2Pdf(className, { fileName = 'generated' } = {}) {
  const doms = [...document.querySelectorAll(`.${className}`)];
  const len = doms.length;
  const jsPdf = new JsPDF('', 'pt', 'a4');
  for (let i = 0; i < len; i += 1) {
    const dom = doms[i];
    const canvas = await html2canvas(dom, {
      scale: window.devicePixelRatio * 3,
      dpi: 300,
      background: '#fff',
      logging: true,
      useCORS: true,
      imageTimeout: 6000,
      scrollX: 0,
      scrollY: 0,
    });
    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    jsPdf.addImage(pageData, 'JPEG', 0, 0, A4_WIDTH, A4_HEIGHT);
    if (i !== len - 1) {
      jsPdf.addPage();
    }
  }
  jsPdf.save(fileName);
}

export default html2Pdf;
