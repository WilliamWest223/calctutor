// bank/mockf.js — two comprehensive Final mocks (no calculator). Mixed units: each item sets its own unit.
// Ids mfa-q1.. (Mock A) and mfb-q1.. (Mock B).
const P = [];
const G = [];
const R = String.raw;

/** One mock item. key first, then [text, why] wrongs; the registry shuffles the order. */
const q = (set, n, unit, topic, diff, prompt, key, wrongs, steps, recall) => P.push({
  id: `mf${set.toLowerCase()}-q${n}`, unit, topic, diff, src: `Mock Final ${set} Q${n}`,
  prompt,
  choices: [{ t: key, ok: true }, ...wrongs.map(([t, why]) => ({ t, why }))],
  steps, recall,
});

// =================================================================
// MOCK FINAL A
// =================================================================
q('A', 1, 'techniques', 'Strategy for Integration', 2,
  R`Evaluate $\displaystyle\int_{1}^{e}\frac{(\ln x)^{2}}{x}\,dx$.`,
  R`$\dfrac13$`,
  [[R`$1$`, R`You integrated $u^{2}$ as $u^{3}$ and forgot to divide by $3$.`],
   [R`$\dfrac{e^{3}-1}{3}$`, R`You changed to $u=\ln x$ but kept the $x$-limits. $u$ runs from $\ln1=0$ to $\ln e=1$.`],
   [R`$\dfrac23$`, R`You differentiated $u^{2}$ instead of integrating it.`]],
  [R`Let $u=\ln x$, so $du=\dfrac{dx}{x}$. Limits: $x=1\to u=0$, $x=e\to u=1$.`,
   R`$\displaystyle\int_0^{1}u^{2}\,du=\dfrac{u^{3}}{3}\Big|_0^{1}=\dfrac13$.`],
  R`When $\frac{1}{x}$ rides along with a power of $\ln x$, set $u=\ln x$ and **change the limits**.`);

q('A', 2, 'techniques', 'Integration by Parts', 3,
  R`Evaluate $\displaystyle\int_{1}^{e}x\ln x\,dx$.`,
  R`$\dfrac{e^{2}+1}{4}$`,
  [[R`$\dfrac{3e^{2}-1}{4}$`, R`Sign error on the second piece. Parts gives $uv-\int v\,du$ — you must **subtract** $\int\frac{x}{2}dx$.`],
   [R`$\dfrac{e^{2}-1}{4}$`, R`That is only $\int\frac{x}{2}dx$. You dropped the boundary term $\frac{x^{2}}{2}\ln x\big|_1^{e}=\frac{e^{2}}{2}$.`],
   [R`$\dfrac{e^{2}}{2}$`, R`That is only the boundary term. You still have to subtract $\int_1^{e}\frac{x}{2}dx=\frac{e^{2}-1}{4}$.`]],
  [R`LIATE: $u=\ln x$, $dv=x\,dx$, so $du=\frac{dx}{x}$, $v=\frac{x^{2}}{2}$.`,
   R`$\displaystyle\int x\ln x\,dx=\frac{x^{2}}{2}\ln x-\int\frac{x}{2}\,dx$.`,
   R`$\left[\frac{x^{2}}{2}\ln x-\frac{x^{2}}{4}\right]_1^{e}=\left(\frac{e^{2}}{2}-\frac{e^{2}}{4}\right)-\left(0-\frac14\right)=\frac{e^{2}+1}{4}$.`],
  R`A log goes in $u$. The boundary term at $x=1$ vanishes because $\ln1=0$, but $-\frac{x^{2}}{4}$ does not.`);

q('A', 3, 'techniques', 'Trigonometric Integrals', 3,
  R`Find $\displaystyle\int\sin^{3}x\cos^{2}x\,dx$.`,
  R`$-\dfrac{\cos^{3}x}{3}+\dfrac{\cos^{5}x}{5}+C$`,
  [[R`$\dfrac{\cos^{3}x}{3}-\dfrac{\cos^{5}x}{5}+C$`, R`Overall sign wrong: $du=-\sin x\,dx$ with $u=\cos x$ flips the sign of the whole answer.`],
   [R`$-\dfrac{\cos^{3}x}{3}-\dfrac{\cos^{5}x}{5}+C$`, R`Sign slip in the second term. $\sin^{2}x=1-\cos^{2}x$ makes the $\cos^{4}x$ term **negative** inside, then the $-du$ flips it to $+$.`],
   [R`$\dfrac{\sin^{4}x}{4}\cdot\dfrac{\cos^{3}x}{3}+C$`, R`You cannot integrate a product factor by factor. Save one $\sin x$ for $du$ and convert the rest.`]],
  [R`Odd power of $\sin$: save one $\sin x$. $\sin^{3}x=\sin x(1-\cos^{2}x)$.`,
   R`$u=\cos x$, $du=-\sin x\,dx$: $\displaystyle\int(1-u^{2})u^{2}(-du)=-\int(u^{2}-u^{4})\,du$.`,
   R`$=-\dfrac{u^{3}}{3}+\dfrac{u^{5}}{5}+C$.`],
  R`Odd power of sine → save one sine, $u=\cos x$. Odd power of cosine → save one cosine, $u=\sin x$.`);

