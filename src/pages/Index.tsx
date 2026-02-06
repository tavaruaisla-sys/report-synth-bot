import { useState } from "react";
import { Sparkles, FileSliders } from "lucide-react";
import Header from "@/components/layout/Header";
import KeywordInput from "@/components/report/KeywordInput";
import SocialMediaInput from "@/components/report/SocialMediaInput";
import SearchSourceTabs from "@/components/report/SearchSourceTabs";
import AnalysisPreview from "@/components/report/AnalysisPreview";
import SearchResults from "@/components/report/SearchResults";
import ReportDataForm from "@/components/report/ReportDataForm";
import { useToast } from "@/hooks/use-toast";
import { useGoogleSearch } from "@/hooks/useGoogleSearch";
import { useReportGenerator } from "@/hooks/useReportGenerator";

interface SocialMediaUrl {
  id: string;
  url: string;
  platform: string;
}

const Index = () => {
  const { toast } = useToast();
  const { results, stats, isLoading, search } = useGoogleSearch();
  
  const [keywords, setKeywords] = useState<string[]>([]);
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([
    "penipuan",
    "scam",
    "keluhan",
    "gagal",
    "buruk"
  ]);
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrl[]>([]);
  const [sources, setSources] = useState({
    googleAll: true,
    googleNews: true,
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Report generator hook
  const reportGenerator = useReportGenerator({
    keywords,
    negativeKeywords,
    searchResults: results,
    searchStats: stats,
  });

  const handleGenerateReport = async () => {
    // First, run the search
    await search({
      keywords,
      negativeKeywords,
      sources,
      limit: 10,
    });

    toast({
      title: "Pencarian Selesai",
      description: "Report PDF generator akan tersedia setelah semua data dianalisis",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Report Generator</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Deteksi Keyword Negatif &<br />
              <span className="text-accent">Generate Report PDF</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Tool AI untuk memonitor reputasi brand Anda di hasil pencarian Google. 
              Deteksi otomatis keyword negatif dan buat report dalam format slide PDF profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Inputs */}
          <div className="space-y-6 lg:col-span-2">
            {/* Step 1: Keywords */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  1
                </span>
                <h2 className="text-lg font-semibold text-foreground">Masukkan Keyword</h2>
              </div>
              <KeywordInput
                keywords={keywords}
                onKeywordsChange={setKeywords}
                negativeKeywords={negativeKeywords}
                onNegativeKeywordsChange={setNegativeKeywords}
              />
            </div>

            {/* Step 2: Search Sources */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  2
                </span>
                <h2 className="text-lg font-semibold text-foreground">Pilih Sumber Pencarian</h2>
              </div>
              <SearchSourceTabs sources={sources} onSourcesChange={setSources} />
            </div>

            {/* Step 3: Social Media URLs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  3
                </span>
                <h2 className="text-lg font-semibold text-foreground">URL Social Media (Opsional)</h2>
              </div>
              <SocialMediaInput urls={socialUrls} onUrlsChange={setSocialUrls} />
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileSliders className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Preview & Generate</h2>
            </div>
            <AnalysisPreview
              keywords={keywords}
              negativeKeywords={negativeKeywords}
              urlCount={socialUrls.length}
              onGenerateReport={handleGenerateReport}
              isLoading={isLoading}
              searchStats={stats}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </div>
        </div>

        {/* Search Results - Full Width */}
        {(results.length > 0 || isLoading) && (
          <div className="lg:col-span-3">
            <SearchResults 
              results={results} 
              stats={stats} 
              isLoading={isLoading} 
            />
          </div>
        )}
        </div>
      </main>

      {/* Report Data Form Modal */}
      <ReportDataForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        formData={reportGenerator.formData}
        onUpdateFormData={reportGenerator.updateFormData}
        onAddSocialMediaStat={reportGenerator.addSocialMediaStat}
        onRemoveSocialMediaStat={reportGenerator.removeSocialMediaStat}
        onAddCounterContent={reportGenerator.addCounterContent}
        onRemoveCounterContent={reportGenerator.removeCounterContent}
        onAddProductionLink={reportGenerator.addProductionLink}
        onRemoveProductionLink={reportGenerator.removeProductionLink}
        aiSummary={reportGenerator.aiSummary}
        onGenerateAiSummary={reportGenerator.generateAiSummary}
        isGeneratingAiSummary={reportGenerator.isGeneratingAiSummary}
        onGenerateNewsDescription={reportGenerator.generateNewsDescription}
        isGeneratingNewsDesc={reportGenerator.isGeneratingNewsDesc}
        onGenerateReport={reportGenerator.generateReport}
        isGenerating={reportGenerator.isGenerating}
        previewData={reportGenerator.previewData}
        onUpdateScreenshotPreview={reportGenerator.updateScreenshotPreview}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 ReportAI - Brand Monitoring & Reputation Management Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
