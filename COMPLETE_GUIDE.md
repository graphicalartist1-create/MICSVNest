# CSVnest - সম্পূর্ণ প্রজেক্ট গাইড

## প্রজেক্ট ওভারভিউ

CSVnest হল একটি AI-চালিত মেটাডেটা জেনারেটর এবং মাইক্রোস্টক এক্সপোর্ট টুল যা:

- ছবি, ভিডিও, SVG, EPS ফাইল আপলোড করতে দেয় (500 পর্যন্ত)
- AI ব্যবহার করে স্বয়ংক্রিয় শিরোনাম, বর্ণনা, কীওয়ার্ড এবং প্রম্পট তৈরি করে
- একাধিক মাইক্রোস্টক প্ল্যাটফর্মের জন্য CSV এক্সপোর্ট করে
- রিয়েল-টাইম প্রসেসিং স্ট্যাটাস দেখায়
- ব্যবহারকারীদের মেটাডেটা এডিট করার সুযোগ দেয়

## ফোল্ডার স্ট্রাকচার

```
csvnest-clone/
├── server/                      # Express.ts ব্যাকএন্ড
│   ├── src/
│   │   ├── db/
│   │   │   └── schema.ts       # Drizzle ORM স্কিমা
│   │   ├── lib/
│   │   │   ├── s3.ts           # S3 প্রেসাইন্ড URLs
│   │   │   ├── gemini.ts       # AI মেটাডেটা জেনারেশন
│   │   │   └── csv.ts          # CSV জেনারেশন লজিক
│   │   ├── routes/
│   │   │   ├── upload.ts       # ফাইল আপলোড এন্ডপয়েন্ট
│   │   │   ├── metadata.ts     # মেটাডেটা জেনারেশন
│   │   │   └── export.ts       # CSV এক্সপোর্ট
│   │   └── index.ts            # মেইন সার্ভার ফাইল
│   ├── package.json
│   └── tsconfig.json
│
├── src/                         # React ফ্রন্টএন্ড
│   ├── components/
│   │   ├── FileUpload.tsx      # অ্যাডভান্সড ফাইল আপলোডার (500 ফাইল, প্রগ্রেস)
│   │   ├── ResultsPanel.tsx    # মেটাডেটা ফলাফল প্যানেল
│   │   ├── AdvancedControls.tsx # জেনারেশন সেটিংস
│   │   ├── MetadataEditor.tsx  # মেটাডেটা এডিট ইন্টারফেস
│   │   ├── ExportPanel.tsx     # CSV এক্সপোর্ট প্যানেল
│   │   └── ui/                 # shadcn/ui কম্পোনেন্ট
│   ├── pages/
│   │   ├── Dashboard.tsx       # মূল ড্যাশবোর্ড পেজ
│   │   └── Index.tsx           # রুট পেজ
│   ├── lib/
│   │   └── utils.ts
│   └── main.tsx
│
├── package.json               # ফ্রন্টএন্ড ডিপেন্ডেন্সি
└── vite.config.ts
```

## সেটআপ এবং ইনস্টলেশন

### প্রয়োজনীয়তা
- Node.js 18+
- npm / pnpm / bun
- AWS S3 বালতি (optional, mock মোডও সাপোর্ট করে)
- Gemini API কী (optional, ফলব্যাক জেনারেটর থাকবে)

### ধাপ 1: ফ্রন্টএন্ড সেটআপ

```bash
cd csvnest-clone
npm install
npm run dev
# Frontend চলবে http://localhost:5173 এ
```

### ধাপ 2: ব্যাকএন্ড সেটআপ

```bash
cd server
npm install

# .env ফাইল তৈরি করুন (.env.example থেকে কপি করুন)
cp .env.example .env

# এডিট করুন:
# - AWS_REGION, S3_BUCKET, AWS credentials
# - GEMINI_API_KEY (optional)
# - PORT, FRONTEND_URL
```

### ধাপ 3: সার্ভার চালান

```bash
cd server
npm run dev
# Server চলবে http://localhost:4000 এ
```

### ধাপ 4: ফ্রন্টএন্ড এনভায়রনমেন্ট ভেরিয়েবল (optional)

`.env.local` ফাইল তৈরি করুন রুট ডিরেক্টরিতে:

```
VITE_API_BASE=http://localhost:4000
```

