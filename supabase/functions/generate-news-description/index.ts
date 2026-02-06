import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, negativeKeywords, searchResults, stats, brandName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah AI analyst untuk brand reputation monitoring. Tugas kamu adalah menulis deskripsi singkat kondisi pemberitaan (NEWS) sebuah brand dalam Bahasa Indonesia yang profesional dan objektif.

Gunakan gaya penulisan dan struktur berikut sebagai template:

---
Terdapat pemberitaan negatif baru terkait isu [ISU NEGATIF UTAMA] yang diikuti dengan informasi [DETAIL ISU]. Pemberitaan masih bersifat [SIFAT: tematik/viral/masif] dan [JANGKAUAN: terbatas/luas/lintas media], serta [STATUS ESKALASI: belum menunjukkan eskalasi signifikan lintas media / sudah menunjukkan eskalasi di berbagai media].

Pemberitaan negatif sebelumnya terkait isu [ISU NEGATIF LAMA] cenderung [TREN: menurun/stabil/meningkat] dan [DAMPAK: tidak membentuk gelombang pemberitaan lanjutan / masih membentuk gelombang pemberitaan].

Pemberitaan positif dan netral tetap mendominasi ruang pencarian dan pemberitaan, dengan fokus pada: [DAFTAR TOPIK POSITIF/NETRAL dipisahkan koma].
---

INSTRUKSI PENTING:
- Analisis hasil pencarian yang diberikan untuk mengidentifikasi isu-isu negatif, positif, dan netral
- Sesuaikan template di atas berdasarkan data aktual dari hasil pencarian
- Jika tidak ada pemberitaan negatif, sesuaikan narasi menjadi positif
- Tulis dalam 2-3 paragraf, ringkas dan profesional
- JANGAN gunakan format markdown (bold, italic, bullet points). Tulis sebagai paragraf narasi biasa
- Langsung tulis deskripsinya tanpa judul atau pembuka`;

    const userPrompt = `Buatkan deskripsi kondisi pemberitaan (NEWS) untuk brand "${brandName || 'Brand'}":

**Keywords Brand**: ${keywords.join(', ')}
**Keywords Negatif yang Dipantau**: ${negativeKeywords.join(', ')}

**Statistik Pencarian**:
- Total hasil: ${stats?.totalResults || 0}
- Hasil negatif: ${stats?.negativeFound || 0}
- Hasil positif: ${stats?.positiveFound || 0}
- Sentiment score: ${stats?.sentimentScore || 100}%

**Hasil Pencarian**:
${searchResults}

Tulis deskripsi pemberitaan sesuai template yang diberikan.`;

    console.log("Generating news description...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content;

    if (!description) {
      throw new Error("No description generated");
    }

    console.log("News description generated successfully");

    return new Response(
      JSON.stringify({ success: true, description }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate news description error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