q('A', 4, 'techniques', 'Trigonometric Substitution', 4,
  R`Evaluate $\displaystyle\int_{0}^{2}\frac{dx}{(4+x^{2})^{3/2}}$.`,
  R`$\dfrac{\sqrt2}{8}$`,
  [[R`$\dfrac{\sqrt2}{2}$`, R`The constants were dropped: $(4+x^{2})^{3/2}=8\sec^{3}\theta$ and $dx=2\sec^{2}\theta\,d\theta$ leave a factor $\frac{2}{8}=\frac14$.`],
   [R`$\dfrac{\pi}{8}$`, R`That is $\int_0^{2}\frac{dx}{4+x^{2}}$ — the exponent $\frac32$ was ignored.`],
   [R`$\dfrac{1}{4}$`, R`The upper limit gives $\sin\frac{\pi}{4}=\frac{\sqrt2}{2}$, not $1$.`]],
  [R`$x=2\tan\theta$, $dx=2\sec^{2}\theta\,d\theta$, $(4+x^{2})^{3/2}=8\sec^{3}\theta$. Limits $0\to\frac\pi4$.`,
   R`$\displaystyle\int_0^{\pi/4}\frac{2\sec^{2}\theta}{8\sec^{3}\theta}\,d\theta=\frac14\int_0^{\pi/4}\cos\theta\,d\theta$.`,
   R`$=\frac14\sin\frac\pi4=\dfrac{\sqrt2}{8}$.`],
  R`$a^{2}+x^{2}$ → $x=a\tan\theta$. A $\frac32$ power becomes $\sec^{3}\theta$ and leaves a plain $\cos\theta$.`);

q('A', 5, 'techniques', 'Partial Fractions', 2,
  R`Find $\displaystyle\int\frac{3x+5}{(x+1)(x+3)}\,dx$.`,
  R`$\ln|x+1|+2\ln|x+3|+C$`,
  [[R`$2\ln|x+1|+\ln|x+3|+C$`, R`Coefficients swapped. Cover-up: at $x=-1$, $A=\frac{3(-1)+5}{(-1+3)}=1$; at $x=-3$, $B=\frac{-4}{-2}=2$.`],
   [R`$\ln|x+1|-2\ln|x+3|+C$`, R`Check the sign of $B$: $\frac{3(-3)+5}{(-3+1)}=\frac{-4}{-2}=+2$.`],
   [R`$\ln|x^{2}+4x+3|+C$`, R`That needs the numerator to be the derivative $2x+4$ of the denominator. Here it is $3x+5$, so decompose instead.`]],
  [R`$\dfrac{3x+5}{(x+1)(x+3)}=\dfrac{A}{x+1}+\dfrac{B}{x+3}$.`,
   R`Cover-up: $A=\dfrac{3(-1)+5}{-1+3}=1$, $B=\dfrac{3(-3)+5}{-3+1}=2$.`,
   R`Integrate: $\ln|x+1|+2\ln|x+3|+C$.`],
  R`Distinct linear factors → cover-up gives each numerator instantly. Check with $x=0$: $\frac53=\frac{1}{1}+\frac23$. ✓`);

q('A', 6, 'techniques', 'Improper Integrals', 3,
  R`Evaluate $\displaystyle\int_{1}^{\infty}\frac{\ln x}{x^{2}}\,dx$.`,
  R`$1$`,
  [[R`diverges`, R`The integrand decays like $\frac{\ln x}{x^{2}}$, faster than $\frac1x$ (a $p>1$ comparison). It converges.`],
   [R`$0$`, R`The integrand tends to $0$, but the **area** under it need not be $0$. Compute the antiderivative.`],
   [R`$2$`, R`Sign error in parts: $\int x^{-2}dx=-x^{-1}$. The second term $-\frac1x\big|_1^{\infty}$ contributes $+1$, not $+2$.`]],
  [R`Parts: $u=\ln x$, $dv=x^{-2}dx$, so $v=-x^{-1}$.`,
   R`$\displaystyle\int_1^{b}\frac{\ln x}{x^{2}}dx=\left[-\frac{\ln x}{x}-\frac1x\right]_1^{b}=1-\frac{\ln b+1}{b}$.`,
   R`$\displaystyle\lim_{b\to\infty}\frac{\ln b+1}{b}=0$ (L'Hôpital), so the value is $1$.`],
  R`Write the limit explicitly, find the antiderivative, then evaluate $\lim_{b\to\infty}$. L'Hôpital handles $\frac{\ln b}{b}$.`);

