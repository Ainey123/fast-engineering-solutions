// Admin Bookings - All service requests from all clients
import { router } from '../../core/router.js';
import { db } from '../../core/firebase.js';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';

export default class AdminBookingsPage {
  constructor(params = {}) {
    this.params = params;
    this.bookings = [];
    this.filter = 'all';
  }

  async render() {
    try {
      const snap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')));
      this.bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Bookings fetch error:', e);
    }

    return `
      <!-- Header -->
      <header class="header-nav">
        <div style="display:flex;align-items:center;gap:10px;">
          <button id="admin-back" style="background:none;border:none;cursor:pointer;color:var(--color-text-primary);padding:4px;">
            <i data-lucide="arrow-left" style="width:22px;height:22px;"></i>
          </button>
          <div>
            <div style="font-size:0.7rem;color:var(--color-text-tertiary);font-weight:600;text-transform:uppercase;">Admin</div>
            <h1 style="font-size:1rem;font-weight:800;">All Bookings</h1>
          </div>
        </div>
        <div style="font-size:0.8rem;font-weight:700;background:var(--color-accent-blue-tint);color:var(--color-primary);padding:4px 10px;border-radius:20px;">${this.bookings.length} total</div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding:16px 16px 32px;">
        
        <!-- Filter Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px;">
          ${['all','pending','in-progress','completed'].map(f => `
            <button class="filter-tab ${this.filter === f ? 'active' : ''}" data-filter="${f}" 
              style="flex-shrink:0;padding:6px 14px;border-radius:20px;border:1px solid var(--color-surface-border);background:${this.filter === f ? 'var(--color-primary)' : 'var(--color-surface)'};color:${this.filter === f ? 'white' : 'var(--color-text-secondary)'};font-size:0.775rem;font-weight:600;cursor:pointer;text-transform:capitalize;">
              ${f}
            </button>`).join('')}
        </div>

        <!-- Bookings List -->
        <div id="bookings-list">
          ${this.renderBookingsList(this.bookings)}
        </div>
      </div>
    `;
  }

  renderBookingsList(bookings) {
    const filtered = this.filter === 'all' ? bookings : bookings.filter(b => b.status === this.filter);
    
    if (filtered.length === 0) {
      return `<div style="text-align:center;padding:48px 24px;color:var(--color-text-tertiary);">
        <i data-lucide="inbox" style="width:40px;height:40px;margin-bottom:12px;opacity:0.4;"></i>
        <div style="font-weight:600;">No bookings found</div>
      </div>`;
    }

    return filtered.map(b => {
      const statusColor = b.status === 'completed' ? 'var(--color-success)' : b.status === 'in-progress' ? 'var(--color-primary)' : b.status === 'pending' ? 'var(--color-secondary)' : 'var(--color-text-tertiary)';
      const date = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' }) : 'N/A';
      return `
        <div class="card" style="margin-bottom:10px;padding:14px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
            <div>
              <div style="font-weight:700;font-size:0.9rem;">${b.serviceTitle || 'Service Request'}</div>
              <div style="font-size:0.75rem;color:var(--color-text-tertiary);margin-top:2px;">${date} · ${b.clientName || b.clientEmail || 'Client'}</div>
            </div>
            <span style="font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:20px;background:${statusColor}20;color:${statusColor};text-transform:capitalize;white-space:nowrap;">
              ${b.status || 'pending'}
            </span>
          </div>
          ${b.notes ? `<div style="font-size:0.8rem;color:var(--color-text-secondary);margin-bottom:10px;padding:8px;background:var(--color-bg-page);border-radius:8px;">"${b.notes}"</div>` : ''}
          <!-- Status Update Buttons -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="update-status" data-id="${b.id}" data-status="pending" 
              style="flex:1;min-width:70px;padding:6px;border-radius:8px;border:1px solid var(--color-surface-border);background:${b.status==='pending'?'var(--color-secondary)':'var(--color-surface)'};color:${b.status==='pending'?'white':'var(--color-text-secondary)'};font-size:0.725rem;font-weight:600;cursor:pointer;">
              Pending
            </button>
            <button class="update-status" data-id="${b.id}" data-status="in-progress"
              style="flex:1;min-width:70px;padding:6px;border-radius:8px;border:1px solid var(--color-surface-border);background:${b.status==='in-progress'?'var(--color-primary)':'var(--color-surface)'};color:${b.status==='in-progress'?'white':'var(--color-text-secondary)'};font-size:0.725rem;font-weight:600;cursor:pointer;">
              In Progress
            </button>
            <button class="update-status" data-id="${b.id}" data-status="completed"
              style="flex:1;min-width:70px;padding:6px;border-radius:8px;border:1px solid var(--color-surface-border);background:${b.status==='completed'?'var(--color-success)':'var(--color-surface)'};color:${b.status==='completed'?'white':'var(--color-text-secondary)'};font-size:0.725rem;font-weight:600;cursor:pointer;">
              Completed
            </button>
          </div>
        </div>`;
    }).join('');
  }

  afterRender() {
    document.getElementById('admin-back')?.addEventListener('click', () => router.navigate('#/admin/dashboard'));

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.filter = e.currentTarget.getAttribute('data-filter');
        const list = document.getElementById('bookings-list');
        if (list) list.innerHTML = this.renderBookingsList(this.bookings);
        if (window.lucide) window.lucide.createIcons();
        document.querySelectorAll('.filter-tab').forEach(t => {
          const isActive = t.getAttribute('data-filter') === this.filter;
          t.style.background = isActive ? 'var(--color-primary)' : 'var(--color-surface)';
          t.style.color = isActive ? 'white' : 'var(--color-text-secondary)';
          this.bindStatusButtons();
        });
      });
    });

    this.bindStatusButtons();
  }

  bindStatusButtons() {
    document.querySelectorAll('.update-status').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const bookingId = e.currentTarget.getAttribute('data-id');
        const newStatus = e.currentTarget.getAttribute('data-status');
        btn.textContent = 'Saving...';
        try {
          await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
          const idx = this.bookings.findIndex(b => b.id === bookingId);
          if (idx !== -1) this.bookings[idx].status = newStatus;
          const list = document.getElementById('bookings-list');
          if (list) list.innerHTML = this.renderBookingsList(this.bookings);
          if (window.lucide) window.lucide.createIcons();
          this.bindStatusButtons();
        } catch (err) {
          alert('Update failed: ' + err.message);
          btn.textContent = newStatus;
        }
      });
    });
  }
}
