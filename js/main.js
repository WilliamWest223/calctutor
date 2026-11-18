// ---------------------------------------------------------------
// main.js — router, keyboard control, per-question timer
// ---------------------------------------------------------------
import { clear, toast } from './util.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as screens from './screens.js';
import * as sess from './session.js';
import { cheatsheet } from './cheatsheet.js';
import { checkTyped } from './mathcheck.js';
import { LIVE_SKILLS } from './bank/index.js';
import * as bank from './bank/index.js';
import * as lessons from './bank/lessons.js';
import * as course from './bank/course.js';
import { setNav as setLessonNav } from './lessonmap.js';

const app = document.getElementById('app');

let S = null;          // active session
let view = null;       // active drill view nodes
let state = 'idle';    // idle | asking | revealed
let askedAt = 0;
let tick = null;
let timerEndsAt = 0;
let timerHeld = null;
let hintLevel = 0;
let overlayNode = null;
let lastRoute = { v: 'home' };

document.documentElement.dataset.theme = store.settings().theme || 'blueprint';
store.touchDay();

// ---------------------------------------------------------------
function render(node) {
  clear(app);
  app.appendChild(ui.topbar());
  app.appendChild(node);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function nav(route) {
  closeOverlay();
  stopTimer();
  lastRoute = route;
  switch (route.v) {
    case 'home': S = null; state = 'idle'; return render(ui.home());
    case 'progress': S = null; state = 'idle'; return render(screens.progress());
    case 'formulas': S = null; state = 'idle'; return render(screens.formulas(route.unit));
    case 'labs': S = null; state = 'idle'; return render(screens.labs());
    case 'lab': S = null; state = 'idle'; return render(screens.lab(route.id));
    case 'plan': S = null; state = 'idle'; return render(screens.plan());
    case 'learn': S = null; state = 'idle'; return render(screens.learn());
    case 'lesson': S = null; state = 'idle'; return render(screens.lesson(route.id));
    case 'worksheet': S = null; state = 'idle'; return render(screens.worksheet({ n: route.n || 15, skills: route.skills }));
    case 'primer': S = null; state = 'idle';
      return render(ui.primer(route.scope, () => nav({ v: 'drill', mode: 'topic', scope: route.scope })));
    case 'help': return openOverlay(screens.helpOverlay(closeOverlay));
    case 'search': return openOverlay(screens.searchOverlay(closeOverlay));
    case 'drill': return startDrill(route);
    default: return render(ui.home());
  }
}
ui.setNav(nav);
screens.setNav(nav);
setLessonNav(nav);

// ---------------------------------------------------------------
function openOverlay(node) {
  closeOverlay();
  overlayNode = node;
  document.body.appendChild(node);
}
function closeOverlay() {
  if (overlayNode && overlayNode.parentNode) overlayNode.parentNode.removeChild(overlayNode);
  overlayNode = null;
  resumeTimer();
}

/** The cheat sheet floats over whatever is on screen — it never navigates. */
function toggleCheatsheet() {
  if (overlayNode && overlayNode.classList.contains('csoverlay')) return closeOverlay();
  closeOverlay();
  pauseTimer();
  overlayNode = cheatsheet(closeOverlay);
  document.body.appendChild(overlayNode);
}

// ---------------------------------------------------------------
function startDrill(route) {
  const mode = route.mode;
  const scope = mode === 'custom' ? route.skills : route.scope;

  if (mode === 'mistakes' && store.missed().length === 0) {
    return render(ui.empty('Your mistake bank is empty. Get something wrong first — that is the whole point.',
      { label: 'Start Rapid Fire', fn: () => nav({ v: 'drill', mode: 'rapid' }) }));
  }
  if (mode === 'starred' && store.starred().length === 0) {
    return render(ui.empty('Nothing starred yet. Press S on any question to flag it for later.',
      { label: 'Start Rapid Fire', fn: () => nav({ v: 'drill', mode: 'rapid' }) }));
  }

  S = sess.build({ mode, scope, count: route.count, refs: route.refs, freeShare: route.freeShare });
  S.lessonId = route.lessonId || null;
  S.fromRefs = !!(route.refs && route.refs.length);
  S.bankStart = store.missed().length;
  S.seen = [];
  if (!sess.currentProblem(S)) {
    return render(ui.empty('No problems available for that selection yet.',
      { label: 'Back home', fn: () => nav({ v: 'home' }) }));
  }
  ask();
}

function ask() {
  const p = S.current;
  S.seen[S.results.length] = p;
  hintLevel = 0;
  view = ui.drill(S, { answer, quit: endSession, star: toggleStar, hint: giveHint, submitOwn });
  render(view.root);
  state = 'asking';
  askedAt = Date.now();
  if (p.fmt === 'free' && view.entry) view.entry.focus({ preventScroll: true });
  if (S.cfg.timed && store.settings().timed) startTimer(S.cfg.secs);
}

function giveHint() {
  if (state !== 'asking' || !store.settings().hints) return;
  hintLevel++;
  const max = ui.showHint(view, S.current, hintLevel);
  if (hintLevel === 1) S.hintsUsed++;
  if (hintLevel >= max) {
    const b = document.getElementById('hintbtn');
    if (b) { b.disabled = true; b.textContent = 'no more hints'; }
  }
}

function toggleStar() {
  if (!S || !S.current) return;
  const p = S.current;
  const on = store.toggleStar(p.ref, p.skill, p.prompt);
  toast(on ? 'Starred' : 'Unstarred');
  const btn = view.root.querySelector('.iconbtn.star');
  if (btn) { btn.classList.toggle('on', on); btn.textContent = on ? '★' : '☆'; }
  const fbBtn = [...view.fb.querySelectorAll('button')].find(b => /Star/.test(b.textContent));
  if (fbBtn) fbBtn.textContent = on ? '★ Starred' : '☆ Star this';
}

/** Grade a written-in answer by mathematical equivalence, not string match. */
function submitOwn(text) {
  if (state !== 'asking' || !S || !S.current) return;
  const p = S.current;
  let res = checkTyped(text, p.choices);
  // extra accepted prose forms (free-response items)
  const nt = String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (res.status !== 'correct' && (p.accept || []).some(a => String(a).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === nt)) {
    res = { status: 'correct', index: p.choices.findIndex(c => c.ok), note: '' };
  }

  // The checker refusing to decide is OUR limitation, not a wrong answer —
  // never grade it against the student.
  if (res.status === 'unparsed' || res.status === 'undecidable') {
    ui.ownNote(view, res.note, res.status === 'undecidable' ? 'warn' : 'warn');
    return;
  }

  stopTimer();
  state = 'revealed';
  const ms = Date.now() - askedAt;
  const idx = res.index;                    // key index, distractor index, or -1
  const correct = sess.grade(S, p, idx, ms, hintLevel > 0);
  S.typedCount = (S.typedCount || 0) + 1;

  if (S.cfg.defer) { state = 'asking'; next(); return; }
  ui.reveal(view, p, idx, correct, {
    next, star: toggleStar,
    typed: { text: String(text).trim(), note: res.note },
  });
}

function answer(i) {
  if (state !== 'asking') return;
  const p = S.current;
  if (p.fmt === 'free') return;                       // free response: typed answer only
  if (p.fmt === 'multi') {                            // toggle; Enter / button submits
    if (i === 'submit') {
      const picked = view.picked();
      if (!picked.length) return toast('Select at least one');
      i = picked;
    } else return view.toggle(i);
  }
  stopTimer();
  state = 'revealed';
  const ms = Date.now() - askedAt;
  const correct = sess.grade(S, p, i, ms, hintLevel > 0);

  if (S.cfg.defer) {                       // exam mode: no feedback, straight on
    state = 'asking';
    next();
    return;
  }
  ui.reveal(view, p, Array.isArray(i) ? (p.choices.findIndex((c, j) => c.ok !== i.includes(j))) : i, correct,
    { next, star: toggleStar, picked: Array.isArray(i) ? i : null });
}

function next() {
  stopTimer();
  const p = sess.advance(S);
  if (!p) return endSession();
  ask();
}

function endSession() {
  stopTimer();
  if (!S) return nav({ v: 'home' });
  if (S.results.length === 0) return nav({ v: 'home' });
  const stats = sess.finish(S);
  state = 'idle';
  const handlers = {
    again: () => nav(S.lessonId || S.fromRefs ? lastRoute : { v: 'drill', mode: S.cfg.key, scope: S.scope }),
    lesson: S.lessonId ? () => nav({ v: 'lesson', id: S.lessonId }) : null,
    nextLesson: S.lessonId ? (() => { const i = lessons.LESSONS.findIndex(x => x.id === S.lessonId); const nx = lessons.LESSONS[i + 1]; return nx ? { title: nx.title, go: () => nav({ v: 'lesson', id: nx.id }) } : null; })() : null,
    mistakes: () => nav({ v: 'drill', mode: 'mistakes' }),
    home: () => nav({ v: 'home' }),
    drillTopic: sk => nav({ v: 'drill', mode: 'topic', scope: sk }),
  };
  const node = ui.summary(S, stats, handlers);
  if (S.cfg.defer) node.appendChild(ui.examReview(S, S.seen));
  render(node);
  const p = stats.n ? stats.right / stats.n : 0;
  if (stats.unlocked && stats.unlocked.length) toast(`Achievement: ${stats.unlocked[0].name}`, 3000);
  else if (p === 1 && stats.n >= 10) toast('Clean sweep. 🔥', 2600);
}

// ---------------------------------------------------------------
function startTimer(secs, remainingMs) {
  const bar = view.timer.querySelector('i');
  const total = secs * 1000;
  const endsAt = Date.now() + (remainingMs != null ? remainingMs : total);
  timerEndsAt = endsAt;
  tick = setInterval(() => {
    const left = Math.max(0, endsAt - Date.now());
    timerEndsAt = endsAt;
    const f = left / total;
    bar.style.width = `${f * 100}%`;
    bar.style.background = f < 0.2 ? 'var(--coral)' : f < 0.5 ? 'var(--amber)' : 'var(--lime)';
    if (left <= 0) {
      stopTimer();
      if (state === 'asking') {
        state = 'revealed';
        sess.grade(S, S.current, -1, secs * 1000, hintLevel > 0);
        if (S.cfg.defer) { state = 'asking'; next(); }
        else ui.reveal(view, S.current, -1, false, { next, star: toggleStar });
      }
    }
  }, 100);
}
function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }

