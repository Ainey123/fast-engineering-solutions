// Page: Technical Support & Help Center
import { router } from '../core/router.js';
import { store } from '../core/store.js';

export default class SupportPage {
  constructor(params = {}) {
    this.params = params;
    this.activeFaq = null;
  }

  async render() {
    const state = store.getState();
    const faqs = [
      { q: 'How long does a site inspection take?', a: 'Standard engineering site inspection takes 2-4 hours. A certified surveyor reviews structural designs and checks for land load ratings.' },
      { q: 'What is included in the digital quote?', a: 'You receive an itemized bill of materials (BOM), project timelines, engineering layout maps, and government authority approval costs.' },
      { q: 'Can I reschedule an approved booking?', a: 'Yes. Tap your booking card under "My Bookings" and contact your assigned engineer or call operations directly.' },
      { q: 'Are solar energy reports net-metering ready?', a: 'Absolutely. All facility energy and solar PV arrays audits comply with local power distribution board guidelines for net metering integration.' }
    ];

    return `
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div>
        <span class="header-title">Technical Support</span>
        <button id="support-theme-toggle" class="theme-toggle-btn">
          <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}"></i>
        </button>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Fast Engineering Details Banner -->
        <div class="card" style="margin-bottom: 24px; padding: 16px; background-color: var(--color-surface-hover); border: 1px solid var(--color-primary); position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05;">
            <i data-lucide="settings" style="width: 100px; height: 100px;"></i>
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; color: var(--color-primary); margin-bottom: 6px;">Fast Engineering Solutions</h2>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4; margin-bottom: 12px;">
            Located in Lahore, we provide comprehensive construction, electrical, and facility management services. We handle everything from designing and building commercial/residential spaces to emergency electrical repairs.
          </p>
          <div style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-tertiary); margin-bottom: 4px;">KEY SERVICES:</div>
          <ul style="font-size: 0.8rem; color: var(--color-text-secondary); padding-left: 16px; margin: 0 0 12px 0;">
            <li style="margin-bottom: 4px;"><b>Construction & Renovation:</b> Banks, villas, commercial complexes, warehouses.</li>
            <li style="margin-bottom: 4px;"><b>Electrical Work:</b> Industrial/commercial electrification, solar/generator integration.</li>
            <li><b>Facility Management:</b> Furnished workspaces, cafe management, security products.</li>
          </ul>
        </div>

        <!-- Contact Action Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          
          <!-- Call hotline card -->
          <a href="tel:+923004545280" class="card active-press" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="phone" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 style="font-size: 0.85rem; font-weight: 700;">Voice Hotline</h3>
              <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 2px;">+92 300 4545280</p>
            </div>
          </a>

          <!-- WhatsApp hotline card -->
          <button id="btn-support-wa" class="card active-press" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 16px; background: none; border: 1px solid var(--color-surface-border); width: 100%;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: rgba(37, 211, 102, 0.1); color: #25D366; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="message-square" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 style="font-size: 0.85rem; font-weight: 700;">WhatsApp</h3>
              <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 2px;">+92 326 4545222</p>
            </div>
          </button>
          
          <!-- Gmail card -->
          <a href="mailto:fastsales.services@gmail.com" class="card active-press" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 16px; grid-column: span 2;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: rgba(234, 67, 53, 0.1); color: #EA4335; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="mail" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 style="font-size: 0.85rem; font-weight: 700;">Email Support</h3>
              <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 2px;">fastsales.services@gmail.com</p>
            </div>
          </a>

        </div>

        <!-- Section Title -->
        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em;">Frequently Asked Questions</h2>

        <!-- FAQ List -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${faqs.map((faq, idx) => {
            const isExpanded = this.activeFaq === idx;
            return `
              <div class="card faq-card-item" data-idx="${idx}" style="padding: 16px; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                  <h3 style="font-size: 0.9rem; font-weight: 700; line-height: 1.3;">${faq.q}</h3>
                  <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" style="width: 18px; height: 18px; color: var(--color-text-tertiary); flex-shrink: 0;"></i>
                </div>
                ${isExpanded ? `
                  <p style="font-size: 0.8rem; line-height: 1.4; color: var(--color-text-secondary); margin-top: 10px; border-top: 1px dashed var(--color-surface-border); padding-top: 10px; animation: fade-in 0.25s ease;">
                    ${faq.a}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

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
        <button class="nav-item is-active" data-route="#/support">
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
    this.themeToggle = document.getElementById('support-theme-toggle');
    this.faqCards = document.querySelectorAll('.faq-card-item');
    this.btnSupportWa = document.getElementById('btn-support-wa');

    // Theme Switcher
    this.themeToggle.addEventListener('click', () => {
      store.toggleTheme();
      const nextIcon = store.getState().theme === 'light' ? 'moon' : 'sun';
      this.themeToggle.innerHTML = `<i data-lucide="${nextIcon}"></i>`;
      window.lucide.createIcons();
    });

    // Toggle FAQ display
    this.faqCards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx'));
        if (this.activeFaq === idx) {
          this.activeFaq = null;
        } else {
          this.activeFaq = idx;
        }
        router.handleRouting(); // trigger re-render
      });
    });

    // WhatsApp Desk Click
    this.btnSupportWa.addEventListener('click', () => {
      const waNumber = '923264545222';
      const text = encodeURIComponent('Hi Fast Engineering Support, I need assistance regarding an ongoing project.');
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
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
