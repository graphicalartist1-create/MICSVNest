import { pgTable, text, timestamp, integer, boolean, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: text().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  passwordHash: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Files table (stores uploaded files metadata)
export const files = pgTable("files", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  filename: varchar({ length: 255 }).notNull(),
  mimeType: varchar({ length: 100 }).notNull(),
  s3Key: varchar({ length: 500 }).notNull(),
  size: integer().notNull(),
  width: integer(),
  height: integer(),
  duration: decimal({ precision: 10, scale: 2 }), // for videos in seconds
  uploadedAt: timestamp().defaultNow().notNull(),
  processingStatus: varchar({ length: 50 }).default("pending").notNull(), // pending, processing, completed, failed
  processingError: text(),
});

// Metadata table (AI-generated and user-edited)
export const metadata = pgTable("metadata", {
  id: text().primaryKey(),
  fileId: text()
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Generated content
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  keywords: text().array().notNull(), // ARRAY type in PostgreSQL
  aiPrompt: text(), // Generated prompt for AI image generators
  
  // Settings used for generation
  titleLength: integer().default(50),
  keywordCount: integer().default(10),
  imageType: varchar({ length: 50 }), // vector, raster, video, etc.
  prefix: varchar({ length: 50 }),
  suffix: varchar({ length: 50 }),
  negativeKeywords: text().array(),
  
  // User edits
  isEdited: boolean().default(false),
  editedAt: timestamp(),
  
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Exports table (tracks CSV exports for different platforms)
export const exports = pgTable("exports", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  platform: varchar({ length: 50 }).notNull(), // all, adobe, shutterstock, freepik, vecteezy, pond5
  csvContent: text().notNull(),
  metadataIds: text().array().notNull(), // IDs of metadata included
  
  fileName: varchar({ length: 255 }).notNull(),
  fileSize: integer(),
  
  createdAt: timestamp().defaultNow().notNull(),
});

// Batch processing jobs table
export const batchJobs = pgTable("batch_jobs", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  fileIds: text().array().notNull(),
  status: varchar({ length: 50 }).default("queued").notNull(), // queued, processing, completed, failed
  totalFiles: integer().notNull(),
  processedFiles: integer().default(0),
  failedFiles: integer().default(0),
  
  startedAt: timestamp(),
  completedAt: timestamp(),
  error: text(),
  
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar({ length: 50 }).notNull(), // batch_completed, batch_failed, export_ready, error
  title: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  relatedId: text(), // job ID, export ID, etc.
  
  isRead: boolean().default(false),
  readAt: timestamp(),
  
  createdAt: timestamp().defaultNow().notNull(),
});
