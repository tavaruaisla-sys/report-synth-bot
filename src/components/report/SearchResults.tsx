import { ExternalLink, AlertTriangle, Globe, Newspaper, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResult, SearchStats } from "@/lib/api/google-search";

interface SearchResultsProps {
  results: SearchResult[];
  stats: SearchStats | null;
  isLoading: boolean;
}

const SearchResults = ({ results, stats, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-accent" />
            Hasil Pencarian
          </CardTitle>
          <CardDescription>Menganalisis hasil pencarian...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const negativeResults = results.filter(r => r.hasNegativeKeyword);
  const neutralResults = results.filter(r => !r.hasNegativeKeyword);

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-accent" />
          Hasil Pencarian
        </CardTitle>
        <CardDescription>
          {stats && (
            <span>
              Ditemukan {stats.totalResults} hasil 
              ({stats.bySource.googleAll} dari Google All, {stats.bySource.googleNews} dari Google News)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Negative Results Section */}
        {negativeResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-negative" />
              <h3 className="font-medium text-negative">
                Hasil dengan Keyword Negatif ({negativeResults.length})
              </h3>
            </div>
            <ScrollArea className="h-[300px] rounded-lg border border-negative/30 bg-negative/5 p-2">
              <div className="space-y-3 pr-4">
                {negativeResults.map((result, index) => (
                  <ResultCard key={`negative-${index}`} result={result} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Neutral/Positive Results Section */}
        {neutralResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground">
                Hasil Lainnya ({neutralResults.length})
              </h3>
            </div>
            <ScrollArea className="h-[300px] rounded-lg border border-border p-2">
              <div className="space-y-3 pr-4">
                {neutralResults.map((result, index) => (
                  <ResultCard key={`neutral-${index}`} result={result} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ResultCard = ({ result }: { result: SearchResult }) => {
  return (
    <div 
      className={`rounded-lg border p-3 transition-all ${
        result.hasNegativeKeyword 
          ? "border-negative/30 bg-negative/10" 
          : "border-border bg-card hover:border-muted-foreground"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {result.source === 'google_news' ? (
              <Newspaper className="h-3 w-3 text-muted-foreground shrink-0" />
            ) : (
              <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            <Badge variant="outline" className="text-xs">
              {result.source === 'google_news' ? 'News' : 'Web'}
            </Badge>
            {result.hasNegativeKeyword && (
              <Badge variant="destructive" className="text-xs">
                Negatif
              </Badge>
            )}
          </div>
          
          <h4 className="font-medium text-sm text-foreground line-clamp-2">
            {result.title}
          </h4>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {result.description}
          </p>
          
          {result.matchedNegativeKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.matchedNegativeKeywords.map((keyword, i) => (
                <Badge 
                  key={i} 
                  className="text-xs bg-negative/20 text-negative border-negative/30"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <a 
          href={result.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
};

export default SearchResults;
