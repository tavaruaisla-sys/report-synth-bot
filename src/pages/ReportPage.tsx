import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import ReportDataForm from "@/components/report/ReportDataForm";
import { useReportGenerator } from "@/hooks/useReportGenerator";
import { useGoogleSearch } from "@/hooks/useGoogleSearch";

interface GoogleScreenshot {
  file: File;
  preview: string;
}

const ReportPage = () => {
  const navigate = useNavigate();
  const { results, stats } = useGoogleSearch();

  // Retrieve state from sessionStorage (set by Index page before navigating)
  const stored = sessionStorage.getItem("reportPageState");
  const initialState = stored ? JSON.parse(stored) : {};
  
  const [keywords] = useState<string[]>(initialState.keywords || []);
  const [negativeKeywords] = useState<string[]>(initialState.negativeKeywords || []);
  const [googleScreenshots] = useState<GoogleScreenshot[]>([]);

  const reportGenerator = useReportGenerator({
    keywords,
    negativeKeywords,
    searchResults: initialState.searchResults || results,
    searchStats: initialState.searchStats || stats,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Top Bar */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-lg font-semibold text-foreground">Generate PDF Report</h1>
        </div>
      </div>

      {/* Full Page Report Form */}
      <div className="flex-1">
        <ReportDataForm
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
          googleScreenshots={googleScreenshots}
        />
      </div>
    </div>
  );
};

export default ReportPage;
