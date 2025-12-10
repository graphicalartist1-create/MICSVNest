# Metadata UI Library

A reusable, configuration-driven UI library for file upload, metadata generation, editing, and export workflows. Perfect for integrating into any project that needs rich metadata management capabilities.

## Features

- **File Upload Component** — Drag & drop file queuing, progress tracking, and upload management
- **Results Panel** — Display, edit, and manage generated metadata with real-time character counters
- **Metadata Generation Dialog** — Post-generation sharing and export options (social media, CSV, ZIP)
- **Export Dialog** — Flexible CSV/ZIP export functionality
- **Progress Bar** — Simulated progress with stop functionality
- **Copy Functionality** — One-click copy to clipboard with visual feedback
- **Responsive Design** — Tailwind CSS styled, works on all screen sizes

## Installation

1. **Copy the entire `ui-library` folder to your project**
2. **Install dependencies:**
   ```bash
   npm install react typescript lucide-react tailwindcss
   ```

3. **Ensure your project has shadcn/ui components** (Button, Dialog, Input, Textarea, Checkbox, Alert)
   ```bash
   npx shadcn-ui@latest add button dialog input textarea checkbox alert
   ```

## Usage

### Basic Setup

```tsx
import { FileUpload, ResultsPanel, MetadataGeneratedDialog } from './ui-library';

export default function MyApp() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const handleGenerate = async () => {
    // Your generation logic here
    // Call your API or local generator
  };

  return (
    <div>
      <FileUpload 
        files={files}
        onFilesChange={setFiles}
        onGenerate={handleGenerate}
        onExport={() => console.log('Export')}
        isGenerating={false}
      />
      
      <ResultsPanel 
        results={results}
        onUpdateResult={(id, fields) => console.log('Update', id, fields)}
        onRegenerate={(id) => console.log('Regenerate', id)}
      />

      <MetadataGeneratedDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        results={results}
        isVectorFile={false}
      />
    </div>
  );
}
```

## Components

### FileUpload
Handles file selection, queuing, and progress tracking.

**Props:**
- `files: File[]` — Current file list
- `onFilesChange: (files: File[]) => void` — Callback when files change
- `onGenerate: () => void` — Callback to trigger generation
- `onExport: () => void` — Callback for export action
- `isGenerating: boolean` — Show generating state
- `imageType?: string` — Type of images being processed

### ResultsPanel
Display and edit generated metadata.

**Props:**
- `results: Result[]` — Array of generated results
- `onUpdateResult?: (id: string, fields: Partial<Result>) => void` — Save edits
- `onRegenerate?: (id: string) => void` — Regenerate single result

**Result Interface:**
```typescript
interface Result {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
  size?: number;
  preview?: string;
}
```

### MetadataGeneratedDialog
Post-generation success dialog with sharing and export options.

**Props:**
- `open: boolean` — Dialog visibility
- `onOpenChange: (open: boolean) => void` — Visibility callback
- `results: Result[]` — Results to export
- `isVectorFile?: boolean` — Show vector ZIP export option

### ExportDialog
CSV export dialog.

**Props:**
- `open: boolean` — Dialog visibility
- `onOpenChange: (open: boolean) => void` — Visibility callback
- `results: Result[]` — Data to export
- `files: { name: string }[]` — File list

## Customization

### Styling
All components use Tailwind CSS classes. Customize via:
- Tailwind config (`tailwind.config.ts`)
- CSS variables for colors (dark mode support built-in)

### Configuration
Modify component props to customize behavior:

```tsx
// Custom file size formatting
<FileUpload 
  files={files}
  onFilesChange={setFiles}
  imageType="vector" // Shows vector-specific options
/>

// Custom result handlers
<ResultsPanel
  results={results}
  onUpdateResult={(id, fields) => {
    // Save to your API
    api.updateResult(id, fields);
  }}
/>
```

## File Structure

```
ui-library/
├── components/
│   ├── FileUpload.tsx
│   ├── ResultsPanel.tsx
│   ├── MetadataGeneratedDialog.tsx
│   ├── ExportDialog.tsx
│   └── [other components]
├── lib/
│   ├── export.ts          # CSV export utilities
│   └── generator.ts       # Mock metadata generator
├── package.json
├── README.md
└── index.ts               # Re-exports all components
```

## Dependencies

- **React** >= 18.0
- **TypeScript** >= 4.5
- **Tailwind CSS** >= 3.0
- **lucide-react** (for icons)
- **shadcn/ui** (for base components)

## License

MIT

## Support

For issues, feature requests, or contributions, please refer to the main CSVnest repository.
