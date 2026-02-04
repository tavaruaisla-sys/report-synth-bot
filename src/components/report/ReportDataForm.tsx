import { useState } from "react";
import { Plus, Trash2, Upload, Sparkles, FileText, Link, BarChart2, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportFormData, SocialMediaStat, CounterContentItem, ProductionLink } from "@/lib/pdf/types";

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
  onGenerateReport: () => void;
  isGenerating: boolean;
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
  onGenerateReport,
  isGenerating,
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
            Lengkapi data berikut untuk generate report PDF
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Tabs defaultValue="basic" className="p-6 pt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="content">Content Links</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
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
              
              {/* Executive Summary */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>News Status</Label>
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
                      <Label>Social Media Status</Label>
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
                    <Label>News Description</Label>
                    <Textarea
                      value={formData.newsDescription}
                      onChange={(e) => onUpdateFormData({ newsDescription: e.target.value })}
                      placeholder="Deskripsi kondisi pemberitaan..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Social Media Description</Label>
                    <Textarea
                      value={formData.socialMediaDescription}
                      onChange={(e) => onUpdateFormData({ socialMediaDescription: e.target.value })}
                      placeholder="Deskripsi kondisi social media..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Summary */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                      {aiSummary}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    SERP Screenshots (Before/After)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Before Screenshot</Label>
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
                        placeholder="Caption before..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>After Screenshot</Label>
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
                        placeholder="Caption after..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Social Media Stats Tab */}
            <TabsContent value="social" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Social Media Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add new stat */}
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
                      placeholder="Likes"
                      value={newSocialStat.likes || ''}
                      onChange={(e) => setNewSocialStat(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="Comments"
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
                      <span className="font-medium">{stat.platform}</span>
                      <span className="text-sm text-muted-foreground">
                        Views: {stat.views.toLocaleString()} | Likes: {stat.likes.toLocaleString()}
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
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Content Links Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              {/* Counter Content */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Counter Content Links
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
              
              {/* Production Links */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Production Links (Appendix)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
