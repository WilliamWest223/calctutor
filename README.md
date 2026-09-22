# Calctutor

A rapid-fire drill console for MATH 142 (Calculus II). Answer fast; when you miss
something, get a diagnosis of *the specific mistake you made*, a picture of why it's
wrong, and a worked solution. Missed problems come back on a spaced schedule until
they stop being missed.

Runs entirely in your browser. No account, no network, no build step.

## Learn — the semester program

Press **N**, or the ◈ button. 27 lessons, one per topic block in Dr. McWhorter's
schedule and dated to the lecture that covers it. Each one teaches the idea,
works an example the way he works it, names where people lose the marks, links
his real check-ins for that day, and hands you a drill set.

Because the lessons carry lecture dates, the program knows what class has
already covered — so it opens with a **catch-up queue** of what you are behind
on, oldest first. A lesson counts as finished once you have read it *and*
drilled it at least once.

## The Check-Ins unit

Every MATH 142 lecture opens with a check-in: one true/false claim about method
or reasoning. Dr. McWhorter publishes full solutions for them, and four
semesters' worth are in his repo. All 63 are in the app, in his wording, with
his reasoning as the diagnosis.

They are the highest-value questions here. They are literally the questions he
asks, the wrong answer is literally the misconception he is hunting, and they
test the thing his exams actually grade — *"fully justify your reasoning"* —
rather than whether you can turn a crank.

Three topics: **Method Judgment** (is this the right technique, set up right?),
**Series Test Logic** (does this test license this conclusion?), and
**Power & Taylor Claims** (intervals, coefficients, remainders).

## Start it

```bash
./run.sh
```

Then open <http://localhost:8142> (the script tries to open it for you).
Pass a port if 8142 is busy: `./run.sh 8143`.

> It must be served over `http://`, not opened as a `file://` path, because the app
> uses ES modules. That's the only reason the script exists.
>
> `run.sh` runs `tools/serve.py`, which is `python3 -m http.server` plus a
> `Cache-Control: no-store` header. The stock server sends no cache headers at all,
> which lets browsers hold on to stale ES modules — so after an edit the app can
> silently keep running the old code until a hard refresh. If you ever do see stale
> behaviour, shift-reload once.

## How to use it

**Keyboard-first.** Press `?` at any time for the full list. From the home screen
`1`–`6` launch a mode; `F` formulas, `L` labs, `P` progress, `W` worksheet, `K` study
plan, `/` search, `T` theme. Inside a drill: `1`–`4` answer, `Enter` continue,
`5` write your own answer, `H` hint, `S` star, `Esc` end.

**`C` opens the cheat sheet from anywhere** — including mid-question. It floats over
whatever you are doing, and the question timer pauses while it is open. `C` or `Esc`
closes it and the timer picks up exactly where it left off.

### Drill modes

| Mode | What it does |
|---|---|
| **Rapid Fire** | Weighted across everything, timed, instant feedback. The daily driver. |
| **Cumulative Review** | Deliberately *interleaved* — old units resurface next to new ones. |
| **Mistake Bank** | Only what you've gotten wrong. Answer one correctly and it leaves. |
| **Exam Simulation** | Spans all seven units, timed, **no feedback until the end** — then a full review of every miss. |
| **Exam 1 / 2 / 3 / Final** | Same, but scoped to exactly what that paper covers. |
| **Gateway I / II** | The 30-minute mastery checks: precalculus/Calc I, and integration skills. |
| **Covered So Far** | Only what has actually been lectured on to date. |
| **Cram Session** | Everything due plus your weakest topics, hardest first. For the night before. |
| **Starred** | Problems you flagged with `S` to come back to. |

Plus single-topic and single-unit drills from the Curriculum list, and a
**Today's Plan** drill generated from the syllabus calendar.

### Session options

The bar under the mode cards sets length (10/20/30/40), difficulty band
(all/easy/medium/hard), and toggles **adaptive** (aim questions at your current
mastery level), **hints**, and the **timer**. All of it persists.

## Built around your actual course

