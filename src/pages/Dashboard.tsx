import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ResultsPanel } from "@/components/ResultsPanel";
import { AdvancedControls, type GenerationSettings } from "@/components/AdvancedControls";
import { ExportPanel } from "@/components/ExportPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";

interface FileMetadata {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
}

export function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [settings, setSettings] = useState<GenerationSettings>({
    titleLength: 50,
    keywordCount: 10,
    imageType: "raster",
    prefix: "",
    suffix: "",
    negativeKeywords: [],
  });
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMetadata = async (fileKeys: { filename: string; key: string }[]) => {
    if (fileKeys.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:4000";
      const results: FileMetadata[] = [];

      for (let i = 0; i < fileKeys.length; i++) {
        const fileKey = fileKeys[i];
        
        // Call metadata generation endpoint
        const res = await fetch(`${apiBase}/api/metadata/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: fileKey.filename,
            imageType: settings.imageType,
            titleLength: settings.titleLength,
            keywordCount: settings.keywordCount,
            prefix: settings.prefix,
            suffix: settings.suffix,
            negativeKeywords: settings.negativeKeywords,
          }),
        });

        if (!res.ok) throw new Error("Metadata generation failed");
        const data = await res.json();

        results.push({
          id: fileKey.key,
          filename: fileKey.filename,
          title: data.title,
          description: data.description,
          keywords: data.keywords,
          prompt: data.prompt,
        });

        setGenerationProgress(Math.round(((i + 1) / fileKeys.length) * 100));
      }

      setMetadata(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (data: { metadata: FileMetadata[]; platform: string }) => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:4000";
      
      const response = await fetch(`${apiBase}/api/export/csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: data.metadata.map(m => ({
            filename: m.filename,
            title: m.title,
            description: m.description,
            keywords: m.keywords.join(", "),
            aiPrompt: m.prompt,
          })),
          platform: data.platform,
          fileName: `csvnest-export-${new Date().toISOString().split("T")[0]}.csv`,
        }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `csvnest-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* হেডার */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">CSVnest</h1>
          <p className="text-muted-foreground">
            AI-চালিত মেটাডেটা জেনারেটর এবং মাইক্রোস্টক এক্সপোর্ট টুল
          </p>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* এরর বার্তা */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">ত্রুটি</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ট্যাব ইন্টারফেস */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="upload">ফাইল আপলোড</TabsTrigger>
            <TabsTrigger value="generate">মেটাডেটা</TabsTrigger>
            <TabsTrigger value="export">এক্সপোর্ট</TabsTrigger>
            <TabsTrigger value="settings" className="hidden lg:inline-flex">সেটিংস</TabsTrigger>
          </TabsList>

          {/* আপলোড ট্যাব */}
          <TabsContent value="upload" className="space-y-6">
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              onGenerate={handleGenerateMetadata}
              onExport={() => {}}
              isGenerating={isGenerating}
            />
          </TabsContent>

          {/* মেটাডেটা ট্যাব */}
          <TabsContent value="generate" className="space-y-6">
            {isGenerating && (
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">মেটাডেটা জেনারেট করা হচ্ছে...</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{generationProgress}%</p>
                </CardContent>
              </Card>
            )}
            {metadata.length > 0 && (
              <ResultsPanel results={metadata} />
            )}
            {metadata.length === 0 && !isGenerating && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>ফাইল আপলোড করুন এবং মেটাডেটা জেনারেট করতে "মেটাডেটা জেনারেট করুন" ক্লিক করুন।</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* এক্সপোর্ট ট্যাব */}
          <TabsContent value="export" className="space-y-6">
            {metadata.length > 0 ? (
              <ExportPanel
                metadata={metadata}
                onExport={handleExport}
                isLoading={isGenerating}
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>মেটাডেটা তৈরি করার পর এক্সপোর্ট করুন।</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* সেটিংস ট্যাব */}
          <TabsContent value="settings" className="space-y-6">
            <AdvancedControls onSettingsChange={setSettings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;
