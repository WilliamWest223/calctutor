// Demo items, one per new format. Test-only: never registered in the bank.
export const FIXTURES = [
  { id: 'fx-free', fmt: 'free', arch: 'fx-free', unit: 'series', topic: 'Power Series & Radius', diff: 2,
    prompt: 'Find $\\int 2x\\,dx$.', accept: ['x squared plus c'],
    choices: [{ t: '$x^2+C$', ok: true }, { t: '$2x^2+C$', why: 'Power rule divides by the new exponent.' }, { t: '$x+C$', why: 'You differentiated instead.' }, { t: '$2+C$', why: 'Wrong operation.' }],
    steps: ['$\\int 2x\\,dx=x^2+C$'], recall: 'Power rule.' },
  { id: 'fx-multi', fmt: 'multi', arch: 'fx-multi', unit: 'series', topic: 'Sequences', diff: 2,
    prompt: 'Which series converge? Select all.',
    choices: [{ t: '$\\sum 1/n^2$', ok: true, why: 'p=2>1.' }, { t: '$\\sum 1/n$', why: 'Harmonic diverges.' }, { t: '$\\sum (1/2)^n$', ok: true, why: 'Geometric, r=1/2.' }, { t: '$\\sum n$', why: 'Terms do not go to 0.' }],
    steps: ['p-series and geometric tests.'], recall: 'p>1 converges.' },
  { id: 'fx-error', fmt: 'error', arch: 'fx-error', unit: 'series', topic: 'Sequences', diff: 2,
    prompt: 'Find the error in the work.',
    work: ['$\\int x e^x dx = x e^x - \\int e^x dx$', '$= x e^x - e^x$', '$= x e^x - e^x$ (no constant)'],
    choices: [{ t: 'Line 1', why: 'Parts is applied correctly.' }, { t: 'Line 2', why: 'Integral of e^x is e^x.' }, { t: 'Line 3', ok: true, why: 'Missing +C.' }, { t: 'No error', why: 'The +C is missing.' }],
    steps: ['Indefinite integrals need +C.'], recall: 'Always +C.' },
];
