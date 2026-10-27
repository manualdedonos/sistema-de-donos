// Print REAL de uma página (celular, 3x) p/ usar como insert — some com banners de cookie (sem aceitar nada).
// uso: node tools/print_pagina.mjs <url> projects/<p>/assets/web/<nome>.png [--full]   (--full = página inteira, até 5200 px CSS)
import puppeteer from 'puppeteer';
const [url, out, flag] = process.argv.slice(2);
if (!url || !out) { console.error('uso: node tools/print_pagina.mjs <url> <saida.png> [--full]'); process.exit(1); }
const b = await puppeteer.launch({ headless: true });
setTimeout(() => { b.close(); process.exit(2); }, 100000);
const p = await b.newPage();
await p.setViewport({ width: 430, height: 932, deviceScaleFactor: 2.5, isMobile: true });
await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await new Promise(r => setTimeout(r, 5000));
for (let y = 0; y < 9000; y += 600) { await p.evaluate(y => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 200)); }
await p.evaluate(() => { window.scrollTo(0, 0);
  for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if ((cs.position === 'fixed' || cs.position === 'sticky') && /cookie|consent|privacidade|navigating this website/i.test(el.innerText || '')) el.style.display = 'none'; } });
await new Promise(r => setTimeout(r, 1200));
const h = flag === '--full' ? Math.min(await p.evaluate(() => document.body.scrollHeight), 5200) : 932;
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 430, height: h }, captureBeyondViewport: true });
const imgs = await p.evaluate(() => [...new Set([...document.querySelectorAll('meta[property="og:image"], img')].map(e => e.content || e.currentSrc).filter(Boolean))].slice(0, 25));
console.log('print: ' + out + '\nimagens da página:\n' + imgs.join('\n'));
await b.close(); process.exit(0);
