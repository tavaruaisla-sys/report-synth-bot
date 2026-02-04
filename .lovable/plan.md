
# Plan: Generate PDF Report dengan Template RP Report

## Ringkasan

Berdasarkan template PDF yang kamu upload, saya akan membuat fitur PDF generator yang menghasilkan laporan monitoring reputasi dengan format slide profesional. Laporan akan berisi:

1. **Cover Slide** - Judul "RP REPORT" dengan tanggal update
2. **Executive Summary** - Status recovery dengan ringkasan News & Social Media
3. **Section Divider** - "RESULTS"
4. **Screenshot Hasil Pencarian** - Before/After comparison Google Search
5. **AI Summary** - Ringkasan analisis keyword menggunakan AI (Perplexity style)
6. **Counter Narrative** - Artikel positif sebagai counter
7. **Appendix** - Data statistik, link produksi konten (News & Social Media)

---

## Data yang Diperlukan (Sinkronisasi dengan Fitur Existing)

### Dari Fitur Existing:
| Data | Sumber | Status |
|------|--------|--------|
| Keywords Brand | KeywordInput component | Sudah ada |
| Negative Keywords | KeywordInput component | Sudah ada |
| Search Results (Google All/News) | google-search edge function | Sudah ada |
| Sentiment Stats | useGoogleSearch hook | Sudah ada |
| Social Media URLs | SocialMediaInput component | Sudah ada |

### Data Baru yang Perlu Ditambahkan:
| Data | Kegunaan | Cara Mendapatkan |
|------|----------|------------------|
| Screenshot SERP Before/After | Slide 4-5 comparison | Firecrawl screenshot API |
| AI Analysis Summary | Slide 6-7 ringkasan | Perplexity AI API |
| Counter Content Links | Slide Appendix | Input manual dari user |
| Social Media Stats | Views, engagement | Input manual atau API scraping |

---

## Struktur Slide PDF (Berdasarkan Template)

```text
+------------------------------------------+
|  SLIDE 1: COVER                          |
|  - Logo/Brand Name                       |
|  - "RP REPORT"                           |
|  - Update Date                           |
+------------------------------------------+
|  SLIDE 2: EXECUTIVE SUMMARY              |
|  - News/Pemberitaan Status               |
|  - Social Media Activity                 |
|  - Counter Activity Stats                |
+------------------------------------------+
|  SLIDE 3: SECTION DIVIDER - "RESULTS"    |
+------------------------------------------+
|  SLIDE 4-5: SERP SCREENSHOTS             |
|  - Before: Negative results visible      |
|  - After: Clean SERP                     |
+------------------------------------------+
|  SLIDE 6-7: AI ANALYSIS                  |
|  - Perplexity-style summary              |
|  - Key findings with references          |
+------------------------------------------+
|  SLIDE 8: SECTION DIVIDER - "APPENDIX"   |
+------------------------------------------+
|  SLIDE 9: DATA SUMMARY TABLE             |
|  - Keyword-wise negative count           |
|  - Content production stats              |
+------------------------------------------+
|  SLIDE 10-19: PRODUCTION LINKS           |
|  - News articles published               |
|  - Social media posts grid               |
+------------------------------------------+
```

---

## Implementasi Teknis

### Phase 1: PDF Generator Core
1. Install `jspdf` + `jspdf-autotable` untuk PDF generation
2. Buat `src/lib/pdf/ReportPDFGenerator.ts` - kelas utama generator
3. Buat slide templates sesuai struktur di atas
4. Implementasi color scheme matching template (Navy Blue theme)

### Phase 2: Additional Data Collection
1. Tambah input form untuk:
   - Report Title (default: "RP REPORT")
   - Brand Name
   - Social Media Stats (Views, Likes, Comments, Shares)
   - Counter Content URLs (untuk appendix)

2. Buat edge function baru:
   - `screenshot-serp` - Capture Google SERP screenshots
   - `ai-summary` - Generate AI summary menggunakan Perplexity

### Phase 3: Integration
1. Update `AnalysisPreview.tsx` - tombol "Generate Report PDF" aktif
2. Buat `ReportPreview.tsx` - preview sebelum generate
3. Buat modal untuk input data tambahan sebelum generate

### Phase 4: Screenshot & AI Features
1. Firecrawl screenshot integration untuk SERP capture
2. Perplexity API integration untuk AI summary
3. Auto-generate ringkasan dari search results

---

## File yang Akan Dibuat/Dimodifikasi

### File Baru:
- `src/lib/pdf/ReportPDFGenerator.ts` - Core PDF generator
- `src/lib/pdf/SlideTemplates.ts` - Template untuk setiap slide
- `src/lib/pdf/types.ts` - TypeScript types untuk report data
- `src/components/report/ReportDataForm.tsx` - Form input data tambahan
- `src/components/report/ReportPreviewModal.tsx` - Preview sebelum generate
- `src/hooks/useReportGenerator.ts` - Hook untuk manage report state
- `supabase/functions/screenshot-serp/index.ts` - Screenshot edge function
- `supabase/functions/ai-summary/index.ts` - AI summary edge function

### File yang Dimodifikasi:
- `src/pages/Index.tsx` - Integrasi form dan preview
- `src/components/report/AnalysisPreview.tsx` - Enable PDF button
- `package.json` - Tambah jspdf dependency

---

## Flow User Experience

```text
1. User input keywords brand + negative keywords (EXISTING)
               |
               v
2. User pilih sumber pencarian (EXISTING)
               |
               v
3. User klik "Mulai Analisis" (EXISTING)
               |
               v
4. Sistem scraping Google & analisis (EXISTING)
               |
               v
5. Hasil ditampilkan di SearchResults (EXISTING)
               |
               v
6. User klik "Generate Report PDF" (NEW)
               |
               v
7. Modal muncul: Input data tambahan (NEW)
   - Report title & date
   - Social media stats
   - Counter content links
               |
               v
8. User klik "Generate" (NEW)
               |
               v
9. PDF di-download otomatis (NEW)
```

---

## Pertanyaan Klarifikasi

Sebelum implementasi, ada beberapa hal yang perlu dikonfirmasi:

1. **Screenshot SERP**: Apakah screenshot Before/After akan diinput manual (upload gambar) atau sistem harus auto-capture dari Google?

2. **AI Summary**: Apakah ingin menggunakan AI (Perplexity/OpenAI) untuk generate summary, atau summary akan diinput manual?

3. **Social Media Stats**: Apakah data Views/Likes/Comments akan diinput manual atau perlu scraping otomatis dari platform?

4. **Counter Content**: Apakah link artikel counter akan diinput manual atau diambil dari database?

---

## Timeline Estimasi

| Phase | Deskripsi | Kompleksitas |
|-------|-----------|--------------|
| Phase 1 | PDF Generator Core + Templates | Medium |
| Phase 2 | Form Input Data Tambahan | Low |
| Phase 3 | Integration dengan existing features | Medium |
| Phase 4 | Screenshot & AI Features | High |

Rekomendasi: Mulai dengan Phase 1-3 dulu (manual input), kemudian tambahkan Phase 4 (automation) setelah core sudah berjalan.
