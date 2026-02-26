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

// SLIDE 6: AI Summary
export const createAISummarySlide = (doc: jsPDF, data: ReportData, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  drawHeader(doc, 'AI ANALYSIS SUMMARY', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  if (data.aiSummary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(REPORT_COLORS.text);
    
    const maxWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
    const lines = doc.splitTextToSize(data.aiSummary, maxWidth);
    doc.text(lines, SLIDE_CONFIG.margin, startY);
    
    // Sources
    if (data.aiSummarySources && data.aiSummarySources.length > 0) {
      const sourcesY = SLIDE_CONFIG.height - SLIDE_CONFIG.footerHeight - 40;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(REPORT_COLORS.primary);
      doc.text('Sources:', SLIDE_CONFIG.margin, sourcesY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(REPORT_COLORS.accent);
      data.aiSummarySources.slice(0, 5).forEach((source, i) => {
        const truncatedSource = source.length > 80 ? source.substring(0, 77) + '...' : source;
        doc.text(`${i + 1}. ${truncatedSource}`, SLIDE_CONFIG.margin, sourcesY + 10 + i * 6);
      });
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(REPORT_COLORS.textLight);
    doc.text('AI summary not generated', SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2, { align: 'center' });
  }
  
  drawFooter(doc, data.brandName);
};

// SLIDE 7: Data Summary Table
export const createDataSummarySlide = (doc: jsPDF, data: ReportData, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  drawHeader(doc, 'DATA SUMMARY', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  // Keywords analysis table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('Keyword Analysis', SLIDE_CONFIG.margin, startY);
  
  // Simple table for keywords
  let tableY = startY + 10;
  doc.setFillColor(REPORT_COLORS.primary);
  doc.rect(SLIDE_CONFIG.margin, tableY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  doc.text('Keyword', SLIDE_CONFIG.margin + 5, tableY + 7);
  doc.text('Type', SLIDE_CONFIG.margin + 100, tableY + 7);
  doc.text('Results Found', SLIDE_CONFIG.margin + 160, tableY + 7);
  
  tableY += 10;
  doc.setTextColor(REPORT_COLORS.text);
  doc.setFont('helvetica', 'normal');
  
  // Brand keywords
  data.keywords.slice(0, 5).forEach((keyword, i) => {
    const y = tableY + (i * 8) + 6;
    if (i % 2 === 0) {
      doc.setFillColor('#f7fafc');
      doc.rect(SLIDE_CONFIG.margin, tableY + (i * 8), SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 8, 'F');
    }
    doc.setTextColor(REPORT_COLORS.text);
    doc.text(keyword, SLIDE_CONFIG.margin + 5, y);
    doc.setTextColor(REPORT_COLORS.positive);
    doc.text('Brand', SLIDE_CONFIG.margin + 100, y);
    doc.setTextColor(REPORT_COLORS.text);
    doc.text('-', SLIDE_CONFIG.margin + 160, y);
  });
  
  // Negative keywords
  const negStartIdx = Math.min(data.keywords.length, 5);
  data.negativeKeywords.slice(0, 5).forEach((keyword, i) => {
    const idx = negStartIdx + i;
    const y = tableY + (idx * 8) + 6;
    if (idx % 2 === 0) {
      doc.setFillColor('#f7fafc');
      doc.rect(SLIDE_CONFIG.margin, tableY + (idx * 8), SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, 8, 'F');
    }
    doc.setTextColor(REPORT_COLORS.text);
    doc.text(keyword, SLIDE_CONFIG.margin + 5, y);
    doc.setTextColor(REPORT_COLORS.negative);
    doc.text('Negative', SLIDE_CONFIG.margin + 100, y);
    doc.setTextColor(REPORT_COLORS.text);
    doc.text('-', SLIDE_CONFIG.margin + 160, y);
  });
  
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

// SLIDE: Production Links
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
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  links.slice(0, 10).forEach((link, i) => {
    const y = startY + i * 14;
    
    doc.setTextColor(REPORT_COLORS.text);
    const truncatedTitle = link.title.length > 50 ? link.title.substring(0, 47) + '...' : link.title;
    doc.text(`${i + 1}. ${truncatedTitle}`, SLIDE_CONFIG.margin, y + 5);
    
    doc.setFontSize(8);
    doc.setTextColor(REPORT_COLORS.accent);
    const truncatedUrl = link.url.length > 70 ? link.url.substring(0, 67) + '...' : link.url;
    doc.text(truncatedUrl, SLIDE_CONFIG.margin + 10, y + 12);
    doc.setFontSize(10);
  });
  
  drawFooter(doc, brandName);
};
