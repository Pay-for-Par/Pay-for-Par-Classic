import { CHEATS, CHEAT_MAP, PACKAGES } from './data.js';
import { getActiveRound, saveActiveRound, completeActiveRound, abandonActiveRound } from './state.js';
import { remainingCheatCard, shareText } from './share.js';
import { narkOverlay, handleNarkClick, resetNark } from './nark.js';

let pendingCheat = null;
let detailPlayerId = null;
let narkOpen = false;
let roundMenuOpen = false;
let confirmAction = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function totalScore(player) {
  return player.holes.reduce((sum, hole) => sum + (hole.score ?? 0), 0);
}

function holesPlayed(player) {
  return player.holes.filter((hole) => hole.score !== null).length;
}

function holeComplete(round, index) {
  return round.players.every((player) => player.holes[index].score !== null);
}

function availableCheats(player, holeNumber) {
  return CHEATS.filter((cheat) => {
    const count = player.remainingInventory[cheat.id] ?? 0;
    if (count <= 0) return false;
    if (cheat.id === 'breakfast-ball' && holeNumber !== 1) return false;
    if (cheat.id === 'lunch-ball' && holeNumber !== 10) return false;
    return true;
  });
}

function roundHeader(round) {
  const complete = round.players.reduce((n, player) => n + holesPlayed(player), 0);
  const possible = round.players.length * 18;
  return `<div class="round-top panel">
    <div>
      <p class="eyebrow">Live round</p>
      <h1>${esc(round.name)}</h1>
      <p>${round.players.length} golfers · ${complete}/${possible} scores entered</p>
    </div>
    <button class="btn btn-outline compact-button" data-open-round-menu>Round Menu</button>
  </div>`;
}

function holeNav(round) {
  return `<div class="hole-controller">
    <button class="hole-arrow" data-hole-change="-1" ${round.currentHole === 1 ? 'disabled' : ''} aria-label="Previous hole">‹</button>
    <button class="hole-center" data-hole-picker>
      <small>HOLE</small><strong>${round.currentHole}</strong>
      <span>${holeComplete(round, round.currentHole - 1) ? 'Complete' : 'In play'}</span>
    </button>
    <button class="hole-arrow" data-hole-change="1" ${round.currentHole === 18 ? 'disabled' : ''} aria-label="Next hole">›</button>
  </div>
  <div class="hole-dots" aria-label="Hole navigation">
    ${Array.from({ length: 18 }, (_, index) => `<button
      class="hole-dot ${round.currentHole === index + 1 ? 'current' : ''} ${holeComplete(round, index) ? 'complete' : ''}"
      data-go-hole="${index + 1}" aria-label="Hole ${index + 1}">${index + 1}</button>`).join('')}
  </div>`;
}

function playerCard(round, player) {
  const hole = player.holes[round.currentHole - 1];
  const cheats = availableCheats(player, round.currentHole);
  return `<article class="live-player panel">
    <div class="live-player-head">
      <button class="player-detail-link" data-player-detail="${player.id}">
        <span><strong>${esc(player.name)}</strong><small>${PACKAGES[player.packageId].icon} ${PACKAGES[player.packageId].name}${player.modified ? ' +' : ''}</small></span>
        <span class="running-total">${totalScore(player)}<small>total</small></span>
      </button>
    </div>

    <div class="score-entry">
      <button class="score-step" data-score-change="-1" data-player-id="${player.id}" aria-label="Decrease ${esc(player.name)} score">−</button>
      <div class="score-number ${hole.score === null ? 'empty' : ''}">
        <strong>${hole.score ?? '—'}</strong><small>STROKES</small>
      </div>
      <button class="score-step" data-score-change="1" data-player-id="${player.id}" aria-label="Increase ${esc(player.name)} score">＋</button>
    </div>

    <div class="cheat-strip">
      ${cheats.length ? cheats.map((cheat) => `<button class="live-cheat" data-use-cheat="${cheat.id}" data-player-id="${player.id}">
        <span>${cheat.icon}</span><strong>${player.remainingInventory[cheat.id]}</strong><small>${cheat.name}</small>
      </button>`).join('') : `<div class="no-cheats">Pure skill—or luck—from here.</div>`}
    </div>

    ${hole.usedCheats.length ? `<div class="hole-uses">
      <span>Used this hole:</span>
      <div>${hole.usedCheats.map((item) => `<span class="used-chip">${CHEAT_MAP[item.cheatId].icon} ${CHEAT_MAP[item.cheatId].name}</span>`).join('')}</div>
      <button data-undo-cheat="${player.id}">Undo last</button>
    </div>` : ''}
  </article>`;
}

