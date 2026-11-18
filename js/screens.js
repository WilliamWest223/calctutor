// ---------------------------------------------------------------
// screens.js — progress analytics, reference sheet, interactive
// labs, study plan, printable worksheets, help & search overlays.
// ---------------------------------------------------------------
import { h, tex, texOnly, clear, pct, plural, toast, rand } from './util.js';
import { UNITS, UNIT_BY_KEY, liveSkillsOf, LIVE_SKILLS, topicOfSkill, unitOfSkill, candidates, materialize } from './bank/index.js';
import { FORMULAS, searchFormulas } from './bank/formulas.js';
import { PRIMERS } from './bank/primers.js';
import { EXPLORERS, explorerById, initialState } from './explore.js';
import { COURSE, SCHEDULE, EXAMS, GATEWAYS, courseToday, nextAssessment, coveredSkills } from './bank/course.js';
import { LESSONS, lessonById, byWeek } from './bank/lessons.js';
import * as store from './store.js';
import { MODES } from './session.js';
import { statbox } from './ui.js';
import { examOfLesson } from './lessonmap.js';

let nav = () => {};
export function setNav(fn) { nav = fn; }

// ===============================================================
// PROGRESS
// ===============================================================
export function progress() {
  const st = store.state();
  const wrap = h('div.wrap');
  wrap.appendChild(h('section.hero',
    h('div.eyebrow', 'Progress'),
    h('h1', 'Where you actually stand'),
    h('p', 'Mastery rises with correct answers and decays when a skill goes untouched. Amber means it is due for review.'),
  ));

  // ---- heatmap
  wrap.appendChild(h('div.sechead', h('h2', 'Practice history'), h('div.line'),
    h('span.dimmer', { style: { fontSize: '12px' } }, `best streak: ${plural(st.day.best || 0, 'day')}`)));
  wrap.appendChild(heatmap(st.activity));

  // ---- error patterns
  const errs = Object.entries(st.errors || {}).filter(([k, n]) => n > 0 && k !== 'other')
    .sort((a, b) => b[1] - a[1]);
  if (errs.length) {
    const total = errs.reduce((a, [, n]) => a + n, 0);
    wrap.appendChild(h('div.sechead', h('h2', 'Your error patterns'), h('div.line'),
      h('span.dimmer', { style: { fontSize: '12px' } }, `${total} diagnosed misses`)));
    wrap.appendChild(h('div.errgrid', ...errs.slice(0, 6).map(([k, n]) => {
      const info = store.ERROR_TYPES[k];
      const share = Math.round((n / total) * 100);
      return h('div.errcard',
        h('div.row', h('span.errtag', info.label), h('span.flex'), h('span.mono.dimmer', { style: { fontSize: '12px' } }, `${n} · ${share}%`)),
        h('div.errbar', h('i', { style: { width: `${share}%` } })),
        h('div.dim', { style: { fontSize: '13px', marginTop: '8px' }, html: tex(info.fix) }),
      );
    })));
  }

  // ---- achievements
  wrap.appendChild(h('div.sechead', h('h2', 'Achievements'), h('div.line'),
    h('span.dimmer', { style: { fontSize: '12px' } }, `${st.achievements.length} / ${store.ACHIEVEMENTS.length}`)));
  wrap.appendChild(h('div.achgrid', ...store.ACHIEVEMENTS.map(a => {
    const got = st.achievements.includes(a.id);
    return h('div.achievement' + (got ? '.got' : '.locked'),
      h('span.trophy', got ? '✦' : '·'),
      h('div', h('div', { style: { fontWeight: 600 } }, a.name), h('div.dimmer', { style: { fontSize: '12px' } }, a.desc)));
  })));

  // ---- weakest
  const weak = LIVE_SKILLS
    .map(s => ({ s, r: st.skills[s] }))
    .filter(x => x.r && x.r.seen >= 2)
    .sort((a, b) => (a.r.right / a.r.seen) - (b.r.right / b.r.seen))
    .slice(0, 6);

  if (weak.length) {
    wrap.appendChild(h('div.sechead', h('h2', 'Weakest skills'), h('div.line'),
      h('button.act', { onclick: () => nav({ v: 'drill', mode: 'cram' }) }, 'cram these →')));
    const list = h('div.missedlist');
    weak.forEach(({ s, r }) => list.appendChild(h('div.missed', {
      style: { borderLeftColor: r.right / r.seen > 0.6 ? 'var(--amber)' : 'var(--coral)' },
      onclick: () => nav({ v: 'drill', mode: 'topic', scope: s }),
    },
      h('span.q', topicOfSkill(s)),
      h('span.t', `${pct(r.right, r.seen)}% · level ${r.level}/${store.MAX_LEVEL}`),
    )));
    wrap.appendChild(list);
  }

  // ---- all skills
  wrap.appendChild(h('div.sechead', h('h2', 'All skills'), h('div.line')));
  const rows = [];
  for (const u of UNITS) {
    for (const s of liveSkillsOf(u.key)) {
      const r = st.skills[s];
      const isDue = r && r.seen > 0 && Date.now() >= r.due;
      const avg = r && r.seen ? Math.round(r.ms / r.seen / 100) / 10 : null;
      rows.push(h('tr',
        h('td', h('a', {
          href: '#', style: { color: 'inherit', textDecoration: 'none' },
          onclick: e => { e.preventDefault(); nav({ v: 'drill', mode: 'topic', scope: s }); },
        }, topicOfSkill(s))),
        h('td.dimmer', { style: { fontSize: '12px' } }, u.name),
        h('td', h('div.dots', ...Array.from({ length: store.MAX_LEVEL }, (_, i) =>
          h('span.dot' + (i < (r ? r.level : 0) ? (isDue ? '.due' : '.on') : ''))))),
        h('td.num', r ? `${r.right}/${r.seen}` : '—'),
        h('td.num.dimmer', { style: { fontSize: '12px' } }, avg != null ? `${avg}s` : '—'),
        h('td.num.dimmer', { style: { fontSize: '12px' } },
          r && r.seen ? (isDue ? 'due now' : relDays(r.due)) : 'new'),
      ));
    }
  }
  wrap.appendChild(h('div.tablewrap', h('table',
    h('thead', h('tr', h('th', 'Topic'), h('th', 'Unit'), h('th', 'Mastery'),
      h('th', { style: { textAlign: 'right' } }, 'Record'),
      h('th', { style: { textAlign: 'right' } }, 'Avg'),
      h('th', { style: { textAlign: 'right' } }, 'Next review'))),
    h('tbody', ...rows))));

  if (st.history.length) {
    wrap.appendChild(h('div.sechead', h('h2', 'Recent sessions'), h('div.line')));
    wrap.appendChild(h('div.tablewrap', h('table',
      h('thead', h('tr', h('th', 'When'), h('th', 'Mode'),
        h('th', { style: { textAlign: 'right' } }, 'Score'), h('th', { style: { textAlign: 'right' } }, 'Time'))),
      h('tbody', ...st.history.slice(0, 12).map(s => h('tr',
        h('td.dimmer', { style: { fontSize: '12.5px' } }, when(s.ts)),
        h('td', MODES[s.mode] ? MODES[s.mode].name : s.mode),
        h('td.num', { style: { color: s.n && s.right / s.n >= 0.8 ? 'var(--lime)' : 'inherit' } }, `${s.right}/${s.n}`),
        h('td.num.dimmer', `${Math.floor(s.secs / 60)}:${String(s.secs % 60).padStart(2, '0')}`),
      ))))));
  }

  wrap.appendChild(h('div.sechead', h('h2', 'Data'), h('div.line')));
  wrap.appendChild(h('div.row',
    h('button.btn.sm', {
      onclick: () => {
        const blob = new Blob([store.exportJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `calctutor-progress-${new Date().toISOString().slice(0, 10)}.json`;
        a.click(); URL.revokeObjectURL(a.href);
        toast('Progress exported');
      },
    }, 'Export progress'),
    h('button.btn.sm', {
      onclick: () => {
        const inp = h('input', { type: 'file', accept: '.json', style: { display: 'none' } });
        inp.addEventListener('change', () => {
          const f = inp.files[0]; if (!f) return;
          f.text().then(t => { store.importJSON(t); toast('Progress imported'); nav({ v: 'progress' }); })
            .catch(e => toast('Import failed: ' + e.message, 3000));
        });
        document.body.appendChild(inp); inp.click(); inp.remove();
      },
    }, 'Import'),
    h('button.btn.sm.ghost', {
      onclick: () => {
        if (confirm('Erase all progress, mastery levels, stars and the mistake bank? This cannot be undone.')) {
          store.resetAll(); toast('Progress reset'); nav({ v: 'home' });
        }
      },
    }, 'Reset everything'),
  ));

  return wrap;
}

function heatmap(activity) {
  const weeks = 18;
  const today = new Date();
  const cells = [];
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  // align to Sunday
  start.setDate(start.getDate() - start.getDay());
  let max = 1;
  for (const v of Object.values(activity)) max = Math.max(max, v);

  const cols = [];
  for (let w = 0; w < weeks + 1; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      if (day > today) { col.push(h('span.hcell.future')); continue; }
      const key = day.toISOString().slice(0, 10);
      const n = activity[key] || 0;
      const lvl = n === 0 ? 0 : n < max * 0.25 ? 1 : n < max * 0.5 ? 2 : n < max * 0.8 ? 3 : 4;
      col.push(h(`span.hcell.l${lvl}`, { title: `${key}: ${plural(n, 'question')}` }));
    }
    cols.push(h('div.hcol', ...col));
  }
  cells.push(h('div.heatmap', ...cols));
  cells.push(h('div.row', { style: { marginTop: '8px', fontSize: '11px', gap: '6px' } },
    h('span.dimmer', 'less'),
    ...[0, 1, 2, 3, 4].map(l => h(`span.hcell.l${l}`)),
    h('span.dimmer', 'more')));
  return h('div.panel', ...cells);
}

// ===============================================================
// STUDY PLAN / EXAM COUNTDOWN
// ===============================================================
export function plan() {
  const wrap = h('div.wrap.narrow');
  const ex = store.exam();
  const na = nextAssessment();
  const ct = courseToday();
  // the real course exam wins; the manual date is a fallback for anything else
  const days = na ? na.days : store.daysToExam();
  const label = na ? na.name : (ex.name || 'your exam');

  wrap.appendChild(h('section.hero',
    h('div.eyebrow', `${COURSE.code} · ${COURSE.term}`),
    h('h1', days == null ? 'Study plan' : days === 0 ? `${label} is today` : `${plural(days, 'day')} to ${label}`),
    h('p', `Dates come straight from Dr. McWhorter's syllabus. The daily topics are ordered by what you are actually weakest at.`),
  ));

  // ---- where the course is right now
  wrap.appendChild(h('div.panel',
    h('div.eyebrow', 'Right now'),
    h('div.calrow' + (ct.last ? '' : '.is-off'),
      h('span.cdate', ct.last ? fmtD(ct.last.d) : '—'),
      h('span.ctopic', ct.last ? `Last class: ${ct.last.t}` : 'Term has not started')),
    ct.next && h('div.calrow.is-today',
      h('span.cdate', fmtD(ct.next.d)),
      h('span.ctopic', `Next class: ${ct.next.t}`),
      (ct.next.skills || []).length ? h('button.btn.sm', {
        onclick: () => nav({ v: 'drill', mode: 'custom', skills: ct.next.skills }),
      }, 'Pre-drill it') : null),
    na && h('div.calrow.' + (na.kind === 'exam' ? 'is-exam' : 'is-gateway'),
      h('span.cdate', fmtD(na.date)),
      h('span.ctopic', `${na.name} — ${plural(na.days, 'day')} away`),
      h('button.btn.sm', {
        onclick: () => nav({ v: 'drill', mode: na.kind === 'exam' ? 'examscope' : 'gateway', scope: na.id }),
      }, 'Practise')),
  ));

  // ---- what each exam actually covers
  wrap.appendChild(h('div.sechead', h('h2', 'What each assessment covers'), h('div.line')));
  for (const e of [...EXAMS].sort((a, b) => a.date.localeCompare(b.date))) {
    const box = h('div.panel');
    box.appendChild(h('div.row',
      h('div.eyebrow', `${e.name} · ${fmtD(e.date)}`),
      h('span.flex'),
      h('button.btn.sm', { onclick: () => nav({ v: 'drill', mode: 'examscope', scope: e.id }) }, 'Practise this →')));
    box.appendChild(h('div', { style: { fontSize: '13.5px', margin: '8px 0' } }, e.blurb));
    box.appendChild(h('div.dim', { style: { fontSize: '12.5px', marginBottom: '10px' }, html: tex(e.note) }));
    box.appendChild(h('div.planitems', ...e.skills.filter(s => LIVE_SKILLS.includes(s)).map(sk =>
      h('span.planchip', { onclick: () => nav({ v: 'drill', mode: 'topic', scope: sk }) }, topicOfSkill(sk)))));
    wrap.appendChild(box);
  }
  for (const g of GATEWAYS) {
    const box = h('div.panel', { style: { borderLeft: '3px solid var(--violet)' } });
    box.appendChild(h('div.row',
      h('div.eyebrow', `${g.name}${g.date ? ' · ' + fmtD(g.date) : ''}`),
      h('span.flex'),
      h('button.btn.sm', { onclick: () => nav({ v: 'drill', mode: 'gateway', scope: g.id }) }, 'Practise this →')));
    box.appendChild(h('div', { style: { fontSize: '13.5px', margin: '8px 0' } }, g.blurb));
    box.appendChild(h('div.dim', { style: { fontSize: '12.5px' }, html: tex(g.note) }));
    wrap.appendChild(box);
  }

  // ---- full lecture calendar
  wrap.appendChild(h('div.sechead', h('h2', 'Lecture calendar'), h('div.line'),
    h('span.dimmer', { style: { fontSize: '12px' } }, 'from the syllabus')));
  const todayKey = new Date().toISOString().slice(0, 10);
  const cal = h('div.panel', { style: { padding: '4px 0' } });
  for (const d of SCHEDULE) {
    const cls = ['calrow'];
    if (d.kind === 'exam') cls.push('is-exam');
    if (d.kind === 'gateway') cls.push('is-gateway');
    if (d.kind === 'off') cls.push('is-off');
    if (d.d < todayKey) cls.push('is-past');
    if (d.d === todayKey) cls.push('is-today');
    cal.appendChild(h('div.' + cls.join('.'),
      h('span.cdate', fmtD(d.d)),
      h('span.ctopic', d.t),
      (d.skills || []).length ? h('button.mini.go2', {
        onclick: () => nav({ v: 'drill', mode: 'custom', skills: d.skills }),
      }, 'drill') : null));
  }
  wrap.appendChild(cal);

  wrap.appendChild(h('div.sechead', h('h2', 'Your own schedule'), h('div.line')));

  const dateIn = h('input', { type: 'date', value: ex.date || '' });
  const nameIn = h('input', { type: 'text', placeholder: 'Exam 2, Final, …', value: ex.name || '' });
  wrap.appendChild(h('div.panel',
    h('div.eyebrow', 'Exam'),
    h('div.formrow', h('label', 'Date'), dateIn),
    h('div.formrow', h('label', 'Name'), nameIn),
    h('div.row', { style: { marginTop: '12px' } },
      h('button.btn.primary.sm', {
        onclick: () => { store.setExam(dateIn.value, nameIn.value); toast('Exam saved'); nav({ v: 'plan' }); },
      }, 'Save'),
      ex.date && h('button.btn.sm.ghost', {
        onclick: () => { store.setExam(null, ''); toast('Exam cleared'); nav({ v: 'plan' }); },
      }, 'Clear'),
    )));

  // ---- the plan itself
  const ranked = LIVE_SKILLS
    .map(s => ({ s, w: store.weight(s), rec: store.state().skills[s] }))
    .sort((a, b) => b.w - a.w);
  const shaky = ranked.filter(x => !x.rec || x.rec.level < 4);

  if (days != null && days >= 0) {
    const workDays = Math.max(1, Math.min(days, 21));
    const perDay = Math.max(2, Math.ceil(shaky.length / workDays));
    wrap.appendChild(h('div.sechead', h('h2', 'Suggested schedule'), h('div.line')));
    wrap.appendChild(h('p.dim', { style: { fontSize: '13.5px', marginTop: '-4px' } },
      `${plural(shaky.length, 'topic')} still below full mastery. At ${perDay} topics a day that is ${plural(Math.ceil(shaky.length / perDay), 'day')} of new ground, leaving the rest for review.`));

    const list = h('div.planlist');
    for (let d = 0; d < Math.min(workDays, Math.ceil(shaky.length / perDay)); d++) {
      const chunk = shaky.slice(d * perDay, (d + 1) * perDay);
      if (!chunk.length) break;
      const date = new Date(); date.setDate(date.getDate() + d);
      list.appendChild(h('div.planday',
        h('div.planhead',
          h('span.mono', d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })),
          h('span.flex'),
          h('button.btn.sm', {
            onclick: () => nav({ v: 'drill', mode: 'custom', skills: chunk.map(c => c.s) }),
          }, 'Drill this day')),
        h('div.planitems', ...chunk.map(c => h('span.planchip', {
          onclick: () => nav({ v: 'drill', mode: 'topic', scope: c.s }),
        }, topicOfSkill(c.s)))),
      ));
    }
    wrap.appendChild(list);

    wrap.appendChild(h('div.panel.recall', { style: { marginTop: '16px' } },
      h('div.eyebrow', 'Also, every day'),
      h('div', { html: tex('Clear the **Mistake Bank** and run one **Cumulative Review** set. Spaced repetition only works if you actually show up for the reviews it schedules.') })));
  } else {
    wrap.appendChild(h('div.sechead', h('h2', 'Priority order'), h('div.line')));
    wrap.appendChild(h('div.planlist', h('div.planday',
      h('div.planitems', ...shaky.slice(0, 12).map(c => h('span.planchip', {
        onclick: () => nav({ v: 'drill', mode: 'topic', scope: c.s }),
      }, topicOfSkill(c.s)))))));
  }

  return wrap;
}

