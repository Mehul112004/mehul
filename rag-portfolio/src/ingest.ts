import * as fs from 'fs/promises';
import * as path from 'path';
import { parseMarkdown, parsePdf } from './ingestion/parser.js';
import { chunkSections } from './ingestion/chunker.js';
import { embedChunks } from './ingestion/embedder.js';
import { VectorIndex, EmbeddedChunk } from './types/index.js';

async function main() {
  const docsDir = process.argv[2] || './docs';

  try {
    // Check if the directory exists
    try {
      await fs.access(docsDir);
    } catch {
      console.error(`Directory not found: "${docsDir}"`);
      process.exit(1);
    }

    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    const allFiles = [...mdFiles, ...pdfFiles];

    if (allFiles.length === 0) {
      console.log(`No markdown (.md) or PDF (.pdf) files found in directory: "${docsDir}"`);
      process.exit(0);
    }

    console.log(`Found ${mdFiles.length} markdown file(s) and ${pdfFiles.length} PDF file(s) in "${docsDir}". Starting ingestion...\n`);
    
    let allChunks: EmbeddedChunk[] = [];
    let parsedCount = 0;

    for (const file of allFiles) {
      const filePath = path.join(docsDir, file);
      let project = '';
      let sections: any[] = [];

      console.log(`Parsing file: ${file}`);
      
      if (file.endsWith('.md')) {
        const parsed = await parseMarkdown(filePath);
        project = parsed.project;
        sections = parsed.sections;
      } else if (file.endsWith('.pdf')) {
        const parsed = await parsePdf(filePath, file);
        project = parsed.project;
        sections = parsed.sections;
      } else {
        console.log(`Skipping unsupported file type: ${file}`);
        continue;
      }

      parsedCount++;

      const chunks = chunkSections(sections, file, project);
      console.log(`Created ${chunks.length} chunk(s) for ${project}`);

      const embeddedChunks = await embedChunks(chunks);
      allChunks = allChunks.concat(embeddedChunks);
      console.log(`Embedded chunks for ${project}\n`);
    }

    // Prepare VectorIndex structure
    const index: VectorIndex = {
      model: 'Xenova/all-MiniLM-L6-v2',
      createdAt: new Date().toISOString(),
      chunks: allChunks
    };

    // Write index.json (overwrites existing index)
    const indexPath = './index.json';
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');

    // Also write to public folder of main web app so that the browser can fetch it
    try {
      const publicIndexPath = '../public/index.json';
      await fs.mkdir('../public', { recursive: true });
      await fs.writeFile(publicIndexPath, JSON.stringify(index, null, 2), 'utf-8');
      console.log(`Index copy written to: ${publicIndexPath}`);
    } catch (e: any) {
      console.warn(`Warning: Could not copy index to public folder: ${e.message}`);
    }

    console.log(`=== Ingestion Complete ===`);
    console.log(`Parsed ${parsedCount} files`);
    console.log(`Total chunks: ${allChunks.length}`);
    console.log(`Index written to: ${indexPath}`);
  } catch (error) {
    console.error('Ingestion process failed:', error);
    process.exit(1);
  }
}

main();
