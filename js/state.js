import { PACKAGES } from './data.js';

const DRAFT_KEY = 'pay_to_par_setup_draft_v2';
const ROUND_KEY = 'pay_to_par_configured_round_v2';

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

export function saveConfiguredRound(draft) {
  const round = {
    id: uid(),
    name: draft.roundName.trim() || todayName(),
    createdAt: new Date().toISOString(),
    options: { ...draft.options },
    players: draft.players
      .filter((player) => player.name.trim())
      .map((player) => ({
        ...player,
        name: player.name.trim(),
        startingInventory: { ...player.inventory },
        remainingInventory: { ...player.inventory }
      })),
    status: 'configured'
  };
  localStorage.setItem(ROUND_KEY, JSON.stringify(round));
  return round;
}

export function getConfiguredRound() {
  try { return JSON.parse(localStorage.getItem(ROUND_KEY)); }
  catch { return null; }
}
