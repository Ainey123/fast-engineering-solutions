// Admin Clients - All registered users
import { router } from '../../core/router.js';
import { db } from '../../core/firebase.js';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export default class AdminClientsPage {
  constructor(params = {}) {
    this.params = params;
    this.clients = [];
  }

  async render() {
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
      this.clients = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.role !== 'admin');
    } catch (e) {
      console.warn('Clients fetch error:', e);
    }

    return `
      <header class="header-nav">
        <div style="display:flex;align-items:center;gap:10px;">
          <button id="admin-back" style="background:none;border:none;cursor:pointer;color:var(--color-text-primary);padding:4px;">
            <i data-lucide="arrow-left" style="width:22px;height:22px;"></i>
          </button>
          <div>
            <div style="font-size:0.7rem;color:var(--color-text-tertiary);font-weight:600;text-transform:uppercase;">Admin</div>
            <h1 style="font-size:1rem;font-weight:800;">All Clients</h1>
          </div>
        </div>
        <div style="font-size:0.8rem;font-weight:700;background:rgba(88,86,214,0.1);color:#5856D6;padding:4px 10px;border-radius:20px;">${this.clients.length} users</div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding:16px 16px 32px;">

        ${this.clients.length === 0 ? `
          <div style="text-align:center;padding:60px 24px;color:var(--color-text-tertiary);">
            <i data-lucide="users" style="width:48px;height:48px;margin-bottom:16px;opacity:0.3;"></i>
            <div style="font-weight:600;font-size:1rem;">No clients registered yet</div>
            <div style="font-size:0.85rem;margin-top:6px;">Users who sign up will appear here</div>
          </div>` :
          this.clients.map(client => {
            const initial = (client.name || client.email || '?').charAt(0).toUpperCase();
            const date = client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' }) : 'Unknown';
            return `
              <div class="card" style="margin-bottom:10px;padding:14px;display:flex;align-items:center;gap:12px;">
                <!-- Avatar -->
                <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#5856D6);color:white;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;flex-shrink:0;">
                  ${initial}
                </div>
                <!-- Info -->
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${client.name || 'No Name'}</div>
                  <div style="font-size:0.75rem;color:var(--color-text-tertiary);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${client.email || 'No Email'}</div>
                  <div style="font-size:0.7rem;color:var(--color-text-tertiary);margin-top:2px;">Joined: ${date}</div>
                </div>
                <!-- Contact Button -->
                ${client.phone ? `
                  <a href="tel:${client.phone}" style="flex-shrink:0;width:36px;height:36px;background:var(--color-accent-blue-tint);color:var(--color-primary);border-radius:8px;display:flex;align-items:center;justify-content:center;text-decoration:none;">
                    <i data-lucide="phone" style="width:16px;height:16px;"></i>
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