q('A', 7, 'applications', 'Arc Length', 4,
  R`Find the length of $y=\dfrac{x^{2}}{4}-\dfrac{\ln x}{2}$ for $1\le x\le e$.`,
  R`$\dfrac{e^{2}+1}{4}$`,
  [[R`$\dfrac{e^{2}-1}{4}$`, R`You integrated only $\frac{x}{2}$ and dropped the $\frac{1}{2x}$ term, which contributes $\frac12\ln e=\frac12$.`],
   [R`$\dfrac{e^{2}-3}{4}$`, R`You took $\sqrt{1+y'^{2}}=\frac{x}{2}-\frac{1}{2x}$. The "+1" turns the square into $\left(\frac{x}{2}+\frac{1}{2x}\right)^{2}$, so the middle sign is **plus**.`],
   [R`$\dfrac{e^{2}+1}{2}$`, R`Right integrand, but $\int_1^{e}\frac{x}{2}dx=\frac{e^{2}-1}{4}$, not $\frac{e^{2}-1}{2}$.`]],
  [R`$y'=\dfrac x2-\dfrac{1}{2x}$, so $1+y'^{2}=1+\dfrac{x^{2}}{4}-\dfrac12+\dfrac{1}{4x^{2}}=\left(\dfrac x2+\dfrac{1}{2x}\right)^{2}$.`,
   R`$L=\displaystyle\int_1^{e}\left(\frac x2+\frac{1}{2x}\right)dx=\left[\frac{x^{2}}{4}+\frac{\ln x}{2}\right]_1^{e}$.`,
   R`$=\dfrac{e^{2}}{4}+\dfrac12-\dfrac14=\dfrac{e^{2}+1}{4}$.`],
  R`Arc-length problems on exams are rigged so $1+y'^{2}$ is a perfect square. Expand it to see.`);

q('A', 8, 'applications', 'Surface Area', 3,
  R`The curve $y=\sqrt{4-x^{2}}$, $0\le x\le1$, is rotated about the $x$-axis. Find the surface area.`,
  R`$4\pi$`,
  [[R`$2\pi$`, R`You used $y\sqrt{1+y'^{2}}=1$. Actually $y\cdot\frac{2}{y}=2$, so the integrand is $2$.`],
   [R`$8\pi$`, R`You integrated over $0\le x\le2$. The problem stops at $x=1$.`],
   [R`$4\sqrt3\,\pi$`, R`You plugged $x=1$ into $y$ before integrating. The factor $y$ cancels with $\sqrt{1+y'^{2}}=\frac{2}{y}$ and the integrand is the constant $2$.`]],
  [R`$y'=\dfrac{-x}{\sqrt{4-x^{2}}}$, so $\sqrt{1+y'^{2}}=\sqrt{\dfrac{4}{4-x^{2}}}=\dfrac{2}{y}$.`,
   R`$S=2\pi\displaystyle\int_0^{1}y\sqrt{1+y'^{2}}\,dx=2\pi\int_0^{1}2\,dx$.`,
   R`$=4\pi$.`],
  R`$S=2\pi\int y\sqrt{1+y'^{2}}\,dx$ about the $x$-axis. On a circle arc, $y$ and the root cancel.`);

q('A', 9, 'series', 'Ratio & Root Tests', 2,
  R`Apply the Ratio Test to $\displaystyle\sum_{n=1}^{\infty}\frac{n^{2}}{2^{n}}$. What happens?`,
  R`$L=\dfrac12<1$, so the series converges`,
  [[R`$L=1$, so the test is inconclusive`, R`$\left(\frac{n+1}{n}\right)^{2}\to1$, but the $2^{n}$ also contributes a factor $\frac12$. $L=1\cdot\frac12$.`],
   [R`$L=2>1$, so the series diverges`, R`The ratio was inverted. It is $\frac{a_{n+1}}{a_n}$, which has $2^{n}$ in the **numerator** side's denominator, giving $\frac12$.`],
   [R`$L=0$, so the series converges`, R`Exponentials and powers do not produce $0$ here. That happens with factorials in the denominator.`]],
  [R`$\left|\dfrac{a_{n+1}}{a_n}\right|=\dfrac{(n+1)^{2}}{2^{n+1}}\cdot\dfrac{2^{n}}{n^{2}}=\dfrac12\left(\dfrac{n+1}{n}\right)^{2}$.`,
   R`$L=\dfrac12\cdot1=\dfrac12<1$: converges absolutely.`],
  R`Exponential in the denominator beats any polynomial. The Ratio Test returns the base ratio.`);

q('A', 10, 'series', 'Alternating Series & Error', 3,
  R`Classify $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{\sqrt n}$.`,
  R`conditionally convergent`,
  [[R`absolutely convergent`, R`$\sum\left|\frac{(-1)^{n}}{\sqrt n}\right|=\sum\frac{1}{n^{1/2}}$ is a $p$-series with $p=\frac12\le1$ — it diverges.`],
   [R`divergent`, R`The terms decrease to $0$, so the Alternating Series Test says it **converges**.`],
   [R`divergent, since $\lim a_n$ does not exist`, R`$\left|a_n\right|=\frac{1}{\sqrt n}\to0$, so $a_n\to0$. The limit does exist and the divergence test fails.`]],
  [R`Alternating Series Test: $b_n=\frac{1}{\sqrt n}$ is positive, decreasing, and $\to0$. So the series converges.`,
   R`Absolute: $\sum\frac{1}{n^{1/2}}$ diverges ($p=\frac12\le1$).`,
   R`Converges but not absolutely: **conditionally convergent**.`],
  R`Always run two checks: AST for convergence, then $p$-series on $|a_n|$ for absolute vs conditional.`);

