import { fetchRealLocation } from '../core/utils.js';

export class LocationModal {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.container = document.createElement('div');
    this.container.className = 'modal-overlay';
    document.body.appendChild(this.container);

    this.renderPermissionModal = this.renderPermissionModal.bind(this);
    this.renderLoadingModal = this.renderLoadingModal.bind(this);
    this.renderAddressModal = this.renderAddressModal.bind(this);
    this.close = this.close.bind(this);
  }

  show() {
    this.renderPermissionModal();
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
      <div class="bottom-sheet" style="text-align: center; padding: 32px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #0066FF, #4D94FF); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>

        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">
          Enable Location
        </h3>
        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 28px; line-height: 1.5;">
          <strong>Fast Engineering Solutions</strong> needs your location to show services near you and fill your site address automatically.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="btn-allow-location" style="
            background: #0066FF;
            color: white;
            border: none;
            border-radius: 14px;
            padding: 16px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
            Allow Location Access
          </button>

          <button id="btn-deny-location" style="
            background: none;
            border: none;
            color: var(--color-text-tertiary);
            font-size: 0.9rem;
            padding: 12px;
            cursor: pointer;
          ">
            Not now, I'll enter address manually
          </button>
        </div>

        <p style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 16px;">
          Your location is only used for this service request and is never shared with third parties.
        </p>
      </div>
    `;

    this.container.querySelector('#btn-allow-location').addEventListener('click', () => {
      this.requestRealLocation();
    });

    this.container.querySelector('#btn-deny-location').addEventListener('click', () => {
      this.renderAddressModal(null);
    });
  }

  renderLoadingModal() {
    this.container.innerHTML = `
      <div class="bottom-sheet" style="text-align: center; padding: 48px 24px;">
        <div style="width: 56px; height: 56px; border: 4px solid var(--color-primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px;"></div>
        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">Getting Your Location...</h3>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary);">Please allow location access when your browser asks.</p>
      </div>
    `;
  }

  async requestRealLocation() {
    this.renderLoadingModal();

    try {
      const locationData = await fetchRealLocation();
      this.renderAddressModal({
        lat: parseFloat(locationData.latitude),
        lng: parseFloat(locationData.longitude),
        address: locationData.address,
        type: 'precise'
      });
    } catch (err) {
      // Show error then fall back to manual entry
      this.container.innerHTML = `
        <div class="bottom-sheet" style="text-align: center; padding: 32px 24px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239,68,68,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: #ef4444;">Location Access Failed</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 24px; line-height: 1.5;">${err.message}</p>
          <button id="btn-manual-fallback" style="background: #0066FF; color: white; border: none; border-radius: 12px; padding: 14px 24px; font-size: 0.95rem; font-weight: 600; cursor: pointer; width: 100%;">
            Enter Address Manually
          </button>
        </div>
      `;
      this.container.querySelector('#btn-manual-fallback').addEventListener('click', () => {
        this.renderAddressModal(null);
      });
    }
  }

  renderAddressModal(locationData) {
    const autoAddress = locationData ? locationData.address : '';
    const coordsLine = locationData ? `<p style="font-size: 0.75rem; color: var(--color-success); margin-top: 4px; margin-bottom: 0;">📍 GPS: ${locationData.lat?.toFixed(4)}, ${locationData.lng?.toFixed(4)}</p>` : '';

    this.container.innerHTML = `
      <div class="bottom-sheet" style="padding: 24px; position: relative;">
        <button id="btn-close-address" style="position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; color: var(--color-text-tertiary);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Confirm Your Location</h3>
        ${locationData ? '<p style="font-size: 0.8rem; color: var(--color-success); margin-bottom: 20px; font-weight: 600;">✓ Location detected automatically</p>' : '<p style="font-size: 0.8rem; color: var(--color-text-tertiary); margin-bottom: 20px;">Enter your address manually</p>'}

        <div class="form-group">
          <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Detected / Service Address</label>
          <textarea id="input-full-address" class="form-control" rows="3" style="resize: none;" placeholder="e.g. House 12, Block B, DHA Phase 5, Lahore">${autoAddress}</textarea>
          ${coordsLine}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">House / Flat No.</label>
            <input type="text" id="input-home" class="form-control" placeholder="e.g. House 12">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Street / Area</label>
            <input type="text" id="input-street" class="form-control" placeholder="e.g. DHA Phase 5">
          </div>
        </div>

        <button id="btn-save-address" style="
          width: 100%;
          background: #0066FF;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 16px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
        ">
          Save Location & Continue
        </button>
      </div>
    `;

    this.container.querySelector('#btn-close-address').addEventListener('click', () => {
      this.close();
      if (this.onComplete) this.onComplete(locationData, null);
    });

    this.container.querySelector('#btn-save-address').addEventListener('click', () => {
      const fullAddress = this.container.querySelector('#input-full-address').value.trim();
      const home = this.container.querySelector('#input-home').value.trim();
      const street = this.container.querySelector('#input-street').value.trim();

      if (!fullAddress && !home) {
        this.container.querySelector('#input-full-address').style.border = '2px solid #ef4444';
        return;
      }

      const addressData = {
        fullAddress: fullAddress || `${home}, ${street}`,
        home: home || '',
        street: street || ''
      };

      // If we got real GPS, attach it
      if (locationData) {
        addressData.lat = locationData.lat;
        addressData.lng = locationData.lng;
      }

      this.close();
      if (this.onComplete) this.onComplete(locationData, addressData);
    });
  }
}
