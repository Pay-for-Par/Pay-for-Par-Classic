import { CHEATS, WHEEL } from './data.js';

export function homeView() {
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">A golf game with flexible morals</p>
        <h1>PAY<br>TO PAR</h1>
        <p class="tagline">The score you'll tell everyone you shot anyway.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="new-round">Start a round</button>
          <button class="btn btn-secondary" data-route="rules">How to play</button>
        </div>
      </div>

      <div class="section-heading">
        <div><p class="eyebrow">Clubhouse</p><h2>Pick your poison</h2></div>
        <p>Phase One</p>
      </div>

      <div class="action-grid">
        <button class="action-card" data-route="new-round">
          <span class="action-icon">＋</span>
          <strong>New Round</strong>
          <small>Add players, choose packages and tee off.</small>
        </button>
        <button class="action-card" data-route="rules">
          <span class="action-icon">♧</span>
          <strong>Rules</strong>
          <small>Cheat glossary, The Nark and Wheel of Shame.</small>
        </button>
        <button class="action-card" data-route="history">
          <span class="action-icon">↺</span>
          <strong>History</strong>
          <small>Saved rounds and stories worth retelling.</small>
        </button>
        <button class="action-card" data-route="settings">
          <span class="action-icon">⚙</span>
          <strong>Settings</strong>
          <small>House rules and app preferences.</small>
        </button>
      </div>
    </section>`;
}

export function newRoundView() {
  return `
    <section class="page">
      <p class="eyebrow">Phase Two preview</p>
      <h1 class="page-title">Build the foursome</h1>
      <p class="page-lead">Player entry, editable cheat packages and round options will live here.</p>
      <div class="panel placeholder">
        <div class="placeholder-mark">＋</div>
        <h2>Round setup shell is ready</h2>
        <p>The next build will add golfers, package selection, package editing and the start-round workflow.</p>
        <button class="btn btn-primary btn-block" data-demo-toast="Phase Two will activate round setup.">Preview action</button>
      </div>
    </section>`;
}

export function rulesView() {
  return `
    <section class="page">
      <p class="eyebrow">Read it before arguing</p>
      <h1 class="page-title">Rules & Cheat Glossary</h1>
      <p class="page-lead">Fast enough to read on the first tee. Clear enough to settle the argument on the 14th.</p>

      <div class="rule-tabs">
        <button class="tab-button active" data-rule-tab="cheats">Cheats</button>
        <button class="tab-button" data-rule-tab="nark">The Nark</button>
        <button class="tab-button" data-rule-tab="wheel">Wheel</button>
      </div>

      <div id="rulesContent">${cheatsMarkup()}</div>
    </section>`;
}

function cheatsMarkup() {
  return `<div class="cheat-list">${CHEATS.map((c) => `
    <article class="cheat-item">
      <button class="cheat-summary" data-cheat-toggle>
        <span class="cheat-emoji">${c.icon}</span>
        <span><strong>${c.name}</strong></span>
        <span>＋</span>
      </button>
      <div class="cheat-detail"><strong>${c.summary}</strong><br>${c.timing}</div>
    </article>`).join('')}</div>`;
}

function narkMarkup() {
  return `<div class="panel">
    <div class="rule-copy">
      <h3>Calling The Nark</h3>
      <p>See an unapproved foot wedge, suspicious drop or other creative interpretation of golf? Call “Nark!” before the group leaves the hole.</p>
    </div>
    <div class="rule-copy">
      <h3>Group vote</h3>
      <p>The group decides. Majority rules. A tie means the accused survives on a technicality.</p>
    </div>
    <div class="rule-copy">
      <h3>If guilty</h3>
      <p>The Nark confiscates one unused cheat. When Wheel of Shame is enabled, the group may spin instead. If no cheat remains, add one stroke.</p>
    </div>
  </div>`;
}

function wheelMarkup() {
  return `<div class="cheat-list">${WHEEL.map(([icon, name, desc]) => `
    <article class="cheat-item open">
      <div class="cheat-summary">
        <span class="cheat-emoji">${icon}</span>
        <span><strong>${name}</strong></span>
        <span></span>
      </div>
      <div class="cheat-detail">${desc}</div>
    </article>`).join('')}</div>`;
}

export function historyView() {
  return `
    <section class="page">
      <p class="eyebrow">The evidence locker</p>
      <h1 class="page-title">Round History</h1>
      <p class="page-lead">Completed rounds will be stored on this device for quick access.</p>
      <div class="panel placeholder">
        <div class="placeholder-mark">↺</div>
        <h2>No suspicious scores yet</h2>
        <p>Round history becomes active when gameplay and results are added.</p>
      </div>
    </section>`;
}

export function settingsView() {
  return `
    <section class="page">
      <p class="eyebrow">House rules</p>
      <h1 class="page-title">Settings</h1>
      <p class="page-lead">The production version will hold saved preferences, default options and install information here.</p>
      <div class="panel">
        <div class="rule-copy"><h3>The Nark</h3><p>Enabled by default.</p></div>
        <div class="rule-copy"><h3>Wheel of Shame</h3><p>Optional for every round.</p></div>
        <div class="rule-copy"><h3>Offline play</h3><p>This Phase One shell is configured as an installable PWA.</p></div>
      </div>
    </section>`;
}

export function renderRuleTab(tab) {
  if (tab === 'nark') return narkMarkup();
  if (tab === 'wheel') return wheelMarkup();
  return cheatsMarkup();
}
