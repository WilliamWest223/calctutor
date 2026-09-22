// ---------------------------------------------------------------
// cheatsheet.js — the `C` overlay. Opens over whatever you are doing,
// including mid-question, and closes without touching the session.
//
// Dense on purpose: this is a reference you scan, not read.
// ---------------------------------------------------------------
import { h, tex, clear } from './util.js';

// ---------------------------------------------------------------
// the unit circle — laid out in HTML so every label can be real TeX
// ---------------------------------------------------------------
const CIRCLE = [
  [0, '0', '1', '0'],
  [30, '\\frac{\\pi}{6}', '\\frac{\\sqrt3}{2}', '\\frac12'],
  [45, '\\frac{\\pi}{4}', '\\frac{\\sqrt2}{2}', '\\frac{\\sqrt2}{2}'],
  [60, '\\frac{\\pi}{3}', '\\frac12', '\\frac{\\sqrt3}{2}'],
  [90, '\\frac{\\pi}{2}', '0', '1'],
  [120, '\\frac{2\\pi}{3}', '-\\frac12', '\\frac{\\sqrt3}{2}'],
  [135, '\\frac{3\\pi}{4}', '-\\frac{\\sqrt2}{2}', '\\frac{\\sqrt2}{2}'],
  [150, '\\frac{5\\pi}{6}', '-\\frac{\\sqrt3}{2}', '\\frac12'],
  [180, '\\pi', '-1', '0'],
  [210, '\\frac{7\\pi}{6}', '-\\frac{\\sqrt3}{2}', '-\\frac12'],
  [225, '\\frac{5\\pi}{4}', '-\\frac{\\sqrt2}{2}', '-\\frac{\\sqrt2}{2}'],
  [240, '\\frac{4\\pi}{3}', '-\\frac12', '-\\frac{\\sqrt3}{2}'],
  [270, '\\frac{3\\pi}{2}', '0', '-1'],
  [300, '\\frac{5\\pi}{3}', '\\frac12', '-\\frac{\\sqrt3}{2}'],
  [315, '\\frac{7\\pi}{4}', '\\frac{\\sqrt2}{2}', '-\\frac{\\sqrt2}{2}'],
  [330, '\\frac{11\\pi}{6}', '\\frac{\\sqrt3}{2}', '-\\frac12'],
];

function unitCircle() {
  const box = h('div.ucwrap');
  const stage = h('div.ucstage');
  stage.appendChild(h('div.uccircle'));
  stage.appendChild(h('div.ucaxis.h'));
  stage.appendChild(h('div.ucaxis.v'));

  for (const [deg, rad, cos, sin] of CIRCLE) {
    const th = (deg * Math.PI) / 180;
    // R must match .uccircle's radius (inset 14% -> radius 36%) or the dots
    // float off the ring
    const R = 36;
    const put = (el, frac) => {
      el.style.left = `${50 + Math.cos(th) * R * frac}%`;
      el.style.top = `${50 - Math.sin(th) * R * frac}%`;
      return el;
    };
    stage.appendChild(put(h('span.ucdot'), 1));
    stage.appendChild(put(h('span.ucang', { html: tex(`$${rad}$`) }), 0.74));
    stage.appendChild(put(h('span.uccoord', { html: tex(`$\\left(${cos},\\,${sin}\\right)$`) }), 1.2));
  }
  box.appendChild(stage);
  box.appendChild(h('div.uclegend', { html: tex('Each point is $(\\cos\\theta,\\;\\sin\\theta)$. $\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$ — the $y$-coordinate over the $x$-coordinate.') }));
  return box;
}

