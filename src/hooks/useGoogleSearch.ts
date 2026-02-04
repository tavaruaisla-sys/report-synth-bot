import { useState } from 'react';
import { googleSearchApi, SearchResult, SearchStats, SearchOptions } from '@/lib/api/google-search';
import { useToast } from '@/hooks/use-toast';

interface UseGoogleSearchReturn {
  results: SearchResult[];
  stats: SearchStats | null;
  isLoading: boolean;
  error: string | null;
  search: (options: SearchOptions) => Promise<void>;
  clearResults: () => void;
}

export function useGoogleSearch(): UseGoogleSearchReturn {
  const { toast } = useToast();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (options: SearchOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      toast({
        title: "Mencari...",
        description: `Menganalisis hasil pencarian untuk ${options.keywords.length} keyword`,
      });

      const response = await googleSearchApi.search(options);

      if (response.success && response.data) {
        setResults(response.data);
        setStats(response.stats || null);

        const negativeCount = response.stats?.negativeFound || 0;
        
        toast({
          title: "Pencarian Selesai",
          description: `Ditemukan ${response.data.length} hasil, ${negativeCount} mengandung keyword negatif`,
          variant: negativeCount > 0 ? "destructive" : "default",
        });
      } else {
        const errorMsg = response.error || 'Pencarian gagal';
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setStats(null);
    setError(null);
  };

  return {
    results,
    stats,
    isLoading,
    error,
    search,
    clearResults,
  };
}
