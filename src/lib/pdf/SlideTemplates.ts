import jsPDF from 'jspdf';
import { REPORT_COLORS, SLIDE_CONFIG, ReportData, SocialMediaStat, CounterContentItem, ProductionLink } from './types';

// Helper to add a new slide
export const addNewSlide = (doc: jsPDF): void => {
  doc.addPage([SLIDE_CONFIG.width, SLIDE_CONFIG.height], 'landscape');
};

// Helper to draw slide header
const drawHeader = (doc: jsPDF, title: string, pageNum: number, totalPages: number): void => {
  doc.setFillColor(REPORT_COLORS.primary);
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.headerHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor('#ffffff');
  doc.text(title, SLIDE_CONFIG.margin, 16);
  
  // Page number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${pageNum}/${totalPages}`, SLIDE_CONFIG.width - SLIDE_CONFIG.margin - 10, 16);
};

// Helper to draw footer
const drawFooter = (doc: jsPDF, brandName: string): void => {
  const y = SLIDE_CONFIG.height - SLIDE_CONFIG.footerHeight;
  doc.setFillColor(REPORT_COLORS.secondary);
  doc.rect(0, y, SLIDE_CONFIG.width, SLIDE_CONFIG.footerHeight, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'normal');
  doc.text(`© 2024 ${brandName} - Confidential`, SLIDE_CONFIG.margin, y + 10);
};

// SLIDE 1: Cover
export const createCoverSlide = (doc: jsPDF, data: ReportData): void => {
  // Background: Very dark navy
  doc.setFillColor('#0f172a');
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.height, 'F');
  
  // Report title: Cyan color
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(48);
  doc.setTextColor('#22d3ee'); // cyan-400
  doc.text(data.reportTitle, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2 - 10, { align: 'center' });
  
  // Update Date: White color
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(24);
  doc.setTextColor('#ffffff');
  doc.text(`Update ${data.updateDate}`, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2 + 20, { align: 'center' });
};