q('A', 11, 'series', 'Power Series & Radius', 4,
  R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-2)^{n}}{n\,3^{n}}$.`,
  R`$[-1,5)$`,
  [[R`$(-1,5)$`, R`The endpoints were not tested. $x=-1$ gives $\sum\frac{(-1)^{n}}{n}$, which converges.`],
   [R`$[-1,5]$`, R`$x=5$ gives $\sum\frac1n$, the harmonic series — it diverges.`],
   [R`$(-1,5]$`, R`Endpoints swapped. $x=5$ is the harmonic series (diverges), $x=-1$ the alternating one (converges).`]],
  [R`Ratio Test: $\left|\dfrac{x-2}{3}\right|\cdot\dfrac{n}{n+1}\to\dfrac{|x-2|}{3}<1$, so $|x-2|<3$ and $-1<x<5$.`,
   R`$x=5$: $\sum\dfrac{3^{n}}{n\,3^{n}}=\sum\dfrac1n$ — diverges.`,
   R`$x=-1$: $\sum\dfrac{(-3)^{n}}{n\,3^{n}}=\sum\dfrac{(-1)^{n}}{n}$ — converges (AST).`,
   R`Interval: $[-1,5)$.`],
  R`Ratio test gives the open interval. Substitute each endpoint separately and name the test.`);

q('A', 12, 'series', 'Taylor Polynomials & Error', 3,
  R`Find the degree-3 Taylor polynomial of $f(x)=\ln x$ centred at $a=1$.`,
  R`$(x-1)-\dfrac{(x-1)^{2}}{2}+\dfrac{(x-1)^{3}}{3}$`,
  [[R`$(x-1)-\dfrac{(x-1)^{2}}{2}+\dfrac{(x-1)^{3}}{6}$`, R`$f'''(x)=\frac{2}{x^{3}}$, so $f'''(1)=2$ and $\frac{2}{3!}=\frac13$ (not $\frac16$).`],
   [R`$(x-1)+\dfrac{(x-1)^{2}}{2}+\dfrac{(x-1)^{3}}{3}$`, R`$f''(x)=-\frac{1}{x^{2}}$, so $f''(1)=-1$. The terms alternate in sign.`],
   [R`$x-\dfrac{x^{2}}{2}+\dfrac{x^{3}}{3}$`, R`That is the Maclaurin series of $\ln(1+x)$. Here the centre is $1$, so powers of $(x-1)$ are needed.`]],
  [R`$f(1)=0$, $f'=\frac1x\Rightarrow1$, $f''=-\frac{1}{x^{2}}\Rightarrow-1$, $f'''=\frac{2}{x^{3}}\Rightarrow2$.`,
   R`$T_3=0+1(x-1)-\dfrac{1}{2!}(x-1)^{2}+\dfrac{2}{3!}(x-1)^{3}$.`],
  R`Coefficient $=\frac{f^{(n)}(a)}{n!}$. For $\ln x$ at $1$: $\pm\frac{(n-1)!}{n!}=\pm\frac1n$.`);

q('A', 13, 'polar', 'Polar Area & Arc Length', 3,
  R`Find the area enclosed by the cardioid $r=2+2\cos\theta$.`,
  R`$6\pi$`,
  [[R`$12\pi$`, R`The $\frac12$ in $A=\frac12\int r^{2}d\theta$ was dropped.`],
   [R`$3\pi$`, R`You squared only the $\cos$ part and kept the factor $2$: $r^{2}=4(1+\cos\theta)^{2}$, so the constant is $4$, not $2$.`],
   [R`$4\pi$`, R`That is the area of a circle of radius $2$. A cardioid's polar integral includes the $\cos^{2}\theta$ term, which adds extra area.`]],
  [R`$A=\dfrac12\displaystyle\int_0^{2\pi}4(1+\cos\theta)^{2}\,d\theta=2\int_0^{2\pi}(1+2\cos\theta+\cos^{2}\theta)\,d\theta$.`,
   R`$\int 1=2\pi$, $\int2\cos\theta=0$, $\int\cos^{2}\theta=\pi$ over $[0,2\pi]$.`,
   R`$A=2(2\pi+0+\pi)=6\pi$.`],
  R`Cardioid $r=a(1+\cos\theta)$ has area $\frac{3\pi a^{2}}{2}$; here $a=2$ gives $6\pi$.`);

q('A', 14, 'polar', 'Parametric Calculus', 3,
  R`Find the tangent line to $x=t^{2}+1$, $y=t^{3}-t$ at $t=1$.`,
  R`$y=x-2$`,
  [[R`$y=2(x-2)$`, R`You used $\frac{dy}{dt}=2$ as the slope. The slope is $\frac{dy/dt}{dx/dt}=\frac22=1$.`],
   [R`$y=x-1$`, R`The point at $t=1$ is $(1^{2}+1,\,1-1)=(2,0)$, not $(1,0)$.`],
   [R`$y=\tfrac12(x-2)$`, R`Inverted slope. $\frac{dy}{dx}=\frac{dy/dt}{dx/dt}$, with $\frac{dy}{dt}=3t^{2}-1$ on top.`]],
  [R`Point: $x=2$, $y=0$.`,
   R`$\dfrac{dy}{dx}=\dfrac{3t^{2}-1}{2t}$; at $t=1$ it is $\dfrac22=1$.`,
   R`Line: $y-0=1\cdot(x-2)$, i.e. $y=x-2$.`],
  R`Parametric tangent: point from $(x(t_0),y(t_0))$, slope from $\frac{y'(t_0)}{x'(t_0)}$.`);

