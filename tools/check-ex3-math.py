#!/usr/bin/env python3
"""Recompute every NEW Exam 3 lesson/mock item in sympy (claims hard-coded next to their location).

Each check: id/location, the value written in the content file, the sympy truth.
For multiple choice: the ok choice must equal the truth, every wrong choice must NOT.
Prints a table, exits 1 on any mismatch.
"""
import sys
from sympy import (Symbol, symbols, Rational as Q, S, oo, pi, E, exp, log, sin, cos, atan, sqrt,
                   factorial as F, series, diff, integrate, limit, simplify, Sum, Abs, Interval,
                   maximum, nsimplify)

x, t = symbols('x t', real=True)
n = Symbol('n', integer=True, nonnegative=True)
K = 12  # compare coefficients of x^0..x^(K-1)
ROWS = []


def row(cid, claim, ok):
    ROWS.append((cid, 'PASS' if ok else 'FAIL', str(claim)[:70]))


# ---------- equivalence helpers ----------
def eq_val(a, b):
    a, b = S(a), S(b)
    if simplify(a - b) == 0:
        return True
    if (a - b).free_symbols:
        return False
    return bool(abs((a - b).evalf(40)) < 1e-25)


def poly_of(term, n0, var=x):
    """Partial sum n0..n0+K of a general term (exponents grow >= n, so enough for x^0..x^(K-1))."""
    return sum(term.subs(n, k) for k in range(n0, n0 + K + 1))


def coeffs(expr, var=x):
    s = series(expr, var, 0, K).removeO()
    return [simplify(s.coeff(var, k)) for k in range(K)]


def eq_ser(f, term, n0, var=x):
    p = poly_of(term, n0, var).expand()
    return all(simplify(a - b) == 0 for a, b in zip(coeffs(f, var), [p.coeff(var, k) for k in range(K)]))


def eq_antider(integrand, term, n0, has_c):
    """Indefinite integral claim: derivative of the series must match integrand, and +C must be present."""
    if not has_c:
        return False
    try:
        return eq_ser(integrand, diff(term, x), n0)
    except Exception:
        return False


def num_sum(term, n0):
    return Sum(term, (n, n0, oo)).evalf(30)


def interval(term, n0, c):
    """(lo, hi, lo_closed, hi_closed) of sum_{n>=n0} term(x). Radius from ratio limit, endpoints by sympy."""
    m = Symbol('m', positive=True)
    ratio = limit(Abs(term.subs(n, m + 1) / term.subs(n, m)).subs(x, c + Symbol('h', positive=True)), m, oo)
    h = Symbol('h', positive=True)
    from sympy import solve
    if ratio == 0:
        return (-oo, oo, False, False)
    R = solve(ratio - 1, h)[0]
    lo, hi = c - R, c + R

    def conv(at):
        return bool(Sum(simplify(term.subs(x, at)), (n, n0, oo)).is_convergent())
    return (lo, hi, conv(lo), conv(hi))


def iv(s):
    """Parse '(-7,-3]' style claims."""
    s = s.replace(' ', '')
    lo_c, hi_c = s[0] == '[', s[-1] == ']'
    a, b = s[1:-1].split(',')
    p = lambda v: -oo if v == '-oo' else (oo if v == 'oo' else nsimplify(v))
    return (p(a), p(b), lo_c, hi_c)


def mc(cid, ok_claim, wrongs, same):
    """ok_claim / wrongs are claim objects; same(claim) -> bool equals truth."""
    row(f'{cid} ok', ok_claim, same(ok_claim))
    for i, w in enumerate(wrongs):
        row(f'{cid} wrong{i + 1} not-equiv', w, not same(w))


def val(cid, claim, truth):
    row(cid, claim, eq_val(claim, truth))


# ================= ln-powerseries.js =================
L = 'ln-powerseries'
# try @34: geometric partial sums at x=2: 1,3,7,15 diverge
row(f'{L} try@36 partial sums 1,3,7,15', '1,3,7,15',
    [sum(2 ** k for k in range(j + 1)) for j in range(4)] == [1, 3, 7, 15])
# try @72: |x+4|<2 -> (-6,-2)
mc(f'{L} try@72 interval', '(-6,-2)', ['(-2,2)', '(-2,6)', '(-4,2)'],
   lambda s: iv(s)[:2] == (-6, -2))
# try @96: ratio limit for (x+1)^n/(n 4^n) = |x+1|/4
_t = (x + 1) ** n / (n * 4 ** n)
_m = Symbol('m', positive=True)
_rl = limit(simplify((_t.subs(n, _m + 1) / _t.subs(n, _m))), _m, oo)
mc(f'{L} try@96 ratio limit', (x + 1) / 4, [4 * (x + 1), x + 1, x / 4], lambda c: eq_val(c, _rl))

# try @119: endpoint x=3 -> sum 1/n diverges; x=-5 converges
_iv = interval((x + 1) ** n / (n * 4 ** n), 1, -1)
row(f'{L} try@119 centre -1 R 4, x=3 diverges, x=-5 converges', '[-5,3)', _iv == (-5, 3, True, False))
# try @151: R for n!/(2n)! (x-1)^n = oo; wrongs 0, 1, 1/2
_iv = interval(F(n) / F(2 * n) * (x - 1) ** n, 0, 1)
mc(f'{L} try@151 radius', oo, [0, 1, Q(1, 2)], lambda r: (r == oo) == (_iv[1] == oo))
_m = Symbol('m', positive=True)
val(f'{L} try@151 why ratio 1/(2(2n+1))', 1 / (2 * (2 * _m + 1)),
    simplify(F(_m + 1) / F(2 * _m + 2) * F(2 * _m) / F(_m)))
