// ---------------------------------------------------------------
// lessonmap.js — skill <-> lesson <-> exam lookups, built from the
// LESSONS drill arrays and course.js EXAMS. Also lessonLink(skill).
// ---------------------------------------------------------------
import { h } from './util.js';
import { LESSONS } from './bank/lessons.js';
import { EXAMS } from './bank/course.js';

let nav = () => {};
export function setNav(fn) { nav = fn; }

/** Lesson that teaches `skill`: first topic lesson (not an exam review), else first review. */
export function lessonForSkill(skill) {
  const has = l => (l.drill || []).includes(skill);
  return LESSONS.find(l => l.kind !== 'exam' && has(l)) || LESSONS.find(has) || null;
}

/** Lessons for an exam id (0 = Final = all), in course order. */
export function lessonsForExam(id) {
  if (id === 0) return LESSONS.slice();
  const e = EXAMS.find(x => x.id === id);
  if (!e) return [];
  const sk = new Set(e.skills);
  return LESSONS.filter(l => l.dates[l.dates.length - 1] <= e.date && (l.drill || []).some(s => sk.has(s)));
}

/** Exam id a lesson is first assessed on (by date; polar etc. -> Final 0). */
export function examOfLesson(l) {
  const last = l.dates[l.dates.length - 1];
  const e = EXAMS.filter(x => x.id !== 0 && x.date >= last).sort((a, b) => a.date.localeCompare(b.date))[0];
  return e ? e.id : 0;
}

/** Small "Lesson" link element for drill HUD / feedback. Null if no lesson. */
export function lessonLink(skill) {
  const l = lessonForSkill(skill);
  if (!l) return null;
  return h('a.lessonlink', {
    href: '#', title: l.title,
    onclick: e => { e.preventDefault(); e.stopPropagation(); nav({ v: 'lesson', id: l.id }); },
  }, '📖 Lesson');
}
