#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const sourceFile = path.join(baseDir, 'app', '(app)', 'aliments', 'limits.page.tsx');
const targetDir = path.join(baseDir, 'app', '(app)', 'aliments', 'limits');
const targetFile = path.join(targetDir, 'page.tsx');

try {
  if (!fs.existsSync(sourceFile)) {
    console.error(`Error: Source file not found: ${sourceFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const content = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(targetFile, content);
  fs.unlinkSync(sourceFile);

  console.log('✓ Successfully moved limits.page.tsx to limits/page.tsx');
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
