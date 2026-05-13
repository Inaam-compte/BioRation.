const fs = require('fs');
const path = require('path');

const sourceFile = 'c:\\Users\\hp\\Desktop\\biorotation\\app\\(app)\\aliments\\limits.page.tsx';
const targetDir = 'c:\\Users\\hp\\Desktop\\biorotation\\app\\(app)\\aliments\\limits';
const targetFile = path.join(targetDir, 'page.tsx');

try {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  // Read the source file
  const fileContent = fs.readFileSync(sourceFile, 'utf8');
  
  // Write to the new location
  fs.writeFileSync(targetFile, fileContent);
  console.log(`Created file: ${targetFile}`);
  
  // Delete the old file
  fs.unlinkSync(sourceFile);
  console.log(`Deleted file: ${sourceFile}`);
  
  console.log('✓ Successfully moved limits.page.tsx to limits/page.tsx');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
