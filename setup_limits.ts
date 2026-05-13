import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const sourceFile = 'app/(app)/aliments/limits.page.tsx';
const targetDir = 'app/(app)/aliments/limits';
const targetFile = join(targetDir, 'page.tsx');

try {
  // Create the directory if it doesn't exist
  mkdirSync(targetDir, { recursive: true });
  console.log(`✓ Created directory: ${targetDir}`);

  // Read the source file
  const fileContent = readFileSync(sourceFile, 'utf8');
  
  // Write to the new location
  writeFileSync(targetFile, fileContent);
  console.log(`✓ Created file: ${targetFile}`);
  
  // Delete the old file
  unlinkSync(sourceFile);
  console.log(`✓ Deleted file: ${sourceFile}`);
  
  console.log('\n✓ Successfully moved limits.page.tsx to limits/page.tsx');
} catch (error) {
  console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
