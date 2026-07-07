export class LocationModal {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.container = document.createElement('div');
    this.container.className = 'modal-overlay';
    document.body.appendChild(this.container);
    
    // Bind methods
    this.renderPermissionModal = this.renderPermissionModal.bind(this);
    this.renderAddressModal = this.renderAddressModal.bind(this);
    this.close = this.close.bind(this);
  }

  show() {
    this.renderPermissionModal();
    // Allow DOM to update before adding show class for transition
    requestAnimationFrame(() => {
      this.container.classList.add('show');
    });
  }

  close() {
    this.container.classList.remove('show');
    setTimeout(() => {
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }, 300);
  }

  renderPermissionModal() {
    this.container.innerHTML = `
      <div class="bottom-sheet" style="text-align: center; max-height: 90vh; overflow-y: auto;">
        <div style="margin-bottom: 24px;">
          <i data-lucide="map-pin" style="width: 32px; height: 32px; color: var(--color-text-secondary);"></i>
        </div>
        
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 24px; padding: 0 16px;">
          Allow <span style="color: var(--color-primary);">Fast Engineering Solutions</span> to access this device's location?
        </h3>
        
        <div class="map-selection-grid">
          <div class="map-bubble active" id="btn-precise">
            <div style="width: 48px; height: 48px; background-color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style="margin-top: 12px; font-weight: 600; font-size: 0.9rem; z-index: 2;">Precise</div>
            <svg style="position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0.15; z-index: 1;" viewBox="0 0 100 100"><path d="M0,20 L100,50 M20,0 L50,100 M0,80 L100,20" stroke="currentColor" stroke-width="2"/></svg>
          </div>
          
          <div class="map-bubble" id="btn-approximate">
             <div style="width: 48px; height: 48px; background-color: var(--color-surface); border: 2px solid var(--color-text-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-tertiary);"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style="margin-top: 12px; font-weight: 600; font-size: 0.9rem; z-index: 2; color: var(--color-text-tertiary);">Approximate</div>
            <svg style="position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0.1; z-index: 1;" viewBox="0 0 100 100"><path d="M10,10 L90,20 M10,90 L80,80 M20,10 L30,90" stroke="currentColor" stroke-width="2"/></svg>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="btn btn-outline" id="btn-allow-while" style="border: none; color: var(--color-primary); font-size: 1rem;">While using the app</button>
          <button class="btn btn-outline" id="btn-allow-once" style="border: none; color: var(--color-primary); font-size: 1rem;">Only this time</button>
          <button class="btn btn-outline" id="btn-deny" style="border: none; color: var(--color-text-tertiary); font-size: 1rem;">Don't allow</button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    let selection = 'precise';

    const btnPrecise = this.container.querySelector('#btn-precise');
    const btnApproximate = this.container.querySelector('#btn-approximate');

    btnPrecise.addEventListener('click', () => {
      selection = 'precise';
      btnPrecise.classList.add('active');
      btnApproximate.classList.remove('active');
    });

    btnApproximate.addEventListener('click', () => {
      selection = 'approximate';
      btnApproximate.classList.add('active');
      btnPrecise.classList.remove('active');
    });

    const proceedWithLocation = () => {
      const mockLocation = {
        lat: 31.5204, // Lahore
        lng: 74.3587,
        type: selection
      };
      this.renderAddressModal(mockLocation);
    };

    this.container.querySelector('#btn-allow-while').addEventListener('click', proceedWithLocation);
    this.container.querySelector('#btn-allow-once').addEventListener('click', proceedWithLocation);
    
    this.container.querySelector('#btn-deny').addEventListener('click', () => {
      this.close();
      if (this.onComplete) this.onComplete(null, null); // Denied
    });
  }

  renderAddressModal(locationData) {
    this.container.innerHTML = `
      <div class="bottom-sheet" style="padding: 24px; position: relative;">
        <button id="btn-close-address" style="position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; color: var(--color-danger);">
          <i data-lucide="x" style="width: 24px; height: 24px;"></i>
        </button>
        
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 24px;">Add Address Details</h3>
        
        <div class="form-group">
          <label class="form-label" style="color: var(--color-text-primary); font-size: 1rem;">Home</label>
          <input type="text" id="input-home" class="form-control" placeholder="Name/Number" style="border-radius: 12px; border: 1px solid var(--color-surface-border); padding: 16px;">
        </div>
        
        <div class="form-group" style="margin-bottom: 32px;">
          <label class="form-label" style="color: var(--color-text-primary); font-size: 1rem;">Street</label>
          <input type="text" id="input-street" class="form-control" placeholder="Name/Number" style="border-radius: 12px; border: 1px solid var(--color-surface-border); padding: 16px;">
        </div>
        
        <button class="btn btn-primary" id="btn-save-address" style="padding: 16px; border-radius: 12px; font-size: 1.1rem; background-color: #000; color: #FFF;">
          Save and Continue
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.container.querySelector('#btn-close-address').addEventListener('click', () => {
      this.close();
      if (this.onComplete) this.onComplete(locationData, null);
    });

    this.container.querySelector('#btn-save-address').addEventListener('click', () => {
      const home = this.container.querySelector('#input-home').value.trim();
      const street = this.container.querySelector('#input-street').value.trim();
      
      const addressData = {
        home: home || 'Main Hub',
        street: street || 'Lahore, Pakistan'
      };
      
      this.close();
      if (this.onComplete) this.onComplete(locationData, addressData);
    });
  }
}
