import { Globe, Newspaper, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchSourceTabsProps {
  sources: {
    googleAll: boolean;
    googleNews: boolean;
  };
  onSourcesChange: (sources: { googleAll: boolean; googleNews: boolean }) => void;
}

const SearchSourceTabs = ({ sources, onSourcesChange }: SearchSourceTabsProps) => {
  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-accent" />
          Sumber Pencarian
        </CardTitle>
        <CardDescription>
          Pilih tab Google yang akan dianalisis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Google All */}
          <div 
            className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${
              sources.googleAll 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-muted-foreground"
            }`}
            onClick={() => onSourcesChange({ ...sources, googleAll: !sources.googleAll })}
          >
            <Checkbox 
              checked={sources.googleAll} 
              onCheckedChange={(checked) => 
                onSourcesChange({ ...sources, googleAll: checked as boolean })
              }
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Globe className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Google - Tab Semua</p>
                {sources.googleAll && (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Hasil pencarian umum dari semua sumber
              </p>
            </div>
          </div>

          {/* Google News */}
          <div 
            className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${
              sources.googleNews 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-muted-foreground"
            }`}
            onClick={() => onSourcesChange({ ...sources, googleNews: !sources.googleNews })}
          >
            <Checkbox 
              checked={sources.googleNews} 
              onCheckedChange={(checked) => 
                onSourcesChange({ ...sources, googleNews: checked as boolean })
              }
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Newspaper className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Google - Tab News</p>
                {sources.googleNews && (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Berita dan artikel dari portal media
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {(sources.googleAll ? 1 : 0) + (sources.googleNews ? 1 : 0)} sumber dipilih
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSourceTabs;
