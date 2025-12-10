import { parse } from "csv-stringify";

export interface MetadataRow {
  filename: string;
  title: string;
  description: string;
  keywords: string;
  aiPrompt?: string;
}

export function generateCSV(metadata: MetadataRow[], platform: "all" | "adobe" | "shutterstock" | "freepik" | "vecteezy" | "pond5" = "all"): string {
  // Platform-specific CSV column mappings
  const platformColumnMap: Record<string, string[]> = {
    adobe: ["Filename", "Title", "Description", "Keywords"],
    shutterstock: ["Filename", "Title", "Description", "Keywords"],
    freepik: ["Filename", "Title", "Description", "Keywords"],
    vecteezy: ["Filename", "Title", "Description", "Keywords"],
    pond5: ["Filename", "Title", "Description", "Keywords"],
    all: ["Filename", "Title", "Description", "Keywords", "AI Prompt"],
  };

  const columns = platformColumnMap[platform] || platformColumnMap.all;
  let csv = columns.join(",") + "\n";

  metadata.forEach((row) => {
    const values = [
      `"${row.filename.replace(/"/g, '""')}"`,
      `"${row.title.replace(/"/g, '""')}"`,
      `"${row.description.replace(/"/g, '""')}"`,
      `"${row.keywords.replace(/"/g, '""')}"`,
    ];

    if (platform === "all" && row.aiPrompt) {
      values.push(`"${row.aiPrompt.replace(/"/g, '""')}"`);
    }

    csv += values.join(",") + "\n";
  });

  return csv;
}
