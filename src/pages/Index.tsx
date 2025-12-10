import { useState } from "react";
import Header from "@/components/Header";
import GenerationControls from "@/components/GenerationControls";
import FileUpload from "@/components/FileUpload";
import ResultsPanel from "@/components/ResultsPanel";
import ExportDialog from "@/components/ExportDialog";
import { generateMetadataForFile, generatePromptForFile } from "@/lib/generator";
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
  prompt?: string;
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
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleGenerate = async () => {
    if (files.length === 0) return;
    
    setIsGenerating(true);
    
    // Generate metadata and prompts using local generator utilities.
    // This keeps generation deterministic and uses the current settings.
    try {
      const generated: Result[] = files.map((file, i) => {
        const meta = generateMetadataForFile(file.name, settings);
        const prompt = generatePromptForFile(file.name, settings);
        return {
          id: `${Date.now()}-${i}`,
          filename: file.name,
          title: meta.title,
          description: meta.description,
          keywords: meta.keywords,
          prompt,
        };
      });
      // Small delay to preserve UX (keep "Generating..." visible briefly)
      setTimeout(() => {
        setResults(generated);
        setIsGenerating(false);
      }, 600);
    } catch (e) {
      // Fallback: restore previous stub behavior on error
      const fallback: Result[] = files.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        filename: file.name,
        title: `Generated title for ${file.name}`,
        description: `AI-generated description for the image ${file.name}. This would contain relevant metadata for stock photo platforms.`,
        keywords: ["stock", "photo", "image"],
      }));
      setResults(fallback);
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (results.length === 0) return;
    setShowExportDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 p-6">
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

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        results={results}
        files={files}
      />

      <HowToUseButton />
      <DeveloperBadge />
    </div>
  );
};

export default Index;
