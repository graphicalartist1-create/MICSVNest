import { useState } from "react";
import { ImageIcon, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  return (
    <div>
      <div className="py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Generated Results ({results.length})</h3>
      </div>
      <div className="divide-y divide-border max-h-[600px] overflow-auto">
        {results.map((result) => (
          <div key={result.id} className="p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">{result.filename}</p>
                <h4 className="font-medium text-foreground mb-3">{result.title}</h4>

                <div className="space-y-3">
                  {/* Description Section */}
                  <div>
                    <button
                      onClick={() => setExpandedId(expandedId === `${result.id}-desc` ? null : `${result.id}-desc`)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 mb-1"
                    >
                      <span>{expandedId === `${result.id}-desc` ? "▼" : "▶"}</span> Description
                    </button>
                    {expandedId === `${result.id}-desc` && (
                      <div className="bg-secondary/30 p-2 rounded text-xs text-muted-foreground mb-2 border-l-2 border-cyan-400">
                        {result.description}
                      </div>
                    )}
                  </div>

                  {/* Keywords Section */}
                  <div>
                    <button
                      onClick={() => setExpandedId(expandedId === `${result.id}-kw` ? null : `${result.id}-kw`)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 mb-1"
                    >
                      <span>{expandedId === `${result.id}-kw` ? "▼" : "▶"}</span> Keywords ({result.keywords.length})
                    </button>
                    {expandedId === `${result.id}-kw` && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {result.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prompt Section */}
                  {result.prompt && (
                    <div>
                      <button
                        onClick={() => setExpandedId(expandedId === `${result.id}-prompt` ? null : `${result.id}-prompt`)}
                        className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 mb-1"
                      >
                        <span>{expandedId === `${result.id}-prompt` ? "▼" : "▶"}</span> AI Prompt
                      </button>
                      {expandedId === `${result.id}-prompt` && (
                        <div className="bg-secondary/30 p-2 rounded text-xs text-muted-foreground mb-2 border-l-2 border-purple-400">
                          {result.prompt}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Copy Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-7 text-xs"
                      onClick={() => copyToClipboard(result.title, `${result.id}-title`)}
                    >
                      {copiedId === `${result.id}-title` ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Title
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-7 text-xs"
                      onClick={() => copyToClipboard(result.keywords.join(", "), `${result.id}-kw`)}
                    >
                      {copiedId === `${result.id}-kw` ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Keywords
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-7 text-xs"
                      onClick={() => copyToClipboard(result.description, `${result.id}-desc`)}
                    >
                      {copiedId === `${result.id}-desc` ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Desc
                        </>
                      )}
                    </Button>
                    {result.prompt && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 h-7 text-xs"
                        onClick={() => copyToClipboard(result.prompt || "", `${result.id}-prompt`)}
                      >
                        {copiedId === `${result.id}-prompt` ? (
                          <>
                            <Check className="h-3 w-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Prompt
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;
