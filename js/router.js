const routes = new Map();

export function registerRoute(name, render) {
  routes.set(name, render);
}

export function navigate(name, options = {}) {
  const render = routes.get(name) || routes.get('home');
  history.replaceState({}, '', `#${name}`);

  document.querySelectorAll('[data-route]').forEach((el) => {
    el.classList.toggle('active', el.dataset.route === name);
  });

  const app = document.getElementById('app');
  app.innerHTML = render(options);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.dispatchEvent(new CustomEvent('route:rendered', { detail: { name } }));
}

export function currentRoute() {
  return location.hash.replace('#', '') || 'home';
}
