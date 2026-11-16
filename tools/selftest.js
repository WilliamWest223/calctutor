// ---------------------------------------------------------------
// tools/selftest.js — end-to-end UI self-test.
//
// Run it from the browser console with the app open:
//     await import('/tools/selftest.js')
//
// It drives the real UI (clicking real buttons), then restores your
// progress from a snapshot taken at the start. Prints a table.
// ---------------------------------------------------------------
const CT = window.__calctutor;
if (!CT) throw new Error('Open the app first — window.__calctutor is missing.');

const results = [];
const has = s => !!document.querySelector(s);
const N = s => document.querySelectorAll(s).length;
const t = (name, fn) => {
  let r;
  try { r = fn(); } catch (e) { r = 'THREW ' + e.message; }
  results.push({ test: name, result: r === true ? 'pass' : 'FAIL', detail: r === true ? '' : String(r) });
};
const submitTyped = txt => { document.querySelector('.ownfield').value = txt; document.querySelector('.choice.own .btn').click(); };
const submitMulti = () => [...document.querySelectorAll('.btn.primary')].find(b => /Submit/.test(b.textContent)).click();
const right = () => {
  const p = CT.problem, cs = document.querySelectorAll('.choice');
  if (p.fmt === 'free') return submitTyped((p.accept && p.accept[0]) || p.choices.find(c => c.ok).t.replace(/\$/g, ''));
  if (p.fmt === 'multi') { p.choices.forEach((c, i) => c.ok && cs[i].click()); return submitMulti(); }
  cs[p.choices.findIndex(c => c.ok)].click();
};
const wrong = () => {
  const p = CT.problem, cs = document.querySelectorAll('.choice');
  if (p.fmt === 'free') return submitTyped('12345.678');
  if (p.fmt === 'multi') { cs[p.choices.findIndex(c => c.ok)].click(); return submitMulti(); }   // one key only: set is incomplete
  cs[(p.choices.findIndex(c => c.ok) + 1) % p.choices.length].click();
};
// topic drill that lands on an item with a write-in box (plain MC / free; not tf, multi or find-the-error)
const navOwn = scope => { for (let i = 0; i < 30; i++) { CT.nav({ v: 'drill', mode: 'topic', scope }); const p = CT.problem; if (!p.tf && p.fmt !== 'multi' && p.fmt !== 'error' && document.querySelector('.ownhelp')) return; } };
const cont = () => { const b = [...document.querySelectorAll('.btn.primary')].find(x => /Continue/.test(x.textContent)); if (b) b.click(); };
const endIfRunning = () => { if (CT.uiState !== 'idle') { const q = [...document.querySelectorAll('.btn.sm.ghost')].find(b => b.textContent === 'end'); if (q) q.click(); } };

// preserve the user's real progress
const SNAPSHOT = CT.store.exportJSON();
CT.store.resetAll();
CT.store.setSetting('freeShare', 0);        // deterministic MC for the tests that click choices; the full session turns it up

// ---------------- content reachable through the UI ----------------
const ALL_SKILLS = CT.sess.scopeSkills('rapid');

t(`every topic drillable (${ALL_SKILLS.length} topics)`, () => {
  for (const s of ALL_SKILLS) {
    CT.nav({ v: 'drill', mode: 'topic', scope: s });
    if (!CT.problem) return 'no problem for ' + s;
    const want = CT.problem.tf ? 2 : 4;                 // true/false check-ins have two
    if (CT.problem.choices.length < want) return `${s}: only ${CT.problem.choices.length} choices`;
    if (CT.problem.fmt !== 'multi' && CT.problem.choices.filter(c => c.ok).length !== 1) return s + ': not exactly one correct answer';
    if (!has('.katex')) return s + ': math did not render';
  }
  return true;
});

t('every topic has a primer', () => {
  for (const s of ALL_SKILLS) {
    CT.nav({ v: 'primer', scope: s });
    if (!has('.movelist')) return 'missing primer: ' + s;
  }
  return true;
});

t('every unit drill builds', () => {
  for (const u of ['precalc', 'foundations', 'techniques', 'applications', 'diffeq', 'series', 'polar']) {
    CT.nav({ v: 'drill', mode: 'unit', scope: u });
    if (!CT.problem || !CT.problem.skill.startsWith(u + '/')) return 'unit failed: ' + u;
  }
  return true;
});

