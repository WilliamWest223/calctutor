// check-explorers.mjs — renders every explorer over every pick option x 5 values of each range
// control; fails on throw/NaN/undefined/empty svg, plus explorer-specific math assertions.
import { EXPLORERS } from '../js/explore.js';

let fails = 0, renders = 0;
const bad = m => { fails++; if (fails <= 40) console.error('FAIL ' + m); };

// sympy-computed (ratio test + endpoint tests): family -> interval string shown in the readout
const POWERINT = {
  'x^n/n': '[-1, 1)',
  'x^n/n^2': '[-1, 1]',
  '(x-2)^n/3^n': '(-1, 5)',
  'n!x^n': '{0}',
  'x^n/n!': '(-∞, ∞)',
  '(x+1)^n/(n·4^n)': '[-5, 3)',
};

const five = c => [0, .25, .5, .75, 1].map(t => {
  const v = c.min + (c.max - c.min) * t;
  return Math.round(v / c.step) * c.step;
});
const grid = controls => controls.reduce((acc, c) => {
  const vals = c.kind === 'pick' ? c.options : five(c);
  return acc.flatMap(s => vals.map(v => ({ ...s, [c.key]: v })));
}, [{}]);

const ids = new Set(), seen = {};
for (const ex of EXPLORERS) {
  if (ids.has(ex.id)) bad(`duplicate id ${ex.id}`);
  ids.add(ex.id);
  seen[ex.id] = 0;
  for (const st of grid(ex.controls)) {
    const tag = `${ex.id} ${JSON.stringify(st)}`;
    let out;
    try { out = ex.render(st); } catch (e) { bad(`${tag} threw ${e.message}`); continue; }
    renders++; seen[ex.id]++;
    if (!out || typeof out.svg !== 'string' || !out.svg.includes('<svg') || out.svg.length < 300) { bad(`${tag} empty svg`); continue; }
    const text = out.svg + JSON.stringify(out.readout) + out.note;
    const m = text.match(/NaN|undefined|\[object/);
    if (m) bad(`${tag} contains ${m[0]}`);
    if (!Array.isArray(out.readout) || !out.readout.length) bad(`${tag} no readout`);
    if (typeof out.note !== 'string' || !out.note) bad(`${tag} no note`);

    if (ex.id === 'powerint') {
      const iv = out.readout.find(r => r.label === 'interval')?.value;
      if (iv !== POWERINT[st.family]) bad(`${tag} interval ${iv} != ${POWERINT[st.family]}`);
    }
    if (ex.id === 'remainder') {
      const d = out.data;
      if (!d || !(d.bound + 1e-12 >= d.actual)) bad(`${tag} bound ${d?.bound} < actual ${d?.actual}`);
      if (!/yes/.test(out.readout.find(r => r.label === 'bound ≥ actual')?.value || '')) bad(`${tag} readout says bound < actual`);
    }
    if (ex.id === 'altest') {
      const d = out.data;
      if (!d || !(d.error <= d.next + 1e-13)) bad(`${tag} error ${d?.error} > next ${d?.next}`);
    }
  }
}
for (const id of ['powerint', 'remainder', 'altest']) if (!seen[id]) bad(`explorer ${id} missing`);
if (!EXPLORERS.find(e => e.id === 'taylor')?.controls[0].options.includes('arctan x')) bad('taylor lacks arctan x');

// powerint endpoint/verdict spot checks (x at the endpoint, centre-only, everywhere)
const pi = EXPLORERS.find(e => e.id === 'powerint');
const verdict = (family, x) => pi.render({ family, x, N: 20 }).readout.find(r => r.label.startsWith('at x')).value;
const expect = (got, want, what) => { if (!got.startsWith(want)) bad(`${what}: ${got} !~ ${want}`); };
expect(verdict('x^n/n', -1), 'converges', 'x^n/n at -1');
expect(verdict('x^n/n', 1), 'diverges', 'x^n/n at 1');
expect(verdict('(x+1)^n/(n·4^n)', -5), 'converges', '(x+1)^n/(n4^n) at -5');
expect(verdict('(x+1)^n/(n·4^n)', 3), 'diverges', '(x+1)^n/(n4^n) at 3');
expect(verdict('n!x^n', 0), 'converges', 'n!x^n at 0');
expect(verdict('n!x^n', 0.25), 'diverges', 'n!x^n at .25');
expect(verdict('x^n/n!', 6), 'converges', 'x^n/n! at 6');

console.log(`check-explorers: ${renders} renders, ${EXPLORERS.length} explorers, ${fails} failures`);
process.exit(fails ? 1 : 0);
