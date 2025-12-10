import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload";
import generatorRouter from "./routes/generator";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/generate", generatorRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
