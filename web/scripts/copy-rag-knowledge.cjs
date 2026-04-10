/**
 * Keeps web/public/rag/knowledge-chunks.json in sync with the backend KB (single source of truth).
 */
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '../../backend/data/rag/knowledge-chunks.json')
const destDir = path.join(__dirname, '../public/rag')
const dest = path.join(destDir, 'knowledge-chunks.json')

if (!fs.existsSync(src)) {
  console.error('[copy-rag-knowledge] Source missing:', src)
  process.exit(1)
}
fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(src, dest)
console.log('[copy-rag-knowledge] Copied KB to', dest)