function confirmationMarkup(round) {
  if (!pendingCheat) return '';
  const player = round.players.find((item) => item.id === pendingCheat.playerId);
  const cheat = CHEAT_MAP[pendingCheat.cheatId];
  return `<div class="editor-overlay" role="dialog" aria-modal="true" aria-label="Confirm cheat use">
    <div class="editor-sheet confirm-sheet">
      <div class="sheet-handle"></div>
      <div class="confirm-icon">${cheat.icon}</div>
      <p class="eyebrow">Use a cheat</p>
      <h2>${esc(player.name)}: ${cheat.name}?</h2>
      <p>${cheat.summary}</p>
      <div class="confirm-count">${player.remainingInventory[cheat.id]} remaining before use</div>
      <div class="editor-actions">
        <button class="btn btn-outline" data-cancel-cheat>Not yet</button>
        <button class="btn btn-primary" data-confirm-cheat>Use it</button>
      </div>
    </div>
  </div>`;
}

function detailMarkup(round) {
  if (!detailPlayerId) return '';
  const player = round.players.find((item) => item.id === detailPlayerId);
  if (!player) return '';
  const used = CHEATS.map((cheat) => ({
    cheat,
    count: (player.startingInventory[cheat.id] ?? 0) - (player.remainingInventory[cheat.id] ?? 0)
  })).filter((item) => item.count > 0);

  const usageLog = [];
  player.holes.forEach((hole, index) => {
    hole.usedCheats.forEach((item) => usageLog.push({ ...item, hole: index + 1 }));
  });

  return `<div class="editor-overlay" role="dialog" aria-modal="true" aria-label="${esc(player.name)} details">
    <div class="editor-sheet player-sheet">
      <div class="sheet-handle"></div>
      <div class="editor-head">
        <div><p class="eyebrow">Player card</p><h2>${esc(player.name)}</h2><p>${totalScore(player)} strokes through ${holesPlayed(player)} holes</p></div>
        <button class="mini-icon-button" data-close-player-detail aria-label="Close">×</button>
      </div>

      <h3 class="sheet-section-title">Remaining cheats</h3>
      <div class="detail-inventory">
        ${CHEATS.map((cheat) => `<div><span>${cheat.icon} ${cheat.name}</span><strong>${player.remainingInventory[cheat.id] ?? 0}</strong></div>`).join('')}
      </div>

      <button class="btn btn-outline btn-block" data-share-remaining="${player.id}">Share Remaining Cheats</button><h3 class="sheet-section-title">Used today</h3>
      ${usageLog.length ? `<div class="usage-log">${usageLog.map((item) => `<div><span>Hole ${item.hole}</span><strong>${CHEAT_MAP[item.cheatId].icon} ${CHEAT_MAP[item.cheatId].name}</strong></div>`).join('')}</div>` : '<p class="empty-copy">Nothing used yet. Suspiciously respectable.</p>'}
    </div>
  </div>`;
}

function holePickerMarkup(round) {
  return `<div class="editor-overlay" role="dialog" aria-modal="true" aria-label="Choose a hole">
    <div class="editor-sheet hole-picker-sheet">
      <div class="editor-head">
        <div><p class="eyebrow">Jump to</p><h2>Choose a hole</h2></div>
        <button class="mini-icon-button" data-close-hole-picker aria-label="Close">×</button>
      </div>
      <div class="picker-grid">
        ${Array.from({ length: 18 }, (_, index) => `<button class="${round.currentHole === index + 1 ? 'current' : ''} ${holeComplete(round, index) ? 'complete' : ''}" data-pick-hole="${index + 1}"><strong>${index + 1}</strong><small>${holeComplete(round, index) ? 'Done' : 'Open'}</small></button>`).join('')}
      </div>
    </div>
  </div>`;
}


