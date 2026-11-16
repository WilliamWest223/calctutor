// tools/check-variety.mjs — 5 sessions x 20 Qs per series topic + Rapid Fire.
// Fails if a session repeats a gid/id, or an arch within 4, when alternatives exist.
import { build, scopeSkills } from '../js/session.js';
import { candidates, materialize, liveSkillsOf } from '../js/bank/index.js';

const S_COUNT = 5, N = 20;
let bad = 0;
const targets = liveSkillsOf('series').map(s => ({ mode: 'topic', scope: s, label: s })).concat([{ mode: 'rapid', scope: undefined, label: 'Rapid Fire' }]);

for (const t of targets) {
  const pool = t.mode === 'topic' ? candidates([t.scope]) : null;
  const nTemplates = (pool || candidates(scopeSkills('rapid'))).length;
  let archs = new Set(); const tArch = new Map();
  if (pool) for (const c of pool) for (let i = 1; i <= 15; i++) { const m = materialize(c.gid ? { gid: c.gid, seed: i * 7919 } : { id: c.id }); if (m && m.arch) { archs.add(m.arch); tArch.set(c.gid || c.id, (tArch.get(c.gid || c.id) || new Set()).add(m.arch)); } }
  let maxRep = 0, distinctSum = 0;
  for (let s = 0; s < S_COUNT; s++) {
    const S = build({ mode: t.mode, scope: t.scope, count: N });
    const seenKeys = new Map(), recentArch = [];
    S.queue.forEach((ref, i) => {
      const k = ref.gid || ref.id, m = materialize(ref);
      const c = (seenKeys.get(k) || 0) + 1; seenKeys.set(k, c); maxRep = Math.max(maxRep, c);
      if (c > 1 && seenKeys.size < nTemplates) { bad++; console.log(`  x ${t.label} session ${s}: repeat ${k} at Q${i + 1} with ${nTemplates - seenKeys.size} templates unseen`); }
      const a = m && m.arch;
      if (a) {
        if (recentArch.slice(-4).includes(a) && (pool ? [...tArch].some(([g, as]) => !seenKeys.has(g) && [...as].some(x => !recentArch.slice(-4).includes(x))) : true)) { bad++; console.log(`  x ${t.label} session ${s}: arch ${a} repeated within 4 at Q${i + 1}`); }
        recentArch.push(a);
      }
    });
    distinctSum += seenKeys.size / S.queue.length;
  }
  console.log(`${t.label.padEnd(44)} gid-ratio ${(distinctSum / S_COUNT).toFixed(2)}  max repeat ${maxRep}`);
}
console.log(bad ? `\nFAIL: ${bad} violations` : '\nOK');
process.exit(bad ? 1 : 0);