// ---------------------------------------------------------------
// content — [label, tex] pairs, or {n, t, note} rows
// ---------------------------------------------------------------
const SECTIONS = [
  {
    id: 'circle', name: 'Unit circle', custom: unitCircle,
    keywords: 'unit circle sin cos tan exact values radians degrees quadrant astc',
  },
  {
    id: 'deriv', name: 'Derivatives',
    cols: [
      ['Power', '\\frac{d}{dx}x^{n}=nx^{n-1}'],
      ['Product', '(uv)\'=u\'v+uv\''],
      ['Quotient', '\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^{2}}'],
      ['Chain', '\\frac{d}{dx}f(g(x))=f\'(g(x))\\,g\'(x)'],
      ['—', ''],
      ['\\sin x', '\\cos x'],
      ['\\cos x', '-\\sin x'],
      ['\\tan x', '\\sec^{2}x'],
      ['\\cot x', '-\\csc^{2}x'],
      ['\\sec x', '\\sec x\\tan x'],
      ['\\csc x', '-\\csc x\\cot x'],
      ['—', ''],
      ['e^{x}', 'e^{x}'],
      ['a^{x}', 'a^{x}\\ln a'],
      ['\\ln x', '\\dfrac1x'],
      ['\\log_a x', '\\dfrac{1}{x\\ln a}'],
      ['—', ''],
      ['\\sin^{-1}x', '\\dfrac{1}{\\sqrt{1-x^{2}}}'],
      ['\\cos^{-1}x', '-\\dfrac{1}{\\sqrt{1-x^{2}}}'],
      ['\\tan^{-1}x', '\\dfrac{1}{1+x^{2}}'],
      ['\\sec^{-1}x', '\\dfrac{1}{|x|\\sqrt{x^{2}-1}}'],
      ['—', ''],
      ['\\sinh x', '\\cosh x'],
      ['\\cosh x', '\\sinh x'],
      ['\\tanh x', '\\operatorname{sech}^{2}x'],
    ],
    note: 'Hyperbolic derivatives have **no** sign flips — that is the whole difference from circular trig.',
  },
  {
    id: 'integ', name: 'Integrals',
    cols: [
      ['x^{n}\\,(n\\ne-1)', '\\dfrac{x^{n+1}}{n+1}+C'],
      ['\\dfrac1x', '\\ln|x|+C'],
      ['e^{x}', 'e^{x}+C'],
      ['a^{x}', '\\dfrac{a^{x}}{\\ln a}+C'],
      ['\\ln x', 'x\\ln x-x+C'],
      ['—', ''],
      ['\\sin x', '-\\cos x+C'],
      ['\\cos x', '\\sin x+C'],
      ['\\tan x', '\\ln|\\sec x|+C'],
      ['\\cot x', '\\ln|\\sin x|+C'],
      ['\\sec x', '\\ln|\\sec x+\\tan x|+C'],
      ['\\csc x', '\\ln|\\csc x-\\cot x|+C'],
      ['—', ''],
      ['\\sec^{2}x', '\\tan x+C'],
      ['\\csc^{2}x', '-\\cot x+C'],
      ['\\sec x\\tan x', '\\sec x+C'],
      ['\\csc x\\cot x', '-\\csc x+C'],
      ['—', ''],
      ['\\dfrac{1}{a^{2}+x^{2}}', '\\dfrac1a\\tan^{-1}\\dfrac xa+C'],
      ['\\dfrac{1}{\\sqrt{a^{2}-x^{2}}}', '\\sin^{-1}\\dfrac xa+C'],
      ['\\dfrac{1}{x\\sqrt{x^{2}-a^{2}}}', '\\dfrac1a\\sec^{-1}\\left|\\dfrac xa\\right|+C'],
      ['\\sinh x', '\\cosh x+C'],
      ['\\cosh x', '\\sinh x+C'],
    ],
    note: 'Arctan carries the $\\frac1a$; arcsin does **not**. Linear inside → divide by the inner coefficient.',
  },
  {
    id: 'trig', name: 'Trig identities',
    rows: [
      { n: 'Pythagorean', t: '\\sin^{2}\\theta+\\cos^{2}\\theta=1' },
      { n: '', t: '1+\\tan^{2}\\theta=\\sec^{2}\\theta,\\qquad 1+\\cot^{2}\\theta=\\csc^{2}\\theta' },
      { n: 'Double angle', t: '\\sin2\\theta=2\\sin\\theta\\cos\\theta' },
      { n: '', t: '\\cos2\\theta=\\cos^{2}\\theta-\\sin^{2}\\theta=1-2\\sin^{2}\\theta=2\\cos^{2}\\theta-1' },
      { n: 'Half angle', t: '\\sin^{2}\\theta=\\frac{1-\\cos2\\theta}{2},\\qquad \\cos^{2}\\theta=\\frac{1+\\cos2\\theta}{2}', note: 'Sine takes the minus. Check with $\\theta=0$.' },
      { n: 'Product-to-sum', t: '\\sin\\theta\\cos\\phi=\\frac{\\sin(\\theta+\\phi)+\\sin(\\theta-\\phi)}{2}' },
      { n: '', t: '\\cos\\theta\\cos\\phi=\\frac{\\cos(\\theta-\\phi)+\\cos(\\theta+\\phi)}{2}' },
      { n: '', t: '\\sin\\theta\\sin\\phi=\\frac{\\cos(\\theta-\\phi)-\\cos(\\theta+\\phi)}{2}' },
      { n: 'Sum & difference', t: '\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta' },
      { n: '', t: '\\cos(\\alpha\\pm\\beta)=\\cos\\alpha\\cos\\beta\\mp\\sin\\alpha\\sin\\beta' },
      { n: 'Inverse ranges', t: '\\sin^{-1}\\!\\in\\!\\left[-\\tfrac\\pi2,\\tfrac\\pi2\\right],\\;\\; \\cos^{-1}\\!\\in\\![0,\\pi],\\;\\; \\tan^{-1}\\!\\in\\!\\left(-\\tfrac\\pi2,\\tfrac\\pi2\\right)' },
    ],
  },
  {
    id: 'tech', name: 'Techniques',
    rows: [
      { n: 'Strategy order', t: '\\text{simplify}\\;\\to\\;u\\text{-sub}\\;\\to\\;\\text{parts}\\;\\to\\;\\text{trig identity / sub}\\;\\to\\;\\text{partial fractions}', note: 'Always scan for a $u$-sub first.' },
      { n: 'Linear $u$-sub', t: '\\int f(ax+b)\\,dx=\\tfrac1a F(ax+b)+C', note: 'Do it in your head. Only when the inside is linear.' },
      { n: 'By parts', t: '\\int u\\,dv=uv-\\int v\\,du', note: 'LIATE picks $u$: Log, Inverse trig, Algebraic, Trig, Exponential. Never pick a $dv$ you cannot integrate.' },
      { n: 'Tabular', t: '\\text{derivatives}\\;\\downarrow\\;\\text{until }0,\\quad \\text{antiderivatives}\\;\\downarrow,\\quad \\text{pair diagonally},\\;+,-,+,-', note: 'Use when the polynomial factor dies.' },
      { n: 'Looping', t: 'I=\\cdots+kI\\;\\Rightarrow\\;(1-k)I=\\cdots', note: 'Neither factor dies — parts twice, then solve for $I$. Keep $u$ and $dv$ consistent.' },
      { n: 'Trig powers', t: '\\int\\sin^{m}x\\cos^{n}x\\,dx', note: 'Odd power → peel one off for $du$. Both even → half-angle. Different arguments → product-to-sum.' },
      { n: 'Trig sub', t: '\\sqrt{a^{2}-x^{2}}\\to a\\sin\\theta,\\quad \\sqrt{a^{2}+x^{2}}\\to a\\tan\\theta,\\quad \\sqrt{x^{2}-a^{2}}\\to a\\sec\\theta', note: 'Draw the triangle immediately — you need it to convert back.' },
      { n: 'Partial fractions', t: '\\frac{A_1}{x-a}+\\cdots+\\frac{A_k}{(x-a)^{k}}+\\frac{Bx+C}{x^{2}+bx+c}', note: 'Numerator degree must be lower — divide first. Repeated factor gets every power. Irreducible quadratic gets $Bx+C$.' },
      { n: 'Improper', t: '\\int_1^\\infty x^{-p}\\;\\text{conv}\\iff p>1;\\qquad \\int_0^1 x^{-p}\\;\\text{conv}\\iff p<1', note: 'Opposite directions. Split at every singularity — including interior ones.' },
    ],
  },
  {
    id: 'tests', name: 'Series tests',
    rows: [
      { n: 'Divergence', t: '\\lim a_n\\ne0\\;\\Rightarrow\\;\\text{diverges}', note: 'One-way. $\\lim a_n=0$ proves nothing. Check it first — it is free.' },
      { n: 'Geometric', t: '\\sum ar^{n}=\\frac{a}{1-r}\\;(|r|<1)', note: '$a$ is the first term **actually present**.' },
      { n: 'Telescoping', t: 's_N=\\text{first terms}-\\text{last terms}', note: 'Write $s_N$ out explicitly and see what survives.' },
      { n: '$p$-series', t: '\\sum\\frac{1}{n^{p}}\\;\\text{conv}\\iff p>1' },
      { n: 'Integral', t: '\\sum f(n)\\;\\text{and}\\;\\int f\\;\\text{agree}', note: 'Needs $f$ continuous, positive, decreasing.' },
      { n: 'Comparison', t: 'a_n\\le b_n:\\;\\textstyle\\sum b_n\\,\\text{conv}\\Rightarrow\\sum a_n\\,\\text{conv}', note: 'Smaller than convergent, or bigger than divergent. Nothing else concludes.' },
      { n: 'Limit comparison', t: '\\lim\\frac{a_n}{b_n}=L\\in(0,\\infty)\\;\\Rightarrow\\;\\text{same behaviour}', note: 'Keep leading powers, subtract exponents. A square root halves the degree.' },
      { n: 'Alternating', t: 'b_n\\downarrow0\\;\\Rightarrow\\;\\text{converges};\\qquad |S-s_n|\\le b_{n+1}', note: 'Error is the first term you left **out**.' },
      { n: 'Ratio', t: 'L=\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|', note: '$L<1$ conv, $L>1$ div, $L=1$ nothing. For factorials and $n$th powers.' },
      { n: 'Root', t: 'L=\\lim\\sqrt[n]{|a_n|}', note: 'When the whole term is an $n$th power.' },
      { n: 'Absolute', t: '\\sum|a_n|\\;\\text{conv}\\;\\Rightarrow\\;\\sum a_n\\;\\text{conv}', note: 'Always test $\\sum|a_n|$ first. Conv but not absolutely = conditionally.' },
    ],
  },
  {
    id: 'taylor', name: 'Series & Taylor',
    rows: [
      { n: 'Taylor', t: 'f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^{n}' },
      { n: 'Remainder', t: '|R_n(x)|\\le\\frac{M|x-a|^{n+1}}{(n+1)!},\\quad M\\ge\\left|f^{(n+1)}\\right|', note: 'Degree $n$ → derivative $n+1$. $M$ bounds the whole interval.' },
      { n: 'Geometric', t: '\\frac{1}{1-x}=\\sum_{n=0}^{\\infty}x^{n},\\qquad |x|<1' },
      { n: 'Exponential', t: 'e^{x}=\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!},\\qquad \\text{all }x' },
      { n: 'Sine', t: '\\sin x=\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}' },
      { n: 'Cosine', t: '\\cos x=\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{2n}}{(2n)!}' },
      { n: 'Log', t: '\\ln(1+x)=\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}x^{n}}{n},\\qquad -1<x\\le1' },
      { n: 'Arctangent', t: '\\tan^{-1}x=\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{2n+1}}{2n+1},\\qquad |x|\\le1' },
      { n: 'Radius', t: '|x-c|<R\\;\\text{from the Ratio Test}', note: 'Endpoints are never settled by the Ratio Test — substitute and test each one.' },
      { n: 'Factorials', t: '\\text{denominator}\\Rightarrow R=\\infty;\\qquad \\text{numerator}\\Rightarrow R=0' },
    ],
  },
  {
    id: 'algebra', name: 'Algebra',
    rows: [
      { n: 'Exponents', t: 'x^{a}x^{b}=x^{a+b},\\quad \\frac{x^{a}}{x^{b}}=x^{a-b},\\quad (x^{a})^{b}=x^{ab}' },
      { n: '', t: 'x^{-n}=\\frac{1}{x^{n}},\\qquad \\sqrt[n]{x^{m}}=x^{m/n}' },
      { n: 'Logs', t: '\\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac ab=\\ln a-\\ln b,\\quad \\ln a^{b}=b\\ln a', note: 'There is **no** rule for $\\ln(a+b)$.' },
      { n: '', t: 'e^{\\ln x}=x,\\qquad \\ln e^{x}=x,\\qquad b^{x}=e^{x\\ln b}' },
      { n: 'Factoring', t: 'a^{2}-b^{2}=(a-b)(a+b),\\qquad a^{3}\\pm b^{3}=(a\\pm b)(a^{2}\\mp ab+b^{2})', note: 'SOAP. A sum of squares does not factor over the reals.' },
      { n: 'Completing sq.', t: 'x^{2}+bx+c=\\left(x+\\tfrac b2\\right)^{2}+c-\\tfrac{b^{2}}{4}' },
      { n: 'Absolute value', t: '|x-c|<R\\iff c-R<x<c+R', note: 'Exactly an interval of convergence.' },
      { n: 'Sums', t: '\\sum_{i=1}^{n}i=\\frac{n(n+1)}{2},\\qquad \\sum_{i=1}^{n}i^{2}=\\frac{n(n+1)(2n+1)}{6}' },
      { n: 'Growth order', t: '\\ln n\\;\\ll\\;n^{p}\\;\\ll\\;e^{n}\\;\\ll\\;n!\\;\\ll\\;n^{n}' },
      { n: 'Geometry', t: 'A_{\\bigcirc}=\\pi r^{2},\\;\\; C=2\\pi r,\\;\\; V_{\\text{sph}}=\\tfrac43\\pi r^{3},\\;\\; V_{\\text{cone}}=\\tfrac13\\pi r^{2}h' },
    ],
  },
];