// =================================================================
// MOCK FINAL B
// =================================================================
q('B', 1, 'techniques', 'Strategy for Integration', 2,
  R`Evaluate $\displaystyle\int_{0}^{\pi/4}\tan^{3}x\,\sec^{2}x\,dx$.`,
  R`$\dfrac14$`,
  [[R`$1$`, R`After $u=\tan x$ the integral is $\int_0^{1}u^{3}du=\frac{u^{4}}{4}$ — you forgot the $\frac14$.`],
   [R`$\dfrac13$`, R`That would be $\int u^{2}du$. The power is $3$, so the antiderivative is $\frac{u^{4}}{4}$.`],
   [R`$\dfrac12$`, R`That is $\int_0^{1}u\,du$. The $\tan^{3}x$ became $u^{3}$, not $u$.`]],
  [R`$u=\tan x$, $du=\sec^{2}x\,dx$; limits $0\to\tan\frac\pi4=1$.`,
   R`$\displaystyle\int_0^{1}u^{3}du=\frac{u^{4}}{4}\Big|_0^{1}=\frac14$.`],
  R`$\sec^{2}x\,dx$ is exactly $d(\tan x)$ — spot the pair and substitute.`);

q('B', 2, 'techniques', 'Integration by Parts', 3,
  R`Find $\displaystyle\int x^{2}\sin x\,dx$.`,
  R`$-x^{2}\cos x+2x\sin x+2\cos x+C$`,
  [[R`$-x^{2}\cos x+2x\sin x-2\cos x+C$`, R`Last-term sign. After the second round you have $-\int2\cos x\,dx\cdot(-1)$ so the final term is $+2\cos x$.`],
   [R`$-x^{2}\cos x-2x\sin x+2\cos x+C$`, R`The middle sign: $-\int(-\cos x)(2x)\,dx=+2\int x\cos x\,dx$, which starts with $+2x\sin x$.`],
   [R`$-\dfrac{x^{3}}{3}\cos x+C$`, R`You integrated each factor separately. There is no product rule for integrals.`]],
  [R`Tabular: $x^{2},\,2x,\,2,\,0$ against $\sin x,\,-\cos x,\,-\sin x,\,\cos x$.`,
   R`Signs $+,-,+$: $x^{2}(-\cos x)-2x(-\sin x)+2(\cos x)$.`,
   R`$=-x^{2}\cos x+2x\sin x+2\cos x+C$.`],
  R`Polynomial times trig: differentiate the polynomial to $0$ (tabular), alternating signs $+,-,+,\dots$`);

q('B', 3, 'techniques', 'Trigonometric Integrals', 3,
  R`Find $\displaystyle\int\sec^{4}x\,dx$.`,
  R`$\tan x+\dfrac{\tan^{3}x}{3}+C$`,
  [[R`$\tan x+\tan^{3}x+C$`, R`$\int(1+u^{2})du=u+\frac{u^{3}}{3}$ — the $\frac13$ was lost.`],
   [R`$\tan x-\dfrac{\tan^{3}x}{3}+C$`, R`$\sec^{2}x=1+\tan^{2}x$ gives a **plus** sign.`],
   [R`$\dfrac{\sec^{5}x}{5}+C$`, R`The power rule does not apply because $\sec x$ is not the inner function; its derivative is $\sec x\tan x$, not $1$.`]],
  [R`Even power of secant: save $\sec^{2}x$. $\sec^{4}x=(1+\tan^{2}x)\sec^{2}x$.`,
   R`$u=\tan x$: $\displaystyle\int(1+u^{2})\,du=u+\frac{u^{3}}{3}+C$.`],
  R`Even power of $\sec$ → save $\sec^{2}x$, $u=\tan x$. Odd power of $\tan$ → save $\sec x\tan x$, $u=\sec x$.`);