// SLIDE 2: Executive Summary (REPUTATION RECOVERY - CURRENT STATUS)
export const createExecutiveSummarySlide = (doc: jsPDF, data: ReportData, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  drawHeader(doc, 'REPUTATION RECOVERY - CURRENT STATUS', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  let currentY = startY;

  // News/Pemberitaan Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('NEWS / PEMBERITAAN', SLIDE_CONFIG.margin, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(REPORT_COLORS.text);
  
  if (data.newsBulletPoints && data.newsBulletPoints.length > 0) {
    data.newsBulletPoints.forEach((point) => {
      // Draw bullet
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(0, 0, 0);
      doc.circle(SLIDE_CONFIG.margin + 2, currentY - 1, 1, 'F');
      
      const lines = doc.splitTextToSize(point, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - 10);
      doc.text(lines, SLIDE_CONFIG.margin + 8, currentY);
      currentY += (lines.length * 5) + 3;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('Belum ada data berita.', SLIDE_CONFIG.margin + 8, currentY);
    currentY += 10;
  }

  currentY += 10; // Spacing between sections

  // Social Media Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('SOSIAL MEDIA - TIKTOK', SLIDE_CONFIG.margin, currentY);
  currentY += 10;

  // Aktivitas Akun Lawan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('Aktivitas Akun Lawan', SLIDE_CONFIG.margin, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Bullet 1: Sebelum
  doc.circle(SLIDE_CONFIG.margin + 2, currentY - 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Sebelum:', SLIDE_CONFIG.margin + 8, currentY);
  const widthBefore = doc.getTextWidth('Sebelum:');
  doc.setFont('helvetica', 'normal');
  doc.text(` ${data.socialMediaAccountStatusBefore || '-'}`, SLIDE_CONFIG.margin + 8 + widthBefore, currentY);
  currentY += 6;

  // Bullet 2: Sesudah
  doc.circle(SLIDE_CONFIG.margin + 2, currentY - 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Sesudah:', SLIDE_CONFIG.margin + 8, currentY);
  const widthAfter = doc.getTextWidth('Sesudah:');
  doc.setFont('helvetica', 'normal');
  doc.text(` ${data.socialMediaAccountStatusAfter || '-'}`, SLIDE_CONFIG.margin + 8 + widthAfter, currentY);
  currentY += 6;

  // Note
  if (data.socialMediaAccountStatusNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    const noteLines = doc.splitTextToSize(data.socialMediaAccountStatusNote, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - 20);
    doc.text(noteLines, SLIDE_CONFIG.margin + 8, currentY);
    currentY += (noteLines.length * 5) + 6;
  } else {
    currentY += 6;
  }

  // Aktivitas Counter Kita
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Black
  doc.text('Aktivitas Counter Kita', SLIDE_CONFIG.margin, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Bullet 1
  doc.circle(SLIDE_CONFIG.margin + 2, currentY - 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Total views konten counter:', SLIDE_CONFIG.margin + 8, currentY);
  const widthViews = doc.getTextWidth('Total views konten counter:');
  doc.setFont('helvetica', 'normal');
  doc.text(` ${data.socialMediaCounterTotalViews || '-'}`, SLIDE_CONFIG.margin + 8 + widthViews, currentY);
  currentY += 6;

  // Bullet 2
  doc.circle(SLIDE_CONFIG.margin + 2, currentY - 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Total engagement:', SLIDE_CONFIG.margin + 8, currentY);
  const widthEng = doc.getTextWidth('Total engagement:');
  doc.setFont('helvetica', 'normal');
  doc.text(` ${data.socialMediaCounterTotalEngagement || '-'}`, SLIDE_CONFIG.margin + 8 + widthEng, currentY);
  
  drawFooter(doc, data.brandName);
};

// SLIDE 3: Section Divider - RESULTS
export const createSectionDivider = (doc: jsPDF, title: string, subtitle?: string): void => {
  addNewSlide(doc);
  
  doc.setFillColor(REPORT_COLORS.primary);
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.height, 'F');
  
  // Accent line
  doc.setFillColor(REPORT_COLORS.accent);
  doc.rect(SLIDE_CONFIG.width / 2 - 40, SLIDE_CONFIG.height / 2 - 30, 80, 4, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor('#ffffff');
  doc.text(title, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2, { align: 'center' });
  
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(subtitle, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2 + 25, { align: 'center' });
  }
};

// SLIDE 4-5: SERP Screenshots
export const createScreenshotSlide = (
  doc: jsPDF, 
  images: string[] | undefined, 
  caption: string, 
  type: 'before' | 'after',
  pageNum: number, 
  totalPages: number
): void => {
  addNewSlide(doc);
  drawHeader(doc, `GOOGLE SEARCH - ${type.toUpperCase()}`, pageNum, totalPages);
  
  const contentY = SLIDE_CONFIG.headerHeight + 10;
  const contentHeight = SLIDE_CONFIG.height - SLIDE_CONFIG.headerHeight - SLIDE_CONFIG.footerHeight - 30;
  const contentWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
  
  if (images && images.length > 0) {
    // Grid Layout Logic
    const count = Math.min(images.length, 6);
    let cols = 1;
    let rows = 1;
    
    if (count === 2) { cols = 2; rows = 1; }
    else if (count >= 3 && count <= 4) { cols = 2; rows = 2; }
    else if (count >= 5) { cols = 3; rows = 2; }
    
    const gap = 5;
    const cellWidth = (contentWidth - (cols - 1) * gap) / cols;
    const cellHeight = (contentHeight - (rows - 1) * gap) / rows;
    
    images.slice(0, 6).forEach((imgData, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = SLIDE_CONFIG.margin + col * (cellWidth + gap);
      const y = contentY + row * (cellHeight + gap);
      
      try {
        doc.addImage(imgData, 'JPEG', x, y, cellWidth, cellHeight);
        // Add border
        doc.setDrawColor(220, 220, 220);
        doc.rect(x, y, cellWidth, cellHeight);
      } catch (e) {
        // Fallback if image fails
        doc.setFillColor('#f0f0f0');
        doc.rect(x, y, cellWidth, cellHeight, 'F');
      }
    });
  } else {
    // Placeholder
    doc.setFillColor('#f0f0f0');
    doc.rect(SLIDE_CONFIG.margin, contentY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, contentHeight - 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('No screenshot uploaded', SLIDE_CONFIG.width / 2, contentY + contentHeight / 2, { align: 'center' });
  }
  
  // Caption
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(REPORT_COLORS.textLight);
  doc.text(caption, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height - SLIDE_CONFIG.footerHeight - 8, { align: 'center' });
  
  drawFooter(doc, 'RP Report');
};

// SLIDE 5: After Screenshot (Special Layout)
export const createAfterSlide = (
  doc: jsPDF, 
  images: string[] | undefined, 
  title: string,
  pageNum: number, 
  totalPages: number
): void => {
  addNewSlide(doc);
  
  // Background: White
  doc.setFillColor('#ffffff');
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.height, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28); // Large title
  doc.setTextColor('#0f172a'); // Dark navy
  doc.text(title, SLIDE_CONFIG.margin, 30);
  
  const contentY = 45;
  const contentHeight = SLIDE_CONFIG.height - contentY - 20;
  const contentWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
  
  if (images && images.length > 0) {
    // 3-Column Layout (Optimized for vertical screenshots)
    const cols = 3;
    const gap = 10;
    const cellWidth = (contentWidth - (cols - 1) * gap) / cols;
    
    // Use up to 3 images for the main row
    images.slice(0, 3).forEach((imgData, index) => {
      const x = SLIDE_CONFIG.margin + index * (cellWidth + gap);
      const y = contentY;
      
      try {
        // Draw image
        doc.addImage(imgData, 'JPEG', x, y, cellWidth, contentHeight);
        
        // Add subtle shadow/border
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.rect(x, y, cellWidth, contentHeight);
      } catch (e) {
        // Fallback
        doc.setFillColor('#f0f0f0');
        doc.rect(x, y, cellWidth, contentHeight, 'F');
      }
    });
  } else {
     // Placeholder
    doc.setFillColor('#f0f0f0');
    doc.rect(SLIDE_CONFIG.margin, contentY, contentWidth, contentHeight, 'F');
    doc.setFontSize(12);
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('No screenshot uploaded', SLIDE_CONFIG.width / 2, contentY + contentHeight / 2, { align: 'center' });
  }
};

// SLIDE 8: Appendix Divider
export const createAppendixSlide = (doc: jsPDF, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  
  // Background: Dark Navy (same as Cover)
  doc.setFillColor('#0f172a');
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.height, 'F');
  
  // Text: "APPENDIX"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor('#ffffff');
  doc.text('APPENDIX', SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2, { align: 'center' });
};

// SLIDE 9: Data Summary Table
export const createDataSummarySlide = (doc: jsPDF, data: ReportData, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  drawHeader(doc, 'DATA SUMMARY', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  // 1. Keyword Analysis Table (Blue Theme)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('Keyword Analysis', SLIDE_CONFIG.margin, startY);
  
  let tableY = startY + 5;
  
  // Header Background
  doc.setFillColor(REPORT_COLORS.primary); // Navy Blue
  doc.rect(SLIDE_CONFIG.margin, tableY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 10, 'F');
  
  // Header Text
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  const colWidths = [80, 45, 45, 45, 45]; // Total approx 260
  let currentX = SLIDE_CONFIG.margin + 5;
  
  doc.text('Keyword', currentX, tableY + 7);
  currentX += colWidths[0];
  doc.text('Search (Before)', currentX, tableY + 7);
  currentX += colWidths[1];
  doc.text('News (Before)', currentX, tableY + 7);
  currentX += colWidths[2];
  doc.text('Search (Current)', currentX, tableY + 7);
  currentX += colWidths[3];
  doc.text('News (Current)', currentX, tableY + 7);
  
  tableY += 10;
  
  // Rows
  doc.setTextColor(REPORT_COLORS.text);
  doc.setFont('helvetica', 'normal');
  
  if (data.keywordStats && data.keywordStats.length > 0) {
    data.keywordStats.slice(0, 8).forEach((stat, i) => {
      const rowY = tableY + (i * 8);
      const textY = rowY + 6;
      
      // Striped background
      if (i % 2 === 0) {
        doc.setFillColor('#f0f4f8'); // Light blue tint
        doc.rect(SLIDE_CONFIG.margin, rowY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 8, 'F');
      }
      
      let rowX = SLIDE_CONFIG.margin + 5;
      
      // Keyword
      doc.setTextColor(REPORT_COLORS.text);
      doc.text(stat.keyword || '-', rowX, textY);
      rowX += colWidths[0];
      
      // Search Before (Negative Red)
      doc.setTextColor(REPORT_COLORS.negative);
      doc.text((stat.searchBefore || 0).toString(), rowX + 10, textY);
      rowX += colWidths[1];
      
      // News Before (Negative Red)
      doc.text((stat.newsBefore || 0).toString(), rowX + 10, textY);
      rowX += colWidths[2];
      
      // Search Current (Positive Green if 0, else Red)
      doc.setTextColor(stat.searchCurrent === 0 ? REPORT_COLORS.positive : REPORT_COLORS.negative);
      doc.text((stat.searchCurrent || 0).toString(), rowX + 10, textY);
      rowX += colWidths[3];
      
      // News Current (Positive Green if 0, else Red)
      doc.setTextColor(stat.newsCurrent === 0 ? REPORT_COLORS.positive : REPORT_COLORS.negative);
      doc.text((stat.newsCurrent || 0).toString(), rowX + 10, textY);
    });
    tableY += (data.keywordStats.length * 8) + 5;
  } else {
    // Empty state
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('No keyword data available', SLIDE_CONFIG.margin + 5, tableY + 6);
    tableY += 15;
  }
  
  // 2. Production Stats Table (Green Theme)
  const productionY = tableY + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.positive); // Green title
  doc.text('Konten yang diproduksi', SLIDE_CONFIG.margin, productionY);
  
  const prodTableY = productionY + 5;
  
  // Header Background
  doc.setFillColor(REPORT_COLORS.positive); // Green
  doc.rect(SLIDE_CONFIG.margin, prodTableY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 10, 'F');
  
  // Header Text
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  const prodColWidths = [50, 50, 50, 50, 50]; // Equal width
  let prodX = SLIDE_CONFIG.margin + 10;
  
  doc.text('Views', prodX, prodTableY + 7);
  prodX += prodColWidths[0];
  doc.text('Like', prodX, prodTableY + 7);
  prodX += prodColWidths[1];
  doc.text('Comment', prodX, prodTableY + 7);
  prodX += prodColWidths[2];
  doc.text('Saved', prodX, prodTableY + 7);
  prodX += prodColWidths[3];
  doc.text('Share', prodX, prodTableY + 7);
  
  // Value Row
  const valY = prodTableY + 10;
  const textValY = valY + 8;
  
  // Background
  doc.setFillColor('#f0fff4'); // Light green tint
  doc.rect(SLIDE_CONFIG.margin, valY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(REPORT_COLORS.text);
  
  let valX = SLIDE_CONFIG.margin + 10;
  const stats = data.productionStats || { views: '0', likes: '0', comments: '0', saved: '0', shares: '0' };
  
  doc.text((stats.views || '0').toString(), valX, textValY);
  valX += prodColWidths[0];
  doc.text((stats.likes || '0').toString(), valX, textValY);
  valX += prodColWidths[1];
  doc.text((stats.comments || '0').toString(), valX, textValY);
  valX += prodColWidths[2];
  doc.text((stats.saved || '0').toString(), valX, textValY);
  valX += prodColWidths[3];
  doc.text((stats.shares || '0').toString(), valX, textValY);

  drawFooter(doc, data.brandName);
};

// SLIDE: Social Media Stats
export const createSocialMediaStatsSlide = (doc: jsPDF, stats: SocialMediaStat[], brandName: string, pageNum: number, totalPages: number): void => {
  if (stats.length === 0) return;
  
  addNewSlide(doc);
  drawHeader(doc, 'SOCIAL MEDIA STATISTICS', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  const cardWidth = (SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - 20) / 2;
  const cardHeight = 50;
  
  stats.slice(0, 6).forEach((stat, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = SLIDE_CONFIG.margin + col * (cardWidth + 20);
    const y = startY + row * (cardHeight + 10);
    
    doc.setFillColor('#f7fafc');
    doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(REPORT_COLORS.primary);
    doc.text(stat.platform, x + 10, y + 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(REPORT_COLORS.text);
    doc.text(`Views: ${stat.views.toLocaleString()}`, x + 10, y + 28);
    doc.text(`Likes: ${stat.likes.toLocaleString()}`, x + 70, y + 28);
    doc.text(`Comments: ${stat.comments.toLocaleString()}`, x + 10, y + 40);
    doc.text(`Shares: ${stat.shares.toLocaleString()}`, x + 70, y + 40);
  });
  
  drawFooter(doc, brandName);
};

// SLIDE: Counter Content
export const createCounterContentSlide = (doc: jsPDF, content: CounterContentItem[], brandName: string, pageNum: number, totalPages: number): void => {
  if (content.length === 0) return;
  
  addNewSlide(doc);
  drawHeader(doc, 'COUNTER NARRATIVE CONTENT', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  content.slice(0, 8).forEach((item, i) => {
    const y = startY + i * 18;
    
    // Type badge
    const typeColor = item.type === 'news' ? REPORT_COLORS.accent : 
                      item.type === 'social' ? REPORT_COLORS.positive : REPORT_COLORS.neutral;
    doc.setFillColor(typeColor);
    doc.roundedRect(SLIDE_CONFIG.margin, y, 40, 12, 3, 3, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(8);
    doc.text(item.type.toUpperCase(), SLIDE_CONFIG.margin + 20, y + 8, { align: 'center' });
    
    // Title
    doc.setFontSize(10);
    doc.setTextColor(REPORT_COLORS.text);
    const truncatedTitle = item.title.length > 60 ? item.title.substring(0, 57) + '...' : item.title;
    doc.text(truncatedTitle, SLIDE_CONFIG.margin + 50, y + 8);
    
    // URL
    doc.setFontSize(8);
    doc.setTextColor(REPORT_COLORS.accent);
    const truncatedUrl = item.url.length > 50 ? item.url.substring(0, 47) + '...' : item.url;
    doc.text(truncatedUrl, SLIDE_CONFIG.margin + 50, y + 15);
  });
  
  drawFooter(doc, brandName);
};

// SLIDE: Content Production Summary
export const createContentProductionSlide = (
  doc: jsPDF,
  data: ReportData,
  pageNum: number,
  totalPages: number
): void => {
  if (!data.contentProduction) return;

  addNewSlide(doc);
  drawHeader(doc, 'PRODUKSI & DISTRIBUSI KONTEN', pageNum, totalPages);

  const startY = SLIDE_CONFIG.headerHeight + 15;
  const colGap = 15;
  const colWidth = (SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - colGap) / 2;
  
  // Left Column: News
  let leftY = startY;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(REPORT_COLORS.text);
  doc.text('News', SLIDE_CONFIG.margin, leftY);
  leftY += 10;
  
  doc.setFontSize(11);
  
  // 1. Action
  doc.text('1.', SLIDE_CONFIG.margin, leftY);
  const actionLines = doc.splitTextToSize(data.contentProduction.newsAction, colWidth - 10);
  doc.text(actionLines, SLIDE_CONFIG.margin + 8, leftY);
  leftY += (actionLines.length * 6) + 4;
  
  // 2. Results
  doc.text('2.', SLIDE_CONFIG.margin, leftY);
  doc.text('Results:', SLIDE_CONFIG.margin + 8, leftY);
  leftY += 6;
  
  const newsResults = data.contentProduction.newsResults.split('\n');
  newsResults.forEach((line) => {
    // Check if line starts with a bullet char or just treat as paragraph
    // User requested bullet points for this section in the image
    // Let's assume standard paragraph text, maybe with square bullets
    doc.rect(SLIDE_CONFIG.margin + 10, leftY - 1, 1.5, 1.5, 'F'); // Square bullet
    
    const resLines = doc.splitTextToSize(line, colWidth - 20);
    doc.text(resLines, SLIDE_CONFIG.margin + 15, leftY);
    leftY += (resLines.length * 6) + 3;
  });
  
  // Right Column: Social Media
  let rightY = startY;
  const rightX = SLIDE_CONFIG.margin + colWidth + colGap;
  
  doc.setFontSize(16);
  doc.text('Social Media', rightX, rightY);
  rightY += 10;
  
  doc.setFontSize(11);
  
  // 1. Action
  doc.text('1.', rightX, rightY);
  const socialActionLines = doc.splitTextToSize(data.contentProduction.socialAction, colWidth - 10);
  doc.text(socialActionLines, rightX + 8, rightY);
  rightY += (socialActionLines.length * 6) + 4;
  
  // 2. Results
  doc.text('2.', rightX, rightY);
  doc.text('Results:', rightX + 8, rightY);
  rightY += 6;
  
  const socialResults = data.contentProduction.socialResults.split('\n');
  socialResults.forEach((line) => {
    const resLines = doc.splitTextToSize(line, colWidth - 20);
    doc.text(resLines, rightX + 15, rightY);
    rightY += (resLines.length * 6) + 2;
  });
  rightY += 4;
  
  // 3. Followup
  doc.text('3.', rightX, rightY);
  doc.text('Followup', rightX + 8, rightY);
  rightY += 6;
  
  const followupLines = data.contentProduction.socialFollowup.split('\n');
  followupLines.forEach((line) => {
      // If user manually added 'a. ', respect it. If not, maybe just print text.
      // The template text has "a. Melanjutkan..." implied or user types it.
      // Let's just print the text with indentation.
      const fLines = doc.splitTextToSize(line, colWidth - 20);
      
      // Check if it looks like a list item
      let indent = 15;
      if (!line.match(/^[a-z]\./)) {
          doc.text('a.', rightX + 15, rightY);
          indent = 22;
      }
      
      doc.text(fLines, rightX + indent, rightY);
      rightY += (fLines.length * 6) + 2;
  });

  drawFooter(doc, data.brandName);
};

// SLIDE: News Production Table (2-Column)
export const createNewsProductionSlide = (
  doc: jsPDF,
  links: ProductionLink[],
  title: string,
  brandName: string,
  pageNum: number,
  totalPages: number
): void => {
  if (links.length === 0) return;

  addNewSlide(doc);
  drawHeader(doc, title, pageNum, totalPages);

  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  // Table Header
  const headerY = startY;
  const rowHeight = 10;
  
  // Columns
  const col1Width = 210; // Link column
  const col2Width = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - col1Width; // Media column
  
  doc.setFillColor('#4f46e5'); // Indigo-600 (Blue/Purple)
  doc.rect(SLIDE_CONFIG.margin, headerY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, rowHeight, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  
  doc.text('Link', SLIDE_CONFIG.margin + 5, headerY + 7);
  doc.text('Media', SLIDE_CONFIG.margin + col1Width + 5, headerY + 7);
  
  // Vertical Separator in Header
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(SLIDE_CONFIG.margin + col1Width, headerY, SLIDE_CONFIG.margin + col1Width, headerY + rowHeight);
  
  // Content Rows
  let currentY = headerY + rowHeight;
  doc.setFontSize(9);
  doc.setLineWidth(0.2);
  
  links.forEach((link) => {
    // Determine row height based on wrapped text
    // Max width for link text is col1Width - padding
    // But we want single line if possible, or wrap. 
    // The image shows single lines mostly. Let's wrap if needed.
    
    // Actually, image shows simple table rows.
    const cellHeight = 8;
    
    // Draw row borders
    doc.setDrawColor(0, 0, 0);
    doc.rect(SLIDE_CONFIG.margin, currentY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, cellHeight);
    doc.line(SLIDE_CONFIG.margin + col1Width, currentY, SLIDE_CONFIG.margin + col1Width, currentY + cellHeight);
    
    // Link Text (Blue, Underlined)
    doc.setTextColor('#0000EE');
    const linkText = link.url;
    // Truncate if too long to fit in one line for cleanliness, or just let it print
    // doc.text(linkText, SLIDE_CONFIG.margin + 5, currentY + 6);
    // Let's use splitText to ensure it doesn't overflow, but print only 1 line
    const splitLink = doc.splitTextToSize(linkText, col1Width - 10);
    doc.text(splitLink[0] + (splitLink.length > 1 ? '...' : ''), SLIDE_CONFIG.margin + 5, currentY + 6);
    
    // Underline simulation
    const linkWidth = doc.getTextWidth(splitLink[0] + (splitLink.length > 1 ? '...' : ''));
    doc.setDrawColor(0, 0, 238);
    doc.setLineWidth(0.1);
    doc.line(SLIDE_CONFIG.margin + 5, currentY + 7, SLIDE_CONFIG.margin + 5 + linkWidth, currentY + 7);
    
    // Media Text (Black)
    doc.setTextColor(REPORT_COLORS.text);
    const mediaText = link.platform || '-';
    doc.text(mediaText, SLIDE_CONFIG.margin + col1Width + 5, currentY + 6);
    
    currentY += cellHeight;
  });

  drawFooter(doc, brandName);
};

// SLIDE: Lampiran (Image)
export const createLampiranSlide = (
  doc: jsPDF,
  image: string,
  pageNum: number,
  totalPages: number
): void => {
  addNewSlide(doc);
  
  // Custom Header for Lampiran (Minimalist)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor('#0f172a'); // Dark Navy
  doc.text('LAMPIRAN', SLIDE_CONFIG.margin, 30);
  
  const contentY = 45;
  const contentHeight = SLIDE_CONFIG.height - contentY - 20;
  const contentWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
  
  try {
    // Draw Image (Fit to page)
    // We assume the image is pre-composed or we just fit it.
    // Ideally we keep aspect ratio.
    const imgProps = doc.getImageProperties(image);
    const imgRatio = imgProps.width / imgProps.height;
    const pageRatio = contentWidth / contentHeight;
    
    let drawWidth = contentWidth;
    let drawHeight = contentHeight;
    
    if (imgRatio > pageRatio) {
        // Image is wider than page area
        drawHeight = drawWidth / imgRatio;
    } else {
        // Image is taller than page area
        drawWidth = drawHeight * imgRatio;
    }
    
    const x = SLIDE_CONFIG.margin + (contentWidth - drawWidth) / 2;
    const y = contentY + (contentHeight - drawHeight) / 2;
    
    doc.addImage(image, 'JPEG', x, y, drawWidth, drawHeight);
    
  } catch (e) {
    doc.setFillColor('#f0f0f0');
    doc.rect(SLIDE_CONFIG.margin, contentY, contentWidth, contentHeight, 'F');
    doc.setFontSize(12);
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('Error loading image', SLIDE_CONFIG.width / 2, contentY + contentHeight / 2, { align: 'center' });
  }
};

// SLIDE: Production Links (Grid Layout)
export const createProductionLinksSlide = (
  doc: jsPDF, 
  links: ProductionLink[], 
  title: string, 
  brandName: string, 
  pageNum: number, 
  totalPages: number
): void => {
  if (links.length === 0) return;
  
  addNewSlide(doc);
  drawHeader(doc, title, pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 10;
  const contentWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
  const cols = 4;
  const rows = 10;
  const colWidth = contentWidth / cols;
  const rowHeight = 14; // Fixed row height
  
  // Table Header
  const headerY = startY;
  doc.setFillColor('#14532d'); // Dark Green (Green-900)
  doc.rect(SLIDE_CONFIG.margin, headerY, contentWidth, rowHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  
  // Draw header labels
  for (let c = 0; c < cols; c++) {
    const x = SLIDE_CONFIG.margin + c * colWidth;
    doc.text('Link', x + colWidth / 2, headerY + 9, { align: 'center' });
    // Vertical separator
    if (c > 0) {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(x, headerY, x, headerY + rowHeight);
    }
  }
  
  // Draw Grid Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setLineWidth(0.1);
  
  let currentY = headerY + rowHeight;
  
  // Iterate through grid cells (fixed 40 cells per page)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const x = SLIDE_CONFIG.margin + c * colWidth;
        const y = currentY;
        
        // Draw cell border (Black)
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, colWidth, rowHeight);
        
        if (index < links.length) {
            const link = links[index];
            if (link && link.url) {
              const text = link.url;
              
              // Link text styling (Blue + Underline)
              doc.setTextColor('#0000EE');
              
              // Wrap text
              const splitText = doc.splitTextToSize(text, colWidth - 4);
              // Limit to 3 lines max to avoid overflow
              const linesToDraw = splitText.slice(0, 3);
              
              doc.text(linesToDraw, x + 2, y + 4);
            }
        }
    }
    currentY += rowHeight;
  }
  
  drawFooter(doc, brandName);
};
