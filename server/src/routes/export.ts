import express from "express";
import { generateCSV, MetadataRow } from "../lib/csv";

const router = express.Router();

// POST /api/export/csv
// Generate and return CSV file
router.post("/csv", async (req, res) => {
  try {
    const { metadata, platform = "all", fileName = "csvnest-export.csv" } = req.body;

    if (!Array.isArray(metadata) || metadata.length === 0) {
      return res.status(400).json({ error: "metadata array required" });
    }

    const csv = generateCSV(metadata as MetadataRow[], platform);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

// POST /api/export/get-csv-content
// Get CSV content without downloading
router.post("/get-csv-content", async (req, res) => {
  try {
    const { metadata, platform = "all" } = req.body;

    if (!Array.isArray(metadata) || metadata.length === 0) {
      return res.status(400).json({ error: "metadata array required" });
    }

    const csv = generateCSV(metadata as MetadataRow[], platform);

    res.json({ csv, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate CSV content" });
  }
});

export default router;
