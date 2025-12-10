import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generateMetadata(
  filename: string,
  imageType?: string,
  titleLength: number = 50,
  keywordCount: number = 10,
  prefix?: string,
  suffix?: string,
  negativeKeywords?: string[]
) {
  const fileBase = filename.replace(/\.[^/.]+$/, "");

  // If Gemini key not available, fallback to mock (or use Claude API)
  // For now, using simple heuristic to generate metadata

  const title = `${prefix || ""}${fileBase}${suffix || ""}`.slice(0, titleLength);
  const keywords = fileBase
    .split(/[-_\s]+/)
    .filter((k) => k.length > 2)
    .slice(0, keywordCount)
    .map((k) => k.toLowerCase());

  const description = `High-quality ${imageType || "image"} of ${fileBase}. Perfect for microstock platforms and creative projects.`;

  const prompt = `Photo of ${fileBase}, professional, high resolution, clean white background, commercial use`;

  return { title, description, keywords, prompt };
}

// Real Gemini integration (if API key is available)
export async function generateMetadataWithGemini(
  filename: string,
  imageType?: string,
  titleLength: number = 50,
  keywordCount: number = 10,
  prefix?: string,
  suffix?: string,
  negativeKeywords?: string[]
) {
  if (!process.env.GEMINI_API_KEY) {
    return generateMetadata(filename, imageType, titleLength, keywordCount, prefix, suffix, negativeKeywords);
  }

  // Placeholder for real Gemini API call (would require google-generative-ai SDK)
  // For now, returning mock
  return generateMetadata(filename, imageType, titleLength, keywordCount, prefix, suffix, negativeKeywords);
}
