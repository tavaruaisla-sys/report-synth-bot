import { Globe, Newspaper, CheckCircle2, Clock, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SearchSourceTabsProps {
  sources: {
    googleAll: boolean;
    googleNews: boolean;
  };
  onSourcesChange: (sources: { googleAll: boolean; googleNews: boolean }) => void;
  depth: number;
  onDepthChange: (depth: number) => void;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
}

const SearchSourceTabs = ({ 
  sources, 
  onSourcesChange,
  depth,
  onDepthChange,
  timeFilter,
  onTimeFilterChange
}: SearchSourceTabsProps) => {
  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-accent" />
          Sumber Pencarian
        </CardTitle>
        <CardDescription>
          Pilih tab Google yang akan dianalisis dan kedalaman pencarian
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Search Settings Divider */}
        <div className="border-t border-border pt-4 grid gap-6 md:grid-cols-2">
          {/* Depth Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Kedalaman Pencarian
              </Label>
              <span className="text-xs font-medium text-accent">
                {depth} Halaman ({depth * 10} hasil)
              </span>
            </div>
            <Slider
              value={[depth]}
              onValueChange={(vals) => onDepthChange(vals[0])}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
            <p className="text-[10px] text-muted-foreground">
              Semakin dalam pencarian, semakin banyak data yang dianalisis namun waktu proses lebih lama.
            </p>
          </div>

          {/* Time Filter Select */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Rentang Waktu
            </Label>
            <Select value={timeFilter} onValueChange={onTimeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih rentang waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Kapan saja (Any time)</SelectItem>
                <SelectItem value="d">24 Jam Terakhir</SelectItem>
                <SelectItem value="w">Seminggu Terakhir</SelectItem>
                <SelectItem value="m">Sebulan Terakhir</SelectItem>
                <SelectItem value="y">Setahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              Filter hasil pencarian berdasarkan waktu publikasi konten.
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {(sources.googleAll ? 1 : 0) + (sources.googleNews ? 1 : 0)} sumber dipilih
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSourceTabs;