// ===============================================================
// FORMULA SHEET
// ===============================================================
export function formulas(activeUnit) {
  const wrap = h('div.wrap');
  wrap.appendChild(h('section.hero',
    h('div.eyebrow', 'Reference'),
    h('h1', 'Formula sheet'),
    h('p', 'Everything the course leans on, grouped the way the curriculum is. Search it, or print it for the night before.'),
  ));

  const results = h('div#fsresults');
  const search = h('input.searchbox', { type: 'search', placeholder: 'Search formulas — "washer", "ratio test", "half angle"…' });

  const unitFilter = h('div.pillset',
    h('button.pill' + (!activeUnit ? '.on' : ''), { onclick: () => nav({ v: 'formulas' }) }, 'all units'),
    ...UNITS.map(u => h('button.pill' + (activeUnit === u.key ? '.on' : ''), {
      onclick: () => nav({ v: 'formulas', unit: u.key }),
    }, u.name)));

  function render(q) {
    clear(results);
    if (q && q.trim()) {
      const hits = searchFormulas(q);
      results.appendChild(h('div.eyebrow', { style: { marginBottom: '10px' } }, `${plural(hits.length, 'match')}`));
      if (!hits.length) results.appendChild(h('p.dim', 'Nothing matched. Try a shorter word.'));
      hits.forEach(it => results.appendChild(formulaRow(it, true)));
      return;
    }
    const groups = FORMULAS.filter(g => !activeUnit || g.unit === activeUnit);
    for (const g of groups) {
      results.appendChild(h('div.sechead',
        h('h2', g.group),
        h('div.line'),
        h('button.act', { onclick: () => nav({ v: 'drill', mode: 'unit', scope: g.unit }) }, `drill ${UNIT_BY_KEY[g.unit].name} →`)));
      const box = h('div.flist');
      g.items.forEach(it => box.appendChild(formulaRow(it)));
      results.appendChild(box);
    }
  }

  search.addEventListener('input', () => render(search.value));
  wrap.appendChild(h('div.row', { style: { marginBottom: '14px' } },
    search,
    h('button.btn.sm', { onclick: () => window.print() }, 'Print'),
  ));
  wrap.appendChild(unitFilter);
  wrap.appendChild(results);
  render('');
  return wrap;
}