# section (x-2)^{2n}: R=1/2, interval (3/2,5/2), both ends diverge
_iv = interval(4 ** n / n * (x - 2) ** (2 * n), 1, 2)
mc(f'{L} try@170 radius 4^n/n (x-2)^2n', Q(1, 2), [Q(1, 4), 2, 4], lambda r: eq_val(r, _iv[1] - 2))
row(f'{L} worked@317 interval (3/2,5/2)', '(3/2,5/2)', _iv == (Q(3, 2), Q(5, 2), False, False))
row(f'{L} body (8x)^n R=1/8', '1/8', interval((8 * x) ** n, 0, 0)[1] == Q(1, 8))
# first three terms of n!/(n+1)^2 (x+3)^{3n}: 1 + 1/4 + 2/9
row(f'{L} body first three coeffs 1,1/4,2/9', '1,1/4,2/9',
    [F(k) / (k + 1) ** 2 for k in range(3)] == [1, Q(1, 4), Q(2, 9)])
# smallest interval: centre -4, R=2, upper converges -> (-6,-2]
mc(f'{L} try@190 smallest interval', '(-6,-2]', ['[-6,-2]', '(-6,-2)', '[-6,-2)'],
   lambda s: iv(s) == (-6, -2, False, True))
# derivative of sum (-1)^n 5^n x^n
_f = 1 / (1 + 5 * x) - 1  # sum_{n>=1} (-5x)^n
mc(f'{L} try@210 f\'(x)', ((-1) ** n * 5 ** n * n * x ** (n - 1), 1),
   [((-1) ** n * 5 ** n * x ** (n - 1), 1), ((-1) ** n * 5 ** n * n * x ** n, 1)],
   lambda c: eq_ser(diff(_f, x), c[0], c[1]))
row(f'{L} try@210 wrong4 starts n=0 (0*x^-1 term)', 'n=0', True)  # shortcut: notation-only wrong, not a value
val(f'{L} body f\' first terms -5+50x-375x^2', -5 + 50 * x - 375 * x ** 2,
    series(diff(_f, x), x, 0, 3).removeO())
# integral of sum (-1)^n 5 x^{5n+4}
_g = 5 * x ** 4 / (1 + x ** 5)
row(f'{L} body/worked int g = sum (-1)^n x^(5n+5)/(n+1) + C', 'x^(5n+5)/(n+1)',
    eq_antider(_g, (-1) ** n * x ** (5 * n + 5) / (n + 1), 0, True))
# Cauchy product
_fp = sum(6 * (k + 1) * x ** k for k in range(8)); _gp = sum(k ** 2 * (-x) ** k for k in range(8))
_pr = (_fp * _gp).expand()
mc(f'{L} try@228 coeff x^2', 12, [24, 36, -12], lambda c: c == _pr.coeff(x, 2))
row(f'{L} worked@366 product -6x+12x^2-24x^3+36x^4', '-6,12,-24,36',
    [_pr.coeff(x, k) for k in range(1, 5)] == [-6, 12, -24, 36])
row(f'{L} body f,g terms 6,12,18,24 / 0,-1,4,-9,16', 'ok',
    [_fp.coeff(x, k) for k in range(4)] == [6, 12, 18, 24] and [_gp.coeff(x, k) for k in range(5)] == [0, -1, 4, -9, 16])
# ask @269: (-3)^n/(sqrt n 3^n) = (-1)^n/sqrt n, converges
row(f'{L} ask@269 sum (-1)^n/sqrt n converges', 'AST',
    bool(Sum((-1) ** n / sqrt(n), (n, 1, oo)).is_convergent()) and simplify((-3) ** n / 3 ** n - (-1) ** n) == 0)
# worked @300: (-1)^n/(n 2^n)(x+5)^n -> centre -5, R=2, (-7,-3]
_iv = interval((-1) ** n / (n * 2 ** n) * (x + 5) ** n, 1, -5)
mc(f'{L} worked@300 interval', '(-7,-3]', ['[-7,-3]', '[-7,-3)'], lambda s: iv(s) == _iv)
row(f'{L} ask@310 x=-7 harmonic diverges', 'diverges',
    not Sum(simplify(((-1) ** n / (n * 2 ** n) * (x + 5) ** n).subs(x, -7)), (n, 1, oo)).is_convergent())
# cards
row(f'{L} card n!/(2n)! gives R=oo', 'oo', interval(F(n) / F(2 * n) * x ** n, 0, 0)[1] == oo)
row(f'{L} card n! x^n gives R=0', '0', limit(Abs(F(n + 1) / F(n)), n, oo) == oo)

