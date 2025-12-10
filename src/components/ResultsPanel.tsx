import { ImageIcon } from "lucide-react";

interface Result {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
}

interface ResultsPanelProps {
  results: Result[];
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  if (results.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-primary text-lg mb-2">Your generated results will appear here.</p>
        <p className="text-muted-foreground">
          Upload some files and click "Generate All" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Generated Results ({results.length})</h3>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-auto">
        {results.map((result) => (
          <div key={result.id} className="p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">{result.filename}</p>
                <h4 className="font-medium text-foreground mb-1 truncate">{result.title}</h4>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{result.description}</p>
                <div className="flex flex-wrap gap-1">
                  {result.keywords.slice(0, 5).map((keyword, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                  {result.keywords.length > 5 && (
                    <span className="px-2 py-0.5 text-xs text-muted-foreground">
                      +{result.keywords.length - 5} more
                    </span>
                  )}
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
