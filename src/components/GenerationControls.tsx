import { useState } from "react";
import { Settings, Key, ChevronDown, ChevronUp, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GenerationControlsProps {
  settings: {
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
  };
  onSettingsChange: (settings: any) => void;
}

const platforms = [
  { id: "adobe", name: "Adobe Stock", icon: "adobe" },
  { id: "shutterstock", name: "Shutterstock", icon: "St" },
  { id: "istock", name: "iStock", icon: "istock" },
  { id: "freepik", name: "Freepik", icon: "freepik" },
  { id: "vecteezy", name: "Vecteezy", icon: "vecteezy" },
  { id: "pond5", name: "Pond5", icon: "pond5" },
];

const PlatformIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "adobe":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 mx-auto" fill="none">
          <path d="M12 3l-2 6h4l-2-6z" fill="currentColor" opacity="0.6"/>
          <path d="M8 9l-3 9h3l1-3h2l-1-3H8z" fill="currentColor"/>
          <path d="M16 9l3 9h-3l-1-3h-2l1-3h2z" fill="currentColor"/>
          <circle cx="12" cy="6" r="1" fill="currentColor"/>
          <circle cx="9" cy="4" r="0.5" fill="currentColor"/>
          <circle cx="15" cy="4" r="0.5" fill="currentColor"/>
        </svg>
      );
    case "istock":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 18 C8 18 12 10 20 10" strokeLinecap="round" />
        </svg>
      );
    case "freepik":
      return (
        <span className="text-lg font-bold text-[#0b7fff]">F</span>
      );
    case "vecteezy":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case "pond5":
      return <span className="text-[10px] font-medium tracking-tight text-muted-foreground">POND5</span>;
    default:
      return <span className="text-lg font-semibold">{icon}</span>;
  }
};

