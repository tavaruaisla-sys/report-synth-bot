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
  // Background gradient effect
  doc.setFillColor(REPORT_COLORS.primary);
  doc.rect(0, 0, SLIDE_CONFIG.width, SLIDE_CONFIG.height, 'F');
  
  // Decorative accent bar
  doc.setFillColor(REPORT_COLORS.accent);
  doc.rect(0, SLIDE_CONFIG.height * 0.4, SLIDE_CONFIG.width, 8, 'F');
  
  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#ffffff');
  doc.text(data.brandName.toUpperCase(), SLIDE_CONFIG.width / 2, 60, { align: 'center' });
  
  // Report title
  doc.setFontSize(48);
  doc.text(data.reportTitle, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2, { align: 'center' });
  
  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('Brand Monitoring & Reputation Report', SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height / 2 + 20, { align: 'center' });
  
  // Date
  doc.setFontSize(12);
  doc.text(`Update: ${data.updateDate}`, SLIDE_CONFIG.width / 2, SLIDE_CONFIG.height - 40, { align: 'center' });
};

// SLIDE 2: Executive Summary
export const createExecutiveSummarySlide = (doc: jsPDF, data: ReportData, pageNum: number, totalPages: number): void => {
  addNewSlide(doc);
  drawHeader(doc, 'EXECUTIVE SUMMARY', pageNum, totalPages);
  
  const startY = SLIDE_CONFIG.headerHeight + 15;
  const colWidth = (SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 3) / 2;
  
  // News/Pemberitaan Section
  doc.setFillColor('#f7fafc');
  doc.rect(SLIDE_CONFIG.margin, startY, colWidth, 70, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('NEWS / PEMBERITAAN', SLIDE_CONFIG.margin + 10, startY + 15);
  
  // Status badge
  const statusColor = data.newsStatus === 'recovery' ? REPORT_COLORS.positive : 
                      data.newsStatus === 'crisis' ? REPORT_COLORS.negative : REPORT_COLORS.neutral;
  doc.setFillColor(statusColor);
  doc.roundedRect(SLIDE_CONFIG.margin + 10, startY + 22, 60, 12, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  doc.text(data.newsStatus.toUpperCase(), SLIDE_CONFIG.margin + 40, startY + 30, { align: 'center' });
  
  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(REPORT_COLORS.text);
  const newsLines = doc.splitTextToSize(data.newsDescription || 'No description provided', colWidth - 20);
  doc.text(newsLines, SLIDE_CONFIG.margin + 10, startY + 45);
  
  // Social Media Section
  const socialX = SLIDE_CONFIG.margin * 2 + colWidth;
  doc.setFillColor('#f7fafc');
  doc.rect(socialX, startY, colWidth, 70, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('SOCIAL MEDIA', socialX + 10, startY + 15);
  
  // Status badge
  const socialStatusColor = data.socialMediaStatus === 'positive' ? REPORT_COLORS.positive : 
                            data.socialMediaStatus === 'negative' ? REPORT_COLORS.negative : REPORT_COLORS.neutral;
  doc.setFillColor(socialStatusColor);
  doc.roundedRect(socialX + 10, startY + 22, 60, 12, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  doc.text(data.socialMediaStatus.toUpperCase(), socialX + 40, startY + 30, { align: 'center' });
  
  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(REPORT_COLORS.text);
  const socialLines = doc.splitTextToSize(data.socialMediaDescription || 'No description provided', colWidth - 20);
  doc.text(socialLines, socialX + 10, startY + 45);
  
  // Sentiment Stats
  const statsY = startY + 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(REPORT_COLORS.primary);
  doc.text('SENTIMENT ANALYSIS OVERVIEW', SLIDE_CONFIG.margin, statsY);
  
  // Stats cards
  const cardWidth = (SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2 - 30) / 4;
  const stats = [
    { label: 'Total Results', value: data.sentimentStats.totalResults.toString(), color: REPORT_COLORS.accent },
    { label: 'Negative', value: data.sentimentStats.negativeFound.toString(), color: REPORT_COLORS.negative },
    { label: 'Positive', value: data.sentimentStats.positiveFound.toString(), color: REPORT_COLORS.positive },
    { label: 'Sentiment Score', value: `${data.sentimentStats.sentimentScore}%`, color: REPORT_COLORS.primary },
  ];
  
  stats.forEach((stat, i) => {
    const x = SLIDE_CONFIG.margin + i * (cardWidth + 10);
    doc.setFillColor(stat.color);
    doc.roundedRect(x, statsY + 8, cardWidth, 45, 4, 4, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, x + cardWidth / 2, statsY + 28, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(stat.label, x + cardWidth / 2, statsY + 42, { align: 'center' });
  });
  
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
  imageData: string | undefined, 
  caption: string, 
  type: 'before' | 'after',
  pageNum: number, 
  totalPages: number
): void => {
  addNewSlide(doc);
  drawHeader(doc, `GOOGLE SEARCH - ${type.toUpperCase()}`, pageNum, totalPages);
  
  const contentY = SLIDE_CONFIG.headerHeight + 10;
  const contentHeight = SLIDE_CONFIG.height - SLIDE_CONFIG.headerHeight - SLIDE_CONFIG.footerHeight - 30;
  
  if (imageData) {
    try {
      const imgWidth = SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2;
      const imgHeight = contentHeight - 20;
      doc.addImage(imageData, 'JPEG', SLIDE_CONFIG.margin, contentY, imgWidth, imgHeight);
    } catch (e) {
      // Placeholder if image fails
      doc.setFillColor('#f0f0f0');
      doc.rect(SLIDE_CONFIG.margin, contentY, SLIDE_CONFIG.width - SLIDE_CONFIG.margin * 2, contentHeight - 20, 'F');
      doc.setFontSize(12);
      doc.setTextColor(REPORT_COLORS.textLight);
      doc.text('Screenshot not available', SLIDE_CONFIG.width / 2, contentY + contentHeight / 2, { align: 'center' });
    }
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