// ---------------- modes ----------------
for (const mode of ['rapid', 'review', 'exam', 'cram']) {
  t(`mode: ${mode}`, () => {
    CT.nav({ v: 'drill', mode });
    return (CT.session && CT.session.queue.length > 0 && !!CT.problem && has('.choices')) || 'did not build';
  });
}
t('mode: custom (study plan)', () => {
  CT.nav({ v: 'drill', mode: 'custom', skills: [ALL_SKILLS[0], ALL_SKILLS[1]] });
  return CT.session.queue.length > 0 || 'empty queue';
});

// ---------------- drill mechanics ----------------
t('hint escalates', () => {
  CT.nav({ v: 'drill', mode: 'rapid' });
  const b = document.getElementById('hintbtn');
  if (!b) return 'no hint button (hints may be off in settings)';
  b.click(); const one = N('#hintbox .hintpanel div');
  b.click(); const two = N('#hintbox .hintpanel div');
  return (one >= 1 && two >= one) || `one=${one} two=${two}`;
});
t('star toggles both ways', () => {
  const a = CT.store.starred().length;
  document.querySelector('.iconbtn.star').click();
  const b = CT.store.starred().length;
  document.querySelector('.iconbtn.star').click();
  return (b === a + 1 && CT.store.starred().length === a) || 'star did not toggle';
});
t('wrong answer shows diagnosis + solution', () => {
  CT.nav({ v: 'drill', mode: 'rapid' });
  wrong();
  return (has('.verdictbar.no') && has('.panel.diag') && has('.steps')) || 'feedback incomplete';
});
t('correct answer shows no diagnosis', () => {
  cont(); const multi = CT.problem.fmt === 'multi'; right();     // multi always lists "Each option" as a diag panel
  return (has('.verdictbar.ok') && (multi || !has('.panel.diag'))) || 'unexpected diagnosis on a correct answer';
});
t('exam withholds feedback', () => {
  CT.nav({ v: 'drill', mode: 'exam' });
  wrong();
  return !has('.verdictbar') || 'exam leaked feedback';
});

// ---------------- a full session ----------------
t('full session reaches summary', () => {
  CT.store.setSetting('length', 20);
  CT.store.setSetting('freeShare', 0.6);          // mix in free-response / multi / error items
  CT.nav({ v: 'drill', mode: 'rapid' });
  let guard = 0;
  while (CT.problem && guard++ < 60) { (guard % 3 ? wrong() : right()); cont(); }
  CT.store.setSetting('freeShare', 0);
  return has('.scorehero') || 'never reached the summary';
});
t('session recorded', () => CT.store.state().history.length >= 1 || 'no history row');
t('mistake bank filled', () => CT.store.missed().length > 0 || 'bank empty after wrong answers');
t('activity + errors tracked', () =>
  (Object.keys(CT.store.state().activity).length >= 1 && Object.keys(CT.store.state().errors).length >= 1) || 'analytics not recorded');
t('mastery advanced', () => Object.values(CT.store.state().skills).some(s => s.level > 0) || 'no level increases');

// ---------------- mistake bank round trip ----------------
t('mistake bank drains to empty', () => {
  let guard = 0;
  while (CT.store.missed().length && guard++ < 80) {
    CT.nav({ v: 'drill', mode: 'mistakes' });
    while (CT.problem) { right(); cont(); }
    endIfRunning();
  }
  return CT.store.missed().length === 0 || `${CT.store.missed().length} left`;
});

// ---------------- screens ----------------
for (const [name, route, sel] of [
  ['home', { v: 'home' }, '.deck'],
  ['progress', { v: 'progress' }, '.heatmap'],
  ['formula sheet', { v: 'formulas' }, '.flist'],
  ['labs index', { v: 'labs' }, '.mode'],
  ['study plan', { v: 'plan' }, 'input[type=date]'],
  ['worksheet', { v: 'worksheet' }, '.qlist'],
]) t(`screen: ${name}`, () => { CT.nav(route); return has(sel) || 'did not render'; });

