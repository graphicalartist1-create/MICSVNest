import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Download } from "lucide-react";
import { MetadataEditor } from "./MetadataEditor";

interface ExportPanelProps {
  metadata: any[];
  onExport: (data: any) => void;
  isLoading?: boolean;
}

export function ExportPanel({ metadata, onExport, isLoading = false }: ExportPanelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<Record<string, any>>({});

  const getMetadata = (id: string) => {
    return editedMetadata[id] || metadata.find(m => m.id === id);
  };

  const handleExport = async () => {
    const metadataToExport = metadata.map(m => editedMetadata[m.id] || m);
    onExport({
      metadata: metadataToExport,
      platform: selectedPlatform,
    });
  };

  const editingMetadata = editingId ? getMetadata(editingId) : null;

  return (
    <div className="space-y-4">
      {/* এডিটিং মোড */}
      {editingMetadata && (
        <MetadataEditor
          metadata={editingMetadata}
          onSave={(updated) => {
            setEditedMetadata(prev => ({
              ...prev,
              [updated.id]: updated,
            }));
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}

      {/* এক্সপোর্ট প্যানেল */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            CSV এক্সপোর্ট করুন
          </CardTitle>
          <CardDescription>
            আপনার মেটাডেটা ডাউনলোড করুন এবং মাইক্রোস্টক প্ল্যাটফর্মে ব্যবহার করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* প্ল্যাটফর্ম নির্বাচন */}
          <div className="space-y-2">
            <label className="text-sm font-medium">প্ল্যাটফর্ম নির্বাচন করুন</label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব (কাস্টম ফরম্যাট)</SelectItem>
                <SelectItem value="adobe">Adobe Stock</SelectItem>
                <SelectItem value="shutterstock">Shutterstock</SelectItem>
                <SelectItem value="freepik">Freepik</SelectItem>
                <SelectItem value="vecteezy">Vecteezy</SelectItem>
                <SelectItem value="pond5">Pond5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* মেটাডেটা তালিকা */}
          <div className="border rounded-lg divide-y max-h-64 overflow-auto">
            {metadata.map((item) => {
              const current = getMetadata(item.id);
              return (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-secondary/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.filename}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{current.title}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(item.id)}
                    className="ml-2 flex-shrink-0"
                  >
                    সম্পাদনা
                  </Button>
                </div>
              );
            })}
          </div>

          {/* তথ্য */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-200">
              {metadata.length} টি ফাইলের মেটাডেটা রপ্তানি করার জন্য প্রস্তুত। প্রয়োজনে এডিট করুন এবং ডাউনলোড করুন।
            </p>
          </div>

          {/* ডাউনলোড বাটন */}
          <Button
            onClick={handleExport}
            disabled={metadata.length === 0 || isLoading}
            className="w-full gap-2"
            size="lg"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "ডাউনলোড হচ্ছে..." : `CSV ডাউনলোড করুন (${metadata.length} ফাইল)`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
