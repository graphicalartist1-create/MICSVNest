import express from "express";
import { getPresignedPutUrl } from "../lib/s3";

const router = express.Router();

// POST /api/upload/presign
// body: { filename: string, contentType: string }
router.post("/presign", async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) return res.status(400).json({ error: "filename and contentType required" });

    const keyPrefix = `uploads/${Date.now()}_`;
    const key = `${keyPrefix}${filename}`;
    const url = await getPresignedPutUrl(key, contentType);

    res.json({ url, key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create presigned url" });
  }
});

export default router;
