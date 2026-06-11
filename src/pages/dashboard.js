// Page 3: Smart Services Dashboard (Main Application Hub)
import { router } from '../core/router.js';
import { store } from '../core/store.js';
import { services } from '../data/services.js';
import { getInitialNotifications } from '../data/notifications.js';

export default class DashboardPage {
  constructor(params = {}) {
    this.params = params;
    this.activePromo = 0;
    this.promoCount = 3;
  }

  async render() {
    const state = store.getState();
    const userName = state.user ? state.user.name : 'Valued Client';
    
    // Set default notifications if not set
    if (!state.notifications) {
      store.setState('notifications', getInitialNotifications());
    }
    const unreadCount = (store.getState().notifications || []).filter(n => !n.read).length;

    // Greeting based on time
    const hour = new Date().getHours();
    let greeting = 'Hello';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    return `
      <!-- Header Area -->
      <header class="header-nav">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: var(--radius-full); background-color: var(--color-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; border: 2px solid var(--color-surface-border);">
            ${userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 600;">${greeting}</div>
            <div style="font-size: 0.95rem; font-weight: 700; letter-spacing: -0.015em;">${userName}</div>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Theme Toggle -->
          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
            <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}"></i>
          </button>
          
          <!-- Notifications Bell -->
          <button id="btn-notifications" style="position: relative; background: none; border: none; cursor: pointer; padding: 8px; color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); transition: background-color var(--transition-fast) ease;">
            <i data-lucide="bell" style="width: 22px; height: 22px;"></i>
            ${unreadCount > 0 ? `
              <span style="position: absolute; top: 4px; right: 4px; background-color: var(--color-danger); color: white; font-size: 0.65rem; font-weight: 700; width: 16px; height: 16px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-surface);">
                ${unreadCount}
              </span>
            ` : ''}
          </button>
        </div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Interactive Promo Discount Area -->
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px; border: none; box-shadow: var(--shadow-md); position: relative; height: 140px;">
          <div id="promo-track" style="display: flex; width: 300%; height: 100%; transition: transform 0.5s ease;">
            
            <!-- Promo 1 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-secondary); color: var(--color-text-on-secondary); font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">June Special</span>
                <h3 style="font-size: 1.15rem; color: #FFF; font-weight: 700; margin-bottom: 4px;">50% Off First Soil Test</h3>
                <p style="font-size: 0.775rem; color: rgba(255,255,255,0.85);">Ensure structural safety prior to laying layout maps and bricks.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; opacity: 0.9;">Code: SOIL50</div>
            </div>

            <!-- Promo 2 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #1A1D20 0%, #2D3446 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-danger); color: white; font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Monsoon Prep</span>
                <h3 style="font-size: 1.15rem; color: #FFF; font-weight: 700; margin-bottom: 4px;">Waterproofing — 20% Off</h3>
                <p style="font-size: 0.775rem; color: rgba(255,255,255,0.85);">Complete chemical roof leakage & wall dampness protection before rains.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; opacity: 0.9;">Code: RAIN20</div>
            </div>

            <!-- Promo 3 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #FFB000 0%, #E09B00 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-primary); color: white; font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Solar Audits</span>
                <h3 style="font-size: 1.15rem; color: var(--color-text-on-primary); font-weight: 700; margin-bottom: 4px;">Save 100k PKR On Solar</h3>
                <p style="font-size: 0.775rem; color: var(--color-text-on-primary); opacity: 0.9;">Sign up for industrial power analysis & commercial net metering today.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-on-primary);">Code: SOLARPOW</div>
            </div>

          </div>
          
          <!-- Promo Dots -->
          <div style="position: absolute; bottom: 12px; right: 16px; display: flex; gap: 6px;">
            <div class="promo-dot active" data-idx="0" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.9); transition: all 0.3s;"></div>
            <div class="promo-dot" data-idx="1" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.4); transition: all 0.3s;"></div>
            <div class="promo-dot" data-idx="2" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.4); transition: all 0.3s;"></div>
          </div>
        </div>

        <!-- Section Title -->
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.025em; display: flex; align-items: center; gap: 8px;">
            Engineering Services
            <span class="badge badge-blue" style="font-size:0.65rem; padding: 2px 6px;">Certified</span>
          </h2>
        </div>

        <!-- Services Grid -->
        <div class="services-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          
          <!-- Construction -->
          <div class="card active-press service-card-item" data-id="construction" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="wrench" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Construction & Renovation</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Build & upgrades</p>
            </div>
          </div>

          <!-- Maintenance -->
          <div class="card active-press service-card-item" data-id="maintenance" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-accent-amber-tint); color: var(--color-secondary-hover); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="settings" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Technical Maintenance</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Audits & repairs</p>
            </div>
          </div>

          <!-- Facility -->
          <div class="card active-press service-card-item" data-id="facility" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: rgba(88, 86, 214, 0.1); color: var(--color-info); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="activity" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Facility & Power</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Solar & generators</p>
            </div>
          </div>

          <!-- Emergency SOS -->
          <div class="card active-press service-card-item pulse-sos-btn" data-id="emergency" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border-color: rgba(255, 59, 48, 0.3); background-color: var(--color-accent-red-tint);">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-danger); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(255,59,48,0.3);">
              <i data-lucide="alert-triangle" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2; color: var(--color-danger);">Emergency SOS Repair</h3>
              <p style="font-size: 0.725rem; line-height: 1.3; color: var(--color-danger); font-weight: 500;">Critical hazard response</p>
            </div>
          </div>

        </div>

        <!-- Quick Summary Tracker Mini Banner -->
        <div id="mini-tracker-card" class="card active-press" style="cursor: pointer; padding: 14px 16px; display: flex; align-items: center; gap: 14px; background-color: var(--color-surface); border-left: 4px solid var(--color-primary);">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="package-search" style="width: 20px; height: 20px;"></i>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.75rem; color: var(--color-text-tertiary); font-weight: 600;">ACTIVE SERVICE TRACKER</div>
            <div style="font-size: 0.85rem; font-weight: 700;">Job #FES-9842 is In Progress</div>
          </div>
          <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: var(--color-text-tertiary);"></i>
        </div>

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item is-active" data-route="#/dashboard">
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
        <button class="nav-item" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `;
  }

