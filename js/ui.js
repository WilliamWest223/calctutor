// ---------------------------------------------------------------
// ui.js — topbar, home, drill, feedback, summary.
// (Progress / reference / labs / overlays live in screens.js)
// ---------------------------------------------------------------
import { h, tex, clear, pct, plural, toast, flash } from './util.js';
import { UNITS, liveSkillsOf, LIVE_SKILLS, topicOfSkill, unitOfSkill, countsFor, UNIT_BY_KEY } from './bank/index.js';
import { primerFor } from './bank/primers.js';
import { COURSE, EXAMS, GATEWAYS, courseToday, nextAssessment, coveredSkills, OFF_SYLLABUS, LIGHT_COVERAGE } from './bank/course.js';
import { LESSONS } from './bank/lessons.js';
import * as store from './store.js';
import { MODES } from './session.js';
import { build as buildViz } from './viz.js';
import { isCheckable, previewInput } from './mathcheck.js';

let nav = () => {};
export function setNav(fn) { nav = fn; }
export { nav as go };

const KEYCAPS = ['1', '2', '3', '4', '5'];

// ---------------------------------------------------------------
// chrome
// ---------------------------------------------------------------
export function topbar() {
  const st = store.state();
  const acc = st.totals.answered ? pct(st.totals.right, st.totals.answered) : 0;
  const due = store.dueCount(LIVE_SKILLS);
  const dte = store.daysToExam();
  return h('header.topbar',
    h('div.brand', { onclick: () => nav({ v: 'home' }), title: 'Home' },
      h('span.mark', 'Calctutor'),
      h('span.sub', 'math 142')),
    h('div.spacer'),
    dte != null && dte >= 0 && h('div.stat-chip' + (dte <= 7 ? '.hot' : ''), {
      title: 'Exam countdown', onclick: () => nav({ v: 'plan' }), style: { cursor: 'pointer' },
    }, '◇', h('b', String(dte)), h('span', dte === 1 ? 'day to exam' : 'days to exam')),
    st.day.count > 0 && h('div.stat-chip' + (st.day.count > 1 ? '.hot' : ''),
      '🔥', h('b', String(st.day.count)), h('span', st.day.count === 1 ? 'day' : 'day streak')),
    st.totals.answered > 0 && h('div.stat-chip', h('b', acc + '%'), h('span', 'accuracy')),
    due > 0 && h('div.stat-chip.hot', h('b', String(due)), h('span', 'due')),
    h('button.iconbtn.cheatbtn', {
      title: 'Cheat sheet  (C) — works mid-question too',
      onclick: () => window.__calctutor && window.__calctutor.cheatsheet(),
    }, '▤'),
    h('button.iconbtn', { title: 'Learn — the semester program  (N)', onclick: () => nav({ v: 'learn' }) }, '◈'),
    h('button.iconbtn', { title: 'Reference sheet  (F)', onclick: () => nav({ v: 'formulas' }) }, '❋'),
    h('button.iconbtn', { title: 'Interactive labs  (L)', onclick: () => nav({ v: 'labs' }) }, '⌾'),
    h('button.iconbtn', { title: 'Progress  (P)', onclick: () => nav({ v: 'progress' }) }, '◴'),
    h('button.iconbtn', {
      title: 'Toggle theme',
      onclick: () => {
        const root = document.documentElement;
        const next = root.dataset.theme === 'paper' ? 'blueprint' : 'paper';
        root.dataset.theme = next; store.setSetting('theme', next);
      },
    }, '◐'),
    h('button.iconbtn', { title: 'Keyboard shortcuts  (?)', onclick: () => nav({ v: 'help' }) }, '?'),
  );
}

