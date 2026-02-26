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
    before: string[];
    before2: string[];
    after: string[];
    after2: string[];
  }>({ before: [], before2: [], after: [], after2: [] });

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
    serpScreenshotBefore2: screenshotPreviews.before2,
    serpScreenshotAfter: screenshotPreviews.after,
    serpScreenshotAfter2: screenshotPreviews.after2,
    serpCaptions: {
      before: formData.serpCaptionBefore,
      before2: formData.serpCaptionBefore2,
      after: formData.serpCaptionAfter,
      after2: formData.serpCaptionAfter2,
    },
    aiSummary: aiSummary || undefined,
    socialMediaStats: formData.socialMediaStats || [],
    keywordStats: formData.keywordStats || [],
    productionStats: formData.productionStats || { views: '0', likes: '0', comments: '0', saved: '0', shares: '0' },
    counterContent: formData.counterContent || [],
    newsProduction: formData.newsProduction || [],
    socialMediaProduction: formData.socialMediaProduction || [],
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
    let screenshotBeforeUrls: string[] = [];
    if (Array.isArray(formData.serpScreenshotBefore)) {
        for (const item of formData.serpScreenshotBefore) {
            if (item instanceof File) {
                const url = await reportService.uploadImage(item);
                if (url) screenshotBeforeUrls.push(url);
            } else {
                screenshotBeforeUrls.push(item);
            }
        }
    }

    let screenshotBefore2Urls: string[] = [];
    if (Array.isArray(formData.serpScreenshotBefore2)) {
        for (const item of formData.serpScreenshotBefore2) {
            if (item instanceof File) {
                const url = await reportService.uploadImage(item);
                if (url) screenshotBefore2Urls.push(url);
            } else {
                screenshotBefore2Urls.push(item);
            }
        }
    }

    let screenshotAfterUrls: string[] = [];
    if (Array.isArray(formData.serpScreenshotAfter)) {
        for (const item of formData.serpScreenshotAfter) {
            if (item instanceof File) {
                const url = await reportService.uploadImage(item);
                if (url) screenshotAfterUrls.push(url);
            } else {
                screenshotAfterUrls.push(item);
            }
        }
    }

    let screenshotAfter2Urls: string[] = [];
    if (Array.isArray(formData.serpScreenshotAfter2)) {
        for (const item of formData.serpScreenshotAfter2) {
            if (item instanceof File) {
                const url = await reportService.uploadImage(item);
                if (url) screenshotAfter2Urls.push(url);
            } else {
                screenshotAfter2Urls.push(item);
            }
        }
    }

      // Prepare data to save
      const reportDataToSave: ReportData = {
        ...previewData,
        serpScreenshotBefore: screenshotBeforeUrls,
        serpScreenshotBefore2: screenshotBefore2Urls,
        serpScreenshotAfter: screenshotAfterUrls,
        serpScreenshotAfter2: screenshotAfter2Urls,
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
        setFormData(prev => ({
            ...prev,
            serpScreenshotBefore: screenshotBeforeUrls,
            serpScreenshotBefore2: screenshotBefore2Urls,
            serpScreenshotAfter: screenshotAfterUrls,
            serpScreenshotAfter2: screenshotAfter2Urls,
        }));
        setScreenshotPreviews({
            before: screenshotBeforeUrls,
            before2: screenshotBefore2Urls,
            after: screenshotAfterUrls,
            after2: screenshotAfter2Urls,
        });

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
      serpCaptionBefore2: data.serpCaptions?.before2 || defaultReportFormData.serpCaptionBefore2,
      serpCaptionAfter: data.serpCaptions?.after || defaultReportFormData.serpCaptionAfter,
      serpCaptionAfter2: data.serpCaptions?.after2 || defaultReportFormData.serpCaptionAfter2,
      serpScreenshotBefore: Array.isArray(data.serpScreenshotBefore) 
        ? data.serpScreenshotBefore 
        : data.serpScreenshotBefore ? [data.serpScreenshotBefore] : [],
      serpScreenshotBefore2: Array.isArray(data.serpScreenshotBefore2)
        ? data.serpScreenshotBefore2
        : data.serpScreenshotBefore2 ? [data.serpScreenshotBefore2] : [],
      serpScreenshotAfter: Array.isArray(data.serpScreenshotAfter)
        ? data.serpScreenshotAfter
        : data.serpScreenshotAfter ? [data.serpScreenshotAfter] : [],
      serpScreenshotAfter2: Array.isArray(data.serpScreenshotAfter2)
        ? data.serpScreenshotAfter2
        : data.serpScreenshotAfter2 ? [data.serpScreenshotAfter2] : [],
      socialMediaStats: data.socialMediaStats || [],
      keywordStats: data.keywordStats || [],
      productionStats: data.productionStats || { views: '0', likes: '0', comments: '0', saved: '0', shares: '0' },
      counterContent: data.counterContent || [],
      newsProduction: data.newsProduction || [],
      socialMediaProduction: data.socialMediaProduction || [],
      generateAiSummary: !!data.aiSummary,
    });
    
    setAiSummary(data.aiSummary || '');
    
    setScreenshotPreviews({
      before: Array.isArray(data.serpScreenshotBefore) 
        ? data.serpScreenshotBefore 
        : data.serpScreenshotBefore ? [data.serpScreenshotBefore] : [],
      before2: Array.isArray(data.serpScreenshotBefore2)
        ? data.serpScreenshotBefore2
        : data.serpScreenshotBefore2 ? [data.serpScreenshotBefore2] : [],
      after: Array.isArray(data.serpScreenshotAfter)
        ? data.serpScreenshotAfter
        : data.serpScreenshotAfter ? [data.serpScreenshotAfter] : [],
      after2: Array.isArray(data.serpScreenshotAfter2)
        ? data.serpScreenshotAfter2
        : data.serpScreenshotAfter2 ? [data.serpScreenshotAfter2] : [],
    });
    
    toast({
      title: "Report Loaded",
      description: `Report "${report.title}" berhasil dimuat`,
    });
  };

  // Handle screenshot preview updates
  const updateScreenshotPreview = async (file: File, type: 'before' | 'before2' | 'after' | 'after2') => {
    const base64 = await fileToBase64(file);
    setScreenshotPreviews(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), base64],
    }));
  };

  const removeScreenshotPreview = (index: number, type: 'before' | 'before2' | 'after' | 'after2') => {
    setScreenshotPreviews(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
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
      // Use all search results (up to 100) for comprehensive analysis
      const resultsContext = searchResults.map(r => 
        `- ${r.title} (${r.url})\n  Snippet: ${r.description}\n  Sentiment: ${r.sentiment}`
      ).join('\n\n');

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
      let screenshotBefore: string[] = [];
      let screenshotBefore2: string[] = [];
      let screenshotAfter: string[] = [];
      let screenshotAfter2: string[] = [];

      if (Array.isArray(formData.serpScreenshotBefore)) {
          for (const item of formData.serpScreenshotBefore) {
              if (item instanceof File) {
                  const base64 = await fileToBase64(item);
                  screenshotBefore.push(base64);
              } else {
                  screenshotBefore.push(item);
              }
          }
      }

      if (Array.isArray(formData.serpScreenshotBefore2)) {
          for (const item of formData.serpScreenshotBefore2) {
              if (item instanceof File) {
                  const base64 = await fileToBase64(item);
                  screenshotBefore2.push(base64);
              } else {
                  screenshotBefore2.push(item);
              }
          }
      }

      if (Array.isArray(formData.serpScreenshotAfter)) {
          for (const item of formData.serpScreenshotAfter) {
              if (item instanceof File) {
                  const base64 = await fileToBase64(item);
                  screenshotAfter.push(base64);
              } else {
                  screenshotAfter.push(item);
              }
          }
      }

      if (Array.isArray(formData.serpScreenshotAfter2)) {
          for (const item of formData.serpScreenshotAfter2) {
              if (item instanceof File) {
                  const base64 = await fileToBase64(item);
                  screenshotAfter2.push(base64);
              } else {
                  screenshotAfter2.push(item);
              }
          }
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
        serpScreenshotBefore2: screenshotBefore2,
        serpScreenshotAfter: screenshotAfter,
        serpScreenshotAfter2: screenshotAfter2,
        serpCaptions: {
          before: formData.serpCaptionBefore,
          before2: formData.serpCaptionBefore2,
          after: formData.serpCaptionAfter,
          after2: formData.serpCaptionAfter2,
        },
        aiSummary: aiSummary || undefined,
        socialMediaStats: formData.socialMediaStats,
        keywordStats: formData.keywordStats || [],
        productionStats: formData.productionStats || { views: '0', likes: '0', comments: '0', saved: '0', shares: '0' },
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
    removeScreenshotPreview,
    saveReport,
    isSaving,
    loadReport,
    currentReportId,
  };
}
