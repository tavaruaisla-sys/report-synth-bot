import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { briefService, DBBrief } from "@/services/briefService";
import { Zap, Copy, RefreshCw, Minimize2, Upload, ImageIcon, Trash2, Clock, Loader2, ExternalLink, X } from "lucide-react";
import { format } from "date-fns";

const PLATFORMS = [
  "TikTok", "Twitter/X", "Instagram", "YouTube", "Facebook", "News Website",
];

export default function IssueBriefPage() {
  const { toast } = useToast();

  // Input state
  const [platform, setPlatform] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [topComments, setTopComments] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // Output state
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefResult, setBriefResult] = useState<{ status: string; brief: string; issue_summary: string } | null>(null);
  const [simplifiedBrief, setSimplifiedBrief] = useState<string | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);

  // History
  const [briefs, setBriefs] = useState<DBBrief[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    loadBriefs();
  }, []);

  const loadBriefs = async () => {
    setIsLoadingHistory(true);
    const data = await briefService.getBriefs();
    setBriefs(data);
    setIsLoadingHistory(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const extractTextFromImages = async () => {
    if (!imageFiles.length) return;
    setIsExtracting(true);
    try {
      const extractedTexts: string[] = [];
      for (const file of imageFiles) {
        const fileName = `brief-${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("report-images").getPublicUrl(uploadData.path);

        const { data, error } = await supabase.functions.invoke("extract-image-text", {
          body: { image_url: urlData.publicUrl },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        extractedTexts.push(data.extracted_text);
      }

      setCaption((prev) => (prev ? prev + "\n\n" : "") + extractedTexts.join("\n\n---\n\n"));
      toast({ title: "Teks Diekstrak", description: `Teks dari ${imageFiles.length} gambar berhasil ditambahkan.` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Gagal mengekstrak teks.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async (simplify = false) => {
    if (!platform) {
      toast({ title: "Platform wajib dipilih", variant: "destructive" });
      return;
    }
    if (!caption && !imageFile) {
      toast({ title: "Isi caption atau upload gambar", variant: "destructive" });
      return;
    }

    if (simplify) setIsSimplifying(true);
    else setIsGenerating(true);

    try {
      let imageUrl: string | undefined;
      if (imageFile && imagePreview) {
        const fileName = `brief-${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, imageFile);
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from("report-images").getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }
      }

      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: { platform, post_url: postUrl, caption, hashtags, top_comments: topComments, image_url: imageUrl, keyword, simplify },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (simplify && briefResult) {
        setSimplifiedBrief(data.brief);
      } else {
        setBriefResult(data);
        setSimplifiedBrief(null);
        // Save to DB
        await briefService.createBrief({
          platform,
          post_url: postUrl || undefined,
          post_caption: caption || undefined,
          issue_summary: data.issue_summary,
          status: data.status,
          generated_brief: data.brief,
        });
        await loadBriefs();
      }

      toast({ title: "Brief Generated!", description: `Status: ${data.status}` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Gagal generate brief.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
      setIsSimplifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Tersalin!", description: "Brief sudah dicopy ke clipboard." });
  };

  const handleDeleteBrief = async (id: string) => {
    const ok = await briefService.deleteBrief(id);
    if (ok) {
      setBriefs((p) => p.filter((b) => b.id !== id));
      toast({ title: "Brief Dihapus" });
    }
  };

  const statusColor = (s: string) => {
    if (s === "Aman") return "bg-green-500/15 text-green-700 border-green-500/30";
    if (s === "Waspada") return "bg-yellow-500/15 text-yellow-700 border-yellow-500/30";
    return "bg-red-500/15 text-red-700 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Issue Brief Generator</h1>
            <p className="text-sm text-muted-foreground">Generate WhatsApp-style situational brief dalam 30 detik</p>
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform *</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue placeholder="Pilih platform" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keyword / Akun yang Dimonitor *</Label>
                <Input placeholder="Contoh: Arsjad Rasjid, Pupuk Indonesia" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Post URL</Label>
              <Input placeholder="https://..." value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Caption / Teks Post *</Label>
              <Textarea rows={5} placeholder="Paste teks/caption postingan di sini..." value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hashtags <span className="text-muted-foreground">(opsional)</span></Label>
                <Input placeholder="#contoh #hashtag" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Upload Screenshot <span className="text-muted-foreground">(opsional)</span></Label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    {imageFile ? imageFile.name : "Pilih gambar..."}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {imageFile && (
                    <Button variant="outline" size="sm" onClick={extractTextFromImage} disabled={isExtracting}>
                      {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Ekstrak
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg max-h-40 object-cover border" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Top Comments <span className="text-muted-foreground">(opsional)</span></Label>
              <Textarea rows={3} placeholder="Paste komentar-komentar utama di sini..." value={topComments} onChange={(e) => setTopComments(e.target.value)} />
            </div>

            <Button variant="hero" size="lg" className="w-full" onClick={() => handleGenerate(false)} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Zap className="h-5 w-5 mr-2" />}
              Generate Brief
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {briefResult && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Generated Brief</CardTitle>
              <Badge className={statusColor(briefResult.status)}>{briefResult.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* WhatsApp-style bubble */}
              <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-xl rounded-tl-sm p-4 shadow-sm max-w-[95%]">
                <p className="text-sm text-[#111b21] dark:text-[#e9edef] whitespace-pre-line leading-relaxed">
                  {briefResult.brief}
                </p>
                <p className="text-[10px] text-[#667781] dark:text-[#8696a0] text-right mt-2">
                  {format(new Date(), "HH:mm")}
                </p>
              </div>

              {simplifiedBrief && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Simplified Version:</p>
                  <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-xl rounded-tl-sm p-4 shadow-sm max-w-[95%]">
                    <p className="text-sm text-[#111b21] dark:text-[#e9edef] whitespace-pre-line leading-relaxed">
                      {simplifiedBrief}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(simplifiedBrief || briefResult.brief)}>
                  <Copy className="h-4 w-4 mr-1" /> Copy to WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleGenerate(false)} disabled={isGenerating}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleGenerate(true)} disabled={isSimplifying}>
                  {isSimplifying ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Minimize2 className="h-4 w-4 mr-1" />}
                  Simplify for Audience
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brief History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" /> Brief History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex justify-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : briefs.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Zap className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Belum ada brief yang dibuat</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {briefs.map((b) => (
                    <div key={b.id} className="p-4 border rounded-lg bg-card hover:bg-accent/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{b.platform}</Badge>
                            <Badge className={`text-xs ${statusColor(b.status)}`}>{b.status}</Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(b.created_at), "dd MMM yyyy HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm font-medium truncate">{b.issue_summary || "—"}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{b.generated_brief}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(b.generated_brief)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteBrief(b.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
