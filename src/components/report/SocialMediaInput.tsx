import { useState } from "react";
import { Link, Plus, X, Instagram, Twitter, Facebook, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SocialMediaUrl {
  id: string;
  url: string;
  platform: string;
}

interface SocialMediaInputProps {
  urls: SocialMediaUrl[];
  onUrlsChange: (urls: SocialMediaUrl[]) => void;
}

const getPlatform = (url: string): string => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return "instagram";
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "twitter";
  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) return "facebook";
  if (lowerUrl.includes("linkedin.com")) return "linkedin";
  if (lowerUrl.includes("tiktok.com")) return "tiktok";
  return "web";
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClass = "h-4 w-4";
  switch (platform) {
    case "instagram":
      return <Instagram className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    case "facebook":
      return <Facebook className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
  }
};

const platformColors: Record<string, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  twitter: "bg-sky-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-foreground",
  web: "bg-muted-foreground",
};

const SocialMediaInput = ({ urls, onUrlsChange }: SocialMediaInputProps) => {
  const [urlInput, setUrlInput] = useState("");

  const addUrl = () => {
    if (urlInput.trim()) {
      const platform = getPlatform(urlInput.trim());
      const newUrl: SocialMediaUrl = {
        id: Date.now().toString(),
        url: urlInput.trim(),
        platform,
      };
      onUrlsChange([...urls, newUrl]);
      setUrlInput("");
    }
  };

  const removeUrl = (id: string) => {
    onUrlsChange(urls.filter(u => u.id !== id));
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link className="h-5 w-5 text-accent" />
          URL Social Media
        </CardTitle>
        <CardDescription>
          Masukkan URL postingan social media untuk mengambil cover/thumbnail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://instagram.com/p/xxx atau URL lainnya"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addUrl()}
            className="flex-1"
          />
          <Button onClick={addUrl} size="icon" variant="default">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {urls.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-2">Belum ada URL</p>
          ) : (
            urls.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground ${platformColors[item.platform]}`}>
                  <PlatformIcon platform={item.platform} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{item.platform}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeUrl(item.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaInput;
