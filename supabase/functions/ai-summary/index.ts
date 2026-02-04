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
    const { keywords, negativeKeywords, searchResults, stats } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah AI analyst untuk brand reputation monitoring. Tugas kamu adalah menganalisis hasil pencarian Google dan memberikan ringkasan profesional dalam Bahasa Indonesia.

Berikan analisis dengan format berikut:
1. **Ringkasan Umum**: Gambaran singkat kondisi reputasi brand berdasarkan hasil pencarian
2. **Temuan Kunci**: Poin-poin penting dari hasil pencarian (positif dan negatif)
3. **Rekomendasi**: Saran tindakan berdasarkan hasil analisis

Gunakan bahasa profesional dan objektif. Fokus pada fakta yang ditemukan dalam hasil pencarian.`;

    const userPrompt = `Analisis hasil pencarian berikut untuk brand monitoring:

**Keywords Brand**: ${keywords.join(', ')}
**Keywords Negatif yang Dipantau**: ${negativeKeywords.join(', ')}

**Statistik**:
- Total hasil: ${stats?.totalResults || 0}
- Hasil negatif: ${stats?.negativeFound || 0}
- Hasil positif: ${stats?.positiveFound || 0}
- Sentiment score: ${stats?.sentimentScore || 100}%

**Hasil Pencarian**:
${searchResults}

Berikan ringkasan analisis yang komprehensif dalam Bahasa Indonesia.`;

    console.log("Generating AI summary...");

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
        max_tokens: 1500,
        temperature: 0.7,
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
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error("No summary generated");
    }

    console.log("AI summary generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        summary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI summary error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