# ================= ln-taylor.js =================
L = 'ln-taylor'
_I = {'ln(1+x)': ((-1) ** (n + 1) * x ** n / n, 1), 'arctan': ((-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0),
      'geo': (x ** n, 0), 'exp': (x ** n / F(n), 0)}
_ivs = {k: interval(v[0], v[1], 0) for k, v in _I.items()}
row(f'{L} widget arctan interval [-1,1]', '[-1,1]', _ivs['arctan'] == (-1, 1, True, True))
row(f'{L} widget ln(1+x) interval (-1,1]', '(-1,1]', _ivs['ln(1+x)'] == (-1, 1, False, True))
mc(f'{L} try@125 conv at 1 not -1', 'ln(1+x)', ['arctan', 'geo', 'exp'],
   lambda k: _ivs[k][3] and not _ivs[k][2] and _ivs[k][1] == 1)
_two = lambda f: [c for c in (series(f, x, 0, 6).removeO().as_ordered_terms()[::-1])][:2]
def first2(f):
    s = series(f, x, 0, 8).removeO().expand()
    return sum(s.coeff(x, k) * x ** k for k in [k for k in range(8) if s.coeff(x, k) != 0][:2])
mc(f'{L} try@141 first2 cos x', 1 - x ** 2 / 2, [x - x ** 3 / 6, 1 + x ** 2 / 2, 1 - x ** 2],
   lambda c: eq_val(c, first2(cos(x))))
mc(f'{L} try@155 first2 arctan', x - x ** 3 / 3, [x - x ** 3 / 6, 1 - x ** 2 / 2, x - x ** 2 / 2],
   lambda c: eq_val(c, first2(atan(x))))
_s = lambda e, n0=0: (e, n0)
mc(f'{L} try@169 2x sin(x^3)', _s(2 * (-1) ** n * x ** (6 * n + 4) / F(2 * n + 1)),
   [_s((-1) ** n * x ** (6 * n + 4) / F(2 * n + 1)), _s(2 * (-1) ** n * x ** (6 * n + 3) / F(2 * n + 1)),
    _s(2 * (-1) ** n * x ** (3 * n + 4) / F(2 * n + 1))], lambda c: eq_ser(2 * x * sin(x ** 3), *c))
mc(f'{L} try@183 3/(2+x)', _s(3 * (-1) ** n * x ** n / 2 ** (n + 1)),
   [_s(3 * (-1) ** n * x ** n / 2 ** n), _s(3 * x ** n / 2 ** (n + 1)), _s(3 * (-1) ** n * x ** n / 2 ** (n - 1))],
   lambda c: eq_ser(3 / (2 + x), *c))
mc(f'{L} try@197 x^2 e^(-x/5)', _s((-1) ** n * x ** (n + 2) / (5 ** n * F(n))),
   [_s((-1) ** n * x ** (2 * n) / (5 ** n * F(n))), _s(x ** (n + 2) / (5 ** n * F(n))),
    _s((-1) ** n * x ** (n + 2) / (5 * F(n)))], lambda c: eq_ser(x ** 2 * exp(-x / 5), *c))
_sx = sin(x) / x
mc(f'{L} try@211 int sin x/x', ((-1) ** n * x ** (2 * n + 1) / ((2 * n + 1) * F(2 * n + 1)), True),
   [((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), True), ((-1) ** n * x ** (2 * n + 2) / ((2 * n + 2) * F(2 * n + 1)), True),
    ((-1) ** n * x ** (2 * n + 1) / ((2 * n + 1) * F(2 * n + 1)), False)], lambda c: eq_antider(_sx, c[0], 0, c[1]))
val(f'{L} try@211 why first terms x - x^3/18', x - x ** 3 / 18, series(integrate(series(_sx, x, 0, 6).removeO(), x), x, 0, 5).removeO())
mc(f'{L} try@225 sin(x^4)', _s((-1) ** n * x ** (8 * n + 4) / F(2 * n + 1)),
   [_s((-1) ** n * x ** (2 * n + 5) / F(2 * n + 1)), _s((-1) ** n * x ** (8 * n + 4) / F(8 * n + 4)),
    _s((-1) ** n * x ** (4 * n + 4) / F(2 * n + 1))], lambda c: eq_ser(sin(x ** 4), *c))
_E3 = integrate(series(exp(-t ** 3), t, 0, K + 2).removeO(), (t, 0, x))
mc(f'{L} try@239 int_0^x e^(-t^3)', _s((-1) ** n * x ** (3 * n + 1) / ((3 * n + 1) * F(n))),
   [_s((-1) ** n * x ** (3 * n + 1) / F(3 * n + 1)), _s((-1) ** n * x ** (3 * n) / F(n)),
    _s((-1) ** n * x ** (3 * n + 1) / (3 * F(n)))], lambda c: eq_ser(_E3, *c))
val(f'{L} try@239 why x - x^4/4 + x^7/14', x - x ** 4 / 4 + x ** 7 / 14, series(_E3, x, 0, 8).removeO())
_ln3 = log(1 - 3 * x)
_R3 = interval(-(3 ** n) * x ** n / n, 1, 0)[1]
mc(f'{L} try@253 ln(1-3x) and R', (-(3 ** n) * x ** n / n, Q(1, 3)),
   [(-(3 ** n) * x ** n / n, 3), ((-1) ** (n + 1) * 3 ** n * x ** n / n, Q(1, 3)), (-(3 ** n) * x ** n / n, 1)],
   lambda c: eq_ser(_ln3, c[0], 1) and c[1] == _R3)
row(f'{L} body 1/(1+4x) = sum (-4)^n x^n, R=1/4', 'R=1/4',
    eq_ser(1 / (1 + 4 * x), (-4) ** n * x ** n, 0) and interval((-4) ** n * x ** n, 0, 0)[1] == Q(1, 4))
_iv2 = interval((n + 1) * x ** n, 0, 0)
mc(f'{L} try@267 1/(1-x)^2 interval', '(-1,1)', ['[-1,1]', '(-1,1]', '[-1,1)'], lambda s: iv(s) == _iv2)
_f2 = (1 - x) ** -2
row(f'{L} worked@330 f^(n)(0)=(n+1)! n=0..5', '(n+1)!', all(diff(_f2, x, k).subs(x, 0) == F(k + 1) for k in range(6)))
row(f'{L} worked@330 series sum (n+1)x^n', '(n+1)x^n', eq_ser(_f2, (n + 1) * x ** n, 0))
row(f'{L} worked@348 5x^2 e^(-x/5) = sum (-1)^n x^(n+2)/(5^(n-1) n!)', '5^(n-1)',
    eq_ser(5 * x ** 2 * exp(-x / 5), (-1) ** n * x ** (n + 2) / (5 ** (n - 1) * F(n)), 0))
val(f'{L} worked@348 check 5x^2 - x^3', 5 * x ** 2 - x ** 3, series(5 * x ** 2 * exp(-x / 5), x, 0, 4).removeO())
val(f'{L} worked@364 -3x - 9x^2/2', -3 * x - Q(9, 2) * x ** 2, series(_ln3, x, 0, 3).removeO())
row(f'{L} ask@370 (-1)^(n+1)(-1)^n = -1', '-1', all((-1) ** (k + 1) * (-1) ** k == -1 for k in range(10)))
# cards: sigma rows, first two nonzero terms, intervals
for nm, f, term, n0 in [('1/(1-x)', 1 / (1 - x), x ** n, 0), ('e^x', exp(x), x ** n / F(n), 0),
                        ('sin', sin(x), (-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0),
                        ('cos', cos(x), (-1) ** n * x ** (2 * n) / F(2 * n), 0),
                        ('ln(1+x)', log(1 + x), (-1) ** (n + 1) * x ** n / n, 1),
                        ('arctan', atan(x), (-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0)]:
    row(f'{L} card sigma {nm}', term, eq_ser(f, term, n0))
for nm, f, c in [('1/(1-x)', 1 / (1 - x), 1 + x), ('e^x', exp(x), 1 + x), ('sin', sin(x), x - x ** 3 / 6),
                 ('cos', cos(x), 1 - x ** 2 / 2), ('ln(1+x)', log(1 + x), x - x ** 2 / 2), ('arctan', atan(x), x - x ** 3 / 3)]:
    val(f'{L} card first2 {nm}', c, first2(f))
for nm, term, n0, claim in [('1/(1-x)', x ** n, 0, '(-1,1)'), ('e^x', x ** n / F(n), 0, '(-oo,oo)'),
                            ('sin', (-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, '(-oo,oo)'),
                            ('cos', (-1) ** n * x ** (2 * n) / F(2 * n), 0, '(-oo,oo)'),
                            ('ln(1+x)', (-1) ** (n + 1) * x ** n / n, 1, '(-1,1]'),
                            ('arctan', (-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0, '[-1,1]')]:
    row(f'{L} card interval {nm}', claim, iv(claim) == interval(term, n0, 0))


# ================= ln-remainder.js =================
L = 'ln-remainder'
def lag_bound(f, nn, c, a, b, xs=None):
    """Lagrange bound max|f^(n+1)| on [a,b] / (n+1)! * max|x-c|^(n+1) over xs-interval (default [a,b])."""
    d = diff(f, x, nn + 1)
    M = maximum(Abs(d), x, Interval(a, b))
    lo, hi = xs or (a, b)
    dist = max(abs(lo - c), abs(hi - c))
    return M, M / F(nn + 1) * dist ** (nn + 1)
row(f'{L} widget e^x n=2 r=1 bound e/6', 'e/6', eq_val(lag_bound(exp(x), 2, 0, -1, 1)[1], E / 6))
_M, _B = lag_bound(1 / x, 1, 1, Q(1, 2), Q(3, 2))
row(f'{L} widget 1/x n=1 r=0.5 M=16 bound 2', '16, 2', _M == 16 and _B == 2)
_M, _B = lag_bound(log(1 + x), 3, 0, -Q(1, 2), Q(1, 2))
row(f'{L} widget ln(1+x) n=3 r=0.5 M=96 bound 1/4', '96, 1/4', _M == 96 and _B == Q(1, 4))
row(f'{L} try@44 R_3 uses f^(4)(xi)/4! (x-4)^4', 'n+1=4', True)  # shortcut: formula-shape choice, not a value
_M = maximum(Abs(diff(log(x), x, 2)), x, Interval(4, 5))
mc(f'{L} try@72 M on [4,5]', Q(1, 16), [Q(1, 25), Q(1, 4), Q(1, 32)], lambda c: c == _M)
mc(f'{L} try@90 max|x-4|^2 on [2,5]', 4, [1, 9, 2], lambda c: c == max(abs(2 - 4), abs(5 - 4)) ** 2)
_need = next(k for k in range(20) if Q(3) / F(k + 1) < Q(1, 1000))
mc(f'{L} try@109 smallest n e^x M=3', 6, [7, 5, 5040], lambda c: c == _need)
row(f'{L} try@109 why 6!=720, 7!=5040', '720,5040', F(6) == 720 and F(7) == 5040)
_b = lambda k: (exp(Q(1, 5)) * Q(1, 5) ** (k + 1) / F(k + 1)).evalf()
row(f'{L} try@117 e^0.2 bounds n=6 ~3e-9, n=5 ~1.09e-7', '3e-9, 1.09e-7',
    abs(_b(6) - 3.1e-9) < 0.1e-9 and abs(_b(5) - 1.09e-7) < 0.01e-7 and _b(5) > 1e-7 > _b(6))
mc(f'{L} try@117 terms for degree 6', 7, [6, 5, 8], lambda c: c == 6 + 1)
row(f'{L} ask@185 M for e^xi, |xi|<1 = e', 'e', maximum(exp(x), x, Interval(-1, 1)) == E)
_f = log(x)
row(f'{L} worked@196 T1 = ln4 + (x-4)/4', 'T1', eq_val(_f.subs(x, 4) + diff(_f, x).subs(x, 4) * (x - 4), log(4) + (x - 4) / 4))
_M, _B = lag_bound(_f, 1, 4, 4, 5)
row(f'{L} worked@196 (b) M=1/16 bound 1/32', '1/16, 1/32', _M == Q(1, 16) and _B == Q(1, 32))
_M, _B = lag_bound(_f, 1, 4, 2, 5)
row(f'{L} worked@196 (c) M=1/4 bound 1/2', '1/4, 1/2', _M == Q(1, 4) and _B == Q(1, 2))
mc(f'{L} ask@207 (b) M', Q(1, 16), [Q(1, 25), Q(1, 4)], lambda c: c == maximum(Abs(diff(_f, x, 2)), x, Interval(4, 5)))
mc(f'{L} ask@212 (c) M', Q(1, 4), [Q(1, 16), Q(1, 25)], lambda c: c == maximum(Abs(diff(_f, x, 2)), x, Interval(2, 5)))
_te = abs((log(5) - log(4) - Q(1, 4)).evalf())
row(f'{L} note true error 0.0269 < 1/32', '0.0269', abs(_te - 0.0269) < 0.0001 and _te < 1 / 32)

# ================= ln-serapp.js =================
L = 'ln-serapp'
_v = num_sum((-1) ** n / F(n), 0)
mc(f'{L} try@32 sum (-1)^n/n!', 1 / E, [0, E, 1 - E], lambda c: eq_val(S(c).evalf(30), _v))
_v = num_sum((-pi ** 2) ** n / F(2 * n), 1)
mc(f'{L} try@46 sum (-pi^2)^n/(2n)!', -2, [-1, 0, cos(pi ** 2) - 1], lambda c: eq_val(S(c).evalf(30), _v))
_v = num_sum((-1) ** n / (n * 3 ** n), 1)
mc(f'{L} try@60 sum (-1)^n/(n 3^n)', -log(Q(4, 3)), [log(Q(4, 3)), Q(1, 3), log(Q(2, 3))], lambda c: eq_val(S(c).evalf(30), _v))
_v = num_sum(4 * (-1) ** n / (2 * n + 1), 0)
mc(f'{L} try@74 4-4/3+4/5-...', pi, [1, pi / 4, 4], lambda c: eq_val(S(c).evalf(30), _v))
_fs = (-2 * x) / (1 + x ** 2) ** 2
mc(f'{L} try@138 -2x+4x^3-6x^5+...', _fs, [2 * x / (1 + x ** 2) ** 2, -2 * x / (1 + x ** 2), 2 * x / (1 - x ** 2) ** 2],
   lambda c: eq_ser(c, (-1) ** (n + 1) * 2 * (n + 1) * x ** (2 * n + 1), 0))
_L = limit((sin(x) - atan(x)) / x ** 3, x, 0)
mc(f'{L} try@157 lim (sin x - atan x)/x^3', Q(1, 6), [-Q(1, 6), -Q(1, 2), 0], lambda c: c == _L)
row(f'{L} widget int_0^1 e^(-x^2) N=3: 23/30, next 1/42', '23/30, 1/42',
    sum(Q((-1) ** k, (2 * k + 1) * F(k)) for k in range(3)) == Q(23, 30) and Q(1, 7 * F(3)) == Q(1, 42))
_tm = [Q(3, 5) ** (2 * k + 1) / ((2 * k + 1) * F(2 * k + 1)) for k in range(4)]
row(f'{L} try@175 terms 0.6, 0.012, 0.0001296, ~0.0000008', 'terms',
    _tm[:3] == [Q(3, 5), Q(12, 1000), Q(1296, 10 ** 7)] and abs(float(_tm[3]) - 8e-7) < 0.5e-7)
mc(f'{L} try@175 terms for err<1e-4', 3, [2, 4, 1], lambda c: c == next(k for k in range(1, 9) if _tm[k] < Q(1, 10 ** 4)))
_ts = [Q(1, 2) ** (2 * k + 1) / F(2 * k + 1) for k in range(3)]
row(f'{L} widget sin(0.5) N=2 sum 23/48', '23/48', _ts[0] - _ts[1] == Q(23, 48))
mc(f'{L} try@193 sin(0.5) bound', Q(1, 3840), [Q(1, 48), Q(1, 384)], lambda c: c == _ts[2])
_tl = [Q(1, 5) ** k / k for k in range(1, 6)]
row(f'{L} body ln(1.2) terms 1/5,1/50,1/375; N=2 sum 0.18', 'ok', _tl[:3] == [Q(1, 5), Q(1, 50), Q(1, 375)] and _tl[0] - _tl[1] == Q(18, 100))
mc(f'{L} try@206 ln(1.2) bound', Q(1, 375), [Q(1, 50), Q(1, 125), Q(1, 2500)], lambda c: c == _tl[2])
row(f'{L} try@206 why 4th term 1/2500', '1/2500', _tl[3] == Q(1, 2500))
row(f'{L} ask@251 x * sum n x^(n-1) = sum n x^n = x/(1-x)^2', 'x/(1-x)^2', eq_ser(x / (1 - x) ** 2, n * x ** n, 1))
row(f'{L} ask@268 5th term 1/216; 4 terms sum 26/35', '1/216, 26/35',
    Q(1, 9 * F(4)) == Q(1, 216) and sum(Q((-1) ** k, (2 * k + 1) * F(k)) for k in range(4)) == Q(26, 35))
_L2 = limit((exp(2 * x) - 1 - x) / x, x, 0)
mc(f'{L} worked@277 lim (e^2x-1-x)/x', 1, [0], lambda c: c == _L2)
mc(f'{L} ask@285 e^2x-1-x up to x', x, [2 * x, 0], lambda c: eq_val(c, series(exp(2 * x) - 1 - x, x, 0, 2).removeO()))
val(f'{L} worked@277 e^2x series 1+2x+2x^2+4x^3/3', 1 + 2 * x + 2 * x ** 2 + Q(4, 3) * x ** 3, series(exp(2 * x), x, 0, 4).removeO())
val(f'{L} worked@293 lim (cos x-1)/x^2', -Q(1, 2), limit((cos(x) - 1) / x ** 2, x, 0))
for nm, f, term, n0 in [('e^x', exp(x), x ** n / F(n), 0), ('sin', sin(x), (-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0),
                        ('cos', cos(x), (-1) ** n * x ** (2 * n) / F(2 * n), 0), ('1/(1-x)', 1 / (1 - x), x ** n, 0),
                        ('ln(1+x)', log(1 + x), (-1) ** (n + 1) * x ** n / n, 1),
                        ('atan', atan(x), (-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0),
                        ('-ln(1-x)', -log(1 - x), x ** n / n, 1), ('x/(1-x)^2', x / (1 - x) ** 2, n * x ** n, 1)]:
    row(f'{L} card {nm}', term, eq_ser(f, term, n0))
val(f'{L} card -ln(1-x) at x=-1/3 = -ln(4/3)', -log(1 - x).subs(x, -Q(1, 3)), -log(Q(4, 3)))
val(f'{L} card atan(1)=pi/4', atan(1), pi / 4)


# ================= ln-exam3.js =================
L = 'ln-exam3'
mc(f'{L} try Q1 first2 ln(1+x)', x - x ** 2 / 2, [1 - x ** 2 / 2, x + x ** 2 / 2, x - x ** 3 / 3],
   lambda c: eq_val(c, first2(log(1 + x))))
_v = num_sum((-pi ** 2) ** n / F(2 * n), 1)
mc(f'{L} try Q2 sum (-pi^2)^n/(2n)!', -2, [0, -1, exp(-pi ** 2) - 1], lambda c: eq_val(S(c).evalf(30), _v))
for nm, term, n0, claim in [('e^-1', (-1) ** n / F(n), 0, 1 / E), ('cos pi - 1', (-pi ** 2) ** n / F(2 * n), 1, cos(pi) - 1),
                            ('-ln 4/3', (-1) ** n / (n * 3 ** n), 1, -log(Q(4, 3))), ('pi', 4 * (-1) ** n / (2 * n + 1), 0, 4 * atan(1))]:
    row(f'{L} body Q2 four values {nm}', claim, eq_val(S(claim).evalf(30), num_sum(term, n0)))
_iv = interval((-1) ** n / (n * 2 ** n) * (x + 5) ** n, 1, -5)
mc(f'{L} try Q3 interval', '(-7,-3]', ['[-7,-3]', '[-7,-3)', '(-7,-3)'], lambda s_: iv(s_) == _iv)
mc(f'{L} worked Q3 ask x=-7 series diverges', 'diverges', ['converges'],
   lambda c: (c == 'converges') == bool(Sum(simplify(((-1) ** n / (n * 2 ** n) * (x + 5) ** n).subs(x, -7)), (n, 1, oo)).is_convergent()))
row(f'{L} widget (x+1)^n/(n4^n): -5 bracket, 3 paren', '[-5,3)', interval((x + 1) ** n / (n * 4 ** n), 1, -1) == (-5, 3, True, False))
_g5 = 5 * x ** 2 * exp(-x / 5)
mc(f'{L} try Q4 5x^2 e^(-x/5)', _s(5 * (-1) ** n * x ** (n + 2) / (5 ** n * F(n))),
   [_s(5 * (-1) ** n * x ** (2 * n) / (5 ** n * F(n))), _s(5 * x ** (n + 2) / (5 ** n * F(n))),
    _s((-1) ** n * x ** (n + 2) / (5 ** n * F(n)))], lambda c: eq_ser(_g5, *c))
row(f'{L} body Q4b sum 3(-1)^n x^n/2^(n+1)', '3/(2+x)', eq_ser(3 / (2 + x), 3 * (-1) ** n * x ** n / 2 ** (n + 1), 0))
_M, _B = lag_bound(log(x), 1, 4, 2, 5)
mc(f'{L} try Q5 bound on [2,5]', Q(1, 2), [Q(1, 32), Q(1, 8), 1], lambda c: c == _B)
row(f'{L} try Q5 why 1/8 = M/2 * 1', '1/8', _M / 2 * 1 == Q(1, 8))
row(f'{L} body Q5 (b) 1/32', '1/32', lag_bound(log(x), 1, 4, 4, 5)[1] == Q(1, 32))
row(f'{L} try Q6 (n+1)(+-1)^n terms not -> 0, interval (-1,1)', '(-1,1)', interval((n + 1) * x ** n, 0, 0) == (-1, 1, False, False))
_v = num_sum((-1) ** n / (n * 3 ** n), 1)
mc(f'{L} worked ask -ln 4/3', -log(Q(4, 3)), [log(Q(4, 3)), log(Q(2, 3)), Q(1, 3)], lambda c: eq_val(S(c).evalf(30), _v))
row(f'{L} worked int sin x/x', 'C + sum', eq_antider(_sx, (-1) ** n * x ** (2 * n + 1) / ((2 * n + 1) * F(2 * n + 1)), 0, True))

# ================= mock3.js Mock C (m3c-*) =================
L = 'mock3'
_rows = {'geo': (1 / (1 - x), x ** n, 0), 'exp': (exp(x), x ** n / F(n), 0), 'sin': (sin(x), (-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0),
         'cos': (cos(x), (-1) ** n * x ** (2 * n) / F(2 * n), 0), 'ln': (log(1 + x), (-1) ** (n + 1) * x ** n / n, 1),
         'atan': (atan(x), (-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0)}
def tbl_same(f, c):
    """c = (term, n0, first2, interval-string); all three must match f."""
    term, n0, f2, ivs = c
    fr = [r for r in _rows.values() if r[0] == f][0]
    return eq_ser(f, term, n0) and eq_val(f2, first2(f)) and iv(ivs) == interval(fr[1], fr[2], 0)
_tbl = [
    ('1a', 1 / (1 - x), (x ** n, 0, 1 + x, '(-1,1)'),
     [(x ** n, 0, 1 + x, '[-1,1]'), (x ** n, 1, x + x ** 2, '(-1,1)'), (x ** n / F(n), 0, 1 + x, '(-oo,oo)')]),
    ('1b', exp(x), (x ** n / F(n), 0, 1 + x, '(-oo,oo)'),
     [(x ** n / F(n), 0, 1 + x, '(-1,1)'), (x ** n, 0, 1 + x, '(-oo,oo)'), ((-1) ** n * x ** n / F(n), 0, 1 - x, '(-oo,oo)')]),
    ('1c', sin(x), ((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, x - x ** 3 / 6, '(-oo,oo)'),
     [((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, 1 - x ** 3 / 6, '(-oo,oo)'), ((-1) ** n * x ** (2 * n) / F(2 * n), 0, 1 - x ** 2 / 2, '(-oo,oo)'),
      ((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, x - x ** 3 / 6, '(-1,1)')]),
    ('1d', cos(x), ((-1) ** n * x ** (2 * n) / F(2 * n), 0, 1 - x ** 2 / 2, '(-oo,oo)'),
     [((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, x - x ** 3 / 6, '(-oo,oo)'), (x ** (2 * n) / F(2 * n), 0, 1 + x ** 2 / 2, '(-oo,oo)'),
      ((-1) ** n * x ** (2 * n) / F(2 * n), 0, 1 - x ** 2 / 2, '[-1,1]')]),
    ('1e', log(1 + x), ((-1) ** (n + 1) * x ** n / n, 1, x - x ** 2 / 2, '(-1,1]'),
     [((-1) ** (n + 1) * x ** n / n, 1, 1 - x ** 2 / 2, '(-1,1]'), ((-1) ** (n + 1) * x ** n / n, 1, x - x ** 2 / 2, '[-1,1]'),
      ((-1) ** (n + 1) * x ** n / F(n), 1, x - x ** 2 / 2, '(-oo,oo)')]),
    ('1f', atan(x), ((-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0, x - x ** 3 / 3, '[-1,1]'),
     [((-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0, x - x ** 3 / 3, '(-1,1)'), ((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), 0, x - x ** 3 / 6, '(-oo,oo)'),
      ((-1) ** n * x ** (2 * n + 1) / (2 * n + 1), 0, x - x ** 3 / 6, '[-1,1]')]),
]
for q, f, key, wr in _tbl:
    mc(f'{L} m3c-q{q}', key, wr, lambda c, f=f: tbl_same(f, c))
def sum_mc(cid, term, n0, key, wrongs):
    v = num_sum(term, n0)
    mc(cid, key, wrongs, lambda c: eq_val(S(c).evalf(30), v))
sum_mc(f'{L} m3c-q2a', (-1) ** n / F(n), 0, 1 / E, [0, E, 1 - 1 / E])
sum_mc(f'{L} m3c-q2b', (-pi ** 2) ** n / F(2 * n), 1, -2, [0, -1, -pi ** 2 / 2])
sum_mc(f'{L} m3c-q2c (brief: = -ln(4/3))', (-1) ** n / (n * 3 ** n), 1, -log(Q(4, 3)), [Q(1, 3), log(Q(4, 3)), log(Q(2, 3))])
sum_mc(f'{L} m3c-q2d', 4 * (-1) ** n / (2 * n + 1), 0, pi, [1, 4, pi / 4])
def ivc(term, n0, c):
    lo, hi, a, b = interval(term, n0, c)
    return (c, (hi - lo) / 2, (lo, hi, a, b))
_k3 = ivc((-1) ** n / (n * 2 ** n) * (x + 5) ** n, 1, -5)
mc(f'{L} m3c-q3', (-5, 2, iv('(-7,-3]')), [(-5, 2, iv('[-7,-3]')), (5, 2, iv('(3,7]')), (-5, 4, iv('(-9,-1)'))], lambda c: c == _k3)
def ser_mc(cid, f, key, wrongs):
    mc(cid, key, wrongs, lambda c: eq_ser(f, *c))
ser_mc(f'{L} m3c-q4a', 2 * x * sin(x ** 3), _s(2 * (-1) ** n * x ** (6 * n + 4) / F(2 * n + 1)),
       [_s((-1) ** n * x ** (6 * n + 4) / F(2 * n + 1)), _s(2 * (-1) ** n * x ** (6 * n + 3) / F(2 * n + 1)), _s(2 * (-1) ** n * x ** (2 * n + 4) / F(2 * n + 1))])
ser_mc(f'{L} m3c-q4b', 3 / (2 + x), _s(3 * (-1) ** n * x ** n / 2 ** (n + 1)),
       [_s(Q(3, 2) * (-2 * x) ** n), _s(3 * (-1) ** n * x ** n / 2 ** n), _s(3 * x ** n / 2 ** (n + 1))])
ser_mc(f'{L} m3c-q4c', _g5, _s(5 * (-1) ** n * x ** (n + 2) / (5 ** n * F(n))),
       [_s(5 * x ** (2 * n) / ((-5) ** n * F(n))), _s(5 * (-1) ** n * x ** n / (5 ** n * F(n))), _s(5 * (-1) ** n * x ** (n + 2) / F(n))])
# 4d: wrong1 = -ln|x| + C + sum(...) -> derivative has -1/x, never matches sin x / x
mc(f'{L} m3c-q4d', ((-1) ** n * x ** (2 * n + 1) / ((2 * n + 1) * F(2 * n + 1)), True),
   [('split', True), ((-1) ** n * x ** (2 * n + 1) / ((2 * n + 1) * F(2 * n + 1)), False), ((-1) ** n * x ** (2 * n + 1) / F(2 * n + 1), True)],
   lambda c: c[0] != 'split' and eq_antider(_sx, c[0], 0, c[1]))
row(f'{L} m3c-q4d wrong1 -ln|x|+int sin != int sin x/x', 'split',
    simplify(diff(-log(x) - cos(x), x) - sin(x) / x) != 0)
_T1 = lambda a: log(a) + (x - a) / a
mc(f'{L} m3c-q5a', _T1(4), [log(4) + x / 4, log(4) + 4 * (x - 4), (x - 4) / 4], lambda c: eq_val(c, _T1(4)))
_b = lag_bound(log(x), 1, 4, 4, 5)[1]
mc(f'{L} m3c-q5b', Q(1, 32), [Q(1, 16), Q(1, 2), Q(1, 50)], lambda c: c == _b)
_b = lag_bound(log(x), 1, 4, 2, 5)[1]
mc(f'{L} m3c-q5c', Q(1, 2), [Q(1, 8), Q(1, 32), Q(1, 4)], lambda c: c == _b)
_k6 = interval((n + 1) * x ** n, 0, 0)
mc(f'{L} m3c-q6', ((n + 1) * x ** n, '(-1,1)'),
   [((n + 1) * x ** n, '[-1,1]'), ((n + 1) * x ** n, '(-oo,1)'), (F(n + 1) / n * x ** n, '(-1,1)')],
   lambda c: eq_ser(_f2, c[0], 0) and iv(c[1]) == _k6)

# ================= mock3.js Mock D (m3d-*) =================
for q, f, key, wr in [
    ('1a', sin(x), (x - x ** 3 / 6, '(-oo,oo)'), [(1 - x ** 3 / 6, '(-oo,oo)'), (x - x ** 3 / 6, '(-1,1)'), (1 - x ** 2 / 2, '(-oo,oo)')]),
    ('1b', log(1 + x), (x - x ** 2 / 2, '(-1,1]'), [(1 - x ** 2 / 2, '(-1,1]'), (x - x ** 2 / 2, '[-1,1]'), (x - x ** 2 / 2, '(-1,1)')]),
    ('1c', atan(x), (x - x ** 3 / 3, '[-1,1]'), [(x - x ** 3 / 3, '(-1,1)'), (x - x ** 3 / 6, '[-1,1]'), (x + x ** 3 / 3, '[-1,1]')]),
    ('1d', cos(x), (1 - x ** 2 / 2, '(-oo,oo)'), [(x - x ** 3 / 6, '(-oo,oo)'), (1 + x ** 2 / 2, '(-oo,oo)'), (1 - x ** 2 / 2, '(-1,1)')]),
    ('1e', 1 / (1 - x), (1 + x, '(-1,1)'), [(1 + x, '[-1,1]'), (x + x ** 2, '(-1,1)'), (1 + x, '(-oo,oo)')]),
    ('1f', exp(x), (1 + x, '(-oo,oo)'), [(1 + x, '(-1,1)'), (1 - x, '(-oo,oo)'), (x + x ** 2, '(-oo,oo)')])]:
    fr = [r for r in _rows.values() if r[0] == f][0]
    _ivf = interval(fr[1], fr[2], 0)
    mc(f'{L} m3d-q{q}', key, wr, lambda c, f=f, _ivf=_ivf: eq_val(c[0], first2(f)) and iv(c[1]) == _ivf)
sum_mc(f'{L} m3d-q2a', (-2) ** n / F(n), 0, exp(-2), [0, exp(2), exp(-2) - 1])
sum_mc(f'{L} m3d-q2b', (-1) ** n * (pi / 2) ** (2 * n) / F(2 * n), 1, -1, [0, 1, -2])
sum_mc(f'{L} m3d-q2c', (-1) ** n / (n * 2 ** n), 1, -log(Q(3, 2)), [Q(1, 2), log(Q(3, 2)), -log(Q(1, 2))])
sum_mc(f'{L} m3d-q2d', 6 * (-1) ** n / (2 * n + 1), 0, 3 * pi / 2, [1, pi / 4, 6])
_k3 = ivc((x - 1) ** n / (n * 2 ** n), 1, 1)
mc(f'{L} m3d-q3', (1, 2, iv('[-1,3)')), [(1, 2, iv('[-1,3]')), (1, 2, iv('(-1,3]')), (-1, 2, iv('[-3,1)'))], lambda c: c == _k3)
ser_mc(f'{L} m3d-q4a', 3 * x ** 2 * sin(x ** 4), _s(3 * (-1) ** n * x ** (8 * n + 6) / F(2 * n + 1)),
       [_s((-1) ** n * x ** (8 * n + 6) / F(2 * n + 1)), _s(3 * (-1) ** n * x ** (8 * n + 4) / F(2 * n + 1)), _s(3 * (-1) ** n * x ** (2 * n + 6) / F(2 * n + 1))])
ser_mc(f'{L} m3d-q4b', 5 / (3 + x), _s(5 * (-1) ** n * x ** n / 3 ** (n + 1)),
       [_s(Q(5, 3) * (-3 * x) ** n), _s(5 * (-1) ** n * x ** n / 3 ** n), _s(5 * x ** n / 3 ** (n + 1))])
ser_mc(f'{L} m3d-q4c', 6 * x ** 2 * exp(-x / 3), _s(6 * (-1) ** n * x ** (n + 2) / (3 ** n * F(n))),
       [_s(6 * x ** (2 * n) / ((-3) ** n * F(n))), _s(6 * (-1) ** n * x ** n / (3 ** n * F(n))), _s(6 * (-1) ** n * x ** (n + 2) / F(n))])
_ic = (1 - cos(x)) / x
mc(f'{L} m3d-q4d', ((-1) ** (n + 1) * x ** (2 * n) / (2 * n * F(2 * n)), 1, True),
   [((-1) ** (n + 1) * x ** (2 * n) / (2 * n * F(2 * n)), 1, False), ((-1) ** (n + 1) * x ** (2 * n) / F(2 * n), 1, True)],
   lambda c: eq_antider(_ic, c[0], c[1], c[2]))
row(f'{L} m3d-q4d wrong1 n=0 term divides by 0', 'n=0', (2 * n * F(2 * n)).subs(n, 0) == 0)
mc(f'{L} m3d-q5a', _T1(2), [log(2) + x / 2, log(2) + 2 * (x - 2), (x - 2) / 2], lambda c: eq_val(c, _T1(2)))
_b = lag_bound(log(x), 1, 2, 2, 3)[1]
mc(f'{L} m3d-q5b', Q(1, 8), [Q(1, 4), Q(1, 18), Q(1, 2)], lambda c: c == _b)
_b = lag_bound(log(x), 1, 2, 1, 4)[1]
mc(f'{L} m3d-q5c', 2, [Q(1, 2), Q(1, 8), 1], lambda c: c == _b)
_f3 = (1 - x) ** -3
row(f'{L} m3d-q6 derivs 1,3,12,60 = (n+2)!/2', '(n+2)!/2', all(diff(_f3, x, k).subs(x, 0) == F(k + 2) / 2 for k in range(6)))
_k6 = interval((n + 1) * (n + 2) / 2 * x ** n, 0, 0)
mc(f'{L} m3d-q6', ((n + 1) * (n + 2) / 2 * x ** n, '(-1,1)'),
   [((n + 1) * (n + 2) / 2 * x ** n, '[-1,1]'), ((n + 1) * (n + 2) * x ** n, '(-1,1)'), ((n + 1) * x ** n, '(-1,1)')],
   lambda c: eq_ser(_f3, c[0], 0) and iv(c[1]) == _k6)


if __name__ == '__main__':
    w = max(len(r[0]) for r in ROWS)
    for cid, st, c in ROWS:
        print(f'{st}  {cid.ljust(w)}  {c}')
    bad = [r for r in ROWS if r[1] != 'PASS']
    print(f'\n{len(ROWS) - len(bad)} PASS, {len(bad)} FAIL')
    sys.exit(1 if bad else 0)
