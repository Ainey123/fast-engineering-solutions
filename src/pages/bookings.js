// Page 6: Real-Time Project Progress Tracker
import { router } from '../core/router.js';
import { store } from '../core/store.js';
import { getInitialBookings } from '../data/bookings.js';

export default class BookingsTrackerPage {
  constructor(params = {}) {
    this.params = params;
    this.expandedBookingId = null;
  }

  async render() {
    const state = store.getState();
    
    // Set default bookings if not present
    if (!state.bookings) {
      store.setState('bookings', getInitialBookings());
    }

    const bookings = store.getState().bookings;
    
    // Default to expanding the first booking if none selected
    if (!this.expandedBookingId && bookings.length > 0) {
      this.expandedBookingId = bookings[0].id;
    }

    const statusSteps = ['Approved', 'Dispatched', 'In Progress', 'Completed'];

    return `
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div> <!-- Spacer -->
        <span class="header-title">My Bookings</span>
        <button id="bookings-theme-toggle" class="theme-toggle-btn">
          <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}"></i>
        </button>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        ${bookings.length === 0 ? `
          <div style="text-align: center; padding: 48px 24px; color: var(--color-text-tertiary);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-surface-hover); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <i data-lucide="calendar-x" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">No Bookings Found</h3>
            <p style="font-size: 0.85rem; margin-bottom: 24px;">You have not logged any engineering service requests yet.</p>
            <button class="btn btn-primary" onclick="location.hash='#/booking'">Book A Service Now</button>
          </div>
        ` : `
          <!-- Bookings List -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${bookings.map(booking => {
              const isExpanded = this.expandedBookingId === booking.id;
              
              // Calculate status classes
              const badgeClass = booking.status === 'Completed' ? 'badge-green' : 
                                 booking.status === 'In Progress' ? 'badge-blue' :
                                 booking.status === 'Dispatched' ? 'badge-amber' : 'badge-blue';

              // Calculate active progress width
              const progressPercentage = (booking.statusIndex / (statusSteps.length - 1)) * 100;

              return `
                <div class="card booking-card" data-id="${booking.id}" style="padding: 16px; cursor: pointer; border-color: ${isExpanded ? 'var(--color-primary)' : 'var(--color-surface-border)'};">
                  
                  <!-- Card Header -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${isExpanded ? '16px' : '0'}; transition: margin var(--transition-fast) ease;">
                    <div>
                      <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase;">
                        Job Ref: ${booking.id}
                      </div>
                      <h3 style="font-size: 1rem; font-weight: 700; margin-top: 2px;">
                        ${booking.serviceName}
                      </h3>
                    </div>
                    <span class="badge ${badgeClass}">${booking.status}</span>
                  </div>

                  ${!isExpanded ? `
                    <!-- Collapsed Footer Summary -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--color-surface-border); font-size: 0.775rem; color: var(--color-text-secondary);">
                      <span>Date: ${booking.date}</span>
                      <span style="font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 2px;">
                        Track Details <i data-lucide="chevron-down" style="width: 14px; height: 14px;"></i>
                      </span>
                    </div>
                  ` : `
                    <!-- Expanded Details Area -->
                    <div class="expanded-booking-details" style="animation: fade-in 0.3s ease;">
                      
                      <!-- Logistics Info Grid -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.8rem; background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-md); margin-bottom: 20px;">
                        <div>
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">DATE & TIME</div>
                          <div style="font-weight: 600; margin-top: 2px;">${booking.date} @ ${booking.time}</div>
                        </div>
                        <div>
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">CONTACT</div>
                          <div style="font-weight: 600; margin-top: 2px;">${booking.clientName}</div>
                        </div>
                        <div style="grid-column: span 2;">
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">SITE ADDRESS</div>
                          <div style="font-weight: 600; margin-top: 2px; line-height: 1.3;">${booking.location}</div>
                        </div>
                      </div>

                      <!-- State-driven Progress Tracker Stepper -->
                      <div style="margin-bottom: 24px;">
                        <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 16px;">Job Dispatch Status</h4>
                        
                        <div class="linear-stepper">
                          <!-- Filled line progress track -->
                          <div class="linear-stepper-progress" style="width: ${progressPercentage}%;"></div>
                          
                          <!-- Step node bubbles -->
                          ${statusSteps.map((stepName, stepIdx) => {
                            const isCompleted = stepIdx < booking.statusIndex;
                            const isActive = stepIdx === booking.statusIndex;
                            
                            let stepStateClass = '';
                            if (isCompleted) stepStateClass = 'is-completed';
                            else if (isActive) stepStateClass = 'is-active';

                            return `
                              <div class="linear-step ${stepStateClass}">
                                <div class="linear-step-indicator">
                                  ${isCompleted ? '<i data-lucide="check" style="width:14px;height:14px;stroke-width:3;"></i>' : stepIdx + 1}
                                </div>
                                <span class="linear-step-label">${stepName}</span>
                              </div>
                            `;
                          }).join('')}
                        </div>
                      </div>

                      <!-- Assigned Engineer Card -->
                      ${booking.engineer ? `
                        <div class="card" style="padding: 12px; background-color: var(--color-surface-hover); border-color: var(--color-surface-border); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${booking.engineer.avatar}" alt="${booking.engineer.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary);">
                            <div>
                              <div style="font-size: 0.85rem; font-weight: 700;">${booking.engineer.name}</div>
                              <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 500;">${booking.engineer.role}</div>
                            </div>
                          </div>
                          <!-- Call to Dial button -->
                          <a href="tel:${booking.engineer.phone}" class="btn btn-primary active-press btn-sm" style="width: auto; padding: 10px 14px; border-radius: var(--radius-full);">
                            <i data-lucide="phone" style="width: 14px; height: 14px;"></i> Dial
                          </a>
                        </div>
                      ` : ''}

                      <div style="text-align: center; margin-top: 16px; font-size: 0.75rem; color: var(--color-text-tertiary);">
                        Tap cards to collapse or view other bookings.
                      </div>

                    </div>
                  `}

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item is-active" data-route="#/bookings">
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
    this.themeToggle = document.getElementById('bookings-theme-toggle');
    this.bookingCards = document.querySelectorAll('.booking-card');

    // Theme Switcher
    this.themeToggle.addEventListener('click', () => {
      store.toggleTheme();
      const nextIcon = store.getState().theme === 'light' ? 'moon' : 'sun';
      this.themeToggle.innerHTML = `<i data-lucide="${nextIcon}"></i>`;
      window.lucide.createIcons();
    });

    // Toggle card expansion
    this.bookingCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent expansion toggle when clicking the "Dial" button inside
        if (e.target.closest('a') || e.target.closest('button')) return;

        const bookingId = card.getAttribute('data-id');
        if (this.expandedBookingId === bookingId) {
          this.expandedBookingId = null; // collapse
        } else {
          this.expandedBookingId = bookingId; // expand
        }

        // Re-route to force re-render with state change
        router.handleRouting();
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
}
