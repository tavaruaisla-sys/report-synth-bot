// Report data types for PDF generation

export interface KeywordStat {
  keyword: string;
  searchBefore: number;
  newsBefore: number;
  searchCurrent: number;
  newsCurrent: number;
}

export interface ProductionStats {
  views: string;
  likes: string;
  comments: string;
  saved: string;
  shares: string;
}

export interface ReportData {
  // Basic Info
  reportTitle: string;
  brandName: string;
  updateDate: string;
  
  // Analysis Data (from existing features)
  keywords: string[];
  negativeKeywords: string[];
  keywordStats: KeywordStat[]; // New field for Slide 9
  searchResults: SearchResultItem[];
  sentimentStats: SentimentStats;
  
  // Executive Summary Data
  newsBulletPoints: string[];
  socialMediaAccountStatusBefore: string;
  socialMediaAccountStatusAfter: string;
  socialMediaAccountStatusNote: string;
  socialMediaCounterTotalViews: string;
  socialMediaCounterTotalEngagement: string;
  
  // SERP Screenshots (manual upload)
  serpScreenshotBefore?: string[]; // base64 or URL array
  serpScreenshotBefore2?: string[]; // base64 or URL array (Slide 4b)
  serpScreenshotAfter?: string[]; // base64 or URL array
  serpScreenshotAfter2?: string[]; // base64 or URL array (Slide 5b)
  serpCaptions?: {
    before: string;
    before2?: string;
    after: string;
    after2?: string;
  };
  
  // AI Summary
  aiSummary?: string;
  aiSummarySources?: string[];
  
  // Social Media Stats (manual input)
  socialMediaStats: SocialMediaStat[];
  productionStats: ProductionStats; // New field for Slide 9
  
  // Counter Content (manual input)
  counterContent: CounterContentItem[];
  
  // Production Links (News & Social Media)
  newsProduction: ProductionLink[];
  socialMediaProduction: ProductionLink[];
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  matchedKeywords?: string[];
}

export interface SentimentStats {
  totalResults: number;
  negativeFound: number;
  positiveFound: number;
  neutralFound: number;
  sentimentScore: number;
}

export interface SocialMediaStat {
  platform: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface CounterContentItem {
  title: string;
  url: string;
  type: 'news' | 'social' | 'blog';
  publishDate?: string;
}

export interface ProductionLink {
  title: string;
  url: string;
  thumbnail?: string;
  date?: string;
  platform?: string;
}

// Form input types for the modal
export interface ReportFormData {
  reportTitle: string;
  brandName: string;
  
  // Executive Summary inputs
  newsBulletPoints: string[];
  socialMediaAccountStatusBefore: string;
  socialMediaAccountStatusAfter: string;
  socialMediaAccountStatusNote: string;
  socialMediaCounterTotalViews: string;
  socialMediaCounterTotalEngagement: string;
  
  // Screenshots (file or URL)
  serpScreenshotBefore?: (File | string)[];
  serpScreenshotBefore2?: (File | string)[];
  serpScreenshotAfter?: (File | string)[];
  serpScreenshotAfter2?: (File | string)[];
  serpCaptionBefore: string;
  serpCaptionBefore2?: string;
  serpCaptionAfter: string;
  serpCaptionAfter2?: string;
  
  // Social Media Stats
  socialMediaStats: SocialMediaStat[];
  
  // Slide 9 Data
  keywordStats?: KeywordStat[];
  productionStats?: ProductionStats;

  // Counter Content
  counterContent: CounterContentItem[];
  
  // Production Links
  newsProduction: ProductionLink[];
  socialMediaProduction: ProductionLink[];
  
  // AI Summary toggle
  generateAiSummary: boolean;
}

// Default form values
export const defaultReportFormData: ReportFormData = {
  reportTitle: 'RP REPORT',
  brandName: '',
  newsBulletPoints: [],
  socialMediaAccountStatusBefore: '',
  socialMediaAccountStatusAfter: '',
  socialMediaAccountStatusNote: '',
  socialMediaCounterTotalViews: '',
  socialMediaCounterTotalEngagement: '',
  serpScreenshotBefore: [],
  serpScreenshotBefore2: [],
  serpScreenshotAfter: [],
  serpScreenshotAfter2: [],
  serpCaptionBefore: 'Before: Hasil pencarian sebelum optimasi',
  serpCaptionBefore2: 'Before: Lanjutan hasil pencarian sebelum optimasi',
  serpCaptionAfter: 'After: Hasil pencarian setelah optimasi',
  serpCaptionAfter2: 'After: Lanjutan hasil pencarian setelah optimasi',
  socialMediaStats: [],
  keywordStats: [],
  productionStats: { views: '0', likes: '0', comments: '0', saved: '0', shares: '0' },
  counterContent: [],
  newsProduction: [],
  socialMediaProduction: [],
  generateAiSummary: true,
};

// Color theme matching the PDF template (Navy Blue theme)
export const REPORT_COLORS = {
  primary: '#1a365d', // Navy blue
  secondary: '#2d3748', // Dark gray
  accent: '#3182ce', // Blue accent
  positive: '#38a169', // Green
  negative: '#e53e3e', // Red
  neutral: '#718096', // Gray
  background: '#ffffff',
  text: '#1a202c',
  textLight: '#718096',
};

// Slide dimensions (16:9 aspect ratio for PDF)
export const SLIDE_CONFIG = {
  width: 297, // A4 landscape width in mm
  height: 210, // A4 landscape height in mm
  margin: 15,
  headerHeight: 25,
  footerHeight: 15,
};