const GenerationControls = ({ settings, onSettingsChange }: GenerationControlsProps) => {
  const [activeTab, setActiveTab] = useState<"metadata" | "prompt">("metadata");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">Generation Controls</span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          API Secrets
        </Button>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <div className="flex bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab("metadata")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "metadata"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Metadata
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "prompt"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Type className="h-4 w-4" />
            Prompt
          </button>
        </div>
      </div>

      {/* Advanced Controls */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {activeTab === "metadata" ? "Advanced Metadata Controls" : "Advanced Prompt Controls"}
              </span>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              {isAdvancedOpen ? "Collapse" : "Expand"}
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {activeTab === "metadata" ? (
            <div className="px-4 pb-4 space-y-6">
              {/* Export Platform */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Export Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => updateSetting("platform", platform.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        settings.platform === platform.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="text-center text-muted-foreground">
                        <PlatformIcon icon={platform.icon} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-foreground">Title Length</label>
                    <span className="text-sm text-muted-foreground">{settings.titleLength} Characters</span>
                  </div>
                  <Slider
                    value={[settings.titleLength]}
                    onValueChange={([value]) => updateSetting("titleLength", value)}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-foreground">Description Character Length</label>
                    <span className="text-sm text-muted-foreground">{settings.descriptionLength} Characters (Fixed)</span>
                  </div>
                  <Slider
                    value={[settings.descriptionLength]}
                    onValueChange={([value]) => updateSetting("descriptionLength", value)}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-foreground">Keywords Count</label>
                    <span className="text-sm text-muted-foreground">{settings.keywordsCount} Keywords</span>
                  </div>
                  <Slider
                    value={[settings.keywordsCount]}
                    onValueChange={([value]) => updateSetting("keywordsCount", value)}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Image Type */}
              <div>
                <label className="text-sm text-foreground mb-2 block">Image Type</label>
                <Select value={settings.imageType} onValueChange={(value) => updateSetting("imageType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="vector">Vector</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  If you upload preview file then choose image type vector then it will generate CSV in (EPS, SVG, AI).
                </p>
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Prefix</label>
                    <Switch
                      checked={settings.prefix}
                      onCheckedChange={(checked) => updateSetting("prefix", checked)}
                    />
                  </div>
                  {settings.prefix && (
                    <Input
                      placeholder="Enter prefix text..."
                      value={settings.prefixText}
                      onChange={(e) => updateSetting("prefixText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Suffix</label>
                    <Switch
                      checked={settings.suffix}
                      onCheckedChange={(checked) => updateSetting("suffix", checked)}
                    />
                  </div>
                  {settings.suffix && (
                    <Input
                      placeholder="Enter suffix text..."
                      value={settings.suffixText}
                      onChange={(e) => updateSetting("suffixText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Negative Words for Title</label>
                    <Switch
                      checked={settings.negativeTitle}
                      onCheckedChange={(checked) => updateSetting("negativeTitle", checked)}
                    />
                  </div>
                  {settings.negativeTitle && (
                    <Input
                      placeholder="Words to exclude from title..."
                      value={settings.negativeTitleText}
                      onChange={(e) => updateSetting("negativeTitleText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Negative Keywords</label>
                    <Switch
                      checked={settings.negativeKeywords}
                      onCheckedChange={(checked) => updateSetting("negativeKeywords", checked)}
                    />
                  </div>
                  {settings.negativeKeywords && (
                    <Input
                      placeholder="Keywords to exclude..."
                      value={settings.negativeKeywordsText}
                      onChange={(e) => updateSetting("negativeKeywordsText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Note: You don't have to add "isolated on transparent background" for PNG images; the AI handles this.
              </p>
            </div>
          ) : (
            /* Prompt Tab Content */
            <div className="px-4 pb-4 space-y-6">
              {/* Toggle row */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.whiteBackground}
                    onCheckedChange={(checked) => updateSetting("whiteBackground", checked)}
                  />
                  <label className="text-sm text-foreground">White Background Image</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.cameraParameters}
                    onCheckedChange={(checked) => updateSetting("cameraParameters", checked)}
                  />
                  <label className="text-sm text-foreground">Camera Parameters</label>
                </div>
              </div>

              {/* Image Type */}
              <div>
                <label className="text-sm text-foreground mb-2 block">Image Type</label>
                <Select value={settings.promptImageType} onValueChange={(value) => updateSetting("promptImageType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="vector">Vector</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt Character Length Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Prompt Character Length</label>
                  <span className="text-sm text-primary">{settings.promptCharacterLength} Characters</span>
                </div>
                <Slider
                  value={[settings.promptCharacterLength]}
                  onValueChange={([value]) => updateSetting("promptCharacterLength", value)}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Prefix</label>
                    <Switch
                      checked={settings.promptPrefix}
                      onCheckedChange={(checked) => updateSetting("promptPrefix", checked)}
                    />
                  </div>
                  {settings.promptPrefix && (
                    <Input
                      placeholder="Enter prefix text..."
                      value={settings.promptPrefixText}
                      onChange={(e) => updateSetting("promptPrefixText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Suffix</label>
                    <Switch
                      checked={settings.promptSuffix}
                      onCheckedChange={(checked) => updateSetting("promptSuffix", checked)}
                    />
                  </div>
                  {settings.promptSuffix && (
                    <Input
                      placeholder="Enter suffix text..."
                      value={settings.promptSuffixText}
                      onChange={(e) => updateSetting("promptSuffixText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground">Negative Prompt Words</label>
                    <Switch
                      checked={settings.negativePromptWords}
                      onCheckedChange={(checked) => updateSetting("negativePromptWords", checked)}
                    />
                  </div>
                  {settings.negativePromptWords && (
                    <Input
                      placeholder="Words to exclude from prompt..."
                      value={settings.negativePromptWordsText}
                      onChange={(e) => updateSetting("negativePromptWordsText", e.target.value)}
                      className="animate-fade-in"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GenerationControls;
