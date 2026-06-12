// Client-side hash router with parameter extraction and route guards
import { store } from './store.js';

class HashRouter {
  constructor() {
    this.routes = [];
    this.container = null;
    this.activeView = null;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  // Register route paths with their pages
  register(path, pageComponent) {
    // Convert route placeholder (e.g. /service/:id) to regex
    const regexPattern = path
      .replace(/\/:([^/]+)/g, '/([^/]+)') // Convert :param to capture group
      .replace(/\//g, '\\/');           // Escape slashes
    
    // Find parameter names
    const paramNames = (path.match(/:([^/]+)/g) || []).map(p => p.slice(1));

    this.routes.push({
      path,
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
      component: pageComponent
    });
  }

  // Set the mount element container
  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Mount container #${containerId} not found.`);
      return;
    }
    // Route on initial load
    this.handleRouting();
  }

  // Force programmatically navigating to a path
  navigate(path) {
    window.location.hash = path;
  }

  // Main routing dispatcher
  handleRouting() {
    const fullHash = window.location.hash || '#/onboarding';
    
    // Split the path and query parameters
    const [hash, queryString] = fullHash.split('?');
    const state = store.getState();

    // 1. ROUTE GUARDS: Check authentication and onboarding status
    if (!state.onboardingComplete && hash !== '#/onboarding') {
      // Must complete onboarding first
      this.navigate('#/onboarding');
      return;
    }

    if (!state.authInitialized && state.onboardingComplete) {
      // Wait for Firebase to determine auth state
      if (this.container) {
        this.container.innerHTML = `<div class="app-view-container no-scrollbar" style="display:flex;align-items:center;justify-content:center;height:100vh;"><div style="color:var(--color-text-tertiary);font-weight:600;">Authenticating...</div></div>`;
      }
      const unsub = store.subscribe('authInitialized', (isInit) => {
        if (isInit) {
          unsub();
          this.handleRouting();
        }
      });
      return;
    }

    if (state.onboardingComplete && !state.user && hash !== '#/auth' && hash !== '#/onboarding') {
      // Must be authenticated to access app
      this.navigate('#/auth');
      return;
    }

    if (state.user && (hash === '#/auth' || hash === '#/onboarding')) {
      // Authenticated users shouldn't go back to auth/onboarding
      this.navigate('#/dashboard');
      return;
    }

    // 2. ROUTE MATCHING
    let match = null;
    let matchedRoute = null;

    for (const route of this.routes) {
      match = hash.match(route.regex);
      if (match) {
        matchedRoute = route;
        break;
      }
    }

    // Fallback if route not found
    if (!matchedRoute) {
      console.warn(`Route ${hash} not found. Fallback to dashboard.`);
      this.navigate('#/dashboard');
      return;
    }

    // 3. EXTRACT PARAMETERS
    const params = {};
    if (matchedRoute.paramNames.length > 0 && match) {
      matchedRoute.paramNames.forEach((name, index) => {
        params[name] = decodeURIComponent(match[index + 1]);
      });
    }

    // Extract query parameters
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      for (const [key, value] of queryParams.entries()) {
        params[key] = value;
      }
    }

    // 4. MOUNT VIEW
    this.mount(matchedRoute.component, params);
  }

  // Destroy old view event listeners and mount new view
  async mount(PageComponent, params) {
    // Clean up current view if it has a destroy hook
    if (this.activeView && typeof this.activeView.destroy === 'function') {
      this.activeView.destroy();
    }

    // Create page instance
    const viewInstance = new PageComponent(params);
    this.activeView = viewInstance;

    // Render loading indicator (optional skeleton)
    this.container.innerHTML = `<div class="app-view-container animate-fade-in no-scrollbar"><div style="padding: 40px; text-align: center; color: var(--color-text-tertiary);">Loading...</div></div>`;

    // Fetch view HTML
    try {
      const htmlContent = await viewInstance.render();
      
      // Inject view and trigger enter animation
      this.container.innerHTML = htmlContent;
      
      // Run view post-render lifecycle hook (for binding event listeners)
      if (typeof viewInstance.afterRender === 'function') {
        viewInstance.afterRender();
      }

      // Re-trigger Lucide Icons if loaded
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

    } catch (err) {
      console.error('Render error:', err);
      this.container.innerHTML = `
        <div class="app-view-container" style="padding: 40px; text-align: center;">
          <h3 style="color: var(--color-danger)">Render Error</h3>
          <p>${err.message}</p>
          <button class="btn btn-primary" style="margin-top: 20px" onclick="location.hash='#/dashboard'">Back to Home</button>
        </div>
      `;
    }
  }
}

export const router = new HashRouter();
export default router;
