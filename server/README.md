# Server (Express + TypeScript)

This lightweight server provides:

- `/api/upload/presign` — create presigned PUT URLs for S3 uploads
- `/api/generate/metadata` — stubbed Gemini metadata generator (mock mode if `GEMINI_API_KEY` not set)

Environment variables (see `.env.example`):

- `AWS_REGION` — AWS region
- `S3_BUCKET` — S3 bucket name
- `GEMINI_API_KEY` — optional, integrate real Gemini when available
- `PORT` — server port (default 4000)

Run locally:

```powershell
cd server
npm install
npm run dev
```

Notes:
- This is a scaffolding to integrate with the frontend. Presigned URLs use `PUT` to S3; the frontend uses XHR for upload progress.
- Do NOT store secrets in source control; use environment variables in your deployment.