/** Pause/resume so consulting the cheat sheet mid-question is not punished. */
function pauseTimer() {
  if (!tick) return;
  timerHeld = Math.max(0, timerEndsAt - Date.now());
  stopTimer();
}
function resumeTimer() {
  if (timerHeld == null) return;
  const held = timerHeld; timerHeld = null;
  if (state === 'asking' && S && S.cfg.timed && store.settings().timed && view) {
    startTimer(S.cfg.secs, held);
  }
}

// ---------------------------------------------------------------
// keyboard
// ---------------------------------------------------------------
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

  // overlays swallow everything except Escape (their own handlers manage the rest)
  if (overlayNode) {
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); return; }
    // C closes the cheat sheet again, but not while typing in its filter box
    if (!typing && (e.key === 'c' || e.key === 'C')) { e.preventDefault(); closeOverlay(); }
    return;
  }
  if (typing) {
    if (e.key === 'Escape') e.target.blur();
    return;
  }

  // the cheat sheet is available from every screen and every drill state
  if (e.key === 'c' || e.key === 'C') { e.preventDefault(); return toggleCheatsheet(); }

  if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); return nav({ v: 'help' }); }
  if (e.key === '/') { e.preventDefault(); return nav({ v: 'search' }); }

  if (state === 'asking' && S) {
    const n = S.current.choices.length;
    const num = parseInt(e.key, 10);
    const fm = S.current.fmt;
    if (fm === 'free') return;                                    // typing only
    if (fm === 'multi' && e.key === 'Enter') { e.preventDefault(); return answer('submit'); }
    if (num === n + 1 && view && view.entry && !S.current.tf && fm !== 'multi' && fm !== 'error') {   // the write-your-own slot
      e.preventDefault(); view.entry.focus(); return;
    }
    if (num >= 1 && num <= n) { e.preventDefault(); return answer(num - 1); }
    const alpha = 'abcde'.indexOf(e.key.toLowerCase());
    if (alpha >= 0 && alpha < n) { e.preventDefault(); return answer(alpha); }
    if (e.key === 'h' || e.key === 'H') { e.preventDefault(); return giveHint(); }
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); return toggleStar(); }
  }
  if (state === 'revealed') {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); return next(); }
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); return toggleStar(); }
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    if (S && state !== 'idle') return endSession();
    return nav({ v: 'home' });
  }

  if (state === 'idle') {
    const order = ['rapid', 'review', 'mistakes', 'exam', 'cram', 'starred'];
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= order.length) {
      e.preventDefault();
      const m = order[num - 1];
      if (m === 'mistakes' && !store.missed().length) return toast('Mistake bank is empty');
      if (m === 'starred' && !store.starred().length) return toast('Nothing starred yet');
      return nav({ v: 'drill', mode: m });
    }
    const k = e.key.toLowerCase();
    if (k === 'n') { e.preventDefault(); return nav({ v: 'learn' }); }
    if (k === 'p') { e.preventDefault(); return nav({ v: 'progress' }); }
    if (k === 'f') { e.preventDefault(); return nav({ v: 'formulas' }); }
    if (k === 'l') { e.preventDefault(); return nav({ v: 'labs' }); }
    if (k === 'w') { e.preventDefault(); return nav({ v: 'worksheet' }); }
    if (k === 'k') { e.preventDefault(); return nav({ v: 'plan' }); }
    if (k === 't') {
      e.preventDefault();
      const root = document.documentElement;
      const nx = root.dataset.theme === 'paper' ? 'blueprint' : 'paper';
      root.dataset.theme = nx; store.setSetting('theme', nx);
      return;
    }
  }
});

// ---------------------------------------------------------------
if (!LIVE_SKILLS.length) {
  render(ui.empty('No problem bank loaded.'));
} else {
  nav({ v: 'home' });
}

// debug/inspection hook (also what the test harness drives)
window.__calctutor = {
  store, sess, nav, screens, cheatsheet: toggleCheatsheet, bank, ui, lessons, course,
  get session() { return S; },
  get problem() { return S && S.current; },
  get uiState() { return state; },
};
