import { jsPDF } from 'jspdf';
import { ColoringBook } from '../types';

export async function generateColoringBookPdf(book: ColoringBook): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter', // 215.9 x 279.4 mm
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;

  // ----------------------------------------------------
  // PAGE 1: Custom Decorative Cover Page
  // ----------------------------------------------------
  // Decorative outer borders
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(1.8);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  doc.setLineWidth(0.6);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Corner star accents
  const drawCornerStars = (x: number, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('★', x, y, { align: 'center' });
  };
  drawCornerStars(18, 20);
  drawCornerStars(pageWidth - 18, 20);
  drawCornerStars(18, pageHeight - 16);
  drawCornerStars(pageWidth - 18, pageHeight - 16);

  // Top header banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('★ OFFICIAL PERSONALIZED COLORING ADVENTURE ★', pageWidth / 2, 28, { align: 'center' });

  // Child's Name Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 15, 15);
  const childUpper = (book.childName || 'FRIEND').toUpperCase();
  doc.text(`${childUpper}'S`, pageWidth / 2, 45, { align: 'center' });

  // Theme Title
  doc.setFontSize(24);
  const themeUpper = (book.theme || 'SPECIAL ADVENTURE').toUpperCase();
  const splitTheme = doc.splitTextToSize(themeUpper, pageWidth - 50);
  doc.text(splitTheme, pageWidth / 2, 58, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text('A CUSTOM 5-PAGE COLORING BOOK', pageWidth / 2, 73, { align: 'center' });

  // Decorative divider
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.8);
  doc.line(45, 78, pageWidth - 45, 78);
  doc.setFontSize(10);
  doc.text('✦  ✦  ✦', pageWidth / 2, 83, { align: 'center' });

  // Center Frame: Artist Ownership & Dedication Box
  const boxX = 28;
  const boxY = 92;
  const boxW = pageWidth - 56;
  const boxH = 110;

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(1.2);
  doc.roundedRect(boxX, boxY, boxW, boxH, 4, 4);
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX + 2, boxY + 2, boxW - 4, boxH - 4, 3, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('★ THIS COLORING BOOK BELONGS TO: ★', pageWidth / 2, boxY + 16, { align: 'center' });

  // Child's Name Display
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(10, 10, 10);
  doc.text(book.childName || 'Super Artist', pageWidth / 2, boxY + 34, { align: 'center' });

  // Signature and Date lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Official Master Artist in Training', pageWidth / 2, boxY + 44, { align: 'center' });

  doc.line(boxX + 18, boxY + 68, boxW + boxX - 18, boxY + 68);
  doc.setFontSize(9);
  doc.text('Artist Signature', pageWidth / 2, boxY + 73, { align: 'center' });

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  doc.text(`Created on: ${today}`, pageWidth / 2, boxY + 88, { align: 'center' });
  doc.text('Includes 5 Thick-Line Printable Art Pages', pageWidth / 2, boxY + 98, { align: 'center' });

  // Dedication note
  if (book.dedication) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const splitDedication = doc.splitTextToSize(`"${book.dedication}"`, pageWidth - 46);
    doc.text(splitDedication, pageWidth / 2, 222, { align: 'center' });
  }

  // Cover Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text('Grab your crayons, markers, or colored pencils and start the adventure!', pageWidth / 2, 248, { align: 'center' });
  doc.text('Printed at Letter Size (8.5 x 11 in) • Ready to Frame & Share', pageWidth / 2, 255, { align: 'center' });

  // ----------------------------------------------------
  // PAGES 2 - 6: The 5 Coloring Pages
  // ----------------------------------------------------
  for (let i = 0; i < book.pages.length; i++) {
    const page = book.pages[i];
    doc.addPage('letter', 'portrait');

    // Page Border
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(1.0);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // Header info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`${book.childName}'s Coloring Book  •  ${book.theme}`, 18, 21);
    doc.text(`Page ${page.pageNumber} of 5`, pageWidth - 18, 21, { align: 'right' });

    // Header divider line
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(18, 23, pageWidth - 18, 23);

    // Scene Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(20, 20, 20);
    doc.text(page.sceneTitle || `Page ${page.pageNumber}`, pageWidth / 2, 33, { align: 'center' });

    // Coloring Image
    const imgX = 26;
    const imgY = 38;
    const imgW = pageWidth - 52; // ~163.9 mm
    const imgH = 195; // 3:4 portrait ratio fits nicely

    if (page.imageUrl) {
      try {
        doc.addImage(page.imageUrl, 'PNG', imgX, imgY, imgW, imgH);
      } catch (err) {
        console.error('Could not render image to PDF:', err);
        // Fallback placeholder box
        doc.setDrawColor(120, 120, 120);
        doc.setLineWidth(0.8);
        doc.rect(imgX, imgY, imgW, imgH);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Coloring line art', pageWidth / 2, imgY + imgH / 2, { align: 'center' });
      }
    } else {
      // Placeholder if image was not yet loaded
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.8);
      doc.rect(imgX, imgY, imgW, imgH);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(120, 120, 120);
      doc.text(`[Line art for ${page.sceneTitle}]`, pageWidth / 2, imgY + imgH / 2, { align: 'center' });
    }

    // Story Caption at bottom
    if (page.storyCaption) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const splitCaption = doc.splitTextToSize(page.storyCaption, pageWidth - 48);
      doc.text(splitCaption, pageWidth / 2, 245, { align: 'center' });
    }

    // Page footer encouragement
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text('★ COLOR INSIDE OR OUTSIDE THE LINES — YOU ARE THE ARTIST! ★', pageWidth / 2, 266, {
      align: 'center',
    });
  }

  // Generate safe filename and trigger download
  const cleanName = (book.childName || 'child').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanTheme = (book.theme || 'coloring_book').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_${cleanTheme}_Coloring_Book.pdf`;

  doc.save(filename);
}
