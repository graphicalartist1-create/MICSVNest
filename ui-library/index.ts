/**
 * UI Library - Main Entry Point
 * Re-exports all reusable components for easy importing
 */

// Export all components
export { default as FileUpload } from './components/FileUpload';
export { default as ResultsPanel } from './components/ResultsPanel';
export { default as MetadataGeneratedDialog } from './components/MetadataGeneratedDialog';
export { default as ExportDialog } from './components/ExportDialog';

// Export utilities
export { exportAsCSV, exportAsJSON, isVectorFile, isImageFile } from './lib/export';
export { generateMetadataForFile, generatePromptForFile } from './lib/generator';

// Export types
export type { ExportResult } from './lib/export';
