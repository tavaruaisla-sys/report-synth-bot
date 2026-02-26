# Plan to Update Slide 2 Design and Form

The user wants to redesign "Slide 2" (Executive Summary) to match a provided image and update the input form accordingly.

## 1. Update Data Types
Modify `src/lib/pdf/types.ts`:
- Update `ReportData` and `ReportFormData` interfaces.
- Remove/Deprecate:
    - `newsStatus`
    - `newsDescription` (replace with `newsBulletPoints`)
    - `socialMediaStatus`
    - `socialMediaDescription`
- Add:
    - `newsBulletPoints: string[]`
    - `socialMediaAccountStatusBefore: string`
    - `socialMediaAccountStatusAfter: string`
    - `socialMediaAccountStatusNote: string`
    - `socialMediaCounterTotalViews: string`
    - `socialMediaCounterTotalEngagement: string`
- Update `defaultReportFormData` with initial empty values for new fields.

## 2. Update Form Component
Modify `src/components/report/ReportDataForm.tsx`:
- In the "Slide 2" section (lines 188-318):
    - Remove `Select` inputs for status.
    - Replace `newsDescription` textarea with a `Textarea` that splits content by newline into `newsBulletPoints`.
    - Add inputs for "Social Media - TikTok":
        - "Aktivitas Akun Lawan":
            - Input for `socialMediaAccountStatusBefore`
            - Input for `socialMediaAccountStatusAfter`
            - Textarea for `socialMediaAccountStatusNote`
        - "Aktivitas Counter Kita":
            - Input for `socialMediaCounterTotalViews`
            - Input for `socialMediaCounterTotalEngagement`

## 3. Update Slide Design
Modify `src/components/report/ReportPreview.tsx`:
- Locate Slide 2 (lines 30-85).
- Remove the "Sentiment Analysis" section.
- Redesign the layout:
    - **Header**: "REPUTATION RECOVERY - CURRENT STATUS" (Keep existing).
    - **News Section**:
        - Title: "NEWS / PEMBERITAAN" (Blue text).
        - Content: Render `newsBulletPoints` as a bulleted list. Support simple bold formatting if possible (e.g., wrapping in `<b>` or detecting `**`). For now, standard text is fine, or I can try to parse bold text if the user inputs it. The user didn't explicitly ask for rich text editing, but the image has it. I'll stick to plain text or simple bolding if easy.
    - **Social Media Section**:
        - Title: "SOSIAL MEDIA - TIKTOK" (Blue text).
        - **Subsection**: "Aktivitas Akun Lawan" (Bold).
            - Bullet: "Sebelum: {socialMediaAccountStatusBefore}"
            - Bullet: "Sesudah: {socialMediaAccountStatusAfter}"
            - Note: "{socialMediaAccountStatusNote}" (Italic).
        - **Subsection**: "Aktivitas Counter Kita" (Bold).
            - Bullet: "Total views konten counter: {socialMediaCounterTotalViews}"
            - Bullet: "Total engagement: {socialMediaCounterTotalEngagement}"

## 4. Verification
- Verify the form updates the preview correctly.
- Verify the slide design matches the image structure.
