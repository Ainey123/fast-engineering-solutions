// Page 7: Alerts & Notification Repository
import { router } from '../core/router.js';
import { store } from '../core/store.js';
import { formatRelativeTime } from '../core/utils.js';

export default class NotificationsPage {
  constructor(params = {}) {
    this.params = params;
  }

  async render() {
    const state = store.getState();
    const notifications = state.notifications || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    return `
      <!-- Header with back button -->
      <header class="header-nav">
        <button id="btn-notify-back" class="theme-toggle-btn" style="color: var(--color-text-primary);">
          <i data-lucide="chevron-left" style="width: 24px; height: 24px;"></i>
        </button>
        <span class="header-title">Notifications</span>
        
        <!-- Mark all as read button -->
        ${unreadCount > 0 ? `
          <button id="btn-mark-read" style="background: none; border: none; color: var(--color-primary); font-size: 0.775rem; font-weight: 700; cursor: pointer; padding: 6px;">
            Mark Read
          </button>
        ` : '<div style="width: 50px;"></div>'}
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 80px;">
        
        ${notifications.length === 0 ? `
          <div style="text-align: center; padding: 64px 24px; color: var(--color-text-tertiary);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-surface-hover); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <i data-lucide="bell-off" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Inbox is Clear</h3>
            <p style="font-size: 0.85rem;">You do not have any pending structural, dispatch, or weather warnings.</p>
          </div>
        ` : `
          <!-- Notifications list wrapper -->
          <div id="notifications-list-wrapper" style="display: flex; flex-direction: column; gap: 12px;">
            ${notifications.map(notif => {
              // Notification icons based on status type
              let iconName = 'bell';
              let iconColor = 'var(--color-primary)';
              let iconBg = 'var(--color-accent-blue-tint)';

              if (notif.type === 'success') {
                iconName = 'check-circle';
                iconColor = 'var(--color-success)';
                iconBg = 'var(--color-accent-green-tint)';
              } else if (notif.type === 'warning') {
                iconName = 'alert-triangle';
                iconColor = 'var(--color-secondary-hover)';
                iconBg = 'var(--color-accent-amber-tint)';
              } else if (notif.type === 'danger') {
                iconName = 'zap';
                iconColor = 'var(--color-danger)';
                iconBg = 'var(--color-accent-red-tint)';
              }

              return `
                <div class="card notif-card-item ${!notif.read ? 'unread-state' : ''}" data-id="${notif.id}" style="padding: 14px 16px; position: relative; overflow: hidden; transition: all 0.3s ease; border-left: 4px solid ${!notif.read ? 'var(--color-primary)' : 'var(--color-surface-border)'}; display: flex; gap: 12px; align-items: flex-start;">
                  
                  <!-- Left side icon status -->
                  <div style="width: 38px; height: 38px; border-radius: var(--radius-sm); background-color: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                    <i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>
                  </div>

                  <!-- Notification message details -->
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                      <h3 style="font-size: 0.9rem; font-weight: 700; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${notif.title}
                      </h3>
                      <span style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 500; flex-shrink: 0; margin-top: 2px;">
                        ${formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>
                    <p style="font-size: 0.8rem; line-height: 1.4; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${notif.message}
                    </p>
                  </div>

                  <!-- Close/Swipe to dismiss handler -->
                  <button class="btn-dismiss-notif" data-id="${notif.id}" style="background: none; border: none; cursor: pointer; color: var(--color-text-tertiary); display: flex; align-items: center; justify-content: center; padding: 4px; margin-top: 2px;" title="Dismiss">
                    <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                  </button>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>

      <!-- Add specific styles for unread indicator -->
      <style>
        .unread-state {
          background-color: var(--color-input-focus) !important;
        }
      </style>
    `;
  }

  afterRender() {
    this.btnBack = document.getElementById('btn-notify-back');
    this.btnMarkRead = document.getElementById('btn-mark-read');
    
    // Back navigation -> returns to Dashboard
    this.btnBack.addEventListener('click', () => {
      router.navigate('#/dashboard');
    });

    // Mark all as read
    if (this.btnMarkRead) {
      this.btnMarkRead.addEventListener('click', () => {
        const state = store.getState();
        const updatedNotifs = (state.notifications || []).map(n => ({ ...n, read: true }));
        store.setState('notifications', updatedNotifs);
        router.handleRouting(); // Re-render view
      });
    }

    // Dismiss single notification with slide-out-left animation
    document.querySelectorAll('.btn-dismiss-notif').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const card = e.currentTarget.closest('.notif-card-item');
        
        // Add visual slide out animation
        card.style.animation = 'slide-out-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        
        setTimeout(() => {
          const state = store.getState();
          const updatedNotifs = (state.notifications || []).filter(n => n.id !== id);
          store.setState('notifications', updatedNotifs);
          router.handleRouting(); // Re-render view
        }, 300);
      });
    });

    // Mark single notification as read on click
    document.querySelectorAll('.notif-card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-dismiss-notif')) return;

        const id = card.getAttribute('data-id');
        const state = store.getState();
        const updatedNotifs = (state.notifications || []).map(n => {
          if (n.id === id) return { ...n, read: true };
          return n;
        });
        store.setState('notifications', updatedNotifs);
        router.handleRouting();
      });
    });
  }
}
