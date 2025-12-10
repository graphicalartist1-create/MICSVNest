import { useState, useCallback } from "react";
import { Upload, Trash2, Sparkles, Download, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onGenerate: () => void;
  onExport: () => void;
  isGenerating: boolean;
}

const fileTypes = ["Images", "Videos", "SVG", "EPS"] as const;

const FileUpload = ({ files, onFilesChange, onGenerate, onExport, isGenerating }: FileUploadProps) => {
  const [activeType, setActiveType] = useState<typeof fileTypes[number]>("Images");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesChange([...files, ...droppedFiles]);
  }, [files, onFilesChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesChange([...files, ...selectedFiles]);
    }
  }, [files, onFilesChange]);

  const clearAll = () => {
    onFilesChange([]);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
      </div>

      {/* Sign In Alert */}
      <div className="px-4 pt-4">
        <Alert className="bg-primary/10 border-primary/30">
          <LogIn className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            <span className="font-medium">Sign In Required</span>
            <br />
            <span className="text-sm opacity-80">Please sign in to upload files and use generation features.</span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Area */}
      <div className="p-4 flex-1">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all h-full min-h-[300px] flex flex-col items-center justify-center ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          
          {/* File Type Tabs */}
          <div className="flex gap-2 mb-4">
            {fileTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeType === type
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <p className="text-foreground mb-2">
            Drag & drop files here, or click to select
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports common image, video, SVG, and EPS formats. Max 500 files.
          </p>

          <input
            type="file"
            multiple
            accept="image/*,video/*,.svg,.eps"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild className="cursor-pointer">
              <span>Select Files</span>
            </Button>
          </label>
        </div>
      </div>

      {/* API Warning */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>No Google Gemini API keys. Add keys in settings.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>No Google Gemini API keys. Add keys in settings.</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button 
            variant="outline" 
            onClick={onGenerate} 
            disabled={files.length === 0 || isGenerating}
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate All"}
          </Button>
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
