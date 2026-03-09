import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { platform, post_url, caption, hashtags, top_comments, image_url, keyword, simplify } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = simplify
      ? `Kamu adalah analis monitoring digital. Tugas kamu adalah membuat ringkasan ULTRA SINGKAT dalam 1 paragraf pendek (maksimal 3 kalimat) gaya pesan WhatsApp. Bahasa Indonesia, natural, lugas. Format:

Status: [Aman / Waspada / Perlu Perhatian].
[Ringkasan singkat situasi dalam 2-3 kalimat].

ATURAN STATUS:
- AMAN: Percakapan terbatas di komentar, tone netral
- WASPADA: Percakapan mulai ramai, narasi mulai mengkritik keyword/akun yang dimonitor
- PERLU PERHATIAN: Narasi menyerang, risiko reputasi, percakapan melebar

Gunakan tool calling untuk mengembalikan hasilnya.`
      : `Kamu adalah analis monitoring digital. Tugas kamu adalah menganalisis konten media sosial dan membuat situational brief singkat gaya pesan WhatsApp untuk update cepat ke pimpinan.

ANALISIS yang harus dilakukan (JANGAN ditampilkan sebagai analisis teknis):
- Apa isi postingan
- Apakah keyword/akun yang dimonitor disebut langsung atau tidak langsung
- Tone postingan
- Arah komentar
- Apakah percakapan terbatas atau menyebar
- Apakah narasinya kritik, spekulasi, diskusi, atau serangan

OUTPUT harus mengikuti template ini PERSIS:

Status: [Aman / Waspada / Perlu Perhatian]

Update cepat.
Ada postingan di [platform] yang membahas [keyword/akun] terkait [isu utama].
Narasinya mengarah ke [kritik / opini / spekulasi / diskusi].
Percakapannya terlihat [masih terbatas / mulai ramai / mulai melebar].
Untuk saat ini tim sedang monitor dan melihat arah percakapannya.
[Kalimat penutup situasional].

ATURAN:
- Maksimal 5-6 baris
- Bahasa Indonesia natural, lugas, BUKAN gaya laporan formal
- Jangan gunakan angka/statistik kecuali sangat perlu
- Jangan gunakan format dashboard

ATURAN STATUS:
- AMAN: Percakapan terbatas di komentar, tone netral
- WASPADA: Percakapan mulai ramai, narasi mulai mengkritik keyword/akun
- PERLU PERHATIAN: Narasi menyerang, risiko reputasi, percakapan melebar

Gunakan tool calling untuk mengembalikan hasilnya.`;

    const userContent: any[] = [];
    
    let textParts = `Platform: ${platform}\n`;
    if (post_url) textParts += `URL: ${post_url}\n`;
    if (keyword) textParts += `Keyword/Akun yang dimonitor: ${keyword}\n`;
    if (caption) textParts += `Caption/Teks:\n${caption}\n`;
    if (hashtags) textParts += `Hashtags: ${hashtags}\n`;
    if (top_comments) textParts += `Komentar:\n${top_comments}\n`;

    userContent.push({ type: "text", text: textParts });

    if (image_url) {
      userContent.push({
        type: "image_url",
        image_url: { url: image_url }
      });
      userContent.push({ type: "text", text: "Analisis juga konten dari gambar/screenshot di atas." });
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_brief",
            description: "Return the generated brief result",
            parameters: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["Aman", "Waspada", "Perlu Perhatian"] },
                brief: { type: "string", description: "The full WhatsApp-style brief text" },
                issue_summary: { type: "string", description: "One-line summary of the issue" },
              },
              required: ["status", "brief", "issue_summary"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_brief" } },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Coba lagi dalam beberapa saat." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit AI habis. Silakan top up di Lovable workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: parse from content
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ status: "Aman", brief: content, issue_summary: "Brief generated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
