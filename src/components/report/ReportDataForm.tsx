import { useState, useRef } from "react";
import { Plus, Trash2, Upload, Sparkles, FileText, Link, BarChart2, Image, Eye, Newspaper, Share2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportFormData, ReportData, SocialMediaStat, CounterContentItem, ProductionLink } from "@/lib/pdf/types";
import ReportPreview from "./ReportPreview";

interface ReportDataFormProps {
  formData: ReportFormData;
  onUpdateFormData: (updates: Partial<ReportFormData>) => void;
  onAddSocialMediaStat: (stat: SocialMediaStat) => void;
  onRemoveSocialMediaStat: (index: number) => void;
  onAddCounterContent: (content: CounterContentItem) => void;
  onRemoveCounterContent: (index: number) => void;
  onAddProductionLink: (link: ProductionLink, type: 'news' | 'social') => void;
  onRemoveProductionLink: (index: number, type: 'news' | 'social') => void;
  aiSummary: string;
  onGenerateAiSummary: () => void;
  isGeneratingAiSummary: boolean;
  onGenerateNewsDescription: (googleScreenshots?: string[]) => void;
  isGeneratingNewsDesc: boolean;
  onGenerateReport: () => void;
  isGenerating: boolean;
  previewData: ReportData;
  onUpdateScreenshotPreview: (file: File, type: 'before' | 'before2' | 'after' | 'after2') => void;
  onRemoveScreenshotPreview: (index: number, type: 'before' | 'before2' | 'after' | 'after2') => void;
  googleScreenshots?: { file: File; preview: string }[];
  onSave: () => void;
  isSaving: boolean;
}

