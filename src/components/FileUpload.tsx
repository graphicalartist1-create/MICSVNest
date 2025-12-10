import { useState, useCallback } from "react";
import { Upload, Trash2, Sparkles, Download, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onGenerate: (fileKeys: { filename: string; key: string }[]) => void;
  onExport: () => void;
  isGenerating: boolean;
  imageType?: string;
}

type QueueItem = {
  id: string;
  file: File;
  progress: number; // 0-100
  status: "queued" | "uploading" | "uploaded" | "failed";
  key?: string; // s3 key when uploaded
};

const fileTypes = ["Images", "Videos", "SVG", "EPS"] as const;

const MAX_FILES = 500;

const FileUpload = ({ files, onFilesChange, onGenerate, onExport, isGenerating, imageType }: FileUploadProps) => {
  const [activeType, setActiveType] = useState<typeof fileTypes[number]>("Images");
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>(() => files.map((f, i) => ({ id: `${i}-${f.name}`, file: f, progress: 0, status: "queued" as const })));
  const [isUploading, setIsUploading] = useState(false);

  const syncFilesToParent = (items: QueueItem[]) => {
    onFilesChange(items.map(i => i.file));
  };

  const addFiles = useCallback((newFiles: File[]) => {
    setQueue((prev) => {
      const combined = [...prev, ...newFiles.slice(0, MAX_FILES - prev.length).map((f, i) => ({ id: `${Date.now()}-${prev.length + i}-${f.name}`, file: f, progress: 0, status: "queued" as const }))];
      syncFilesToParent(combined);
      return combined;
    });
  }, []);

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
    setQueue((prev) => {
      const combined = [...prev, ...droppedFiles.slice(0, MAX_FILES - prev.length).map((f, i) => ({ id: `${Date.now()}-${prev.length + i}-${f.name}`, file: f, progress: 0, status: "queued" as const }))];
      syncFilesToParent(combined);
      // Auto-upload immediately after files are dropped
      setTimeout(() => uploadAllFiles(combined), 100);
      return combined;
    });
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setQueue((prev) => {
        const combined = [...prev, ...selectedFiles.slice(0, MAX_FILES - prev.length).map((f, i) => ({ id: `${Date.now()}-${prev.length + i}-${f.name}`, file: f, progress: 0, status: "queued" as const }))];
        syncFilesToParent(combined);
        // Auto-upload immediately after files are added
        setTimeout(() => uploadAllFiles(combined), 100);
        return combined;
      });
    }
  }, []);

  const clearAll = () => {
    setQueue([]);
    onFilesChange([]);
  };

  // Request a presigned URL from server
  const getPresign = async (filename: string, contentType: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/api/upload/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType }),
      });
      if (!res.ok) throw new Error("presign failed");
      const data = await res.json();
      return data; // { url, key }
    } catch (err) {
      console.warn("Presign error, falling back to mock", err);
      return null;
    }
  };

  const uploadFileWithProgress = (file: File, url: string, onProgress: (p: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const p = Math.round((e.loaded / e.total) * 100);
          onProgress(p);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed with status ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });
  };

  const uploadAllFiles = async (itemsToUpload?: QueueItem[]) => {
    const items = itemsToUpload || queue;
    if (items.length === 0) return;
    
    setIsUploading(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.status === "uploaded") continue;
      setQueue(prev => prev.map(p => p.id === item.id ? { ...p, status: "uploading", progress: 0 } : p));

      // Get presigned URL
      const presign = await getPresign(item.file.name, item.file.type || "application/octet-stream");
      if (!presign) {
        // Mock: simulate upload delay then mark uploaded and provide a mock key
        await new Promise(r => setTimeout(r, 500 + Math.random() * 800));
        setQueue(prev => prev.map(p => p.id === item.id ? { ...p, status: "uploaded", progress: 100, key: `mock/${encodeURIComponent(p.file.name)}` } : p));
        continue;
      }

      try {
        await uploadFileWithProgress(item.file, presign.url, (p) => {
          setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: p } : q));
        });
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "uploaded", progress: 100, key: presign.key } : q));
      } catch (err) {
        console.error(err);
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "failed" } : q));
      }
    }

    setIsUploading(false);
  };

  const handleGenerateAll = () => {
    // collect uploaded keys or filenames
    const uploaded = queue.filter(q => q.status === "uploaded").map(q => ({ filename: q.file.name, key: q.key || q.file.name }));
    onGenerate(uploaded);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
      </div>

      {/* Sign In Alert */}
      <div className="py-3">
        <Alert className="bg-primary/10 border-primary/30">
          <LogIn className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            <span className="font-medium">Sign In Recommended</span>
            <br />
            <span className="text-sm opacity-80">Sign in to manage files, ownership, and notifications.</span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Area */}
      <div className="py-3">
        <input
          type="file"
          multiple
          accept="image/*,video/*,.svg,.eps"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />

        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all min-h-[120px] flex flex-col items-center justify-center cursor-pointer select-none ${
            isDragging
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/10 hover:shadow-md"
          }`}
        >
          <Upload className="h-12 w-12 text-muted-foreground mb-3" />

          {/* File Type Tabs */}
          <div className="flex gap-2 mb-4">
            {fileTypes.map((type) => (
              <button
                key={type}
                onClick={(e) => { e.stopPropagation(); setActiveType(type); }}
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

          <p className="text-foreground mb-1 font-medium">
            Drag & drop files here, or click anywhere to select
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Supports image, video, SVG, EPS. Max {MAX_FILES} files.
          </p>

          <div className="pointer-events-none">
            <Button variant="outline" asChild className="cursor-pointer">
              <span>Select Files</span>
            </Button>
          </div>
        </label>
      </div>

      {/* Queue list */}
      <div className="py-3 space-y-2 max-h-60 overflow-auto">
        {queue.map((item) => (
          <div key={item.id} className="p-2 border rounded flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium truncate">{item.file.name}</div>
                <div className="text-xs text-muted-foreground">{(item.file.size / 1024 / 1024).toFixed(2)} MB</div>
                <div className="text-xs text-muted-foreground">• {item.status}</div>
              </div>
              <div className="w-full bg-secondary/30 h-1 rounded mt-1 overflow-hidden">
                <div style={{ width: `${item.progress}%` }} className="h-1 bg-cyan-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueue(prev => { const next = prev.filter(p => p.id !== item.id); syncFilesToParent(next); return next; })}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {queue.length === 0 && (
          <div className="text-sm text-muted-foreground">No files queued.</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{process.env.REACT_APP_API_BASE ? "Server configured" : "Running in mock mode (no server)"}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          {/* Upload All button - only show if files queued and not yet uploaded */}
          {queue.length > 0 && queue.some(q => q.status !== "uploaded") && (
            <Button 
              variant="outline" 
              onClick={() => uploadAllFiles()} 
              disabled={isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload All"}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleGenerateAll} 
            disabled={queue.filter(q => q.status === "uploaded").length === 0 || isGenerating}
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Metadata"}
          </Button>
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            {imageType === "vector" ? "Export Vector Package" : "Export CSV"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