// ---------------------------------------------------------------
export function cheatsheet(close) {
  let blank = false;

  const body = h('div.csbody');
  const nav = h('div.csnav');
  const search = h('input.searchbox.cssearch', { type: 'search', placeholder: 'Filter — "sec", "ratio", "half angle"…' });

  function sectionNode(sec) {
    const box = h('section.cssection', { 'data-id': sec.id });
    box.appendChild(h('h3.cshead', sec.name,
      sec.id === 'circle'
        ? h('button.btn.sm.ghost', {
          style: { marginLeft: 'auto' },
          onclick: e => {
            blank = !blank;
            box.classList.toggle('blank', blank);
            e.target.textContent = blank ? 'show values' : 'blank it';
          },
        }, 'blank it')
        : null));

    if (sec.custom) { box.appendChild(sec.custom()); return box; }

    if (sec.cols) {
      const tbl = h('div.cstable');
      for (const [l, r] of sec.cols) {
        if (l === '—') { tbl.appendChild(h('div.csrule')); continue; }
        tbl.appendChild(h('div.csrow',
          h('span.csl', { html: tex(`$${l}$`) }),
          h('span.csarrow', '→'),
          h('span.csr', { html: tex(`$${r}$`) })));
      }
      box.appendChild(tbl);
    }
    if (sec.rows) {
      const list = h('div.csrows');
      for (const r of sec.rows) {
        list.appendChild(h('div.csitem',
          r.n ? h('div.csname', { html: tex(r.n) }) : h('div.csname'),
          h('div.csmath', { html: tex(`$$${r.t}$$`) }),
          r.note ? h('div.csnote', { html: tex(r.note) }) : null));
      }
      box.appendChild(list);
    }
    if (sec.note) box.appendChild(h('div.csfoot', { html: tex(sec.note) }));
    return box;
  }

  const nodes = SECTIONS.map(s => ({ sec: s, node: sectionNode(s) }));
  nodes.forEach(({ node }) => body.appendChild(node));

  SECTIONS.forEach(s => nav.appendChild(h('button.cstab', {
    onclick: () => {
      const target = body.querySelector(`[data-id="${s.id}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  }, s.name)));

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    for (const { sec, node } of nodes) {
      if (!q) { node.style.display = ''; node.querySelectorAll('.csrow,.csitem').forEach(e => { e.style.display = ''; }); continue; }
      const hay = `${sec.name} ${sec.keywords || ''}`.toLowerCase();
      let anyRow = false;
      node.querySelectorAll('.csrow,.csitem').forEach(e => {
        const hit = e.textContent.toLowerCase().includes(q);
        e.style.display = hit ? '' : 'none';
        if (hit) anyRow = true;
      });
      const secHit = hay.includes(q);
      node.style.display = (anyRow || secHit) ? '' : 'none';
      if (secHit && !anyRow) node.querySelectorAll('.csrow,.csitem').forEach(e => { e.style.display = ''; });
    }
  });

  const back = h('div.overlay.csoverlay', { onclick: e => { if (e.target === back) close(); } },
    h('div.cssheet',
      h('div.cstop',
        h('h2', 'Cheat sheet'),
        search,
        h('button.iconbtn', { title: 'Close (Esc or C)', onclick: close }, '✕')),
      nav,
      body));
  setTimeout(() => search.focus(), 30);
  return back;
}
