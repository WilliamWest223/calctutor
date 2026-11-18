// tools/ui-smoke.mjs — headless-Chrome smoke test of the real UI.
//   node tools/ui-smoke.mjs
// Needs playwright (npm i playwright, or an npx cache copy) + a Chromium/headless shell.
// Serves the app with tools/serve.py, drives it, prints PASS/FAIL per check, exits 1 on any FAIL.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { readdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
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

let fails = 0;
const check = async (name, fn) => {
  try { const r = await fn(); if (r === true || r === undefined) console.log('PASS', name); else { fails++; console.log('FAIL', name, '-', r); } }
  catch (e) { fails++; console.log('FAIL', name, '- threw', e.message.split('\n')[0]); }
};
const $ = s => page.locator(s);
const home = async () => { await page.evaluate(() => window.__calctutor.nav({ v: 'home' })); };
const drillRefs = async id => page.evaluate(i => window.__calctutor.nav({ v: 'drill', mode: 'custom', refs: [{ id: i }], skills: [] }), id);

try {
  // shortcut: serve.py's listen backlog is 5, so the burst of module requests can get RESET; retry the load
  for (let i = 0; i < 5; i++) {
    try { await page.goto(`http://127.0.0.1:${PORT}/`); await page.waitForSelector('.deck', { timeout: 8000 }); break; }
    catch (e) { if (i === 4) throw e; consoleErrors.length = 0; await new Promise(r => setTimeout(r, 300)); }
  }

  await check('home loads, no console errors', () => consoleErrors.length === 0 || consoleErrors.join(' | '));

  await check('home: exam hub card', async () => {
    const t = await $('.examhub').first().innerText().catch(() => '');
    return /hub/i.test(t) && (await $('.examhub .planchip').count()) > 0 || 'no .examhub with lesson chips';
  });
  await check('home: exam-style toggle persists', async () => {
    await $('.quickbar').getByText('exam style: most').click();
    const v = await page.evaluate(() => window.__calctutor.store.settings().freeShare);
    await $('.quickbar').getByText('exam style: some').click();
    return v === 0.6 || `freeShare=${v}`;
  });

  await check('lessons index + filter', async () => {
    await page.evaluate(() => window.__calctutor.nav({ v: 'learn' }));
    const all = await $('.lrow').count();
    await $('.lfilter').fill('taylor');
    const vis = await $('.lrow:visible').count();
    await $('.lfilter').fill('');
    return (all > 5 && vis > 0 && vis < all) || `all=${all} visible=${vis}`;
  });

  await check('lesson page drill buttons', async () => {
    // old-style lesson (no .plain): lbar drill buttons. Rewritten lesson: Start practice + extra random practice.
    // (old-style lessons disappear as rewrites land: only checked while one remains)
    const old = await page.evaluate(() => window.__calctutor.lessons.LESSONS.filter(l => !l.plain).map(l => l.id));
    if (old.length) {
      await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), old[0]);
      await $('.lbar').getByText('Drill this lesson').click();
      if (!(await page.evaluate(() => !!window.__calctutor.problem))) return 'drill did not start';
      await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), old[old.length - 1]);
      await $('.lbar').getByText('Exam-style set').click();
      if (!(await page.evaluate(() => !!window.__calctutor.problem))) return 'exam-style set did not start';
    }
    await page.evaluate(() => { const C = window.__calctutor; C.nav({ v: 'lesson', id: C.lessons.LESSONS.find(l => l.plain).id }); });
    await $('.lfinish').getByText('Extra random practice').click();
    return (await page.evaluate(() => !!window.__calctutor.problem)) || 'extra random practice did not start';
  });

  await check('drill HUD lesson link', async () => {
    await page.evaluate(() => window.__calctutor.nav({ v: 'drill', mode: 'topic', scope: 'series/Taylor & Maclaurin Series' }));
    const a = $('.lessonlink').first();
    if (!(await a.count())) return 'no .lessonlink in drill';
    await a.click();
    return (await $('.lgoal').count()) > 0 || 'did not land on a lesson';
  });

  await check('free response: wrong then right', async () => {
    await drillRefs('x-s-tele-3');
    if (await page.evaluate(() => window.__calctutor.problem.fmt) !== 'free') return 'not free fmt';
    if (await $('.choices').isVisible()) return 'choices visible on free item';
    await $('.ownfield').fill('12345.678'); await $('.choice.own .btn').click();
    if (!(await $('.verdictbar.no').count())) return 'wrong answer not marked wrong';
    await drillRefs('x-s-tele-3');
    const key = await page.evaluate(() => { const p = window.__calctutor.problem; return (p.accept && p.accept[0]) || p.choices.find(c => c.ok).t.replace(/\$/g, ''); });
    await $('.ownfield').fill(key); await $('.choice.own .btn').click();
    return (await $('.verdictbar.ok').count()) > 0 || `key "${key}" rejected`;
  });

  await check('multi-select: wrong set then exact set', async () => {
    await drillRefs('x-s-acd-multi');
    const oks = await page.evaluate(() => window.__calctutor.problem.choices.map(c => !!c.ok));
    const cs = $('.choice');
    await cs.nth(oks.indexOf(true)).click();                       // incomplete set
    await page.getByRole('button', { name: /Submit/ }).click();
    if (!(await $('.verdictbar.no').count())) return 'incomplete set accepted';
    await drillRefs('x-s-acd-multi');
    for (let i = 0; i < oks.length; i++) if (oks[i]) await cs.nth(i).click();
    await page.keyboard.press('Enter');
    return (await $('.verdictbar.ok').count()) > 0 || 'exact set rejected';
  });

  await check('find-the-error: work shown, wrong then right', async () => {
    await drillRefs('x-s-ratio-err');
    const info = await page.evaluate(() => { const p = window.__calctutor.problem; return { n: (p.work || []).length, k: p.choices.findIndex(c => c.ok), len: p.choices.length }; });
    if (!info.n || !(await $('.work, .workblock, .errwork').count()) && !(await page.locator('text=Line 1').count()) && info.n === 0) return 'work block missing';
    await $('.choice').nth((info.k + 1) % info.len).click();
    if (!(await $('.verdictbar.no').count())) return 'wrong pick not marked wrong';
    await drillRefs('x-s-ratio-err');
    await $('.choice').nth(info.k).click();
    return (await $('.verdictbar.ok').count()) > 0 || 'right pick rejected';
  });

  await check('Exam Simulation mode runs to summary', async () => {
    await home();
    await page.evaluate(() => { window.__calctutor.store.setSetting('length', 10); });
    await page.keyboard.press('4');
    if (!(await page.evaluate(() => window.__calctutor.session && window.__calctutor.session.cfg.defer))) return 'exam mode not started';
    for (let g = 0; g < 60 && (await page.evaluate(() => !!window.__calctutor.problem)); g++) {
      const fmt = await page.evaluate(() => window.__calctutor.problem.fmt);
      if (fmt === 'free') { await $('.ownfield').fill(await page.evaluate(() => { const p = window.__calctutor.problem; return (p.accept && p.accept[0]) || p.choices.find(c => c.ok).t.replace(/\$/g, ''); })); await $('.choice.own .btn').click(); }
      else if (fmt === 'multi') { await $('.choice').first().click(); await page.keyboard.press('Enter'); }
      else await $('.choice').first().click();
    }
    return (await $('.scorehero').count()) > 0 || 'no summary reached';
  });

  // ---- rewritten lessons: page renders fully, no KaTeX errors, no raw $
  const rewritten = await page.evaluate(() => window.__calctutor.lessons.LESSONS.filter(l => l.plain).map(l => l.id));
  await check('rewritten lessons exist', () => rewritten.length >= 3 || `only ${rewritten.length}`);
  await check(`all ${rewritten.length} rewritten lessons render (big idea, words, check yourself, method, practice, no KaTeX errors)`, async () => {
    const bad = [];
    for (const id of rewritten) {
      await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), id);
      const r = await page.evaluate(id => {
        const eyes = [...document.querySelectorAll('.lrewrite .eyebrow')].map(e => e.textContent);
        const txt = document.querySelector('.lrewrite').innerText;
        const lessonDef = window.__calctutor.lessons.LESSONS.find(l => l.id === id);
        return {
          big: eyes.some(e => /big idea/i.test(e)), words: eyes.some(e => /words you need/i.test(e)),
          check: document.querySelectorAll('details.lcheck summary').length, method: eyes.some(e => /method/i.test(e)),
          practice: !!document.querySelector('.lfinish') && /Start practice/.test(document.querySelector('.lfinish').innerText),
          kerr: document.querySelectorAll('.katex-error').length,
          dollar: (txt.split('\n').find(x => /\$/.test(x)) || '').slice(0, 100) || false, worked: document.querySelectorAll('.panel.worked').length, want: lessonDef ? (lessonDef.worked || []).length : -1,
        };
      }, id);
      const why = [];
      if (!r.big) why.push('no big idea'); if (!r.words) why.push('no words'); if (!r.check) why.push('no check yourself');
      if (!r.method) why.push('no method'); if (!r.practice) why.push('no practice panel');
      if (r.kerr) why.push(`${r.kerr} katex-error`); if (r.dollar) why.push('raw $ in: ' + r.dollar);
      if (r.worked !== r.want) why.push(`worked ${r.worked}/${r.want}`);
      if (why.length) bad.push(`${id}: ${why.join(', ')}`);
    }
    return bad.length === 0 || bad.join(' ; ');
  });

  // ---- play a whole ladder
  const playAnswer = async () => {
    const info = await page.evaluate(() => { const p = window.__calctutor.problem; return { id: p.id, fmt: p.fmt, oks: p.choices.map(c => !!c.ok), key: (p.accept && p.accept[0]) || p.choices.find(c => c.ok).t.replace(/\$/g, '') }; });
    if (info.fmt === 'free') { await $('.ownfield').fill(info.key); await $('.choice.own .btn').click(); }
    else if (info.fmt === 'multi') { for (let i = 0; i < info.oks.length; i++) if (info.oks[i]) await $('.choice').nth(i).click(); await page.keyboard.press('Enter'); }
    else await $('.choice').nth(info.oks.indexOf(true)).click();
    return info;
  };
  const ladderPlay = async id => {
    const want = await page.evaluate(i => window.__calctutor.lessons.LESSONS.find(l => l.id === i).practice.map(p => p.id), id);
    await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), id);
    await $('.lfinish').getByText(/Start practice/).click();
    const seen = [], fmts = new Set();
    for (let g = 0; g < want.length + 3 && (await page.evaluate(() => !!window.__calctutor.problem)); g++) {
      const info = await playAnswer(); seen.push(info.id); fmts.add(info.fmt || 'mc');
      if (!(await $('.verdictbar.ok').count())) return `${id}: key rejected on ${info.id} (${info.fmt})`;
      await page.keyboard.press('Enter');
    }
    if (!(await $('.scorehero').count())) return `${id}: no summary after ${seen.length} items`;
    if (JSON.stringify(seen) !== JSON.stringify(want)) return `${id}: order ${seen.join(',')} != ladder ${want.join(',')}`;
    const kerr = await page.evaluate(() => document.querySelectorAll('.katex-error').length);
    if (kerr) return `${id}: ${kerr} katex-error in drill/summary`;
    await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), id);
    const t = await $('.lfinish').innerText();
    if (!t.includes(`${want.length}/${want.length} right`)) return `${id}: progress not persisted: ${t.split('\n').find(x => /right/.test(x))}`;
    if ((await $('.lladder.ok').count()) !== want.length) return `${id}: ladder ticks ${await $('.lladder.ok').count()}/${want.length}`;
    const done = await page.evaluate(i => window.__calctutor.store.lessonDone(i), id);
    return done || `${id}: lessonDone false after full ladder`;
  };
  for (const id of ['ln-remainder', 'ln-powerseries', 'ln-parts']) {
    await check(`ladder ${id}: play all items in order to summary, progress persists`, async () => {
      if (!rewritten.includes(id)) return `${id} not rewritten`;
      const r = await ladderPlay(id); return r;
    });
  }
  await check('ladder: wrong answers recorded and "Redo missed only" appears', async () => {
    const id = 'ln-remainder';
    await page.evaluate(() => { const C = window.__calctutor; for (const p of C.lessons.LESSONS.find(l => l.id === 'ln-remainder').practice.slice(0, 1)) C.store.recordLadder('ln-remainder', p.id, false); });
    await page.evaluate(i => window.__calctutor.nav({ v: 'lesson', id: i }), id);
    return (await $('.lladder.miss').count()) === 1 && (await $('.lfinish').getByText(/Redo missed only/).count()) === 1 || 'miss not shown';
  });

  await check('interactive lesson: widget svg, step-through + ask, try diagnosis, flip card', async () => {
    // temp lesson injected in memory only (no bank file): clone of a rewritten lesson + the ex3 fields
    await page.evaluate(() => {
      const L = window.__calctutor.lessons.LESSONS, base = L.find(l => l.plain);
      const t = { ...base, id: 'ln-smoke-ix', sections: base.sections.map(x => ({ ...x })),
        worked: [{ q: 'Smoke $x^2$', steps: ['one $a$', 'two $b$', 'three $c$'], ask: [{ at: 2, q: 'Next?', choices: [{ t: 'yes', ok: true, why: 'right $1$' }, { t: 'no', why: 'wrong $0$' }] }] }],
        cards: [{ f: 'front $e^x$', b: 'back $\\sum x^n/n!$' }, { f: 'f2', b: 'b2' }] };
      t.sections[0].widget = { lab: 'taylor', set: {} };
      t.sections[0].try = { q: 'Pick', choices: [{ t: 'A', ok: true, why: 'because A' }, { t: 'B', why: 'B is the slip' }, { t: 'C', why: 'C is the slip' }] };
      L.push(t);
      window.__calctutor.store.setShowAllSteps('ln-smoke-ix', false);
      window.__calctutor.nav({ v: 'lesson', id: 'ln-smoke-ix' });
    });
    try {
      if (!(await $('.lwidget svg').count())) return 'no widget svg';
      const w = $('.panel.worked').first();
      if ((await w.locator('.step:visible').count()) !== 1) return 'worked not collapsed to step 1';
      if (!(await w.getByText('What comes next?').count())) return 'no think prompt';
      if (!(await w.locator('.lreveal button', { hasText: 'Next step' }).isDisabled())) return 'ask (at 2) did not gate step 2';
      await w.locator('.ltry .choice', { hasText: 'yes' }).click();
      await w.getByText('Next step').click();
      if ((await w.locator('.step:visible').count()) !== 2) return 'Next step did not reveal step 2';
      await w.getByText('Next step').click();
      if ((await w.locator('.step:visible').count()) !== 3) return 'step 3 not revealed after ask';
      if (!(await w.locator('.step .katex').count())) return 'no KaTeX in revealed steps';
      const tr = $('.lwidget').locator('..').locator('.ltry');
      await tr.locator('.choice', { hasText: 'B' }).click();
      if (!/B is the slip/.test(await tr.innerText())) return 'wrong try: no diagnosis';
      await page.keyboard.press('1');                                  // idle shortcut must not fire from a try
      if (await page.evaluate(() => !!window.__calctutor.session && !!window.__calctutor.problem)) return 'shortcut fired from try';
      await tr.locator('.choice', { hasText: 'A' }).click();
      if (!/because A/.test(await tr.innerText())) return 'right try: no why';
      const c = $('.lcard');
      if (!/front/.test(await c.innerText())) return 'card front missing';
      await c.click();
      if (!/back/.test(await $('.lcard').innerText())) return 'card did not flip';
      await $('.lcards').getByText('Again').click();
      if (!/1 left|2 left/.test(await $('.lcards').innerText())) return 'no count left';
      const kerr = await page.evaluate(() => document.querySelectorAll('.katex-error').length);
      return kerr === 0 || `${kerr} katex-error`;
    } finally {
      await page.evaluate(() => { const L = window.__calctutor.lessons.LESSONS; const i = L.findIndex(l => l.id === 'ln-smoke-ix'); if (i >= 0) L.splice(i, 1); });
    }
  });

  await check('selftest.js passes', async () => {
    await home();
    const r = await page.evaluate(async () => { const m = await import('/tools/selftest.js'); return m.default.results.filter(x => x.result !== 'pass'); });
    const bad = r;
    return bad.length === 0 || JSON.stringify(bad);
  });

  await check('no console errors overall', () => {
    const e = consoleErrors.filter(x => !/^failures:/.test(x));
    return e.length === 0 || e.join(' | ');
  });
} finally {
  await browser.close();
  server.kill();
}
console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
process.exit(fails ? 1 : 0);
