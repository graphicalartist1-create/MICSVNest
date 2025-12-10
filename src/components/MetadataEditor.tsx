import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Save, X } from "lucide-react";

interface MetadataEditorProps {
  metadata: {
    id: string;
    filename: string;
    title: string;
    description: string;
    keywords: string[];
    aiPrompt?: string;
  };
  onSave: (updated: any) => void;
  onClose?: () => void;
}

export function MetadataEditor({ metadata, onSave, onClose }: MetadataEditorProps) {
  const [title, setTitle] = useState(metadata.title);
  const [description, setDescription] = useState(metadata.description);
  const [keywords, setKeywords] = useState(metadata.keywords.join(", "));
  const [aiPrompt, setAiPrompt] = useState(metadata.aiPrompt || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    onSave({
      ...metadata,
      title,
      description,
      keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      aiPrompt,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">মেটাডেটা এডিটর</CardTitle>
            <CardDescription className="text-sm">{metadata.filename}</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* শিরোনাম */}
        <div className="space-y-2">
          <Label>শিরোনাম *</Label>
          <div className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="শিরোনাম লিখুন"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(title, "title")}
            >
              {copiedId === "title" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* বিবরণ */}
        <div className="space-y-2">
          <Label>বিবরণ *</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="বিস্তারিত বিবরণ লিখুন"
            rows={3}
          />
        </div>

        {/* কীওয়ার্ড */}
        <div className="space-y-2">
          <Label>কীওয়ার্ড (কমা দিয়ে আলাদা করুন) *</Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="যেমন: ছবি, স্টক, প্রকৃতি"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {keywords.split(",").map((k, i) => {
              const keyword = k.trim();
              return keyword ? (
                <Badge key={i} variant="secondary" className="cursor-pointer">
                  {keyword}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => {
                      const kws = keywords.split(",").filter((_, idx) => idx !== i);
                      setKeywords(kws.join(","));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* AI প্রম্পট */}
        {aiPrompt && (
          <div className="space-y-2">
            <Label>AI ছবি জেনারেশন প্রম্পট</Label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="AI চিত্র জেনারেটরের জন্য প্রম্পট"
              rows={3}
            />
          </div>
        )}

        {/* সংরক্ষণ বার্তা */}
        {isSaved && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-2 text-xs text-green-900 dark:text-green-200">
            ✅ মেটাডেটা সফলভাবে সংরক্ষিত হয়েছে
          </div>
        )}

        {/* অ্যাকশন বাটন */}
        <div className="flex gap-2 justify-end">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              বাতিল করুন
            </Button>
          )}
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            সংরক্ষণ করুন
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