// ---------------------------------------------------------------
// home
// ---------------------------------------------------------------
export function home() {
  const st = store.state();
  const wrap = h('div.wrap');

  wrap.appendChild(h('section.hero',
    h('div.eyebrow', 'Calculus II · drill console'),
    h('h1', { html: 'Answer fast. Miss something, <em>see why</em>.' }),
    h('p', { html: tex('Every wrong answer is diagnosed against the specific misconception behind it, then drawn. Missed problems come back on a schedule until they stop being missed.') }),
    svgRule(),
  ));

  // ---- live course status, straight from the syllabus
  const ct = courseToday();
  const na = nextAssessment();
  if (na || ct.next) {
    wrap.appendChild(h('div.examband', { onclick: () => nav({ v: 'plan' }) },
      na && h('span.big', String(na.days)),
      h('div',
        h('div', { style: { fontWeight: 600 } },
          na ? (na.days === 0 ? `${na.name} is today` : `${plural(na.days, 'day')} until ${na.name}`) : 'Term in progress'),
        h('div.dimmer', { style: { fontSize: '12.5px' } },
          ct.next ? `Next class: ${ct.next.t} · ${fmtDay(ct.next.d)}` : 'Open your study plan →')),
      h('span.flex'),
      na && na.kind === 'exam' && h('button.btn.sm', {
        onclick: e => { e.stopPropagation(); nav({ v: 'drill', mode: 'examscope', scope: na.id }); },
      }, `Practise ${na.name} →`),
    ));
  }

  // ---- the learn program, and what the course has already covered
  {
    const today = new Date().toISOString().slice(0, 10);
    const behind = LESSONS.filter(l =>
      l.dates[l.dates.length - 1] < today && !store.lessonDone(l.id));
    const nextUp = LESSONS.find(l => l.dates[l.dates.length - 1] >= today);
    const target = behind[0] || nextUp;
    if (target) {
      wrap.appendChild(h('div.learnband' + (behind.length ? '.is-behind' : ''),
        { onclick: () => nav({ v: 'learn' }) },
        h('span.lbglyph', '◈'),
        h('div',
          h('div', { style: { fontWeight: 600 } },
            behind.length
              ? `${plural(behind.length, 'lesson')} behind — start with ${target.title}`
              : `Up next: ${target.title}`),
          h('div.dimmer', { style: { fontSize: '12.5px' } },
            behind.length
              ? 'Class has already covered these. Read, then drill — they build on each other.'
              : `Lesson ${target.n} of ${LESSONS.length} · ${fmtDay(target.dates[0])}`)),
        h('span.flex'),
        h('button.btn.sm.primary', {
          onclick: e => { e.stopPropagation(); nav({ v: 'lesson', id: target.id }); },
        }, 'Open lesson →')));
    }
  }

  // ---- modes
  const deck = h('div.deck');
  const order = ['rapid', 'review', 'mistakes', 'exam', 'cram', 'starred'];
  order.forEach((k, i) => {
    const m = MODES[k];
    const n = k === 'mistakes' ? store.missed().length : k === 'starred' ? store.starred().length : m.count;
    const dead = (k === 'mistakes' || k === 'starred') && n === 0;
    deck.appendChild(h('button.mode', {
      'data-accent': m.accent, disabled: dead || null,
      style: dead ? { opacity: .45, cursor: 'not-allowed' } : { animationDelay: `${i * 55}ms` },
      onclick: () => !dead && nav({ v: 'drill', mode: k }),
    },
      i < 6 && h('span.kbd', String(i + 1)),
      h('span.glyph', m.glyph),
      h('h3', m.name),
      h('p', m.blurb),
      (k === 'mistakes' || k === 'starred')
        ? h('span.badge' + (n ? '.live' : ''), n ? `${plural(n, 'problem')} waiting` : (k === 'starred' ? 'nothing starred' : 'empty — nice'))
        : h('span.badge', `${m.count} questions${m.timed ? ` · ${m.secs}s each` : ''}`),
    ));
  });
  wrap.appendChild(deck);

  // ---- course-specific practice
  wrap.appendChild(h('div.sechead',
    h('h2', 'Your course'),
    h('div.line'),
    h('span.dimmer', { style: { fontSize: '12px' } }, `${COURSE.code} · ${COURSE.term} · ${COURSE.instructor}`)));

  const ctd = courseToday();
  const covN = coveredSkills().length;
  const cdeck = h('div.deck');
  cdeck.appendChild(h('button.mode', { 'data-accent': 'lime', onclick: () => nav({ v: 'drill', mode: 'covered' }) },
    h('span.glyph', '◐'),
    h('h3', 'Covered So Far'),
    h('p', 'Only what has actually been lectured on. Nothing from later in the term.'),
    h('span.badge', covN ? `${plural(covN, 'topic')} to date` : 'term not started')));
  for (const e of EXAMS) {
    const past = e.date < new Date().toISOString().slice(0, 10);
    cdeck.appendChild(h('button.mode', {
      'data-accent': 'coral', onclick: () => nav({ v: 'drill', mode: 'examscope', scope: e.id }),
      style: past ? { opacity: .55 } : null,
    },
      h('span.glyph', '✦'),
      h('h3', e.name),
      h('p', e.blurb),
      h('span.badge' + (past ? '' : '.live'), fmtDay(e.date))));
  }
  for (const g of GATEWAYS) {
    cdeck.appendChild(h('button.mode', { 'data-accent': 'violet', onclick: () => nav({ v: 'drill', mode: 'gateway', scope: g.id }) },
      h('span.glyph', '⊘'),
      h('h3', g.name),
      h('p', g.blurb),
      h('span.badge', g.date ? fmtDay(g.date) : '30 minutes')));
  }
  wrap.appendChild(cdeck);

  // ---- quick settings
  const sset = store.settings();
  wrap.appendChild(h('div.quickbar',
    h('span.eyebrow', 'session'),
    pillGroup([10, 20, 30, 40].map(v => ({ label: String(v), on: sset.length === v, fn: () => { store.setSetting('length', v); nav({ v: 'home' }); } })), 'length'),
    pillGroup([['all', 'all levels'], ['easy', 'easy'], ['medium', 'medium'], ['hard', 'hard']].map(([v, l]) => ({
      label: l, on: sset.difficulty === v, fn: () => { store.setSetting('difficulty', v); nav({ v: 'home' }); },
    })), 'difficulty'),
    h('label.toggle', { title: 'Aim questions at your current mastery level' },
      h('input', { type: 'checkbox', checked: sset.adaptive || null, onchange: e => store.setSetting('adaptive', e.target.checked) }),
      h('span', 'adaptive')),
    h('label.toggle', { title: 'Allow hints during a drill' },
      h('input', { type: 'checkbox', checked: sset.hints || null, onchange: e => store.setSetting('hints', e.target.checked) }),
      h('span', 'hints')),
    h('label.toggle', { title: 'Countdown timer on Rapid Fire and Exam' },
      h('input', { type: 'checkbox', checked: sset.timed || null, onchange: e => store.setSetting('timed', e.target.checked) }),
      h('span', 'timer')),
  ));

  // ---- curriculum
  wrap.appendChild(h('div.sechead',
    h('h2', 'Curriculum'),
    h('div.line'),
    h('button.act', { onclick: () => wrap.querySelectorAll('.unit').forEach(u => u.classList.toggle('open')) }, 'expand all'),
  ));

  for (const u of UNITS) {
    const skills = liveSkillsOf(u.key);
    const m = store.mastery(skills);
    const due = store.dueCount(skills);
    const box = h('section.unit');
    const head = h('div.unit-head', { onclick: () => box.classList.toggle('open') },
      h('span.n', u.n),
      h('h3', u.name),
      OFF_SYLLABUS[u.key] && h('span.offtag', { title: OFF_SYLLABUS[u.key] }, 'not on your syllabus'),
      LIGHT_COVERAGE[u.key] && h('span.offtag.light', { title: LIGHT_COVERAGE[u.key] }, 'lightly covered'),
      due > 0 && h('span.stat-chip.hot', h('b', String(due)), h('span', 'due')),
      h('div.meter', h('i', { style: { width: `${Math.round(m * 100)}%` } })),
      h('span.pct', `${Math.round(m * 100)}%`),
      h('span.chev', '▸'),
    );
    const body = h('div.unit-body');
    body.appendChild(h('p.dim', { style: { fontSize: '13px', margin: '10px 8px 12px' } }, u.blurb));
    if (OFF_SYLLABUS[u.key] || LIGHT_COVERAGE[u.key]) {
      body.appendChild(h('p.dimmer', { style: { fontSize: '12.5px', margin: '-6px 8px 12px' } },
        OFF_SYLLABUS[u.key] || LIGHT_COVERAGE[u.key]));
    }
    body.appendChild(h('div.row', { style: { margin: '0 8px 10px' } },
      h('button.btn.sm', { onclick: e => { e.stopPropagation(); nav({ v: 'drill', mode: 'unit', scope: u.key }); } },
        `Drill all of ${u.name} →`),
      h('button.btn.sm.ghost', { onclick: e => { e.stopPropagation(); nav({ v: 'formulas', unit: u.key }); } }, 'formulas'),
    ));
    for (const s of skills) {
      const rec = store.state().skills[s];
      const lvl = rec ? rec.level : 0;
      const isDue = rec && rec.seen > 0 && Date.now() >= rec.due;
      const c = countsFor(s);
      body.appendChild(h('div.topicrow',
        h('div.dots', ...Array.from({ length: store.MAX_LEVEL }, (_, i) =>
          h('span.dot' + (i < lvl ? (isDue ? '.due' : '.on') : '')))),
        h('span.name', { onclick: () => nav({ v: 'drill', mode: 'topic', scope: s }) }, topicOfSkill(s)),
        rec && rec.seen > 0
          ? h('span.tag', `${pct(rec.right, rec.seen)}% of ${rec.seen}`)
          : h('span.tag', c.gens ? 'unlimited' : `${c.static} written`),
        h('button.mini', { title: 'Topic primer', onclick: e => { e.stopPropagation(); nav({ v: 'primer', scope: s }); } }, 'primer'),
        h('button.mini.go2', { onclick: () => nav({ v: 'drill', mode: 'topic', scope: s }) }, 'drill →'),
      ));
    }
    box.appendChild(head); box.appendChild(body);
    if (m > 0 && m < 1) box.classList.add('open');
    wrap.appendChild(box);
  }

  if (st.totals.answered > 0) {
    wrap.appendChild(h('div.sechead', h('h2', 'Lifetime'), h('div.line')));
    wrap.appendChild(h('div.statgrid',
      statbox(String(st.totals.answered), 'answered'),
      statbox(pct(st.totals.right, st.totals.answered) + '%', 'accuracy'),
      statbox(String(st.totals.best), 'best streak'),
      statbox(Math.round(st.totals.secs / 60) + 'm', 'time drilled'),
      statbox(`${Math.round(store.mastery(LIVE_SKILLS) * 100)}%`, 'course mastery'),
    ));
  }

  return wrap;
}

