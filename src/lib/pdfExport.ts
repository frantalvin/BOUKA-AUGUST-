import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = (element: HTMLElement, filename: string) => {
  // Use html2canvas to render the specified HTML element onto a canvas
  html2canvas(element, {
    scale: 2, // Increase scale for better quality
    useCORS: true, // Needed for external images
    backgroundColor: '#ffffff', // Force a white background to prevent empty/transparent PDFs
    onclone: (document) => {
      // On the cloned document, find the tree and adjust styles for printing
      const treeElement = document.querySelector('.tree') as HTMLElement | null;
      if (treeElement) {
        // Center the tree for the PDF export
        treeElement.style.justifyContent = 'center';
        treeElement.style.width = '100%';
      }
    },
  }).then((canvas) => {
    // Get the image data from the canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape', // Set to landscape for wider trees
      unit: 'px',
      format: [canvas.width, canvas.height], // Set PDF size to canvas size
    });

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    // Save the PDF
    pdf.save(filename);
  });
};
