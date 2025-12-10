import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST /api/generate/metadata
// body: { filename: string } (for now minimal)
router.post("/metadata", async (req, res) => {
  const { filename } = req.body;

  // If GEMINI_API_KEY is not set, return mock metadata
  if (!process.env.GEMINI_API_KEY) {
    // Simple mock: derive title/description/keywords from filename
    const base = filename ? filename.replace(/\.[^/.]+$/, "") : "Example Image";
    const title = `${base} - Premium Stock Image`;
    const description = `High-quality stock image featuring ${base}. This professionally curated image is perfect for commercial use, editorial projects, and digital marketing campaigns. Ideal for microstock platforms including Shutterstock, Getty Images, Adobe Stock, and more. Generated with CSVnest AI metadata tools.`;
    const keywords = base.split(/[-_\s]+/).slice(0, 10).map(k => k.toLowerCase()).filter(Boolean);
    const prompt = `Professional product photography of ${base}, studio lighting, high resolution, clean background, suitable for stock photography`;
    return res.json({ title, description, keywords, prompt });
  }

  // Placeholder for real Gemini integration
  try {
    // Real implementation would call Google Gemini API with filename as context
    // For now, return enhanced mock data
    const base = filename ? filename.replace(/\.[^/.]+$/, "") : "Example Image";
    const title = `${base} - Premium Stock Image`;
    const description = `Professional stock image of ${base} perfect for editorial, commercial, and creative projects. High resolution with excellent composition and lighting suitable for microstock platforms. Great for marketing materials, web design, and print media. Metadata optimized for maximum discoverability.`;
    const keywords = base ? base.split(/[-_\s]+/).slice(0,10).map(k => k.toLowerCase()).filter(Boolean) : ["stock", "photo"];
    const prompt = `Professional product photography of ${base}, studio lighting, high resolution, clean white background, suitable for stock photography and commercial use`;
    return res.json({ title, description, keywords, prompt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate metadata" });
  }
});

export default router;
