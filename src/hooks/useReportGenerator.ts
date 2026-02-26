import { useState, useMemo } from 'react';
import { ReportData, ReportFormData, defaultReportFormData, SocialMediaStat, CounterContentItem, ProductionLink } from '@/lib/pdf/types';
import { ReportPDFGenerator, fileToBase64 } from '@/lib/pdf/ReportPDFGenerator';
import { SearchResult, SearchStats } from '@/lib/api/google-search';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { reportService, DBReport } from '@/services/reportService';

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
  const [isSaving, setIsSaving] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
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
    newsBulletPoints: formData.newsBulletPoints,
    socialMediaAccountStatusBefore: formData.socialMediaAccountStatusBefore,
    socialMediaAccountStatusAfter: formData.socialMediaAccountStatusAfter,
    socialMediaAccountStatusNote: formData.socialMediaAccountStatusNote,
    socialMediaCounterTotalViews: formData.socialMediaCounterTotalViews,
    socialMediaCounterTotalEngagement: formData.socialMediaCounterTotalEngagement,
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

  const saveReport = async () => {
    if (!formData.brandName) {
      toast({
        title: "Error",
        description: "Nama brand harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Handle image uploads if they are Files
      let screenshotBeforeUrl = previewData.serpScreenshotBefore;
      if (formData.serpScreenshotBefore instanceof File) {
        const url = await reportService.uploadImage(formData.serpScreenshotBefore);
        if (url) screenshotBeforeUrl = url;
      }

      let screenshotAfterUrl = previewData.serpScreenshotAfter;
      if (formData.serpScreenshotAfter instanceof File) {
        const url = await reportService.uploadImage(formData.serpScreenshotAfter);
        if (url) screenshotAfterUrl = url;
      }

      // Prepare data to save
      const reportDataToSave: ReportData = {
        ...previewData,
        serpScreenshotBefore: screenshotBeforeUrl,
        serpScreenshotAfter: screenshotAfterUrl,
      };

      let savedReport: DBReport | null = null;
      
      if (currentReportId) {
        savedReport = await reportService.updateReport(currentReportId, reportDataToSave);
      } else {
        savedReport = await reportService.createReport(reportDataToSave);
      }

      if (savedReport) {
        setCurrentReportId(savedReport.id);
        
        // Update local state with URLs if images were uploaded
        if (screenshotBeforeUrl !== previewData.serpScreenshotBefore || screenshotAfterUrl !== previewData.serpScreenshotAfter) {
            setFormData(prev => ({
                ...prev,
                serpScreenshotBefore: screenshotBeforeUrl || prev.serpScreenshotBefore,
                serpScreenshotAfter: screenshotAfterUrl || prev.serpScreenshotAfter
            }));
            setScreenshotPreviews({
                before: screenshotBeforeUrl,
                after: screenshotAfterUrl
            });
        }

        toast({
          title: "Success",
          description: currentReportId ? "Report updated successfully" : "Report saved successfully",
        });
      } else {
        throw new Error("Failed to save report");
      }
    } catch (error) {
      console.error('Save report error:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan report. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadReport = (report: DBReport) => {
    const data = report.data;
    setCurrentReportId(report.id);
    
    // Populate form data
    setFormData({
      ...defaultReportFormData,
      reportTitle: data.reportTitle,
      brandName: data.brandName,
      newsBulletPoints: data.newsBulletPoints || [],
      socialMediaAccountStatusBefore: data.socialMediaAccountStatusBefore || '',
      socialMediaAccountStatusAfter: data.socialMediaAccountStatusAfter || '',
      socialMediaAccountStatusNote: data.socialMediaAccountStatusNote || '',
      socialMediaCounterTotalViews: data.socialMediaCounterTotalViews || '',
      socialMediaCounterTotalEngagement: data.socialMediaCounterTotalEngagement || '',
      serpCaptionBefore: data.serpCaptions?.before || defaultReportFormData.serpCaptionBefore,
      serpCaptionAfter: data.serpCaptions?.after || defaultReportFormData.serpCaptionAfter,
      serpScreenshotBefore: data.serpScreenshotBefore,
      serpScreenshotAfter: data.serpScreenshotAfter,
      socialMediaStats: data.socialMediaStats || [],
      counterContent: data.counterContent || [],
      newsProduction: data.newsProduction || [],
      socialMediaProduction: data.socialMediaProduction || [],
      generateAiSummary: !!data.aiSummary,
    });
    
    setAiSummary(data.aiSummary || '');
    
    setScreenshotPreviews({
      before: data.serpScreenshotBefore,
      after: data.serpScreenshotAfter,
    });
    
    toast({
      title: "Report Loaded",
      description: `Report "${report.title}" berhasil dimuat`,
    });
  };

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
        setFormData(prev => ({ 
          ...prev, 
          newsBulletPoints: (data.description as string).split('\n').filter(line => line.trim().length > 0) 
        }));
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
        newsBulletPoints: formData.newsBulletPoints,
        socialMediaAccountStatusBefore: formData.socialMediaAccountStatusBefore,
        socialMediaAccountStatusAfter: formData.socialMediaAccountStatusAfter,
        socialMediaAccountStatusNote: formData.socialMediaAccountStatusNote,
        socialMediaCounterTotalViews: formData.socialMediaCounterTotalViews,
        socialMediaCounterTotalEngagement: formData.socialMediaCounterTotalEngagement,
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
    saveReport,
    isSaving,
    loadReport,
    currentReportId,
  };
}
