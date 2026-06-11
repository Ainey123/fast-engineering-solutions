// Page 4: Dynamic Workflow Explainer Page
import { router } from '../core/router.js';
import { getServiceById } from '../data/services.js';

export default class ServiceExplainerPage {
  constructor(params = {}) {
    this.params = params;
    this.service = getServiceById(params.id);
  }

  async render() {
    if (!this.service) {
      throw new Error(`Service ID "${this.params.id}" is invalid.`);
    }

    // Unsplash imagery mappings
    const imageMap = {
      construction: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80',
      maintenance: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      facility: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      emergency: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=600&auto=format&fit=crop&q=80'
    };
    
    const bannerUrl = imageMap[this.service.id] || imageMap.construction;

    return `
      <!-- Back Navigation Header -->
      <div style="position: absolute; top: 16px; left: 16px; z-index: 10; display: flex; gap: 8px;">
        <button id="btn-back-dashboard" class="active-press" style="width: 40px; height: 40px; border-radius: var(--radius-full); background-color: var(--color-surface); color: var(--color-text-primary); border: 1px solid var(--color-surface-border); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); cursor: pointer;">
          <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
        </button>
      </div>

      <!-- Scroll container -->
      <div class="app-view-container no-scrollbar" id="service-scroll-container" style="padding-bottom: 96px;">
        
        <!-- Parallax Header Image Banner -->
        <div class="parallax-header" style="height: 240px; position: relative; overflow: hidden; transform-origin: top; background-color: #1A1D20;">
          <img id="parallax-img" src="${bannerUrl}" alt="${this.service.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.1s linear;">
          <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, var(--color-bg-page) 98%);"></div>
        </div>

        <!-- Content Area -->
        <div style="padding: 20px; position: relative; margin-top: -24px; border-radius: var(--radius-lg) var(--radius-lg) 0 0; background-color: var(--color-bg-page);">
          
          <!-- Category Badge & Service Title -->
          <div style="margin-bottom: 12px;">
            <span class="badge ${this.service.badgeColor}" style="margin-bottom: 8px;">
              ${this.service.isEmergency ? 'Critical Dispatched' : 'Standard Service'}
            </span>
            <h1 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em;">${this.service.title}</h1>
          </div>

          <!-- Description -->
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 28px; color: var(--color-text-secondary);">
            ${this.service.longDesc}
          </p>

          <!-- Stepper Pipeline Header -->
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="route" style="color: var(--color-primary); width: 22px; height: 22px;"></i>
            Execution Pipeline
          </h2>

          <!-- Vertical Stepper Component -->
          <div class="vertical-stepper" style="position: relative; padding-left: 36px;">
            <!-- Connector Line -->
            <div style="position: absolute; left: 15px; top: 12px; bottom: 32px; width: 3px; background: linear-gradient(to bottom, var(--color-primary) 0%, var(--color-input-border) 80%); border-radius: var(--radius-full);"></div>
            
            <!-- Step Items -->
            ${this.service.steps.map((step, idx) => `
              <div class="stepper-item" style="position: relative; margin-bottom: 28px;">
                <!-- Bullet icon badge -->
                <div style="position: absolute; left: -36px; top: 0; width: 32px; height: 32px; border-radius: var(--radius-full); background-color: ${idx === 0 ? 'var(--color-primary)' : 'var(--color-surface)'}; border: 3px solid ${idx === 0 ? 'var(--color-primary)' : 'var(--color-input-border)'}; display: flex; align-items: center; justify-content: center; font-size: 0.775rem; font-weight: 800; color: ${idx === 0 ? 'white' : 'var(--color-text-tertiary)'}; box-shadow: var(--shadow-sm); z-index: 2;">
                  ${step.num}
                </div>
                <!-- Step description text -->
                <div style="padding-left: 12px;">
                  <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; color: ${idx === 0 ? 'var(--color-primary)' : 'var(--color-text-primary)'};">${step.name}</h3>
                  <p style="font-size: 0.825rem; line-height: 1.4; color: var(--color-text-secondary);">${step.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
      </div>

      <!-- Sticky Dual Action Buttons at Bottom -->
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: var(--color-nav-bg); border-top: 1px solid var(--color-nav-border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 16px; display: flex; gap: 12px; z-index: 100;">
        <button id="btn-whatsapp" class="btn btn-outline active-press" style="flex: 1; border-color: #25D366; color: #25D366; font-size: 0.9rem; padding: 14px 12px; background-color: transparent;">
          <i data-lucide="message-square" style="width: 18px; height: 18px;"></i> WhatsApp
        </button>
        <button id="btn-book-now" class="btn btn-primary active-press" style="flex: 2; font-size: 0.9rem; padding: 14px;">
          Book Service <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
        </button>
      </div>
    `;
  }

  afterRender() {
    this.btnBack = document.getElementById('btn-back-dashboard');
    this.btnBook = document.getElementById('btn-book-now');
    this.btnWhatsapp = document.getElementById('btn-whatsapp');
    this.scrollContainer = document.getElementById('service-scroll-container');
    this.parallaxImg = document.getElementById('parallax-img');

    // Back to dashboard
    this.btnBack.addEventListener('click', () => {
      router.navigate('#/dashboard');
    });

    // Book service button -> goes to Wizard form with service preset
    this.btnBook.addEventListener('click', () => {
      router.navigate(`#/booking?service=${this.service.id}`);
    });

    // WhatsApp Direct Action
    this.btnWhatsapp.addEventListener('click', () => {
      const waNumber = '923004545280'; // Provided WhatsApp hotline number
      const waText = encodeURIComponent(`Hello Fast Engineering Solutions. I would like to query about the "${this.service.title}" service.`);
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    });

    // Parallax scrolling computation
    if (this.scrollContainer && this.parallaxImg) {
      this.scrollContainer.addEventListener('scroll', () => {
        const scrollTop = this.scrollContainer.scrollTop;
        if (scrollTop >= 0) {
          // Slow down the rate of image offset translation
          this.parallaxImg.style.transform = `translateY(${scrollTop * 0.4}px)`;
        }
      }, { passive: true });
    }
  }
}
