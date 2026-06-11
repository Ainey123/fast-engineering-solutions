// Page 1: Intro Onboarding Carousel Component
import { router } from '../core/router.js';
import { store } from '../core/store.js';

export default class OnboardingPage {
  constructor(params = {}) {
    this.params = params;
    this.currentSlide = 0;
    this.totalSlides = 3;
    
    // Swipe gesture variables
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
  }

  async render() {
    return `
      <div class="app-view-container no-scrollbar" style="padding-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
        <!-- Top Theme Toggle -->
        <div style="display: flex; justify-content: flex-end; padding: 16px;">
          <button id="onboarding-theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
            <i data-lucide="${store.getState().theme === 'light' ? 'moon' : 'sun'}"></i>
          </button>
        </div>

        <!-- Carousel track -->
        <div class="carousel-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; position: relative; user-select: none;">
          <div class="carousel-track" id="carousel-track" style="display: flex; width: 300%; height: 75%; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: grab;">
            
            <!-- Slide 1 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-blue-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-primary);">
                <i data-lucide="building-2" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">Smart Construction</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Design-build civil execution managed by expert structural engineers with absolute budget assurance.</p>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-amber-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-secondary-hover);">
                <i data-lucide="phone-call" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">24/7 Tech Support</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Emergency dispatch and electrical/HVAC maintenance teams standing by round the clock.</p>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-green-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-success);">
                <i data-lucide="map-pin" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">Live Tracking</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Track material dispatch, site inspections, and engineer execution states in real-time.</p>
            </div>

          </div>
        </div>

        <!-- Carousel Controls & Dots -->
        <div style="padding: 24px 32px 48px;">
          <!-- Indicators -->
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 40px;">
            <div class="carousel-dot active" data-index="0" style="width: 24px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-primary); transition: all 0.3s ease; cursor: pointer;"></div>
            <div class="carousel-dot" data-index="1" style="width: 8px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-input-border); transition: all 0.3s ease; cursor: pointer;"></div>
            <div class="carousel-dot" data-index="2" style="width: 8px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-input-border); transition: all 0.3s ease; cursor: pointer;"></div>
          </div>

          <!-- Dual buttons -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <button id="btn-skip" class="btn btn-outline active-press" style="flex: 1; border: none; padding: 14px;">Skip</button>
            <button id="btn-next" class="btn btn-primary active-press" style="flex: 1.5; padding: 14px;">Next</button>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.track = document.getElementById('carousel-track');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.btnNext = document.getElementById('btn-next');
    this.btnSkip = document.getElementById('btn-skip');
    this.themeToggle = document.getElementById('onboarding-theme-toggle');

    // Attach theme toggle
    this.themeToggle.addEventListener('click', () => {
      store.toggleTheme();
      const nextIcon = store.getState().theme === 'light' ? 'moon' : 'sun';
      this.themeToggle.innerHTML = `<i data-lucide="${nextIcon}"></i>`;
      window.lucide.createIcons();
    });

    // Carousel buttons
    this.btnNext.addEventListener('click', () => this.nextSlide());
    this.btnSkip.addEventListener('click', () => this.completeOnboarding());

    // Swipe gestures
    this.track.addEventListener('touchstart', (e) => this.touchStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.touchMove(e), { passive: true });
    this.track.addEventListener('touchend', () => this.touchEnd());

    this.track.addEventListener('mousedown', (e) => this.dragStart(e));
    window.addEventListener('mousemove', (e) => this.dragMove(e));
    window.addEventListener('mouseup', () => this.dragEnd());

    // Click on dots
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
      });
    });

    // Auto-advance slide setup
    this.autoSlideInterval = setInterval(() => {
      if (this.currentSlide < this.totalSlides - 1) {
        this.nextSlide();
      } else {
        this.goToSlide(0);
      }
    }, 5000);
  }

  destroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  touchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
    clearInterval(this.autoSlideInterval); // Stop auto slide on user interaction
  }

  touchMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.touches[0].clientX;
  }

  touchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const deltaX = this.startX - this.currentX;
    
    if (deltaX > 50) {
      this.nextSlide();
    } else if (deltaX < -50) {
      this.prevSlide();
    }
  }

  dragStart(e) {
    this.startX = e.clientX;
    this.isDragging = true;
    this.track.style.cursor = 'grabbing';
    clearInterval(this.autoSlideInterval);
  }

  dragMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track.style.cursor = 'grab';
    const deltaX = this.startX - this.currentX;
    
    if (deltaX > 50) {
      this.nextSlide();
    } else if (deltaX < -50) {
      this.prevSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    } else {
      this.completeOnboarding();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    this.currentSlide = index;
    if (this.track) {
      this.track.style.transform = `translateX(-${index * 33.333}%)`;
    }

    // Update Dots
    this.dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        dot.style.width = '24px';
        dot.style.backgroundColor = 'var(--color-primary)';
      } else {
        dot.classList.remove('active');
        dot.style.width = '8px';
        dot.style.backgroundColor = 'var(--color-input-border)';
      }
    });

    // Update Next button label on final slide
    if (this.btnNext) {
      if (index === this.totalSlides - 1) {
        this.btnNext.innerHTML = 'Get Started <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>';
      } else {
        this.btnNext.innerHTML = 'Next';
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }

  completeOnboarding() {
    store.setState('onboardingComplete', true);
    router.navigate('#/auth');
  }
}