function formulaRow(it, showGroup) {
  return h('div.frow',
    h('div.fname', it.n, showGroup ? h('span.dimmer', { style: { fontWeight: 400 } }, ` · ${it.group}`) : null),
    h('div.ftex', { html: tex('$$' + it.t + '$$') }),
    it.note ? h('div.fnote', { html: tex(it.note) }) : null,
  );
}

// ===============================================================
// INTERACTIVE LABS
// ===============================================================
export function labs() {
  const wrap = h('div.wrap');
  wrap.appendChild(h('section.hero',
    h('div.eyebrow', 'Interactive'),
    h('h1', 'Labs'),
    h('p', 'Drag the sliders. These are the ideas that are much easier to feel than to read.'),
  ));
  const grid = h('div.deck');
  EXPLORERS.forEach((ex, i) => {
    const u = UNIT_BY_KEY[ex.unit];
    grid.appendChild(h('button.mode', {
      'data-accent': u ? u.accent : 'lime',
      style: { animationDelay: `${i * 50}ms` },
      onclick: () => nav({ v: 'lab', id: ex.id }),
    },
      h('span.glyph', '⌾'),
      h('h3', ex.name),
      h('p', { html: tex(ex.blurb) }),
      h('span.badge', u ? u.name : ''),
    ));
  });
  wrap.appendChild(grid);
  return wrap;
}

