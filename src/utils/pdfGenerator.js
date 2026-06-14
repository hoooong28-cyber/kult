import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateKultPDF = async (elementId, fileName = 'KULT-Premium-Guide.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(fileName);
        return true;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        return false;
    }
};

export const generateDataPDF = (data, title = 'KULT PREMIUM') => {
    // Alternative: Generate PDF from data objects directly (more robust but harder to style)
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('KULT', 20, 25);
    
    doc.setFontSize(10);
    doc.text('PREMIUM INSIDER GUIDE', 160, 25);

    // Content
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(20);
    doc.text(title.toUpperCase(), 20, 60);

    // Render based on type
    let y = 80;
    if (data.type === 'Travel Route') {
        doc.setFontSize(12);
        doc.text(`Category: ${data.category}`, 20, y);
        y += 10;
        doc.text(`Location: ${data.name}`, 20, y);
        y += 20;
        doc.setFontSize(14);
        doc.text('EXCLUSIVE DESCRIPTION', 20, y);
        y += 10;
        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(data.description, 170);
        doc.text(splitDescription, 20, y);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2024 KULT. ALL RIGHTS RESERVED.', 105, 285, null, null, 'center');

    doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
