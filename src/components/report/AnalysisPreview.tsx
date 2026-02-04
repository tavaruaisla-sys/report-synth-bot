import { BarChart3, TrendingDown, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AnalysisPreviewProps {
  keywords: string[];
  negativeKeywords: string[];
  urlCount: number;
  onGenerateReport: () => void;
  isLoading?: boolean;
}

const AnalysisPreview = ({ 
  keywords, 
  negativeKeywords, 
  urlCount, 
  onGenerateReport,
  isLoading = false 
}: AnalysisPreviewProps) => {
  const isReady = keywords.length > 0;

  // Mock analysis data - will be replaced with real data
  const mockStats = {
    totalResults: 156,
    negativeFound: 12,
    positiveFound: 89,
    neutralFound: 55,
    sentimentScore: 72,
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
        {isReady && (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sentiment Score</span>
              <span className="text-sm text-positive font-semibold">{mockStats.sentimentScore}%</span>
            </div>
            <Progress value={mockStats.sentimentScore} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-positive" />
                <span className="text-xs text-muted-foreground">Positif: {mockStats.positiveFound}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-negative" />
                <span className="text-xs text-muted-foreground">Negatif: {mockStats.negativeFound}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Netral: {mockStats.neutralFound}</span>
              </div>
            </div>
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
          <FileText className="mr-2 h-5 w-5" />
          {isLoading ? "Memproses..." : "Generate Report PDF"}
        </Button>

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
