// bank/mock3.js — four Exam 3 mocks: A, B (ids m3a-q*, m3b-q*), C = Spring '26 replica (m3c-q*),
// D = same archetypes, new numbers (m3d-q*). A/B follow the shape of his paper:
// table, from-scratch series, IOC with endpoints, substitution, sum by recognition,
// T_n + remainder, abs/cond, ratio/root.
import { mk } from './taylor.js';
const P = [];
const G = [];
const R = String.raw;
const TM = 'Taylor & Maclaurin Series', TP = 'Taylor Polynomials & Error', AP = 'Applications of Series', PS = 'Power Series & Radius';
const add = (mock, q, o) => P.push(mk({ ...o, id: `m3${mock}-q${q}`, src: `Mock Exam 3 ${mock.toUpperCase()} Q${q}` }));

// =============================== Mock A ===============================
add('a', 1, {
  topic: TM, diff: 2,
  prompt: R`Which line gives the Maclaurin series of $\ln(1+x)$ together with its interval of convergence?`,
  key: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$, converging on $(-1,1]$`,
  wrong: [
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$, converging on $[-1,1]$`, R`At $x=-1$ the series is $-\sum\frac1n$, which diverges.`, 'endpoints'],
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n!}$, converging on $(-\infty,\infty)$`, R`No factorial: $\ln(1+x)$ comes from integrating $\frac{1}{1+x}$, giving plain $n$ and radius $1$.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}x^{n}$, converging on $(-1,1)$`, R`That is $\frac{1}{1+x}$. Integrate term by term to get $\ln(1+x)$.`, 'formula-confusion'],
  ],
  keyWhy: R`Radius $1$; $x=1$ gives alternating harmonic (converges), $x=-1$ gives $-$harmonic (diverges).`,
  hints: [R`Integrate $\frac{1}{1+x}=\sum(-x)^n$ term by term.`],
  steps: [R`$\ln(1+x)=\int_0^x\frac{dt}{1+t}=\sum_{n\ge0}\frac{(-1)^{n}x^{n+1}}{n+1}$.`, R`Radius $1$. Test $x=\pm1$ separately.`],
  recall: R`$\ln(1+x)$: $(-1,1]$.`,
});
add('a', 2, {
  topic: TM, diff: 4,
  prompt: R`Derive the Taylor series for $f(x)=\dfrac{1}{x^{2}}$ centred at $x=1$ from the definition.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}(n+1)(x-1)^{n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}(n+1)(x-1)^{n}$`, R`Signs alternate: $f'(1)=-2$, $f''(1)=6$, $f'''(1)=-24$.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}(n+1)}{n!}(x-1)^{n}$`, R`$f^{(n)}(1)=(-1)^n(n+1)!$; dividing by $n!$ leaves $(n+1)$.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}(n+1)x^{n}$`, R`Powers must be $(x-1)^n$.`, 'setup'],
  ],
  keyWhy: R`$f^{(n)}(x)=(-1)^{n}(n+1)!\,x^{-(n+2)}$, so $f^{(n)}(1)=(-1)^{n}(n+1)!$.`,
  hints: [R`Compute $f(1),f'(1),f''(1),f'''(1)$: $1,-2,6,-24$.`],
  steps: [R`$f=x^{-2},\ f'=-2x^{-3},\ f''=6x^{-4},\ f'''=-24x^{-5}$.`, R`At $1$: $1,-2,6,-24=(-1)^n(n+1)!$.`, R`Divide by $n!$: $(-1)^n(n+1)$.`],
  recall: R`Derive from scratch: derivatives at the centre as numbers, find pattern, divide by $n!$.`,
});
add('a', 3, {
  topic: PS, diff: 4,
  prompt: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}(x+1)^{n}}{n\,3^{n}}$.`,
  key: R`$(-4,\,2]$`,
  wrong: [
    [R`$[-4,\,2]$`, R`At $x=-4$ the series is $\sum\frac1n$ (harmonic) -- diverges.`, 'endpoints'],
    [R`$[-4,\,2)$`, R`Reversed: $x=2$ gives $\sum\frac{(-1)^n}{n}$ (converges) and $x=-4$ diverges.`, 'endpoints'],
    [R`$(-3,\,3)$`, R`Centre is $-1$, so the interval is centred at $-1$: $(-4,2)$ before endpoints.`, 'setup'],
  ],
  keyWhy: R`Ratio test gives $|x+1|<3$, so $(-4,2)$; $x=2$ converges conditionally; $x=-4$ diverges.`,
  hints: [R`Ratio test for $R$, centre $-1$.`],
  steps: [R`$\left|\frac{a_{n+1}}{a_n}\right|\to\frac{|x+1|}{3}<1\Rightarrow |x+1|<3$.`, R`$x=2$: $\sum\frac{(-1)^n}{n}$ converges. $x=-4$: $\sum\frac1n$ diverges.`],
  recall: R`Always test endpoints separately; the Ratio Test is inconclusive there.`,
});
add('a', 4, {
  topic: TM, diff: 3,
  prompt: R`Find the Maclaurin series for $x^{2}e^{-x^{3}}$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n+2}}{n!}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{3n+2}}{n!}$`, R`Substituting $-x^3$ gives $(-1)^n$.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n}}{n!}$`, R`You dropped the outside factor $x^2$.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n+5}}{n!}$`, R`Powers multiply: $(x^3)^n=x^{3n}$, so the exponent is $3n+2$, not $n+5$.`, 'algebra-slip'],
  ],
  keyWhy: R`$e^{u}=\sum\frac{u^n}{n!}$ with $u=-x^3$ times $x^2$.`,
  hints: [R`Replace $u$ by $-x^3$, then multiply by $x^2$.`],
  steps: [R`$e^{-x^{3}}=\sum\frac{(-x^{3})^{n}}{n!}=\sum\frac{(-1)^nx^{3n}}{n!}$.`, R`Multiply by $x^2$.`],
  recall: R`Substitute first, then multiply.`,
});
add('a', 5, {
  topic: AP, diff: 3,
  prompt: R`Find the exact value of $\displaystyle\sum_{n=2}^{\infty}\frac{3^{n}}{n!}$.`,
  key: R`$e^{3}-4$`,
  wrong: [
    [R`$e^{3}$`, R`The sum starts at $n=2$; the $n=0,1$ terms ($1+3$) are missing.`, 'off-by-one'],
    [R`$e^{3}-1$`, R`Remove both $n=0$ and $n=1$ terms.`, 'off-by-one'],
    [R`$e^{3}-3$`, R`You removed only the $n=1$ term.`, 'off-by-one'],
  ],
  keyWhy: R`$\sum_{n\ge0}\frac{3^n}{n!}=e^3$; subtract $1+3$.`,
  hints: [R`Match $e^{x}$ with $x=3$.`],
  steps: [R`$e^{3}=1+3+\sum_{n\ge2}\frac{3^n}{n!}$.`],
  recall: R`Check the starting index and subtract skipped terms.`,
});
add('a', 6, {
  topic: TP, diff: 4,
  prompt: R`Let $T_4$ be the degree-4 Maclaurin polynomial of $\cos x$. Using the Taylor Remainder Theorem, give a bound on $|\cos x-T_4(x)|$ for $|x|\le1$.`,
  key: R`$\dfrac{1}{120}$`,
  wrong: [
    [R`$\dfrac{1}{24}$`, R`$T_4$ uses $f^{(5)}$ and $5!$, not $4!$.`, 'off-by-one'],
    [R`$\dfrac{1}{720}$`, R`$6!$ is one too many; $(n+1)!=5!=120$.`, 'off-by-one'],
    [R`$0$`, R`The error is $0$ only at $x=0$.`, 'conceptual'],
  ],
  keyWhy: R`$|f^{(5)}|=|\sin|\le1$, $|x|^5\le1$, so $|R_4|\le\frac{1}{5!}$.`,
  hints: [R`Fifth derivative of $\cos x$ is $-\sin x$.`],
  steps: [R`$|R_4|\le\frac{M|x|^{5}}{5!}$, $M=1$.`],
  recall: R`Degree $n$: $(n+1)$th derivative, $(n+1)!$.`,
});
add('a', 7, {
  topic: 'Alternating Series & Error', diff: 3,
  prompt: R`Classify $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n^{3/2}}$.`,
  key: R`Converges absolutely`,
  wrong: [
    [R`Converges conditionally`, R`$\sum\frac{1}{n^{3/2}}$ is a convergent $p$-series ($p=\frac32>1$), so it converges absolutely.`, 'test-logic'],
    [R`Diverges`, R`Terms $\to0$ and it alternates; moreover it converges absolutely.`, 'test-logic'],
    [R`Cannot be determined`, R`The $p$-series test decides it.`, 'conceptual'],
  ],
  keyWhy: R`$\sum|a_n|=\sum n^{-3/2}$ converges ($p>1$).`,
  hints: [R`Test the absolute series first.`],
  steps: [R`$\sum n^{-3/2}$: $p=\frac32>1$, converges.`],
  recall: R`Absolute first; conditional only if absolute fails.`,
});
add('a', 8, {
  topic: 'Ratio & Root Tests', diff: 3,
  prompt: R`Use the Ratio Test on $\displaystyle\sum_{n=1}^{\infty}\frac{(2n)!}{(n!)^{2}}$.`,
  key: R`Ratio $\to4>1$, so it diverges`,
  wrong: [
    [R`Ratio $\to1$, inconclusive`, R`$\frac{(2n+2)(2n+1)}{(n+1)^2}\to4$.`, 'algebra-slip'],
    [R`Ratio $\to\frac14$, so it converges`, R`The ratio is inverted.`, 'inverted'],
    [R`Ratio $\to0$, so it converges`, R`The factorials in the numerator grow faster; the ratio does not go to $0$.`, 'conceptual'],
  ],
  keyWhy: R`$\frac{a_{n+1}}{a_n}=\frac{(2n+2)(2n+1)}{(n+1)^{2}}\to4$.`,
  hints: [R`$(2n+2)!=(2n+2)(2n+1)(2n)!$.`],
  steps: [R`$\frac{(2n+2)!}{((n+1)!)^2}\cdot\frac{(n!)^2}{(2n)!}=\frac{(2n+2)(2n+1)}{(n+1)^2}\to4$.`],
  recall: R`Ratio test for factorials; $L>1$ means diverge.`,
});

