/**
 * INSTALLATION INSTRUCTIONS
 * 
 * To use this UI library in another project:
 * 
 * 1. Copy the entire ui-library folder to your new project
 * 
 * 2. Install dependencies:
 *    npm install react typescript lucide-react tailwindcss
 * 
 * 3. Ensure you have shadcn/ui components installed:
 *    npx shadcn-ui@latest add button dialog input textarea checkbox alert
 * 
 * 4. Update your imports in tsconfig.json for path aliases:
 *    "@/components/ui/*": ["path/to/shadcn/components/*"]
 * 
 * 5. Import components in your app:
 *    import { FileUpload, ResultsPanel } from './ui-library';
 * 
 * 6. Use them with your own handlers and configuration
 */

// Quick Example Component Usage
export const ExampleUsage = `
import { FileUpload, ResultsPanel, MetadataGeneratedDialog } from './ui-library';
import { useState } from 'react';

export default function MetadataApp() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Your custom generation logic here
    // Call your API, backend service, or local generator
    setIsGenerating(false);
    setShowDialog(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <FileUpload
        files={files}
        onFilesChange={setFiles}
        onGenerate={handleGenerate}
        onExport={() => console.log('Export')}
        isGenerating={isGenerating}
      />

      <ResultsPanel
        results={results}
        onUpdateResult={(id, fields) => {
          setResults(prev => 
            prev.map(r => r.id === id ? { ...r, ...fields } : r)
          );
        }}
        onRegenerate={(id) => {
          // Regenerate logic
          console.log('Regenerate', id);
        }}
      />

      <MetadataGeneratedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        results={results}
      />
    </div>
  );
}
`;

export default ExampleUsage;
