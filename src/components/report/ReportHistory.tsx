import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FileText, Trash2, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { reportService, DBReport } from "@/services/reportService";
import { useToast } from "@/hooks/use-toast";
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

interface ReportHistoryProps {
  onLoadReport: (report: DBReport) => void;
}

export function ReportHistory({ onLoadReport }: ReportHistoryProps) {
  const [reports, setReports] = useState<DBReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchReports = async () => {
    setIsLoading(true);
    const data = await reportService.getReports();
    setReports(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    const success = await reportService.deleteReport(id);
    if (success) {
      setReports(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <FileText className="mr-2 h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Report History</SheetTitle>
          <SheetDescription>
            View and manage your saved reports.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-20 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg">
              <FileText className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No saved reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1 mr-4">
                    <h4 className="font-semibold text-sm truncate pr-2">
                      {report.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {report.brand_name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(report.updated_at), "PPP p")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        onLoadReport(report);
                        setIsOpen(false);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the report.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(report.id)}
                          >
                            Delete
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
  );
}
