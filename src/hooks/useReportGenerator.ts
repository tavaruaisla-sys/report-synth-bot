import { useState, useMemo } from 'react';
import { ReportData, ReportFormData, defaultReportFormData, SocialMediaStat, CounterContentItem, ProductionLink } from '@/lib/pdf/types';
import { ReportPDFGenerator, fileToBase64 } from '@/lib/pdf/ReportPDFGenerator';
import { SearchResult, SearchStats } from '@/lib/api/google-search';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseReportGeneratorProps {
  keywords: string[];
  negativeKeywords: string[];
  searchResults: SearchResult[];
  searchStats: SearchStats | null;
}

export function useReportGenerator({ 
  keywords, 
  negativeKeywords, 
  searchResults,
  searchStats 
}: UseReportGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [isGeneratingNewsDesc, setIsGeneratingNewsDesc] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    ...defaultReportFormData,
    brandName: keywords[0] || '',
  });
  const [aiSummary, setAiSummary] = useState<string>('');
  const [screenshotPreviews, setScreenshotPreviews] = useState<{
    before?: string;
    after?: string;
  }>({});

  // Build preview data for the preview component
  const previewData: ReportData = useMemo(() => ({
    reportTitle: formData.reportTitle,
    brandName: formData.brandName || 'Brand Name',
    updateDate: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    keywords,
    negativeKeywords,
    searchResults: searchResults.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
      source: r.source,
      sentiment: r.sentiment as 'positive' | 'negative' | 'neutral',
      matchedKeywords: r.matchedNegativeKeywords,
    })),
    sentimentStats: searchStats || {
      totalResults: 0,
      negativeFound: 0,
      positiveFound: 0,
      neutralFound: 0,
      sentimentScore: 100,
    },
    newsStatus: formData.newsStatus,
    newsDescription: formData.newsDescription,
    socialMediaStatus: formData.socialMediaStatus,
    socialMediaDescription: formData.socialMediaDescription,
    serpScreenshotBefore: screenshotPreviews.before,
    serpScreenshotAfter: screenshotPreviews.after,
    serpCaptions: {
      before: formData.serpCaptionBefore,
      after: formData.serpCaptionAfter,
    },
    aiSummary: aiSummary || undefined,
    socialMediaStats: formData.socialMediaStats,
    counterContent: formData.counterContent,
    newsProduction: formData.newsProduction,
    socialMediaProduction: formData.socialMediaProduction,
  }), [formData, keywords, negativeKeywords, searchResults, searchStats, aiSummary, screenshotPreviews]);

  // Handle screenshot preview updates
  const updateScreenshotPreview = async (file: File, type: 'before' | 'after') => {
    const base64 = await fileToBase64(file);
    setScreenshotPreviews(prev => ({
      ...prev,
      [type]: base64,
    }));
  };

  const updateFormData = (updates: Partial<ReportFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addSocialMediaStat = (stat: SocialMediaStat) => {
    setFormData(prev => ({
      ...prev,
      socialMediaStats: [...prev.socialMediaStats, stat],
    }));
  };

  const removeSocialMediaStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMediaStats: prev.socialMediaStats.filter((_, i) => i !== index),
    }));
  };

  const addCounterContent = (content: CounterContentItem) => {
    setFormData(prev => ({
      ...prev,
      counterContent: [...prev.counterContent, content],
    }));
  };

  const removeCounterContent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      counterContent: prev.counterContent.filter((_, i) => i !== index),
    }));
  };

  const addProductionLink = (link: ProductionLink, type: 'news' | 'social') => {
    const key = type === 'news' ? 'newsProduction' : 'socialMediaProduction';
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], link],
    }));
  };

  const removeProductionLink = (index: number, type: 'news' | 'social') => {
    const key = type === 'news' ? 'newsProduction' : 'socialMediaProduction';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const generateNewsDescription = async (googleScreenshots?: string[]) => {
    if (searchResults.length === 0 && (!googleScreenshots || googleScreenshots.length === 0)) {
      toast({
        title: "Error",
        description: "Tidak ada hasil pencarian atau screenshot untuk dianalisis",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingNewsDesc(true);

    try {
      const resultsContext = searchResults.slice(0, 10).map(r => 
        `- ${r.title}: ${r.description} (${r.sentiment})`
      ).join('\n');

      const { data, error } = await supabase.functions.invoke('generate-news-description', {
        body: {
          keywords,
          negativeKeywords,
          searchResults: resultsContext,
          stats: searchStats,
          brandName: formData.brandName,
          googleScreenshots: googleScreenshots || [],
        },
      });

      if (error) throw error;

      if (data?.description) {
        setFormData(prev => ({ ...prev, newsDescription: data.description }));
        toast({
          title: "Deskripsi Generated",
          description: googleScreenshots?.length 
            ? `Deskripsi di-generate dengan ${googleScreenshots.length} screenshot Google`
            : "Deskripsi pemberitaan berhasil di-generate oleh AI",
        });
      }
    } catch (error) {
      console.error('Generate news description error:', error);
      toast({
        title: "Error",
        description: "Gagal generate deskripsi. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNewsDesc(false);
    }
  };

  const generateAiSummary = async () => {
    if (searchResults.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada hasil pencarian untuk dianalisis",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAiSummary(true);

    try {
      const resultsContext = searchResults.slice(0, 10).map(r => 
        `- ${r.title}: ${r.description} (${r.sentiment})`
      ).join('\n');

      const { data, error } = await supabase.functions.invoke('ai-summary', {
        body: {
          keywords,
          negativeKeywords,
          searchResults: resultsContext,
          stats: searchStats,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        setAiSummary(data.summary);
        toast({
          title: "AI Summary Generated",
          description: "Ringkasan AI berhasil dibuat",
        });
      }
    } catch (error) {
      console.error('AI Summary error:', error);
      toast({
        title: "Error",
        description: "Gagal generate AI summary. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  const generateReport = async () => {
    if (!formData.brandName) {
      toast({
        title: "Error",
        description: "Nama brand harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Process screenshots if they are files
      let screenshotBefore: string | undefined;
      let screenshotAfter: string | undefined;

      if (formData.serpScreenshotBefore instanceof File) {
        screenshotBefore = await fileToBase64(formData.serpScreenshotBefore);
      } else if (typeof formData.serpScreenshotBefore === 'string') {
        screenshotBefore = formData.serpScreenshotBefore;
      }

      if (formData.serpScreenshotAfter instanceof File) {
        screenshotAfter = await fileToBase64(formData.serpScreenshotAfter);
      } else if (typeof formData.serpScreenshotAfter === 'string') {
        screenshotAfter = formData.serpScreenshotAfter;
      }

      // Build report data
      const reportData: ReportData = {
        reportTitle: formData.reportTitle,
        brandName: formData.brandName,
        updateDate: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        keywords,
        negativeKeywords,
        searchResults: searchResults.map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.description,
          source: r.source,
          sentiment: r.sentiment as 'positive' | 'negative' | 'neutral',
          matchedKeywords: r.matchedNegativeKeywords,
        })),
        sentimentStats: searchStats || {
          totalResults: 0,
          negativeFound: 0,
          positiveFound: 0,
          neutralFound: 0,
          sentimentScore: 100,
        },
        newsStatus: formData.newsStatus,
        newsDescription: formData.newsDescription,
        socialMediaStatus: formData.socialMediaStatus,
        socialMediaDescription: formData.socialMediaDescription,
        serpScreenshotBefore: screenshotBefore,
        serpScreenshotAfter: screenshotAfter,
        serpCaptions: {
          before: formData.serpCaptionBefore,
          after: formData.serpCaptionAfter,
        },
        aiSummary: aiSummary || undefined,
        socialMediaStats: formData.socialMediaStats,
        counterContent: formData.counterContent,
        newsProduction: formData.newsProduction,
        socialMediaProduction: formData.socialMediaProduction,
      };

      // Generate and download PDF
      const generator = new ReportPDFGenerator(reportData);
      await generator.generate();
      generator.download();

      toast({
        title: "Report Generated",
        description: "PDF report berhasil di-download",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: "Gagal generate report. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    formData,
    updateFormData,
    addSocialMediaStat,
    removeSocialMediaStat,
    addCounterContent,
    removeCounterContent,
    addProductionLink,
    removeProductionLink,
    aiSummary,
    generateAiSummary,
    isGeneratingAiSummary,
    generateNewsDescription,
    isGeneratingNewsDesc,
    generateReport,
    isGenerating,
    previewData,
    updateScreenshotPreview,
  };
}