This is not a generic Calc II app. It is aligned to **MATH 142, Fall 2026, Dr. Caleb
McWhorter** using material from [his course page](https://coffeeintotheorems.com/courses/2026-2/fall/math-142/)
and [public GitHub repo](https://github.com/cgmcwhorter/usc):

- **19 real past exams** (Spring 2025, Fall 2025, Spring 2026 — problems *and*
  solutions, from the LaTeX source). Some appear verbatim as multiple choice with a
  `Fall 2025 · Exam 1 · Q4` tag; the rest are turned into generators that produce fresh
  instances of the same archetype — which is what he does himself, since his v1 and v2
  papers differ only in the constants.
- **His Fall 2026 check-ins** (08/20, 08/25, 08/27) as True/False concept questions.
- **His vocabulary**: "shifting" integrals, "looping" integrals, **tabular integration**
  (used 101 times across his solutions), the "rule of 7" box, LIATE, product-to-sum.
- **His handouts**: the "Linear $u$-Sub in Your Head" set (55 problems, including the
  ones that are deliberately *not* linear substitutions), the integral flashcard list,
  and the prerequisite formula sheet.
- **The syllabus calendar** — every lecture date, all three exams, the final, and both
  Gateway exams, with what each one actually covers.

### What that changes

| | |
|---|---|
| **New topics** | Linear $u$-Substitution · Tabular & Looping Parts · Product-to-Sum Integrals — all three are things he drills and no generic textbook treats separately |
| **New modes** | Covered So Far · Exam 1 / 2 / 3 / Final practice · Gateway I / II |
| **Course band** | Home and the study plan show days to the next exam and your next lecture topic, from the syllabus |
| **Scope honesty** | Differential Equations is marked **not on your syllabus** (no lecture day, zero past-exam questions) and excluded from Rapid Fire. Applications of Integration is marked **lightly covered** — the objectives list it, but only arc length has ever appeared on a paper. Both stay fully drillable. |

> **One thing to know:** the four "Exams — Problems / Solutions" links on his course page
> are currently a rickroll, not files. The Fall 2026 exams have not happened yet. The real
> past papers are in his GitHub repo, which is what this app is built from.

## What's in it

**60 topics across 7 units** — 78 hand-written problems plus 83 problem *generators*,
so nothing ever runs out. Every topic has both.

| Unit | Topics |
|---|---|
| **PRE · Prerequisite Toolkit** | exponent & radical rules, factoring & polynomial division, rational expressions, completing the square, log & exponential rules, unit circle, trig identities, inverse trig values, transformations & domain, geometry formulas, summation notation, inequalities & sign charts |
| 00 · Foundations | limits, derivative rules, chain/implicit, L'Hôpital, antiderivatives, FTC, u-sub, inverse trig & log/exp, hyperbolics |
| 01 · Techniques of Integration | **linear $u$-sub**, by parts, **tabular & looping parts**, trig integrals, **product-to-sum**, trig substitution, partial fractions, strategy, numerical integration, improper integrals |
| 02 · Applications of Integration | area between curves, disks & washers, shells, arc length, surface area, work, average value, centroids |
| 03 · Differential Equations | separable, slope fields & Euler, growth & decay, logistic, first-order linear |
| 04 · Sequences & Series | sequences, geometric & telescoping, divergence & integral tests, p-series & comparison, limit comparison, alternating series & error, ratio & root, choosing a test, power series & radius, Taylor & Maclaurin, Taylor error, applications |
| 05 · Parametric & Polar | parametric curves, parametric calculus, polar coordinates, polar area & arc length |

### The prerequisite unit exists on purpose

Most "calculus mistakes" are actually algebra or trig mistakes wearing a disguise — a
botched log rule, a dropped sign in a half-angle identity, cancelling terms instead of
factors, forgetting that $\sqrt{a+b}\ne\sqrt a+\sqrt b$. The PRE unit drills exactly
those, and because a never-seen topic carries the highest scheduling weight, a fresh
account is steered through the toolkit **before** it gets buried in series.

Unit 00 (Calc I) is mixed into every review set for the same reason.

## Writing your own answer

Multiple choice can't teach you to trust your own work, and for an integral there are
usually several correct-looking forms. So **every question has a fifth box** — press `5`
or click it — where you type your own answer, and the app decides whether it is
*mathematically equivalent* to the key.

It is a real check, not a string match. These are all accepted for
$\int \frac{\ln x}{\sqrt x}dx$:

```
2sqrt(x)ln(x) - 4sqrt(x) + C
2sqrt(x)(ln(x) - 2) + C
2*x^(1/2)*ln(x) - 4*x^0.5 + C
2\sqrt{x}\ln x-4\sqrt{x}+C          ← pasted TeX works too
```

How it works: both expressions are parsed into syntax trees and evaluated at ~40 random
sample points. Equal everywhere means equivalent. That is the same method WeBWorK and
MyOpenMath use, and it accepts every algebraically-equivalent form without shipping a
computer-algebra system. Nothing is `eval()`'d — there is a real tokenizer and
recursive-descent parser in `js/mathcheck.js`.

It also understands:

- **`+C`** — an indefinite-integral answer that differs from the key by a constant is
  accepted, so $\frac{\sin^2x}{2}$ and $-\frac{\cos^2 x}{2}$ both pass. Forget the
  `+C` entirely and it still counts, with a reminder.
- **`sin^2 x`, `tan^-1 x`, `|x|`, `2x`, `sin x`** without parentheses, implicit
  multiplication, Greek letters, and units (`4.5 J`).
- **Landing on a wrong option** — type the sign-error form and you get *that option's*
  diagnosis, exactly as if you had clicked it.
- **Its own limits** — if it cannot read or cannot verify your input, it says so and
  leaves the question ungraded. It never marks you wrong for a parser shortcoming.

Prose questions ("Diverges", "Ratio Test") accept typed words instead.

## The part that matters

Every wrong answer is written against a **specific misconception**, not a generic
"incorrect". Pick the option that squares the difference of two radii and you're told
that a washer is $\pi R^2 - \pi r^2$ and that $(R-r)^2 \ne R^2 - r^2$ — then shown the
hole in the solid that your answer filled in.

Each explanation has up to four parts:

1. **Why that option is wrong** — targeted at the exact answer you chose, and tagged
   with the *kind* of error it was
2. **Picture it** — a generated figure (14 kinds: slope fields, solids of revolution,
   partial sums, intervals of convergence, Taylor approximations, trig-sub triangles, …)
3. **Worked solution** — step by step, with the key step highlighted
4. **Remember this** — the one rule to carry into the exam

## Everything else

- **Interactive labs** (`L`) — seven slider-driven explorers: Riemann sums, Taylor
  polynomials, series convergence, solids of revolution, slope fields & Euler, polar
  curves, area between curves. Each shows a live figure plus a numeric readout
  (approximation vs exact vs error), so you can *watch* the error shrink as you push $n$ up.
- **Cheat sheet** (`C`) — the one you actually reach for mid-problem. A full **unit
  circle** with every exact value (and a "blank it" toggle to self-test, like his
  handout), all the derivative and integral rules side by side, trig identities,
  technique triggers, every series test with its gotcha, the core Taylor series, and
  algebra. Filterable. Opens over any screen without interrupting a drill.
- **Formula sheet** (`F`) — the same material as a full printable page, 91 formulas
  grouped by unit, including his integral-flashcard list and the product-to-sum rules.
- **Topic primers** — a short orientation card for each of the 57 topics: the idea, the
  moves, and where it goes wrong. Plus a per-topic notes field that saves as you type.
- **Error-pattern analytics** — every distractor is classified (sign errors, missing
  chain rule, dropped factors, inverted, formula mix-ups, exponent bookkeeping, illegal
  cancelling, off-by-one, concept gaps, …). Progress shows your top patterns with a
  specific fix for each. This tells you *how* you're wrong, not just *what* you missed.
- **Practice heatmap** — 18 weeks of activity at a glance, with day streaks.
- **13 achievements** — streaks, volume, unit mastery, emptying the mistake bank.
- **Study plan** (`K`) — set your exam date and get a day-by-day schedule, ordered by
  what you're actually weakest at, with a one-click drill for each day.
- **Printable worksheets** (`W`) — generates a fresh practice set with a separate
  answer key page. Print or save as PDF for offline work.
- **Progressive hints** (`H`) — one nudge, then the first solution step, then the rule.
- **Search** (`/`) — jump to any topic, formula, or lab. Arrow keys and Enter.
- **Two themes** — dark "blueprint" and light "paper" graph paper. `T` toggles.

## Progress and scheduling

Each of the 57 topics carries a mastery level (0–5) and a review date. Levels rise with
correct answers, fall on misses, and decay when a topic goes untouched — so the question
chooser keeps steering toward whatever is weakest, due, or stale. With **adaptive** on,
it also matches question difficulty to your level.

Progress lives in `localStorage`. Export/import buttons on the Progress screen move it
between browsers; **Reset everything** wipes it.

## Layout

```
index.html            entry point
run.sh                local server
css/app.css           design system (dark "blueprint" + light "paper" themes)
js/
  main.js             router, keyboard control, per-question timer
  session.js          question selection, session state, grading
  store.js            progress, mastery, spaced repetition, error taxonomy
  ui.js               topbar, home, drill, feedback, summary
  screens.js          progress, reference, labs, plan, worksheet, overlays
  explore.js          the seven interactive labs
  viz.js              SVG figure engine (14 figure types)
  cheatsheet.js       the C overlay (unit circle + quick reference)
  mathcheck.js        answer parser + numeric equivalence checker
  util.js             TeX rendering, seeded RNG, helpers
  bank/
    index.js          curriculum map + registry
    formulas.js       the reference sheet
    primers.js        per-topic orientation cards
    course.js         syllabus calendar, exam dates and coverage
    lessons.js        the semester teaching program (27 lessons)
    wide.js           formula-driven generators for Techniques of Integration
    checkins.js       his real in-class check-ins
    precalc.js  foundations.js  techniques.js  applications.js
    diffeq.js   series.js       polar.js       exams.js  taylor.js
tools/
  serve.py            local server (no-store, so edits always take)
  check-bank.mjs      content self-check (node)
  check-answers.mjs   answer-checker regression suite (node)
  verify-math.mjs     numeric proof that each key answers its own prompt (node)
  selftest.js         end-to-end UI self-test (browser)
vendor/katex/         math rendering (vendored — works offline)
assets/fonts/         Fraunces + IBM Plex (vendored — works offline)
```

## Testing

Four suites, all worth running after any edit.

**Content** — validates every written problem and 600 seeded instances of every
generator (49,878 instances, ~3s):

```bash
node tools/check-bank.mjs
```

It checks each one for a unique correct answer, four *distinct* options, a diagnosis on
every distractor, an evenly spread answer position, no machine artifacts in the TeX, and
a figure that actually renders. Exits non-zero on failure.

It also counts **distinct prompts per topic**, because instance count is not variety:
`gx-tabular-xn-trig` produced 600 valid instances of four problems. Anything under 12
distinct is listed as a backlog; under 6 is an error. And it verifies every difficulty
the bank uses is inside `DIFF_BAND.all` — that list once stopped at 3, which silently
made 21 sources unreachable, including most of his hardest check-ins.

> The seed count matters. At 40 seeds it reported clean while two generators still
> collided roughly once in a thousand — rare enough to hide, common enough that you'd
> hit it in a week of drilling.

**Answer checker** — 30 hand-written equivalence cases plus a sweep of the whole bank
(every key must grade itself correct; no distractor may be accepted):

```bash
node tools/check-answers.mjs
```

**Mathematics** — the other suites check that a problem is well *formed*; this one
checks that it is *right*. It reads each prompt, works out what is being asked, and
verifies the key numerically — differentiating claimed antiderivatives and comparing
them against the integrand, integrating definite integrals, differentiating the
functions in derivative questions, evaluating limits near the point, summing series,
and applying FTC Part 1 to moving limits:

```bash
node tools/verify-math.mjs            # 40 seeds per generator
node tools/verify-math.mjs --seeds=250 --skips
```

At 250 seeds that is 7,998 problems verified out of 22,392 examined — integrals,
derivatives, limits, FTC, average value, series sums, and series convergence verdicts. The rest are
genuinely not numeric — convergence verdicts, "which technique first", set-up-only
questions — and `--skips` prints exactly why each was passed over, so the coverage
figure is honest rather than flattering. Questions whose answer is *deliberately*
inexact (Trapezoid/Simpson, truncated Maclaurin series) are excluded by name.

Series verdicts go through a numeric convergence oracle (ratio test, then a
power-law fit on the tail). The oracle is itself tested, because one that always
answered "converges" would also report zero defects:

```bash
node tools/verify-math.mjs --oracle-selftest
```

It gets 13 of 16 known series right and **refuses** the other three rather than
guessing — the harmonic series and two log-modified ones sit too close to $p=1$
to separate numerically. A checker that never lies is worth more than one with
full coverage.

It has already caught three real defects: a limit generator whose `+x` tail merged
with a degree-1 leading term and silently changed the answer, a partial-fractions
key that printed `+-3/2` and `+0\ln(x^2+1)`, and an FTC key reading `2x^{1}`.

**Application** — drives the real UI: every topic, every mode, hints, stars, the
mistake-bank round trip, all seven labs, every screen, persistence and schema
migration. Open the app and run in the console:

```js
await import('/tools/selftest.js')
```

It snapshots your progress first and restores it afterwards, then prints a table.
Currently 67/67.

### Adding a problem

Drop an object into the relevant `bank/*.js` file:

```js
P.push({
  id: 't-my-problem', topic: 'Integration by Parts', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int \\ln x\\,dx$.',
  choices: [
    { t: '$x\\ln x - x + C$', ok: true },
    { t: '$x\\ln x + C$', why: 'You found $uv$ but never subtracted $\\int v\\,du$.', err: 'dropped-factor' },
  ],
  steps: ['...'],            // worked solution
  recall: 'The rule to remember.',
  viz: { kind: 'plot', /* ... */ },   // optional
});
```

`topic` must match a string in that unit's `topics` array in `bank/index.js`, and every
topic needs an entry in `bank/primers.js`. Every distractor needs a `why` — that's the
whole point of the app. `err` is optional; without it the error type is inferred from
the wording. Text is rendered with `$…$` for inline math and `**bold**` for emphasis.

A *generator* is the same shape but returned from `make(rng)` using the seeded helpers
(`r.int`, `r.pick`, `r.nz`, `r.shuffle`). Build distractors with
`choose(key, [...spares])` and **give it more spares than you need** — it drops any that
collide with the answer or each other, which happens more often than you'd expect when
parameters line up.

## Notes

- Choice order is shuffled per problem, seeded from the problem's identity — so the
  answer isn't always in the same slot, but revisiting a problem from the Mistake Bank
  shows the same ordering.
- KaTeX and the fonts are vendored locally; everything works with no internet.
- Saves are debounced but flushed on `pagehide`, so closing the tab mid-drill doesn't
  lose the last answer.

## Course data update — 2026-09-17

Re-verified `js/bank/course.js` and `js/bank/lessons.js` against the syllabus schedule (p.25), the Blackboard calendar and gradebook, and the dated lecture-note folders on Blackboard:

- **Lecture calendar fixed.** 08/27 → Trigonometric Integrals, 09/01 → Trig Substitution, 09/03 & 09/08 → Partial Fractions, 09/10 → Improper Integrals, 09/15 → Arc Length & Surface Area, 09/17 → Integration Review. The old file had these one class late, so "Covered So Far" and the catch-up queue were lagging. Lesson dates moved to match.
- **Real deadlines added** to the calendar (kind `due`): every MyOpenMath homework, lab, and both Gateway deadlines. They never count as "next class".
- **Gateways** now carry their Blackboard deadlines — Gateway I 09/01 6 PM, **Gateway II Fri 10/23 6 PM** (proctored, Math Lab, all-or-nothing) — so the home band counts down to them.
- **Final exam** is Thu **12/10 12:30 PM, LeConte 444** (Blackboard calendar), not 12/08.
- **Exam 1 scope** now includes Arc Length and Surface Area (lectured 09/15, with an 8-point homework).

Semester-wide notes, every due date and a daily plan live in `School/Claude assignment scraper/fall 2026/_knowledge/`.
