import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "us-west-2";
const bucket = process.env.S3_BUCKET;

if (!bucket) {
  console.warn("S3_BUCKET not set. Presign endpoints will not work until configured.");
}

const s3 = new S3Client({ region });

export async function getPresignedPutUrl(key: string, contentType: string) {
  if (!bucket) throw new Error("S3_BUCKET not configured");
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 10 }); // 10 minutes
  return signedUrl;
}
