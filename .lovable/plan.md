

## Issue Brief Generator -- Implementation Plan

### Overview
A new single-page tool accessible at `/brief` that lets the monitoring team paste social media post content (text, URL, image) and generate a short WhatsApp-style situational brief in Bahasa Indonesia using AI. Briefs are stored in a new `issue_briefs` Supabase table.

### Architecture

```text
┌─────────────────────────────────────────┐
│  /brief  (IssueBriefPage)               │
│                                         │
│  ┌─ Input Section ────────────────────┐ │
│  │ Platform dropdown                  │ │
│  │ Post URL input                     │ │
│  │ Caption/Text textarea              │ │
│  │ Hashtags (optional)                │ │
│  │ Top Comments (optional textarea)   │ │
│  │ Image upload (optional, via        │ │
│  │   Supabase storage + AI extract)   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  [Generate Brief] button                │
│                                         │
│  ┌─ Output Section ──────────────────┐  │
│  │ WhatsApp-style brief card         │  │
│  │ Status badge (Aman/Waspada/Perlu) │  │
│  │ [Copy to WhatsApp] [Regenerate]   │  │
│  │ [Simplify for Regi]               │  │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Brief History ───────────────────┐  │
│  │ List of past briefs from DB       │  │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Implementation Steps

#### 1. Database: Create `issue_briefs` table

Migration SQL:
- Table with columns: `id` (uuid PK), `platform` (text), `post_url` (text), `post_caption` (text), `issue_summary` (text), `status` (text -- Aman/Waspada/Perlu Perhatian), `generated_brief` (text), `simplified_brief` (text, nullable), `created_at` (timestamptz), `created_by` (uuid, default auth.uid())
- RLS policies: users can CRUD only their own rows (using `auth.uid() = created_by`)

#### 2. Edge Function: `generate-brief/index.ts`

- Accepts: `platform`, `post_url`, `caption`, `hashtags`, `top_comments`, `image_url` (optional, if user uploaded screenshot)
- Uses Lovable AI Gateway (`google/gemini-3-flash-preview`) with a carefully crafted system prompt that:
  - Analyzes the post content for tone, narrative direction, mention of the target keyword/account
  - Outputs the WhatsApp-style brief in the exact template format
  - Returns JSON with `status`, `brief`, `issue_summary`
- Second endpoint mode (`simplify: true`) generates the ultra-short single-paragraph version
- Image analysis: if `image_url` is provided, pass it to Gemini as an image input for content extraction
- Handles 429/402 errors properly

#### 3. Edge Function: `extract-image-text/index.ts`

- Accepts an image (base64 or URL from Supabase storage)
- Uses Gemini vision to extract text/content from screenshot
- Returns extracted text that gets populated into the caption field

#### 4. Frontend: `src/pages/IssueBriefPage.tsx`

- Single-page layout with Header
- Input form with all fields (platform dropdown, URL, caption textarea, hashtags, comments, image upload)
- Image upload uses existing `report-images` storage bucket
- "Generate Brief" button calls the edge function
- Output card styled like a WhatsApp message bubble (green-ish bg, rounded, monospace-like)
- Status badge with color coding: green (Aman), yellow (Waspada), red (Perlu Perhatian)
- "Copy to WhatsApp" -- copies plain text to clipboard
- "Regenerate" -- re-calls the edge function
- "Simplify for Regi" -- calls edge function with simplify flag, shows simplified version
- Brief history section at bottom showing past briefs from `issue_briefs` table

#### 5. Frontend: Service layer `src/services/briefService.ts`

- CRUD operations for `issue_briefs` table via Supabase client
- `createBrief`, `getBriefs`, `deleteBrief`

#### 6. Routing & Navigation

- Add `/brief` route in `App.tsx` (protected)
- Add "Issue Brief" nav button in `Header.tsx` with a lightning/zap icon

### AI Prompt Design

The system prompt will instruct the model to:
- Analyze in context of digital reputation monitoring
- Use the exact output template provided in the spec
- Determine status using the logic rules (Aman/Waspada/Perlu Perhatian)
- Keep output to 5-6 lines max
- Write in Bahasa Indonesia, natural WhatsApp tone
- The keyword/account being monitored is taken from user input (not hardcoded to "Arsjad Rasjid")

### Tech Stack
- **AI**: Lovable AI Gateway (Gemini 3 Flash Preview) -- free, already configured with `LOVABLE_API_KEY`
- **Image extraction**: Same Gemini model with vision capability
- **Storage**: Existing `report-images` bucket for screenshot uploads
- **Database**: New `issue_briefs` table with RLS
- **No external APIs needed** -- fully powered by existing Lovable AI

### Files to Create/Modify

| File | Action |
|---|---|
| `supabase/migrations/xxx_create_issue_briefs.sql` | Create table + RLS |
| `supabase/functions/generate-brief/index.ts` | AI brief generation |
| `supabase/functions/extract-image-text/index.ts` | Image text extraction |
| `supabase/config.toml` | Add new function configs |
| `src/pages/IssueBriefPage.tsx` | Main page component |
| `src/services/briefService.ts` | DB service layer |
| `src/App.tsx` | Add route |
| `src/components/layout/Header.tsx` | Add nav button |