  afterRender() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.btnNotifications = document.getElementById('btn-notifications');
    this.promoTrack = document.getElementById('promo-track');
    this.promoDots = document.querySelectorAll('.promo-dot');
    this.serviceCards = document.querySelectorAll('.service-card-item');
    this.miniTracker = document.getElementById('mini-tracker-card');
    
    // Theme Switcher
    this.themeToggle.addEventListener('click', () => {
      store.toggleTheme();
      const nextIcon = store.getState().theme === 'light' ? 'moon' : 'sun';
      this.themeToggle.innerHTML = `<i data-lucide="${nextIcon}"></i>`;
      window.lucide.createIcons();
    });

    // Notifications Link
    this.btnNotifications.addEventListener('click', () => {
      router.navigate('#/notifications');
    });

    // Quick Tracker Link
    if (this.miniTracker) {
      this.miniTracker.addEventListener('click', () => {
        router.navigate('#/bookings');
      });
    }

    // Service Card Grid Clicks
    this.serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const serviceId = e.currentTarget.getAttribute('data-id');
        router.navigate(`#/service/${serviceId}`);
      });
    });

    // Auto Promo Carousel Rotate
    this.promoInterval = setInterval(() => {
      this.activePromo = (this.activePromo + 1) % this.promoCount;
      this.updatePromoSlide();
    }, 4000);

    // Support Swipe for promo slides
    this.promoDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        clearInterval(this.promoInterval);
        const idx = parseInt(e.target.getAttribute('data-idx'));
        this.activePromo = idx;
        this.updatePromoSlide();
      });
    });

    // Bottom Navigation Handlers
    document.querySelectorAll('.bottom-nav-bar .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const route = e.currentTarget.getAttribute('data-route');
        router.navigate(route);
      });
    });
  }

  updatePromoSlide() {
    if (this.promoTrack) {
      this.promoTrack.style.transform = `translateX(-${this.activePromo * 33.333}%)`;
    }
    this.promoDots.forEach((dot, idx) => {
      if (idx === this.activePromo) {
        dot.classList.add('active');
        dot.style.backgroundColor = 'rgba(255,255,255,0.9)';
        dot.style.width = '12px';
      } else {
        dot.classList.remove('active');
        dot.style.backgroundColor = 'rgba(255,255,255,0.4)';
        dot.style.width = '6px';
      }
    });
  }

  destroy() {
    if (this.promoInterval) {
      clearInterval(this.promoInterval);
    }
  }
}
