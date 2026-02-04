import { BarChart3, TrendingDown, TrendingUp, FileText, AlertCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SearchStats } from "@/lib/api/google-search";

interface AnalysisPreviewProps {
  keywords: string[];
  negativeKeywords: string[];
  urlCount: number;
  onGenerateReport: () => void;
  isLoading?: boolean;
  searchStats?: SearchStats | null;
}

const AnalysisPreview = ({ 
  keywords, 
  negativeKeywords, 
  urlCount, 
  onGenerateReport,
  isLoading = false,
  searchStats
}: AnalysisPreviewProps) => {
  const isReady = keywords.length > 0;

  // Use real stats if available, otherwise show placeholder
  const stats = searchStats || {
    totalResults: 0,
    negativeFound: 0,
    positiveFound: 0,
    neutralFound: 0,
    sentimentScore: 100,
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-accent" />
          Preview Analisis
        </CardTitle>
        <CardDescription>
          Ringkasan data yang akan dianalisis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{keywords.length}</p>
            <p className="text-xs text-muted-foreground">Keyword Brand</p>
          </div>
          <div className="rounded-lg bg-negative/10 p-4 text-center">
            <p className="text-2xl font-bold text-negative">{negativeKeywords.length}</p>
            <p className="text-xs text-muted-foreground">Keyword Negatif</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-4 text-center">
            <p className="text-2xl font-bold text-accent">{urlCount}</p>
            <p className="text-xs text-muted-foreground">URL Media</p>
          </div>
        </div>

        {/* Sentiment Preview */}
        {(isReady || searchStats) && (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sentiment Score</span>
              <span className={`text-sm font-semibold ${stats.sentimentScore >= 70 ? 'text-positive' : stats.sentimentScore >= 40 ? 'text-accent' : 'text-negative'}`}>
                {stats.sentimentScore}%
              </span>
            </div>
            <Progress value={stats.sentimentScore} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-positive" />
                <span className="text-xs text-muted-foreground">Positif: {stats.positiveFound}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-negative" />
                <span className="text-xs text-muted-foreground">Negatif: {stats.negativeFound}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Netral: {stats.neutralFound}</span>
              </div>
            </div>

            {searchStats && (
              <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                Total hasil: {stats.totalResults}
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <Button 
          className="w-full" 
          size="lg" 
          variant="hero"
          disabled={!isReady || isLoading}
          onClick={onGenerateReport}
        >
          <Search className="mr-2 h-5 w-5" />
          {isLoading ? "Mencari..." : searchStats ? "Cari Ulang" : "Mulai Analisis"}
        </Button>

        {searchStats && (
          <Button 
            className="w-full" 
            size="lg" 
            variant="default"
            disabled={isLoading}
          >
            <FileText className="mr-2 h-5 w-5" />
            Generate Report PDF
          </Button>
        )}

        {!isReady && (
          <p className="text-center text-sm text-muted-foreground">
            Tambahkan minimal 1 keyword brand untuk generate report
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisPreview;
