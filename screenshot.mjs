import puppeteer from 'puppeteer';

const pages = [
  { path: '/', name: 'home' },
  { path: '/shop', name: 'shop' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/cart', name: 'cart' },
  { path: '/wishlist', name: 'wishlist' },
  { path: '/auth', name: 'auth' },
  { path: '/bridal', name: 'bridal' },
  { path: '/jewellery', name: 'jewellery' },
  { path: '/product/1', name: 'product' },
];

const outDir = '/home/aniruddh/.gemini/antigravity-ide/brain/8a6d5194-273a-4956-b797-7e7f7e28085e/screenshots';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1366,768'],
});

for (const page of pages) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1366, height: 768 });
  await p.goto(`http://localhost:5173${page.path}`, { waitUntil: 'networkidle0', timeout: 15000 });
  // Wait for loading screen to finish
  await p.waitForFunction(() => {
    const loader = document.querySelector('[class*="fixed"][class*="z-"]');
    return !loader || loader.style.opacity === '0' || getComputedStyle(loader).opacity === '0';
  }, { timeout: 8000 }).catch(() => {});
  // Extra wait for animations
  await new Promise(r => setTimeout(r, 2000));
  await p.screenshot({ path: `${outDir}/test_${page.name}.png` });
  console.log(`✓ ${page.name}`);
  await p.close();
}

await browser.close();
console.log('ALL DONE');
