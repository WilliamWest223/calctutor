// tools/ui-ex3.mjs — Exam 3 interactive lessons check (widgets, try, step-through, cards, KaTeX, themes).
//   node tools/ui-ex3.mjs
// Needs playwright (npm i playwright, or an npx cache copy) + a Chromium/headless shell.
// Serves the app with tools/serve.py, drives it, prints PASS/FAIL per check, exits 1 on any FAIL.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { createServer } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = await new Promise(res => { const s = createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });

// ---- locate playwright + a browser (shortcut: macOS cache layout, extend if run elsewhere)
function loadPlaywright() {
  const req = createRequire(import.meta.url);
  try { return req('playwright'); } catch {}
  const npx = join(homedir(), '.npm/_npx');
  if (existsSync(npx)) for (const d of readdirSync(npx)) {
    try { return req(join(npx, d, 'node_modules/playwright')); } catch {}
  }
  throw new Error('playwright not found (npm i playwright)');
}
function findShell() {
  const base = join(homedir(), 'Library/Caches/ms-playwright');
  if (!existsSync(base)) return undefined;
  for (const d of readdirSync(base).filter(x => x.startsWith('chromium_headless_shell')).sort().reverse()) {
    for (const sub of ['chrome-mac/headless_shell', 'chrome-headless-shell-mac-arm64/chrome-headless-shell']) {
      const p = join(base, d, sub); if (existsSync(p)) return p;
    }
  }
}

const server = spawn('python3', [join(ROOT, 'tools/serve.py'), String(PORT)], { stdio: 'ignore' });
const { chromium } = loadPlaywright();
const browser = await chromium.launch({ executablePath: findShell() });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));


const SHOTS = join(tmpdir(), 'ex3-shots');
mkdirSync(SHOTS, { recursive: true });
const $ = s => page.locator(s);
let fails = 0;
const fail = m => { fails++; console.log('FAIL', m); };
const IDS = ['ln-powerseries', 'ln-taylor', 'ln-remainder', 'ln-serapp', 'ln-exam3'];

// runs inside the page: exercises every try, worked example, and the cards of the open lesson
const exercise = () => {
  const out = [];
  const tries = [...document.querySelectorAll('.ltry')].filter(t => !t.closest('.panel.worked'));
  tries.forEach((t, i) => {
    const bs = [...t.querySelectorAll('.choice')];
    const wrong = bs.find(b => !b._c.ok), ok = bs.find(b => b._c.ok);
    if (wrong) { wrong.click(); if (!t.querySelector('.lans.no') || !t.querySelector('.lans.no').textContent.trim() || !wrong.classList.contains('wrong')) out.push(`try#${i} wrong: no why/mark`); }
    if (!ok) { out.push(`try#${i} no ok choice`); return; }
    ok.click();
    if (!ok.classList.contains('correct') || !t.querySelector('.lans.ok')) out.push(`try#${i} ok not marked right`);
  });
  document.querySelectorAll('.panel.worked').forEach((w, i) => {
    const total = w.querySelectorAll('.step').length;
    for (let g = 0; g < total + 8; g++) {
      if ([...w.querySelectorAll('.step')].filter(s => !s.hidden).length >= total) break;
      const nb = [...w.querySelectorAll('.lreveal button')].find(b => b.textContent === 'Next step');
      if (!nb) { out.push(`worked#${i} no Next step button`); break; }
      if (nb.disabled) { const ok = [...w.querySelectorAll('.lreveal .choice')].find(b => b._c.ok); if (!ok) { out.push(`worked#${i} gated, no ok`); break; } ok.click(); }
      nb.click();
    }
    const shown = [...w.querySelectorAll('.step')].filter(s => !s.hidden).length;
    if (shown !== total) out.push(`worked#${i} reached ${shown}/${total} steps`);
  });
  return out;
};