for (const id of ['riemann', 'taylor', 'series', 'revolve', 'euler', 'polar', 'area']) {
  t(`lab: ${id}`, () => {
    CT.nav({ v: 'lab', id });
    if (!has('.labfig svg')) return 'no figure';
    if (N('.rocell') < 2) return 'no readout';
    const sl = document.querySelector('.slider');
    if (sl) {
      const before = document.querySelector('.labfig svg').outerHTML;
      sl.value = String(Math.min(+sl.max, +sl.value + +sl.step * 3));
      sl.dispatchEvent(new Event('input'));
      if (document.querySelector('.labfig svg').outerHTML === before) return 'slider did not redraw';
    }
    for (const el of document.querySelectorAll('.rov')) if (/NaN|undefined/.test(el.textContent)) return 'NaN in readout';
    return true;
  });
}

// ---------------- write-your-own answers ----------------
t('write-in: box present and numbered 5', () => {
  navOwn('techniques/Integration by Parts');
  return (has('.choice.own') && document.querySelector('.choice.own .key').textContent === '5')
    || 'missing or mis-numbered';
});
t('write-in: an equivalent form is accepted', () => {
  navOwn('techniques/Integration by Parts');
  const key = CT.problem.choices.find(c => c.ok).t.replace(/\$/g, '');
  const el = document.querySelector('.ownfield');
  el.value = key + ' + 0';                       // same value, different text
  document.querySelector('.choice.own .btn').click();
  return has('.verdictbar.ok') || 'equivalent form rejected';
});
t('write-in: a wrong expression is rejected', () => {
  navOwn('techniques/Integration by Parts');
  document.querySelector('.ownfield').value = 'x^2 + 17';
  document.querySelector('.choice.own .btn').click();
  return has('.verdictbar.no') || 'wrong answer accepted';
});
t('write-in: bad syntax does not grade the question', () => {
  navOwn('techniques/Integration by Parts');
  const before = CT.session.results.length;
  document.querySelector('.ownfield').value = '!!!???';
  document.querySelector('.choice.own .btn').click();
  return (!has('.verdictbar') && CT.session.results.length === before && has('.ownmsg'))
    || 'a syntax error was graded as an answer';
});

const OWN = 'techniques/Integration by Parts';
const typeOwn = text => {
  const el = document.querySelector('.ownfield');
  el.value = text;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return el;
};

t('write-in: palette button inserts its snippet at the caret', () => {
  navOwn(OWN);
  const el = typeOwn('');
  const btn = [...document.querySelectorAll('.palbtn')].find(b => b.textContent === '√');
  if (!btn) return 'no sqrt button in the palette';
  btn.click();
  return el.value === 'sqrt()' || `inserted "${el.value}"`;
});

t('write-in: palette wraps the current selection', () => {
  navOwn(OWN);
  const el = typeOwn('x+1');
  el.setSelectionRange(0, 3);
  [...document.querySelectorAll('.palbtn')].find(b => b.textContent === '√').click();
  return el.value === 'sqrt(x+1)' || `wrapped to "${el.value}"`;
});

t('write-in: live preview renders what was typed', () => {
  navOwn(OWN);
  typeOwn('2sqrt(x)ln(x) - 4sqrt(x) + C');
  const box = document.querySelector('.ownpreview');
  if (!box || !box.querySelector('.katex')) return 'no rendered preview';
  return document.querySelector('.ownfield').classList.contains('ok') || 'valid input not marked ok';
});

t('write-in: an unfinished bracket is flagged, not graded', () => {
  navOwn(OWN);
  const before = CT.session.results.length;
  const el = typeOwn('2sqrt(x');
  if (!el.classList.contains('bad')) return 'unbalanced input not marked bad';
  document.querySelector('.choice.own .btn').click();
  return (!has('.verdictbar') && CT.session.results.length === before)
    || 'an unfinished expression was graded';
});

t('write-in: the how-to-type help renders as markup, not escaped tags', () => {
  navOwn(OWN);
  const help = document.querySelector('.ownhelp');
  if (!help) return 'no help block';
  help.open = true;
  if (/&lt;|<code>/.test(help.innerHTML.replace(/<code>|<\/code>/g, ''))) return 'help HTML was escaped';
  return help.querySelector('code') ? true : 'no code samples in the help';
});

