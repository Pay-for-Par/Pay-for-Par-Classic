import { PACKAGES } from './data.js';

const DRAFT_KEY = 'pay_to_par_setup_draft_v3';
const ROUND_KEY = 'pay_to_par_active_round_v3';
const HISTORY_KEY = 'pay_to_par_history_v3';

function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function todayName() {
  return `Round — ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

export function cloneInventory(packageId = 'weekend') {
  return { ...PACKAGES[packageId].inventory };
}

export function makePlayer(name = '', packageId = 'weekend') {
  return {
    id: uid(),
    name,
    packageId,
    inventory: cloneInventory(packageId),
    modified: false
  };
}

export function freshDraft() {
  return {
    step: 1,
    roundName: todayName(),
    players: [makePlayer(), makePlayer(), makePlayer(), makePlayer()],
    options: { nark: true, wheel: false, history: true },
    editingPlayerId: null
  };
}

export function loadDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    return saved?.players?.length ? saved : freshDraft();
  } catch {
    return freshDraft();
  }
}

export function saveDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function makeHole() {
  return { score: null, usedCheats: [] };
}

export function saveConfiguredRound(draft) {
  const round = {
    id: uid(),
    name: draft.roundName.trim() || todayName(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: { ...draft.options },
    players: draft.players
      .filter((player) => player.name.trim())
      .map((player) => ({
        ...player,
        name: player.name.trim(),
        startingInventory: { ...player.inventory },
        remainingInventory: { ...player.inventory },
        holes: Array.from({ length: 18 }, makeHole)
      })),
    currentHole: 1,
    status: 'active',
    actionLog: [],
    narkCases: [],
    punishments: []
  };
  localStorage.setItem(ROUND_KEY, JSON.stringify(round));
  return round;
}

export function getActiveRound() {
  try {
    const round = JSON.parse(localStorage.getItem(ROUND_KEY));
    return round?.status === 'active' ? round : null;
  } catch {
    return null;
  }
}

export function saveActiveRound(round) {
  round.updatedAt = new Date().toISOString();
  localStorage.setItem(ROUND_KEY, JSON.stringify(round));
}

export function clearActiveRound() {
  localStorage.removeItem(ROUND_KEY);
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCompletedRound(round) {
  if (!round.options.history) return;
  const history = getHistory();
  history.unshift(round);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function completeActiveRound(round) {
  const completed = { ...round, status: 'completed', finishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  saveCompletedRound(completed);
  localStorage.removeItem(ROUND_KEY);
  localStorage.setItem('pay_to_par_last_result_v1', JSON.stringify(completed));
  return completed;
}
export function getLastResult() {
  try { return JSON.parse(localStorage.getItem('pay_to_par_last_result_v1')); }
  catch { return null; }
}
export function abandonActiveRound() { localStorage.removeItem(ROUND_KEY); }
