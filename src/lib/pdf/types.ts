// Report data types for PDF generation

export interface ReportData {
  // Basic Info
  reportTitle: string;
  brandName: string;
  updateDate: string;
  
  // Analysis Data (from existing features)
  keywords: string[];
  negativeKeywords: string[];
  searchResults: SearchResultItem[];
  sentimentStats: SentimentStats;
  
  // Executive Summary Data
  newsStatus: 'recovery' | 'monitoring' | 'crisis';
  newsDescription: string;
  socialMediaStatus: 'positive' | 'neutral' | 'negative';
  socialMediaDescription: string;
  
  // SERP Screenshots (manual upload)
  serpScreenshotBefore?: string; // base64 or URL
  serpScreenshotAfter?: string; // base64 or URL
  serpCaptions?: {
    before: string;
    after: string;
  };
  
  // AI Summary
  aiSummary?: string;
  aiSummarySources?: string[];
  
  // Social Media Stats (manual input)
  socialMediaStats: SocialMediaStat[];
  
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
  newsStatus: 'recovery' | 'monitoring' | 'crisis';
  newsDescription: string;
  socialMediaStatus: 'positive' | 'neutral' | 'negative';
  socialMediaDescription: string;
  
  // Screenshots (file or URL)
  serpScreenshotBefore?: File | string;
  serpScreenshotAfter?: File | string;
  serpCaptionBefore: string;
  serpCaptionAfter: string;
  
  // Social Media Stats
  socialMediaStats: SocialMediaStat[];
  
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
  newsStatus: 'monitoring',
  newsDescription: '',
  socialMediaStatus: 'neutral',
  socialMediaDescription: '',
  serpCaptionBefore: 'Before: Hasil pencarian sebelum optimasi',
  serpCaptionAfter: 'After: Hasil pencarian setelah optimasi',
  socialMediaStats: [],
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