q('B', 4, 'techniques', 'Trigonometric Substitution', 4,
  R`For $x>3$, find $\displaystyle\int\frac{\sqrt{x^{2}-9}}{x}\,dx$.`,
  R`$\sqrt{x^{2}-9}-3\arctan\dfrac{\sqrt{x^{2}-9}}{3}+C$`,
  [[R`$\sqrt{x^{2}-9}+3\arctan\dfrac{\sqrt{x^{2}-9}}{3}+C$`, R`Sign error: $\int\tan^{2}\theta\,d\theta=\tan\theta-\theta$, so the angle term is **subtracted**.`],
   [R`$\sqrt{x^{2}-9}-3\arctan\dfrac{x}{3}+C$`, R`Wrong triangle. With $x=3\sec\theta$ the opposite side is $\sqrt{x^{2}-9}$ and adjacent $3$, so $\theta=\arctan\frac{\sqrt{x^{2}-9}}{3}$.`],
   [R`$\sqrt{x^{2}-9}-\arctan\dfrac{\sqrt{x^{2}-9}}{3}+C$`, R`The factor $3$ from $\sqrt{x^{2}-9}=3\tan\theta$ and $dx$ was lost: the integral is $3\int\tan^{2}\theta\,d\theta$.`]],
  [R`$x=3\sec\theta$, $dx=3\sec\theta\tan\theta\,d\theta$, $\sqrt{x^{2}-9}=3\tan\theta$.`,
   R`$\displaystyle\int\frac{3\tan\theta}{3\sec\theta}\,3\sec\theta\tan\theta\,d\theta=3\int\tan^{2}\theta\,d\theta=3(\tan\theta-\theta)$.`,
   R`Triangle: $\tan\theta=\dfrac{\sqrt{x^{2}-9}}{3}$, so $3\tan\theta=\sqrt{x^{2}-9}$ and $\theta=\arctan\dfrac{\sqrt{x^{2}-9}}{3}$.`],
  R`$x^{2}-a^{2}$ → $x=a\sec\theta$. Draw the triangle to convert back, including the angle itself.`);

q('B', 5, 'techniques', 'Partial Fractions', 3,
  R`Evaluate $\displaystyle\int_{2}^{3}\frac{dx}{x^{2}-1}$.`,
  R`$\dfrac12\ln\dfrac32$`,
  [[R`$\ln\dfrac32$`, R`The partial fractions carry a factor $\frac12$: $\frac{1}{x^{2}-1}=\frac12\left(\frac{1}{x-1}-\frac{1}{x+1}\right)$.`],
   [R`$\dfrac12\ln\dfrac23$`, R`Upper and lower values reversed. Evaluate $F(3)-F(2)$ where $F=\frac12\ln\frac{x-1}{x+1}$.`],
   [R`$\dfrac12\ln2$`, R`$F(3)=\frac12\ln\frac12$ and $F(2)=\frac12\ln\frac13$. Subtract both logs rather than using only one.`]],
  [R`$\dfrac{1}{(x-1)(x+1)}=\dfrac{1/2}{x-1}-\dfrac{1/2}{x+1}$.`,
   R`$F(x)=\dfrac12\ln\dfrac{x-1}{x+1}$.`,
   R`$F(3)-F(2)=\dfrac12\left(\ln\dfrac12-\ln\dfrac13\right)=\dfrac12\ln\dfrac32$.`],
  R`Difference of squares factors into two linear pieces; combine the logs with $\ln a-\ln b=\ln\frac ab$.`);

q('B', 6, 'techniques', 'Improper Integrals', 3,
  R`Evaluate $\displaystyle\int_{0}^{1}\ln x\,dx$.`,
  R`$-1$`,
  [[R`$1$`, R`Sign. $\int\ln x\,dx=x\ln x-x$, and at $x=1$ this is $-1$; at $0^{+}$ it tends to $0$.`],
   [R`diverges`, R`$\ln x\to-\infty$ at $0$, but slowly enough that $x\ln x\to0$ and the area is finite.`],
   [R`$0$`, R`The lower-limit term $x\ln x-x\to0$, but the upper-limit term $1\cdot0-1=-1$ survives.`]],
  [R`Improper at $x=0$: $\displaystyle\lim_{a\to0^{+}}\int_a^{1}\ln x\,dx$.`,
   R`$\int\ln x\,dx=x\ln x-x$ (parts).`,
   R`$(0-1)-\lim_{a\to0^{+}}(a\ln a-a)=-1-0=-1$.`],
  R`$a\ln a\to0$ as $a\to0^{+}$ (L'Hôpital on $\frac{\ln a}{1/a}$).`);

q('B', 7, 'applications', 'Arc Length', 3,
  R`Find the length of $y=\ln(\cos x)$ for $0\le x\le\dfrac\pi4$.`,
  R`$\ln(1+\sqrt2)$`,
  [[R`$\ln\sqrt2$`, R`That is $\ln(\sec\frac\pi4)$, only the first piece of $\ln|\sec x+\tan x|$.`],
   [R`$\sqrt2-1$`, R`You evaluated $\sec\frac\pi4-\sec0$, i.e. $\int\sec x\tan x$. The integrand is $\sec x$.`],
   [R`$1$`, R`That is $\tan\frac\pi4$. $\int\sec x\,dx=\ln|\sec x+\tan x|$, not $\tan x$.`]],
  [R`$y'=-\tan x$, so $\sqrt{1+y'^{2}}=\sqrt{\sec^{2}x}=\sec x$.`,
   R`$L=\displaystyle\int_0^{\pi/4}\sec x\,dx=\ln|\sec x+\tan x|\Big|_0^{\pi/4}$.`,
   R`$=\ln(\sqrt2+1)-\ln1=\ln(1+\sqrt2)$.`],
  R`Memorise $\int\sec x\,dx=\ln|\sec x+\tan x|$. It shows up whenever $1+y'^{2}=\sec^{2}x$.`);