export function lab(id) {
  const ex = explorerById(id);
  if (!ex) return h('div.wrap.narrow', h('div.empty', h('p', 'No such lab.')));
  const wrap = h('div.wrap');
  wrap.appendChild(h('section.hero',
    h('div.eyebrow', `Lab · ${UNIT_BY_KEY[ex.unit] ? UNIT_BY_KEY[ex.unit].name : ''}`),
    h('h1', ex.name),
    h('p', { html: tex(ex.blurb) }),
  ));
  wrap.appendChild(labPanel(id));
  wrap.appendChild(h('div.row', { style: { marginTop: '18px' } },
    h('button.btn.sm', { onclick: () => nav({ v: 'drill', mode: 'unit', scope: ex.unit }) }, `Drill ${UNIT_BY_KEY[ex.unit].name} →`),
    h('button.btn.sm.ghost', { onclick: () => nav({ v: 'labs' }) }, 'All labs'),
  ));
  return wrap;
}

/** One lab renderer: controls + svg + readout + note for explorer `explorerId`.
 *  `set` overrides control defaults (unknown keys ignored). Unknown id -> null. */
export function labPanel(explorerId, set) {
  const ex = explorerById(explorerId);
  if (!ex) return null;
  const st = initialState(ex);
  for (const c of ex.controls) if (set && c.key in set) st[c.key] = set[c.key];
  const figure = h('div.vizwrap');
  const readout = h('div.readout');
  const note = h('div.vizcap');

  function draw() {
    const out = ex.render(st);
    clear(figure).appendChild(h('div', { html: out.svg }));
    clear(readout);
    out.readout.forEach(r => readout.appendChild(h('div.rocell' + (r.hot ? '.hot' : '') + (r.wide ? '.wide' : ''),
      h('div.rol', r.tex ? { html: texOnly(r.tex) } : r.label), String(r.value).includes('$') ? h('div.rov', { html: tex(String(r.value)) }) : h('div.rov', String(r.value)))));
    clear(note);
    if (out.note) note.appendChild(h('div', { html: tex(out.note) }));
  }

  const controls = h('div.controls');
  for (const c of ex.controls) {
    if (c.kind === 'pick') {
      const row = h('div.ctl',
        h('label', c.label),
        h('div.pillset', { style: { margin: 0 } }, ...c.options.map(o => {
          const t = c.tex && c.tex[o];   // optional KaTeX display label; the option VALUE (o) is unchanged
          const b = h('button.pill' + (st[c.key] === o ? '.on' : ''), { title: o, ...(t ? { html: texOnly(t) } : {}), onclick: () => {
            st[c.key] = o;
            row.querySelectorAll('.pill').forEach(p => p.classList.toggle('on', p._o === o));
            draw();
          } }, ...(t ? [] : [o]));
          b._o = o;
          return b;
        })));
      controls.appendChild(row);
    } else {
      const out = h('span.ctlval', String(st[c.key]));
      const inp = h('input.slider', {
        type: 'range', min: c.min, max: c.max, step: c.step, value: st[c.key],
      });
      inp.addEventListener('input', () => {
        st[c.key] = parseFloat(inp.value);
        out.textContent = inp.value;
        draw();
      });
      controls.appendChild(h('div.ctl', h('label', c.label, out), inp));
    }
  }
  const grid = h('div.labgrid',
    h('div.labfig', figure, note),
    h('div.labside', controls, readout),
  );
  draw();
  return grid;
}

