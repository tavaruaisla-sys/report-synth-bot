# Plan: Improve Search Source & Depth

## 1. Frontend Updates

### `src/components/report/SearchSourceTabs.tsx`
- **Goal**: Add controls for Search Depth (Pages 1-10) and Time Range.
- **Changes**:
    - Add `depth` (number) and `onDepthChange` props.
    - Add `timeFilter` (string) and `onTimeFilterChange` props.
    - Implement a `Slider` for depth (1-10).
    - Implement a `Select` for time range (Any time, Past 24h, Past Week, Past Month, Past Year).
    - Display the estimated number of results (Depth * 10).

### `src/pages/Index.tsx`
- **Goal**: Manage new state and pass to search.
- **Changes**:
    - Add state for `depth` (default 1) and `timeFilter` (default 'm' - month).
    - Update `handleGenerateReport` to calculate `limit = depth * 10` and pass `timeFilter`.

### `src/lib/api/google-search.ts`
- **Goal**: Update interface.
- **Changes**:
    - Update `SearchOptions` to include `timeFilter`.

## 2. Backend Updates

### `supabase/functions/google-search/index.ts`
- **Goal**: Handle dynamic limit and time filter.
- **Changes**:
    - Extract `timeFilter` from request body.
    - Map `timeFilter` to `tbs` parameter in Firecrawl request.
    - Ensure `limit` is passed correctly to Firecrawl.
    - **Logic**:
        - For `googleNews`: Use the passed `timeFilter` (or default to month if not provided).
        - For `googleAll`: We can also apply the time filter if the user selected one, or keep it "Any time" by default. I will apply it if provided.

## 3. Verification
- Verify the UI matches the provided image style (Cards).
- Verify the slider works.
- Verify the API call includes the correct limit and tbs parameters.
