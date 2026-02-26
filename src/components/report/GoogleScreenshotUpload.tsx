import { useRef } from "react";
import { ImagePlus, Plus, X, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GoogleScreenshot {
  file: File;
  preview: string;
}

interface GoogleScreenshotUploadProps {
  screenshots: GoogleScreenshot[];
  onScreenshotsChange: (screenshots: GoogleScreenshot[]) => void;
}

const GoogleScreenshotUpload = ({ screenshots, onScreenshotsChange }: GoogleScreenshotUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotsChange([...screenshots, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = '';
  };

  const removeScreenshot = (index: number) => {
    onScreenshotsChange(screenshots.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-accent" />
          Screenshot Halaman Google
        </CardTitle>
        <CardDescription>
          Upload screenshot hasil pencarian Google untuk analisis AI yang lebih akurat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload area */}
          <div
            className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-accent/30 bg-accent/5 p-6 transition-all hover:border-accent/60 hover:bg-accent/10"
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-center">
              <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">
                Klik untuk upload screenshot
              </p>
              <p className="text-xs text-muted-foreground">
                Bisa upload lebih dari satu gambar sekaligus
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Preview grid */}
          {screenshots.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {screenshots.map((ss, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border border-border">
                  <img
                    src={ss.preview}
                    alt={`Google screenshot ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="truncate p-1.5 text-[10px] text-muted-foreground">{ss.file.name}</p>
                </div>
              ))}
              {/* Add more button */}
              <div
                className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border transition-all hover:border-accent/50 hover:bg-accent/5"
                onClick={() => inputRef.current?.click()}
              >
                <div className="text-center">
                  <Plus className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Tambah</p>
                </div>
              </div>
            </div>
          )}

          {screenshots.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {screenshots.length} screenshot akan digunakan sebagai konteks AI saat generate deskripsi pemberitaan
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleScreenshotUpload;
