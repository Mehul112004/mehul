import * as fs from 'fs/promises';
import pdf from 'pdf-parse';

export interface RawSection {
  heading: string;
  body: string;
}

export interface ParsedMarkdown {
  project: string;
  sections: RawSection[];
}

export interface ParsedPdf {
  project: string;
  sections: RawSection[];
}

/**
 * Parses a markdown file to extract the project title (first H1)
 * and split content into sections based on H2 headings.
 */
export async function parseMarkdown(filePath: string): Promise<ParsedMarkdown> {
  const content = await fs.readFile(filePath, 'utf-8');

  // Extract the project name from the first # H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (!h1Match) {
    throw new Error(`No H1 heading found in ${filePath}`);
  }
  const project = h1Match[1].trim();

  // Split on H2 headings
  const sections: RawSection[] = [];
  const parts = content.split(/^##\s+/m);

  // The first part (index 0) contains the text before the first ## H2.
  // We can skip this as it is usually just the H1 title and metadata/intro without H2.
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const firstNewlineIndex = part.indexOf('\n');
    let heading = '';
    let body = '';

    if (firstNewlineIndex === -1) {
      heading = part.trim();
      body = '';
    } else {
      heading = part.substring(0, firstNewlineIndex).trim();
      body = part.substring(firstNewlineIndex + 1).trim();
    }

    // Preserve the H2 heading text inside the body so embeddings capture it
    const preservedBody = `## ${heading}\n${body}`;

    sections.push({
      heading,
      body: preservedBody
    });
  }

  return { project, sections };
}

/**
 * Parses a PDF file to extract raw text and group paragraphs into logical sections.
 */
export async function parsePdf(filePath: string, filename: string): Promise<ParsedPdf> {
  const dataBuffer = await fs.readFile(filePath);
  
  // Call pdf-parse on the buffer to extract text
  // Cast import as 'any' to handle ESM default resolution of CJS export in TS
  const data = await (pdf as any)(dataBuffer);
  const text = data.text;

  // Extract project/document name: use first non-empty line of text,
  // or fall back to filename if the first line is too long.
  const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
  let project = '';
  if (lines.length > 0 && lines[0].length <= 50) {
    project = lines[0];
  } else {
    project = filename.replace(/\.pdf$/i, '').replace(/[\-_]+/g, ' ');
  }

  // Split PDF text by double-newlines (paragraphs)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const sections: RawSection[] = [];
  let currentBodyParts: string[] = [];
  let currentLength = 0;
  let sectionIndex = 1;

  for (const para of paragraphs) {
    currentBodyParts.push(para);
    currentLength += para.length;

    // Group paragraphs together up to a target character limit of ~800
    if (currentLength >= 800) {
      sections.push({
        heading: `Section ${sectionIndex++}`,
        body: currentBodyParts.join('\n\n')
      });
      currentBodyParts = [];
      currentLength = 0;
    }
  }

  // Add any remaining paragraphs
  if (currentBodyParts.length > 0) {
    sections.push({
      heading: `Section ${sectionIndex}`,
      body: currentBodyParts.join('\n\n')
    });
  }

  return { project, sections };
}