const ReportDataForm = ({
  formData,
  onUpdateFormData,
  onAddSocialMediaStat,
  onRemoveSocialMediaStat,
  onAddCounterContent,
  onRemoveCounterContent,
  onAddProductionLink,
  onRemoveProductionLink,
  aiSummary,
  onGenerateAiSummary,
  isGeneratingAiSummary,
  onGenerateNewsDescription,
  isGeneratingNewsDesc,
  onGenerateReport,
  isGenerating,
  previewData,
  onUpdateScreenshotPreview,
  onRemoveScreenshotPreview,
  googleScreenshots: externalScreenshots,
  onSave,
  isSaving,
}: ReportDataFormProps) => {
  // Temporary state for new items
  const [newSocialStat, setNewSocialStat] = useState<Partial<SocialMediaStat>>({
    platform: '',
    url: '',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });
  
  const [newCounter, setNewCounter] = useState<Partial<CounterContentItem>>({
    title: '',
    url: '',
    type: 'news',
  });
  
  const [newProductionLink, setNewProductionLink] = useState<Partial<ProductionLink>>({
    title: '',
    url: '',
  });
  
  const [productionType, setProductionType] = useState<'news' | 'social'>('news');

  // Google screenshot uploads for AI analysis
  const [googleScreenshots, setGoogleScreenshots] = useState<{ file: File; preview: string }[]>([]);
  const googleScreenshotInputRef = useRef<HTMLInputElement>(null);

  const handleGoogleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGoogleScreenshots(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = '';
  };

  const removeGoogleScreenshot = (index: number) => {
    setGoogleScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateWithScreenshots = () => {
    const localImages = googleScreenshots.map(s => s.preview);
    const externalImages = (externalScreenshots || []).map(s => s.preview);
    const allImages = [...externalImages, ...localImages];
    onGenerateNewsDescription(allImages.length > 0 ? allImages : undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'serpScreenshotBefore' | 'serpScreenshotBefore2' | 'serpScreenshotAfter' | 'serpScreenshotAfter2') => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentFiles = formData[field] || [];
      // Cast currentFiles to array to avoid type error if it's undefined
      const newFiles = [...(Array.isArray(currentFiles) ? currentFiles : []), ...files];
      
      onUpdateFormData({ [field]: newFiles });
      
      const type = field === 'serpScreenshotBefore' ? 'before' : 
                   field === 'serpScreenshotBefore2' ? 'before2' :
                   field === 'serpScreenshotAfter' ? 'after' : 'after2';
      files.forEach(file => {
        onUpdateScreenshotPreview(file, type);
      });
    }
    // Reset input value to allow uploading same file again
    if (e.target) e.target.value = '';
  };

  const handleRemoveScreenshot = (index: number, field: 'serpScreenshotBefore' | 'serpScreenshotBefore2' | 'serpScreenshotAfter' | 'serpScreenshotAfter2') => {
    const currentFiles = formData[field];
    if (Array.isArray(currentFiles)) {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onUpdateFormData({ [field]: newFiles });
      
      const type = field === 'serpScreenshotBefore' ? 'before' : 
                   field === 'serpScreenshotBefore2' ? 'before2' :
                   field === 'serpScreenshotAfter' ? 'after' : 'after2';
      onRemoveScreenshotPreview(index, type);
    }
  };

  const handleAddSocialStat = () => {
    if (newSocialStat.platform && newSocialStat.url) {
      onAddSocialMediaStat(newSocialStat as SocialMediaStat);
      setNewSocialStat({ platform: '', url: '', views: 0, likes: 0, comments: 0, shares: 0 });
    }
  };

  const handleAddCounter = () => {
    if (newCounter.title && newCounter.url) {
      onAddCounterContent(newCounter as CounterContentItem);
      setNewCounter({ title: '', url: '', type: 'news' });
    }
  };

  const handleAddProductionLink = () => {
    if (newProductionLink.title && newProductionLink.url) {
      onAddProductionLink(newProductionLink as ProductionLink, productionType);
      setNewProductionLink({ title: '', url: '' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left Column - Form */}
      <div className="w-1/2 min-w-0 border-r border-border">
        <ScrollArea className="h-full">
          <Tabs defaultValue="basic" className="p-6 pt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="text-xs">
                <span className="hidden sm:inline">Slide 1-2:</span> Cover
              </TabsTrigger>
              <TabsTrigger value="screenshots" className="text-xs">
                <span className="hidden sm:inline">Slide 4-5:</span> SERP
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <span className="hidden sm:inline">Slide 6-7:</span> AI Result
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <span className="hidden sm:inline">Slide 9:</span> Data
              </TabsTrigger>
              <TabsTrigger value="production" className="text-xs">
                <span className="hidden sm:inline">Slide 10+:</span> Links
              </TabsTrigger>
            </TabsList>
            
            {/* Slide 1-2: Cover & REPUTATION RECOVERY - CURRENT STATUS */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileText className="h-4 w-4" />
                <span>Slide 1: Cover | Slide 2: REPUTATION RECOVERY - CURRENT STATUS</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    value={formData.reportTitle}
                    onChange={(e) => onUpdateFormData({ reportTitle: e.target.value })}
                    placeholder="RP REPORT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => onUpdateFormData({ brandName: e.target.value })}
                    placeholder="Nama Brand"
                    required
                  />
                </div>
              </div>
              
              {/* Slide 2: REPUTATION RECOVERY - CURRENT STATUS */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    Slide 2: REPUTATION RECOVERY - CURRENT STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>NEWS / PEMBERITAAN (Bullet Points)</Label>
                      <Button
                        onClick={handleGenerateWithScreenshots}
                        disabled={isGeneratingNewsDesc}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isGeneratingNewsDesc ? "Generating..." : "Generate AI"}
                      </Button>
                    </div>
                    
                    {/* Google Screenshot Upload for AI Context */}
                    <div className="rounded-lg border border-dashed border-accent/40 bg-accent/5 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                          <ImagePlus className="h-3.5 w-3.5" />
                          Upload Screenshot Google (Opsional - untuk hasil AI lebih akurat)
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => googleScreenshotInputRef.current?.click()}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Tambah
                        </Button>
                        <input
                          ref={googleScreenshotInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGoogleScreenshotUpload}
                          className="hidden"
                        />
                      </div>
                      
                      {googleScreenshots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {googleScreenshots.map((ss, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border">
                              <img
                                src={ss.preview}
                                alt={`Google screenshot ${index + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGoogleScreenshot(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <p className="text-[10px] text-muted-foreground p-1 truncate">{ss.file.name}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Upload screenshot halaman pencarian Google agar AI bisa menganalisis konten visual untuk deskripsi yang lebih akurat.
                        </p>
                      )}
                    </div>
                    
                    <Textarea
                      value={formData.newsBulletPoints.join('\n')}
                      onChange={(e) => onUpdateFormData({ newsBulletPoints: e.target.value.split('\n') })}
                      placeholder="Masukkan poin-poin berita, satu per baris..."
                      rows={6}
                    />
                  </div>

                  {/* Social Media Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-base font-semibold text-primary">SOSIAL MEDIA - TIKTOK</Label>
                    
                    <div className="space-y-3 pl-2 border-l-2 border-muted">
                      <Label className="font-medium">Aktivitas Akun Lawan</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Sebelum</Label>
                          <Input 
                            value={formData.socialMediaAccountStatusBefore}
                            onChange={(e) => onUpdateFormData({ socialMediaAccountStatusBefore: e.target.value })}
                            placeholder="Contoh: 120 posting dengan total 2.746.077 views"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Sesudah</Label>
                          <Input 
                            value={formData.socialMediaAccountStatusAfter}
                            onChange={(e) => onUpdateFormData({ socialMediaAccountStatusAfter: e.target.value })}
                            placeholder="Contoh: 145 posting dengan total 3.124.896 views"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Catatan (Italic)</Label>
                          <Textarea 
                            value={formData.socialMediaAccountStatusNote}
                            onChange={(e) => onUpdateFormData({ socialMediaAccountStatusNote: e.target.value })}
                            placeholder="Contoh: Terdapat peningkatan volume konten..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pl-2 border-l-2 border-muted">
                      <Label className="font-medium">Aktivitas Counter Kita</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Total Views</Label>
                          <Input 
                            value={formData.socialMediaCounterTotalViews}
                            onChange={(e) => onUpdateFormData({ socialMediaCounterTotalViews: e.target.value })}
                            placeholder="Contoh: 2.077.049"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Total Engagement</Label>
                          <Input 
                            value={formData.socialMediaCounterTotalEngagement}
                            onChange={(e) => onUpdateFormData({ socialMediaCounterTotalEngagement: e.target.value })}
                            placeholder="Contoh: 96.523 (like, comment...)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Slide 4-5: Screenshots SERP */}
            <TabsContent value="screenshots" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Image className="h-4 w-4" />
                <span>Slide 4: SERP Before | Slide 5: SERP After</span>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Google Search Results Screenshots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Slide 4: Before */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <span className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded">Slide 4</span>
                        Before - Hasil Negatif
                      </Label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotBefore')}
                          className="hidden"
                          id="screenshot-before"
                        />
                        <label htmlFor="screenshot-before" className="cursor-pointer block w-full h-full">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload screenshots (Multiple allowed)
                          </p>
                        </label>
                      </div>

                      {/* Preview Grid */}
                      {previewData.serpScreenshotBefore && previewData.serpScreenshotBefore.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {previewData.serpScreenshotBefore.map((src, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border bg-muted">
                              <img
                                src={src}
                                alt={`Before screenshot ${index + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(index, 'serpScreenshotBefore')}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Input
                        value={formData.serpCaptionBefore}
                        onChange={(e) => onUpdateFormData({ serpCaptionBefore: e.target.value })}
                        placeholder="Contoh: Before - 3 Feb 2026 (Keyword: dirut pupuk indonesia)"
                      />
                    </div>
                    
                    {/* Slide 5: After */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">Slide 5</span>
                        After - Hasil Bersih
                      </Label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotAfter')}
                          className="hidden"
                          id="screenshot-after"
                        />
                        <label htmlFor="screenshot-after" className="cursor-pointer block w-full h-full">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload screenshots (Multiple allowed)
                          </p>
                        </label>
                      </div>

                      {/* Preview Grid */}
                      {previewData.serpScreenshotAfter && previewData.serpScreenshotAfter.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {previewData.serpScreenshotAfter.map((src, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border bg-muted">
                              <img
                                src={src}
                                alt={`After screenshot ${index + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(index, 'serpScreenshotAfter')}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Input
                        value={formData.serpCaptionAfter}
                        onChange={(e) => onUpdateFormData({ serpCaptionAfter: e.target.value })}
                        placeholder="Contoh: After - 3 Feb 2026 (Hasil positif mendominasi)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Slide 6-7: AI Result */}
            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Image className="h-4 w-4" />
                <span>Slide 6: AI Result Before | Slide 7: AI Result After</span>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    AI Result Screenshots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Slide 6: AI Result - Before */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <span className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded">Slide 6</span>
                        AI Result - Before
                      </Label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotBefore2')}
                          className="hidden"
                          id="screenshot-before-2"
                        />
                        <label htmlFor="screenshot-before-2" className="cursor-pointer block w-full h-full">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload screenshots (Multiple allowed)
                          </p>
                        </label>
                      </div>

                      {/* Preview Grid */}
                      {previewData.serpScreenshotBefore2 && previewData.serpScreenshotBefore2.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {previewData.serpScreenshotBefore2.map((src, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border bg-muted">
                              <img
                                src={src}
                                alt={`Before 2 screenshot ${index + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(index, 'serpScreenshotBefore2')}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Input
                        value={formData.serpCaptionBefore2}
                        onChange={(e) => onUpdateFormData({ serpCaptionBefore2: e.target.value })}
                        placeholder="Contoh: AI Result Before - 3 Feb 2026"
                      />
                    </div>

                    {/* Slide 7: AI Result - After */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <Label className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">Slide 7</span>
                        AI Result - After
                      </Label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotAfter2')}
                          className="hidden"
                          id="screenshot-after-2"
                        />
                        <label htmlFor="screenshot-after-2" className="cursor-pointer block w-full h-full">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload screenshots (Multiple allowed)
                          </p>
                        </label>
                      </div>

                      {/* Preview Grid */}
                      {previewData.serpScreenshotAfter2 && previewData.serpScreenshotAfter2.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {previewData.serpScreenshotAfter2.map((src, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border bg-muted">
                              <img
                                src={src}
                                alt={`After 2 screenshot ${index + 1}`}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(index, 'serpScreenshotAfter2')}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Input
                        value={formData.serpCaptionAfter2}
                        onChange={(e) => onUpdateFormData({ serpCaptionAfter2: e.target.value })}
                        placeholder="Contoh: AI Result After - 3 Feb 2026"
                      />
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Slide 9: Data Summary */}
            <TabsContent value="data" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BarChart2 className="h-4 w-4" />
                <span>Slide 9: Data Summary & Social Media Statistics</span>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Konten yang Diproduksi (Views, Engagement)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Masukkan statistik konten counter yang sudah diproduksi (TikTok, Instagram, YouTube, dll)
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    <Input
                      placeholder="Platform"
                      value={newSocialStat.platform}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, platform: e.target.value }))}
                    />
                    <Input
                      placeholder="URL"
                      value={newSocialStat.url}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Views"
                      value={newSocialStat.views || ''}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="Like"
                      value={newSocialStat.likes || ''}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="Comment"
                      value={newSocialStat.comments || ''}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                    />
                    <Button onClick={handleAddSocialStat} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.socialMediaStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="font-medium text-sm">{stat.platform}</span>
                      <span className="text-xs text-muted-foreground">
                        Views: {stat.views.toLocaleString()} | Like: {stat.likes.toLocaleString()} | Comment: {stat.comments.toLocaleString()}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto h-8 w-8"
                        onClick={() => onRemoveSocialMediaStat(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.socialMediaStats.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">Total:</p>
                      <div className="grid grid-cols-4 gap-2 mt-1 text-sm">
                        <div>Views: <span className="font-bold">{formData.socialMediaStats.reduce((a, b) => a + b.views, 0).toLocaleString()}</span></div>
                        <div>Like: <span className="font-bold">{formData.socialMediaStats.reduce((a, b) => a + b.likes, 0).toLocaleString()}</span></div>
                        <div>Comment: <span className="font-bold">{formData.socialMediaStats.reduce((a, b) => a + b.comments, 0).toLocaleString()}</span></div>
                        <div>Share: <span className="font-bold">{formData.socialMediaStats.reduce((a, b) => a + b.shares, 0).toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            
              {/* Counter Content */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Counter Content (Artikel/Konten Positif)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Title"
                      value={newCounter.title}
                      onChange={(e) => setNewCounter(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="URL"
                      value={newCounter.url}
                      onChange={(e) => setNewCounter(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <Select 
                      value={newCounter.type} 
                      onValueChange={(v) => setNewCounter(prev => ({ ...prev, type: v as 'news' | 'social' | 'blog' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddCounter} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.counterContent.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded">{item.type}</span>
                      <span className="font-medium truncate">{item.title}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto h-8 w-8"
                        onClick={() => onRemoveCounterContent(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Slide 10+: Production Links */}
            <TabsContent value="production" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Share2 className="h-4 w-4" />
                <span>Slide 10+: Production Results (News & Social Media Links)</span>
              </div>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    Produksi & Distribusi Konten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Link artikel news dan postingan social media yang sudah dipublikasikan
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Title"
                      value={newProductionLink.title}
                      onChange={(e) => setNewProductionLink(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="URL"
                      value={newProductionLink.url}
                      onChange={(e) => setNewProductionLink(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <Select 
                      value={productionType} 
                      onValueChange={(v) => setProductionType(v as 'news' | 'social')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddProductionLink} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.newsProduction.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">News Production:</p>
                      {formData.newsProduction.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-1">
                          <span className="font-medium truncate">{item.title}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-auto h-8 w-8"
                            onClick={() => onRemoveProductionLink(index, 'news')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.socialMediaProduction.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Social Media Production:</p>
                      {formData.socialMediaProduction.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-1">
                          <span className="font-medium truncate">{item.title}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-auto h-8 w-8"
                            onClick={() => onRemoveProductionLink(index, 'social')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
          </Tabs>
          
          {/* Generate Button - Fixed at bottom of form */}
          <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3">
            <Button onClick={onSave} disabled={isSaving || !formData.brandName} variant="outline" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={onGenerateReport} disabled={isGenerating || !formData.brandName} className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Right Column - Realtime Preview */}
      <div className="w-1/2 flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <Eye className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Realtime Preview</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">Scroll untuk semua slide</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <ReportPreview data={previewData} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ReportDataForm;