// ===============================================================
// PRINTABLE WORKSHEET
// ===============================================================
export function worksheet(opts = {}) {
  const n = opts.n || 15;
  const skills = opts.skills && opts.skills.length ? opts.skills : LIVE_SKILLS;
  const picks = [];
  const used = new Set();
  let guard = 0;
  while (picks.length < n && guard++ < n * 40) {
    const sk = skills[Math.floor(rand() * skills.length)];
    const pool = candidates([sk]);
    if (!pool.length) continue;
    const c = pool[Math.floor(rand() * pool.length)];
    const ref = c.gen ? { gid: c.gid, seed: (rand() * 1e9) | 0 } : { id: c.id };
    const key = ref.id || `${ref.gid}#${ref.seed}`;
    if (used.has(key)) continue;
    used.add(key);
    const p = materialize(ref);
    if (p && p.choices.length >= 2) picks.push(p);
  }

  const wrap = h('div.wrap.narrow.sheet');
  wrap.appendChild(h('div.row.noprint', { style: { marginBottom: '16px' } },
    h('button.btn.primary.sm', { onclick: () => window.print() }, 'Print / Save as PDF'),
    h('button.btn.sm', { onclick: () => nav({ v: 'worksheet', n }) }, 'New set'),
    h('button.btn.sm.ghost', { onclick: () => nav({ v: 'home' }) }, 'Back'),
  ));
  wrap.appendChild(h('div.sheethead',
    h('h1', 'Calctutor practice set'),
    h('div.dimmer', { style: { fontSize: '12.5px' } },
      `${plural(picks.length, 'question')} · ${new Date().toLocaleDateString()} · name _______________`)));

  const qs = h('ol.qlist');
  picks.forEach(p => {
    qs.appendChild(h('li',
      h('div', { html: tex(p.prompt) }),
      h('div.qchoices', ...p.choices.map((c, i) =>
        h('span.qchoice', h('b', 'ABCDE'[i] + '. '), h('span', { html: tex(c.t) })))),
    ));
  });
  wrap.appendChild(qs);

  wrap.appendChild(h('div.pagebreak'));
  wrap.appendChild(h('h2', { style: { marginTop: '24px' } }, 'Answer key'));
  const key = h('ol.qlist.keylist');
  picks.forEach(p => {
    const idx = p.choices.findIndex(c => c.ok);
    key.appendChild(h('li',
      h('b', 'ABCDE'[idx]),
      h('span.dimmer', { style: { marginLeft: '8px', fontSize: '12.5px' } }, topicOfSkill(p.skill)),
      p.recall ? h('div.dim', { style: { fontSize: '12.5px', marginTop: '2px' }, html: tex(p.recall) }) : null,
    ));
  });
  wrap.appendChild(key);
  return wrap;
}

// ===============================================================
// OVERLAYS: help + search
// ===============================================================
export function helpOverlay(close) {
  const rows = [
    ['1 – 6', 'Start a mode from the home screen'],
    ['1 – 4', 'Answer the current question'],
    ['5', 'Jump to the write-your-own answer box'],
    ['Enter / Space', 'Continue after answering'],
    ['C', 'Cheat sheet — from any screen, even mid-question'],
    ['H', 'Hint (progressive)'],
    ['S', 'Star / unstar the current problem'],
    ['Esc', 'End the session / close a dialog'],
    ['P', 'Progress'],
    ['F', 'Formula sheet'],
    ['L', 'Interactive labs'],
    ['W', 'Printable worksheet'],
    ['K', 'Study plan'],
    ['/', 'Search topics & formulas'],
    ['T', 'Toggle theme'],
    ['?', 'This list'],
  ];
  return overlay('Keyboard', h('div.keylist',
    ...rows.map(([k, d]) => h('div.keyrow', h('span.kbd', k), h('span', d)))), close);
}

export function searchOverlay(close) {
  const input = h('input.searchbox', { type: 'search', placeholder: 'Jump to a topic, formula or lab…', autofocus: true });
  const list = h('div.searchresults');

  const items = [
    ...LIVE_SKILLS.map(s => ({
      kind: 'topic', label: topicOfSkill(s), sub: UNIT_BY_KEY[unitOfSkill(s)].name,
      go: () => nav({ v: 'drill', mode: 'topic', scope: s }),
      alt: () => nav({ v: 'primer', scope: s }),
    })),
    ...EXPLORERS.map(e => ({
      kind: 'lab', label: e.name, sub: 'interactive lab', go: () => nav({ v: 'lab', id: e.id }),
    })),
    ...FORMULAS.flatMap(g => g.items.map(it => ({
      kind: 'formula', label: it.n, sub: g.group, tex: it.t,
      go: () => nav({ v: 'formulas', unit: g.unit }),
    }))),
  ];

  let cursor = 0;
  let shown = [];
  function render() {
    const q = input.value.toLowerCase().trim();
    shown = (q ? items.filter(i => (i.label + ' ' + i.sub).toLowerCase().includes(q)) : items.slice(0, 12)).slice(0, 30);
    cursor = Math.min(cursor, Math.max(0, shown.length - 1));
    clear(list);
    shown.forEach((it, i) => {
      list.appendChild(h('div.sresult' + (i === cursor ? '.on' : ''), { onclick: () => { close(); it.go(); } },
        h('span.stype', it.kind),
        h('span.slabel', it.label),
        it.tex ? h('span.stex', { html: tex('$' + it.tex.slice(0, 60) + '$') }) : h('span.dimmer', { style: { fontSize: '12px' } }, it.sub),
      ));
    });
  }
  input.addEventListener('input', () => { cursor = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); cursor = Math.min(cursor + 1, shown.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cursor = Math.max(cursor - 1, 0); render(); }
    else if (e.key === 'Enter' && shown[cursor]) { e.preventDefault(); close(); shown[cursor].go(); }
  });
  render();
  const node = overlay('Search', h('div', input, list), close);
  setTimeout(() => input.focus(), 20);
  return node;
}

function overlay(title, body, close) {
  const back = h('div.overlay', { onclick: e => { if (e.target === back) close(); } },
    h('div.sheetbox',
      h('div.row', h('h2', title), h('span.flex'), h('button.iconbtn', { onclick: close }, '✕')),
      body));
  return back;
}

