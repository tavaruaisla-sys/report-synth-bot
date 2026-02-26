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
    const { keywords, negativeKeywords, searchResults, stats, brandName, googleScreenshots } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah AI analyst untuk brand reputation monitoring. Tugas kamu adalah menulis deskripsi kondisi pemberitaan (NEWS) sebuah brand dalam Bahasa Indonesia yang profesional, objektif, dan SANGAT RINGKAS berdasarkan data hasil pencarian Google.

SUMBER DATA (WAJIB):
Anda hanya boleh menggunakan DATA yang diberikan user (hasil pencarian: judul/sumber/tanggal/snippet).

GAYA & FORMAT:
- Bahasa Indonesia baku, ringkas, eksekutif.
- Gunakan markdown bold (**) untuk institusi/angka/istilah kunci.
- Gunakan bullet "-" (bukan numbering).
- Tidak ada emoji.

BATAS PANJANG (SANGAT KETAT):
- Tepat 3 bullet points.
- MAKSIMAL 120 KARAKTER per bullet (termasuk spasi).
- TOTAL panjang seluruh output (3 bullet) TIDAK BOLEH lebih dari 360 karakter.
- JANGAN menulis kalimat panjang. Langsung ke inti.

LOGIKA PENULISAN (WAJIB):
1. **Bullet 1**: Status negatif terkini. Jika ada, jelaskan singkat. Jika tidak, tulis "Tidak terdapat pemberitaan negatif baru yang signifikan."
2. **Bullet 2**: Isu negatif lama. Jika ada, sebut trennya. Jika tidak, tulis "Belum ada data pembanding pada input ini."
3. **Bullet 3**: Tema positif/netral. Sebutkan 3-4 topik utama saja.

INSTRUKSI KHUSUS:
- Potong kalimat jika perlu agar muat dalam batas karakter.
- Hindari kata sambung yang tidak perlu.
- OUTPUT HARUS PERSIS 3 BULLET POINTS.

CONTOH OUTPUT RINGKAS:
- Isu negatif baru terkait **[ISU]** oleh **[PIHAK]** masih bersifat terbatas tanpa eskalasi signifikan.
- Isu lama **[ISU LAMA]** cenderung mereda dan tidak memicu pemberitaan lanjutan.
- Berita positif didominasi topik: **[TOPIK 1]**, **[TOPIK 2]**, dan **[TOPIK 3]**.`;

    const hasScreenshots = googleScreenshots && googleScreenshots.length > 0;

    let userPromptText = `Buatkan deskripsi kondisi pemberitaan (NEWS) untuk brand "${brandName || 'Brand'}":

**Keywords Brand**: ${keywords.join(', ')}
**Keywords Negatif yang Dipantau**: ${negativeKeywords.join(', ')}

**Statistik Pencarian**:
- Total hasil: ${stats?.totalResults || 0}
- Hasil negatif: ${stats?.negativeFound || 0}
- Hasil positif: ${stats?.positiveFound || 0}
- Sentiment score: ${stats?.sentimentScore || 100}%

**Hasil Pencarian**:
${searchResults || 'Tidak ada data teks hasil pencarian'}`;

    if (hasScreenshots) {
      userPromptText += `\n\n**PENTING**: ${googleScreenshots.length} screenshot halaman pencarian Google dilampirkan. Analisis secara visual setiap screenshot untuk mengidentifikasi judul berita, sumber, dan sentimen yang terlihat. Prioritaskan informasi dari screenshot karena lebih akurat.`;
    }

    userPromptText += `\n\nTulis deskripsi pemberitaan sesuai template yang diberikan.`;

    // Build message content - support multimodal if screenshots provided
    let userContent: any;
    
    if (hasScreenshots) {
      // Multimodal: text + images
      userContent = [
        { type: "text", text: userPromptText },
        ...googleScreenshots.map((base64Img: string) => {
          // Extract mime type and data from base64 data URL
          const matches = base64Img.match(/^data:(image\/[^;]+);base64,(.+)$/);
          if (matches) {
            return {
              type: "image_url",
              image_url: {
                url: base64Img,
              },
            };
          }
          // Fallback: assume it's already a proper URL or raw base64
          return {
            type: "image_url",
            image_url: {
              url: base64Img.startsWith('data:') ? base64Img : `data:image/png;base64,${base64Img}`,
            },
          };
        }),
      ];
    } else {
      userContent = userPromptText;
    }

    console.log(`Generating news description... (with ${hasScreenshots ? googleScreenshots.length : 0} screenshots)`);

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
          { role: "user", content: userContent },
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
