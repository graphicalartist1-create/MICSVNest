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
              <div className="space-y-4 border-t border-border/50 pt-4">
                {/* Title Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4 text-cyan-400" />
                    <label className="text-sm font-medium text-foreground">Title</label>
                  </div>
                  <Textarea
                    value={editedTitle}
                    onChange={(e) => handleFieldChange(result.id, "title", e.target.value)}
                    className="text-xs min-h-[60px] resize-none bg-secondary/30 border-cyan-400/30"
                    placeholder="Edit title..."
                  />
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    <label className="text-sm font-medium text-foreground">Description</label>
                  </div>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => handleFieldChange(result.id, "description", e.target.value)}
                    className="text-xs min-h-[80px] resize-none bg-secondary/30 border-purple-400/30"
                    placeholder="Edit description..."
                  />
                </div>

                {/* Keywords Field */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-orange-400" />
                    <label className="text-sm font-medium text-foreground">Keywords ({editedKeywords.length})</label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 rounded bg-secondary/30 border border-orange-400/30 min-h-[50px]">
                    {(Array.isArray(editedKeywords) ? editedKeywords : []).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-orange-400/20 text-orange-300 text-xs font-medium rounded-full flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => {
                            const updatedKw = Array.isArray(editedKeywords)
                              ? editedKeywords.filter((_, idx) => idx !== i)
                              : [];
                            handleFieldChange(result.id, "keywords", updatedKw);
                          }}
                          className="hover:text-orange-400 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add keyword (press Enter)"
                    className="mt-2 w-full px-3 py-2 rounded text-xs bg-secondary/20 border border-orange-400/20 text-foreground placeholder-muted-foreground"
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
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-green-400" />
                      <label className="text-sm font-medium text-foreground">AI Prompt (Generated)</label>
                    </div>
                    <div className="p-3 rounded text-xs text-muted-foreground bg-secondary/30 border border-green-400/30 border-l-2 border-l-green-400 max-h-[100px] overflow-auto">
                      {result.prompt}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 h-8 text-xs"
                    onClick={() => copyToClipboard(editedTitle, `${result.id}-title`)}
                  >
                    {copiedId === `${result.id}-title` ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Title
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 h-8 text-xs"
                    onClick={() => copyToClipboard(editedDescription, `${result.id}-desc`)}
                  >
                    {copiedId === `${result.id}-desc` ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Description
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 h-8 text-xs"
                    onClick={() => copyToClipboard(
                      Array.isArray(editedKeywords) ? editedKeywords.join(", ") : "",
                      `${result.id}-kw`
                    )}
                  >
                    {copiedId === `${result.id}-kw` ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Keywords
                      </>
                    )}
                  </Button>

                  <div className="flex-1" />

                  {hasChanges && (
                    <Button
                      size="sm"
                      className="gap-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => handleSave(result.id)}
                    >
                      Save Changes
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 h-8 text-xs border-amber-400/50 text-amber-400 hover:bg-amber-400/10"
                    onClick={() => handleRegenerate(result.id)}
                  >
                    <RefreshCw className="h-3 w-3" /> Regenerate
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