// ---------------- variety ----------------
t('variety: a topic session does not repeat the same integrand', () => {
  const worst = [];
  for (const sk of CT.bank.LIVE_SKILLS.filter(s => s.startsWith('techniques/'))) {
    CT.nav({ v: 'drill', mode: 'topic', scope: sk });
    const seen = CT.session.queue.map(r => CT.bank.materialize(r).prompt);
    const uniq = new Set(seen).size;
    if (uniq < Math.min(seen.length, 8)) worst.push(`${sk}: ${uniq} distinct in a ${seen.length}-question session`);
  }
  return worst.length === 0 || worst.slice(0, 3).join(' | ');
});

t('variety: every difficulty in the bank can actually be served', () => {
  const reach = new Set(CT.sess.DIFF_BAND.all);
  const bad = [];
  for (const p of CT.bank.STATIC) if (!reach.has(p.diff ?? 2)) bad.push(`${p.id}(${p.diff})`);
  for (const g of CT.bank.GENS) {
    const m = CT.bank.materialize({ gid: g.id, seed: 4242 });
    if (m && !reach.has(m.diff)) bad.push(`${g.id}(${m.diff})`);
  }
  return bad.length === 0 || `unreachable difficulty: ${bad.slice(0, 4).join(', ')}`;
});

t('variety: a fresh account still sees more than one generator per topic', () => {
  const thin = [];
  for (const sk of ['techniques/Tabular & Looping Parts', 'techniques/Trigonometric Substitution',
    'techniques/Improper Integrals', 'techniques/Trigonometric Integrals']) {
    CT.nav({ v: 'drill', mode: 'topic', scope: sk });
    const gens = new Set(CT.session.queue.map(r => r.gid || ('static:' + r.id)));
    if (gens.size < 2) thin.push(`${sk} drew everything from ${[...gens][0]}`);
  }
  return thin.length === 0 || thin.join(' | ');
});

// ---------------- check-ins (true/false) ----------------
const CIS = 'checkins/Method Judgment';

t('check-in: renders as two options with no write-in box', () => {
  CT.nav({ v: 'drill', mode: 'topic', scope: CIS });
  const n = document.querySelectorAll('.choice:not(.own)').length;
  if (n !== 2) return `expected 2 options, got ${n}`;
  if (has('.choice.own')) return 'a write-in box was shown on a true/false question';
  const labels = [...document.querySelectorAll('.choice:not(.own) .body')].map(e => e.textContent.trim());
  return labels.join(',') === 'True,False' || `options read "${labels.join(',')}"`;
});

t('check-in: True is always first, so the order never leaks the answer', () => {
  const seen = new Set();
  for (let i = 0; i < 12; i++) {
    CT.nav({ v: 'drill', mode: 'topic', scope: CIS });
    seen.add([...document.querySelectorAll('.choice:not(.own) .body')].map(e => e.textContent.trim()).join(','));
  }
  return (seen.size === 1 && seen.has('True,False')) || `orderings seen: ${[...seen].join(' | ')}`;
});

t('check-in: both verdicts occur across the bank', () => {
  const ci = CT.bank.STATIC.filter(p => p.unit === 'checkins');
  if (ci.length < 50) return `only ${ci.length} check-ins loaded`;
  const trues = ci.filter(p => p.choices.find(c => c.ok).t === 'True').length;
  const share = trues / ci.length;
  return (share > 0.3 && share < 0.7) || `${Math.round(share * 100)}% of answers are True — too lopsided`;
});

// ---------------- hints and explanations ----------------
t('hint: the ladder starts general and grows one step at a time', () => {
  navOwn('techniques/Integration by Parts');
  const btn = document.getElementById('hintbtn');
  if (!btn) return 'no hint button';
  btn.click();
  const first = document.querySelectorAll('.hintstep').length;
  if (first !== 1) return `first hint showed ${first} steps, expected 1`;
  btn.click();
  const second = document.querySelectorAll('.hintstep').length;
  if (second !== 2) return `second hint showed ${second} steps, expected 2`;
  return document.querySelector('.hintnum') ? true : 'hint steps are unlabelled';
});

t('hint: every problem can produce at least one hint', () => {
  const bad = [];
  for (const p of CT.bank.STATIC) {
    const m = CT.bank.materialize({ id: p.id });
    if (!CT.ui.hintLadder(m).length) bad.push(p.id);
  }
  for (const g of CT.bank.GENS) {
    const m = CT.bank.materialize({ gid: g.id, seed: 12345 });
    if (m && !CT.ui.hintLadder(m).length) bad.push(g.id);
  }
  return bad.length === 0 || `no hints for: ${bad.slice(0, 4).join(', ')}`;
});

