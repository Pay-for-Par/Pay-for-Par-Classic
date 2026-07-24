import { CHEATS, CHEAT_MAP, WHEEL } from './data.js';
import { getActiveRound, saveActiveRound } from './state.js';

let narkStep = 'accused';
let accusedId = null;
let reason = null;
let wheelResult = null;
let wheelSpinning = false;
let selectedConfiscation = null;

const REASONS = [
  ['Improved Lie', 'Moved or rolled the ball into a better position.'],
  ['Illegal Drop', 'Took a suspiciously generous or convenient drop.'],
  ['Moved Ball', 'Relocated the ball without an approved cheat.'],
  ['Creative Accounting', 'Ignored a stroke, penalty, or other inconvenient fact.'],
  ['Other', 'Some new offense the rules committee failed to anticipate.']
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function resetCase() {
  narkStep = 'accused';
  accusedId = null;
  reason = null;
  wheelResult = null;
  wheelSpinning = false;
  selectedConfiscation = null;
}

function wheelSegments() {
  return WHEEL.map(([icon, name, desc], index) => ({
    index, icon, name, desc
  }));
}

function accusedMarkup(round) {
  return `<div class="nark-body">
    <p class="nark-intro">Who was caught committing unauthorized golf?</p>
    <div class="nark-player-grid">
      ${round.players.map((player) => `<button data-nark-accused="${player.id}">
        <span>${esc(player.name.charAt(0).toUpperCase())}</span>
        <strong>${esc(player.name)}</strong>
      </button>`).join('')}
    </div>
  </div>`;
}

function reasonMarkup(round) {
  const player = round.players.find((item) => item.id === accusedId);
  return `<div class="nark-body">
    <p class="nark-intro">What did ${esc(player.name)} allegedly do?</p>
    <div class="reason-list">
      ${REASONS.map(([name, desc]) => `<button data-nark-reason="${esc(name)}">
        <strong>${esc(name)}</strong><small>${esc(desc)}</small>
      </button>`).join('')}
    </div>
    <button class="text-button" data-nark-back>← Choose another player</button>
  </div>`;
}

function voteMarkup(round) {
  const player = round.players.find((item) => item.id === accusedId);
  return `<div class="nark-body vote-body">
    <div class="accused-seal">🚨</div>
    <p class="eyebrow">Group vote</p>
    <h2>${esc(player.name)} stands accused</h2>
    <p><strong>${esc(reason)}</strong></p>
    <div class="vote-actions">
      <button class="btn btn-outline" data-nark-verdict="not-guilty">Not Guilty</button>
      <button class="btn btn-danger" data-nark-verdict="guilty">Guilty</button>
    </div>
    <button class="text-button" data-nark-back>← Change accusation</button>
  </div>`;
}

function punishmentChoiceMarkup(round) {
  const player = round.players.find((item) => item.id === accusedId);
  const unused = CHEATS.filter((cheat) => (player.remainingInventory[cheat.id] ?? 0) > 0);
  const canConfiscate = unused.length > 0;

  return `<div class="nark-body">
    <p class="eyebrow">Convicted</p>
    <h2>Choose ${esc(player.name)}'s fate</h2>
    <div class="punishment-options">
      ${round.options.wheel ? `<button class="punishment-card wheel-card" data-punishment-choice="wheel">
        <span>🎡</span><strong>Spin the Wheel</strong><small>Let destiny and poor judgment decide.</small>
      </button>` : ''}
      <button class="punishment-card" data-punishment-choice="confiscate" ${canConfiscate ? '' : 'disabled'}>
        <span>🕵️</span><strong>Confiscate a Cheat</strong><small>${canConfiscate ? 'The Nark steals one unused cheat.' : 'No unused cheats remain.'}</small>
      </button>
      <button class="punishment-card" data-punishment-choice="stroke">
        <span>➕</span><strong>Add One Stroke</strong><small>Immediate and beautifully simple.</small>
      </button>
    </div>
  </div>`;
}

function confiscationMarkup(round) {
  const player = round.players.find((item) => item.id === accusedId);
  const unused = CHEATS.filter((cheat) => (player.remainingInventory[cheat.id] ?? 0) > 0);

  return `<div class="nark-body">
    <p class="eyebrow">Cheat confiscation</p>
    <h2>What will The Nark steal?</h2>
    <div class="confiscation-list">
      ${unused.map((cheat) => `<button data-confiscate-cheat="${cheat.id}">
        <span>${cheat.icon}</span><strong>${cheat.name}</strong><small>${player.remainingInventory[cheat.id]} remaining</small>
      </button>`).join('')}
    </div>
    <button class="text-button" data-nark-back>← Choose another punishment</button>
  </div>`;
}

function wheelMarkup(round) {
  const segments = wheelSegments();
  const gradient = segments.map((segment, index) => {
    const start = index * (360 / segments.length);
    const end = (index + 1) * (360 / segments.length);
    const color = index % 2 === 0 ? 'var(--green-700)' : 'var(--gold)';
    return `${color} ${start}deg ${end}deg`;
  }).join(', ');

  return `<div class="nark-body wheel-body">
    <p class="eyebrow">Wheel of Shame</p>
    <h2>${wheelResult ? 'The verdict is in' : 'Spin for punishment'}</h2>
    <div class="wheel-wrap">
      <div class="wheel-pointer">▼</div>
      <div id="shameWheel" class="shame-wheel ${wheelSpinning ? 'spinning' : ''}" style="background: conic-gradient(${gradient});">
        ${segments.map((segment, index) => {
          const angle = index * (360 / segments.length) + (180 / segments.length);
          return `<div class="wheel-label" style="--angle:${angle}deg"><span>${segment.icon}</span></div>`;
        }).join('')}
        <div class="wheel-hub">P2P</div>
      </div>
    </div>
    ${wheelResult ? `<div class="wheel-result">
      <span>${wheelResult.icon}</span>
      <h3>${esc(wheelResult.name)}</h3>
      <p>${esc(wheelResult.desc)}</p>
      <button class="btn btn-primary btn-block" data-apply-wheel>Apply punishment</button>
      <button class="text-button" data-spin-again>Spin again</button>
    </div>` : `<button class="btn btn-primary btn-block spin-button" data-spin-wheel ${wheelSpinning ? 'disabled' : ''}>${wheelSpinning ? 'Spinning…' : 'Spin the Wheel'}</button>`}
  </div>`;
}

function caseCompleteMarkup(round, caseRecord) {
  const player = round.players.find((item) => item.id === caseRecord.accusedId);
  return `<div class="nark-body case-complete">
    <div class="complete-mark">⚖️</div>
    <p class="eyebrow">Case closed</p>
    <h2>${esc(player.name)} has been punished</h2>
    <p>${esc(caseRecord.punishmentLabel)}</p>
    <button class="btn btn-primary btn-block" data-close-nark>Return to round</button>
  </div>`;
}

let completedCase = null;

export function narkOverlay(round) {
  let body = '';
  if (completedCase) body = caseCompleteMarkup(round, completedCase);
  else if (narkStep === 'accused') body = accusedMarkup(round);
  else if (narkStep === 'reason') body = reasonMarkup(round);
  else if (narkStep === 'vote') body = voteMarkup(round);
  else if (narkStep === 'punishment') body = punishmentChoiceMarkup(round);
  else if (narkStep === 'confiscate') body = confiscationMarkup(round);
  else if (narkStep === 'wheel') body = wheelMarkup(round);

  return `<div class="editor-overlay nark-overlay" role="dialog" aria-modal="true" aria-label="The Nark">
    <div class="editor-sheet nark-sheet">
      <div class="sheet-handle"></div>
      <div class="editor-head">
        <div><p class="eyebrow">Unauthorized cheating division</p><h2>THE NARK</h2></div>
        <button class="mini-icon-button" data-close-nark aria-label="Close">×</button>
      </div>
      ${body}
    </div>
  </div>`;
}

function recordCase(round, verdict, punishment = null) {
  const record = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    hole: round.currentHole,
    accusedId,
    reason,
    verdict,
    punishment,
    punishmentLabel: punishment?.label || (verdict === 'not-guilty' ? 'Not guilty' : 'Guilty'),
    createdAt: new Date().toISOString()
  };
  round.narkCases = round.narkCases || [];
  round.narkCases.push(record);
  return record;
}