// ---------------------------------------------------------------
function fmtD(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function relDays(ts) {
  const d = Math.round((ts - Date.now()) / 86400000);
  if (d <= 0) return 'due now';
  return d === 1 ? 'tomorrow' : `in ${d} days`;
}
function when(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// ===============================================================
// LEARN — the semester program
// ===============================================================
const todayKey = () => new Date().toISOString().slice(0, 10);

const fmtDay = k => {
  const d = new Date(k + 'T12:00:00Z');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

/** behind | current | ahead, relative to the lecture that covers it */
function lessonStatus(l, today) {
  if (store.lessonDone(l.id)) return 'done';
  const last = l.dates[l.dates.length - 1];
  if (last < today) return 'behind';
  if (l.dates[0] <= today) return 'current';
  return 'ahead';
}

export function learn() {
  const wrap = h('div.wrap');
  const today = todayKey();
  const behind = LESSONS.filter(l => lessonStatus(l, today) === 'behind');
  const current = LESSONS.filter(l => lessonStatus(l, today) === 'current');
  const done = LESSONS.filter(l => store.lessonDone(l.id));

  wrap.appendChild(h('section.hero',
    h('div.eyebrow', `${COURSE.code} · ${COURSE.term} · ${LESSONS.length} lessons`),
    h('h1', 'Learn'),
    h('p', 'One lesson per topic block in Dr. McWhorter’s schedule, dated to the lecture that covers it. '
      + 'Read the lesson, then drill it. The program knows what the course has already covered, so it knows what you are behind on.'),
  ));

  // ---- catch-up: the whole point when you are starting late
  if (behind.length) {
    const box = h('div.panel.catchup');
    box.appendChild(h('div.row',
      h('div.eyebrow', `Catch-up — ${plural(behind.length, 'lesson')} already covered in class`),
      h('span.flex'),
      h('button.btn.sm.primary', { onclick: () => nav({ v: 'lesson', id: behind[0].id }) }, 'Start with the oldest →')));
    box.appendChild(h('div.dim', { style: { fontSize: '13px', margin: '6px 0 12px' } },
      'Work these in order — they build on each other. Each is a short read plus a drill set.'));
    for (const l of behind) box.appendChild(lessonRow(l, today));
    wrap.appendChild(box);
  } else if (current.length) {
    const box = h('div.panel.catchup');
    box.appendChild(h('div.eyebrow', 'You are caught up — this is what class is on now'));
    for (const l of current) box.appendChild(lessonRow(l, today));
    wrap.appendChild(box);
  }

  // ---- progress strip
  wrap.appendChild(h('div.lprog',
    h('div.lprogbar', h('div.lprogfill', { style: { width: `${Math.round(100 * done.length / LESSONS.length)}%` } })),
    h('div.dim', { style: { fontSize: '12.5px', marginTop: '6px' } },
      `${done.length} of ${LESSONS.length} lessons finished · a lesson counts as finished once you have read it and drilled it at least once`)));

  // ---- the full program, grouped by exam, with a filter box
  const filt = h('input.lfilter', { type: 'search', placeholder: 'Filter lessons (title, topic)…' });
  wrap.appendChild(h('div.sechead', h('h2', 'The semester'), h('div.line'), filt));
  const groups = h('div');
  const rows = [];
  for (const e of [...EXAMS].sort((x, y) => (x.id || 99) - (y.id || 99))) {
    const list = LESSONS.filter(l => examOfLesson(l) === e.id);
    if (!list.length) continue;
    const box = h('div.weekblock');
    box.appendChild(h('div.weekhead', h('span.weekdate', `${e.name} · ${fmtDay(e.date)}`),
      h('span.flex'),
      h('button.btn.sm.ghost', { onclick: () => nav({ v: 'drill', mode: 'examscope', scope: e.id }) }, 'Practise →')));
    for (const l of list) {
      const row = lessonRow(l, today);
      rows.push({ row, box, text: (l.title + ' ' + (l.drill || []).join(' ')).toLowerCase() });
      box.appendChild(row);
    }
    groups.appendChild(box);
  }
  wrap.appendChild(groups);
  filt.addEventListener('input', () => {
    const q = filt.value.trim().toLowerCase();
    rows.forEach(r => { r.row.style.display = !q || r.text.includes(q) ? '' : 'none'; });
    groups.querySelectorAll('.weekblock').forEach(b => {
      b.style.display = [...b.querySelectorAll('.lrow')].some(r => r.style.display !== 'none') ? '' : 'none';
    });
  });
  return wrap;
}

function lessonRow(l, today) {
  const st = lessonStatus(l, today);
  const u = UNIT_BY_KEY[l.unit];
  const rec = store.lesson(l.id);
  const lad = store.ladderStats(l.id);
  return h('div.lrow.is-' + st, { onclick: () => nav({ v: 'lesson', id: l.id }) },
    h('span.lnum', l.kind === 'exam' ? '⚑' : String(l.n)),
    h('div.lmain',
      h('div.ltitle', l.title),
      h('div.lmeta', `${l.dates.map(fmtDay).join(' · ')}${u ? '  —  ' + u.name : ''}`)),
    h('span.flex'),
    lad.n ? h('span.ltag.' + (store.lessonDone(l.id) ? 'read' : 'now'), `${lad.right}/${lad.n}`) : null,
    !lad.n && rec.read ? h('span.ltag.read', rec.drilled ? '✓ done' : 'read') : null,
    st === 'behind' && !rec.read ? h('span.ltag.behind', 'behind') : null,
    st === 'current' && !rec.read ? h('span.ltag.now', 'now') : null);
}

// ===============================================================
// LESSON — the player
// ===============================================================
export function lesson(id) {
  const l = lessonById(id);
  if (!l) return h('div.wrap', h('p', 'No such lesson.'));
  const wrap = h('div.wrap.narrow');
  const idx = LESSONS.indexOf(l);
  const u = UNIT_BY_KEY[l.unit];
  store.markLessonRead(l.id);

  wrap.appendChild(h('div.row', { style: { marginBottom: '10px' } },
    h('button.btn.sm.ghost', { onclick: () => nav({ v: 'learn' }) }, '← All lessons'),
    h('span.flex'),
    h('span.dimmer', { style: { fontSize: '12px' } }, `Lesson ${l.n} of ${LESSONS.length}`)));

  wrap.appendChild(h('section.hero',
    h('div.eyebrow', `${l.dates.map(fmtDay).join(' · ')}${u ? '  ·  ' + u.name : ''}`),
    h('h1', l.title),
    h('p.lgoal', { html: tex(l.goal) })));

  const skills = (l.drill || []).filter(s => LIVE_SKILLS.includes(s));
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  if (l.plain) return wrap.appendChild(rewrittenBody(l, wrap, skills, prev, next)) && wrap;
  wrap.appendChild(h('div.lbar',
    h('button.btn.sm.primary', {
      onclick: () => { store.markLessonDrilled(l.id); nav({ v: 'drill', mode: 'custom', skills }); },
    }, 'Drill this lesson'),
    h('button.btn.sm', {
      onclick: () => { store.markLessonDrilled(l.id); nav({ v: 'drill', mode: 'custom', skills, freeShare: 0.6 }); },
    }, 'Exam-style set'),
    h('span.flex'),
    prev && h('button.btn.sm.ghost', { onclick: () => nav({ v: 'lesson', id: prev.id }) }, '← Prev'),
    next && h('button.btn.sm.ghost', { onclick: () => nav({ v: 'lesson', id: next.id }) }, 'Next →')));

  wrap.appendChild(h('div.panel.recall',
    h('div.eyebrow', 'Why this matters'),
    h('div', { html: tex(l.why) })));

  if ((l.cards || []).length) wrap.appendChild(cardsPanel(l.cards));

  for (const s of l.sections || []) {
    const box = h('div.panel',
      h('div.eyebrow', s.h),
      ...String(s.body).split('\n\n').map(par => h('div.lpara', { html: tex(par) })));
    sectionExtras(box, s);
    wrap.appendChild(box);
  }

  workedList(l).forEach(b => wrap.appendChild(b));

  if (Array.isArray(l.exam) && l.exam.length) {
    wrap.appendChild(h('div.panel',
      h('div.eyebrow', 'Exam patterns'),
      ...l.exam.map(t => h('div.lpara', { html: tex(t) }))));
  }

  if (l.traps && l.traps.length) {
    wrap.appendChild(h('div.panel.diag',
      h('div.eyebrow', 'Where people lose the marks'),
      ...l.traps.map(t => h('div.ltrap', h('span.tdot', '✕'), h('span', { html: tex(t) })))));
  }

  // his own check-ins for this lecture
  const cis = (l.checkins || []).filter(c => materialize({ id: c }));
  if (cis.length) {
    wrap.appendChild(h('div.panel',
      h('div.row',
        h('div.eyebrow', `His check-ins for this material (${cis.length})`),
        h('span.flex'),
        h('button.btn.sm', { onclick: () => nav({ v: 'drill', mode: 'custom', refs: cis.map(id => ({ id })) }) }, 'Drill these →')),
      h('div.dim', { style: { fontSize: '13px', marginTop: '6px' } },
        'The true/false claims he actually opened these lectures with.')));
  }

  wrap.appendChild(h('div.panel.lfinish',
    h('div.eyebrow', 'Now drill it'),
    h('div.planitems', ...skills.map(sk =>
      h('span.planchip', { onclick: () => nav({ v: 'drill', mode: 'topic', scope: sk }) }, topicOfSkill(sk)))),
    h('div.row', { style: { marginTop: '12px' } },
      h('button.btn.primary', {
        onclick: () => { store.markLessonDrilled(l.id); nav({ v: 'drill', mode: 'custom', skills }); },
      }, `Drill this lesson (${plural(skills.length, 'topic')})`),
      next ? h('button.btn.sm.ghost', { onclick: () => nav({ v: 'lesson', id: next.id }) },
        `Next: ${next.title} →`) : null)));

  return wrap;
}

// ---- interactive lesson pieces (contract ex3 sections 1-4) ----

// Keys typed on a lesson widget stay there: main.js idle shortcuts (1-6, n, l, t...) must not fire.
const ownKeys = el => { el.addEventListener('keydown', e => { if (e.key !== 'Escape') e.stopPropagation(); }); return el; };

// section.widget (inline lab) + section.try (answer-it-yourself check)
function sectionExtras(box, sec) {
  if (sec.widget) {
    const lp = labPanel(sec.widget.lab, sec.widget.set);   // unknown lab id: nothing (check-lessons flags it)
    if (lp) box.appendChild(h('div.lwidget', lp, sec.widget.caption ? h('div.lnote', { html: tex(sec.widget.caption) }) : null));
  }
  if (sec.try && (sec.try.choices || []).length) box.appendChild(tryWidget(sec.try));
}

/** Multiple-choice check with instant diagnosis. Right answer, or 2 misses, shows the key's why
 *  and calls onDone. Choices shuffled per render. */
function tryWidget(t, onDone) {
  const box = ownKeys(h('div.ltry'));
  box.appendChild(h('div.lq', { html: '<b>Try it:</b> ' + tex(t.q) }));
  const list = h('div.choices');
  const why = h('div.ltrywhy');
  let misses = 0, done = false;
  const finish = () => {
    done = true;
    list.querySelectorAll('.choice').forEach(b => { b.classList.add('locked'); if (b._c.ok) b.classList.add('correct'); });
    const key = t.choices.find(c => c.ok);
    if (key && key.why) why.appendChild(h('div.lans.ok', { html: '<b>Why:</b> ' + tex(key.why) }));
    if (onDone) onDone();
  };
  rand.shuffle(t.choices).forEach(c => {
    const b = h('button.choice', { type: 'button', onclick: () => {
      if (done || b.classList.contains('wrong')) return;
      clear(why);
      if (c.ok) { b.classList.add('correct'); return finish(); }
      b.classList.add('wrong');
      why.appendChild(h('div.lans.no', { html: tex(c.why || 'Not this one.') }));
      if (++misses >= 2) finish();
      else why.appendChild(h('div.dim', 'Try again.'));
    } }, h('span.body', { html: tex(c.t) }));
    b._c = c;
    list.appendChild(b);
  });
  box.append(list, why);
  return box;
}

/** Worked examples as step-through. All steps are rendered (KaTeX) up front; only visibility toggles.
 *  A per-lesson "Show all worked steps" toggle (persisted) restores the fully-open view. */
function workedList(l) {
  const ws = l.worked || [];
  if (!ws.length) return [];
  const boxes = ws.map(workedBox);
  const sync = () => boxes.forEach(b => b._reset(store.showAllSteps(l.id)));
  const cb = h('input', { type: 'checkbox', checked: store.showAllSteps(l.id) });
  cb.addEventListener('change', () => { store.setShowAllSteps(l.id, cb.checked); sync(); });
  sync();
  return [h('label.lstepmode', cb, ' Show all worked steps'), ...boxes];
}

function workedBox(w) {
  const asks = {};
  for (const a of w.ask || []) asks[a.at] = a;
  const steps = w.steps.map((t, i) => h('div.step' + (i === w.steps.length - 1 ? '.key' : ''),
    h('span.num', String(i + 1)), h('span.txt', { html: tex(t) })));
  const note = w.note ? h('div.lnote', { html: tex(w.note) }) : null;
  const ctl = ownKeys(h('div.lreveal'));
  const box = h('div.panel.worked', h('div.eyebrow', 'Worked example'), h('div.lq', { html: tex(w.q) }),
    h('div.steps', ...steps), note, ctl);
  let shown = 1;
  const answered = new Set();
  const paint = () => {
    steps.forEach((s, i) => { s.hidden = i >= shown; });
    if (note) note.hidden = shown < steps.length;
    clear(ctl);
    if (shown >= steps.length) return;
    const a = asks[shown + 1];
    const gate = a && !answered.has(a.at);
    const pass = () => { answered.add(a.at); nextB.disabled = false; };
    const nextB = h('button.btn.sm.primary', { type: 'button', disabled: gate, onclick: () => { shown++; paint(); } }, 'Next step');
    ctl.appendChild(h('div.dim.lthink', 'What comes next? Think, then reveal.'));
    if (gate) ctl.appendChild(tryWidget(a, pass));
    ctl.appendChild(h('div.row', nextB,
      gate ? h('button.btn.sm.ghost', { type: 'button', onclick: () => { answered.add(a.at); shown++; paint(); } }, 'Skip') : null,
      h('button.btn.sm.ghost', { type: 'button', onclick: () => { shown = steps.length; paint(); } }, 'Show all')));
  };
  box._reset = all => { shown = all ? steps.length : 1; paint(); };
  return box;
}

/** l.cards: one flip card at a time; Got it drops it, Again re-queues it at the end. Session state only. */
function cardsPanel(cards) {
  const panel = ownKeys(h('div.panel.lcards', h('div.eyebrow', 'Memorize')));
  const body = h('div');
  panel.appendChild(body);
  let queue = cards.map((_, i) => i), flipped = false;
  const paint = () => {
    clear(body);
    if (!queue.length) {
      body.appendChild(h('div.row', h('span.dim', 'All cards done.'),
        h('button.btn.sm', { type: 'button', onclick: () => { queue = cards.map((_, i) => i); flipped = false; paint(); } }, 'Again from the start')));
      return;
    }
    const c = cards[queue[0]];
    const card = h('div.lcard' + (flipped ? '.flipped' : ''), { tabindex: 0, role: 'button', 'aria-label': 'Flip card' },
      h('div.lcardface', { html: tex(flipped ? c.b : c.f) }),
      h('div.dimmer.lcardhint', flipped ? 'back' : 'tap or space to flip'));
    const flip = () => { flipped = !flipped; paint(); body.querySelector('.lcard').focus(); };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
    const step = again => { const i = queue.shift(); if (again) queue.push(i); flipped = false; paint(); };
    body.append(card, h('div.row',
      h('span.dimmer', `${queue.length} left`), h('span.flex'),
      h('button.btn.sm', { type: 'button', onclick: () => step(true) }, 'Again'),
      h('button.btn.sm.primary', { type: 'button', onclick: () => step(false) }, 'Got it')));
  };
  paint();
  return panel;
}

// A rewritten lesson (has .plain): ground-up teaching page + fixed practice ladder.
function rewrittenBody(l, wrap, skills, prev, next) {
  const para = t => String(t).split('\n\n').map(x => h('div.lpara', { html: tex(x) }));
  const panel = (title, ...kids) => h('div.panel', h('div.eyebrow', { html: tex(title) }), ...kids);
  const frag = h('div.lrewrite');
  if (l.why) frag.appendChild(h('div.lwhy', { html: tex(l.why) }));
  frag.appendChild(panel('The big idea in plain English', ...para(l.plain)));
  if ((l.prereq || []).length) {
    frag.appendChild(panel('Words you need first',
          ...l.prereq.map(p => h('div.lterm', h('b', { html: tex(p.term) }), h('span', { html: ' — ' + tex(p.means) })))));
  }
  if ((l.cards || []).length) frag.appendChild(cardsPanel(l.cards));
  (l.sections || []).forEach((sec, i) => {
    const box = panel(`${i + 1}. ${sec.h}`, ...para(sec.body));
    sectionExtras(box, sec);
    if (sec.check) {
      box.appendChild(h('details.lcheck',
        h('summary', { html: '<b>Check yourself:</b> ' + tex(sec.check.q) }),
        h('div.lans', { html: tex(sec.check.a) })));
    }
    frag.appendChild(box);
  });
  if ((l.recipe || []).length) {
    frag.appendChild(h('div.panel.recipebox',
      h('div.eyebrow', 'The method step by step'),
      h('div.steps', ...l.recipe.map((t, i) => h('div.step', h('span.num', String(i + 1)), h('span.txt', { html: tex(t) }))))));
  }
  workedList(l).forEach(b => frag.appendChild(b));
  if ((l.exam || []).length) frag.appendChild(panel('Exam patterns', ...l.exam.map(t => h('div.lpara', { html: tex(t) }))));
  if ((l.traps || []).length) {
    frag.appendChild(h('div.panel.diag', h('div.eyebrow', 'Where people lose the marks'),
      ...l.traps.map(t => h('div.ltrap', h('span.tdot', '✕'), h('span', { html: tex(t) })))));
  }
  const cis = (l.checkins || []).filter(c => materialize({ id: c }));
  if (cis.length) {
    frag.appendChild(h('div.panel',
      h('div.row', h('div.eyebrow', `His check-ins for this material (${cis.length})`), h('span.flex'),
        h('button.btn.sm', { onclick: () => nav({ v: 'drill', mode: 'custom', refs: cis.map(id => ({ id })) }) }, 'Drill these →')),
      h('div.dim', { style: { fontSize: '13px', marginTop: '6px' } }, 'The true/false claims he actually opened these lectures with.')));
  }

  // ---- practice ladder
  const st = store.ladderStats(l.id);
  const items = (l.practice || []).filter(p => materialize({ id: p.id }));
  const refs = items.map(p => ({ id: p.id }));
  const go = rs => { store.markLessonDrilled(l.id); nav({ v: 'drill', mode: 'lesson', refs: rs, lessonId: l.id }); };
  const pr = h('div.panel.lfinish', h('div.row', h('div.eyebrow', 'Practice'), h('span.flex'),
    h('span.dimmer', { style: { fontSize: '12px' } }, `${st.right}/${st.n} right · ${st.tried}/${st.n} tried`)));
  const LABEL = { warmup: 'Warm-up', core: 'Core', exam: 'Exam level' };
  for (const stage of ['warmup', 'core', 'exam']) {
    const sub = items.filter(p => p.stage === stage);
    if (!sub.length) continue;
    pr.appendChild(h('div.lstage', LABEL[stage]));
    for (const p of sub) {
      const v = st.ladder[p.id];
      pr.appendChild(h('div.lladder' + (v === 1 ? '.ok' : v === 0 ? '.miss' : ''),
        h('span.ltick', v === 1 ? '✓' : v === 0 ? '✕' : '○'),
        h('span', `${items.indexOf(p) + 1}. ${String(p.arch || '').replace(/-/g, ' ')}`)));
    }
  }
  const missedRefs = items.filter(p => st.ladder[p.id] === 0).map(p => ({ id: p.id }));
  pr.appendChild(h('div.row', { style: { marginTop: '14px', flexWrap: 'wrap' } },
    h('button.btn.primary', { onclick: () => go(refs) }, `Start practice (${refs.length} problems, warm-up to exam level)`),
    missedRefs.length ? h('button.btn', { onclick: () => go(missedRefs) }, `Redo missed only (${missedRefs.length})`) : null,
    h('button.btn.ghost', { onclick: () => { store.markLessonDrilled(l.id); nav({ v: 'drill', mode: 'custom', skills }); } }, 'Extra random practice')));
  frag.appendChild(pr);

  frag.appendChild(h('div.lbar',
    prev && h('button.btn.sm.ghost', { onclick: () => nav({ v: 'lesson', id: prev.id }) }, '← Prev'),
    h('span.flex'),
    next && h('button.btn.sm.ghost', { onclick: () => nav({ v: 'lesson', id: next.id }) }, `Next: ${next.title} →`)));
  return frag;
}
