import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, Download } from "lucide-react";
import { exportAsCSV, exportAsJSON, getRecommendedExportFormat, isVectorFile, isImageFile } from "@/lib/export";

export interface ExportResult {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: ExportResult[];
  files: { name: string }[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onOpenChange, results, files }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (results.length === 0) return null;

  const recommendedFormat = getRecommendedExportFormat(
    files.map(f => ({ filename: f.name }))
  );

  const hasVectors = files.some(f => isVectorFile(f.name));
  const hasImages = files.some(f => isImageFile(f.name));

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      exportAsCSV(results, "csvnest-metadata.csv");
      // Close dialog after a small delay
      setTimeout(() => {
        setIsExporting(false);
        onOpenChange(false);
      }, 800);
    } catch (error) {
      console.error("Export error:", error);
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      exportAsJSON(results, "csvnest-metadata.json");
      setTimeout(() => {
        setIsExporting(false);
        onOpenChange(false);
      }, 800);
    } catch (error) {
      console.error("Export error:", error);
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Export Metadata</DialogTitle>
          <DialogDescription>
            Choose how you'd like to export your generated metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              recommendedFormat === "vector" || recommendedFormat === "mixed"
                ? "border-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/10"
                : "border-border hover:border-cyan-400/50 hover:bg-secondary/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">CSV Format</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Best for: Vector files (.ai, .eps, .svg)
                </div>
                <div className="text-xs text-muted-foreground">
                  Compatible with all platforms and spreadsheet apps
                </div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </button>

          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              recommendedFormat === "image"
                ? "border-cyan-400 bg-cyan-400/5 hover:bg-cyan-400/10"
                : "border-border hover:border-cyan-400/50 hover:bg-secondary/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start gap-3">
              <FileJson className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">JSON Format</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Best for: Image files (.jpg, .png, .gif, etc.)
                </div>
                <div className="text-xs text-muted-foreground">
                  Structured data for APIs and custom processing
                </div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </button>

          {/* Info box */}
          <div className="bg-secondary/50 border border-border rounded-lg p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Your files:</div>
            {hasVectors && <div>• Vectors: {files.filter(f => isVectorFile(f.name)).length} files</div>}
            {hasImages && <div>• Images: {files.filter(f => isImageFile(f.name)).length} files</div>}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>

        {isExporting && (
          <div className="text-center text-xs text-muted-foreground animate-pulse">
            Preparing export...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
