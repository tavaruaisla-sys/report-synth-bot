import { useState } from "react";
import { Search, Plus, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  negativeKeywords: string[];
  onNegativeKeywordsChange: (keywords: string[]) => void;
}

const KeywordInput = ({ 
  keywords, 
  onKeywordsChange, 
  negativeKeywords, 
  onNegativeKeywordsChange 
}: KeywordInputProps) => {
  const [brandInput, setBrandInput] = useState("");
  const [negativeInput, setNegativeInput] = useState("");

  const addKeyword = () => {
    if (brandInput.trim() && !keywords.includes(brandInput.trim())) {
      onKeywordsChange([...keywords, brandInput.trim()]);
      setBrandInput("");
    }
  };

  const addNegativeKeyword = () => {
    if (negativeInput.trim() && !negativeKeywords.includes(negativeInput.trim())) {
      onNegativeKeywordsChange([...negativeKeywords, negativeInput.trim()]);
      setNegativeInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(keywords.filter(k => k !== keyword));
  };

  const removeNegativeKeyword = (keyword: string) => {
    onNegativeKeywordsChange(negativeKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Brand/Topic Keywords */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-accent" />
            Keyword Brand/Topik
          </CardTitle>
          <CardDescription>
            Masukkan nama brand atau topik yang ingin dimonitor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Contoh: Nama Brand Anda"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              className="flex-1"
            />
            <Button onClick={addKeyword} size="icon" variant="default">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {keywords.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Belum ada keyword</p>
            ) : (
              keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className="gap-1 pl-3 pr-1 py-1.5"
                >
                  {keyword}
                  <button 
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Negative Keywords */}
      <Card className="border-negative/30 bg-negative/5 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-negative" />
            Keyword Negatif
          </CardTitle>
          <CardDescription>
            Kata kunci negatif yang akan dideteksi di hasil pencarian
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Contoh: penipuan, scam, keluhan"
              value={negativeInput}
              onChange={(e) => setNegativeInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNegativeKeyword()}
              className="flex-1 border-negative/30 focus-visible:ring-negative/50"
            />
            <Button onClick={addNegativeKeyword} size="icon" variant="destructive">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {negativeKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Belum ada keyword negatif</p>
            ) : (
              negativeKeywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  className="gap-1 pl-3 pr-1 py-1.5 bg-negative/20 text-negative border-negative/30 hover:bg-negative/30"
                >
                  {keyword}
                  <button 
                    onClick={() => removeNegativeKeyword(keyword)}
                    className="ml-1 rounded-full p-0.5 hover:bg-negative/30 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordInput;
