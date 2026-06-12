// Admin Alerts - Emergency SOS requests
import { router } from '../../core/router.js';
import { db } from '../../core/firebase.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default class AdminAlertsPage {
  constructor(params = {}) {
    this.params = params;
    this.alerts = [];
  }

  async render() {
    try {
      const snap = await getDocs(query(
        collection(db, 'bookings'),
        where('serviceId', '==', 'emergency'),
        orderBy('createdAt', 'desc')
      ));
      this.alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Alerts fetch error:', e);
    }

    return `
      <header class="header-nav" style="border-bottom-color:rgba(255,59,48,0.2);">
        <div style="display:flex;align-items:center;gap:10px;">
          <button id="admin-back" style="background:none;border:none;cursor:pointer;color:var(--color-text-primary);padding:4px;">
            <i data-lucide="arrow-left" style="width:22px;height:22px;"></i>
          </button>
          <div>
            <div style="font-size:0.7rem;color:var(--color-danger);font-weight:700;text-transform:uppercase;">⚠ Emergency</div>
            <h1 style="font-size:1rem;font-weight:800;">SOS Alerts</h1>
          </div>
        </div>
        <div style="font-size:0.8rem;font-weight:700;background:var(--color-accent-red-tint);color:var(--color-danger);padding:4px 10px;border-radius:20px;">${this.alerts.length} alerts</div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding:16px 16px 32px;">

        ${this.alerts.length === 0 ? `
          <div style="text-align:center;padding:60px 24px;color:var(--color-text-tertiary);">
            <i data-lucide="shield-check" style="width:48px;height:48px;margin-bottom:16px;opacity:0.3;color:var(--color-success);"></i>
            <div style="font-weight:600;font-size:1rem;color:var(--color-success);">No Active Emergencies</div>
            <div style="font-size:0.85rem;margin-top:6px;">All clear! Emergency requests will appear here.</div>
          </div>` :
          this.alerts.map(alert => {
            const date = alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-PK') : 'Unknown';
            const statusColor = alert.status === 'completed' ? 'var(--color-success)' : alert.status === 'in-progress' ? 'var(--color-primary)' : 'var(--color-danger)';
            return `
              <div class="card" style="margin-bottom:12px;padding:16px;border:1px solid rgba(255,59,48,0.25);border-left:4px solid var(--color-danger);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:36px;height:36px;background:var(--color-danger);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                      <i data-lucide="alert-triangle" style="width:18px;height:18px;color:white;"></i>
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:0.9rem;color:var(--color-danger);">Emergency SOS</div>
                      <div style="font-size:0.7rem;color:var(--color-text-tertiary);">${date}</div>
                    </div>
                  </div>
                  <span style="font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:20px;background:${statusColor}20;color:${statusColor};text-transform:capitalize;">
                    ${alert.status || 'pending'}
                  </span>
                </div>

                <!-- Client Info -->
                <div style="background:var(--color-bg-page);border-radius:8px;padding:10px;margin-bottom:10px;">
                  <div style="font-size:0.775rem;font-weight:700;margin-bottom:6px;color:var(--color-text-secondary);">CLIENT DETAILS</div>
                  <div style="font-size:0.85rem;font-weight:600;">${alert.clientName || 'Unknown'}</div>
                  <div style="font-size:0.775rem;color:var(--color-text-tertiary);margin-top:2px;">${alert.clientEmail || 'No email'}</div>
                  ${alert.clientPhone ? `<div style="font-size:0.775rem;color:var(--color-primary);margin-top:2px;font-weight:600;">📞 ${alert.clientPhone}</div>` : ''}
                  ${alert.address ? `<div style="font-size:0.775rem;color:var(--color-text-tertiary);margin-top:2px;">📍 ${alert.address}</div>` : ''}
                </div>

                ${alert.notes ? `<div style="font-size:0.8rem;color:var(--color-text-secondary);margin-bottom:10px;padding:8px;background:var(--color-surface);border-radius:8px;border-left:3px solid var(--color-danger);">"${alert.notes}"</div>` : ''}

                <!-- Call Button -->
                ${alert.clientPhone ? `
                  <a href="tel:${alert.clientPhone}" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:var(--color-danger);color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.875rem;">
                    <i data-lucide="phone-call" style="width:16px;height:16px;"></i>
                    Call Client Now
                  </a>` : ''}
              </div>`;
          }).join('')
        }
      </div>
    `;
  }

  afterRender() {
    document.getElementById('admin-back')?.addEventListener('click', () => router.navigate('#/admin/dashboard'));
  }
}
