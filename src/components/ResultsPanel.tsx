import { useState } from "react";
import { ImageIcon, Copy, Check, Type, FileText, Tag, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Result {
  id: string;
  filename: string;
                  </div>
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

                {/* Copy Buttons Row */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 h-11 px-4 text-sm font-medium border-border text-foreground hover:bg-secondary/40"
                      onClick={() => copyToClipboard(editedTitle, `${result.id}-title`)}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Title</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 gap-2 h-11 px-4 text-sm font-medium border-border text-foreground hover:bg-secondary/40"
                      onClick={() => copyToClipboard(editedDescription, `${result.id}-desc`)}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Description</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 gap-2 h-11 px-4 text-sm font-medium border-border text-foreground hover:bg-secondary/40"
                      onClick={() => copyToClipboard(Array.isArray(editedKeywords) ? editedKeywords.join(", ") : "", `${result.id}-kw`)}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Keywords</span>
                    </Button>
                  </div>

                  <div className="flex justify-end mt-3">
                    <div className="flex items-center gap-2">
                      {hasChanges && (
                        <Button
                          size="sm"
                          className="gap-1.5 h-10 px-4 text-sm font-medium bg-green-600 hover:bg-green-700"
                          onClick={() => handleSave(result.id)}
                        >
                          Save Changes
                        </Button>
                      )}

                      <Button
                        size="sm"
                        className="gap-1.5 h-10 px-4 text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() => handleRegenerate(result.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Regenerate</span>
                      </Button>
                    </div>
                  </div>
                </div>
                    {/* Trash overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <Trash2 className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <div className="truncate font-medium text-foreground">{result.filename}</div>
                    {result.size && (
                      <div className="text-muted-foreground">
                        Size: {(result.size / 1024).toFixed(0)} KB · {(result.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
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
                <div className="flex items-center gap-2 pt-4 border-t border-border/50 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-9 px-3 text-xs font-medium border-border text-foreground hover:bg-secondary/50"
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
                    className="gap-1.5 h-9 px-3 text-xs font-medium border-border text-foreground hover:bg-secondary/50"
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
                    className="gap-1.5 h-9 px-3 text-xs font-medium border-border text-foreground hover:bg-secondary/50"
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
