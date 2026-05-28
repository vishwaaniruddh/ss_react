import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const dirs = [
  './src/assets/images',
  './public/banner',
]

async function convertDir(dir) {
  try {
    const files = await readdir(dir)
    for (const file of files) {
      const ext = extname(file).toLowerCase()
      if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue
      
      const inputPath = join(dir, file)
      const outputPath = join(dir, basename(file, ext) + '.webp')
      
      const info = await stat(inputPath)
      console.log(`Converting: ${inputPath} (${(info.size / 1024).toFixed(0)}KB)`)
      
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath)
      
      const outInfo = await stat(outputPath)
      console.log(`  → ${outputPath} (${(outInfo.size / 1024).toFixed(0)}KB) — saved ${((1 - outInfo.size / info.size) * 100).toFixed(0)}%`)
    }
  } catch (e) {
    console.log(`Skipping ${dir}: ${e.message}`)
  }
}

for (const dir of dirs) {
  await convertDir(dir)
}

// Also convert logo
try {
  const logoInput = './public/logo-transparent.png'
  const logoOutput = './public/logo-transparent.webp'
  await sharp(logoInput)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(logoOutput)
  const info = await stat(logoOutput)
  console.log(`Logo → ${logoOutput} (${(info.size / 1024).toFixed(0)}KB)`)
} catch (e) {
  console.log(`Logo skip: ${e.message}`)
}

console.log('\nDone! Now update imports to use .webp files.')