function roundMenuMarkup(round) {
  if (confirmAction === 'end') return `<div class="editor-overlay" role="dialog" aria-modal="true"><div class="editor-sheet confirm-sheet"><div class="sheet-handle"></div><div class="confirm-icon">🏁</div><p class="eyebrow">End round</p><h2>Make these scores official?</h2><p>Final scores, cheat use, Nark cases, and punishments will be preserved.</p><div class="editor-actions"><button class="btn btn-outline" data-cancel-round-action>Keep playing</button><button class="btn btn-primary" data-confirm-end-round>End round</button></div></div></div>`;
  if (confirmAction === 'abandon') return `<div class="editor-overlay" role="dialog" aria-modal="true"><div class="editor-sheet confirm-sheet"><div class="sheet-handle"></div><div class="confirm-icon">🗑️</div><p class="eyebrow">Abandon round</p><h2>Erase this entire round?</h2><p>Scores, cheats, and evidence from this active round will disappear permanently. Past history stays untouched.</p><div class="editor-actions"><button class="btn btn-outline" data-cancel-round-action>Cancel</button><button class="btn btn-danger" data-confirm-abandon-round>Abandon round</button></div></div></div>`;
  return `<div class="editor-overlay" role="dialog" aria-modal="true"><div class="editor-sheet"><div class="sheet-handle"></div><div class="editor-head"><div><p class="eyebrow">Round controls</p><h2>${esc(round.name)}</h2></div><button class="mini-icon-button" data-close-round-menu>×</button></div><div class="round-menu-list"><button data-round-menu-action="end"><span>🏁</span><strong>End Round</strong><small>Save scores and view the final summary.</small></button><button data-round-menu-action="abandon"><span>🗑️</span><strong>Abandon Round</strong><small>Delete this active round and return home.</small></button><button data-route="home"><span>⌂</span><strong>Leave Scorecard</strong><small>The round stays saved so you can resume later.</small></button></div></div></div>`;
}

let pickerOpen = false;

export function gameplayView() {
  const round = getActiveRound();
  if (!round) {
    return `<section class="page">
      <p class="eyebrow">No active round</p>
      <h1 class="page-title">The first tee is empty.</h1>
      <p class="page-lead">Configure a round before opening the live scorecard.</p>
      <button class="btn btn-primary btn-block" data-route="new-round">Set up a round</button>
    </section>`;
  }

  return `<section class="page gameplay-page">
    ${roundHeader(round)}
    ${holeNav(round)}
    <div class="live-player-list">${round.players.map((player) => playerCard(round, player)).join('')}</div>
    ${round.options.nark ? `<button class="nark-fab" data-open-nark><span>🚨</span><strong>NARK</strong></button>` : ''}
    <button class="btn btn-primary btn-block next-hole-button" data-next-hole>
      ${round.currentHole === 18 ? 'Review round' : `Go to hole ${round.currentHole + 1} →`}
    </button>
    <p class="autosave-note">Every score and cheat is saved automatically on this device.</p>
  </section>
  ${confirmationMarkup(round)}
  ${detailMarkup(round)}
  ${pickerOpen ? holePickerMarkup(round) : ''}
  ${narkOpen ? narkOverlay(round) : ''}${roundMenuOpen ? roundMenuMarkup(round) : ''}`;
}

function render() {
  document.getElementById('app').innerHTML = gameplayView();
}

function logAction(round, action) {
  round.actionLog.push({ ...action, at: new Date().toISOString(), hole: round.currentHole });
}