(বা পরিবেশ ভেরিয়েবল `REACT_APP_API_BASE` সেট করুন)

## API এন্ডপয়েন্ট

### আপলোড

```
POST /api/upload/presign
Request: { filename: string, contentType: string }
Response: { url: string, key: string }
```

### মেটাডেটা জেনারেশন

```
POST /api/metadata/generate
Request: {
  filename: string,
  imageType?: "raster" | "vector" | "video" | "mixed",
  titleLength?: number (default: 50),
  keywordCount?: number (default: 10),
  prefix?: string,
  suffix?: string,
  negativeKeywords?: string[]
}
Response: { title, description, keywords, prompt }
```

### ব্যাচ মেটাডেটা জেনারেশন

```
POST /api/metadata/generate-batch
Request: {
  files: Array<{ filename, imageType?, titleLength?, keywordCount? }>
}
Response: { success: true, results: Array<metadata> }
```

### CSV এক্সপোর্ট

```
POST /api/export/csv
Request: {
  metadata: Array<{ filename, title, description, keywords, aiPrompt? }>,
  platform: "all" | "adobe" | "shutterstock" | "freepik" | "vecteezy" | "pond5",
  fileName?: string
}
Response: CSV file (attachment)
```

```
POST /api/export/get-csv-content
Request: { metadata, platform }
Response: { csv: string, success: true }
```

## ফিচার ডিটেইলস

### 1. ফাইল আপলোড সিস্টেম
- সাপোর্টেড ফরম্যাট: JPG, PNG, SVG, EPS, MP4, WebM, WEBP, এবং আরও অনেক কিছু
- সীমা: 500 ফাইল একসাথে
- প্রগ্রেস ট্র্যাকিং: প্রতিটি ফাইলের জন্য পার্সেন্টেজ দেখায়
- S3 ইন্টিগ্রেশন: Presigned PUT URLs ব্যবহার করে নিরাপদ আপলোড

### 2. AI মেটাডেটা জেনারেশন
- স্বয়ংক্রিয় শিরোনাম: ফাইল নাম থেকে উদ্ভূত
- বিবরণ: ইমেজ ধরন এবং প্রসঙ্গের উপর ভিত্তি করে
- কীওয়ার্ড: ইংরেজি + বিশেষ ফিল্টারিং
- AI প্রম্পট: ইমেজ জেনারেটরের জন্য

### 3. অ্যাডভান্সড কন্ট্রোল
- শিরোনাম দৈর্ঘ্য (10-255 অক্ষর)
- কীওয়ার্ড সংখ্যা (1-50)
- ইমেজ ধরন: রাস্টার, ভেক্টর, ভিডিও
- প্রিফিক্স/সাফিক্স: শিরোনামে কাস্টম টেক্সট যোগ করুন
- নেগেটিভ কীওয়ার্ড: বাদ দেওয়ার জন্য কীওয়ার্ড তালিকা

### 4. মেটাডেটা এডিটর
- সরাসরি শিরোনাম, বিবরণ, কীওয়ার্ড এডিট করুন
- কপি-টু-ক্লিপবোর্ড ফাংশনালিটি
- কীওয়ার্ড ব্যাজ উইথ রিমুভ বাটন

### 5. CSV এক্সপোর্ট
প্ল্যাটফর্ম-স্পেসিফিক কলাম ম্যাপিং:

| প্ল্যাটফর্ম | কলাম |
|----------|--------|
| All | Filename, Title, Description, Keywords, AI Prompt |
| Adobe Stock | Filename, Title, Description, Keywords |
| Shutterstock | Filename, Title, Description, Keywords |
| Freepik | Filename, Title, Description, Keywords |
| Vecteezy | Filename, Title, Description, Keywords |
| Pond5 | Filename, Title, Description, Keywords |

### 6. রিয়েল-টাইম স্ট্যাটাস
- প্রোগ্রেস বার: জেনারেশন/এক্সপোর্ট অগ্রগতি দেখায়
- স্ট্যাটাস ইন্ডিকেটর: প্রতিটি ফাইলের জন্য (queued, uploading, uploaded, processing, completed)
- এরর হ্যান্ডলিং: ব্যবহারকারী-বান্ধব ত্রুটি বার্তা

## ব্যবহারের ফ্লো

