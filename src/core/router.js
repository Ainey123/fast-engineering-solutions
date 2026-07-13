// Client-side hash router with parameter extraction and role-based route guards
import { store } from './store.js';

class HashRouter {
  constructor() {
    this.routes = [];
    this.container = null;
    this.activeView = null;
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  register(path, pageComponent) {
    const regexPattern = path
      .replace(/\/:([^/]+)/g, '/([^/]+)')
      .replace(/\//g, '\\/');
    const paramNames = (path.match(/:([^/]+)/g) || []).map(p => p.slice(1));
    this.routes.push({
      path,
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
      component: pageComponent
    });
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Mount container #${containerId} not found.`);
      return;
    }
    this.handleRouting();
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRouting() {
    const fullHash = window.location.hash || '#/onboarding';
    const [hash, queryString] = fullHash.split('?');
    const urlSearch = queryString ? new URLSearchParams(queryString) : new URLSearchParams();
    const forceAuth = urlSearch.get('force') === 'true';
    const state = store.getState();

    // 1. Must complete onboarding first
    if (!state.onboardingComplete && hash !== '#/onboarding') {
      this.navigate('#/onboarding');
      return;
    }

    // 2. Wait for Firebase auth to resolve
    if (!state.authInitialized && state.onboardingComplete) {
      if (this.container) {
        this.container.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;">
            <div style="width:40px;height:40px;border:3px solid var(--color-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
            <div style="color:var(--color-text-tertiary);font-weight:600;font-size:0.9rem;">Connecting securely...</div>
          </div>`;
      }
      const unsub = store.subscribe('authInitialized', (isInit) => {
        if (isInit) { unsub(); this.handleRouting(); }
      });
      return;
    }

    // 3. Not logged in — must go to auth
    if (state.onboardingComplete && !state.user && hash !== '#/auth' && hash !== '#/onboarding') {
      this.navigate('#/auth');
      return;
    }

    // 4. Logged-in user trying to access auth/onboarding again
    // Allow an explicit override: `#/auth?force=true` will show the auth page even if user is logged-in.
    if (state.user && (hash === '#/auth' || hash === '#/onboarding')) {
      if (hash === '#/auth' && forceAuth) {
        // allow visiting the auth page explicitly (useful for testing or re-auth flows)
      } else {
        this.navigate(state.userRole === 'admin' ? '#/admin/dashboard' : '#/dashboard');
        return;
      }
    }

    // 5. CLIENT trying to access admin pages — block immediately
    if (state.user && state.userRole === 'client' && hash.startsWith('#/admin')) {
      this.navigate('#/dashboard');
      return;
    }

    // 6. ADMIN trying to access client pages — redirect to admin dashboard
    if (state.user && state.userRole === 'admin' && !hash.startsWith('#/admin') && hash !== '#/auth' && hash !== '#/onboarding') {
      this.navigate('#/admin/dashboard');
      return;
    }

    // Route Aliases
    if (hash === '#/orders') {
      this.navigate('#/bookings');
      return;
    }
    if (hash === '#/messages') {
      this.navigate('#/support');
      return;
    }
    if (hash === '#/wallet') {
      this.navigate('#/profile');
      return;
    }

    // Route matching
    let match = null;
    let matchedRoute = null;
    for (const route of this.routes) {
      match = hash.match(route.regex);
      if (match) { matchedRoute = route; break; }
    }

    if (!matchedRoute) {
      console.warn(`Route ${hash} not found.`);
      this.navigate(state.userRole === 'admin' ? '#/admin/dashboard' : '#/dashboard');
      return;
    }

    const params = {};
    if (matchedRoute.paramNames.length > 0 && match) {
      matchedRoute.paramNames.forEach((name, index) => {
        params[name] = decodeURIComponent(match[index + 1]);
      });
    }
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      for (const [key, value] of queryParams.entries()) params[key] = value;
    }

    this.mount(matchedRoute.component, params);
  }

  async mount(PageComponent, params) {
    if (this.activeView && typeof this.activeView.destroy === 'function') {
      this.activeView.destroy();
    }

    const viewInstance = new PageComponent(params);
    this.activeView = viewInstance;

    this.container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;"><div style="width:32px;height:32px;border:3px solid var(--color-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div></div>`;

    try {
      const htmlContent = await viewInstance.render();
      this.container.innerHTML = htmlContent;

      if (typeof viewInstance.afterRender === 'function') {
        viewInstance.afterRender();
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (err) {
      console.error('Render error:', err);
      this.container.innerHTML = `
        <div style="padding:40px;text-align:center;">
          <h3 style="color:var(--color-danger)">Render Error</h3>
          <p style="font-size:0.85rem;margin:8px 0 20px;">${err.message}</p>
          <button class="btn btn-primary" onclick="location.hash='#/dashboard'">Back to Home</button>
        </div>`;
    }
  }
}

export const router = new HashRouter();
export default router;