export function handleGameplayClick(target, showToast) {
  const round = getActiveRound();
  if (!round) return false;

  if (narkOpen && handleNarkClick(target, render, showToast)) return true;

  if (target.closest('[data-open-round-menu]')) { roundMenuOpen = true; confirmAction = null; render(); return true; }
  if (target.closest('[data-close-round-menu]')) { roundMenuOpen = false; confirmAction = null; render(); return true; }
  const roundAction = target.closest('[data-round-menu-action]');
  if (roundAction) { confirmAction = roundAction.dataset.roundMenuAction; render(); return true; }
  if (target.closest('[data-cancel-round-action]')) { confirmAction = null; render(); return true; }
  if (target.closest('[data-confirm-end-round]')) { completeActiveRound(round); roundMenuOpen = false; confirmAction = null; location.hash = '#results'; return true; }
  if (target.closest('[data-confirm-abandon-round]')) { abandonActiveRound(); roundMenuOpen = false; confirmAction = null; location.hash = '#home'; return true; }
  const shareRemaining = target.closest('[data-share-remaining]');
  if (shareRemaining) {
    const player = round.players.find(item => item.id === shareRemaining.dataset.shareRemaining);
    shareText(`${player.name}'s Remaining Pay to Par Cheats`, remainingCheatCard(round, player))
      .then(result => { if (result.ok) showToast(result.method === 'share' ? 'Remaining cheats shared.' : 'Remaining cheats copied.'); });
    return true;
  }


  if (target.closest('[data-open-nark]')) {
    resetNark();
    narkOpen = true;
    render();
    return true;
  }

  const score = target.closest('[data-score-change]');
  if (score) {
    const player = round.players.find((item) => item.id === score.dataset.playerId);
    const hole = player.holes[round.currentHole - 1];
    const delta = Number(score.dataset.scoreChange);
    if (delta > 0) hole.score = hole.score === null ? 1 : Math.min(20, hole.score + 1);
    else if (hole.score !== null) hole.score = hole.score <= 1 ? null : hole.score - 1;
    saveActiveRound(round); render(); return true;
  }

  const use = target.closest('[data-use-cheat]');
  if (use) {
    pendingCheat = { playerId: use.dataset.playerId, cheatId: use.dataset.useCheat };
    render(); return true;
  }

  if (target.closest('[data-cancel-cheat]')) {
    pendingCheat = null; render(); return true;
  }

  if (target.closest('[data-confirm-cheat]') && pendingCheat) {
    const player = round.players.find((item) => item.id === pendingCheat.playerId);
    const cheat = CHEAT_MAP[pendingCheat.cheatId];
    if ((player.remainingInventory[cheat.id] ?? 0) <= 0) {
      pendingCheat = null; showToast('That cheat is already gone.'); render(); return true;
    }
    player.remainingInventory[cheat.id] -= 1;
    player.holes[round.currentHole - 1].usedCheats.push({
      cheatId: cheat.id,
      usedAt: new Date().toISOString()
    });
    logAction(round, { type: 'cheat', playerId: player.id, cheatId: cheat.id });
    pendingCheat = null;
    saveActiveRound(round);
    showToast(`${player.name} used ${cheat.name}.`);
    render(); return true;
  }

  const undo = target.closest('[data-undo-cheat]');
  if (undo) {
    const player = round.players.find((item) => item.id === undo.dataset.undoCheat);
    const hole = player.holes[round.currentHole - 1];
    const last = hole.usedCheats.pop();
    if (last) {
      player.remainingInventory[last.cheatId] += 1;
      logAction(round, { type: 'undo-cheat', playerId: player.id, cheatId: last.cheatId });
      saveActiveRound(round);
      showToast(`${CHEAT_MAP[last.cheatId].name} returned to ${player.name}.`);
    }
    render(); return true;
  }

  const holeChange = target.closest('[data-hole-change]');
  if (holeChange) {
    round.currentHole = Math.max(1, Math.min(18, round.currentHole + Number(holeChange.dataset.holeChange)));
    saveActiveRound(round); render(); return true;
  }

  const goHole = target.closest('[data-go-hole]');
  if (goHole) {
    round.currentHole = Number(goHole.dataset.goHole);
    saveActiveRound(round); render(); return true;
  }

  if (target.closest('[data-next-hole]')) {
    if (round.currentHole < 18) {
      round.currentHole += 1;
      saveActiveRound(round); render();
    } else {
      showToast('Round results arrive in Phase Five.');
    }
    return true;
  }

  if (target.closest('[data-hole-picker]')) {
    pickerOpen = true; render(); return true;
  }

  if (target.closest('[data-close-hole-picker]')) {
    pickerOpen = false; render(); return true;
  }

  const pickHole = target.closest('[data-pick-hole]');
  if (pickHole) {
    round.currentHole = Number(pickHole.dataset.pickHole);
    pickerOpen = false;
    saveActiveRound(round); render(); return true;
  }

  const playerDetail = target.closest('[data-player-detail]');
  if (playerDetail) {
    detailPlayerId = playerDetail.dataset.playerDetail;
    render(); return true;
  }

  if (target.closest('[data-close-player-detail]')) {
    detailPlayerId = null; render(); return true;
  }

  return false;
}


document.addEventListener('nark:close', () => {
  narkOpen = false;
  render();
});
