// Render headless (sem throttling de aba escondida).
// uso: node tools/render.mjs projects/<nome> [full|preview] [porta]
import puppeteer from 'puppeteer';

const [dir, mode = 'full', port = '8777'] = process.argv.slice(2);
const q = (mode === 'preview' ? '&step=30&scale=0.33' : mode === 'board' ? '&board' : '') + (process.env.FROM ? `&from=${process.env.FROM}&to=${process.env.TO}` : '');
const url = `http://127.0.0.1:${port}/engine/player.html?p=${encodeURIComponent(dir)}&export${q}`;

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 0,   // renders longos não podem expirar
  args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
});
const page = await browser.newPage();
page.on('console', m => { const t = m.text(); if (/^frame |EXPORT_|Error/.test(t)) console.log(t); });
page.on('pageerror', e => console.log('EXPORT_ERR ' + e.message));
await page.goto(url);
const t0 = Date.now();
await page.waitForFunction('window.EXPORT_DONE === true || !!window.EXPORT_ERR', { timeout: 0, polling: 500 });
const err = await page.evaluate('window.EXPORT_ERR');
await browser.close();
if (err) { console.error('FALHOU: ' + err); process.exit(1); }
console.log(`render ok (${mode}) em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
