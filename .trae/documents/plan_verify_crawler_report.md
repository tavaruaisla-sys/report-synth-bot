# Plan: Verify Search Depth and Report Integration

## 1. Verify Crawler Depth (Pages 1-10)
- **Objective**: Ensure the `google-search` function correctly passes the `limit` parameter to Firecrawl to support crawling up to 10 pages (100 results) per keyword.
- **Action**: Review `supabase/functions/google-search/index.ts`.
    - Confirm `limit` is extracted from request.
    - Confirm `limit` is used in both `googleAll` and `googleNews` Firecrawl requests.
    - **Optimization**: Ensure requests are parallelized (already done) to minimize timeout risk.

## 2. Verify Google News Support
- **Objective**: Ensure Google News search is specific and separate.
- **Action**: Review `supabase/functions/google-search/index.ts`.
    - Confirm `googleNews` source adds specific query parameters (e.g., `berita OR news`, `tbs` time filter).
    - Confirm results are tagged with `source: 'google_news'`.

## 3. Verify Summary Report Integration (Slide 2)
- **Objective**: Ensure the AI-generated summary appears automatically in the "NEWS / PEMBERITAAN" section of Slide 2.
- **Action**:
    - Review `src/hooks/useReportGenerator.ts`.
        - Confirm `generateNewsDescription` updates `formData.newsBulletPoints`.
        - Confirm the split logic (`split('\n')`) correctly turns the 3-paragraph AI output into 3 distinct bullet items.
    - Review `src/lib/pdf/SlideTemplates.ts` (Slide 2).
        - Confirm it renders `data.newsBulletPoints` as a list.
    - **Suggestion**: The result will be shown in **Slide 2: REPUTATION RECOVERY - CURRENT STATUS**, specifically in the **NEWS / PEMBERITAAN** section on the left side.

## 4. Implementation Validation
- Since the code changes for these features were largely put in place in previous steps, this phase is primarily **verification** and **refinement**.
- I will ensure the system prompt in `generate-news-description` explicitly asks for the 3-paragraph format that maps perfectly to the Slide 2 structure.
