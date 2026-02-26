# Plan: Improve AI Summary with Full SERP Data

## 1. Frontend Updates (`src/hooks/useReportGenerator.ts`)
- **Goal**: Ensure the AI receives the full breadth of search results (Pages 1-10), not just the top 10.
- **Action**:
    - Modify `generateNewsDescription` function.
    - Remove `.slice(0, 10)` from the `resultsContext` mapping.
    - Map all `searchResults` to a string format: `Title: ... \n URL: ... \n Snippet: ... \n Sentiment: ...`.
    - This ensures the AI has the "Headlines and URLs" the user specifically asked for.

## 2. Backend Updates (`supabase/functions/generate-news-description/index.ts`)
- **Goal**: Enforce the specific 3-paragraph format requested by the user.
- **Action**:
    - Update `systemPrompt`:
        - Explicitly define the 3 required paragraphs:
            1.  **New Negative News**: "Terdapat pemberitaan negatif baru..."
            2.  **Previous Negative News**: "Pemberitaan negatif sebelumnya..."
            3.  **Positive/Neutral Dominance**: "Pemberitaan positif dan netral tetap mendominasi..."
        - Instruct to strictly follow this structure.
        - Instruct to analyze the provided list of headlines/URLs to categorize them into these buckets.

## 3. Backend Updates (`supabase/functions/google-search/index.ts`)
- **Goal**: Ensure the search function is robust for deep crawling.
- **Action**: No major changes needed here as it already supports `limit` and `timeFilter` from the previous step. The frontend just needs to pass the data correctly.

## 4. Verification
- Verify that generating the AI summary with ~100 results works (might take longer, need to handle potential timeouts or context limits if using a smaller model, but `gemini-3-flash` should handle it).
