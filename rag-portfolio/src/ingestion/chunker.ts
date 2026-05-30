import { Chunk } from '../types/index.js';
import { RawSection } from './parser.js';

/**
 * Converts a string to a lowercase slug using only letters, numbers, and hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special characters except spaces/hyphens
    .replace(/[\s_]+/g, '-')       // Replace spaces and underscores with a single hyphen
    .replace(/-+/g, '-')          // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, '');     // Strip leading and trailing hyphens
}

/**
 * Converts parsed sections into structured Chunks and filters out empty sections.
 */
export function chunkSections(
  sections: RawSection[],
  filename: string,
  project: string
): Chunk[] {
  const chunks: Chunk[] = [];

  for (const section of sections) {
    const trimmedBody = section.body.trim();

    // Skip sections whose body is under 30 characters (empty/stub sections)
    if (trimmedBody.length < 30) {
      continue;
    }

    const chunkId = `${slugify(project)}-${slugify(section.heading)}`;

    chunks.push({
      id: chunkId,
      source: filename,
      project,
      section: section.heading,
      content: trimmedBody
    });
  }

  return chunks;
}
