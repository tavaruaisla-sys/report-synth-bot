import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Search, Settings, History, Edit, Trash2, Calendar, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { reportService, DBReport } from "@/services/reportService";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<DBReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    const data = await reportService.getReports();
    setReports(data);
    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) fetchReports();
  };

  const handleLoadReport = (report: DBReport) => {
    sessionStorage.setItem("loadReportId", report.id);
    sessionStorage.setItem("loadReportData", JSON.stringify(report.data));
    setIsOpen(false);
    navigate("/report");
  };

  const handleDelete = async (id: string) => {
    const success = await reportService.deleteReport(id);
    if (success) {
      setReports(prev => prev.filter(r => r.id !== id));
      toast({ title: "Report Dihapus", description: "Report berhasil dihapus." });
    } else {
      toast({ title: "Error", description: "Gagal menghapus report.", variant: "destructive" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">ReportAI</h1>
            <p className="text-xs text-muted-foreground">Brand Monitoring Tool</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate("/")}>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Analisis</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Report</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Report History</SheetTitle>
                <SheetDescription>Lihat dan kelola report yang tersimpan.</SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-20 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Belum ada report tersimpan</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => { setIsOpen(false); navigate("/report"); }}>
                      Buat Report Baru
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-1 min-w-0 flex-1 mr-4">
                          <h4 className="font-semibold text-sm truncate">{report.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium">{report.brand_name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(report.updated_at), "PPP p")}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLoadReport(report)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Report?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Report akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(report.id)}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
