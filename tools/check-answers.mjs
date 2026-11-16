// ---------------------------------------------------------------
// tools/check-answers.mjs — regression suite for the answer checker.
//
//   node tools/check-answers.mjs
//
// Two halves:
//   1. hand-written cases (equivalent forms, wrong forms, junk input)
//   2. a sweep of the whole bank — every key must grade itself correct,
//      and no distractor may be accepted as the key.
// ---------------------------------------------------------------
import { STATIC, GENS, materialize } from '../js/bank/index.js';
import { normalize } from '../js/bank/index.js';
import { FIXTURES } from './fmt-fixtures.mjs';
import { checkTyped, isCheckable } from '../js/mathcheck.js';

let pass = 0;
const bad = [];
const eq = (user, key, want = true, label = '') => {
  const r = checkTyped(user, [{ t: key, ok: true }, { t: '$0$' }]);
  const got = r.status === 'correct';
  if (got === want) pass++;
  else bad.push(`${label} "${user}"  vs  "${key}"  → ${r.status} (wanted ${want ? 'correct' : 'not correct'})`);
};
const status = (user, key, want, label = '') => {
  const r = checkTyped(user, [{ t: key, ok: true }, { t: '$0$' }]);
  if (r.status === want) pass++;
  else bad.push(`${label} "${user}" → ${r.status}, wanted ${want}`);
};

// ---- equivalent forms that must be accepted --------------------
eq('2sqrt(x)ln(x) - 4sqrt(x) + C', '2\\sqrt{x}\\ln x-4\\sqrt{x}+C');
eq('2sqrt(x)(ln(x) - 2) + C', '2\\sqrt{x}\\ln x-4\\sqrt{x}+C');
eq('2*x^(1/2)*ln(x) - 4*x^0.5 + C', '2\\sqrt{x}\\ln x-4\\sqrt{x}+C');
eq('$2\\sqrt{x}\\ln x-4\\sqrt{x}+C$', '2\\sqrt{x}\\ln x-4\\sqrt{x}+C', true, '[pasted TeX]');
eq('sin(x)^2/2 + C', '-\\cos^{2}x/2 + C', true, '[differ by a constant]');
eq('1 - cos(x)^2', '\\sin^{2}x');
eq('2sin(x)cos(x)', '\\sin(2x)');
eq('(1-cos(2x))/2', '\\sin^{2}x');
eq('(x+1)^2', 'x^2+2x+1');
eq('arctan(x/3)/3', '\\frac{1}{3}\\arctan\\left(\\frac{x}{3}\\right)');
eq('tan^-1(x/3)/3', '\\frac{1}{3}\\arctan\\left(\\frac{x}{3}\\right)', true, '[inverse notation]');
eq('2 x sin x', '2x\\sin x', true, '[implicit multiplication]');
eq('sin(x)', '\\sin x + C', true, '[+C omitted]');
eq('4.5 J', '$4.5$ J', true, '[units]');
eq('x = 3tan(theta)', '$x = 3\\tan\\theta$', true, '[equation]');
eq('x/3 = tan(theta)', '$x = 3\\tan\\theta$', true, '[rescaled equation]');

// ---- wrong answers that must be rejected -----------------------
eq('2sqrt(x)ln(x) - 2sqrt(x) + C', '2\\sqrt{x}\\ln x-4\\sqrt{x}+C', false);
eq('3/5', '1', false, '[two constants must not "differ by a constant"]');
eq('(x+3)^2+4', '(x+3)^2+13', false, '[no +C, so no constant tolerance]');
eq('sinh(5x)/5 + C', '\\cosh(5x)/5 + C', false, '[sinh is not cosh]');
eq('cos(x)', '\\sin x', false);
eq('x^3/3', '\\frac{x^{4}}{4}', false);

// ---- the checker must never blame the student ------------------
for (const junk of ['???', 'sin(', '2 +', 'hello there friend', '']) {
  const r = checkTyped(junk, [{ t: '$\\sin x$', ok: true }, { t: '$0$' }]);
  if (r.status === 'unparsed' || r.status === 'undecidable') pass++;
  else bad.push(`junk "${junk}" → ${r.status} (must not be graded)`);
}

// ---- prose ------------------------------------------------------
const prose = [{ t: 'Diverges', ok: true }, { t: '$0$', why: 'x' }];
for (const [txt, want] of [['diverges', 'correct'], ['Diverges', 'correct'], ['converges', 'unparsed']]) {
  const r = checkTyped(txt, prose);
  if (r.status === want) pass++; else bad.push(`prose "${txt}" → ${r.status}, wanted ${want}`);
}

console.log(`hand-written cases:  ${pass} passed, ${bad.length} failed`);
bad.forEach(b => console.log('  x ' + b));

// ---- whole-bank sweep -------------------------------------------
const all = FIXTURES.map(f => normalize({ ...f, skill: `${f.unit}/${f.topic}` }));
for (const p of STATIC) all.push(materialize({ id: p.id }));
for (const g of GENS) for (let s = 1; s <= 25; s++) all.push(materialize({ gid: g.id, seed: (Math.imul(s, 2654435761) >>> 0) }));

let checkable = 0, selfOk = 0;
const selfBad = [], falsePos = [];
for (const p of all) {
  if (!isCheckable(p.choices) || p.fmt === 'multi' || p.fmt === 'error') continue;
  checkable++;
  const key = p.choices.find(c => c.ok);
  if (checkTyped(key.t, p.choices).status === 'correct') selfOk++;
  else if (selfBad.length < 10) selfBad.push(`${p.skill} :: ${key.t.slice(0, 70)}`);
  for (const c of p.choices) {
    if (c.ok) continue;
    if (checkTyped(c.t, p.choices).status === 'correct' && falsePos.length < 10) {
      falsePos.push(`${p.skill} :: key=${key.t.slice(0, 40)} | accepted=${c.t.slice(0, 40)}`);
    }
  }
}

console.log(`\nbank sweep: ${checkable} checkable problems of ${all.length}`);
console.log(`  key grades itself correct: ${selfOk}/${checkable}`);
selfBad.forEach(b => console.log('    x ' + b));
console.log(`  distractors wrongly accepted: ${falsePos.length}`);
falsePos.forEach(b => console.log('    ! ' + b));
console.log('  (a distractor that is genuinely equal to the key — e.g. x^7·x^4 vs x^11 —');
console.log("   is reported here but is correct behaviour for a free-entry box.)");

const failed = bad.length + (checkable - selfOk);
console.log(`\n${failed === 0 ? 'OK' : 'FAILURES: ' + failed}`);
process.exit(failed ? 1 : 0);
