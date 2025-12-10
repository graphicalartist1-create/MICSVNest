/**
 * Export utilities for metadata and prompts
 */

export interface ExportResult {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
}

// Detect if file is vector or raster/image
export function isVectorFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const vectorExts = ['ai', 'eps', 'svg', 'pdf'];
  return vectorExts.includes(ext);
}

export function isImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
  return imageExts.includes(ext);
}

// Export as CSV (suitable for all file types)
export function exportAsCSV(results: ExportResult[], filename = 'csvnest-metadata.csv'): void {
  const csvContent = [
    ['Filename', 'Title', 'Description', 'Keywords', 'Prompt'].join(','),
    ...results.map((r) =>
      [
        r.filename,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.description.replace(/"/g, '""')}"`,
        `"${r.keywords.join(', ')}"`,
        r.prompt ? `"${r.prompt.replace(/"/g, '""')}"` : '""',
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Export as JSON (alternative format)
export function exportAsJSON(results: ExportResult[], filename = 'csvnest-metadata.json'): void {
  const jsonContent = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Export vector metadata (for .ai, .eps, .svg files)
export function exportVectorMetadata(results: ExportResult[]): void {
  exportAsCSV(results, 'vector-metadata.csv');
}

// Export image metadata (for jpg, png, etc)
export function exportImageMetadata(results: ExportResult[]): void {
  exportAsCSV(results, 'image-metadata.csv');
}

// Get recommended export format based on file types
export function getRecommendedExportFormat(files: { filename: string }[]): 'vector' | 'image' | 'mixed' {
  if (files.length === 0) return 'mixed';
  
  const vectors = files.filter(f => isVectorFile(f.filename)).length;
  const images = files.filter(f => isImageFile(f.filename)).length;
  
  if (vectors > 0 && images === 0) return 'vector';
  if (images > 0 && vectors === 0) return 'image';
  return 'mixed';
}