t('wrong answer: shows the right answer and why it is right', () => {
  navOwn('techniques/Integration by Parts');
  wrong();   // handles every fmt (mc / free / multi)
  if (!has('.panel.right')) return 'no "right answer" panel after a miss';
  if (!has('.rightanswer')) return 'the correct answer was not displayed';
  return has('.panel.diag') || 'the diagnosis of the chosen option is missing';
});

t('correct answer: does not show the right-answer panel', () => {
  navOwn('techniques/Integration by Parts');
  right();
  return !has('.panel.right') || 'the right-answer panel appeared on a correct answer';
});

// ---------------- learn program ----------------
t('learn: the program screen renders with every lesson listed', () => {
  CT.nav({ v: 'learn' });
  const rows = document.querySelectorAll('.weekblock .lrow').length;
  const n = CT.lessons.LESSONS.length;
  return rows === n || `${rows} rows in the calendar, expected ${n}`;
});

t('learn: catch-up lists exactly what class has already covered', () => {
  CT.nav({ v: 'learn' });
  const today = new Date().toISOString().slice(0, 10);
  const behind = CT.lessons.LESSONS.filter(l =>
    l.dates[l.dates.length - 1] < today && !CT.store.lessonDone(l.id));
  const shown = document.querySelectorAll('.panel.catchup .lrow').length;
  if (!behind.length) return true;                     // nothing overdue: nothing to assert
  return shown === behind.length || `catch-up showed ${shown}, expected ${behind.length}`;
});

t('learn: every lesson opens and renders its worked examples', () => {
  for (const l of CT.lessons.LESSONS) {
    CT.nav({ v: 'lesson', id: l.id });
    if (!has('.lgoal')) return `${l.id}: no goal rendered`;
    const want = (l.worked || []).length;
    const got = document.querySelectorAll('.panel.worked').length;
    if (got !== want) return `${l.id}: ${got} worked examples, expected ${want}`;
    // shortcut: prose may say "undefined"; flag only $$ or a text node that is exactly undefined/NaN
    if (/\$\$|\bNaN\b|[=:(]\s*undefined\b|\bundefined\s*[)\]}]/.test(document.body.textContent)) return `${l.id}: junk in the rendered text`;
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) if (/^\s*(undefined|NaN)\s*$/.test(n.textContent)) return `${l.id}: junk in the rendered text`;
  }
  return true;
});

t('learn: every lesson points at live skills and real check-ins', () => {
  const bad = [];
  for (const l of CT.lessons.LESSONS) {
    for (const s of l.drill || []) if (!CT.bank.LIVE_SKILLS.includes(s)) bad.push(`${l.id}→${s}`);
    for (const c of l.checkins || []) if (!CT.bank.materialize({ id: c })) bad.push(`${l.id}→${c}`);
  }
  return bad.length === 0 || `dangling: ${bad.slice(0, 3).join(', ')}`;
});

t('learn: opening a lesson marks it read, drilling marks it done', () => {
  const L = CT.lessons.LESSONS.find(x => !x.plain) || CT.lessons.LESSONS[0];
  const id = L.id;
  CT.nav({ v: 'lesson', id });
  if (!CT.store.lesson(id).read) return 'opening the lesson did not mark it read';
  if (CT.store.lessonDone(id)) return 'a lesson counted as done before any drilling';
  CT.store.markLessonDrilled(id);
  for (const p of L.practice || []) CT.store.recordLadder(id, p.id, true); // ladder lessons finish when every item is tried
  return CT.store.lessonDone(id) || 'drilling did not complete the lesson';
});

t('learn: lessons cover every teaching day in the syllabus', () => {
  const taught = CT.course.SCHEDULE.filter(d => d.kind !== 'study' && (d.skills || []).length).map(d => d.d);
  const covered = new Set(CT.lessons.LESSONS.flatMap(l => l.dates));
  const missing = taught.filter(d => !covered.has(d));
  return missing.length === 0 || `no lesson for: ${missing.join(', ')}`;
});

t('learn: a lesson can drill his check-ins as an explicit playlist', () => {
  const l = CT.lessons.LESSONS.find(x => (x.checkins || []).length);
  CT.nav({ v: 'drill', mode: 'custom', refs: l.checkins.map(id => ({ id })) });
  const ids = CT.session.queue.map(r => r.id);
  return l.checkins.every(c => ids.includes(c)) || `playlist was ${ids.join(',')}`;
});

