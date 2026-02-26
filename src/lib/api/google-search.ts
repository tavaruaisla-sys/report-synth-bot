import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  url: string;
  title: string;
  description: string;
  markdown?: string;
  source: 'google_all' | 'google_news';
  hasNegativeKeyword: boolean;
  matchedNegativeKeywords: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface SearchStats {
  totalResults: number;
  negativeFound: number;
  positiveFound: number;
  neutralFound: number;
  sentimentScore: number;
  bySource: {
    googleAll: number;
    googleNews: number;
  };
}

export interface SearchResponse {
  success: boolean;
  error?: string;
  data?: SearchResult[];
  stats?: SearchStats;
}

export interface SearchOptions {
  keywords: string[];
  negativeKeywords: string[];
  sources: {
    googleAll: boolean;
    googleNews: boolean;
  };
  limit?: number;
  timeFilter?: string;
}

export const googleSearchApi = {
  /**
   * Search Google for brand keywords and detect negative mentions
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    const { data, error } = await supabase.functions.invoke('google-search', {
      body: options,
    });

    if (error) {
      console.error('Error calling google-search function:', error);
      return { success: false, error: error.message };
    }

    return data;
  },

  /**
   * Simple web search using Firecrawl
   */
  async simpleSearch(query: string, limit = 10): Promise<SearchResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { 
        query,
        options: { limit }
      },
    });

    if (error) {
      console.error('Error calling firecrawl-search function:', error);
      return { success: false, error: error.message };
    }

    return data;
  },
};
