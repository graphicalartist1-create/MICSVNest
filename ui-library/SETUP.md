# UI Library Setup Guide

## Quick Start

This UI library is designed to be portable — copy the entire `ui-library` folder to any React + TypeScript project and use immediately.

### Step 1: Copy Files

```bash
# Copy ui-library folder to your new project root
cp -r /path/to/csvnest/ui-library /path/to/your-new-project/
```

### Step 2: Dependencies

```bash
npm install react typescript lucide-react tailwindcss
npm install -D @types/react @types/react-dom
```

### Step 3: shadcn/ui Components

You need these shadcn/ui base components. Run each:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add alert
```

### Step 4: Path Alias Configuration

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/components/ui/*": ["./components/ui/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

### Step 5: Use in Your App

```tsx
import { FileUpload, ResultsPanel } from './ui-library';

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState([]);

  return (
    <>
      <FileUpload
        files={files}
        onFilesChange={setFiles}
        onGenerate={() => console.log('Generate')}
        onExport={() => console.log('Export')}
        isGenerating={false}
      />
      <ResultsPanel results={results} />
    </>
  );
}
```

## Component Source Files

The following files are in the CSVnest project and need to be copied to your `ui-library/components/`:

1. **FileUpload.tsx** — `src/components/FileUpload.tsx`
2. **ResultsPanel.tsx** — `src/components/ResultsPanel.tsx`
3. **MetadataGeneratedDialog.tsx** — `src/components/MetadataGeneratedDialog.tsx`
4. **ExportDialog.tsx** — `src/components/ExportDialog.tsx`

Utility files in `ui-library/lib/`:

1. **export.ts** — `src/lib/export.ts` (CSV/JSON export utilities)
2. **generator.ts** — `src/lib/generator.ts` (Mock metadata generator)

## Customization

### API Endpoints

Each component is designed to accept callbacks. You can integrate your own API:

```tsx
const handleGenerate = async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ files, settings })
  });
  const data = await response.json();
  setResults(data);
};

<FileUpload onGenerate={handleGenerate} />
```

### Settings & Configuration

Pass props to customize behavior:

```tsx
<FileUpload
  imageType="vector"  // Custom image type
  isGenerating={state.isGenerating}
/>

<ResultsPanel
  results={customResults}
  onUpdateResult={(id, fields) => {
    // Your API call
    api.updateMetadata(id, fields);
  }}
/>
```

### Styling

All components use Tailwind CSS. Customize by modifying:
- Tailwind config colors
- CSS classes in component files
- Theme variables

## Troubleshooting

**Q: Import errors for shadcn components**
- Ensure all shadcn/ui components are installed in your project
- Check path aliases in tsconfig.json

**Q: TypeScript errors**
- Make sure `@types/react` is installed
- Check TypeScript version (>= 4.5)

**Q: Styling looks wrong**
- Verify Tailwind CSS is properly configured
- Check for CSS conflicts with existing styles

## File Structure After Copy

```
your-new-project/
├── ui-library/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── MetadataGeneratedDialog.tsx
│   │   └── ExportDialog.tsx
│   ├── lib/
│   │   ├── export.ts
│   │   └── generator.ts
│   ├── index.ts
│   ├── package.json
│   └── README.md
├── components/ui/  (shadcn components)
├── src/
│   └── App.tsx
└── tsconfig.json
```

## Support

For component updates, check the main CSVnest repository for latest versions.
