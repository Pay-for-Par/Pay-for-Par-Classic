import { startingCheatCard, shareText } from './share.js';
import { CHEATS, PACKAGES } from './data.js';
import { cloneInventory, loadDraft, makePlayer, saveConfiguredRound, saveDraft } from './state.js';

let draft = loadDraft();

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function activePlayers() {
  return draft.players.filter((player) => player.name.trim());
}

function stepHeader() {
  const labels = ['Players', 'Packages', 'Options'];
  return `<div class="setup-progress" aria-label="Round setup progress">
    ${labels.map((label, index) => `<div class="progress-step ${draft.step === index + 1 ? 'active' : ''} ${draft.step > index + 1 ? 'done' : ''}">
      <span>${draft.step > index + 1 ? '✓' : index + 1}</span><small>${label}</small>
    </div>`).join('')}
  </div>`;
}

function playerStep() {
  return `${stepHeader()}
    <p class="eyebrow">Step one</p>
    <h1 class="page-title">Build the foursome</h1>
    <p class="page-lead">Add the people whose scorecards are about to become works of fiction.</p>

    <label class="field panel compact-panel">
      <span class="field-label">Round name</span>
      <input id="roundNameInput" class="text-input" maxlength="50" value="${esc(draft.roundName)}" placeholder="Saturday Skins">
    </label>

    <div class="player-entry-list">
      ${draft.players.map((player, index) => `<div class="player-entry panel compact-panel">
        <span class="player-number">${index + 1}</span>
        <input class="text-input player-name-input" data-player-id="${player.id}" maxlength="24" value="${esc(player.name)}" placeholder="Golfer name">
        <button class="mini-icon-button remove-player" data-player-id="${player.id}" aria-label="Remove golfer">×</button>
      </div>`).join('')}
    </div>

    <button class="btn btn-outline btn-block" id="addPlayerButton">＋ Add golfer</button>
    <button class="btn btn-primary btn-block setup-next" data-setup-action="next">Choose packages →</button>`;
}

function packageStep() {
  const players = activePlayers();
  return `${stepHeader()}
    <p class="eyebrow">Step two</p>
    <h1 class="page-title">Assign the advantages</h1>
    <p class="page-lead">Pick a suggested starting package for each golfer. Every package can be adjusted without judgment.</p>

    <div class="package-player-list">
      ${players.map((player) => {
        const pack = PACKAGES[player.packageId];
        return `<article class="package-player-card panel">
          <div class="package-player-top">
            <div><p class="eyebrow">Golfer</p><h2>${esc(player.name)}</h2></div>
            ${player.modified ? '<span class="modified-badge">Modified</span>' : ''}
          </div>
          <div class="package-choice-row">
            ${Object.values(PACKAGES).map((option) => `<button class="package-choice ${player.packageId === option.id ? 'selected' : ''}" data-package-player="${player.id}" data-package-id="${option.id}">
              <span>${option.icon}</span><strong>${option.name}</strong>
            </button>`).join('')}
          </div>
          <div class="selected-package-copy">
            <strong>${pack.blurb}</strong><span>${pack.description}</span>
          </div>
          <button class="btn btn-outline btn-block" data-edit-player="${player.id}">Edit ${esc(player.name)}’s package</button>
        </article>`;
      }).join('')}
    </div>

    <div class="setup-button-row">
      <button class="btn btn-outline" data-setup-action="back">← Players</button>
      <button class="btn btn-primary" data-setup-action="next">Round options →</button>
    </div>`;
}