function pillGroup(items, label) {
  return h('div.pillgroup', { title: label },
    ...items.map(it => h('button.pill' + (it.on ? '.on' : ''), { onclick: it.fn }, it.label)));
}

export function fmtDay(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function statbox(v, l) { return h('div.statbox', h('div.v', v), h('div.l', l)); }

function svgRule() {
  return h('div.rule', {
    html: `<svg viewBox="0 0 190 120" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path d="M4 108 C 40 108, 55 20, 95 20 S 150 92, 186 92" stroke="var(--lime)" stroke-width="2" opacity=".85"/>
      <path d="M4 108 L186 108" stroke="var(--ink-3)" stroke-width="1"/>
      ${[20, 45, 70, 95, 120, 145].map(x => {
      const y = 108 - Math.max(0, 88 * Math.exp(-((x - 95) ** 2) / 2400));
      return `<rect x="${x}" y="${y}" width="24" height="${108 - y}" fill="var(--cyan)" opacity=".16" stroke="var(--cyan)" stroke-width=".8"/>`;
    }).join('')}
    </svg>`,
  });
}

// ---------------------------------------------------------------
// topic primer
// ---------------------------------------------------------------
export function primer(skillKey, onDrill) {
  const pr = primerFor(skillKey);
  const wrap = h('div.wrap.narrow');
  const unit = UNIT_BY_KEY[unitOfSkill(skillKey)];
  wrap.appendChild(h('section.hero',
    h('div.eyebrow', `${unit ? unit.name : ''} · primer`),
    h('h1', topicOfSkill(skillKey)),
  ));
  if (!pr) {
    wrap.appendChild(h('p.dim', 'No primer written for this topic yet.'));
  } else {
    wrap.appendChild(h('div.panel',
      h('div.eyebrow', 'The idea'),
      h('div', { style: { fontSize: '16px', lineHeight: 1.6 }, html: tex(pr.idea) })));
    wrap.appendChild(h('div.panel',
      h('div.eyebrow', 'The moves'),
      h('ul.movelist', ...pr.moves.map(m => h('li', { html: tex(m) })))));
    wrap.appendChild(h('div.panel.recall',
      h('div.eyebrow', 'Where it goes wrong'),
      h('div', { html: tex(pr.watch) })));
  }
  const note = store.noteFor(skillKey);
  const ta = h('textarea.notes', { placeholder: 'Your notes on this topic — saved automatically…', rows: 4 });
  ta.value = note;
  ta.addEventListener('input', () => store.setNote(skillKey, ta.value));
  wrap.appendChild(h('div.panel', h('div.eyebrow', 'Your notes'), ta));

  wrap.appendChild(h('div.row', { style: { marginTop: '20px' } },
    h('button.btn.primary', { onclick: onDrill }, 'Drill this topic  →'),
    h('button.btn.ghost', { onclick: () => nav({ v: 'home' }) }, 'Back'),
  ));
  return wrap;
}

// ---------------------------------------------------------------
// drill
// ---------------------------------------------------------------
export function drill(S, handlers) {
  const root = h('div.drill');
  const p = S.current;
  const cfg = S.cfg;

  const done = S.results.length;
  const total = S.queue.length;
  const starred = store.isStarred(p.ref);

  root.appendChild(h('div.hud',
    h('span.topictag', { title: 'Open the primer for this topic', onclick: () => nav({ v: 'primer', scope: p.skill }) }, topicOfSkill(p.skill)),
    h('span.qcount', `${Math.min(done + 1, total)} / ${total}`),
    h('span.diffdot', { title: `difficulty ${p.diff || 2} of 3` }, '●'.repeat(p.diff || 2)),
    h('span.flex'),
    cfg.defer && h('span.qcount', 'feedback withheld until the end'),
    h('button.iconbtn.star' + (starred ? '.on' : ''), {
      title: 'Star this problem  (S)', onclick: handlers.star,
    }, starred ? '★' : '☆'),
    !cfg.defer && h('div.streakbox' + (S.run ? '' : '.zero'), S.run ? '🔥' : '○', `${S.run} in a row`),
    h('button.btn.sm.ghost', { onclick: handlers.quit }, 'end'),
  ));

  root.appendChild(h('div.progressline', h('i', { style: { width: `${(done / total) * 100}%` } })));
  const timer = h('div.timerline', h('i', { style: { width: '100%' } }));
  if (cfg.timed) root.appendChild(timer);

  const card = h('div.card');
  if (p.src) card.appendChild(h('div.srctag', p.src));
  card.appendChild(h('div.qtext', { html: tex(p.prompt) }));
  if (p.sub) card.appendChild(h('div.qsub', { html: tex(p.sub) }));

  const hintBox = h('div#hintbox');
  card.appendChild(hintBox);

  const choices = h('div.choices');
  p.choices.forEach((c, i) => {
    choices.appendChild(h('button.choice', {
      'data-i': i, onclick: () => handlers.answer(i),
      style: { animationDelay: `${i * 40}ms` },
    },
      h('span.key', KEYCAPS[i]),
      h('span.body', { html: tex(c.t) }),
    ));
  });
  card.appendChild(choices);

  // ---- the fifth option: write your own answer
  const mathy = isCheckable(p.choices);
  const entry = h('input.ownfield', {
    type: 'text', spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off',
    placeholder: mathy ? 'type your own answer…' : 'type your own answer in words…',
  });
  const entryMsg = h('div.ownmsg');
  const preview = h('div.ownpreview');

  /** Insert a snippet at the caret. `%s` marks where the caret ends up, and
   *  wraps the current selection if there is one. */
  const put = snippet => {
    const a = entry.selectionStart ?? entry.value.length;
    const b = entry.selectionEnd ?? a;
    const sel = entry.value.slice(a, b);
    const text = snippet.replace('%s', sel);
    entry.value = entry.value.slice(0, a) + text + entry.value.slice(b);
    const rel = snippet.indexOf('%s');
    const caret = rel < 0 ? a + text.length : a + rel + sel.length;
    entry.focus();
    entry.setSelectionRange(caret, caret);
    refresh();
  };

  const PALETTE = [
    ['x²', '^2'], ['xⁿ', '^(%s)'], ['√', 'sqrt(%s)'], ['a⁄b', '/'],
    ['( )', '(%s)'], ['|x|', 'abs(%s)'],
    ['π', 'pi'], ['θ', 'theta'], ['eˣ', 'e^(%s)'], ['ln', 'ln(%s)'],
    ['sin', 'sin(%s)'], ['cos', 'cos(%s)'], ['tan', 'tan(%s)'],
    ['tan⁻¹', 'tan^-1(%s)'], ['+C', ' + C'],
  ];
  const pal = h('div.ownpal', ...PALETTE.map(([label, snip]) =>
    h('button.palbtn', { type: 'button', tabindex: '-1', title: snip.replace('%s', '…'), onclick: () => put(snip) }, label)));

  function refresh() {
    if (!mathy) { clear(preview); entry.classList.remove('ok', 'bad'); return; }
    const r = previewInput(entry.value);
    const box = clear(preview);
    if (!entry.value.trim()) { entry.classList.remove('ok', 'bad'); return; }
    if (r.ok) {
      entry.classList.add('ok'); entry.classList.remove('bad');
      box.appendChild(h('span.prevlabel', 'reads as'));
      box.appendChild(h('span.prevmath', { html: tex('$' + r.tex + '$') }));
    } else {
      entry.classList.add('bad'); entry.classList.remove('ok');
      box.appendChild(h('span.prevlabel.bad', 'not readable yet'));
      if (r.error) box.appendChild(h('span.preverr', r.error));
    }
  }

  const own = h('div.choice.own',
    h('span.key', String(p.choices.length + 1)),
    h('span.body',
      mathy ? pal : null,
      h('div.ownrow', entry, h('button.btn.sm.primary', { onclick: () => handlers.submitOwn(entry.value) }, 'Check')),
      preview,
      entryMsg,
      mathy ? h('details.ownhelp',
        h('summary', 'how to type it'),
        h('div', { html: tex('Use `^` for powers, `/` for fractions, and brackets freely. '
          + '`sqrt(x)`, `ln(x)`, `abs(x)`, `pi`, `theta` and `tan^-1(x)` all work, and so does '
          + 'pasting the LaTeX from an option above. Implicit multiplication is fine: `2x`, '
          + '`3sin(x)`, `x(x+1)`. **Any algebraically equivalent form is accepted** — it checks '
          + 'the maths, not the spelling.') })) : null,
    ));

  entry.addEventListener('input', refresh);
  entry.addEventListener('keydown', e => {
    e.stopPropagation();                       // digits here are text, not answers
    if (e.key === 'Enter') { e.preventDefault(); handlers.submitOwn(entry.value); }
    if (e.key === 'Escape') { e.preventDefault(); entry.blur(); }
  });
  // A true/false question has nothing to write in — typing "true" is strictly
  // worse than pressing 1, and an empty box invites a wasted keystroke.
  if (!p.tf) card.appendChild(own);

  root.appendChild(card);

  const fb = h('div#feedback');
  root.appendChild(fb);

  const hintsOn = store.settings().hints && !cfg.defer;
  root.appendChild(h('div.footbar',
    h('span.hintk', { html: `<b>1–${p.choices.length}</b> answer&nbsp; ·&nbsp; `
      + (p.tf ? '' : `<b>${p.choices.length + 1}</b> write your own&nbsp; ·&nbsp; `)
      + `<b>Enter</b> continue&nbsp; ·&nbsp; <b>C</b> cheat sheet&nbsp; ·&nbsp; <b>S</b> star` }),
    h('span.flex'),
    hintsOn && h('button.btn.sm', { id: 'hintbtn', onclick: handlers.hint }, 'Hint  (H)'),
    h('span.hintk', { html: `<b>${cfg.name}</b>` }),
  ));

  return { root, choices, fb, timer, card, hintBox, entry, entryMsg, own };
}

/** Inline message under the write-in box (bad syntax, not gradeable, …). */
export function ownNote(view, msg, kind = 'warn') {
  const box = clear(view.entryMsg);
  if (!msg) return;
  box.className = 'ownmsg ' + kind;
  // code samples travel as `backticks`; tex() turns them into <code> after
  // escaping, so raw markup in a message can never reach the DOM
  box.innerHTML = tex(msg);
}

/** Progressive hint: the problem's own hint, else its first solution step. */
/**
 * The hint ladder: general orientation first, concrete moves last, so a stuck
 * student gets un-stuck without being handed the answer on hint 1.
 * A problem can set `hints: [...]` to override; otherwise one is derived.
 */
export function hintLadder(p) {
  if (p.hints && p.hints.length) return p.hints;
  const out = [];
  if (p.hint) out.push(p.hint);                       // the nudge: what to notice
  if (p.recall) out.push(p.recall);                   // the rule that applies
  for (const s of (p.steps || []).slice(0, 2)) out.push(s);   // the first two moves
  return out.length ? out
    : ['Rule options out one at a time. For each, ask which specific step it would have taken — the wrong ones usually break a rule you already know.'];
}

const HINT_LABEL = ['Start here', 'The rule', 'First move', 'Next move', 'Keep going'];

export function showHint(view, p, level) {
  const box = clear(view.hintBox);
  const bits = hintLadder(p);
  const shown = bits.slice(0, Math.max(1, Math.min(level, bits.length)));
  box.appendChild(h('div.hintpanel',
    h('div.eyebrow', level >= bits.length ? `Hint ${bits.length} of ${bits.length} — that is all of it`
      : `Hint ${shown.length} of ${bits.length}`),
    ...shown.map((b, i) => h('div.hintstep',
      h('span.hintnum', HINT_LABEL[i] || `Step ${i + 1}`),
      h('span', { html: tex(b) }),
    )),
  ));
  return bits.length;
}

/** Reveal the answer: mark the choices, then build the explanation. */
export function reveal(view, p, chosenIdx, correct, handlers) {
  const typed = handlers && handlers.typed;
  if (view.entry) {
    view.entry.disabled = true;
    view.own.classList.add('locked');
    if (typed) view.own.classList.add(correct ? 'correct' : 'wrong');
    clear(view.entryMsg);
  }
  const btns = [...view.choices.querySelectorAll('.choice')];
  btns.forEach((b, i) => {
    b.classList.add('locked');
    b.disabled = true;
    if (p.choices[i].ok) {
      b.classList.add('correct');
      b.appendChild(h('span.verdict', 'correct'));
    } else if (i === chosenIdx) {
      b.classList.add('wrong');
      b.appendChild(h('span.verdict', 'your answer'));
    } else b.classList.add('faded');
  });
  if (!correct) view.card.classList.add('shake');
  flash(correct ? 'ok' : 'no');

  const fb = clear(view.fb);
  const chosen = p.choices[chosenIdx];

  fb.appendChild(h('div.verdictbar.' + (correct ? 'ok' : 'no'),
    h('span.big', correct ? '✓ Correct' : '✗ Not quite'),
    h('span.flex'),
    h('span.meta', correct ? 'locked in' : 'read the diagnosis, then continue'),
  ));

  // what they typed, and why it was accepted
  if (typed) {
    fb.appendChild(h('div.panel' + (correct ? '.recall' : '.diag'),
      h('div.eyebrow', 'Your written answer'),
      h('div.typedback.mono', typed.text),
      typed.note ? h('div.dim', { style: { fontSize: '13px', marginTop: '8px' }, html: tex(typed.note) }) : null,
      !correct && chosenIdx < 0
        ? h('div.dim', { style: { fontSize: '13px', marginTop: '8px' }, html: tex('That is not equivalent to the correct answer. Compare it with the worked solution below — the difference is usually one factor or one sign.') })
        : null,
    ));
  }

  // 1. why THIS answer was wrong — the most valuable panel
  if (!correct && chosen && chosen.why) {
    const et = store.errorTypeOf(chosen);
    fb.appendChild(h('div.panel.diag',
      h('div.eyebrow', 'Why that option is wrong',
        store.ERROR_TYPES[et] && et !== 'other' ? h('span.errtag', store.ERROR_TYPES[et].label) : null),
      h('div', { html: tex(chosen.why) }),
    ));
  } else if (!correct && chosenIdx === -1) {
    fb.appendChild(h('div.panel.diag',
      h('div.eyebrow', 'Out of time'),
      h('div', 'No answer recorded. Work through the solution below — speed comes from recognizing the pattern, not from rushing the algebra.'),
    ));
  }

  // 1b. what the right answer was and why it is right. Without this the
  // student learns only what NOT to do — they have to reverse-engineer the
  // actual reasoning out of the worked steps.
  if (!correct) {
    const key = p.choices.find(c => c.ok);
    const rationale = p.keyWhy || (p.steps.length ? p.steps[p.steps.length - 1] : null);
    if (key) {
      fb.appendChild(h('div.panel.right',
        h('div.eyebrow', 'The right answer, and why'),
        h('div.rightanswer', { html: tex(key.t) }),
        rationale ? h('div', { style: { marginTop: '8px' }, html: tex(rationale) }) : null,
        p.fix ? h('div.fixline', h('span.fixlabel', 'Next time'), h('span', { html: tex(p.fix) })) : null,
      ));
    }
  }

  // 2. the visual
  const v = buildViz(typeof p.viz === 'function' ? p.viz() : p.viz);
  if (v) {
    fb.appendChild(h('div.panel',
      h('div.eyebrow', 'Picture it'),
      h('div.vizwrap', h('div', { html: v.svg }), v.cap && h('div.vizcap', { html: tex(v.cap) })),
    ));
  }

  // 3. worked solution
  if (p.steps.length) {
    const steps = h('div.steps');
    p.steps.forEach((s, i) => steps.appendChild(h('div.step' + (i === p.steps.length - 1 ? '.key' : ''),
      h('span.num', String(i + 1)),
      h('span.txt', { html: tex(s) }),
    )));
    fb.appendChild(h('div.panel', h('div.eyebrow', 'Worked solution'), steps));
  }

  // 4. the rule to carry forward
  if (p.recall) {
    fb.appendChild(h('div.panel.recall',
      h('div.eyebrow', 'Remember this'),
      h('div', { html: tex(p.recall) }),
    ));
  }

  const next = h('div.row', { style: { marginTop: '14px' } },
    h('button.btn.primary', { onclick: handlers.next }, 'Continue  ⏎'),
    h('button.btn.sm.ghost', { onclick: () => nav({ v: 'primer', scope: p.skill }) }, 'Topic primer'),
    h('button.btn.sm.ghost', { onclick: handlers.star }, store.isStarred(p.ref) ? '★ Starred' : '☆ Star this'),
  );
  fb.appendChild(next);
  next.querySelector('button').focus({ preventScroll: true });
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------------------------------------------------------
// summary
// ---------------------------------------------------------------
export function summary(S, stats, handlers) {
  const wrap = h('div.wrap.narrow');
  const p = pct(stats.right, stats.n);
  const verdict = p >= 90 ? 'Locked in.' : p >= 75 ? 'Solid — patch the gaps.'
    : p >= 50 ? 'Getting there. Drill the misses.' : 'Rough set. That is what this is for.';

  wrap.appendChild(h('div.scorehero',
    h('div.num', `${stats.right}`),
    h('div.of', `of ${stats.n} correct  ·  ${p}%`),
    h('h2', verdict),
  ));

  if (stats.unlocked && stats.unlocked.length) {
    wrap.appendChild(h('div.achrow',
      ...stats.unlocked.map(a => h('div.achievement.new',
        h('span.trophy', '✦'),
        h('div', h('div', { style: { fontWeight: 600 } }, a.name), h('div.dimmer', { style: { fontSize: '12px' } }, a.desc)),
      ))));
  }

  wrap.appendChild(h('div.statgrid',
    statbox(`${S.bestRun}`, 'best streak'),
    statbox(`${Math.floor(stats.secs / 60)}:${String(stats.secs % 60).padStart(2, '0')}`, 'time'),
    statbox(`${stats.n ? Math.round(stats.secs / stats.n) : 0}s`, 'per question'),
    statbox(`${S.hintsUsed}`, 'hints used'),
    statbox(`${store.missed().length}`, 'in mistake bank'),
  ));

  // per-skill breakdown for this session
  const bySkill = new Map();
  for (const r of S.results) {
    const e = bySkill.get(r.skill) || { n: 0, right: 0 };
    e.n++; if (r.correct) e.right++;
    bySkill.set(r.skill, e);
  }
  const rows = [...bySkill.entries()].sort((a, b) => (a[1].right / a[1].n) - (b[1].right / b[1].n));
  wrap.appendChild(h('div.sechead', h('h2', 'By topic'), h('div.line')));
  const table = h('table',
    h('thead', h('tr', h('th', 'Topic'), h('th', 'Unit'), h('th', { style: { textAlign: 'right' } }, 'Score'))),
    h('tbody', ...rows.map(([sk, e]) => h('tr',
      h('td', h('a', {
        href: '#', style: { color: 'inherit', textDecoration: 'none' },
        onclick: ev => { ev.preventDefault(); handlers.drillTopic(sk); },
      }, topicOfSkill(sk))),
      h('td.dimmer', { style: { fontSize: '12px' } }, UNIT_BY_KEY[unitOfSkill(sk)].name),
      h('td.num', {
        style: { color: e.right === e.n ? 'var(--lime)' : e.right === 0 ? 'var(--coral)' : 'var(--ink)' },
      }, `${e.right}/${e.n}`),
    ))));
  wrap.appendChild(h('div.tablewrap', table));

  // error-pattern summary for this session
  const errs = {};
  for (const r of S.results) {
    if (r.correct) continue;
    const prob = S.seen[S.results.indexOf(r)];
    const ch = prob && prob.choices[r.chosen];
    const et = store.errorTypeOf(ch);
    errs[et] = (errs[et] || 0) + 1;
  }
  const topErrs = Object.entries(errs).filter(([k]) => k !== 'other').sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (topErrs.length) {
    wrap.appendChild(h('div.sechead', h('h2', 'Error patterns'), h('div.line')));
    wrap.appendChild(h('div.missedlist', ...topErrs.map(([k, n]) => h('div.errcard',
      h('div.row', h('span.errtag', store.ERROR_TYPES[k].label), h('span.dimmer', { style: { fontSize: '12px' } }, `×${n} this set`)),
      h('div.dim', { style: { fontSize: '13.5px', marginTop: '6px' }, html: tex(store.ERROR_TYPES[k].fix) }),
    ))));
  }

  const missedNow = S.results.filter(r => !r.correct);
  if (missedNow.length) {
    wrap.appendChild(h('div.sechead', h('h2', `Missed (${missedNow.length})`), h('div.line')));
    const list = h('div.missedlist');
    missedNow.forEach(r => list.appendChild(h('div.missed', { onclick: () => handlers.drillTopic(r.skill) },
      h('span.q', { html: tex(r.prompt) }),
      h('span.t', topicOfSkill(r.skill)),
    )));
    wrap.appendChild(list);
  }

  wrap.appendChild(h('div.row', { style: { marginTop: '26px' } },
    h('button.btn.primary', { onclick: handlers.again }, 'Run it again'),
    store.missed().length ? h('button.btn', { onclick: handlers.mistakes }, `Drill mistake bank (${store.missed().length})`) : null,
    h('button.btn.ghost', { onclick: handlers.home }, 'Home'),
  ));
  return wrap;
}

/** Exam mode: all questions reviewed at the end, in order. */
export function examReview(S, problems) {
  const wrap = h('div.wrap.narrow');
  wrap.appendChild(h('div.sechead', h('h2', 'Full review'), h('div.line')));
  problems.forEach((p, i) => {
    const res = S.results[i];
    if (!p || !res) return;
    const box = h('div.panel', { style: { borderLeft: `3px solid var(--${res.correct ? 'lime' : 'coral'})` } });
    box.appendChild(h('div.eyebrow', `${i + 1} · ${topicOfSkill(p.skill)} · ${res.correct ? 'correct' : 'missed'}`));
    box.appendChild(h('div', { html: tex(p.prompt), style: { marginBottom: '10px' } }));
    const yours = p.choices[res.chosen];
    if (!res.correct) {
      box.appendChild(h('div.dim', { style: { fontSize: '13.5px', marginBottom: '8px' }, html: `You chose: ${tex(yours ? yours.t : '(no answer)')}` }));
      const key = p.choices.find(c => c.ok);
      box.appendChild(h('div', { style: { fontSize: '13.5px', marginBottom: '10px' }, html: `Correct: ${tex(key.t)}` }));
      if (yours && yours.why) box.appendChild(h('div.panel.diag', { style: { margin: '0 0 10px' }, html: tex(yours.why) }));
      const v = buildViz(typeof p.viz === 'function' ? p.viz() : p.viz);
      if (v) box.appendChild(h('div.vizwrap', h('div', { html: v.svg }), v.cap && h('div.vizcap', { html: tex(v.cap) })));
      if (p.recall) box.appendChild(h('div.panel.recall', { style: { margin: '10px 0 0' }, html: tex(p.recall) }));
    }
    wrap.appendChild(box);
  });
  return wrap;
}

// ---------------------------------------------------------------
export function empty(msg, action) {
  return h('div.wrap.narrow', h('div.empty',
    h('div.glyph', '∅'), h('p', msg),
    action && h('button.btn.primary', { style: { marginTop: '14px' }, onclick: action.fn }, action.label)));
}