q('B', 8, 'applications', 'Surface Area', 4,
  R`The curve $y=\sqrt x$, $0\le x\le2$, is rotated about the $x$-axis. Find the surface area.`,
  R`$\dfrac{13\pi}{3}$`,
  [[R`$\dfrac{26\pi}{3}$`, R`Off by a factor of $2$: $2\pi\cdot\frac23\cdot\frac{26}{8}=\frac{13\pi}{3}$.`],
   [R`$\dfrac{13\pi}{6}$`, R`The $\frac23$ from integrating $(x+\frac14)^{1/2}$ gives $\frac23$, not $\frac13$.`],
   [R`$\dfrac{13\pi}{12}$`, R`Both the $2\pi$ and the $\frac23$ matter; a stray factor of $\frac14$ was applied.`]],
  [R`$y'=\dfrac{1}{2\sqrt x}$, so $y\sqrt{1+y'^{2}}=\sqrt x\sqrt{1+\dfrac{1}{4x}}=\sqrt{x+\dfrac14}$.`,
   R`$S=2\pi\displaystyle\int_0^{2}\sqrt{x+\tfrac14}\,dx=2\pi\cdot\dfrac23\left[(x+\tfrac14)^{3/2}\right]_0^{2}$.`,
   R`$\left(\tfrac94\right)^{3/2}=\tfrac{27}{8}$, $\left(\tfrac14\right)^{3/2}=\tfrac18$: $S=\dfrac{4\pi}{3}\cdot\dfrac{26}{8}=\dfrac{13\pi}{3}$.`],
  R`Multiply $y$ into the root before integrating: for $y=\sqrt x$ the integrand collapses to $\sqrt{x+1/4}$.`);

q('B', 9, 'series', 'Divergence & Integral Tests', 4,
  R`Does $\displaystyle\sum_{n=2}^{\infty}\frac{1}{n(\ln n)^{2}}$ converge?`,
  R`Yes — the integral test: $\displaystyle\int_2^{\infty}\frac{dx}{x(\ln x)^{2}}=\frac{1}{\ln2}$ is finite`,
  [[R`No — it behaves like the harmonic series $\sum\frac1n$`, R`Being smaller than a divergent series proves nothing. Use the integral test with $u=\ln x$.`],
   [R`No — $\int\frac{dx}{x\ln x}=\ln\ln x$ diverges`, R`That integral has $\ln x$ to the first power. With $(\ln x)^{2}$ you get $-\frac{1}{\ln x}$, which tends to $0$.`],
   [R`Yes — by the Alternating Series Test`, R`There is no $(-1)^{n}$ here. The series has all positive terms.`]],
  [R`$f(x)=\dfrac{1}{x(\ln x)^{2}}$ is positive, continuous and decreasing for $x\ge2$.`,
   R`$u=\ln x$: $\displaystyle\int_2^{\infty}\frac{dx}{x(\ln x)^{2}}=\int_{\ln2}^{\infty}u^{-2}du=\frac{1}{\ln2}$.`,
   R`The integral converges, so the series converges.`],
  R`Terms with $x\ln x$ products that disguise a $\frac{du}{u^{p}}$ call for the Integral Test.`);

q('B', 10, 'series', 'Applications of Series', 3,
  R`Find the sum of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}$.`,
  R`$\ln\dfrac32$`,
  [[R`$\ln\dfrac12$`, R`Sign: the series starts $+\frac12-\frac18+\dots>0$, but $\ln\frac12<0$. Use $\ln(1+x)$ at $x=\frac12$, not $\ln(1-x)$.`],
   [R`$\dfrac23$`, R`That would be a geometric sum. The $\frac1n$ makes this the $\ln(1+x)$ series.`],
   [R`$\ln3$`, R`$x=2$ would give $\ln3$, but the series has $\left(\frac12\right)^{n}$, so $x=\frac12$.`]],
  [R`$\ln(1+x)=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$.`,
   R`The given series is exactly this with $x=\tfrac12$.`,
   R`Sum $=\ln\left(1+\tfrac12\right)=\ln\tfrac32$.`],
  R`Match the pattern to a table series, identify $x$, and plug in. A $\frac1n$ with alternating signs signals $\ln(1+x)$.`);

