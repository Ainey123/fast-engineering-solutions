// Admin Dashboard - Overview Statistics
import { router } from '../../core/router.js';
import { store } from '../../core/store.js';
import { db } from '../../core/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default class AdminDashboardPage {
  constructor(params = {}) {
    this.params = params;
    this.stats = { totalUsers: 0, totalBookings: 0, pendingBookings: 0, emergencyAlerts: 0 };
  }

  async render() {
    // Fetch all stats
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      this.stats.totalUsers = usersSnap.size;

      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      this.stats.totalBookings = bookingsSnap.size;

      const pendingSnap = await getDocs(query(collection(db, 'bookings'), where('status', '==', 'pending')));
      this.stats.pendingBookings = pendingSnap.size;

      const sosSnap = await getDocs(query(collection(db, 'bookings'), where('serviceId', '==', 'emergency')));
      this.stats.emergencyAlerts = sosSnap.size;
    } catch (e) {
      console.warn('Stats fetch error:', e);
    }

    const state = store.getState();
    const adminName = state.user?.name || 'Admin';

    return `
      <!-- Admin Header -->
      <div style="background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); padding: 24px 20px 20px; color: white;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <div>
            <div style="font-size:0.75rem;opacity:0.8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Admin Portal</div>
            <h1 style="font-size:1.35rem;font-weight:800;color:white;margin-top:2px;">Welcome, ${adminName} 👋</h1>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="admin-logout" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:600;">
              <i data-lucide="log-out" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i>Logout
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:12px;padding:14px;">
            <div style="font-size:0.7rem;opacity:0.85;font-weight:600;text-transform:uppercase;">Total Clients</div>
            <div style="font-size:2rem;font-weight:800;margin-top:2px;">${this.stats.totalUsers}</div>
          </div>
          <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:12px;padding:14px;">
            <div style="font-size:0.7rem;opacity:0.85;font-weight:600;text-transform:uppercase;">Total Bookings</div>
            <div style="font-size:2rem;font-weight:800;margin-top:2px;">${this.stats.totalBookings}</div>
          </div>
          <div style="background:rgba(255,180,0,0.3);backdrop-filter:blur(10px);border-radius:12px;padding:14px;border:1px solid rgba(255,200,0,0.4);">
            <div style="font-size:0.7rem;opacity:0.85;font-weight:600;text-transform:uppercase;">Pending</div>
            <div style="font-size:2rem;font-weight:800;margin-top:2px;">${this.stats.pendingBookings}</div>
          </div>
          <div style="background:rgba(255,59,48,0.3);backdrop-filter:blur(10px);border-radius:12px;padding:14px;border:1px solid rgba(255,59,48,0.4);">
            <div style="font-size:0.7rem;opacity:0.85;font-weight:600;text-transform:uppercase;">SOS Alerts</div>
            <div style="font-size:2rem;font-weight:800;margin-top:2px;">${this.stats.emergencyAlerts}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tiles -->
      <div class="app-view-container no-scrollbar" style="padding:20px 16px 32px;">
        <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;">Manage</h2>

        <div style="display:flex;flex-direction:column;gap:12px;">

          <div class="card active-press admin-nav-btn" data-route="#/admin/bookings" style="padding:16px;cursor:pointer;display:flex;align-items:center;gap:14px;border-left:4px solid var(--color-primary);">
            <div style="width:44px;height:44px;border-radius:10px;background:var(--color-accent-blue-tint);color:var(--color-primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="clipboard-list" style="width:22px;height:22px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:0.95rem;">All Bookings</div>
              <div style="font-size:0.775rem;color:var(--color-text-tertiary);margin-top:2px;">View & manage every service request</div>
            </div>
            <i data-lucide="chevron-right" style="width:18px;height:18px;color:var(--color-text-tertiary);"></i>
          </div>

          <div class="card active-press admin-nav-btn" data-route="#/admin/clients" style="padding:16px;cursor:pointer;display:flex;align-items:center;gap:14px;border-left:4px solid #5856D6;">
            <div style="width:44px;height:44px;border-radius:10px;background:rgba(88,86,214,0.1);color:#5856D6;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="users" style="width:22px;height:22px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:0.95rem;">All Clients</div>
              <div style="font-size:0.775rem;color:var(--color-text-tertiary);margin-top:2px;">Registered users & contact info</div>
            </div>
            <i data-lucide="chevron-right" style="width:18px;height:18px;color:var(--color-text-tertiary);"></i>
          </div>

          <div class="card active-press admin-nav-btn" data-route="#/admin/alerts" style="padding:16px;cursor:pointer;display:flex;align-items:center;gap:14px;border-left:4px solid var(--color-danger);">
            <div style="width:44px;height:44px;border-radius:10px;background:var(--color-accent-red-tint);color:var(--color-danger);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="siren" style="width:22px;height:22px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:0.95rem;color:var(--color-danger);">Emergency SOS Alerts</div>
              <div style="font-size:0.775rem;color:var(--color-text-tertiary);margin-top:2px;">${this.stats.emergencyAlerts} active emergency request(s)</div>
            </div>
            <i data-lucide="chevron-right" style="width:18px;height:18px;color:var(--color-text-tertiary);"></i>
          </div>

        </div>

        <!-- Quick Firebase Info -->
        <div style="margin-top:24px;padding:14px;border-radius:12px;background:var(--color-surface);border:1px dashed var(--color-surface-border);">
          <div style="font-size:0.75rem;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Connected Database</div>
          <div style="font-size:0.85rem;font-weight:600;">🔥 Firebase Firestore</div>
          <div style="font-size:0.75rem;color:var(--color-text-tertiary);margin-top:2px;">fast-engineering-28b8b · Live & Secure</div>
        </div>
      </div>
    `;
  }

  afterRender() {
    // Logout
    document.getElementById('admin-logout')?.addEventListener('click', async () => {
      try {
        await store.logout();
      } catch (e) {
        console.warn('Logout failed:', e);
      }
      router.navigate('#/auth');
    });

    // Nav tiles
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = e.currentTarget.getAttribute('data-route');
        router.navigate(route);
      });
    });
  }
}
