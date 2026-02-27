import jsPDF from 'jspdf';
import { 
  ReportData, 
  SLIDE_CONFIG 
} from './types';
import {
  createCoverSlide,
  createExecutiveSummarySlide,
  createSectionDivider,
  createScreenshotSlide,
  createAfterSlide,
  createAppendixSlide,
  createDataSummarySlide,
  createSocialMediaStatsSlide,
  createCounterContentSlide,
  createProductionLinksSlide,
  createNewsProductionSlide,
  createLampiranSlide,
  createContentProductionSlide,
} from './SlideTemplates';

export class ReportPDFGenerator {
  private doc: jsPDF;
  private data: ReportData;
  private totalPages: number = 0;
  
  constructor(data: ReportData) {
    this.data = data;
    this.doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [SLIDE_CONFIG.width, SLIDE_CONFIG.height],
    });
    
    // Calculate total pages
    this.totalPages = this.calculateTotalPages();
  }
  
  private calculateTotalPages(): number {
    let pages = 1; // Cover
    pages += 1; // Executive Summary
    pages += 1; // Results divider
    pages += 2; // Before/After screenshots
    pages += 2; // Before 2/After 2 screenshots
    pages += 1; // Appendix divider
    pages += 1; // Data Summary
    
    if (this.data.socialMediaStats.length > 0) pages += 1;
    if (this.data.counterContent.length > 0) pages += 1;
    
    // Content Production Summary (Slide 10)
    if (this.data.contentProduction) pages += 1;

    // Calculate pages for production links (grid layout 4x10 = 40 items per page)
    const linksPerPage = 40;
    
    // News Production (New Table Layout: ~12-14 items per page depending on wrapping)
    const newsPerPage = 14; 
    if (this.data.newsProduction.length > 0) {
      pages += Math.ceil(this.data.newsProduction.length / newsPerPage);
    }
    
    // Social Media Production (Grid Layout: 40 items per page)
    if (this.data.socialMediaProduction.length > 0) {
      pages += Math.ceil(this.data.socialMediaProduction.length / linksPerPage);
    }
    
    // Lampiran Slides
    if (this.data.lampiranImages.length > 0) {
      pages += this.data.lampiranImages.length;
    }
    
    return pages;
  }
  
  public async generate(): Promise<Blob> {
    let currentPage = 1;
    
    // SLIDE 1: Cover
    createCoverSlide(this.doc, this.data);
    
    // SLIDE 2: Executive Summary
    currentPage++;
    createExecutiveSummarySlide(this.doc, this.data, currentPage, this.totalPages);
    
    // SLIDE 3: Results Divider
    createSectionDivider(this.doc, 'RESULTS', 'Detailed search analysis and findings');
    currentPage++;
    
    // SLIDE 4: Before Screenshot
    currentPage++;
    createScreenshotSlide(
      this.doc, 
      this.data.serpScreenshotBefore, 
      this.data.serpCaptions?.before || 'Before optimization',
      'before',
      currentPage, 
      this.totalPages
    );
    
    // SLIDE 5: After Screenshot
    currentPage++;
    createAfterSlide(
      this.doc, 
      this.data.serpScreenshotAfter, 
      `AFTER - ${this.data.updateDate.toUpperCase()}`,
      currentPage, 
      this.totalPages
    );

    // SLIDE 6: AI Result - Before
    currentPage++;
    createScreenshotSlide(
      this.doc, 
      this.data.serpScreenshotBefore2, 
      this.data.serpCaptions?.before2 || 'AI Result - Before',
      'before',
      currentPage, 
      this.totalPages
    );
    
    // SLIDE 7: AI Result - After
    currentPage++;
    createAfterSlide(
      this.doc, 
      this.data.serpScreenshotAfter2, 
      `AI RESULT - AFTER`,
      currentPage, 
      this.totalPages
    );
    
    // SLIDE 8: Appendix Divider
    currentPage++;
    createAppendixSlide(this.doc, currentPage, this.totalPages);

    // SLIDE 9: Data Summary
    currentPage++;
    createDataSummarySlide(this.doc, this.data, currentPage, this.totalPages);
    
    // Optional slides based on available data
    
    // Social Media Stats
    if (this.data.socialMediaStats.length > 0) {
      currentPage++;
      createSocialMediaStatsSlide(
        this.doc, 
        this.data.socialMediaStats, 
        this.data.brandName,
        currentPage, 
        this.totalPages
      );
    }
    
    // Counter Content
    if (this.data.counterContent.length > 0) {
      currentPage++;
      createCounterContentSlide(
        this.doc, 
        this.data.counterContent, 
        this.data.brandName,
        currentPage, 
        this.totalPages
      );
    }
    
    // Content Production Summary (Slide 10)
    if (this.data.contentProduction) {
      currentPage++;
      createContentProductionSlide(this.doc, this.data, currentPage, this.totalPages);
    }

    // News Production Links
    if (this.data.newsProduction.length > 0) {
      const itemsPerPage = 14; // Matches the table layout height
      for (let i = 0; i < this.data.newsProduction.length; i += itemsPerPage) {
        currentPage++;
        const chunk = this.data.newsProduction.slice(i, i + itemsPerPage);
        createNewsProductionSlide(
          this.doc, 
          chunk, 
          i === 0 ? 'PRODUCTION RESULTS - NEWS' : 'PRODUCTION RESULTS - NEWS (Cont.)',
          this.data.brandName,
          currentPage, 
          this.totalPages
        );
      }
    }
    
    // Social Media Production Links
    if (this.data.socialMediaProduction.length > 0) {
      const itemsPerPage = 40;
      for (let i = 0; i < this.data.socialMediaProduction.length; i += itemsPerPage) {
        currentPage++;
        const chunk = this.data.socialMediaProduction.slice(i, i + itemsPerPage);
        createProductionLinksSlide(
          this.doc, 
          chunk, 
          i === 0 ? 'SOCIAL MEDIA PRODUCTION LINKS' : 'SOCIAL MEDIA PRODUCTION LINKS (Cont.)',
          this.data.brandName,
          currentPage, 
          this.totalPages
        );
      }
    }
    
    // Lampiran Slides
    if (this.data.lampiranImages.length > 0) {
      this.data.lampiranImages.forEach((img) => {
        currentPage++;
        createLampiranSlide(this.doc, img, currentPage, this.totalPages);
      });
    }
    
    return this.doc.output('blob');
  }
  
  public download(filename?: string): void {
    const name = filename || `${this.data.brandName}_RP_Report_${this.data.updateDate}.pdf`;
    this.doc.save(name);
  }
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to generate report and download
export const generateAndDownloadReport = async (data: ReportData): Promise<void> => {
  const generator = new ReportPDFGenerator(data);
  await generator.generate();
  generator.download();
};
