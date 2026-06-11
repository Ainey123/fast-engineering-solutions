// Page: User Profile Settings
import { router } from '../core/router.js';
import { store } from '../core/store.js';

export default class ProfilePage {
  constructor(params = {}) {
    this.params = params;
  }

  async render() {
    const state = store.getState();
    const userName = state.user ? state.user.name : 'Valued Client';
    const userEmail = state.user ? state.user.email : 'client@domain.com';
    const isDark = state.theme === 'dark';

    return `
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div>
        <span class="header-title">My Profile</span>
        <div style="width: 40px;"></div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Profile Banner -->
        <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-bottom: 24px; padding: 24px 16px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 800; border: 4px solid var(--color-surface-border); box-shadow: var(--shadow-sm);">
            ${userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">${userName}</h2>
            <p style="font-size: 0.8rem; color: var(--color-text-tertiary); margin-top: 2px;">FES-ID: #M-${Math.floor(1000 + Math.random() * 9000)}</p>
          </div>
        </div>

        <!-- Settings Cards Group -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: 12px; padding-left: 4px;">Account Settings</h3>
        
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
          <!-- Profile details row -->
          <div style="padding: 14px 16px; border-bottom: 1px solid var(--color-surface-border); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <i data-lucide="mail" style="color: var(--color-text-tertiary); width: 18px; height: 18px;"></i>
              <span style="font-size: 0.875rem; font-weight: 500;">Email Address</span>
            </div>
            <span style="font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 600;">${userEmail}</span>
          </div>

          <!-- Light/Dark Mode switch row -->
          <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <i data-lucide="${isDark ? 'moon' : 'sun'}" style="color: var(--color-text-tertiary); width: 18px; height: 18px;"></i>
              <span style="font-size: 0.875rem; font-weight: 500;">Dark Theme</span>
            </div>
            <!-- Toggle Slider Switch -->
            <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
              <input type="checkbox" id="profile-theme-switch" ${isDark ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
              <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-input-border); transition: .3s; border-radius: 34px;"></span>
            </label>
          </div>
        </div>

        <!-- Support Info Group -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: 12px; padding-left: 4px;">System Information</h3>
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 32px;">
          <div style="padding: 14px 16px; border-bottom: 1px solid var(--color-surface-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <span style="font-weight: 500;">App Version</span>
            <span style="color: var(--color-text-tertiary); font-weight: 600;">v1.0.0 (Production)</span>
          </div>
          <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <span style="font-weight: 500;">PWA Status</span>
            <span style="color: var(--color-success); font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Active
            </span>
          </div>
        </div>

        <!-- Log Out Button -->
        <button id="btn-logout" class="btn btn-outline active-press" style="color: var(--color-danger); border-color: var(--color-danger); background: transparent; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="log-out" style="width: 18px; height: 18px;"></i> Sign Out
        </button>

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item" data-route="#/bookings">
          <i data-lucide="calendar"></i>
          <span>Bookings</span>
        </button>
        <button class="nav-item" data-route="#/support">
          <i data-lucide="phone"></i>
          <span>Support</span>
        </button>
        <button class="nav-item is-active" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>

      <!-- Toggle Switcher Custom Styles -->
      <style>
        .switch-toggle input:checked + .slider {
          background-color: var(--color-primary);
        }
        .switch-toggle .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        .switch-toggle input:checked + .slider:before {
          transform: translateX(20px);
        }
      </style>
    `;
  }

  afterRender() {
    this.themeSwitch = document.getElementById('profile-theme-switch');
    this.btnLogout = document.getElementById('btn-logout');

    // Theme Switch Slider Event
    this.themeSwitch.addEventListener('change', () => {
      store.toggleTheme();
      router.handleRouting(); // Re-render profile view to apply changes
    });

    // Session log out
    this.btnLogout.addEventListener('click', () => {
      store.logout();
      router.navigate('#/auth');
    });

    // Bottom Navigation Handlers
    document.querySelectorAll('.bottom-nav-bar .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const route = e.currentTarget.getAttribute('data-route');
        router.navigate(route);
      });
    });
  }
}
