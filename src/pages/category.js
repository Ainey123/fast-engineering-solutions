export default class CategoryPage {
  constructor(params = {}) {
    this.params = params;
    this.categoryId = params.id || 'construction';
    
    this.categories = {
      'construction': {
        title: 'Construction & Civil',
        bannerText: 'Build Your Future With Us',
        bannerStats: '500+ Projects Delivered',
        trending: [
          { name: 'Commercial Construction', price: 'Contact Us', oldPrice: '' },
          { name: 'Residential Villas', price: 'Contact Us', oldPrice: '' }
        ],
        services: [
          { name: 'Architecture', icon: 'pen-tool' },
          { name: 'Renovation', icon: 'hammer' },
          { name: 'Interior', icon: 'layout' }
        ]
      },
      'electrical': {
        title: 'Electrical Work',
        bannerText: 'Powering Your Success',
        bannerStats: '1000+ Installations',
        trending: [
          { name: 'AC Installation', price: 'Rs. 3000', oldPrice: 'Rs. 5100' },
          { name: 'Solar Panels', price: 'Contact Us', oldPrice: '' }
        ],
        services: [
          { name: 'AC Services', icon: 'wind' },
          { name: 'Electrician', icon: 'zap' },
          { name: 'Generators', icon: 'battery-charging' }
        ]
      },
      'facility': {
        title: 'Facility Management',
        bannerText: 'Seamless Operations',
        bannerStats: '320+ Happy Subscribers',
        trending: [
          { name: 'Security Solutions', price: 'Custom', oldPrice: '' },
          { name: 'Cafe Management', price: 'Custom', oldPrice: '' }
        ],
        services: [
          { name: 'Cleaning', icon: 'droplets' },
          { name: 'Plumbing', icon: 'wrench' },
          { name: 'Supplies', icon: 'package' }
        ]
      }
    };
  }

  async render() {
    const data = this.categories[this.categoryId] || this.categories['construction'];
    
    return `
      <div class="app-view-container" style="background-color: var(--color-background);">
        <!-- Header -->
        <div style="padding: 16px; display: flex; align-items: center; justify-content: space-between; background-color: var(--color-surface); position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--color-surface-border);">
          <button onclick="window.history.back()" style="background: none; border: none; cursor: pointer; display: flex; align-items: center;">
            <i data-lucide="chevron-left" style="width: 28px; height: 28px; color: var(--color-text-primary);"></i>
          </button>
          <h2 style="font-size: 1.15rem; font-weight: 600;">${data.title}</h2>
          <div style="display: flex; gap: 16px;">
            <i data-lucide="phone" style="width: 24px; height: 24px; color: var(--color-primary);"></i>
            <i data-lucide="bell" style="width: 24px; height: 24px; color: var(--color-text-secondary);"></i>
          </div>
        </div>

        <!-- Search Bar -->
        <div style="padding: 16px; background-color: var(--color-surface);">
          <div style="position: relative;">
            <i data-lucide="search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--color-text-tertiary);"></i>
            <input type="text" placeholder="Search" style="width: 100%; padding: 12px 16px 12px 48px; border-radius: 24px; border: 1px solid var(--color-surface-border); background-color: var(--color-input-bg); font-size: 1rem;">
          </div>
        </div>

        <div style="padding: 0 0 80px 0;">
          <!-- Promotional Banner -->
          <div style="background-color: var(--color-primary); color: white; padding: 24px 20px; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; margin-bottom: 24px; position: relative; overflow: hidden;">
            <div style="font-size: 0.85rem; font-weight: 600; opacity: 0.9; margin-bottom: 4px;">The Moment Your Name Becomes a Solution</div>
            <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px;">You Won.</h1>
            <div style="display: flex; gap: 24px;">
              <div>
                <div style="font-weight: 800; font-size: 1.25rem;">450K+</div>
                <div style="font-size: 0.75rem; opacity: 0.9; line-height: 1.2;">Happy<br>Customers</div>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 1.25rem;">${data.bannerStats.split(' ')[0]}</div>
                <div style="font-size: 0.75rem; opacity: 0.9; line-height: 1.2;">${data.bannerStats.split(' ').slice(1).join('<br>')}</div>
              </div>
            </div>
            
            <!-- Phone overlay graphic -->
            <div style="position: absolute; right: 10px; top: 10px; width: 120px; height: 180px; background-color: white; border-radius: 20px; padding: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); transform: rotate(5deg);">
               <div style="width: 100%; height: 100%; background-color: var(--color-background); border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden; position: relative;">
                  <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 12px; background-color: black; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"></div>
                  <div style="padding: 16px 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                     <div style="height: 30px; background-color: var(--color-primary); border-radius: 4px; opacity: 0.2;"></div>
                     <div style="height: 30px; background-color: var(--color-primary); border-radius: 4px; opacity: 0.2;"></div>
                     <div style="height: 30px; background-color: var(--color-danger); border-radius: 4px; opacity: 0.2;"></div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Trending Services -->
          <div style="padding: 0 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="font-size: 1.15rem; font-weight: 600;">Trending Services</h2>
              <button style="background: black; color: white; border: none; border-radius: 16px; padding: 6px 12px; font-size: 0.75rem; font-weight: 600;">View All</button>
            </div>
            
            <div class="horizontal-scroll">
              ${data.trending.map(t => `
                <div class="trending-card">
                  <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px;">${t.name}</h3>
                  <div style="display: flex; gap: 8px; margin-bottom: 24px;">
                    <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;"><i data-lucide="star" style="width: 12px; height: 12px; fill: white;"></i> 4.4</span>
                  </div>
                  <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: auto; min-height: 40px;">Professional service execution.</div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px;">
                    ${t.oldPrice ? `<span style="text-decoration: line-through; opacity: 0.7; font-size: 0.9rem;">${t.oldPrice}</span>` : '<span></span>'}
                    <span style="font-size: 1.1rem; font-weight: 700;">${t.price}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- All Services Grid -->
          <div style="padding: 24px 16px;">
            <h2 style="font-size: 1.15rem; font-weight: 600; margin-bottom: 16px;">All Services</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              ${data.services.map(s => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;">
                  <div style="width: 100%; aspect-ratio: 1; background-color: var(--color-surface); border: 1px solid var(--color-surface-border); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
                    <i data-lucide="${s.icon}" style="width: 32px; height: 32px; color: var(--color-primary);"></i>
                  </div>
                  <span style="font-size: 0.8rem; font-weight: 500; text-align: center;">${s.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav-bar">
          <button class="nav-item" onclick="window.location.hash='#/dashboard'">
            <i data-lucide="home"></i>
            <span>Home</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/orders'">
            <i data-lucide="list"></i>
            <span>Orders</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/messages'">
            <i data-lucide="message-square"></i>
            <span>Messages</span>
          </button>
          <button class="nav-item" onclick="window.location.hash='#/wallet'">
            <i data-lucide="wallet"></i>
            <span>Wallet</span>
          </button>
        </nav>
      </div>
    `;
  }

  afterRender() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  destroy() {
    // Cleanup if necessary
  }
}