try {
  for (let i = 0; i < 5; i++) {
    try { await page.goto(`http://127.0.0.1:${PORT}/`); await page.waitForSelector('.deck', { timeout: 8000 }); break; }
    catch (e) { if (i === 4) throw e; consoleErrors.length = 0; await new Promise(r => setTimeout(r, 300)); }
  }
  for (let pass = 0; pass < 2; pass++) {
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log('--- theme', theme);
    for (const id of IDS) {
      const tag = `${id}@${theme}`;
      const before = fails;
      const def = await page.evaluate(i => { const l = window.__calctutor.lessons.LESSONS.find(x => x.id === i); return l && { w: (l.sections || []).filter(s => s.widget).length, c: (l.cards || []).length }; }, id);
      if (!def) { fail(`${tag}: lesson not found`); continue; }
      await page.evaluate(i => { window.__calctutor.store.setShowAllSteps(i, false); window.__calctutor.nav({ v: 'lesson', id: i }); }, id);
      await page.waitForSelector('.lrewrite, .lgoal', { timeout: 5000 });
      // widgets
      const wi = await page.evaluate(() => {
        const ws = [...document.querySelectorAll('.lwidget')];
        const bad = [];
        ws.forEach((w, i) => w.querySelectorAll('.readout .rocell').forEach(c => { const t = c.textContent.trim(); if (!t || /NaN|undefined|Infinity/.test(t) || /^[—–-]+$/.test(t)) bad.push(`widget#${i}: "${t.slice(0, 40)}"`); }));
        return { svgs: document.querySelectorAll('.lwidget svg').length, n: ws.length, bad };
      });
      if (wi.svgs < def.w) fail(`${tag}: svgs ${wi.svgs} < widgets ${def.w}`);
      if (wi.n < def.w) fail(`${tag}: rendered .lwidget ${wi.n} < ${def.w}`);
      if (wi.bad.length) fail(`${tag}: bad readout ${wi.bad.join(' ; ')}`);
      // try + worked
      for (const m of await page.evaluate(exercise)) fail(`${tag}: ${m}`);
      // cards
      if (def.c) {
        const c = $('.lcard');
        const left = async () => +((await $('.lcards').innerText()).match(/(\d+) left/) || [])[1];
        const n0 = await left();
        const f0 = await $('.lcard').innerText();
        await c.click();
        if (!(await $('.lcard.flipped').count())) fail(`${tag}: card did not flip`);
        await $('.lcards').getByText('Got it').click();
        const n1 = await left();
        if (n1 !== n0 - 1 && !(n0 === 1 && (await $('.lcards').innerText()).includes('All cards done'))) fail(`${tag}: Got it ${n0} -> ${n1}`);
        void f0;
      } else console.log('note', tag, 'no cards');
      // katex
      const k = await page.evaluate(() => [...document.querySelectorAll('.katex-error')].map(e => e.textContent.slice(0, 60)));
      if (k.length) fail(`${tag}: ${k.length} katex-error: ${k.slice(0, 3).join(' | ')}`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${SHOTS}/${id}-${theme}.png`, fullPage: true });
      console.log(fails === before ? 'PASS' : 'FAIL', tag, `(widgets ${def.w}, svgs ${wi.svgs}, cards ${def.c})`);
    }
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('t');
  }
  // polish: raw TeX leaks, uppercase readout labels, phone svg text size
  const polish = () => {
    const out = [];
    const raw = /\^|_\{|\\|Σ/;
    document.querySelectorAll('.lwidget').forEach((w, i) => {
      w.querySelectorAll('.pill, .rol, .rov').forEach(e => {
        const c = e.cloneNode(true); c.querySelectorAll('.katex').forEach(k => k.remove());
        if (raw.test(c.textContent)) out.push(`widget#${i} raw tex in ${e.className}: "${c.textContent.trim().slice(0, 40)}"`);
      });
      w.querySelectorAll('.rol').forEach(e => { if (getComputedStyle(e).textTransform === 'uppercase') out.push(`widget#${i} uppercase readout label "${e.textContent.trim().slice(0, 30)}"`); });
      if (window.innerWidth <= 400) w.querySelectorAll('svg').forEach(svg => {
        const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        const small = [...svg.querySelectorAll('text')].filter(t => parseFloat(getComputedStyle(t).fontSize) * k < 8.95);
        if (small.length) out.push(`widget#${i} ${small.length} svg text < 9px (e.g. "${small[0].textContent.slice(0, 20)}" ${(parseFloat(getComputedStyle(small[0]).fontSize) * k).toFixed(1)}px)`);
      });
    });
    return out;
  };
  for (const [vw, vh] of [[1280, 900], [390, 844]]) {
    await page.setViewportSize({ width: vw, height: vh });
    for (const id of IDS) {
      await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), id);
      await page.waitForSelector('.lrewrite, .lgoal', { timeout: 5000 });
      for (const m of await page.evaluate(polish)) fail(`${id}@${vw}: ${m}`);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  const e = consoleErrors.filter(x => !/^failures:/.test(x));
  if (e.length) fail('console errors: ' + e.join(' | '));
  else console.log('PASS no console errors');
} finally {
  await browser.close();
  server.kill();
}
console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
process.exit(fails ? 1 : 0);
