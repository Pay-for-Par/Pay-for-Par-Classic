import { registerRoute, navigate, currentRoute } from './router.js';
import { homeView, aboutView, newRoundView, rulesView, historyView, settingsView, renderRuleTab } from './views.js';
import { handleSetupClick, handleSetupInput } from './setup.js';
import { gameplayView, handleGameplayClick } from './gameplay.js';
import { resultsView } from './results.js';
import { weatherToolView, gpsToolView } from './tools.js';
import { getActiveRound } from './state.js';

registerRoute('home', homeView);
registerRoute('about', aboutView);
registerRoute('new-round', newRoundView);
registerRoute('round', gameplayView);
registerRoute('results', resultsView);
registerRoute('weather', weatherToolView);
registerRoute('gps', gpsToolView);
registerRoute('rules', rulesView);
registerRoute('history', historyView);
registerRoute('settings', settingsView);

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.addEventListener('click', (event) => {
  if (currentRoute() === 'new-round' && handleSetupClick(event.target, showToast)) return;
  if (currentRoute() === 'round' && handleGameplayClick(event.target, showToast)) return;

  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) { navigate(routeTarget.dataset.route); return; }

  const cheatToggle = event.target.closest('[data-cheat-toggle]');
  if (cheatToggle) { cheatToggle.closest('.cheat-item').classList.toggle('open'); return; }

  const tab = event.target.closest('[data-rule-tab]');
  if (tab) {
    document.querySelectorAll('[data-rule-tab]').forEach((btn) => btn.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('rulesContent').innerHTML = renderRuleTab(tab.dataset.ruleTab);
    return;
  }

  const demo = event.target.closest('[data-demo-toast]');
  if (demo) showToast(demo.dataset.demoToast);
});

document.addEventListener('input', (event) => {
  if (currentRoute() === 'new-round') handleSetupInput(event.target);
});

document.addEventListener('change', (event) => {
  if (currentRoute() === 'new-round') handleSetupInput(event.target);
});

window.addEventListener('hashchange', () => navigate(currentRoute()));

const initialRoute = currentRoute();
if (initialRoute === 'home' && getActiveRound()) {
  navigate('round');
} else {
  navigate(initialRoute);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
