// js/bank/lessons/ln-final.js — Final Exam Review (run fin). Contract: .hnic/context/fin-contract.md
const R = String.raw;
const para = (...a) => a.join('\n\n');
const TECH = 'techniques', SER = 'series', APP = 'applications', POL = 'polar';
const S = 'Strategy for Integration', CT = 'Choosing a Test', TM = 'Taylor & Maclaurin Series',
  PS = 'Power Series & Radius', AL = 'Arc Length', PA = 'Polar Area & Arc Length', PC = 'Parametric Calculus';

export default {
  id: 'ln-final',
  goal: R`Look at any problem on the cumulative final, name the tool that solves it (integration technique, convergence test, power or Taylor series, arc length, polar or parametric), and run that tool from start to finish.`,
  why: R`The final is 25% of your grade, more than any two midterms combined, and it covers the whole term. It is mostly a "which tool?" exam: if you pick the right tool in the first ten seconds, the rest is routine.`,
  plain: para(
    R`Picture a toolbox with seven drawers. One drawer holds integration techniques. One holds the convergence tests. The rest hold power series, Taylor series, arc length, polar and parametric curves. Every exam question is a job. Your first move is to open the right drawer.`,
    R`That is why the final feels hard even when every single method is easy. Nobody tells you which drawer. A question says "compute the integral" or "determine whether the series converges", and you must decide how. This lesson trains that decision.`,
    R`His past finals run 15 to 18 questions. Roughly five or six are integrals, six or seven are convergence questions, three are power or Taylor series, and one each covers arc length, polar and parametric. So integration and series are about three quarters of the paper.`,
    R`Plan for the night before: read each recap once, then work the practice ladder without notes. When you miss one, do not reread everything. Find the drawer you opened wrongly and write one line about how to spot it next time.`,
  ),
  prereq: [
    { term: R`derivative and integral rules`, means: R`Power rule, chain rule, and basic antiderivatives such as $\int e^{x}dx=e^{x}+C$. Calc I material you must do without thinking.` },
    { term: R`series, term, partial sum`, means: R`A series $\sum a_n$ is a long sum of terms $a_1+a_2+a_3+\cdots$. It "converges" if the running total settles on one number, and "diverges" if it does not.` },
    { term: R`limit as $n\to\infty$`, means: R`What a quantity approaches when $n$ gets huge. For example $\dfrac{n}{2n+1}\to\dfrac12$.` },
    { term: R`factorial $n!$`, means: R`$n!=1\cdot2\cdots n$, so $3!=6$ and $5!=120$. It grows faster than any power of $n$.` },
    { term: R`radians and basic trig`, means: R`Values like $\sin\frac{\pi}{6}=\frac12$, and identities such as $\sin^{2}\theta+\cos^{2}\theta=1$.` },
  ],
  sections: [
    {
      h: 'How the final is built and how to study',
      body: para(
        R`Start with the question: where do the points come from? Based on his last three finals, about five or six questions are integration techniques, six or seven are convergence tests, and three are power series or Taylor series. Arc length, polar and parametric get about one question each.`,
        R`The instructions repeat. "Compute the integral (show all work, completely simplify)." "Determine whether the series converges absolutely, conditionally, or diverges. Fully justify." "Find the interval of convergence." "Set up but do not evaluate an integral for arc length." Notice that a "set up" question stops at the integral. Evaluating it wastes time and can lose points.`,
        R`How to study: series is the biggest block, so start there. Integration is the easiest place to win points back, because the methods are mechanical once you name the technique. Do not skip polar and parametric because they came last. Each is a short question where you only need two or three formulas.`,
      ),
      check: { q: R`A question says "Set up but do not evaluate an integral for the arc length." What do you write?`, a: R`Write the definite integral with limits and stop. Do not antidifferentiate.` },
    },
    {
      h: 'Integration: name the technique first',
      body: para(
        R`The question here is "what does this integral look like?" Match the look to a technique. A function and its derivative both appear, as in $x\,e^{x^{2}}$: use **u-substitution**. A product of unrelated pieces, as in $x\ln x$: use **parts**, and choose $u$ by LIATE (Log, Inverse trig, Algebraic, Trig, Exp). Powers of $\sin$ and $\cos$: use a **trig integral**. $\sqrt{a^{2}-x^{2}}$ or $(a^{2}-x^{2})^{3/2}$: use **trig substitution** with $x=a\sin\theta$.`,
        R`A fraction of polynomials uses **partial fractions**, with one catch. If the top degree is at least the bottom degree, do **long division** first. Otherwise the decomposition is set up wrong. For $\dfrac{x^{2}+1}{x^{2}-1}$ the degrees are equal, so divide: it equals $1+\dfrac{2}{x^{2}-1}$.`,
        R`**Improper** means an infinite limit or a spot where the function blows up. Replace the trouble spot by a letter, integrate, then take the limit. For definite integrals with $u$-substitution, change the limits too, or go back to $x$ before plugging in.`,
      ),
      check: { q: R`Which technique first for $\displaystyle\int\frac{x^{3}}{x^{2}+1}dx$?`, a: R`Long division (top degree 3 is bigger than bottom degree 2). It gives $x-\dfrac{x}{x^{2}+1}$, then a $u$-substitution on the second piece.` },
    },
    {
      h: 'Series: the convergence tests in order',
      body: para(
        R`Question: does $\sum a_n$ settle on a number? There is a standard order. First the **Divergence Test**: if $a_n$ does not go to $0$, the series diverges. If $a_n\to0$ the test says nothing. It can never prove convergence.`,
        R`Then match the look. Geometric $\sum ar^{n}$: converges when $|r|<1$. $p$-series $\sum\frac{1}{n^{p}}$: converges when $p>1$. Factorials or exponentials such as $\frac{n!}{3^{n}}$: **Ratio Test**. Something to the $n$-th power, such as $\left(\frac{n}{2n+1}\right)^{n}$: **Root Test**. Rational terms like $\frac{2n+1}{n^{3}+4}$: **Limit Comparison** with the $p$-series of the leading powers. Alternating signs: **Alternating Series Test** (terms decrease to $0$).`,
        R`For "absolutely, conditionally, or diverges", test $\sum|a_n|$ first. If it converges, the answer is absolutely convergent. If it diverges but the alternating series converges, the answer is conditionally convergent. The Ratio and Root Tests give $L=1$ for rational terms, which means inconclusive. Do not call it divergent.`,
      ),
      check: { q: R`$\sum\dfrac{(-1)^{n}}{n}$: absolutely, conditionally, or diverges?`, a: R`Conditionally. $\sum\frac1n$ diverges ($p=1$), but the alternating version passes the Alternating Series Test.` },
    },
    {
      h: 'Power series: radius and interval of convergence',
      body: para(
        R`A power series is a series with a variable in it: $\sum c_n(x-c)^{n}$. The number $c$ is the **centre**. The question is for which $x$ it converges. The answer is always an interval around $c$.`,
        R`Run the Ratio Test on the whole term, $x$ included. Get a condition like $|x-c|<R$. The number $R$ is the **radius of convergence**. So the series converges for sure on $(c-R,\,c+R)$ and diverges outside it.`,
        R`The ratio test says nothing at the two endpoints, so you must test them one at a time. Put $x=c-R$ into the series, then $x=c+R$, and use the series tests from the last section. Each endpoint is either in (square bracket) or out (round bracket). That is the **interval of convergence**.`,
        R`Example: $\sum\dfrac{(x-3)^{n}}{n\,2^{n}}$ has $R=2$ and centre $3$. At $x=5$ you get $\sum\frac1n$, which diverges. At $x=1$ you get $\sum\frac{(-1)^{n}}{n}$, which converges. The interval is $[1,5)$.`,
      ),
      check: { q: R`$\sum c_n(x-3)^{n}$ has radius $R=2$. What can you say about $x=5$?`, a: R`Nothing yet. $x=5$ is an endpoint ($3+2$), so you must test it separately.` },
    },
    {
      h: 'Taylor and Maclaurin series, and the error',
      body: para(
        R`A Taylor series rebuilds a function from its derivatives at one point $c$: $\sum\dfrac{f^{(n)}(c)}{n!}(x-c)^{n}$. A **Maclaurin** series is the case $c=0$. Memorize six: $\dfrac{1}{1-x}=\sum x^{n}$ for $|x|<1$, $e^{x}=\sum\dfrac{x^{n}}{n!}$, $\sin x$ (odd powers, alternating signs), $\cos x$ (even powers, alternating), $\ln(1+x)=\sum\dfrac{(-1)^{n+1}x^{n}}{n}$ on $(-1,1]$, and $\arctan x$ (odd powers, alternating) on $[-1,1]$.`,
        R`Almost every exam problem is a swap, not a new derivation. For $e^{-x^{2}}$ replace $x$ by $-x^{2}$ in the $e^{x}$ series to get $1-x^{2}+\frac{x^{4}}{2}-\cdots$. To multiply by $x$, add $1$ to every exponent. A coefficient trick: the coefficient of $x^{n}$ is $\dfrac{f^{(n)}(0)}{n!}$, so $f^{(n)}(0)=n!\times$ coefficient.`,
        R`**Error:** if you stop at degree $n$, then $|R_n(x)|\le\dfrac{M}{(n+1)!}|x-c|^{n+1}$, where $M$ is the largest $|f^{(n+1)}|$ on the interval. Series also compute limits. Since $\sin x=x-\frac{x^{3}}{6}+\cdots$, the limit $\frac{x-\sin x}{x^{3}}$ is $\frac16$ as $x\to0$.`,
      ),
      check: { q: R`First three nonzero terms of the Maclaurin series of $e^{-x^{2}}$?`, a: R`$1-x^{2}+\dfrac{x^{4}}{2}$. Replace $x$ by $-x^{2}$ in $1+x+\frac{x^{2}}{2}$.` },
    },
    {
      h: 'Arc length, polar and parametric curves',
      body: para(
        R`Three small topics, each with one or two formulas. **Arc length** is the length of a curve. For $y=f(x)$ from $a$ to $b$: $L=\displaystyle\int_a^b\sqrt{1+\big(f'(x)\big)^{2}}\,dx$. For a parametric curve $x(t),y(t)$: $L=\displaystyle\int_a^b\sqrt{x'(t)^{2}+y'(t)^{2}}\,dt$. In polar form: $L=\displaystyle\int\sqrt{r^{2}+(r')^{2}}\,d\theta$. The idea is Pythagoras on tiny pieces.`,
        R`**Parametric** means $x$ and $y$ both depend on a third letter $t$. The slope is $\dfrac{dy}{dx}=\dfrac{dy/dt}{dx/dt}$. A tangent is horizontal where $dy/dt=0$ (with $dx/dt\ne0$), and vertical where $dx/dt=0$. For the second derivative, differentiate $\frac{dy}{dx}$ with respect to $t$, then divide by $\frac{dx}{dt}$ again.`,
        R`**Polar** curves use distance $r$ and angle $\theta$. The area inside is $A=\dfrac12\displaystyle\int r^{2}\,d\theta$, over the angles that trace the curve once. The cardioid $r=1+\cos\theta$ is traced once on $0\le\theta\le2\pi$, and its area is $\frac{3\pi}{2}$.`,
      ),
      check: { q: R`For $x=t^{2}$, $y=t^{3}$, what is $\dfrac{dy}{dx}$?`, a: R`$\dfrac{3t^{2}}{2t}=\dfrac{3t}{2}$.` },
    },
    {
      h: 'The decision map: which tool when',
      body: para(
        R`This section is the point of the lesson. Read the question and look for these clues, in this order.`,
        R`"Compute", "evaluate", or an integral sign: open the integration drawer and name the technique (u-sub, parts, trig integral, trig sub, partial fractions, improper). "Series" with a $\sum$ and no $x$: convergence tests, starting with the Divergence Test. "Series" with an $x$ in the term, or "interval", "radius": Ratio Test on the whole term, then the two endpoints. "Maclaurin", "Taylor", "approximate", "error": swap into one of the six series, or use the remainder bound.`,
        R`"Length of the curve" or "set up": an arc length integral, and stop at the setup if told to. Letters $t$ with $x(t),y(t)$: parametric slope or length. Letters $r$ and $\theta$: polar area $\frac12\int r^{2}d\theta$. If two clues fit, take the more specific one. A rational series like $\frac{2n+1}{n^{3}+4}$ might tempt you to use the Ratio Test, but that gives $L=1$. Use Limit Comparison instead.`,
      ),
      check: { q: R`Which tool for $\displaystyle\sum_{n=1}^{\infty}\frac{n!}{3^{n}}$?`, a: R`Ratio Test. Factorials and exponentials: $\frac{n+1}{3}\to\infty$, so it diverges.` },
    },
  ],
  recipe: [
    R`Read the verb and the symbols: integral sign, $\sum$ with or without $x$, $x(t)$ and $y(t)$, or $r(\theta)$. Name the drawer.`,
    R`Name the specific tool using the decision map: technique for integrals, Divergence Test then the matching test for series, Ratio Test plus endpoints for power series.`,
    R`Write the formula or setup before computing anything. For "set up", write the integral and stop.`,
    R`Run the method, showing each step. Change limits with $u$-substitution. Keep $|x-c|<R$ and the endpoints separate.`,
    R`Check the answer: a series conclusion must name the test and the reason, and an integral must be fully simplified.`,
    R`If a test is inconclusive ($L=1$ or $a_n\to0$), say so and switch tools. Do not guess.`,
  ],
  worked: [
    {
      q: R`Which test settles each? (a) $\sum\dfrac{n!}{3^{n}}$  (b) $\sum\dfrac{2n+1}{n^{3}+4}$  (c) $\sum\left(\dfrac{n}{2n+1}\right)^{n}$  (d) $\sum\dfrac{(-1)^{n}}{\ln n}$ for $n\ge2$.`,
      steps: [
        R`(a) Factorial and exponential means Ratio Test. The ratio of consecutive terms is $\frac{n+1}{3}\to\infty$. Since $L>1$, the series **diverges**.`,
        R`(b) Rational terms: compare with $\sum\frac{1}{n^{2}}$ (leading powers $\frac{n}{n^{3}}$). Limit Comparison gives $\lim\frac{(2n+1)n^{2}}{n^{3}+4}=2$, a finite positive number, and $p=2>1$. So it **converges**. The Ratio Test would give $L=1$ and tell us nothing.`,
        R`(c) The whole term is raised to the $n$-th power, so use the Root Test. $\sqrt[n]{a_n}=\frac{n}{2n+1}\to\frac12<1$, so it **converges**.`,
        R`(d) Alternating, so try the Alternating Series Test. $\frac{1}{\ln n}$ decreases to $0$, so the series converges. For absolute value, $\frac{1}{\ln n}\ge\frac1n$ and $\sum\frac1n$ diverges, so $\sum|a_n|$ diverges. The answer is **conditionally convergent**.`,
      ],
      note: R`Four series, four tests: this is the convergence block of the final in miniature.`,
    },
    {
      q: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-1)^{n}}{n\,3^{n}}$.`,
      steps: [
        R`The centre is $1$. Use the Ratio Test on the whole term, including $x$. The ratio $\left|\frac{a_{n+1}}{a_n}\right|=\frac{|x-1|}{3}\cdot\frac{n}{n+1}$.`,
        R`As $n\to\infty$, $\frac{n}{n+1}\to1$, so $L=\frac{|x-1|}{3}$. Convergence needs $L<1$, so $|x-1|<3$ and $R=3$. That is the open interval $(-2,4)$.`,
        R`The Ratio Test fails at the endpoints, so test them. At $x=4$: $\sum\frac{3^{n}}{n\,3^{n}}=\sum\frac1n$, the harmonic series ($p=1$), which **diverges**. So $4$ is out.`,
        R`At $x=-2$: $\sum\frac{(-3)^{n}}{n\,3^{n}}=\sum\frac{(-1)^{n}}{n}$. Terms $\frac1n$ decrease to $0$, so the Alternating Series Test says it **converges**. So $-2$ is in.`,
        R`Combine: the interval of convergence is $[-2,4)$.`,
      ],
      note: R`Two endpoints, two different answers. This is why you cannot copy the same bracket on both sides.`,
    },
    {
      q: R`Use a Maclaurin series to evaluate $\displaystyle\lim_{x\to0}\frac{x-\sin x}{x^{3}}$.`,
      steps: [
        R`Direct substitution gives $\frac00$. A series lets us see what cancels. Recall $\sin x=x-\frac{x^{3}}{3!}+\frac{x^{5}}{5!}-\cdots$ (odd powers, alternating signs).`,
        R`Compute the top: $x-\sin x=x-\left(x-\frac{x^{3}}{6}+\frac{x^{5}}{120}-\cdots\right)=\frac{x^{3}}{6}-\frac{x^{5}}{120}+\cdots$. The $x$ terms cancel, which is why the limit exists.`,
        R`Divide every term by $x^{3}$: $\frac{x-\sin x}{x^{3}}=\frac16-\frac{x^{2}}{120}+\cdots$.`,
        R`Let $x\to0$. Every term with $x$ in it goes to $0$, leaving $\frac16$.`,
      ],
      note: R`When a limit is $\frac00$ and involves $\sin$, $\cos$, $e^{x}$ or $\ln(1+x)$, expand the series until the first term that does not cancel.`,
    },
    {
      q: R`Showing all your work, find the length of the curve $x=t^{2}$, $y=t^{3}$ for $0\le t\le1$.`,
      steps: [
        R`The curve is parametric, so use $L=\int_0^{1}\sqrt{x'(t)^{2}+y'(t)^{2}}\,dt$.`,
        R`Differentiate: $x'=2t$ and $y'=3t^{2}$. Then $x'^{2}+y'^{2}=4t^{2}+9t^{4}$.`,
        R`Factor out $t^{2}$ so the square root can be pulled apart: $\sqrt{4t^{2}+9t^{4}}=\sqrt{t^{2}(4+9t^{2})}=t\sqrt{4+9t^{2}}$. This is allowed because $t\ge0$ on $[0,1]$.`,
        R`Now it is a $u$-substitution. Let $u=4+9t^{2}$, so $du=18t\,dt$ and $t\,dt=\frac{du}{18}$. Limits: $t=0$ gives $u=4$ and $t=1$ gives $u=13$.`,
        R`Integrate: $\int_4^{13}\sqrt{u}\,\frac{du}{18}=\frac{1}{18}\cdot\frac23u^{3/2}\Big|_4^{13}=\frac{1}{27}\left(13^{3/2}-4^{3/2}\right)$.`,
        R`Simplify: $4^{3/2}=8$ and $13^{3/2}=13\sqrt{13}$, so $L=\dfrac{13\sqrt{13}-8}{27}\approx1.44$.`,
      ],
      note: R`One question, two drawers: parametric arc length to get the integral, then $u$-substitution to finish it.`,
    },
  ],
  exam: [
    'Set up but do not evaluate an integral for arc length / surface area. (Exam 1 v1 Q2 pattern)',
    'Determine whether the series converges absolutely, conditionally, or diverges. Fully justify. (6 to 7 per final)',
    'Compute the integral (show all work, completely simplify). (Exam 1 Q1, Q3, Q4, Q5, Q6, Q8)',
    'Find the interval of convergence / Maclaurin series / error bound.',
    'Compute the area enclosed by a polar curve, or $\\frac{dy}{dx}$ and $\\frac{d^{2}y}{dx^{2}}$ for a parametric curve.',
  ],
  traps: [
    R`Under-preparing integration because it feels like old material. It is a third of the paper. Avoid it: do two integrals per technique tonight, naming the technique before computing.`,
    R`Neglecting polar and parametric because they were taught last. Avoid it: memorize the three formulas ($\frac12\int r^{2}d\theta$, $\frac{dy/dt}{dx/dt}$, $\int\sqrt{x'^{2}+y'^{2}}dt$); that is most of the points.`,
    R`Using the Ratio Test on a rational series like $\frac{2n+1}{n^{3}+4}$: $L=1$ is inconclusive. Avoid it: rational terms need Limit Comparison.`,
    R`Writing "converges" because $a_n\to0$. The Divergence Test only proves divergence. Avoid it: use a real test to prove convergence.`,
    R`Giving the radius but skipping the endpoints. Avoid it: always test $x=c-R$ and $x=c+R$ separately; they can differ.`,
    R`Doing partial fractions when the top degree is at least the bottom degree. Avoid it: long division first.`,
  ],
  practice: [
    {
      id: 'lp-final-01', unit: TECH, topic: S, stage: 'warmup', diff: 2, arch: 'int-pick-technique',
      prompt: R`You are asked to compute $\displaystyle\int\frac{x^{2}+1}{x^{2}-1}\,dx$. Which step should you take first?`,
      choices: [
        { t: R`Long division, because the top degree equals the bottom degree`, ok: true },
        { t: R`Partial fractions right away: $\dfrac{A}{x-1}+\dfrac{B}{x+1}$`, why: R`Partial fractions only work when the top degree is LESS than the bottom. Here the degrees are equal, so this form cannot match $x^{2}+1$.`, err: 'setup' },
        { t: R`Trig substitution $x=\sin\theta$`, why: R`Trig substitution fits roots like $\sqrt{1-x^{2}}$. There is no square root in this integral.`, err: 'concept' },
        { t: R`$u$-substitution with $u=x^{2}-1$`, why: R`That needs $du=2x\,dx$ to appear in the top. The top is $x^{2}+1$, which has no $x$ factor to match.`, err: 'concept' },
      ],
      hints: [R`Compare the degree of the top with the degree of the bottom.`, R`Equal degrees means the fraction is "improper", like $\frac{7}{3}$.`],
      steps: [
        R`Top degree is $2$ and bottom degree is $2$, so the fraction is improper.`,
        R`Divide: $\frac{x^{2}+1}{x^{2}-1}=1+\frac{2}{x^{2}-1}$.`,
        R`Now partial fractions applies to $\frac{2}{x^{2}-1}=\frac{1}{x-1}-\frac{1}{x+1}$, giving $x+\ln\left|\frac{x-1}{x+1}\right|+C$.`,
      ],
      recall: R`Top degree at least bottom degree: long division before partial fractions.`,
    },
    {
      id: 'lp-final-02', unit: SER, topic: CT, stage: 'warmup', diff: 1, arch: 'ser-divergence-converse', tf: true,
      prompt: R`True or false: if $\displaystyle\lim_{n\to\infty}a_n=0$, then $\sum a_n$ converges.`,
      choices: [
        { t: 'False', ok: true },
        { t: 'True', why: R`This is the Divergence Test run backwards. The harmonic series $\sum\frac1n$ has terms going to $0$ but still diverges.`, err: 'concept' },
      ],
      hints: [R`Think of $\sum\frac1n$.`, R`Do the terms $\frac1n$ go to $0$? Does that sum converge?`],
      steps: [
        R`Take $a_n=\frac1n$. Then $a_n\to0$.`,
        R`But $\sum\frac1n$ is the harmonic series, a $p$-series with $p=1$, which diverges. So the statement is False.`,
      ],
      recall: R`$a_n\to0$ does not prove convergence. $a_n\not\to0$ proves divergence.`,
    },
    {
      id: 'lp-final-03', unit: APP, topic: AL, stage: 'warmup', diff: 2, arch: 'arclen-setup',
      prompt: R`Set up, but do not evaluate, an integral for the length of the curve $y=x^{2}$ from $x=0$ to $x=1$.`,
      choices: [
        { t: R`$\displaystyle\int_0^{1}\sqrt{1+4x^{2}}\,dx$`, ok: true },
        { t: R`$\displaystyle\int_0^{1}\sqrt{1+x^{4}}\,dx$`, why: R`You squared $y=x^{2}$ instead of the derivative. The formula uses $(y')^{2}=(2x)^{2}=4x^{2}$.`, err: 'formula-confusion' },
        { t: R`$\displaystyle\int_0^{1}\big(1+4x^{2}\big)\,dx$`, why: R`The square root is missing. Arc length comes from Pythagoras, so it needs $\sqrt{1+(y')^{2}}$.`, err: 'setup' },
        { t: R`$\displaystyle\int_0^{1}\sqrt{1+2x}\,dx$`, why: R`You used $y'=2x$ but forgot to square it. The formula has $(y')^{2}$, which is $4x^{2}$.`, err: 'algebra-slip' },
      ],
      hints: [R`Arc length is $\int\sqrt{1+(y')^{2}}\,dx$.`, R`$y'=2x$. Square it.`],
      steps: [
        R`Differentiate: $y'=2x$.`,
        R`Square it: $(y')^{2}=4x^{2}$.`,
        R`Plug into $L=\int_a^b\sqrt{1+(y')^{2}}\,dx$ with $a=0$, $b=1$. Stop: the question says do not evaluate.`,
      ],
      recall: R`Arc length: $\int\sqrt{1+(y')^{2}}\,dx$, derivative squared, inside a root.`,
    },
    {
      id: 'lp-final-04', unit: TECH, topic: S, stage: 'core', diff: 3, arch: 'int-improper-partial',
      prompt: R`Evaluate $\displaystyle\int_1^{\infty}\frac{dx}{x^{2}+x}$.`,
      choices: [
        { t: R`$\ln 2$`, ok: true },
        { t: R`$-\ln 2$`, why: R`You subtracted in the wrong order. The antiderivative is $\ln\frac{x}{x+1}$, which is $0$ at infinity, minus $\ln\frac12$ at $1$. So $0-\ln\frac12=\ln 2$.`, err: 'sign' },
        { t: R`Diverges`, why: R`You treated it like $\frac1x$ and called it a $p$-series with $p=1$. But $\frac{1}{x^{2}+x}$ behaves like $\frac{1}{x^{2}}$ for large $x$, so it converges.`, err: 'concept' },
        { t: R`$0$`, why: R`You evaluated at infinity and forgot to subtract the value at the lower limit $x=1$, which is $\ln\frac12$.`, err: 'endpoint' },
      ],
      hints: [R`Factor the bottom as $x(x+1)$ and split into partial fractions.`, R`$\frac{1}{x(x+1)}=\frac1x-\frac1{x+1}$. Write the limit with a letter $b$.`, R`Antiderivative: $\ln\frac{x}{x+1}$. At $\infty$ it is $\ln1=0$.`],
      steps: [
        R`Partial fractions: $\frac{1}{x(x+1)}=\frac1x-\frac{1}{x+1}$.`,
        R`Replace $\infty$ by $b$: $\int_1^{b}=\left[\ln x-\ln(x+1)\right]_1^{b}=\ln\frac{b}{b+1}-\ln\frac12$.`,
        R`Take $b\to\infty$: $\frac{b}{b+1}\to1$, so $\ln1=0$. Result: $0-\ln\frac12=\ln2$.`,
      ],
      recall: R`Improper: letter in place of $\infty$, integrate, then limit. Rational: partial fractions.`,
    },
    {
      id: 'lp-final-05', unit: SER, topic: CT, stage: 'core', diff: 3, arch: 'ser-wrong-tool',
      prompt: R`For which of these series would the Ratio Test be the WRONG tool, because it gives $L=1$ and tells you nothing?`,
      choices: [
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{1}{n^{2}+1}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{n!}{3^{n}}$`, why: R`The ratio is $\frac{n+1}{3}\to\infty$, so $L=\infty>1$ and the Ratio Test decides it (diverges). It is a good tool here.`, err: 'concept' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{2^{n}}{n!}$`, why: R`The ratio is $\frac{2}{n+1}\to0$, so $L=0<1$ and the series converges. The Ratio Test works well here.`, err: 'concept' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{n^{2}}{e^{n}}$`, why: R`The ratio is $\frac{(n+1)^{2}}{e\,n^{2}}\to\frac1e<1$, so it converges. The exponential makes the Ratio Test a good fit.`, err: 'concept' },
      ],
      hints: [R`Ratio Test is built for factorials and exponentials, not plain powers of $n$.`, R`For $\frac{1}{n^{2}+1}$, what is $\frac{n^{2}+1}{(n+1)^{2}+1}$ as $n\to\infty$?`],
      steps: [
        R`For $\frac{1}{n^{2}+1}$ the ratio $\frac{n^{2}+1}{(n+1)^{2}+1}\to1$. So $L=1$: inconclusive.`,
        R`The other three give $L=\infty$, $0$ and $\frac1e$, all decisive.`,
        R`For the first series use Limit Comparison with $\sum\frac1{n^{2}}$ ($p=2$), which converges.`,
      ],
      recall: R`Ratio Test for factorials and exponentials. Polynomial-looking terms give $L=1$: use comparison.`,
    },
    {
      id: 'lp-final-06', unit: SER, topic: PS, stage: 'core', diff: 3, arch: 'ps-radius-interpret', fmt: 'multi',
      prompt: R`A power series $\sum c_n(x-3)^{n}$ has radius of convergence $R=2$. Select ALL statements that must be true.`,
      choices: [
        { t: R`The series converges at $x=4$`, ok: true, why: R`$|4-3|=1<2$, which is inside the radius. So it converges there.` },
        { t: R`The series diverges at $x=6$`, ok: true, why: R`$|6-3|=3>2$, outside the radius. Outside $(1,5)$ the series always diverges.` },
        { t: R`The series converges at $x=5$`, why: R`$x=5$ is an endpoint ($3+2$). The radius alone does not decide an endpoint; it has to be tested separately.`, err: 'endpoint' },
        { t: R`The series diverges at $x=1$`, why: R`$x=1$ is an endpoint ($3-2$). It might converge or diverge, depending on the coefficients. The radius cannot say.`, err: 'endpoint' },
        { t: R`The series converges at $x=-2$`, why: R`$|-2-3|=5>2$, which is far outside the radius, so the series diverges there. It cannot converge.`, err: 'concept' },
      ],
      hints: [R`Measure each $x$ from the centre $3$ and compare to $R=2$.`, R`Inside $(1,5)$: converges. Outside: diverges. Exactly $1$ or $5$: unknown.`],
      steps: [
        R`The centre is $3$ and $R=2$, so the open interval is $(1,5)$.`,
        R`$x=4$ is inside, so it converges. $x=6$ and $x=-2$ are outside, so they diverge.`,
        R`$x=1$ and $x=5$ are the endpoints. Their behaviour is unknown without more information, so those statements are not "must be true".`,
      ],
      recall: R`Inside radius: converges. Outside: diverges. Endpoints: always test separately.`,
    },
    {
      id: 'lp-final-07', unit: SER, topic: TM, stage: 'core', diff: 3, arch: 'tay-find-error', fmt: 'error',
      prompt: R`A student finds the Maclaurin series of $f(x)=x\cos\left(x^{2}\right)$. Which line has the mistake?`,
      work: [
        R`$\cos u=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}u^{2n}}{(2n)!}$.`,
        R`Put $u=x^{2}$: $\cos\left(x^{2}\right)=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{4n}}{(2n)!}$.`,
        R`Multiply by $x$: $x\cos\left(x^{2}\right)=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{4n+2}}{(2n)!}$.`,
        R`So the first terms are $x^{2}-\dfrac{x^{6}}{2}+\cdots$.`,
      ],
      choices: [
        { t: 'Line 1', why: R`Line 1 is the correct cosine series with $u$ in place of $x$. Nothing is wrong there.`, err: 'formula-confusion' },
        { t: 'Line 2', why: R`Line 2 is correct: $(x^{2})^{2n}=x^{4n}$. The substitution is done properly.`, err: 'algebra-slip' },
        { t: 'Line 3', ok: true },
        { t: 'Line 4', why: R`Line 4 is consistent with Line 3, so any mistake is earlier. The error is in how the extra $x$ was multiplied in.`, err: 'index' },
        { t: 'No error', why: R`There is an error. Multiplying $x^{4n}$ by $x$ gives $x^{4n+1}$, not $x^{4n+2}$. The first term should be $x$, not $x^{2}$.`, err: 'concept' },
      ],
      hints: [R`Check the first term: what is $x\cdot\cos(x^{2})$ at $x$ near $0$?`, R`Multiplying $x^{4n}$ by $x$ adds how much to the exponent?`],
      steps: [
        R`Lines 1 and 2 are right: substituting $u=x^{2}$ turns $u^{2n}$ into $x^{4n}$.`,
        R`Multiplying by $x$ adds $1$ to the exponent: $x\cdot x^{4n}=x^{4n+1}$. Line 3 added $2$.`,
        R`Correct series: $\sum\frac{(-1)^{n}x^{4n+1}}{(2n)!}=x-\frac{x^{5}}{2}+\frac{x^{9}}{24}-\cdots$.`,
      ],
      recall: R`Multiplying a series by $x^{k}$ adds $k$ to every exponent. Check the first term.`,
    },
    {
      id: 'lp-final-08', unit: SER, topic: TM, stage: 'core', diff: 4, arch: 'tay-derivative-from-coeff', fmt: 'free',
      prompt: R`Let $f(x)=x^{2}e^{3x}$. Use its Maclaurin series to find $f^{(5)}(0)$, the fifth derivative at $0$.`,
      choices: [
        { t: R`$540$`, ok: true },
        { t: R`$\dfrac{9}{2}$`, why: R`That is the coefficient of $x^{5}$. You forgot to multiply by $5!$, since $f^{(5)}(0)=5!\times$ coefficient.`, err: 'factorial' },
        { t: R`$243$`, why: R`That is what you get for $e^{3x}$ alone ($3^{5}$). You forgot that the $x^{2}$ shifts the series, so you need the $x^{3}$ term of $e^{3x}$.`, err: 'index' },
        { t: R`$135$`, why: R`You used $4!$ in the series for $e^{3x}$. The term is $\frac{(3x)^{3}}{3!}$, with $3!=6$, not $4!$.`, err: 'factorial' },
      ],
      hints: [R`Write $e^{3x}=\sum\frac{(3x)^{n}}{n!}$ and multiply by $x^{2}$.`, R`The $x^{5}$ term of $x^{2}e^{3x}$ comes from the $x^{3}$ term of $e^{3x}$.`, R`That coefficient is $\frac{27}{6}$.`],
      steps: [
        R`$e^{3x}=1+3x+\frac{9x^{2}}{2}+\frac{27x^{3}}{6}+\cdots$, so $x^{2}e^{3x}=x^{2}+3x^{3}+\frac{9x^{4}}{2}+\frac{27x^{5}}{6}+\cdots$.`,
        R`The coefficient of $x^{5}$ is $\frac{27}{6}=\frac92$.`,
        R`Since coefficient $=\frac{f^{(5)}(0)}{5!}$, we get $f^{(5)}(0)=120\cdot\frac92=540$.`,
      ],
      recall: R`$f^{(n)}(0)=n!\times$ (coefficient of $x^{n}$). Never differentiate five times by hand.`,
    },
    {
      id: 'lp-final-09', unit: POL, topic: PC, stage: 'core', diff: 3, arch: 'param-horizontal-tangent', fmt: 'free',
      prompt: R`A curve is given by $x=t^{2}$, $y=t^{3}-3t$. For $t>0$, at what value of $t$ is the tangent line horizontal?`,
      choices: [
        { t: R`$1$`, ok: true },
        { t: R`$0$`, why: R`$t=0$ makes $\frac{dx}{dt}=2t=0$, which gives a vertical tangent, not a horizontal one. Horizontal needs $\frac{dy}{dt}=0$.`, err: 'concept' },
        { t: R`$\sqrt3$`, why: R`$t=\sqrt3$ makes $y=0$ (the curve crosses the $x$-axis). That says nothing about the slope. Set $\frac{dy}{dt}=0$ instead.`, err: 'setup' },
        { t: R`$-1$`, why: R`$t=-1$ also solves $\frac{dy}{dt}=0$, but the problem says $t>0$, so it is not allowed.`, err: 'sign' },
      ],
      hints: [R`Horizontal tangent means slope $\frac{dy/dt}{dx/dt}=0$.`, R`Set the top, $\frac{dy}{dt}=3t^{2}-3$, equal to $0$.`],
      steps: [
        R`$\frac{dx}{dt}=2t$ and $\frac{dy}{dt}=3t^{2}-3$.`,
        R`Slope is $\frac{3t^{2}-3}{2t}$. It is $0$ when the top is $0$ and the bottom is not.`,
        R`$3t^{2}-3=0$ gives $t=\pm1$. With $t>0$, $t=1$, where $\frac{dx}{dt}=2\ne0$.`,
      ],
      recall: R`Horizontal: $\frac{dy}{dt}=0$. Vertical: $\frac{dx}{dt}=0$. Check the other one is not also zero.`,
    },
    {
      id: 'lp-final-10', unit: POL, topic: PA, stage: 'core', diff: 3, arch: 'polar-area-cardioid', fmt: 'free',
      prompt: R`Find the area enclosed by the cardioid $r=1+\cos\theta$.`,
      choices: [
        { t: R`$\dfrac{3\pi}{2}$`, ok: true },
        { t: R`$3\pi$`, why: R`You forgot the $\frac12$ in $A=\frac12\int r^{2}d\theta$. The integral alone is $3\pi$; half of it is $\frac{3\pi}{2}$.`, err: 'formula-confusion' },
        { t: R`$\pi$`, why: R`You integrated $r$ instead of $r^{2}$. Area uses $\frac12\int r^{2}d\theta$, so $(1+\cos\theta)$ must be squared first.`, err: 'formula-confusion' },
        { t: R`$\dfrac{3\pi}{4}$`, why: R`You used only $0\le\theta\le\pi$, which is half the curve. The cardioid is traced once as $\theta$ runs $0$ to $2\pi$.`, err: 'endpoint' },
      ],
      hints: [R`Area: $\frac12\int r^{2}\,d\theta$ over $0$ to $2\pi$.`, R`Expand $(1+\cos\theta)^{2}=1+2\cos\theta+\cos^{2}\theta$ and use $\cos^{2}\theta=\frac{1+\cos2\theta}{2}$.`],
      steps: [
        R`$A=\frac12\int_0^{2\pi}(1+\cos\theta)^{2}d\theta=\frac12\int_0^{2\pi}\left(1+2\cos\theta+\cos^{2}\theta\right)d\theta$.`,
        R`Replace $\cos^{2}\theta=\frac{1+\cos2\theta}{2}$, so the integrand is $\frac32+2\cos\theta+\frac12\cos2\theta$.`,
        R`Integrate over $[0,2\pi]$: the cosine terms give $0$, leaving $\frac32\cdot2\pi=3\pi$. Multiply by $\frac12$: $A=\frac{3\pi}{2}$.`,
      ],
      recall: R`Polar area $=\frac12\int r^{2}d\theta$, over the angles that trace the curve once.`,
    },
    {
      id: 'lp-final-11', unit: SER, topic: CT, stage: 'exam', diff: 4, arch: 'ser-abs-cond',
      prompt: R`Determine whether $\displaystyle\sum_{n=1}^{\infty}(-1)^{n}\frac{\sqrt n}{n+1}$ converges absolutely, converges conditionally, or diverges. Fully justify.`,
      choices: [
        { t: R`Conditionally convergent: $\frac{\sqrt n}{n+1}$ decreases to $0$ (Alternating Series Test), but $\sum\frac{\sqrt n}{n+1}$ diverges by Limit Comparison with $\sum\frac{1}{\sqrt n}$`, ok: true },
        { t: R`Absolutely convergent, because the terms alternate and go to $0$`, why: R`That only shows the alternating series converges. Absolute convergence needs $\sum|a_n|$ to converge, and here it behaves like $\sum\frac{1}{\sqrt n}$, which diverges.`, err: 'concept' },
        { t: R`Divergent, because $\sum\frac{\sqrt n}{n+1}$ diverges`, why: R`Divergence of $\sum|a_n|$ does not make $\sum a_n$ diverge. The alternating series passes the Alternating Series Test, so it converges (conditionally).`, err: 'concept' },
        { t: R`Divergent, because the Ratio Test gives $L=1$`, why: R`$L=1$ means the Ratio Test is inconclusive, not divergent. The Ratio Test is also a poor fit for these rational-looking terms.`, err: 'concept' },
      ],
      hints: [R`First test $\sum|a_n|=\sum\frac{\sqrt n}{n+1}$. Compare with $\frac{1}{\sqrt n}$.`, R`If that diverges, try the Alternating Series Test on $a_n$ itself.`, R`$\frac{\sqrt n}{n+1}\to0$ and decreases for $n\ge1$.`],
      steps: [
        R`Absolute values: $\sum\frac{\sqrt n}{n+1}$. Limit Comparison with $\sum\frac{1}{\sqrt n}$: $\lim\frac{\sqrt n/(n+1)}{1/\sqrt n}=\lim\frac{n}{n+1}=1$, a finite positive number.`,
        R`$\sum\frac{1}{\sqrt n}$ is a $p$-series with $p=\frac12\le1$, so it diverges. So $\sum|a_n|$ diverges: not absolutely convergent.`,
        R`Alternating Series Test on $b_n=\frac{\sqrt n}{n+1}$: $b_n\to0$, and $b_n$ is decreasing for $n\ge1$ (its derivative has the sign of $1-n$).`,
        R`The alternating series converges but not absolutely, so it is **conditionally convergent**.`,
      ],
      recall: R`Test $\sum|a_n|$ first. If it diverges but the alternating series passes AST: conditional.`,
    },
    {
      id: 'lp-final-12', unit: SER, topic: PS, stage: 'exam', diff: 4, arch: 'ps-interval-both-in', fmt: 'free', accept: ['[-6,2]'],
      prompt: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x+2)^{n}}{n^{2}\,4^{n}}$.`,
      choices: [
        { t: R`$[-6,2]$`, ok: true },
        { t: R`$(-6,2)$`, why: R`You skipped the endpoints. At both $x=-6$ and $x=2$ the series is a $p=2$ series (in absolute value), which converges. So both are included.`, err: 'endpoint' },
        { t: R`$[-6,2)$`, why: R`At $x=2$ the series is $\sum\frac{1}{n^{2}}$, a convergent $p$-series with $p=2$, so $2$ is included. You left it out.`, err: 'endpoint' },
        { t: R`$(-4,4)$`, why: R`You found $R=4$ but centred the interval at $0$. The centre is $-2$ (from $x+2$), so the interval is $-2\pm4$.`, err: 'setup' },
      ],
      hints: [R`Ratio Test on the whole term. What is $\left|\frac{a_{n+1}}{a_n}\right|$?`, R`You should get $\frac{|x+2|}{4}$ as $n\to\infty$. So $R=4$, centre $-2$.`, R`Test $x=2$ and $x=-6$ separately.`],
      steps: [
        R`Ratio: $\left|\frac{a_{n+1}}{a_n}\right|=\frac{|x+2|}{4}\cdot\frac{n^{2}}{(n+1)^{2}}\to\frac{|x+2|}{4}$.`,
        R`Need $\frac{|x+2|}{4}<1$, so $|x+2|<4$ and $-6<x<2$. Centre $-2$, $R=4$.`,
        R`At $x=2$: $\sum\frac{4^{n}}{n^{2}4^{n}}=\sum\frac1{n^{2}}$, converges ($p=2$).`,
        R`At $x=-6$: $\sum\frac{(-1)^{n}}{n^{2}}$. Its absolute value is $\sum\frac1{n^{2}}$, which converges, so it converges. Both endpoints are in: $[-6,2]$.`,
      ],
      recall: R`Radius from the Ratio Test, then test both endpoints. They can both be in, both out, or split.`,
    },
    {
      id: 'lp-final-13', unit: TECH, topic: S, stage: 'exam', diff: 5, arch: 'int-trig-sub-definite', fmt: 'free',
      prompt: R`Compute the integral (show all work, completely simplify): $\displaystyle\int_0^{3/2}\frac{dx}{\left(9-x^{2}\right)^{3/2}}$.`,
      choices: [
        { t: R`$\dfrac{\sqrt3}{27}$`, ok: true },
        { t: R`$\dfrac{\sqrt3}{81}$`, why: R`You lost the factor from $dx=3\cos\theta\,d\theta$, so the integrand became $\frac{1}{27}\sec^{2}\theta$ instead of $\frac19\sec^{2}\theta$.`, err: 'algebra-slip' },
        { t: R`$\dfrac{\sqrt3}{3}$`, why: R`You wrote $(9-x^{2})^{3/2}=3\cos^{3}\theta$ and forgot to cube the $3$. It is $27\cos^{3}\theta$, so the constant is $\frac19$, not $1$.`, err: 'algebra-slip' },
        { t: R`$\dfrac{\sqrt3}{9}$`, why: R`You used $\theta=\frac\pi3$ (solving $\cos\theta=\frac12$). The substitution is $x=3\sin\theta$, so $\sin\theta=\frac12$ and $\theta=\frac\pi6$.`, err: 'setup' },
      ],
      hints: [R`$9-x^{2}$ suggests $x=3\sin\theta$. What are $dx$ and $9-x^{2}$?`, R`$9-x^{2}=9\cos^{2}\theta$, so $(9-x^{2})^{3/2}=27\cos^{3}\theta$.`, R`The integrand becomes $\frac19\sec^{2}\theta$. Limits: $\theta=0$ to $\frac\pi6$.`],
      steps: [
        R`Let $x=3\sin\theta$, so $dx=3\cos\theta\,d\theta$ and $9-x^{2}=9\cos^{2}\theta$. Then $(9-x^{2})^{3/2}=27\cos^{3}\theta$ (for $\cos\theta\ge0$).`,
        R`Limits: $x=0\Rightarrow\theta=0$. $x=\frac32\Rightarrow\sin\theta=\frac12\Rightarrow\theta=\frac\pi6$.`,
        R`Integrand: $\frac{3\cos\theta}{27\cos^{3}\theta}=\frac19\sec^{2}\theta$. So the integral is $\frac19\int_0^{\pi/6}\sec^{2}\theta\,d\theta=\frac19\tan\theta\Big|_0^{\pi/6}$.`,
        R`Evaluate: $\tan\frac\pi6=\frac{1}{\sqrt3}$. Result: $\frac{1}{9\sqrt3}=\frac{\sqrt3}{27}$ after rationalizing.`,
      ],
      recall: R`$\sqrt{a^{2}-x^{2}}$: use $x=a\sin\theta$, change the limits, and cube the $a$ when the power is $\frac32$.`,
    },
  ],
};
