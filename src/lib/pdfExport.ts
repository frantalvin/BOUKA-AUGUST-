import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = (element: HTMLElement, filename: string) => {
  const originalWidth = element.style.width;
  const originalTransform = element.style.transform;

  // Temporarily set a specific width for the element to be captured
  element.style.width = `${element.scrollWidth}px`;
  // Reset transform to avoid scaling issues
  element.style.transform = 'scale(1)';


  html2canvas(element, {
    scale: 2,
    useCORS: true, 
    backgroundColor: '#ffffff', 
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (document) => {
      const treeElement = document.querySelector('.tree') as HTMLElement | null;
      if (treeElement) {
        treeElement.style.justifyContent = 'flex-start';
        treeElement.style.width = 'max-content';
      }
    },
  }).then((canvas) => {
    // Restore original styles
    element.style.width = originalWidth;
    element.style.transform = originalTransform;
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape', 
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  });
};