q('B', 11, 'series', 'Power Series & Radius', 4,
  R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(2x)^{n}}{\sqrt n}$.`,
  R`$\left[-\tfrac12,\tfrac12\right)$`,
  [[R`$\left(-\tfrac12,\tfrac12\right]$`, R`Endpoints swapped. $x=\frac12$ gives $\sum\frac{1}{\sqrt n}$ (diverges); $x=-\frac12$ gives $\sum\frac{(-1)^{n}}{\sqrt n}$ (converges).`],
   [R`$\left[-\tfrac12,\tfrac12\right]$`, R`At $x=\frac12$ the series is the $p$-series with $p=\frac12$, which diverges.`],
   [R`$[-2,2)$`, R`$|2x|<1$ means $|x|<\frac12$. The radius is $\frac12$, not $2$.`]],
  [R`Ratio: $\left|\dfrac{2x\sqrt n}{\sqrt{n+1}}\right|\to|2x|<1$, so $|x|<\frac12$.`,
   R`$x=\frac12$: $\sum\frac{1}{n^{1/2}}$ — diverges ($p=\frac12$).`,
   R`$x=-\frac12$: $\sum\frac{(-1)^{n}}{\sqrt n}$ — converges (AST).`],
  R`Radius of $\sum(cx)^{n}$ is $\frac1{|c|}$. Test each endpoint separately.`);

q('B', 12, 'series', 'Taylor Polynomials & Error', 4,
  R`$T_{3}$ is the degree-3 Taylor polynomial of $\ln x$ at $a=1$. Use Taylor's inequality to bound $\left|R_{3}\!\left(\tfrac32\right)\right|$.`,
  R`$\dfrac{1}{64}$`,
  [[R`$\dfrac38$`, R`You forgot the $\frac{1}{4!}$: $\frac{M|x-a|^{4}}{4!}$ with $M=6$ gives $\frac{6}{24}\cdot\frac{1}{16}$.`],
   [R`$\dfrac{1}{16}$`, R`That is only $|x-a|^{4}=\left(\frac12\right)^{4}$. Multiply by $\frac{M}{4!}=\frac14$.`],
   [R`$\dfrac{1}{384}$`, R`You used $M=1$. Since $f^{(4)}(x)=-\frac{6}{x^{4}}$, the maximum of $\left|f^{(4)}\right|$ on $[1,\frac32]$ is $6$ (at $x=1$).`]],
  [R`Degree $n=3$, so use $f^{(4)}$: $f^{(4)}(x)=-\dfrac{6}{x^{4}}$.`,
   R`On $[1,\frac32]$: $\left|f^{(4)}\right|\le6=M$ (largest at the left end).`,
   R`$|R_3|\le\dfrac{6}{4!}\left(\dfrac12\right)^{4}=\dfrac14\cdot\dfrac{1}{16}=\dfrac{1}{64}$.`],
  R`Degree $n$ → derivative $n+1$ → divide by $(n+1)!$. $M$ is the max over the whole interval.`);

q('B', 13, 'polar', 'Polar Area & Arc Length', 4,
  R`Find the area inside $r=2\cos\theta$ and outside $r=1$.`,
  R`$\dfrac\pi3+\dfrac{\sqrt3}{2}$`,
  [[R`$\dfrac\pi3-\dfrac{\sqrt3}{2}$`, R`Sign in the final evaluation: $\sin\frac{2\pi}{3}=+\frac{\sqrt3}{2}$.`],
   [R`$\dfrac{2\pi}{3}+\sqrt3$`, R`This is exactly twice the answer — the $\frac12$ in $\frac12\int(r_{\text{out}}^{2}-r_{\text{in}}^{2})$ was dropped.`],
   [R`$\dfrac\pi3+\dfrac{\sqrt3}{4}$`, R`Check $\int_0^{\pi/3}2\cos2\theta\,d\theta=\sin\frac{2\pi}{3}=\frac{\sqrt3}{2}$; no extra $\frac12$.`]],
  [R`Intersect: $2\cos\theta=1\Rightarrow\theta=\pm\frac\pi3$.`,
   R`$A=\dfrac12\displaystyle\int_{-\pi/3}^{\pi/3}(4\cos^{2}\theta-1)\,d\theta=\int_0^{\pi/3}(1+2\cos2\theta)\,d\theta$.`,
   R`$=\left[\theta+\sin2\theta\right]_0^{\pi/3}=\dfrac\pi3+\dfrac{\sqrt3}{2}$.`],
  R`Between polar curves: $\frac12\int(r_{\text{out}}^{2}-r_{\text{in}}^{2})$, limits at intersections. Use symmetry to halve the range.`);

q('B', 14, 'polar', 'Parametric Calculus', 4,
  R`Find the length of $x=t^{2}$, $y=\dfrac{t^{3}}{3}-t$ for $0\le t\le3$.`,
  R`$12$`,
  [[R`$6$`, R`Sign slip: $4t^{2}+(t^{2}-1)^{2}=(t^{2}+1)^{2}$, so the integrand is $t^{2}+1$, not $t^{2}-1$.`],
   [R`$9$`, R`You dropped the $+1$. $\int_0^{3}(t^{2}+1)\,dt=9+3$.`],
   [R`$24$`, R`Twice the integral: arc length is a single $\int\sqrt{x'^{2}+y'^{2}}\,dt$.`]],
  [R`$x'=2t$, $y'=t^{2}-1$.`,
   R`$x'^{2}+y'^{2}=4t^{2}+t^{4}-2t^{2}+1=(t^{2}+1)^{2}$.`,
   R`$L=\displaystyle\int_0^{3}(t^{2}+1)\,dt=\left[\frac{t^{3}}{3}+t\right]_0^{3}=9+3=12$.`],
  R`If $x'^{2}+y'^{2}$ is not obviously a perfect square, expand it — exam problems are rigged so that it is.`);

export const mockFinal = { unit: 'series', problems: P, generators: G };
