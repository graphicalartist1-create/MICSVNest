import type { GenerationSettings } from "@/pages/Index";

function stripExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

function toWords(input: string) {
  return input
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .map((s) => s.trim())
    .filter(Boolean);
}

function capitalizeWords(words: string[]) {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function truncateToLength(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 3).trimEnd() + "...";
}

export function generateMetadataForFile(filename: string, settings: GenerationSettings) {
  const base = stripExtension(filename);
  const words = toWords(base);
  const titleBase = capitalizeWords(words.slice(0, 8));

  // Build title with optional prefix/suffix
  let title = titleBase;
  if (settings.prefix && settings.prefixText) title = `${settings.prefixText} ${title}`;
  if (settings.suffix && settings.suffixText) title = `${title} ${settings.suffixText}`;
  title = truncateToLength(title, settings.titleLength || 70);

  // Description: create a few sentences mentioning the image type and intent
  const parts: string[] = [];
  parts.push(
    `${titleBase} — high-quality ${settings.imageType !== 'none' ? settings.imageType : 'image'} suitable for ${settings.platform} and commercial use.`
  );
  if (settings.cameraParameters) {
    parts.push("Shot with professional camera settings: shallow depth of field, accurate exposure and natural color.");
  }
  if (settings.whiteBackground) {
    parts.push("Clean white background for easy compositing and product display.");
  }
  parts.push(
    `This image is ideal for use in marketing, editorial, and stock photography collections. Keywords and metadata have been crafted to maximize discoverability on microstock platforms.`
  );

  let description = parts.join(" ");
  if (settings.negativeTitle && settings.negativeTitleText) {
    description += ` Exclude: ${settings.negativeTitleText}.`;
  }
  description = truncateToLength(description, settings.descriptionLength || 150);

  // Keywords: combine filename words + generic stock keywords
  const generic = ["stock", "photo", "image", "digital", "creative", "high quality", "professional"];
  const combined = [...words.map((w) => w.toLowerCase()), ...generic];
  const negativeList = (settings.negativeKeywordsText || "").split(/[,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const unique: string[] = [];
  for (const k of combined) {
    const kk = k.toLowerCase();
    if (!kk) continue;
    if (negativeList.includes(kk)) continue;
    if (!unique.includes(kk)) unique.push(kk);
    if (unique.length >= (settings.keywordsCount || 30)) break;
  }

  return {
    title,
    description,
    keywords: unique,
  };
}

export function generatePromptForFile(filename: string, settings: GenerationSettings) {
  const base = stripExtension(filename);
  const words = toWords(base).join(' ');

  const promptParts: string[] = [];
  if (settings.promptPrefix && settings.promptPrefixText) promptParts.push(settings.promptPrefixText);

  promptParts.push(`Generate a ${settings.promptImageType !== 'none' ? settings.promptImageType : 'photo'} of ${words || 'a subject'}`);

  if (settings.whiteBackground) promptParts.push('on a clean white background');
  if (settings.cameraParameters) promptParts.push('use realistic camera parameters, shallow depth of field, natural lighting');

  // Add generic style guidance
  promptParts.push('high resolution, crisp details, natural colors, professional composition');

  if (settings.negativePromptWords && settings.negativePromptWordsText) {
    promptParts.push(`avoid: ${settings.negativePromptWordsText}`);
  }

  if (settings.promptSuffix && settings.promptSuffixText) promptParts.push(settings.promptSuffixText);

  let prompt = promptParts.join(', ');
  prompt = truncateToLength(prompt, settings.promptCharacterLength || 600);
  return prompt;
}

export default {
  generateMetadataForFile,
  generatePromptForFile,
};
