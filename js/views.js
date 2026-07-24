import { CHEATS, WHEEL } from './data.js';
import { setupView } from './setup.js';

export function homeView() {
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">A golf game with flexible morals</p>
        <h1>PAY<br>TO PAR</h1>
        <p class="tagline">The score you'll tell everyone you shot anyway.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="new-round">Start a round</button>
          <button class="btn btn-secondary" data-route="about">What is this?</button>
        </div>
      </div>

      <button class="welcome-card panel" data-route="about">
        <span class="welcome-icon">⛳</span>
        <span><strong>Where golf becomes almost secondary to making memories.</strong><small>See why Pay to Par exists and how a match works.</small></span>
        <b>→</b>
      </button>

      <div class="section-heading">
        <div><p class="eyebrow">Clubhouse</p><h2>Pick your poison</h2></div>
        <p>Phase Two</p>
      </div>

      <div class="action-grid">
        <button class="action-card" data-route="new-round">
          <span class="action-icon">＋</span><strong>New Round</strong><small>Add players, choose packages and configure the match.</small>
        </button>
        <button class="action-card" data-route="rules">
          <span class="action-icon">♧</span><strong>Rules</strong><small>Cheat glossary, The Nark and Wheel of Shame.</small>
        </button>
        <button class="action-card" data-route="history">
          <span class="action-icon">↺</span><strong>History</strong><small>Saved rounds and stories worth retelling.</small>
        </button>
        <button class="action-card" data-route="settings">
          <span class="action-icon">⚙</span><strong>Settings</strong><small>House rules and app preferences.</small>
        </button>
      </div>
    </section>`;
}

export function aboutView() {
  return `<section class="page">
    <p class="eyebrow">Welcome to Pay to Par</p>
    <h1 class="page-title">Where golf becomes almost secondary to making memories.</h1>
    <div class="panel story-panel">
      <p>Most casual golfers already take the official rules a little lightly. We take the occasional breakfast ball, improve a terrible lie, ignore a ball that clearly deserved a watery grave, and still somehow announce the score we intended to shoot.</p>
      <p>Pay to Par takes the way many of us already play and turns it into a more entertaining, strategic game.</p>
      <p>Set up your round, add the players, and assign each golfer a package of preapproved cheats. Every package can be customized, so each player starts with the mix of second chances, escapes, and questionable advantages the group agrees is fair.</p>
      <p><strong>Use them carefully. Once your cheats are gone, you are playing on pure skill—or luck.</strong></p>
    </div>

    <div class="section-heading"><div><p class="eyebrow">How it works</p><h2>Configure the match</h2></div></div>
    <div class="how-grid">
      <div class="how-step panel"><span>1</span><strong>Add the players</strong><p>Name the round and enter the golfers.</p></div>
      <div class="how-step panel"><span>2</span><strong>Choose packages</strong><p>Assign a suggested loadout and customize it freely.</p></div>
      <div class="how-step panel"><span>3</span><strong>Set house rules</strong><p>Enable The Nark and the optional Wheel of Shame.</p></div>
      <div class="how-step panel"><span>4</span><strong>Play strategically</strong><p>Use cheats, keep moving and finish with a story.</p></div>
    </div>

    <div class="panel nark-intro">
      <div class="option-icon">🕵️</div>
      <div><p class="eyebrow">The Nark</p><h2>Preapproved cheating is part of the game.</h2><p>Unauthorized cheating is another matter. Call “Nark!” before leaving the hole, let the group vote, and confiscate a cheat—or spin the Wheel of Shame. If no cheats remain, add one stroke.</p></div>
    </div>

    <button class="btn btn-primary btn-block" data-route="new-round">Set up a round</button>
    <button class="btn btn-outline btn-block" data-route="rules">Read the full rules</button>
  </section>`;
}

export { setupView as newRoundView };

export function rulesView() {
  return `<section class="page">
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
  return `<div class="cheat-list">${CHEATS.map((c) => `<article class="cheat-item">
      <button class="cheat-summary" data-cheat-toggle><span class="cheat-emoji">${c.icon}</span><span><strong>${c.name}</strong></span><span>＋</span></button>
      <div class="cheat-detail"><strong>${c.summary}</strong><br>${c.timing}</div>
    </article>`).join('')}</div>`;
}

function narkMarkup() {
  return `<div class="panel">
    <div class="rule-copy"><h3>Calling The Nark</h3><p>See an unapproved foot wedge, suspicious drop or other creative interpretation of golf? Call “Nark!” before the group leaves the hole.</p></div>
    <div class="rule-copy"><h3>Group vote</h3><p>The group decides. Majority rules. A tie means the accused survives on a technicality.</p></div>
    <div class="rule-copy"><h3>If guilty</h3><p>The Nark confiscates one unused cheat. When Wheel of Shame is enabled, the group may spin instead. If no cheat remains, add one stroke.</p></div>
  </div>`;
}

function wheelMarkup() {
  return `<div class="cheat-list">${WHEEL.map(([icon, name, desc]) => `<article class="cheat-item open">
      <div class="cheat-summary"><span class="cheat-emoji">${icon}</span><span><strong>${name}</strong></span><span></span></div>
      <div class="cheat-detail">${desc}</div>
    </article>`).join('')}</div>`;
}

export function historyView() {
  return `<section class="page"><p class="eyebrow">The evidence locker</p><h1 class="page-title">Round History</h1><p class="page-lead">Completed rounds will be stored on this device for quick access.</p><div class="panel placeholder"><div class="placeholder-mark">↺</div><h2>No suspicious scores yet</h2><p>Round history becomes active when gameplay and results are added.</p></div></section>`;
}

export function settingsView() {
  return `<section class="page"><p class="eyebrow">House rules</p><h1 class="page-title">Settings</h1><p class="page-lead">Saved preferences and install information will live here.</p><div class="panel"><div class="rule-copy"><h3>The Nark</h3><p>Enabled by default.</p></div><div class="rule-copy"><h3>Wheel of Shame</h3><p>Optional for every round.</p></div><div class="rule-copy"><h3>Offline play</h3><p>Pay to Par is configured as an installable PWA.</p></div></div></section>`;
}

export function renderRuleTab(tab) {
  if (tab === 'nark') return narkMarkup();
  if (tab === 'wheel') return wheelMarkup();
  return cheatsMarkup();
}