1. **ফাইল আপলোড করুন**
   - ড্র্যাগ অ্যান্ড ড্রপ বা ফাইল নির্বাচন করুন
   - সর্বোচ্চ 500 ফাইল এক সাথে যোগ করুন

2. **অ্যাডভান্সড সেটিংস কনফিগার করুন (optional)**
   - শিরোনাম দৈর্ঘ্য সমন্বয় করুন
   - কীওয়ার্ড সংখ্যা নির্ধারণ করুন
   - প্রিফিক্স/সাফিক্স যোগ করুন
   - নেগেটিভ কীওয়ার্ড সেট করুন

3. **আপলোড করুন**
   - "Upload All" বোতাম ক্লিক করুন
   - প্রতিটি ফাইলের প্রগ্রেস দেখুন

4. **মেটাডেটা জেনারেট করুন**
   - "Generate Metadata" ক্লিক করুন
   - AI স্বয়ংক্রিয়ভাবে শিরোনাম, বিবরণ, কীওয়ার্ড তৈরি করবে

5. **মেটাডেটা সম্পাদনা করুন (optional)**
   - প্রতিটি ফলাফলে "সম্পাদনা" ক্লিক করুন
   - শিরোনাম, বিবরণ, কীওয়ার্ড পরিবর্তন করুন
   - সংরক্ষণ করুন

6. **CSV এক্সপোর্ট করুন**
   - প্ল্যাটফর্ম নির্বাচন করুন
   - "CSV ডাউনলোড করুন" ক্লিক করুন
   - মাইক্রোস্টক সাইটে আপলোড করুন

## ডেটাবেস স্কিমা

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- name
- passwordHash
- createdAt, updatedAt
```

### Files Table
```sql
- id (PRIMARY KEY)
- userId (FOREIGN KEY)
- filename
- mimeType
- s3Key
- size
- width, height (for images)
- duration (for videos)
- uploadedAt
- processingStatus (pending, processing, completed, failed)
- processingError
```

### Metadata Table
```sql
- id (PRIMARY KEY)
- fileId (FOREIGN KEY)
- userId (FOREIGN KEY)
- title, description
- keywords (ARRAY)
- aiPrompt
- titleLength, keywordCount, imageType, prefix, suffix
- negativeKeywords (ARRAY)
- isEdited, editedAt
- createdAt, updatedAt
```

### Exports Table
```sql
- id (PRIMARY KEY)
- userId (FOREIGN KEY)
- platform (all, adobe, shutterstock, freepik, vecteezy, pond5)
- csvContent
- metadataIds (ARRAY)
- fileName, fileSize
- createdAt
```

### Batch Jobs Table
```sql
- id (PRIMARY KEY)
- userId (FOREIGN KEY)
- fileIds (ARRAY)
- status (queued, processing, completed, failed)
- totalFiles, processedFiles, failedFiles
- startedAt, completedAt
- error
- createdAt, updatedAt
```

### Notifications Table
```sql
- id (PRIMARY KEY)
- userId (FOREIGN KEY)
- type (batch_completed, batch_failed, export_ready, error)
- title, message
- relatedId (job ID, export ID, etc.)
- isRead, readAt
- createdAt
```

## মক মোড

যদি আপনি AWS S3 বা Gemini API কনফিগার না করেন:

- **S3**: মক আপলোড (ফাইল স্থানীয়ভাবে সিমুলেট করা হয়)
- **Gemini**: ফলব্যাক মেটাডেটা জেনারেশন (ফাইল নাম থেকে উদ্ভূত)

এটি স্থানীয় ডেভেলপমেন্ট এবং পরীক্ষার জন্য নিখুঁত।

## ভবিষ্যত উন্নতি

- [ ] ওয়েবসকেট রিয়েল-টাইম স্ট্যাটাস আপডেট
- [ ] ডাটাবেস পার্সিস্টেন্স (PostgreSQL সহ Drizzle)
- [ ] ইউজার অথেনটিকেশন (OAuth + JWT)
- [ ] ইমেইল নোটিফিকেশন (SES/SendGrid)
- [ ] ব্যাকগ্রাউন্ড ওয়ার্কার (Bull/Redis)
- [ ] বাল্ক এক্সপোর্ট টেমপ্লেট

## লাইসেন্স

MIT

## সাপোর্ট

যেকোনো সমস্যা বা প্রশ্নের জন্য GitHub issues খুলুন।
