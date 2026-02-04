const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface SearchRequest {
  keywords: string[];
  negativeKeywords: string[];
  sources: {
    googleAll: boolean;
    googleNews: boolean;
  };
  limit?: number;
}

interface SearchResult {
  url: string;
  title: string;
  description: string;
  markdown?: string;
  source: 'google_all' | 'google_news';
  hasNegativeKeyword: boolean;
  matchedNegativeKeywords: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

function detectNegativeKeywords(text: string, negativeKeywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return negativeKeywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, negativeKeywords, sources, limit = 10 }: SearchRequest = await req.json();

    if (!keywords || keywords.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'At least one keyword is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allResults: SearchResult[] = [];
    const searchPromises: Promise<void>[] = [];

    // Search for each keyword
    for (const keyword of keywords) {
      // Google All (general search)
      if (sources.googleAll) {
        const searchAllPromise = (async () => {
          console.log(`Searching Google All for: ${keyword}`);
          
          const response = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: keyword,
              limit,
              lang: 'id',
              country: 'id',
              scrapeOptions: {
                formats: ['markdown'],
              },
            }),
          });

          const data = await response.json();
          
          if (response.ok && data.data) {
            for (const result of data.data) {
              const textToAnalyze = `${result.title || ''} ${result.description || ''} ${result.markdown || ''}`;
              const matchedNegative = detectNegativeKeywords(textToAnalyze, negativeKeywords);
              
              allResults.push({
                url: result.url,
                title: result.title || 'No title',
                description: result.description || '',
                markdown: result.markdown,
                source: 'google_all',
                hasNegativeKeyword: matchedNegative.length > 0,
                matchedNegativeKeywords: matchedNegative,
                sentiment: matchedNegative.length > 0 ? 'negative' : 'neutral',
              });
            }
          }
        })();
        searchPromises.push(searchAllPromise);
      }

      // Google News
      if (sources.googleNews) {
        const searchNewsPromise = (async () => {
          console.log(`Searching Google News for: ${keyword}`);
          
          // For news, we add "news" to the query and filter by recent time
          const response = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `${keyword} berita OR news`,
              limit,
              lang: 'id',
              country: 'id',
              tbs: 'qdr:m', // Last month for news
              scrapeOptions: {
                formats: ['markdown'],
              },
            }),
          });

          const data = await response.json();
          
          if (response.ok && data.data) {
            for (const result of data.data) {
              const textToAnalyze = `${result.title || ''} ${result.description || ''} ${result.markdown || ''}`;
              const matchedNegative = detectNegativeKeywords(textToAnalyze, negativeKeywords);
              
              allResults.push({
                url: result.url,
                title: result.title || 'No title',
                description: result.description || '',
                markdown: result.markdown,
                source: 'google_news',
                hasNegativeKeyword: matchedNegative.length > 0,
                matchedNegativeKeywords: matchedNegative,
                sentiment: matchedNegative.length > 0 ? 'negative' : 'neutral',
              });
            }
          }
        })();
        searchPromises.push(searchNewsPromise);
      }
    }

    // Wait for all searches to complete
    await Promise.all(searchPromises);

    // Calculate statistics
    const stats = {
      totalResults: allResults.length,
      negativeFound: allResults.filter(r => r.hasNegativeKeyword).length,
      positiveFound: 0, // Will be updated when AI sentiment is added
      neutralFound: allResults.filter(r => !r.hasNegativeKeyword).length,
      bySource: {
        googleAll: allResults.filter(r => r.source === 'google_all').length,
        googleNews: allResults.filter(r => r.source === 'google_news').length,
      },
    };

    // Calculate sentiment score (100 = all positive, 0 = all negative)
    const sentimentScore = stats.totalResults > 0 
      ? Math.round(((stats.totalResults - stats.negativeFound) / stats.totalResults) * 100)
      : 100;

    console.log(`Search complete. Total: ${stats.totalResults}, Negative: ${stats.negativeFound}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: allResults,
        stats: {
          ...stats,
          sentimentScore,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
