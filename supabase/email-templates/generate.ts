#!/usr/bin/env node
/**
 * Generates Supabase Auth email HTML files from shared layout and definitions.
 * Run: npm run email-templates:generate
 * Or: npx tsx supabase/email-templates/generate.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EMAILS, buildHtml } from './shared';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'generated');
fs.mkdirSync(outDir, { recursive: true });

const lineEnd = '\n';
let written = 0;
for (const email of EMAILS) {
  const html = buildHtml(email).trim() + lineEnd;
  const outPath = path.join(outDir, email.output);
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : null;
  if (existing !== html) {
    fs.writeFileSync(outPath, html, 'utf8');
    written++;
  }
  console.log(existing === html ? 'Unchanged:' : 'Generated:', path.join('generated', email.output));
}
console.log(written > 0 ? `${written} file(s) updated.` : 'All files up to date.');