function addStroke(round, player) {
  const hole = player.holes[round.currentHole - 1];
  hole.score = hole.score === null ? 1 : Math.min(20, hole.score + 1);
}

function applyPunishment(round, punishment) {
  const player = round.players.find((item) => item.id === accusedId);
  round.punishments = round.punishments || [];

  if (punishment.type === 'stroke') addStroke(round, player);
  if (punishment.type === 'confiscate') {
    player.remainingInventory[punishment.cheatId] = Math.max(0, (player.remainingInventory[punishment.cheatId] ?? 0) - 1);
  }
  if (punishment.type === 'wheel' && punishment.name === 'One Stroke') addStroke(round, player);
  if (punishment.type === 'wheel' && punishment.name === 'Cheat Confiscation') {
    const available = CHEATS.find((cheat) => (player.remainingInventory[cheat.id] ?? 0) > 0);
    if (available) {
      player.remainingInventory[available.id] -= 1;
      punishment.extra = `${available.name} confiscated`;
    } else {
      addStroke(round, player);
      punishment.extra = 'No cheats remained, so one stroke was added';
    }
  }

  round.punishments.push({
    playerId: player.id,
    hole: round.currentHole,
    ...punishment,
    createdAt: new Date().toISOString()
  });

  const record = recordCase(round, 'guilty', {
    ...punishment,
    label: punishment.extra ? `${punishment.label} — ${punishment.extra}` : punishment.label
  });
  completedCase = record;
  saveActiveRound(round);
}

