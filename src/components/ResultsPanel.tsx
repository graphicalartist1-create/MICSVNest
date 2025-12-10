import { useState } from "react";
import { ImageIcon, Copy, Check, Type, FileText, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Result {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
}

interface ResultsPanelProps {
  results: Result[];
  onUpdateResult?: (id: string, updatedFields: Partial<Result>) => void;
  onRegenerate?: (id: string) => void;
}

const ResultsPanel = ({ results, onUpdateResult, onRegenerate }: ResultsPanelProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Record<string, Partial<Result>>>({});

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-primary text-base mb-1">Your generated results will appear here.</p>
        <p className="text-muted-foreground text-sm">Upload some files and click "Generate All" to get started.</p>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEditedValue = (resultId: string, field: string, defaultValue: any) => {
    return editedFields[resultId]?.[field as keyof Result] ?? defaultValue;
  };

  const handleFieldChange = (resultId: string, field: string, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [resultId]: { ...prev[resultId], [field]: value }
    }));
  };

  const handleSave = (resultId: string) => {
    if (onUpdateResult && editedFields[resultId]) {
      onUpdateResult(resultId, editedFields[resultId]);
      setEditedFields(prev => {
        const next = { ...prev };
        delete next[resultId];
        return next;
      });
    }
  };

  const handleRegenerate = (resultId: string) => {
    if (onRegenerate) {
      onRegenerate(resultId);
      // Clear edited fields for this result
      setEditedFields(prev => {
        const next = { ...prev };
        delete next[resultId];
        return next;
      });
    }
  };

  return (
    <div>
      <div className="py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Generated Results ({results.length})</h3>
      </div>
      <div className="divide-y divide-border max-h-[800px] overflow-auto px-2">
        {results.map((result) => {
          const editedTitle = getEditedValue(result.id, "title", result.title);
          const editedDescription = getEditedValue(result.id, "description", result.description);
          const editedKeywords = getEditedValue(result.id, "keywords", result.keywords);
          const hasChanges = !!editedFields[result.id];

          return (
            <div key={result.id} className="p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex gap-4">
                {/* Left: thumbnail + file info */}
                <div className="w-40 min-w-[160px] flex-shrink-0">
                  <div className="w-40 h-40 bg-secondary rounded-lg overflow-hidden flex items-center justify-center border border-border">
                    {/* If there's a preview URL in result.preview it could be shown here */}
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="truncate">{result.filename}</div>
                    {/* size info can be shown if available */}
                  </div>
                </div>

                {/* Right: metadata card */}
                <div className="flex-1">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-foreground">{result.title}</h4>
                    </div>
                    {/* Metadata Edit Section */}
                    <div className="space-y-5">
                {/* Title Field */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 px-1">
                      <Type className="h-5 w-5 text-cyan-400" />
                      <label className="text-sm font-semibold text-foreground tracking-wide">Title</label>
                    </div>
                    <div className="text-xs text-muted-foreground">{String((editedTitle || "").length)} characters</div>
                  </div>
                  <Textarea
                    value={editedTitle}
                    onChange={(e) => handleFieldChange(result.id, "title", e.target.value)}
                    className="text-sm min-h-[56px] resize-none bg-cyan-400/5 border border-cyan-400/30 text-foreground placeholder-muted-foreground/60 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
                    placeholder="Edit title..."
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 px-1">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <label className="text-sm font-semibold text-foreground tracking-wide">Description</label>
                    </div>
                    <div className="text-xs text-muted-foreground">{String((editedDescription || "").length)} characters</div>
                  </div>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => handleFieldChange(result.id, "description", e.target.value)}
                    className="text-sm min-h-[110px] resize-y bg-purple-400/5 border border-purple-400/30 text-foreground placeholder-muted-foreground/60 focus:border-purple-400/60 focus:outline-none focus:ring-1 focus:ring-purple-400/20"
                    placeholder="Edit description..."
                  />
                </div>

                {/* Keywords Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Tag className="h-5 w-5 text-orange-400" />
                    <label className="text-sm font-semibold text-foreground tracking-wide">Keywords ({editedKeywords.length})</label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 rounded bg-secondary/40 min-h-[56px]">
                    {(Array.isArray(editedKeywords) ? editedKeywords : []).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-muted-foreground/10 text-muted-foreground text-xs font-medium rounded-full flex items-center gap-2 border border-muted-foreground/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add keyword (press Enter)"
                    className="mt-2 w-full px-3 py-2 rounded text-xs bg-orange-400/5 border border-orange-400/30 text-foreground placeholder-muted-foreground/60 focus:border-orange-400/60 focus:outline-none focus:ring-1 focus:ring-orange-400/20 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const newKw = Array.isArray(editedKeywords) ? editedKeywords : [];
                        handleFieldChange(result.id, "keywords", [...newKw, e.currentTarget.value.trim()]);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                {/* AI Prompt Section (Read-only) */}
                {result.prompt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <RefreshCw className="h-5 w-5 text-green-400" />
                      <label className="text-sm font-semibold text-foreground tracking-wide">AI Prompt (Generated)</label>
                    </div>
                    <div className="p-3 rounded text-xs text-muted-foreground bg-green-400/5 border border-green-400/30 border-l-2 border-l-green-400 max-h-[100px] overflow-auto">
                      {result.prompt}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 px-3 text-xs font-medium border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all"
                    onClick={() => copyToClipboard(editedTitle, `${result.id}-title`)}
                  >
                    {copiedId === `${result.id}-title` ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Title
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 px-3 text-xs font-medium border-purple-400/30 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400/50 transition-all"
                    onClick={() => copyToClipboard(editedDescription, `${result.id}-desc`)}
                  >
                    {copiedId === `${result.id}-desc` ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Description
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 px-3 text-xs font-medium border-orange-400/30 text-orange-400 hover:bg-orange-400/10 hover:border-orange-400/50 transition-all"
                    onClick={() => copyToClipboard(
                      Array.isArray(editedKeywords) ? editedKeywords.join(", ") : "",
                      `${result.id}-kw`
                    )}
                  >
                    {copiedId === `${result.id}-kw` ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Keywords
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    {hasChanges && (
                      <Button
                        size="sm"
                        className="gap-1.5 h-9 px-4 text-sm font-medium bg-green-600 hover:bg-green-700 transition-all"
                        onClick={() => handleSave(result.id)}
                      >
                        Save Changes
                      </Button>
                    )}

                    <Button
                      size="sm"
                      className="gap-1.5 h-9 px-4 text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => handleRegenerate(result.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Regenerate</span>
                    </Button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPanel;
