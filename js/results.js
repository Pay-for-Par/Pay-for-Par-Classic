import { getLastResult } from './state.js';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const total = p => p.holes.reduce((sum,h) => sum + (h.score ?? 0), 0);
const played = p => p.holes.filter(h => h.score !== null).length;
const cheatUses = p => p.holes.reduce((sum,h) => sum + h.usedCheats.length, 0);
const convictions = (r,id) => (r.narkCases || []).filter(x => x.accusedId === id && x.verdict === 'guilty').length;

export function resultsView() {
  const round = getLastResult();
  if (!round) return `<section class="page"><p class="eyebrow">No completed round</p><h1 class="page-title">Nothing to brag about yet.</h1><p class="page-lead">Finish a round and the final scores will appear here.</p><button class="btn btn-primary btn-block" data-route="new-round">Start a round</button></section>`;
  const ranked = [...round.players].sort((a,b) => total(a)-total(b));
  const winner = ranked[0];
  return `<section class="page">
    <p class="eyebrow">The official unofficial result</p>
    <h1 class="page-title">${esc(round.name)}</h1>
    <p class="page-lead">Final scores, questionable decisions, and enough evidence to ruin several friendships.</p>
    <div class="winner-card"><span>🏆</span><small>Winner</small><h2>${esc(winner.name)}</h2><strong>${total(winner)}</strong></div>
    <div class="results-list">${ranked.map((p,i)=>`<article class="result-row panel"><div class="result-place">${i+1}</div><div class="result-person"><strong>${esc(p.name)}</strong><small>${played(p)} holes · ${cheatUses(p)} cheats used · ${convictions(round,p.id)} convictions</small></div><div class="result-total">${total(p)}</div></article>`).join('')}</div>
    <div class="results-actions"><button class="btn btn-primary btn-block" data-start-fresh-round>Start another round</button><button class="btn btn-outline btn-block" data-route="home">Back home</button></div>
  </section>`;
}