export function resetNark() {
  resetCase();
  completedCase = null;
}

export function handleNarkClick(target, rerender, showToast) {
  const round = getActiveRound();
  if (!round) return false;

  const accused = target.closest('[data-nark-accused]');
  if (accused) {
    accusedId = accused.dataset.narkAccused;
    narkStep = 'reason';
    rerender(); return true;
  }

  const reasonTarget = target.closest('[data-nark-reason]');
  if (reasonTarget) {
    reason = reasonTarget.dataset.narkReason;
    narkStep = 'vote';
    rerender(); return true;
  }

  const verdict = target.closest('[data-nark-verdict]');
  if (verdict) {
    if (verdict.dataset.narkVerdict === 'not-guilty') {
      completedCase = recordCase(round, 'not-guilty');
      saveActiveRound(round);
      rerender(); return true;
    }
    narkStep = 'punishment';
    rerender(); return true;
  }

  const choice = target.closest('[data-punishment-choice]');
  if (choice) {
    if (choice.dataset.punishmentChoice === 'wheel') narkStep = 'wheel';
    if (choice.dataset.punishmentChoice === 'confiscate') narkStep = 'confiscate';
    if (choice.dataset.punishmentChoice === 'stroke') {
      applyPunishment(round, { type: 'stroke', label: 'One stroke added' });
    }
    rerender(); return true;
  }

  const confiscate = target.closest('[data-confiscate-cheat]');
  if (confiscate) {
    const cheat = CHEAT_MAP[confiscate.dataset.confiscateCheat];
    applyPunishment(round, {
      type: 'confiscate',
      cheatId: cheat.id,
      label: `${cheat.name} confiscated`
    });
    rerender(); return true;
  }

  if (target.closest('[data-spin-wheel]')) {
    if (wheelSpinning) return true;
    wheelSpinning = true;
    wheelResult = null;
    rerender();

    const wheel = document.getElementById('shameWheel');
    const segments = wheelSegments();
    const selectedIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    const rotations = 5 + Math.floor(Math.random() * 3);
    const finalAngle = rotations * 360 + (360 - (selectedIndex * segmentAngle + segmentAngle / 2));
    wheel.style.setProperty('--spin-deg', `${finalAngle}deg`);
    wheel.classList.add('animate-spin');

    window.setTimeout(() => {
      wheelResult = segments[selectedIndex];
      wheelSpinning = false;
      rerender();
    }, 3600);
    return true;
  }

  if (target.closest('[data-spin-again]')) {
    wheelResult = null;
    wheelSpinning = false;
    rerender(); return true;
  }

  if (target.closest('[data-apply-wheel]') && wheelResult) {
    applyPunishment(round, {
      type: 'wheel',
      name: wheelResult.name,
      label: wheelResult.name,
      description: wheelResult.desc
    });
    rerender(); return true;
  }

  if (target.closest('[data-nark-back]')) {
    if (narkStep === 'reason') narkStep = 'accused';
    else if (narkStep === 'vote') narkStep = 'reason';
    else narkStep = 'punishment';
    rerender(); return true;
  }

  if (target.closest('[data-close-nark]')) {
    resetNark();
    document.dispatchEvent(new CustomEvent('nark:close'));
    return true;
  }

  return false;
}
