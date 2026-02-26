import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileSliders, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import KeywordInput from "@/components/report/KeywordInput";
import SocialMediaInput from "@/components/report/SocialMediaInput";
import SearchSourceTabs from "@/components/report/SearchSourceTabs";
import GoogleScreenshotUpload from "@/components/report/GoogleScreenshotUpload";
import AnalysisPreview from "@/components/report/AnalysisPreview";
import SearchResults from "@/components/report/SearchResults";
import { useToast } from "@/hooks/use-toast";
import { useGoogleSearch } from "@/hooks/useGoogleSearch";

interface GoogleScreenshot {
  file: File;
  preview: string;
}

interface SocialMediaUrl {
  id: string;
  url: string;
  platform: string;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
  const [googleScreenshots, setGoogleScreenshots] = useState<GoogleScreenshot[]>([]);
  const [sources, setSources] = useState({
    googleAll: true,
    googleNews: true,
  });
  const [depth, setDepth] = useState(1);
  const [timeFilter, setTimeFilter] = useState('m'); // Default last month

  const handleGenerateReport = async () => {
    await search({
      keywords,
      negativeKeywords,
      sources,
      limit: depth * 10,
      timeFilter,
    });

    toast({
      title: "Pencarian Selesai",
      description: "Report PDF generator akan tersedia setelah semua data dianalisis",
    });
  };

  const handleOpenReportPage = () => {
    // Store state in sessionStorage for the report page
    sessionStorage.setItem("reportPageState", JSON.stringify({
      keywords,
      negativeKeywords,
      searchResults: results,
      searchStats: stats,
    }));
    navigate("/report");
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
              Monitoring Reputasi Brand &<br />
              <span className="text-accent">Analisis Keyword Negatif Otomatis</span>
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">1</span>
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">2</span>
                <h2 className="text-lg font-semibold text-foreground">Pilih Sumber Pencarian</h2>
              </div>
              <SearchSourceTabs 
                sources={sources} 
                onSourcesChange={setSources}
                depth={depth}
                onDepthChange={setDepth}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
              />
            </div>

            {/* Step 3: Google Screenshots */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">3</span>
                <h2 className="text-lg font-semibold text-foreground">Upload Screenshot Google (Opsional)</h2>
              </div>
              <GoogleScreenshotUpload
                screenshots={googleScreenshots}
                onScreenshotsChange={setGoogleScreenshots}
              />
            </div>

            {/* Step 4: Social Media URLs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">4</span>
                <h2 className="text-lg font-semibold text-foreground">URL Social Media (Opsional)</h2>
              </div>
              <SocialMediaInput urls={socialUrls} onUrlsChange={setSocialUrls} />
            </div>

            {/* Search Results - Integrated into left column to avoid overlapping with sidebar */}
            {(results.length > 0 || isLoading) && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Search className="h-3 w-3" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Hasil Analisis Pencarian</h2>
                </div>
                <SearchResults 
                  results={results} 
                  stats={stats} 
                  isLoading={isLoading} 
                />
              </div>
            )}
          </div>

          {/* Right Column - Preview & Generate (Sticky) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <FileSliders className="h-3 w-3" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Preview & Generate</h2>
              </div>
              <AnalysisPreview
                keywords={keywords}
                negativeKeywords={negativeKeywords}
                urlCount={socialUrls.length}
                onGenerateReport={handleGenerateReport}
                isLoading={isLoading}
                searchStats={stats}
                onOpenReportModal={handleOpenReportPage}
              />
            </div>
          </div>
        </div>
      </main>

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