// ---------------- cheat sheet ----------------
const key = k => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

t('cheat sheet: C opens and closes from any screen', () => {
  for (const route of [{ v: 'home' }, { v: 'progress' }, { v: 'formulas' }, { v: 'lab', id: 'taylor' }]) {
    CT.nav(route);
    key('c');
    if (!has('.csoverlay')) return 'did not open on ' + route.v;
    key('Escape');
    if (has('.csoverlay')) return 'did not close on ' + route.v;
  }
  return true;
});
t('cheat sheet: unit circle is complete', () => {
  CT.nav({ v: 'home' }); key('c');
  const ok = N('.ucdot') === 16 && N('.ucang') === 16 && N('.uccoord') === 16 && N('.cssection') >= 8;
  key('Escape');
  return ok || `dots=${N('.ucdot')} sections=${N('.cssection')}`;
});
t('cheat sheet: filter works', () => {
  key('c');
  const box = document.querySelector('.cssearch');
  box.value = 'sec'; box.dispatchEvent(new Event('input'));
  const vis = [...document.querySelectorAll('.csrow,.csitem')].filter(e => e.style.display !== 'none').length;
  const all = N('.csrow,.csitem');
  key('Escape');
  return (vis > 0 && vis < all) || `visible=${vis} of ${all}`;
});
t('cheat sheet: opens mid-question without disturbing the session', () => {
  CT.nav({ v: 'drill', mode: 'rapid' });
  const qs = CT.session.queue.length;
  key('c');
  const opened = has('.csoverlay') && CT.uiState === 'asking' && has('.choices');
  key('Escape');
  return (opened && CT.session.queue.length === qs && CT.uiState === 'asking') || 'session disturbed';
});

t('worksheet has matching answer key', () => {
  CT.nav({ v: 'worksheet' });
  const q = N('.qlist:not(.keylist) li'), k = N('.keylist li');
  return (q >= 15 && q === k) || `questions=${q} key=${k}`;
});
t('formula search filters', () => {
  CT.nav({ v: 'formulas' });
  const box = document.querySelector('.searchbox');
  box.value = 'washer'; box.dispatchEvent(new Event('input'));
  const n = N('.frow');
  return (n >= 1 && n <= 3) || 'hits=' + n;
});
t('overlays open and close', () => {
  CT.nav({ v: 'help' });
  const okHelp = has('.overlay') && N('.keyrow') >= 12;
  CT.nav({ v: 'search' });
  const okSearch = has('.overlay') && has('.searchbox');
  CT.nav({ v: 'home' });
  return (okHelp && okSearch && !has('.overlay')) || 'overlay behaviour wrong';
});

// ---------------- persistence ----------------
t('export/import round trip', () => {
  const snap = CT.store.exportJSON();
  const answered = CT.store.state().totals.answered;
  CT.store.resetAll();
  CT.store.importJSON(snap);
  return CT.store.state().totals.answered === answered || 'totals lost';
});
t('v1 save migrates without loss', () => {
  const v1 = {
    v: 1, skills: { 'series/Sequences': { seen: 4, right: 3, streak: 1, level: 2, due: 0, ease: 2.3, lastTs: Date.now() } },
    missed: [], history: [], day: { last: null, count: 3 },
    totals: { answered: 4, right: 3, best: 2, secs: 60 },
    settings: { theme: 'paper', timed: false, seconds: 90 },
  };
  CT.store.importJSON(JSON.stringify(v1));
  const s = CT.store.state();
  return (s.v === 2 && s.totals.answered === 4 && s.settings.theme === 'paper'
    && s.settings.length === 20 && Array.isArray(s.starred) && typeof s.errors === 'object')
    || 'migration dropped fields';
});

// ---------------- restore ----------------
CT.store.importJSON(SNAPSHOT);
CT.nav({ v: 'home' });

const failed = results.filter(r => r.result !== 'pass');
console.table(results);
console.log(`%c${results.length - failed.length}/${results.length} passed`,
  `font-weight:bold;color:${failed.length ? '#ff6b62' : '#8fae3a'}`);
if (failed.length) console.error('failures:', failed);
export default { results, failed: failed.length };
