import { CHEATS, WHEEL } from './data.js';
import { setupView } from './setup.js';

export function homeView() {
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">A golf game with flexible morals</p>
        <h1>PAY<br>TO PAR</h1>
        <p class="tagline">The score you'll tell everyone you shot anyway.</p>
      </div>

      <button class="welcome-card panel" data-route="about">
        <span class="welcome-icon">⛳</span>
        <span><strong>Where golf becomes almost secondary to making memories.</strong><small>See why Pay to Par exists and how a match works.</small></span>
        <b>→</b>
      </button>

      <div class="section-heading">
        <div><p class="eyebrow">Clubhouse</p><h2>Pick your poison</h2></div>
        <p>Phase Four</p>
      </div>

      <div class="action-grid">
        <button class="action-card" data-route="${localStorage.getItem('pay_to_par_active_round_v3') ? 'round' : 'new-round'}">
          <span class="action-icon">${localStorage.getItem('pay_to_par_active_round_v3') ? '▶' : '＋'}</span>
          <strong>${localStorage.getItem('pay_to_par_active_round_v3') ? 'Resume Round' : 'New Round'}</strong>
          <small>${localStorage.getItem('pay_to_par_active_round_v3') ? 'Return to the live scorecard.' : 'Add players, choose packages and configure the match.'}</small>
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
      <div class="section-heading"><div><p class="eyebrow">Essential golf tools</p><h2>Serious technology</h2></div><p>Mostly</p></div>
      <div class="action-grid">
        <button class="action-card" data-route="weather"><span class="action-icon">☀️</span><strong>Weather</strong><small>Advanced conditions analysis.</small></button>
        <button class="action-card" data-route="gps"><span class="action-icon">📍</span><strong>GPS</strong><small>Critical distance information.</small></button>
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
      <h1 class="page-title">How to Play</h1>
      <p class="page-lead">A quick explanation of the game, followed by the cheat glossary, The Nark, and the Wheel of Shame.</p>
      <div class="rule-tabs">
        <button class="tab-button active" data-rule-tab="overview">Overview</button>
        <button class="tab-button" data-rule-tab="cheats">Cheats</button>
        <button class="tab-button" data-rule-tab="nark">The Nark</button>
        <button class="tab-button" data-rule-tab="wheel">Wheel</button>
      </div>
      <div id="rulesContent">${overviewMarkup()}</div>
    </section>`;
}

function overviewMarkup() {
  return `<div class="panel how-to-panel">
    <div class="rule-copy">
      <p class="eyebrow">Welcome to Pay to Par</p>
      <h3>Where golf becomes almost secondary to making memories.</h3>
      <p>Most casual golfers already take the official rules of golf a little lightly. Pay to Par takes the way many of us are already playing and turns it into a more entertaining, strategic game.</p>
    </div>

    <div class="rule-copy">
      <h3>Set up the match</h3>
      <p>Add the players, choose a suggested cheat package for each golfer, and customize any package the group wants to change. Every cheat must be approved before the round begins. Each player’s Cheat Card can then be shared individually—or the entire group can be sent in one compact message—to text, email, AirDrop, or another supported app so everyone has a copy.</p>
    </div>

    <div class="rule-copy">
      <h3>Use your cheats wisely</h3>
      <p>Use cheats whenever their rules allow, but choose carefully. Once your cheats are gone, you are playing on pure skill—or luck. A player’s updated remaining cheats can be shared again at any time from their player card.</p>
    </div>

    <div class="rule-copy">
      <h3>Unauthorized cheating</h3>
      <p>If another player catches you using a non-preapproved cheat, they can call The Nark before the group leaves the hole. The group votes, and a guilty player faces confiscation, a stroke, or the Wheel of Shame.</p>
    </div>

    <div class="rule-copy">
      <h3>The goal</h3>
      <p>The golfer with the lowest score still wins. The real point is to keep everyone involved, reduce frustration, create strategy, and leave the course with stories worth retelling.</p>
    </div>
  </div>`;
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
  if (tab === 'cheats') return cheatsMarkup();
  if (tab === 'nark') return narkMarkup();
  if (tab === 'wheel') return wheelMarkup();
  return overviewMarkup();
}
