import { useState } from "react";
import { Plus, Trash2, Upload, Sparkles, FileText, Link, BarChart2, Image, Eye, Newspaper, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  isOpen: boolean;
  onClose: () => void;
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
  onGenerateNewsDescription: () => void;
  isGeneratingNewsDesc: boolean;
  onGenerateReport: () => void;
  isGenerating: boolean;
  previewData: ReportData;
  onUpdateScreenshotPreview: (file: File, type: 'before' | 'after') => void;
}

const ReportDataForm = ({
  isOpen,
  onClose,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'serpScreenshotBefore' | 'serpScreenshotAfter') => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdateFormData({ [field]: file });
      // Update preview
      const type = field === 'serpScreenshotBefore' ? 'before' : 'after';
      onUpdateScreenshotPreview(file, type);
    }
  };

  const handleAddSocialStat = () => {
    if (newSocialStat.platform && newSocialStat.url) {
      onAddSocialMediaStat(newSocialStat as SocialMediaStat);
      setNewSocialStat({
        platform: '',
        url: '',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    }
  };

  const handleAddCounter = () => {
    if (newCounter.title && newCounter.url) {
      onAddCounterContent(newCounter as CounterContentItem);
      setNewCounter({
        title: '',
        url: '',
        type: 'news',
      });
    }
  };

  const handleAddProductionLink = () => {
    if (newProductionLink.title && newProductionLink.url) {
      onAddProductionLink(newProductionLink as ProductionLink, productionType);
      setNewProductionLink({
        title: '',
        url: '',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Generate PDF Report
          </DialogTitle>
          <DialogDescription>
            Lengkapi data berikut berdasarkan struktur slide report
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Tabs defaultValue="basic" className="p-6 pt-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic" className="text-xs">
                <span className="hidden sm:inline">Slide 1-2:</span> Cover
              </TabsTrigger>
              <TabsTrigger value="screenshots" className="text-xs">
                <span className="hidden sm:inline">Slide 4-5:</span> SERP
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <span className="hidden sm:inline">Slide 6-7:</span> AI
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <span className="hidden sm:inline">Slide 9:</span> Data
              </TabsTrigger>
              <TabsTrigger value="production" className="text-xs">
                <span className="hidden sm:inline">Slide 10+:</span> Links
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
            
            {/* Slide 1-2: Cover & Executive Summary */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileText className="h-4 w-4" />
                <span>Slide 1: Cover | Slide 2: Executive Summary</span>
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
              
              {/* Slide 2: Executive Summary */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    Slide 2: Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NEWS / PEMBERITAAN - Status</Label>
                      <Select 
                        value={formData.newsStatus} 
                        onValueChange={(v) => onUpdateFormData({ newsStatus: v as 'recovery' | 'monitoring' | 'crisis' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recovery">Recovery</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="crisis">Crisis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>SOSIAL MEDIA - Status</Label>
                      <Select 
                        value={formData.socialMediaStatus} 
                        onValueChange={(v) => onUpdateFormData({ socialMediaStatus: v as 'positive' | 'neutral' | 'negative' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>NEWS / PEMBERITAAN - Deskripsi</Label>
                      <Button
                        onClick={onGenerateNewsDescription}
                        disabled={isGeneratingNewsDesc}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isGeneratingNewsDesc ? "Generating..." : "Generate AI"}
                      </Button>
                    </div>
                    <Textarea
                      value={formData.newsDescription}
                      onChange={(e) => onUpdateFormData({ newsDescription: e.target.value })}
                      placeholder="Contoh: Terdapat pemberitaan negatif baru terkait isu... Pemberitaan masih bersifat tematik dan terbatas..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SOSIAL MEDIA - Deskripsi (Aktivitas Akun Lawan & Counter)</Label>
                    <Textarea
                      value={formData.socialMediaDescription}
                      onChange={(e) => onUpdateFormData({ socialMediaDescription: e.target.value })}
                      placeholder="Contoh: Aktivitas Akun Lawan: 145 posting dengan total 3.124.896 views. Aktivitas Counter: Total views 2.077.049, engagement 96.523..."
                      rows={3}
                    />
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
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotBefore')}
                          className="hidden"
                          id="screenshot-before"
                        />
                        <label htmlFor="screenshot-before" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {formData.serpScreenshotBefore instanceof File 
                              ? formData.serpScreenshotBefore.name 
                              : 'Click to upload'}
                          </p>
                        </label>
                      </div>
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
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'serpScreenshotAfter')}
                          className="hidden"
                          id="screenshot-after"
                        />
                        <label htmlFor="screenshot-after" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {formData.serpScreenshotAfter instanceof File 
                              ? formData.serpScreenshotAfter.name 
                              : 'Click to upload'}
                          </p>
                        </label>
                      </div>
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
            
            {/* Slide 6-7: AI Analysis */}
            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Slide 6-7: AI Analysis Summary (Perplexity Style)</span>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Generate AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    AI akan menganalisis keyword brand dan hasil pencarian untuk membuat ringkasan reputasi.
                  </p>
                  <Button 
                    onClick={onGenerateAiSummary} 
                    disabled={isGeneratingAiSummary}
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGeneratingAiSummary ? "Generating..." : "Generate AI Summary"}
                  </Button>
                  {aiSummary && (
                    <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {aiSummary}
                    </div>
                  )}
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
                  
                  {/* List of stats */}
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

              {/* Production Links */}
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
                  
                  {/* News Production */}
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
                  
                  {/* Social Media Production */}
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
            
            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Preview slide PDF yang akan di-generate
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Scroll untuk melihat semua slide
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <ReportPreview data={previewData} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onGenerateReport} disabled={isGenerating || !formData.brandName}>
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDataForm;
