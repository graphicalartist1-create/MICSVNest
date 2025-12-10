import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload";
import metadataRouter from "./routes/metadata";
import exportRouter from "./routes/export";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/metadata", metadataRouter);
app.use("/api/export", exportRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "CSVnest server is running" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
  if (!process.env.S3_BUCKET) {
    console.log("⚠️  S3_BUCKET not set - uploads will use mock mode");
  }
  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️  GEMINI_API_KEY not set - using fallback metadata generation");
  }
});
