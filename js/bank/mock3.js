// bank/mock3.js — two Exam 3 mocks (ids m3a-q*, m3b-q*), each in the shape of his paper:
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
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n+5}}{n!}$`, R`$(x^3)^n=x^{3n}$, not $x^{n+3}$.`, 'algebra-slip'],
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

export const mockExam3 = { unit: 'series', problems: P, generators: G };
