import express from "express";
import { generateMetadata, generateMetadataWithGemini } from "../lib/gemini";

const router = express.Router();

// POST /api/metadata/generate
// Generate metadata for a file
router.post("/generate", async (req, res) => {
  try {
    const {
      filename,
      imageType,
      titleLength = 50,
      keywordCount = 10,
      prefix,
      suffix,
      negativeKeywords,
    } = req.body;

    if (!filename) return res.status(400).json({ error: "filename required" });

    const metadata = await generateMetadata(filename, imageType, titleLength, keywordCount, prefix, suffix, negativeKeywords);

    res.json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate metadata" });
  }
});

// POST /api/metadata/generate-batch
// Generate metadata for multiple files
router.post("/generate-batch", async (req, res) => {
  try {
    const { files } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "files array required" });
    }

    const results = await Promise.all(
      files.map((f: { filename: string; imageType?: string; titleLength?: number; keywordCount?: number }) =>
        generateMetadata(f.filename, f.imageType, f.titleLength, f.keywordCount)
      )
    );

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate metadata batch" });
  }
});

export default router;
