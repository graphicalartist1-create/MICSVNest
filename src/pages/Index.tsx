import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GenerationControls from "@/components/GenerationControls";
import FileUpload from "@/components/FileUpload";
import ResultsPanel from "@/components/ResultsPanel";
import ExportDialog from "@/components/ExportDialog";
import MetadataGeneratedDialog from "@/components/MetadataGeneratedDialog";
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
  const [showMetadataGeneratedDialog, setShowMetadataGeneratedDialog] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isStoppedByUser, setIsStoppedByUser] = useState(false);

  useEffect(() => {
    // Check if user doesn't want to see the dialog again
    const dontShow = localStorage.getItem("dontShowMetadataGenerated");
    // Dialog will be shown only if this is not set to "true"
  }, []);

  const handleShowMetadataDialog = () => {
    const dontShow = localStorage.getItem("dontShowMetadataGenerated");
    if (dontShow !== "true") {
      setShowMetadataGeneratedDialog(true);
    }
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    
    setIsGenerating(true);
    setShowProgressBar(true);
    setGenerationProgress(0);
    setIsStoppedByUser(false);
    
    // Simulate progress bar
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (isStoppedByUser) {
        clearInterval(progressInterval);
        return;
      }
      
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) currentProgress = 90;
      setGenerationProgress(Math.min(currentProgress, 99));
    }, 200);
    
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
        clearInterval(progressInterval);
        setGenerationProgress(100);
        setResults(generated);
        setIsGenerating(false);
        setTimeout(() => {
          setShowProgressBar(false);
          handleShowMetadataDialog();
        }, 800);
      }, 600);
    } catch (e) {
      // Fallback: restore previous stub behavior on error
      clearInterval(progressInterval);
      const fallback: Result[] = files.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        filename: file.name,
        title: `Generated title for ${file.name}`,
        description: `AI-generated description for the image ${file.name}. This would contain relevant metadata for stock photo platforms.`,
        keywords: ["stock", "photo", "image"],
      }));
      setResults(fallback);
      setIsGenerating(false);
      setShowProgressBar(false);
    }
  };

  const handleStopGeneration = () => {
    setIsStoppedByUser(true);
    setIsGenerating(false);
    setShowProgressBar(false);
    setGenerationProgress(0);
  };

  const handleExport = () => {
    if (results.length === 0) return;
    setShowExportDialog(true);
  };

  const handleUpdateResult = (id: string, updatedFields: Partial<Result>) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const handleRegenerateResult = (id: string) => {
    const resultToRegen = results.find(r => r.id === id);
    if (!resultToRegen) return;

    const meta = generateMetadataForFile(resultToRegen.filename, settings);
    const prompt = generatePromptForFile(resultToRegen.filename, settings);

    setResults(prev => prev.map(r => 
      r.id === id 
        ? { ...r, title: meta.title, description: meta.description, keywords: meta.keywords, prompt }
        : r
    ));
  };

  return (
    <div className="bg-background">
      <Header />
      
      <main className="pt-20 px-6">
        <div className="flex gap-6 max-w-[1800px] mx-auto">
          {/* Left Sidebar - Generation Controls */}
          <aside className="w-[480px] flex-shrink-0">
            <GenerationControls settings={settings} onSettingsChange={setSettings} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Progress Bar Container - Now in flow */}
            {showProgressBar && (
              <div className="w-full bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-sm font-medium text-foreground">Processing files: {generationProgress}%...</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStopGeneration}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => setShowProgressBar(false)}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors"
                    >
                      Processing...
                    </button>
                  </div>
                </div>
                <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${generationProgress}%` }} 
                    className="h-2 bg-cyan-400 transition-all duration-300 rounded-full"
                  />
                </div>
              </div>
            )}
            
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              onGenerate={handleGenerate}
              onExport={handleExport}
              isGenerating={isGenerating}
              imageType={settings.imageType}
            />
            
            <ResultsPanel 
              results={results} 
              onUpdateResult={handleUpdateResult}
              onRegenerate={handleRegenerateResult}
            />
          </div>
        </div>
      </main>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        results={results}
        files={files}
      />

      <MetadataGeneratedDialog
        open={showMetadataGeneratedDialog}
        onOpenChange={setShowMetadataGeneratedDialog}
        results={results}
        isVectorFile={settings.imageType === "vector"}
      />

      <HowToUseButton />
      <DeveloperBadge />
    </div>
  );
};

export default Index;
