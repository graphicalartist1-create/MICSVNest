import { useState } from "react";
import Header from "@/components/Header";
import GenerationControls from "@/components/GenerationControls";
import FileUpload from "@/components/FileUpload";
import ResultsPanel from "@/components/ResultsPanel";
import HowToUseButton from "@/components/HowToUseButton";
import DeveloperBadge from "@/components/DeveloperBadge";

interface GenerationSettings {
  titleLength: number;
  descriptionLength: number;
  keywordsCount: number;
  imageType: string;
  prefix: boolean;
  suffix: boolean;
  negativeTitle: boolean;
  negativeKeywords: boolean;
  prefixText: string;
  suffixText: string;
  negativeTitleText: string;
  negativeKeywordsText: string;
  platform: string;
  // Prompt tab settings
  whiteBackground: boolean;
  cameraParameters: boolean;
  promptImageType: string;
  promptCharacterLength: number;
  promptPrefix: boolean;
  promptSuffix: boolean;
  negativePromptWords: boolean;
  promptPrefixText: string;
  promptSuffixText: string;
  negativePromptWordsText: string;
}

interface Result {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
}

const Index = () => {
  const [settings, setSettings] = useState<GenerationSettings>({
    titleLength: 70,
    descriptionLength: 150,
    keywordsCount: 30,
    imageType: "none",
    prefix: false,
    suffix: false,
    negativeTitle: false,
    negativeKeywords: false,
    prefixText: "",
    suffixText: "",
    negativeTitleText: "",
    negativeKeywordsText: "",
    platform: "shutterstock",
    // Prompt tab settings
    whiteBackground: false,
    cameraParameters: false,
    promptImageType: "none",
    promptCharacterLength: 600,
    promptPrefix: false,
    promptSuffix: false,
    negativePromptWords: false,
    promptPrefixText: "",
    promptSuffixText: "",
    negativePromptWordsText: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (files.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate generation (in real app, this would call AI API)
    setTimeout(() => {
      const newResults: Result[] = files.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        filename: file.name,
        title: `Generated title for ${file.name}`,
        description: `AI-generated description for the image ${file.name}. This would contain relevant metadata for stock photo platforms.`,
        keywords: ["stock", "photo", "image", "digital", "creative", "design", "professional", "high-quality"],
      }));
      setResults(newResults);
      setIsGenerating(false);
    }, 2000);
  };

  const handleExport = () => {
    if (results.length === 0) return;

    const csvContent = [
      ["Filename", "Title", "Description", "Keywords"].join(","),
      ...results.map((r) =>
        [
          r.filename,
          `"${r.title}"`,
          `"${r.description}"`,
          `"${r.keywords.join(", ")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "csvnest-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6">
        <div className="flex gap-6 max-w-[1800px] mx-auto">
          {/* Left Sidebar - Generation Controls */}
          <aside className="w-[480px] flex-shrink-0">
            <GenerationControls settings={settings} onSettingsChange={setSettings} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              onGenerate={handleGenerate}
              onExport={handleExport}
              isGenerating={isGenerating}
            />
            
            <ResultsPanel results={results} />
          </div>
        </div>
      </main>

      <HowToUseButton />
      <DeveloperBadge />
    </div>
  );
};

export default Index;
