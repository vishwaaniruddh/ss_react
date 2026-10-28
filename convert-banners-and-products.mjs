import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'

async function optimizeBanners() {
  const bannersDir = './public/banners'
  const thumbsDir = './public/banners/thumbs'
  await mkdir(thumbsDir, { recursive: true })

  const files = await readdir(bannersDir)
  let totalOrig = 0
  let totalWebp = 0

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

    const inputPath = join(bannersDir, file)
    const base = basename(file, ext)
    const outputPath = join(bannersDir, `${base}.webp`)
    const isMobile = base.includes('mobile')

    const inStat = await stat(inputPath)
    totalOrig += inStat.size

    // Convert full banner
    const transformer = sharp(inputPath)
    if (isMobile) {
      transformer.resize({ width: 768, withoutEnlargement: true })
    } else {
      transformer.resize({ width: 1440, withoutEnlargement: true })
    }

    await transformer
      .webp({ quality: isMobile ? 75 : 78, effort: 6 })
      .toFile(outputPath)

    const outStat = await stat(outputPath)
    totalWebp += outStat.size
    console.log(`Banner: ${file} (${(inStat.size / 1024).toFixed(0)}KB) -> ${base}.webp (${(outStat.size / 1024).toFixed(0)}KB)`)

    // Also generate tiny thumbnail for bottom slider
    const thumbPath = join(thumbsDir, `${base}.webp`)
    await sharp(inputPath)
      .resize({ width: 96, height: 96, fit: 'cover' })
      .webp({ quality: 65, effort: 6 })
      .toFile(thumbPath)
    const thumbStat = await stat(thumbPath)
    console.log(`  Thumb -> thumbs/${base}.webp (${(thumbStat.size / 1024).toFixed(1)}KB)`)
  }

  console.log(`\nBanners Total: ${(totalOrig / 1024).toFixed(0)}KB -> ${(totalWebp / 1024).toFixed(0)}KB (saved ${((1 - totalWebp / totalOrig) * 100).toFixed(0)}%)\n`)
}

async function optimizeProducts() {
  const productsDir = './public/products'
  const files = await readdir(productsDir)
  let totalOrig = 0
  let totalWebp = 0

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

    const inputPath = join(productsDir, file)
    const base = basename(file, ext)
    const outputPath = join(productsDir, `${base}.webp`)

    const inStat = await stat(inputPath)
    totalOrig += inStat.size

    await sharp(inputPath)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 75, effort: 6 })
      .toFile(outputPath)

    const outStat = await stat(outputPath)
    totalWebp += outStat.size
    console.log(`Product: ${file} (${(inStat.size / 1024).toFixed(0)}KB) -> ${base}.webp (${(outStat.size / 1024).toFixed(0)}KB)`)
  }

  console.log(`\nProducts Total: ${(totalOrig / 1024).toFixed(0)}KB -> ${(totalWebp / 1024).toFixed(0)}KB (saved ${((1 - totalWebp / totalOrig) * 100).toFixed(0)}%)\n`)
}

await optimizeBanners()
await optimizeProducts()
console.log('Optimization complete!')
