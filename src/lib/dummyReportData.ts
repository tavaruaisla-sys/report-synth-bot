import { ReportData } from "@/lib/pdf/types";

export const dummyReportData: ReportData = {
  reportTitle: "RP REPORT",
  brandName: "PT Pupuk Indonesia",
  updateDate: new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),

  keywords: ["Pupuk Indonesia", "Rahmad Pribadi", "Dirut Pupuk Indonesia"],
  negativeKeywords: ["korupsi", "skandal", "dugaan", "kontroversi", "perjalanan dinas"],

  keywordStats: [
    { keyword: "Pupuk Indonesia", searchBefore: 45, newsBefore: 12, searchCurrent: 38, newsCurrent: 8 },
    { keyword: "Rahmad Pribadi", searchBefore: 30, newsBefore: 18, searchCurrent: 22, newsCurrent: 10 },
    { keyword: "Dirut Pupuk Indonesia", searchBefore: 25, newsBefore: 15, searchCurrent: 18, newsCurrent: 7 },
  ],

  searchResults: [
    {
      title: "PT Pupuk Indonesia Raih Penghargaan Best Corporate Governance 2025",
      url: "https://example.com/article-1",
      snippet: "PT Pupuk Indonesia meraih penghargaan Best Corporate Governance dalam ajang Indonesia Business Awards 2025.",
      source: "google",
      sentiment: "positive",
      matchedKeywords: ["Pupuk Indonesia"],
    },
    {
      title: "Dirut Pupuk Indonesia Resmikan Pabrik Baru di Kalimantan",
      url: "https://example.com/article-2",
      snippet: "Rahmad Pribadi selaku Dirut Pupuk Indonesia meresmikan pabrik pupuk baru berkapasitas 1 juta ton per tahun.",
      source: "google",
      sentiment: "positive",
      matchedKeywords: ["Dirut Pupuk Indonesia", "Rahmad Pribadi"],
    },
    {
      title: "Pupuk Indonesia Digitalisasi Command Center untuk Efisiensi",
      url: "https://example.com/article-3",
      snippet: "Transformasi digital PT Pupuk Indonesia melalui command center terintegrasi untuk meningkatkan efisiensi operasional.",
      source: "google",
      sentiment: "positive",
      matchedKeywords: ["Pupuk Indonesia"],
    },
    {
      title: "Polemik Aturan Perjalanan Dinas Direksi BUMN",
      url: "https://example.com/article-4",
      snippet: "Dugaan pelanggaran aturan perjalanan dinas di sejumlah direksi BUMN menjadi sorotan media.",
      source: "google",
      sentiment: "negative",
      matchedKeywords: ["perjalanan dinas", "dugaan"],
    },
    {
      title: "Pupuk Indonesia Salurkan Bantuan untuk Petani Terdampak Banjir",
      url: "https://example.com/article-5",
      snippet: "Sebanyak 500 ton pupuk disalurkan kepada petani yang terdampak banjir di Jawa Timur.",
      source: "google",
      sentiment: "positive",
      matchedKeywords: ["Pupuk Indonesia"],
    },
    {
      title: "Rahmad Pribadi Bicara Soal Modernisasi Pabrik Tua",
      url: "https://example.com/article-6",
      snippet: "Dalam wawancara eksklusif, Rahmad Pribadi menguraikan rencana modernisasi pabrik-pabrik tua Pupuk Indonesia.",
      source: "google",
      sentiment: "neutral",
      matchedKeywords: ["Rahmad Pribadi", "Pupuk Indonesia"],
    },
  ],

  sentimentStats: {
    totalResults: 6,
    negativeFound: 1,
    positiveFound: 4,
    neutralFound: 1,
    sentimentScore: 83,
  },

  newsBulletPoints: [
    "Hasil SERP Google News menunjukkan keyword 'Pupuk Indonesia' didominasi berita positif/netral terkait penghargaan, bantuan, dan digitalisasi.",
    "Keyword 'Rahmad Pribadi' dan 'Dirut Pupuk Indonesia' masih memunculkan beberapa headline bernuansa negatif terkait isu perjalanan dinas.",
    "Secara keseluruhan, sentimen positif mendominasi dengan skor 83/100.",
    "Strategi counter content berhasil mendorong berita positif ke halaman pertama hasil pencarian.",
  ],

  socialMediaAccountStatusBefore: "Akun sosial media korporat belum aktif, tidak ada konten video yang diproduksi terkait reputasi.",
  socialMediaAccountStatusAfter: "Akun aktif dengan 296 video tersebar di berbagai platform, engagement meningkat signifikan.",
  socialMediaAccountStatusNote: "Komentar negatif non-organik masih muncul, namun komentar positif organik mulai meningkat.",
  socialMediaCounterTotalViews: "2.077.049",
  socialMediaCounterTotalEngagement: "96.523",

  serpScreenshotBefore: [],
  serpScreenshotBefore2: [],
  serpScreenshotAfter: [],
  serpScreenshotAfter2: [],
  serpCaptions: {
    before: "Before: Hasil pencarian sebelum optimasi – headline negatif mendominasi halaman 1",
    before2: "Before: Lanjutan hasil pencarian sebelum optimasi",
    after: "After: Hasil pencarian setelah optimasi – berita positif naik ke halaman 1",
    after2: "After: Lanjutan hasil pencarian setelah optimasi",
  },

  aiSummary:
    "Berdasarkan analisis terhadap 6 hasil pencarian, sentimen keseluruhan terhadap PT Pupuk Indonesia dan Rahmad Pribadi cenderung positif (skor 83/100). Dari total hasil, 4 artikel bernuansa positif mencakup penghargaan corporate governance, peresmian pabrik baru, digitalisasi command center, dan bantuan petani. Terdapat 1 artikel negatif terkait isu perjalanan dinas direksi BUMN, serta 1 artikel netral tentang modernisasi pabrik. Strategi kontra narasi melalui produksi berita positif berhasil mendominasi halaman pertama pencarian Google untuk keyword 'PT Pupuk Indonesia'. Namun, untuk keyword personal seperti 'Rahmad Pribadi', masih diperlukan upaya lebih lanjut untuk menekan headline negatif.",
  aiSummarySources: [
    "https://example.com/article-1",
    "https://example.com/article-2",
    "https://example.com/article-3",
  ],

  socialMediaStats: [
    { platform: "Instagram", url: "https://instagram.com/pupukindonesia", views: 850000, likes: 42000, comments: 3200, shares: 8500 },
    { platform: "TikTok", url: "https://tiktok.com/@pupukindonesia", views: 720000, likes: 35000, comments: 2800, shares: 12000 },
    { platform: "YouTube", url: "https://youtube.com/@pupukindonesia", views: 507049, likes: 19523, comments: 1500, shares: 3200 },
  ],

  productionStats: {
    views: "2.077.049",
    likes: "96.523",
    comments: "7.500",
    saved: "4.200",
    shares: "23.700",
  },

  counterContent: [
    { title: "Pupuk Indonesia Raih Penghargaan GCG", url: "https://example.com/counter-1", type: "news", publishDate: "2025-12-01" },
    { title: "Video: Inovasi Pabrik Pupuk Modern", url: "https://example.com/counter-2", type: "social", publishDate: "2025-12-05" },
    { title: "Blog: Kontribusi Pupuk Indonesia untuk Petani", url: "https://example.com/counter-3", type: "blog", publishDate: "2025-12-10" },
    { title: "Infografis Digitalisasi Command Center", url: "https://example.com/counter-4", type: "social", publishDate: "2025-12-15" },
  ],

  contentProduction: {
    newsAction: "Menerbitkan 32 Artikel di media utama untuk menenggelamkan pemberitaan negatif dan mengisi SERP.",
    newsResults:
      'Hasil SERP Google News menunjukkan keyword "Rahmad Pribadi" dan "Dirut Pupuk Indonesia" masih memunculkan headline bernuansa negatif di halaman 1 (tema dominan: aturan/perjalanan dinas–isu etik).\nSementara keyword "PT Pupuk Indonesia" didominasi hasil positif/netral (program, bantuan, penghargaan, digitalisasi/command center).\nPada halaman lanjutan, beberapa headline negatif masih muncul kembali pada kueri personal/jabatan.',
    socialAction: "Total video yang disebar di akun sosial media mencapai 296",
    socialResults:
      "a. Total Views: 2.077.049\nb. Total Engagement: 96.523 (Like, Comment, Saved, Share)\nc. Terdapat komentar negatif non-organik, namun komentar positif mulai muncul secara organik.",
    socialFollowup:
      "Melanjutkan produksi konten bertema: Penurunan biaya produksi pupuk dan Modernisasi pabrik tua untuk peningkatan efisiensi dan keberlanjutan.",
  },

  newsProduction: [
    { title: "Pupuk Indonesia Dorong Ketahanan Pangan Nasional", url: "https://example.com/news-1", date: "2025-11-20", platform: "Kompas" },
    { title: "Transformasi Digital Pupuk Indonesia", url: "https://example.com/news-2", date: "2025-11-25", platform: "Detik" },
    { title: "Pabrik Baru Pupuk Indonesia di Kalimantan", url: "https://example.com/news-3", date: "2025-12-01", platform: "CNN Indonesia" },
    { title: "Program CSR Pupuk Indonesia Bantu 10.000 Petani", url: "https://example.com/news-4", date: "2025-12-05", platform: "Tempo" },
    { title: "Rahmad Pribadi: Visi Pupuk Indonesia 2030", url: "https://example.com/news-5", date: "2025-12-10", platform: "Bisnis Indonesia" },
  ],

  socialMediaProduction: [
    { title: "Inovasi Pupuk untuk Indonesia Maju", url: "https://example.com/social-1", date: "2025-11-18", platform: "Instagram" },
    { title: "Hari Tani: Dedikasi Pupuk Indonesia", url: "https://example.com/social-2", date: "2025-11-22", platform: "TikTok" },
    { title: "Behind The Scene: Pabrik Modern Pupuk Indonesia", url: "https://example.com/social-3", date: "2025-12-02", platform: "YouTube" },
    { title: "Infografis: Kontribusi Pupuk Indonesia untuk Negeri", url: "https://example.com/social-4", date: "2025-12-08", platform: "Instagram" },
  ],

  lampiranImages: [],
};
