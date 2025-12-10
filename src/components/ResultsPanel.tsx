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
      <div className="divide-y divide-border max-h-[800px] overflow-auto">
        {results.map((result) => {
          const editedTitle = getEditedValue(result.id, "title", result.title);
          const editedDescription = getEditedValue(result.id, "description", result.description);
          const editedKeywords = getEditedValue(result.id, "keywords", result.keywords);
          const hasChanges = !!editedFields[result.id];

          return (
            <div key={result.id} className="p-4 hover:bg-secondary/50 transition-colors space-y-4">
              {/* File Info & Thumbnail */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{result.filename}</p>
                </div>
              </div>

              {/* Metadata Edit Section */}
              <div className="space-y-5 border-t border-border/50 pt-4">
                {/* Title Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Type className="h-5 w-5 text-cyan-400" />
                    <label className="text-sm font-semibold text-foreground tracking-wide">Title</label>
                  </div>
                  <Textarea
                    value={editedTitle}
                    onChange={(e) => handleFieldChange(result.id, "title", e.target.value)}
                    className="text-xs min-h-[60px] resize-none bg-cyan-400/5 border border-cyan-400/30 text-foreground placeholder-muted-foreground/60 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
                    placeholder="Edit title..."
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <label className="text-sm font-semibold text-foreground tracking-wide">Description</label>
                  </div>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => handleFieldChange(result.id, "description", e.target.value)}
                    className="text-xs min-h-[80px] resize-none bg-purple-400/5 border border-purple-400/30 text-foreground placeholder-muted-foreground/60 focus:border-purple-400/60 focus:outline-none focus:ring-1 focus:ring-purple-400/20"
                    placeholder="Edit description..."
                  />
                </div>

                {/* Keywords Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Tag className="h-5 w-5 text-orange-400" />
                    <label className="text-sm font-semibold text-foreground tracking-wide">Keywords ({editedKeywords.length})</label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 rounded border border-orange-400/30 bg-orange-400/5 min-h-[50px]">
                    {(Array.isArray(editedKeywords) ? editedKeywords : []).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-orange-400/20 text-orange-300 text-xs font-medium rounded-full flex items-center gap-2 border border-orange-400/40"
                      >
                        {keyword}
                        <button
                          onClick={() => {
                            const updatedKw = Array.isArray(editedKeywords)
                              ? editedKeywords.filter((_, idx) => idx !== i)
                              : [];
                            handleFieldChange(result.id, "keywords", updatedKw);
                          }}
                          className="hover:text-orange-400 font-bold transition-colors"
                        >
                          ×
                        </button>
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
                <div className="flex gap-2 flex-wrap pt-3 border-t border-border/50">
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

                  <div className="flex-1" />

                  {hasChanges && (
                    <Button
                      size="sm"
                      className="gap-1.5 h-8 px-3 text-xs font-medium bg-green-600 hover:bg-green-700 transition-all"
                      onClick={() => handleSave(result.id)}
                    >
                      Save Changes
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 px-3 text-xs font-medium border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/50 transition-all"
                    onClick={() => handleRegenerate(result.id)}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
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