function editorMarkup(player) {
  const pack = PACKAGES[player.packageId];
  return `<div class="editor-overlay" role="dialog" aria-modal="true" aria-label="Edit cheat package">
    <div class="editor-sheet">
      <div class="sheet-handle"></div>
      <div class="editor-head">
        <div><p class="eyebrow">Customize package</p><h2>${esc(player.name)}</h2><p>${pack.icon} ${pack.name}${player.modified ? ' · Modified' : ''}</p></div>
        <button class="mini-icon-button" data-close-editor aria-label="Close">×</button>
      </div>
      <div class="inventory-editor">
        ${CHEATS.map((cheat) => {
          const count = player.inventory[cheat.id] ?? 0;
          const locked = cheat.free;
          return `<div class="inventory-row">
            <span class="cheat-emoji">${cheat.icon}</span>
            <div class="inventory-copy"><strong>${cheat.name}</strong><small>${locked ? 'Included free' : cheat.timing}</small></div>
            <div class="stepper ${locked ? 'locked' : ''}">
              <button data-inventory-change="-1" data-cheat-id="${cheat.id}" ${locked ? 'disabled' : ''}>−</button>
              <span>${count}</span>
              <button data-inventory-change="1" data-cheat-id="${cheat.id}" ${locked ? 'disabled' : ''}>＋</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="editor-actions">
        <button class="btn btn-outline" data-reset-package>Reset package</button>
        <button class="btn btn-primary" data-close-editor>Done</button>
      </div>
    </div>
  </div>`;
}

function optionsStep() {
  return `${stepHeader()}
    <p class="eyebrow">Step three</p>
    <h1 class="page-title">Choose the house rules</h1>
    <p class="page-lead">These can change from round to round. The group has the final word, as long as it agrees with the scorekeeper.</p>

    <div class="option-list">
      <label class="option-card panel">
        <div class="option-icon">🕵️</div>
        <div><strong>Enable The Nark</strong><span>Players may challenge unauthorized cheating before leaving the hole.</span></div>
        <input type="checkbox" data-option="nark" ${draft.options.nark ? 'checked' : ''}>
      </label>
      <label class="option-card panel">
        <div class="option-icon">🎡</div>
        <div><strong>Enable Wheel of Shame</strong><span>Guilty players may receive a performance-based punishment instead of confiscation.</span></div>
        <input type="checkbox" data-option="wheel" ${draft.options.wheel ? 'checked' : ''}>
      </label>
      <label class="option-card panel">
        <div class="option-icon">↺</div>
        <div><strong>Keep Round History</strong><span>Save results on this device when gameplay is completed.</span></div>
        <input type="checkbox" data-option="history" ${draft.options.history ? 'checked' : ''}>
      </label>
    </div>

    <div class="round-review panel">
      <p class="eyebrow">Ready to play</p>
      <h2>${esc(draft.roundName || 'New Round')}</h2>
      <div class="review-list">${activePlayers().map((player) => `<div><span>${esc(player.name)}</span><strong>${PACKAGES[player.packageId].icon} ${PACKAGES[player.packageId].name}${player.modified ? ' +' : ''}</strong></div>`).join('')}</div>
    </div>

    <div class="setup-button-row">
      <button class="btn btn-outline" data-setup-action="back">← Packages</button>
      <button class="btn btn-primary" data-setup-action="start">Set the match</button>
    </div>`;
}

function readyMarkup(round) {
  return `<section class="page">
    <p class="eyebrow">Match configured</p>
    <h1 class="page-title">The questionable decisions are official.</h1>
    <p class="page-lead">${esc(round.name)} is saved on this device and ready for the gameplay phase.</p>
    <div class="panel ready-card">
      <div class="ready-seal">✓</div>
      <h2>${esc(round.name)}</h2>
      <p>${round.players.length} golfer${round.players.length === 1 ? '' : 's'} · The Nark ${round.options.nark ? 'on' : 'off'} · Wheel ${round.options.wheel ? 'on' : 'off'}</p>
      <div class="review-list">${round.players.map((player) => `<div><span>${esc(player.name)}</span><strong>${PACKAGES[player.packageId].icon} ${PACKAGES[player.packageId].name}${player.modified ? ' +' : ''}</strong></div>`).join('')}</div>
    </div>
    <button class="btn btn-primary btn-block" data-demo-toast="Phase Three will open the live scorecard from this match.">Open scorecard</button>
    <button class="btn btn-outline btn-block" data-new-setup>Configure another round</button>
  </section>`;
}

export function setupView() {
  if (draft.completedRound) return readyMarkup(draft.completedRound);
  const content = draft.step === 1 ? playerStep() : draft.step === 2 ? packageStep() : optionsStep();
  const editor = draft.editingPlayerId
    ? editorMarkup(draft.players.find((player) => player.id === draft.editingPlayerId))
    : '';
  return `<section class="page setup-page">${content}</section>${editor}`;
}

function rerender() {
  saveDraft(draft);
  document.getElementById('app').innerHTML = setupView();
}

function inventoryMatchesPackage(player) {
  const baseline = PACKAGES[player.packageId].inventory;
  return Object.keys(baseline).every((id) => baseline[id] === player.inventory[id]);
}

export function handleSetupClick(target, showToast) {
  const action = target.closest('[data-setup-action]')?.dataset.setupAction;
  if (action === 'next') {
    if (draft.step === 1 && activePlayers().length === 0) {
      showToast('Add at least one golfer. Even solo cheating needs a witness.');
      return true;
    }
    draft.step = Math.min(3, draft.step + 1);
    rerender(); return true;
  }
  if (action === 'back') { draft.step = Math.max(1, draft.step - 1); rerender(); return true; }
  const shareStart = target.closest('[data-share-starting]');
  if (shareStart) {
    const player = draft.players.find(item => item.id === shareStart.dataset.shareStarting);
    player.startingInventory = { ...player.inventory };
    shareText(`${player.name}'s Pay to Par Cheat Card`, startingCheatCard({ name: draft.roundName || 'Pay to Par Round' }, player))
      .then(result => { if (result.ok) showToast(result.method === 'share' ? 'Cheat card shared.' : 'Cheat card copied.'); });
    return true;
  }

  if (action === 'start') {
    saveConfiguredRound(draft);
    draft.completedRound = null;
    saveDraft(draft);
    location.hash = '#round';
    return true;
  }

  if (target.closest('#addPlayerButton')) {
    if (draft.players.length >= 8) showToast('Eight golfers is already a traffic problem.');
    else { draft.players.push(makePlayer()); rerender(); }
    return true;
  }

  const remove = target.closest('.remove-player');
  if (remove) {
    if (draft.players.length === 1) showToast('Keep at least one player row.');
    else { draft.players = draft.players.filter((player) => player.id !== remove.dataset.playerId); rerender(); }
    return true;
  }

  const choice = target.closest('[data-package-player]');
  if (choice) {
    const player = draft.players.find((item) => item.id === choice.dataset.packagePlayer);
    player.packageId = choice.dataset.packageId;
    player.inventory = cloneInventory(player.packageId);
    player.modified = false;
    rerender(); return true;
  }

  const edit = target.closest('[data-edit-player]');
  if (edit) { draft.editingPlayerId = edit.dataset.editPlayer; rerender(); return true; }
  if (target.closest('[data-close-editor]')) { draft.editingPlayerId = null; rerender(); return true; }

  const change = target.closest('[data-inventory-change]');
  if (change) {
    const player = draft.players.find((item) => item.id === draft.editingPlayerId);
    const id = change.dataset.cheatId;
    player.inventory[id] = Math.max(0, Math.min(9, (player.inventory[id] ?? 0) + Number(change.dataset.inventoryChange)));
    player.modified = !inventoryMatchesPackage(player);
    rerender(); return true;
  }

  if (target.closest('[data-reset-package]')) {
    const player = draft.players.find((item) => item.id === draft.editingPlayerId);
    player.inventory = cloneInventory(player.packageId);
    player.modified = false;
    rerender(); return true;
  }

  if (target.closest('[data-new-setup]')) {
    draft = loadDraft();
    draft.completedRound = null;
    draft.step = 1;
    draft.players = [makePlayer(), makePlayer(), makePlayer(), makePlayer()];
    rerender(); return true;
  }

  return false;
}

export function handleSetupInput(target) {
  if (target.id === 'roundNameInput') {
    draft.roundName = target.value;
    saveDraft(draft);
    return true;
  }
  if (target.matches('.player-name-input')) {
    const player = draft.players.find((item) => item.id === target.dataset.playerId);
    if (player) player.name = target.value;
    saveDraft(draft);
    return true;
  }
  if (target.matches('[data-option]')) {
    draft.options[target.dataset.option] = target.checked;
    saveDraft(draft);
    return true;
  }
  return false;
}
