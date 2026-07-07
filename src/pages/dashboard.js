import { store } from '../core/store.js';
import { fbSignOut } from '../core/firebase.js';
import { LocationModal } from '../components/location-modal.js';

export default class DashboardPage {
  constructor(params = {}) {
    this.params = params;
    this.checkLocation = this.checkLocation.bind(this);
  }

  async render() {
    const state = store.getState();
    const user = state.user;
    const name = user ? user.name : 'Guest';
    
    // Format saved address
    const address = state.savedAddress 
      ? `${state.savedAddress.home}, ${state.savedAddress.street}` 
      : 'Select your location';

    return `
      <div class="app-view-container">
        <!-- Header -->
        <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center; background-color: var(--color-surface); z-index: 10; position: sticky; top: 0;">
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">SERVICE AT</span>
            <button id="btn-select-location" style="display: flex; align-items: center; gap: 4px; background: none; border: none; padding: 0; margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--color-text-primary); cursor: pointer;">
              <span style="color: var(--color-success); font-size: 1.2rem; margin-right: 2px;">•</span>
              <span style="max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${address}</span>
              <i data-lucide="chevron-down" style="width: 16px; height: 16px; color: var(--color-text-secondary);"></i>
            </button>
          </div>
          <button id="btn-logout" style="background: var(--color-input-bg); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;">
            <i data-lucide="log-out" style="width: 20px; height: 20px; color: var(--color-text-primary);"></i>
          </button>
        </div>

        <div style="padding: 0 16px 80px 16px;">
          <!-- Welcome Message -->
          <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; color: var(--color-text-primary);">
            Welcome back, ${name}
          </h1>

          <!-- Service Grid -->
          <div class="service-grid-2col">
            <!-- Card 1 -->
            <a href="#/category/construction" class="service-card-square" style="text-decoration: none; color: inherit;">
              <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; width: 100%;">Construction &<br>Renovation</h3>
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span class="badge badge-blue" style="font-size: 0.6rem;">COMMERCIAL</span>
                <span class="badge badge-blue" style="font-size: 0.6rem;">RESIDENTIAL</span>
              </div>
              <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #FF6B2B, #FF8F5E); display: flex; align-items: center; justify-content: center; margin-top: auto;">
                <i data-lucide="hammer" style="width: 36px; height: 36px; color: white;"></i>
              </div>
            </a>

            <!-- Card 2 -->
            <a href="#/category/electrical" class="service-card-square" style="text-decoration: none; color: inherit;">
              <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; width: 100%;">Electrical<br>Work</h3>
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span class="badge badge-blue" style="font-size: 0.6rem;">INDUSTRIAL</span>
                <span class="badge badge-blue" style="font-size: 0.6rem;">SOLAR</span>
              </div>
              <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #FFB800, #FFD54F); display: flex; align-items: center; justify-content: center; margin-top: auto;">
                <i data-lucide="zap" style="width: 36px; height: 36px; color: white;"></i>
              </div>
            </a>
            
            <!-- Card 3 -->
            <a href="#/category/facility" class="service-card-square" style="text-decoration: none; color: inherit;">
              <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; width: 100%;">Facility<br>Management</h3>
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span class="badge badge-red" style="font-size: 0.6rem;">FURNISHED</span>
              </div>
              <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #0066FF, #4D94FF); display: flex; align-items: center; justify-content: center; margin-top: auto;">
                <i data-lucide="wrench" style="width: 36px; height: 36px; color: white;"></i>
              </div>
            </a>

            <!-- Card 4 -->
            <a href="#/subscription" class="service-card-square" style="text-decoration: none; color: inherit;">
              <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; width: 100%;">Maintained by<br>Fast Eng</h3>
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span class="badge badge-blue" style="font-size: 0.6rem;">SUBSCRIPTION PLANS</span>
              </div>
              <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #10B981, #34D399); display: flex; align-items: center; justify-content: center; margin-top: auto;">
                <i data-lucide="settings" style="width: 36px; height: 36px; color: white;"></i>
              </div>
            </a>
          </div>
          
          <!-- Banner -->
          <div class="card" style="margin-top: 24px; padding: 0; overflow: hidden; display: flex; align-items: center; border: 1px solid var(--color-surface-border);">
            <div style="padding: 20px; flex: 1;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Fast for Business</h3>
              <div class="badge badge-blue" style="margin-bottom: 12px;">Your Corporate Maintenance Partner</div>
            </div>
            <div style="width: 100px; height: 100px; background-color: var(--color-accent-blue-tint); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="briefcase" style="width: 48px; height: 48px; color: var(--color-primary);"></i>
            </div>
          </div>
          
          <!-- Help Section -->
          <div style="margin-top: 24px; display: flex; align-items: center; gap: 16px; padding: 16px; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-surface-border);">
            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: var(--color-input-bg); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="info" style="width: 20px; height: 20px; color: var(--color-text-primary);"></i>
            </div>
            <div>
              <h4 style="font-weight: 600; font-size: 1rem;">Get Help</h4>
              <p style="font-size: 0.85rem; color: var(--color-text-tertiary);">Talk to support (+92 300 4545280)</p>
            </div>
          </div>

        </div>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav-bar">
          <button class="nav-item is-active" onclick="window.location.hash='#/dashboard'">
            <i data-lucide="home"></i>
            <span>Home</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/orders'">
            <i data-lucide="list"></i>
            <span>Orders</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/messages'">
            <i data-lucide="message-square"></i>
            <span>Messages</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/wallet'">
            <i data-lucide="wallet"></i>
            <span>Wallet</span>
          </button>
        </nav>
      </div>
    `;
  }

  afterRender() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    document.getElementById('btn-select-location').addEventListener('click', () => {
      this.checkLocation(true);
    });

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fbSignOut();
          window.location.hash = '#/auth';
        } catch (error) {
          console.error("Logout failed", error);
        }
      });
    }

    // Check location on load if not set
    this.checkLocation(false);
  }
  
  checkLocation(force = false) {
    const state = store.getState();
    if (force || !state.location || !state.savedAddress) {
      const modal = new LocationModal((locationData, addressData) => {
        if (locationData) store.setState('location', locationData);
        if (addressData) {
          store.setState('savedAddress', addressData);
          // Reload view to show new address
          window.location.reload();
        }
      });
      modal.show();
    }
  }

  destroy() {
    // Cleanup if necessary
  }
}