// =============================== Mock B ===============================
add('b', 1, {
  topic: TM, diff: 2,
  prompt: R`Which line gives the Maclaurin series of $\sin x$ together with its interval of convergence?`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$, converging on $(-\infty,\infty)$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$, converging on $(-\infty,\infty)$`, R`That is $\cos x$.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$, converging on $(-1,1)$`, R`Factorials make the ratio $\to0$ for all $x$.`, 'endpoints'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{2n+1}}{(2n+1)!}$, converging on $(-\infty,\infty)$`, R`That is $\sinh x$; $\sin x$ alternates.`, 'sign'],
  ],
  keyWhy: R`Odd powers, $(2n+1)!$, alternating; ratio test gives $0$ for every $x$.`,
  hints: [R`$\sin 0=0$, $\sin'=\cos$, ...`],
  steps: [R`Derivatives at $0$: $0,1,0,-1,0,1,\dots$`],
  recall: R`Sine: odd powers. Cosine: even powers.`,
});
add('b', 2, {
  topic: TM, diff: 4,
  prompt: R`Derive the Taylor series for $f(x)=e^{3x}$ centred at $x=1$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}e^{3}}{n!}(x-1)^{n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{e^{3}}{n!}(x-1)^{n}$`, R`Chain rule: each derivative contributes a factor $3$.`, 'chain-rule'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}e^{3}}{n!}x^{n}$`, R`Powers must be $(x-1)^n$.`, 'setup'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}e}{n!}(x-1)^{n}$`, R`$f(1)=e^{3\cdot1}=e^{3}$.`, 'algebra-slip'],
  ],
  keyWhy: R`$f^{(n)}(x)=3^{n}e^{3x}$, so $f^{(n)}(1)=3^{n}e^{3}$.`,
  hints: [R`Differentiate $e^{3x}$ a few times.`],
  steps: [R`$f^{(n)}(x)=3^ne^{3x}$.`, R`At $x=1$: $3^ne^3$; divide by $n!$.`],
  recall: R`$e^{kx}\Rightarrow k^n$ in the $n$th derivative.`,
});
add('b', 3, {
  topic: PS, diff: 4,
  prompt: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-2)^{n}}{n^{2}\,4^{n}}$.`,
  key: R`$[-2,\,6]$`,
  wrong: [
    [R`$(-2,\,6)$`, R`At both endpoints the series is $\sum\frac{1}{n^2}$ or $\sum\frac{(-1)^n}{n^2}$, absolutely convergent, so both endpoints are included.`, 'endpoints'],
    [R`$[-2,\,6)$`, R`$x=6$ gives $\sum\frac1{n^2}$, a convergent $p$-series, so $6$ is included.`, 'endpoints'],
    [R`$[-4,\,4]$`, R`Centre is $2$, not $0$.`, 'setup'],
  ],
  keyWhy: R`$R=4$ from the Ratio Test; both endpoints give $p=2$ series.`,
  hints: [R`$p$-series at the endpoints.`],
  steps: [R`$\frac{|x-2|}{4}<1\Rightarrow(-2,6)$.`, R`$x=6$: $\sum\frac{1}{n^2}$ converges; $x=-2$: $\sum\frac{(-1)^n}{n^2}$ converges.`],
  recall: R`With $n^2$ in the denominator, both endpoints converge.`,
});
add('b', 4, {
  topic: TM, diff: 3,
  prompt: R`Find the Maclaurin series for $\dfrac{x}{1+4x^{2}}$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}4^{n}x^{2n+1}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}2^{n}x^{2n+1}$`, R`$(4x^2)^n=4^nx^{2n}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}4^{n}x^{2n+1}$`, R`Denominator is $1+4x^2$, so $r=-4x^2$, alternating.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}4^{n}x^{2n}$`, R`You forgot to multiply by the outside $x$.`, 'dropped-factor'],
  ],
  keyWhy: R`$\frac{1}{1-r}$ with $r=-4x^2$, times $x$.`,
  hints: [R`$r=-4x^2$.`],
  steps: [R`$\frac{1}{1+4x^2}=\sum(-4x^2)^n$.`, R`Multiply by $x$.`],
  recall: R`Geometric substitution: name $r$ first.`,
});
add('b', 5, {
  topic: AP, diff: 3,
  prompt: R`Find the exact value of $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{4^{n}\,(2n)!}$.`,
  key: R`$\cos\dfrac12$`,
  wrong: [
    [R`$\cos\dfrac14$`, R`$\frac{1}{4^n}=\left(\frac12\right)^{2n}$, so $x=\frac12$.`, 'algebra-slip'],
    [R`$\sin\dfrac12$`, R`Even powers and $(2n)!$ mean cosine.`, 'formula-confusion'],
    [R`$\cos 4$`, R`$x=\frac12$, not $4$.`, 'inverted'],
  ],
  keyWhy: R`$\frac{1}{4^n}=\left(\frac12\right)^{2n}$.`,
  hints: [R`Write $4^n$ as $2^{2n}$.`],
  steps: [R`$\sum\frac{(-1)^n(1/2)^{2n}}{(2n)!}=\cos\frac12$.`],
  recall: R`Rewrite as $x^{2n}$ and read $x$.`,
});
add('b', 6, {
  topic: TP, diff: 4,
  prompt: R`Let $T_2$ be the degree-2 Taylor polynomial of $f(x)=\ln x$ centred at $x=1$, so $T_2(x)=(x-1)-\dfrac{(x-1)^{2}}{2}$. Give a bound on $|\ln x-T_2(x)|$ for $1\le x\le\frac32$.`,
  key: R`$\dfrac{1}{24}$`,
  wrong: [
    [R`$\dfrac{1}{3}$`, R`You dropped $|x-1|^3$ (at most $\frac18$ here): $\frac{2}{3!}=\frac13$.`, 'dropped-factor'],
    [R`$\dfrac{1}{12}$`, R`You divided by $3$ instead of $3!=6$: $\frac{2\cdot\frac18}{3}=\frac1{12}$.`, 'off-by-one'],
    [R`$\dfrac{1}{48}$`, R`$f'''(x)=\frac{2}{x^{3}}$ has maximum $2$ on $[1,\frac32]$; using $M=1$ halves the bound.`, 'algebra-slip'],
  ],
  keyWhy: R`$f'''(x)=2x^{-3}\le2$ on $[1,\tfrac32]$, $|x-1|^{3}\le\tfrac18$, so $|R_2|\le\frac{2\cdot\frac18}{3!}=\frac{1}{24}$.`,
  hints: [R`Third derivative of $\ln x$: $2/x^3$; where is it largest?`],
  steps: [R`$f'''(x)=2x^{-3}$, decreasing, max at $x=1$: $M=2$.`, R`$|x-1|^3\le(\frac12)^3=\frac18$.`, R`$\frac{2\cdot\frac18}{6}=\frac1{24}$.`],
  recall: R`Maximise $|f^{(n+1)}|$ over the interval; decreasing functions peak at the left end.`,
});
add('b', 7, {
  topic: 'Alternating Series & Error', diff: 4,
  prompt: R`Classify $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}\,n}{n^{2}+1}$.`,
  key: R`Converges conditionally`,
  wrong: [
    [R`Converges absolutely`, R`$\sum\frac{n}{n^2+1}$ diverges by Limit Comparison with $\sum\frac1n$.`, 'test-logic'],
    [R`Diverges`, R`Alternating Series Test applies: $\frac{n}{n^2+1}$ is decreasing to $0$.`, 'test-logic'],
    [R`Diverges by the $n$th-term test`, R`The terms tend to $0$.`, 'test-logic'],
  ],
  keyWhy: R`AST works; the absolute series is like $\sum\frac1n$.`,
  hints: [R`Test $\sum|a_n|$ with LCT against $\frac1n$.`],
  steps: [R`$\frac{n}{n^2+1}\Big/\frac1n\to1$, so $\sum|a_n|$ diverges.`, R`AST: $b_n=\frac{n}{n^2+1}$ is decreasing for $n\ge1$ and $\to0$.`],
  recall: R`Conditional means: converges, but not absolutely.`,
});
add('b', 8, {
  topic: 'Ratio & Root Tests', diff: 3,
  prompt: R`Use the Root Test on $\displaystyle\sum_{n=1}^{\infty}\left(\frac{2n}{3n+1}\right)^{n}$.`,
  key: R`$\sqrt[n]{|a_n|}\to\frac23<1$, so it converges absolutely`,
  wrong: [
    [R`$\sqrt[n]{|a_n|}\to\frac32$, so it diverges`, R`The limit is $\frac{2n}{3n+1}\to\frac23$, not inverted.`, 'inverted'],
    [R`$\sqrt[n]{|a_n|}\to1$, inconclusive`, R`$\frac{2n}{3n+1}\to\frac23$.`, 'algebra-slip'],
    [R`$\sqrt[n]{|a_n|}\to0$, so it converges absolutely`, R`The limit is $\frac23$, not $0$.`, 'algebra-slip'],
  ],
  keyWhy: R`$\sqrt[n]{a_n}=\frac{2n}{3n+1}\to\frac23$.`,
  hints: [R`The $n$th root cancels the $n$th power.`],
  steps: [R`$\sqrt[n]{\left(\frac{2n}{3n+1}\right)^n}=\frac{2n}{3n+1}\to\frac23<1$.`],
  recall: R`Root test fits terms that are an $n$th power.`,
});


// ===================== Mock C: Spring 2026 Exam 3 replica =====================
// One item per sub-part, ids m3c-q<Q><part>. Wrongs name the exact slips seen on the real attempt.
const addC = (id, q, o) => P.push(mk({ ...o, id: `m3c-q${id}`, src: `Spring 2026 Exam 3 Q${q}` }));
const tbl = (id, fn, key, w1, w2, w3, why, steps, recall) => addC(`1${id}`, 1, {
  topic: TM, diff: 2,
  prompt: R`Maclaurin table row for ${fn}: pick the line with the series, its first two nonzero terms, and its interval of convergence.`,
  key, wrong: [w1, w2, w3], keyWhy: why, hints: [R`Write sigma form with its start index, then list the first two NONZERO terms.`], steps, recall,
});
tbl('a', R`$\dfrac{1}{1-x}$`,
  R`$\sum_{n=0}^{\infty}x^{n}$; $1+x$; $(-1,1)$`,
  [R`$\sum_{n=0}^{\infty}x^{n}$; $1+x$; $[-1,1]$`, R`Endpoints $x=\pm1$ make the terms not tend to $0$, so both diverge.`, 'endpoints'],
  [R`$\sum_{n=1}^{\infty}x^{n}$; $x+x^{2}$; $(-1,1)$`, R`The geometric series starts at $n=0$ with first term $1$.`, 'setup'],
  [R`$\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$; $1+x$; $(-\infty,\infty)$`, R`That is $e^x$; $\frac{1}{1-x}$ has no factorial and radius $1$.`, 'formula-confusion'],
  R`Geometric, $r=x$; $|x|<1$; endpoints diverge.`, [R`$\frac1{1-x}=\sum_{n\ge0}x^n=1+x+x^2+\cdots$`, R`Radius $1$; $x=\pm1$ diverge: $(-1,1)$.`], R`$\frac1{1-x}$: $(-1,1)$ open.`);
tbl('b', R`$e^{x}$`,
  R`$\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$; $1+x$; $(-\infty,\infty)$`,
  [R`$\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$; $1+x$; $(-1,1)$`, R`Factorials force ratio $\to0$ for every $x$: all reals.`, 'endpoints'],
  [R`$\sum_{n=0}^{\infty}x^{n}$; $1+x$; $(-\infty,\infty)$`, R`The $n!$ is missing; that is the geometric series.`, 'formula-confusion'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^nx^{n}}{n!}$; $1-x$; $(-\infty,\infty)$`, R`That is $e^{-x}$; $e^x$ does not alternate.`, 'sign'],
  R`$f^{(n)}(0)=1$ so coefficient $\frac1{n!}$.`, [R`$e^x=\sum\frac{x^n}{n!}=1+x+\frac{x^2}{2}+\cdots$`, R`Ratio $\frac{|x|}{n+1}\to0$: all $x$.`], R`$e^x$: all reals.`);
tbl('c', R`$\sin x$`,
  R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$; $x-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`,
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$; $1-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`, R`$\sin 0=0$: the first nonzero term is $x$, not $1$.`, 'setup'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$; $1-\frac{x^{2}}{2!}$; $(-\infty,\infty)$`, R`That is $\cos x$.`, 'formula-confusion'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$; $x-\frac{x^{3}}{3!}$; $(-1,1)$`, R`Factorials: radius is infinite.`, 'endpoints'],
  R`Odd powers, $(2n+1)!$, alternating.`, [R`$\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots$`, R`Ratio $\to0$: all reals.`], R`Sine odd, cosine even.`);
tbl('d', R`$\cos x$`,
  R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$; $1-\frac{x^{2}}{2!}$; $(-\infty,\infty)$`,
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$; $x-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`, R`That is $\sin x$.`, 'formula-confusion'],
  [R`$\sum_{n=0}^{\infty}\frac{x^{2n}}{(2n)!}$; $1+\frac{x^{2}}{2!}$; $(-\infty,\infty)$`, R`That is $\cosh x$; $\cos x$ alternates.`, 'sign'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$; $1-\frac{x^{2}}{2!}$; $[-1,1]$`, R`Radius is infinite.`, 'endpoints'],
  R`Even powers, $(2n)!$, alternating.`, [R`$\cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$`], R`Cosine even.`);
tbl('e', R`$\ln(1+x)$`,
  R`$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$; $x-\frac{x^{2}}{2}$; $(-1,1]$`,
  [R`$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$; $1-\frac{x^{2}}{2}$; $(-1,1]$`, R`$\ln(1+0)=0$, so there is no constant term: the first term is $x$, not $1$ (the slip on the real exam).`, 'setup'],
  [R`$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$; $x-\frac{x^{2}}{2}$; $[-1,1]$`, R`$x=-1$ gives $-\sum\frac1n$, which diverges.`, 'endpoints'],
  [R`$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n!}$; $x-\frac{x^{2}}{2}$; $(-\infty,\infty)$`, R`Plain $n$, not $n!$; radius $1$.`, 'formula-confusion'],
  R`Integrate $\frac1{1+x}$; $x=1$ alternating harmonic converges, $x=-1$ diverges.`, [R`$\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots$`, R`$x=1$ converges (AST), $x=-1$ diverges: $(-1,1]$.`], R`$\ln(1+x)$: $(-1,1]$, starts at $x$.`);
tbl('f', R`$\arctan x$`,
  R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$; $x-\frac{x^{3}}{3}$; $[-1,1]$`,
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$; $x-\frac{x^{3}}{3}$; $(-1,1)$`, R`Both endpoints give convergent alternating series ($\pm\sum\frac{(-1)^n}{2n+1}$), so include them.`, 'endpoints'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$; $x-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`, R`That is $\sin x$; $\arctan$ has no factorial.`, 'formula-confusion'],
  [R`$\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$; $x-\frac{x^{3}}{3!}$; $[-1,1]$`, R`Second term is $\frac{x^3}{3}$, not $\frac{x^3}{3!}$.`, 'algebra-slip'],
  R`Integrate $\frac1{1+x^2}$; endpoints converge by AST.`, [R`$\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}-\cdots$`, R`$x=\pm1$: alternating $\frac1{2n+1}$ converges.`], R`$\arctan$: $[-1,1]$.`);

const sumFix = R`Find the SUM. A ratio-test limit is not the sum.`;
addC('2a', 2, {
  topic: AP, diff: 3,
  prompt: R`Compute $1-\dfrac{1}{1!}+\dfrac{1}{2!}-\dfrac{1}{3!}+\dfrac{1}{4!}-\cdots$ (find its value).`,
  key: R`$\dfrac1e$`,
  wrong: [
    [R`$0$`, R`That is the ratio-test limit ($\frac1{n+1}\to0$), not the sum. The question asks for the value: recognise $e^{x}$ at $x=-1$.`, 'test-logic'],
    [R`$e$`, R`Signs alternate, so $x=-1$, giving $e^{-1}$, not $e$.`, 'sign'],
    [R`$1-\dfrac1e$`, R`The series starts at $n=0$ with the term $1$; nothing is missing, so do not subtract.`, 'off-by-one'],
  ],
  keyWhy: R`$\sum_{n\ge0}\frac{(-1)^n}{n!}=e^{-1}$.`, hints: [sumFix], fix: sumFix,
  steps: [R`Rewrite as $\sum_{n=0}^{\infty}\frac{(-1)^n}{n!}$.`, R`Match $e^x=\sum\frac{x^n}{n!}$ with $x=-1$.`, R`Value: $e^{-1}=\frac1e$.`],
  recall: R`Compute = recognise the Maclaurin series and evaluate; never run a ratio test.`,
});
addC('2b', 2, {
  topic: AP, diff: 4,
  prompt: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-\pi^{2})^{n}}{(2n)!}$.`,
  key: R`$-2$`,
  wrong: [
    [R`$0$`, R`That is a ratio-test limit, not the sum. Here $\cos\pi=-1$ minus the $n=0$ term.`, 'test-logic'],
    [R`$-1$`, R`$\cos\pi=-1$ is the sum from $n=0$; the sum from $n=1$ drops the $n=0$ term $1$: $-1-1=-2$.`, 'off-by-one'],
    [R`$-\dfrac{\pi^{2}}{2}$`, R`That is only the $n=1$ term $\frac{-\pi^2}{2!}$; the later terms change the total to $\cos\pi-1=-2$.`, 'incomplete'],
  ],
  keyWhy: R`$\sum_{n\ge0}\frac{(-1)^n\pi^{2n}}{(2n)!}=\cos\pi=-1$; remove $n=0$ term $1$.`, hints: [sumFix], fix: sumFix,
  steps: [R`$(-\pi^2)^n=(-1)^n\pi^{2n}$, so this is $\cos x$ at $x=\pi$.`, R`Sum from $n=0$ is $\cos\pi=-1$.`, R`Subtract the $n=0$ term ($1$): $-1-1=-2$.`],
  recall: R`Check the start index and subtract skipped terms.`,
});
addC('2c', 2, {
  topic: AP, diff: 4,
  prompt: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n\,3^{n}}$.`,
  key: R`$-\ln\dfrac43$`,
  wrong: [
    [R`$\dfrac13$`, R`That is the ratio-test limit, not the sum. Match $\ln(1+x)$.`, 'test-logic'],
    [R`$\ln\dfrac43$`, R`$\ln(1+x)=\sum\frac{(-1)^{n+1}x^n}{n}$; with $x=\frac13$ our sum equals $-\ln(1+\frac13)$, sign flipped.`, 'sign'],
    [R`$\ln\dfrac23$`, R`$x=\frac13$ gives $1+x=\frac43$, not $\frac23$.`, 'algebra-slip'],
  ],
  keyWhy: R`$\sum\frac{(-1)^{n}(1/3)^n}{n}=-\sum\frac{(-1)^{n+1}(1/3)^n}{n}=-\ln\frac43$.`, hints: [sumFix], fix: sumFix,
  steps: [R`$\frac{(-1)^n}{n3^n}=-\,\frac{(-1)^{n+1}(1/3)^n}{n}$.`, R`$\ln(1+x)=\sum_{n\ge1}\frac{(-1)^{n+1}x^n}{n}$ at $x=\frac13$ is $\ln\frac43$.`, R`Our sum is the negative: $-\ln\frac43$.`],
  recall: R`Track the $(-1)^{n+1}$ vs $(-1)^n$ sign.`,
});
addC('2d', 2, {
  topic: AP, diff: 3,
  prompt: R`Compute $4-\dfrac43+\dfrac45-\dfrac47+\dfrac49-\cdots$.`,
  key: R`$\pi$`,
  wrong: [
    [R`$1$`, R`That is a ratio-test limit, not the sum. Recognise $4\arctan1$.`, 'test-logic'],
    [R`$4$`, R`The series is $4\sum\frac{(-1)^n}{2n+1}=4\arctan 1$, not just the first term.`, 'conceptual'],
    [R`$\dfrac{\pi}{4}$`, R`$\arctan1=\frac\pi4$, but there is a factor $4$ out front.`, 'dropped-factor'],
  ],
  keyWhy: R`$4\sum\frac{(-1)^n}{2n+1}=4\arctan1=\pi$.`, hints: [sumFix], fix: sumFix,
  steps: [R`General term $\frac{4(-1)^n}{2n+1}$, $n\ge0$.`, R`Match $\arctan x=\sum\frac{(-1)^nx^{2n+1}}{2n+1}$ at $x=1$.`, R`$4\cdot\frac\pi4=\pi$.`],
  recall: R`Leibniz series: $4\arctan 1=\pi$.`,
});
addC('3', 3, {
  topic: PS, diff: 4,
  prompt: R`Find the center, radius of convergence, and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n\,2^{n}}(x+5)^{n}$.`,
  key: R`Center $-5$, $R=2$, interval $(-7,-3]$`,
  wrong: [
    [R`Center $-5$, $R=2$, interval $[-7,-3]$`, R`At $x=-7$ the series is $\sum\frac1n$, the harmonic series ($p=1$), which DIVERGES. Calling it convergent was the real-exam slip.`, 'endpoints'],
    [R`Center $5$, $R=2$, interval $(3,7]$`, R`$(x+5)=(x-(-5))$: center is $-5$.`, 'setup'],
    [R`Center $-5$, $R=4$, interval $(-9,-1)$`, R`$\left|\frac{x+5}{2}\right|<1$ gives $R=2$, not $4$.`, 'algebra-slip'],
  ],
  keyWhy: R`Ratio gives $\frac{|x+5|}{2}<1$; $x=-3$ converges (AST), $x=-7$ diverges (harmonic).`,
  hints: [R`Ratio test, then test each endpoint by name.`],
  steps: [R`Center: $-5$ (+2). Radius: $R=2$ (+2).`, R`Ratio test: $\lim\left|\frac{(x+5)^{n+1}}{(x+5)^n}\cdot\frac{n}{n+1}\cdot\frac{2^n}{2^{n+1}}\right|=\frac{|x+5|}{2}$ (+2).`, R`$\frac{|x+5|}{2}<1\Rightarrow-7<x<-3$ (+2).`, R`$x=-3$: $\sum\frac{(-1)^n}{n}$; terms $\to0$ and $\frac1n$ decreasing, converges by AST (+3).`, R`$x=-7$: $\sum\frac1n$, harmonic ($p=1$), diverges (+3). Interval $(-7,-3]$.`],
  recall: R`Endpoint at $-7$: $(-1)^n(-2)^n/2^n=1$, so harmonic; diverges.`,
});
addC('4a', 4, {
  topic: TM, diff: 3,
  prompt: R`Use a known series to write $2x\sin(x^{3})$ as a power series (fully simplified).`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{6n+4}}{(2n+1)!}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{6n+4}}{(2n+1)!}$`, R`The coefficient $2$ was dropped.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{6n+3}}{(2n+1)!}$`, R`Multiply by $x$: $x\cdot x^{6n+3}=x^{6n+4}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{2n+4}}{(2n+1)!}$`, R`$(x^3)^{2n+1}=x^{6n+3}$: exponents multiply.`, 'algebra-slip'],
  ],
  keyWhy: R`$\sin(x^3)=\sum\frac{(-1)^nx^{6n+3}}{(2n+1)!}$, times $2x$.`, hints: [R`Substitute $x^3$, then multiply by $2x$ and add exponents.`],
  steps: [R`$\sin u=\sum\frac{(-1)^nu^{2n+1}}{(2n+1)!}$, $u=x^3$: $x^{6n+3}$.`, R`Multiply by $2x$: $2x\cdot x^{6n+3}=2x^{6n+4}$.`],
  recall: R`Substitute, multiply, then combine exponents by adding.`,
});
addC('4b', 4, {
  topic: TM, diff: 4,
  prompt: R`Use $\frac{1}{1-x}$ to write $\dfrac{3}{2+x}$ as a power series (fully simplify).`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{n}}{2^{n+1}}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac32\left(-2x\right)^{n}$`, R`Ratio flipped: $\frac{3}{2+x}=\frac32\cdot\frac1{1+x/2}$, so $r=-\frac x2$, not $-2x$. Then simplify to $\frac{3(-1)^nx^n}{2^{n+1}}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{n}}{2^{n}}$`, R`$\frac{3}{2+x}=\frac32\cdot\frac1{1+x/2}$: the leading $\frac12$ gives $2^{n+1}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3x^{n}}{2^{n+1}}$`, R`Denominator is $2+x$, so $r=-\frac x2$: alternating.`, 'sign'],
  ],
  keyWhy: R`$\frac{3}{2+x}=\frac32\cdot\frac1{1-(-x/2)}$.`, hints: [R`Factor the $2$ out of the denominator.`],
  steps: [R`$\frac3{2+x}=\frac{3/2}{1+x/2}=\frac32\cdot\frac1{1-(-x/2)}$.`, R`$=\frac32\sum\left(-\frac x2\right)^n$.`, R`Simplify: $\sum\frac{3(-1)^nx^n}{2^{n+1}}$.`],
  recall: R`Always finish by distributing powers; do not leave $\left(-\frac x2\right)^n$.`,
});
addC('4c', 4, {
  topic: TM, diff: 3,
  prompt: R`Use $e^x$ to write $5x^{2}e^{-x/5}$ as a power series (fully simplify).`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{5(-1)^{n}x^{n+2}}{5^{n}\,n!}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{5x^{2n}}{(-5)^{n}\,n!}$`, R`You combined $x^2\cdot x^n$ as $x^{2n}$; exponents ADD: $x^{n+2}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{5(-1)^{n}x^{n}}{5^{n}\,n!}$`, R`The outside $x^2$ was dropped.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{5(-1)^{n}x^{n+2}}{n!}$`, R`$(-x/5)^n$ also carries $\frac1{5^n}$.`, 'dropped-factor'],
  ],
  keyWhy: R`$e^{-x/5}=\sum\frac{(-1)^nx^n}{5^nn!}$, times $5x^2$.`, hints: [R`Substitute $u=-x/5$, then multiply by $5x^2$.`],
  steps: [R`$e^{-x/5}=\sum\frac{(-x/5)^n}{n!}=\sum\frac{(-1)^nx^n}{5^nn!}$.`, R`Multiply by $5x^2$: $x^2\cdot x^n=x^{n+2}$.`],
  recall: R`$x^2\cdot x^n=x^{n+2}$, never $x^{2n}$.`,
});
addC('4d', 4, {
  topic: TM, diff: 4,
  prompt: R`Find a power series for $\displaystyle\int\frac{\sin x}{x}\,dx$.`,
  key: R`$\displaystyle C+\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)\,(2n+1)!}$`,
  wrong: [
    [R`$\displaystyle-\ln|x|+C+\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+2}}{(2n+2)(2n+1)!}$`, R`$\frac{\sin x}{x}$ is a quotient, not $\sin x-\frac1x$ (that split gives $\int\sin x\,dx-\ln|x|$). Divide the series by $x$ termwise.`, 'conceptual'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)\,(2n+1)!}$`, R`Missing $+C$.`, 'dropped-factor'],
    [R`$\displaystyle C+\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$`, R`Integrating $x^{2n}$ gives $\frac{x^{2n+1}}{2n+1}$: an extra $(2n+1)$ in the denominator.`, 'algebra-slip'],
  ],
  keyWhy: R`$\frac{\sin x}{x}=\sum\frac{(-1)^nx^{2n}}{(2n+1)!}$.`, hints: [R`Divide the series by $x$ first, then integrate each term.`],
  steps: [R`$\frac{\sin x}{x}=\sum\frac{(-1)^nx^{2n}}{(2n+1)!}$.`, R`Integrate termwise: $\frac{(-1)^nx^{2n+1}}{(2n+1)(2n+1)!}$, $+C$.`],
  recall: R`Divide first, then integrate; do not split a quotient into a difference.`,
});
addC('5a', 5, {
  topic: TP, diff: 2,
  prompt: R`Find $T_1(x)$ for $\ln x$ centered at $x=4$.`,
  key: R`$\ln4+\dfrac14(x-4)$`,
  wrong: [
    [R`$\ln4+\dfrac14x$`, R`Powers are $(x-4)$, not $x$.`, 'setup'],
    [R`$\ln4+4(x-4)$`, R`$f'(4)=\frac14$, not $4$.`, 'inverted'],
    [R`$\dfrac14(x-4)$`, R`$f(4)=\ln4$ is the constant term.`, 'dropped-factor'],
  ],
  keyWhy: R`$f(4)=\ln4$, $f'(4)=\frac14$.`, hints: [R`$T_1=f(a)+f'(a)(x-a)$.`],
  steps: [R`$f=\ln x$, $f'=\frac1x$, $f''=-\frac1{x^2}$.`, R`$T_1(x)=\ln4+\frac14(x-4)$.`], recall: R`$T_1=f(a)+f'(a)(x-a)$.`,
});
const rem = R`For $T_1$ the error uses $f''$: $|R_1|\le\frac{M}{2!}|x-4|^{2}$ with centre $4$, not $c$.`;
addC('5b', 5, {
  topic: TP, diff: 4,
  prompt: R`Use the Taylor Remainder Theorem to bound the error in approximating $\ln5$ by $T_1(5)$, where $T_1$ is centered at $4$.`,
  key: R`$\dfrac1{32}$`,
  wrong: [
    [R`$\dfrac1{16}$`, R`$R_1$ has $(n+1)!=2!=2$ in the denominator; $\frac1{16}$ forgot it.`, 'off-by-one'],
    [R`$\dfrac12$`, R`Here $M=\max\frac1{c^2}$ on $[4,5]$ is $\frac1{16}$, not $1$.`, 'algebra-slip'],
    [R`$\dfrac1{50}$`, R`$c\in[4,5]$ and $\frac1{c^2}$ is largest at $c=4$ (left end), giving $\frac1{16}$, not $\frac1{25}$.`, 'algebra-slip'],
  ],
  keyWhy: R`$M=\frac1{16}$ at $c=4$; $\frac{1/16}{2}\cdot1^2=\frac1{32}$.`, hints: [rem], fix: rem,
  steps: [R`$|R_1(5)|=\left|\frac{f''(c)}{2!}(5-4)^2\right|$, $c\in[4,5]$ (centre $4$).`, R`$|f''(c)|=\frac1{c^2}\le\frac1{16}$ (decreasing, max at $c=4$).`, R`$|R_1|\le\frac{1/16}{2}\cdot1=\frac1{32}$.`],
  recall: R`$(x-a)$ with the true centre; $M$ at the left end for $\frac1{c^2}$.`,
});
addC('5c', 5, {
  topic: TP, diff: 5,
  prompt: R`Use the Taylor Remainder Theorem to bound the error in approximating $\ln x$ by $T_1(x)$ (centered at $4$) for all $x$ in $[2,5]$.`,
  key: R`$\dfrac12$`,
  wrong: [
    [R`$\dfrac18$`, R`That is $\frac1{32}\cdot4$: $M$ was taken at $c=4$ ($\frac1{16}$). On $[2,5]$, $c$ ranges between $4$ and $x$, so $M=\max\frac1{c^2}=\frac14$ at $c=2$.`, 'algebra-slip'],
    [R`$\dfrac1{32}$`, R`That is the single-point bound at $x=5$. Maximise over the whole interval.`, 'conceptual'],
    [R`$\dfrac14$`, R`$M=\frac14$ is right, but the maximum of $(x-4)^2$ on $[2,5]$ is $4$ (at $x=2$): you used $|x-4|=2$ without squaring.`, 'algebra-slip'],
  ],
  keyWhy: R`$M=\frac14$ (at $c=2$), $(x-4)^2\le4$ (at $x=2$): $\frac{1/4}{2}\cdot4=\frac12$.`, hints: [rem], fix: rem,
  steps: [R`$|R_1(x)|\le\frac{M}{2}(x-4)^2$, $c$ between $4$ and $x$, so $c\in[2,5]$.`, R`$M=\max\frac1{c^2}=\frac14$ at $c=2$.`, R`$\max(x-4)^2=4$ on $[2,5]$ (at $x=2$).`, R`Bound: $\frac{1/4}{2}\cdot4=\frac12$.`],
  recall: R`Interval: $M$ over all $c$ in $[2,5]$ and the max of $|x-a|$ over the interval, not at $x=5$.`,
});
addC('6', 6, {
  topic: TM, diff: 5,
  prompt: R`Derive the Taylor series of $\dfrac{1}{(1-x)^2}$ at $x=0$ from derivatives (no memorized series) and give its interval of convergence.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}(n+1)x^{n}$, interval $(-1,1)$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}(n+1)x^{n}$, interval $[-1,1]$`, R`Endpoints must be tested (the real answer skipped them): at $x=\pm1$ the terms $(n+1)(\pm1)^n$ do not tend to $0$, so both diverge.`, 'endpoints'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(n+1)x^{n}$, interval $(-\infty,1)$`, R`The ratio test gives $|x|<1$; dropping the absolute value allows $x\le-1$.`, 'conceptual'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(n+1)!}{n}x^{n}$, interval $(-1,1)$`, R`Coefficient is $\frac{f^{(n)}(0)}{n!}=\frac{(n+1)!}{n!}=n+1$.`, 'formula-confusion'],
  ],
  keyWhy: R`$f^{(n)}(0)=(n+1)!$; ratio $\to|x|$; endpoints diverge.`,
  hints: [R`Compute $f(0),f'(0),f''(0)$ and the next one as numbers: $1,2,6,24$.`],
  steps: [R`$f=(1-x)^{-2}$, $f'=2(1-x)^{-3}$, $f''=6(1-x)^{-4}$, next $24(1-x)^{-5}$.`, R`At $0$: $1,2,6,24=(n+1)!$.`, R`$\frac{(n+1)!}{n!}=n+1$: $\sum(n+1)x^n$.`, R`Ratio: $\frac{n+2}{n+1}|x|\to|x|<1$.`, R`$x=1$: $\sum(n+1)$ diverges; $x=-1$: $\sum(-1)^n(n+1)$ diverges ($n$th-term test). Interval $(-1,1)$.`],
  recall: R`Keep $|x|$ in the ratio; test both endpoints.`,
});

// ===================== Mock D: same archetypes, new numbers =====================
const addD = (id, q, o) => P.push(mk({ ...o, id: `m3d-q${id}`, src: `Mock Exam 3 D Q${q}` }));
const tbD = (id, fn, key, w1, w2, w3, why, steps, recall) => addD(`1${id}`, 1, {
  topic: TM, diff: 2,
  prompt: R`Give the first two nonzero terms and the interval of convergence of the Maclaurin series of ${fn}.`,
  key, wrong: [w1, w2, w3], keyWhy: why, hints: [R`Expand the standard series; skip any zero term.`], steps, recall,
});
tbD('a', R`$\sin x$`, R`$x-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`,
  [R`$1-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`, R`$\sin0=0$: first term is $x$.`, 'setup'],
  [R`$x-\frac{x^{3}}{3!}$; $(-1,1)$`, R`Factorials make the radius infinite.`, 'endpoints'],
  [R`$1-\frac{x^{2}}{2!}$; $(-\infty,\infty)$`, R`That is $\cos x$.`, 'formula-confusion'],
  R`Odd powers.`, [R`$\sin x=x-\frac{x^3}{3!}+\cdots$`], R`Sine odd.`);
tbD('b', R`$\ln(1+x)$`, R`$x-\frac{x^{2}}{2}$; $(-1,1]$`,
  [R`$1-\frac{x^{2}}{2}$; $(-1,1]$`, R`$\ln1=0$, so there is no constant term; first term is $x$.`, 'setup'],
  [R`$x-\frac{x^{2}}{2}$; $[-1,1]$`, R`$x=-1$ gives $-\sum\frac1n$, diverges.`, 'endpoints'],
  [R`$x-\frac{x^{2}}{2}$; $(-1,1)$`, R`$x=1$ gives the alternating harmonic series, which converges.`, 'endpoints'],
  R`Integrate $\frac1{1+x}$.`, [R`$\ln(1+x)=x-\frac{x^2}{2}+\cdots$; $x=1$ converges, $x=-1$ diverges.`], R`$(-1,1]$.`);
tbD('c', R`$\arctan x$`, R`$x-\frac{x^{3}}{3}$; $[-1,1]$`,
  [R`$x-\frac{x^{3}}{3}$; $(-1,1)$`, R`Both endpoints converge by AST.`, 'endpoints'],
  [R`$x-\frac{x^{3}}{3!}$; $[-1,1]$`, R`Denominator is $3$, not $3!$.`, 'algebra-slip'],
  [R`$x+\frac{x^{3}}{3}$; $[-1,1]$`, R`Signs alternate.`, 'sign'],
  R`Integrate $\frac1{1+x^2}$.`, [R`$\arctan x=x-\frac{x^3}{3}+\cdots$`], R`$[-1,1]$.`);
tbD('d', R`$\cos x$`, R`$1-\frac{x^{2}}{2!}$; $(-\infty,\infty)$`,
  [R`$x-\frac{x^{3}}{3!}$; $(-\infty,\infty)$`, R`That is $\sin x$.`, 'formula-confusion'],
  [R`$1+\frac{x^{2}}{2!}$; $(-\infty,\infty)$`, R`Signs alternate.`, 'sign'],
  [R`$1-\frac{x^{2}}{2!}$; $(-1,1)$`, R`Radius is infinite.`, 'endpoints'],
  R`Even powers.`, [R`$\cos x=1-\frac{x^2}{2}+\cdots$`], R`Cosine even.`);
tbD('e', R`$\dfrac{1}{1-x}$`, R`$1+x$; $(-1,1)$`,
  [R`$1+x$; $[-1,1]$`, R`Terms do not tend to $0$ at $\pm1$.`, 'endpoints'],
  [R`$x+x^{2}$; $(-1,1)$`, R`Starts at $1$.`, 'setup'],
  [R`$1+x$; $(-\infty,\infty)$`, R`No factorials: radius $1$.`, 'formula-confusion'],
  R`Geometric.`, [R`$1+x+x^2+\cdots$`], R`$(-1,1)$.`);
tbD('f', R`$e^{x}$`, R`$1+x$; $(-\infty,\infty)$`,
  [R`$1+x$; $(-1,1)$`, R`Radius infinite.`, 'endpoints'],
  [R`$1-x$; $(-\infty,\infty)$`, R`That is $e^{-x}$.`, 'sign'],
  [R`$x+x^{2}$; $(-\infty,\infty)$`, R`Constant term is $1$.`, 'setup'],
  R`$\frac{x^n}{n!}$.`, [R`$e^x=1+x+\frac{x^2}{2}+\cdots$`], R`All reals.`);
addD('2a', 2, {
  topic: AP, diff: 3,
  prompt: R`Compute $\displaystyle\sum_{n=0}^{\infty}\frac{(-2)^{n}}{n!}$.`,
  key: R`$e^{-2}$`,
  wrong: [
    [R`$0$`, R`That is a ratio-test limit, not the sum. Match $e^x$ at $x=-2$.`, 'test-logic'],
    [R`$e^{2}$`, R`The $(-1)^n$ gives $x=-2$.`, 'sign'],
    [R`$e^{-2}-1$`, R`Starts at $n=0$: nothing to subtract.`, 'off-by-one'],
  ],
  keyWhy: R`$e^x$ at $x=-2$.`, hints: [sumFix], fix: sumFix, steps: [R`$\sum\frac{x^n}{n!}$ with $x=-2$.`, R`Value $e^{-2}$.`], recall: R`Compute means recognise and evaluate.`,
});
addD('2b', 2, {
  topic: AP, diff: 4,
  prompt: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}(\pi/2)^{2n}}{(2n)!}$.`,
  key: R`$-1$`,
  wrong: [
    [R`$0$`, R`$\cos\frac\pi2=0$ is the sum from $n=0$; the $n=1$ start removes the $n=0$ term $1$.`, 'off-by-one'],
    [R`$1$`, R`$0-1=-1$, not $+1$.`, 'sign'],
    [R`$-2$`, R`$x=\frac\pi2$, not $\pi$ (that would give $\cos\pi-1=-2$).`, 'algebra-slip'],
  ],
  keyWhy: R`$\cos\frac\pi2-1=-1$.`, hints: [sumFix], fix: sumFix, steps: [R`Cosine series at $x=\frac\pi2$ from $n=0$ equals $0$.`, R`Remove $n=0$ term $1$: $-1$.`], recall: R`Check start index.`,
});
addD('2c', 2, {
  topic: AP, diff: 4,
  prompt: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n\,2^{n}}$.`,
  key: R`$-\ln\dfrac32$`,
  wrong: [
    [R`$\dfrac12$`, R`That is a ratio-test limit, not the sum.`, 'test-logic'],
    [R`$\ln\dfrac32$`, R`Our series is the negative of $\ln(1+x)$ at $x=\frac12$.`, 'sign'],
    [R`$-\ln\dfrac12$`, R`$1+x=\frac32$.`, 'algebra-slip'],
  ],
  keyWhy: R`$-\ln(1+\frac12)$.`, hints: [sumFix], fix: sumFix, steps: [R`$\frac{(-1)^n}{n2^n}=-\frac{(-1)^{n+1}(1/2)^n}{n}$.`, R`So the sum is $-\ln\frac32$.`], recall: R`Track $(-1)^{n+1}$.`,
});
addD('2d', 2, {
  topic: AP, diff: 3,
  prompt: R`Compute $6-\dfrac63+\dfrac65-\dfrac67+\dfrac69-\cdots$.`,
  key: R`$\dfrac{3\pi}{2}$`,
  wrong: [
    [R`$1$`, R`That is a ratio-test limit, not the sum.`, 'test-logic'],
    [R`$\dfrac{\pi}{4}$`, R`There is a factor $6$ out front.`, 'dropped-factor'],
    [R`$6$`, R`It is $6\arctan1$.`, 'conceptual'],
  ],
  keyWhy: R`$6\arctan 1=\frac{6\pi}4$.`, hints: [sumFix], fix: sumFix, steps: [R`$6\sum\frac{(-1)^n}{2n+1}=6\arctan1$.`, R`$\frac{3\pi}{2}$.`], recall: R`$\arctan1=\frac\pi4$.`,
});
addD('3', 3, {
  topic: PS, diff: 4,
  prompt: R`Find the center, radius, and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-1)^{n}}{n\,2^{n}}$.`,
  key: R`Center $1$, $R=2$, interval $[-1,3)$`,
  wrong: [
    [R`Center $1$, $R=2$, interval $[-1,3]$`, R`At $x=3$ the series is $\sum\frac1n$ (harmonic), which diverges.`, 'endpoints'],
    [R`Center $1$, $R=2$, interval $(-1,3]$`, R`Reversed: $x=-1$ gives $\sum\frac{(-1)^n}{n}$ (converges), $x=3$ diverges.`, 'endpoints'],
    [R`Center $-1$, $R=2$, interval $[-3,1)$`, R`$(x-1)$ means centre $+1$.`, 'setup'],
  ],
  keyWhy: R`$\frac{|x-1|}{2}<1$; $x=-1$ AST converges, $x=3$ harmonic diverges.`,
  hints: [R`Ratio test, then each endpoint.`],
  steps: [R`Center $1$ (+2), $R=2$ (+2).`, R`Ratio: $\left|\frac{x-1}{2}\cdot\frac{n}{n+1}\right|\to\frac{|x-1|}{2}$ (+2).`, R`Open interval $(-1,3)$ (+2).`, R`$x=-1$: $\sum\frac{(-1)^n}{n}$ converges by AST (+3).`, R`$x=3$: $\sum\frac1n$ diverges (+3). Interval $[-1,3)$.`],
  recall: R`Test each endpoint by name.`,
});
addD('4a', 4, {
  topic: TM, diff: 3,
  prompt: R`Use a known series to write $3x^{2}\sin(x^{4})$ as a power series.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{8n+6}}{(2n+1)!}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{8n+6}}{(2n+1)!}$`, R`Coefficient $3$ dropped.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{8n+4}}{(2n+1)!}$`, R`$x^2\cdot x^{8n+4}=x^{8n+6}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{2n+6}}{(2n+1)!}$`, R`$(x^4)^{2n+1}=x^{8n+4}$.`, 'algebra-slip'],
  ],
  keyWhy: R`$(x^4)^{2n+1}=x^{8n+4}$, times $3x^2$.`, hints: [R`Substitute, multiply, add exponents.`], steps: [R`$\sin(x^4)=\sum\frac{(-1)^nx^{8n+4}}{(2n+1)!}$.`, R`Times $3x^2$.`], recall: R`Add exponents.`,
});
addD('4b', 4, {
  topic: TM, diff: 4,
  prompt: R`Use $\frac{1}{1-x}$ to write $\dfrac{5}{3+x}$ as a power series (fully simplify).`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{5(-1)^{n}x^{n}}{3^{n+1}}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac53\left(-3x\right)^{n}$`, R`Ratio flipped: $\frac{5}{3+x}=\frac53\cdot\frac1{1+x/3}$, so $r=-\frac x3$, not $-3x$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{5(-1)^{n}x^{n}}{3^{n}}$`, R`The leading $\frac13$ gives $3^{n+1}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{5x^{n}}{3^{n+1}}$`, R`$r=-\frac x3$ alternates.`, 'sign'],
  ],
  keyWhy: R`$\frac{5/3}{1-(-x/3)}$.`, hints: [R`Factor $3$ out.`], steps: [R`$\frac5{3+x}=\frac53\cdot\frac1{1-(-x/3)}$.`, R`Simplify to $\frac{5(-1)^nx^n}{3^{n+1}}$.`], recall: R`Distribute powers.`,
});
addD('4c', 4, {
  topic: TM, diff: 3,
  prompt: R`Use $e^x$ to write $6x^{2}e^{-x/3}$ as a power series (fully simplify).`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{6(-1)^{n}x^{n+2}}{3^{n}\,n!}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{6x^{2n}}{(-3)^{n}\,n!}$`, R`Exponents add: $x^2\cdot x^n=x^{n+2}$.`, 'algebra-slip'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{6(-1)^{n}x^{n}}{3^{n}\,n!}$`, R`Dropped the $x^2$.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{6(-1)^{n}x^{n+2}}{n!}$`, R`The $3^n$ is missing.`, 'dropped-factor'],
  ],
  keyWhy: R`$e^{-x/3}=\sum\frac{(-1)^nx^n}{3^nn!}$.`, hints: [R`Substitute then multiply.`], steps: [R`$e^{-x/3}=\sum\frac{(-1)^nx^n}{3^nn!}$.`, R`Times $6x^2$.`], recall: R`$x^2x^n=x^{n+2}$.`,
});
addD('4d', 4, {
  topic: TM, diff: 4,
  prompt: R`Find a power series for $\displaystyle\int\frac{1-\cos x}{x}\,dx$.`,
  key: R`$\displaystyle C+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{2n}}{2n\,(2n)!}$`,
  wrong: [
    [R`$\displaystyle C+\sum_{n=0}^{\infty}\frac{(-1)^{n+1}x^{2n}}{2n\,(2n)!}$`, R`$n=0$ would divide by $0$; $1-\cos x$ has no constant term, so start at $n=1$.`, 'off-by-one'],
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{2n}}{2n\,(2n)!}$`, R`Missing $+C$.`, 'dropped-factor'],
    [R`$\displaystyle C+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{2n}}{(2n)!}$`, R`Integrating $x^{2n-1}$ gives $\frac{x^{2n}}{2n}$.`, 'algebra-slip'],
  ],
  keyWhy: R`$1-\cos x=\sum_{n\ge1}\frac{(-1)^{n+1}x^{2n}}{(2n)!}$; divide by $x$, integrate.`, hints: [R`Divide first, then integrate.`], steps: [R`$\frac{1-\cos x}{x}=\sum_{n\ge1}\frac{(-1)^{n+1}x^{2n-1}}{(2n)!}$.`, R`Integrate: $\frac{x^{2n}}{2n}$, $+C$.`], recall: R`Divide, then integrate.`,
});
addD('5a', 5, {
  topic: TP, diff: 2,
  prompt: R`Find $T_1(x)$ for $\ln x$ centered at $x=2$.`,
  key: R`$\ln2+\dfrac12(x-2)$`,
  wrong: [
    [R`$\ln2+\dfrac12x$`, R`Use $(x-2)$.`, 'setup'],
    [R`$\ln2+2(x-2)$`, R`$f'(2)=\frac12$.`, 'inverted'],
    [R`$\dfrac12(x-2)$`, R`Constant term $\ln2$.`, 'dropped-factor'],
  ],
  keyWhy: R`$f(2)=\ln2$, $f'(2)=\frac12$.`, hints: [R`$T_1=f(a)+f'(a)(x-a)$.`], steps: [R`$T_1=\ln2+\frac12(x-2)$.`], recall: R`$T_1$ formula.`,
});
addD('5b', 5, {
  topic: TP, diff: 4,
  prompt: R`Bound the error in approximating $\ln3$ by $T_1(3)$ (centre $2$) using the Taylor Remainder Theorem.`,
  key: R`$\dfrac18$`,
  wrong: [
    [R`$\dfrac14$`, R`Forgot the $2!$.`, 'off-by-one'],
    [R`$\dfrac1{18}$`, R`$M=\max\frac1{c^2}$ on $[2,3]$ is $\frac14$ at $c=2$, not $\frac19$.`, 'algebra-slip'],
    [R`$\dfrac12$`, R`$M=\frac14$, not $1$.`, 'algebra-slip'],
  ],
  keyWhy: R`$\frac{1/4}{2}\cdot1^2=\frac18$.`, hints: [R`$(x-2)$ with centre $2$.`], steps: [R`$c\in[2,3]$, $M=\frac14$.`, R`$\frac{1/4}{2}(3-2)^2=\frac18$.`], recall: R`$M$ at left end.`,
});
addD('5c', 5, {
  topic: TP, diff: 5,
  prompt: R`Bound the error in approximating $\ln x$ by $T_1(x)$ (centre $2$) for all $x$ in $[1,4]$.`,
  key: R`$2$`,
  wrong: [
    [R`$\dfrac12$`, R`That uses $M=\frac14$ at the centre. On $[1,4]$, $c$ reaches $1$, so $M=1$.`, 'algebra-slip'],
    [R`$\dfrac18$`, R`That is the point bound at $x=3$.`, 'conceptual'],
    [R`$1$`, R`$M=1$ is right but $\max(x-2)^2=4$ at $x=4$, and the factor is $\frac12$: $\frac12\cdot1\cdot4=2$, not $1$.`, 'algebra-slip'],
  ],
  keyWhy: R`$M=1$ (at $c=1$), $(x-2)^2\le4$: $\frac12\cdot1\cdot4=2$.`, hints: [R`Maximise $f''$ over $c$ and $(x-2)^2$ over $x$.`], steps: [R`$c\in[1,4]$, $M=\max\frac1{c^2}=1$.`, R`$\max(x-2)^2=4$.`, R`$\frac12\cdot1\cdot4=2$.`], recall: R`Interval bounds both factors.`,
});
addD('6', 6, {
  topic: TM, diff: 5,
  prompt: R`Derive the Taylor series of $\dfrac{1}{(1-x)^3}$ at $x=0$ from derivatives (no memorized series) and give its interval of convergence.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(n+1)(n+2)}{2}x^{n}$, interval $(-1,1)$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(n+1)(n+2)}{2}x^{n}$, interval $[-1,1]$`, R`At $x=\pm1$ the terms grow, so both endpoints diverge.`, 'endpoints'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(n+1)(n+2)x^{n}$, interval $(-1,1)$`, R`$f^{(n)}(0)=\frac{(n+2)!}{2}$: dividing by $n!$ leaves $\frac{(n+1)(n+2)}{2}$; the $\frac12$ was dropped.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(n+1)x^{n}$, interval $(-1,1)$`, R`That is $\frac1{(1-x)^2}$.`, 'formula-confusion'],
  ],
  keyWhy: R`$f^{(n)}(0)=\frac{(n+2)!}{2}$.`, hints: [R`Evaluate the first few derivatives at $0$: $1,3,12$.`],
  steps: [R`$f=(1-x)^{-3}$, $f'=3(1-x)^{-4}$, $f''=12(1-x)^{-5}$, next $60(1-x)^{-6}$.`, R`At $0$: $1,3,12,60=\frac{(n+2)!}{2}$.`, R`Coefficient $\frac{(n+2)(n+1)}{2}$.`, R`Ratio $\to|x|<1$.`, R`$x=\pm1$: terms do not tend to $0$, diverge. $(-1,1)$.`], recall: R`Test both endpoints.`,
});

export const mockExam3 = { unit: 'series', problems: P, generators: G };
