// Page 5: Advanced Booking & File Upload Wizard
import { router } from '../core/router.js';
import { store } from '../core/store.js';
import { generateTrackingId, fetchRealLocation } from '../core/utils.js';
import { services } from '../data/services.js';
import { db } from '../core/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default class BookingWizardPage {
  constructor(params = {}) {
    this.params = params;
    this.currentStep = 1;
    this.totalSteps = 3;
    this.uploadedFiles = [];
    
    // Default form data
    const state = store.getState();
    this.formData = {
      name: state.user ? state.user.name : '',
      phone: '',
      serviceId: this.params.service || 'construction',
      date: '',
      time: '',
      gpsLocation: '',
      gpsCoordinates: null
    };
  }

  async render() {
    return `
      <!-- Header with Back Button -->
      <header class="header-nav">
        <button id="btn-booking-back" class="theme-toggle-btn" style="color: var(--color-text-primary);">
          <i data-lucide="chevron-left" style="width: 24px; height: 24px;"></i>
        </button>
        <span class="header-title">Book Service</span>
        <div style="width: 40px;"></div> <!-- Spacer -->
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 80px;">
        
        <!-- Animated Step Progress Indicator -->
        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.8rem; font-weight: 700; color: var(--color-text-tertiary);">
            <span>STEP ${this.currentStep} OF ${this.totalSteps}</span>
            <span id="step-title-text" style="color: var(--color-primary);">Client Info</span>
          </div>
          <!-- Bar progress -->
          <div style="width: 100%; height: 6px; background-color: var(--color-surface-border); border-radius: var(--radius-full); overflow: hidden;">
            <div id="step-progress-bar" style="width: 33.333%; height: 100%; background-color: var(--color-primary); transition: width var(--transition-normal) ease; border-radius: var(--radius-full);"></div>
          </div>
        </div>

        <!-- Wizard form container -->
        <div class="card" style="margin-bottom: 20px;">
          
          <!-- STEP 1: CLIENT INFO -->
          <div id="booking-step-1" class="step-panel" style="display: block;">
            <div class="form-group">
              <label class="form-label" for="booking-name">Contact Person Name</label>
              <input type="text" id="booking-name" class="form-control" placeholder="M. Rafay Malik" value="${this.formData.name}">
              <div class="form-feedback" id="booking-name-feedback">Please enter contact name.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="booking-phone">WhatsApp/Phone Number</label>
              <input type="tel" id="booking-phone" class="form-control" placeholder="+92 300 4545280" value="${this.formData.phone}">
              <div class="form-feedback" id="booking-phone-feedback">Please enter a valid phone number.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="booking-service">Required Engineering Work</label>
              <select id="booking-service" class="form-control" style="-webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;24&quot; height=&quot;24&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%238A929A&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><polyline points=&quot;6 9 12 15 18 9&quot;></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;">
                ${services.map(s => `
                  <option value="${s.id}" ${s.id === this.formData.serviceId ? 'selected' : ''}>${s.title}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- STEP 2: LOGISTICS & GPS -->
          <div id="booking-step-2" class="step-panel" style="display: none;">
            <div class="form-group">
              <label class="form-label" for="booking-date">Inspection Date</label>
              <input type="date" id="booking-date" class="form-control" value="${this.formData.date}">
              <div class="form-feedback" id="booking-date-feedback">Please select a future inspection date.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="booking-time">Inspection Time Slot</label>
              <input type="time" id="booking-time" class="form-control" value="${this.formData.time}">
              <div class="form-feedback" id="booking-time-feedback">Please select an inspection time slot.</div>
            </div>

            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" for="booking-gps">Site / Service Location</label>
              <textarea id="booking-gps" class="form-control" style="resize: none; height: 80px;" placeholder="Tap 'Use My Location' or type the site address">${this.formData.gpsLocation}</textarea>
              <div class="form-feedback" id="booking-gps-feedback">Please provide target site address or coordinates.</div>
            </div>

            <button type="button" id="btn-fetch-gps" class="btn btn-secondary active-press btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-bottom: 4px;">
              <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i> Use My Current Location
            </button>
            <div id="gps-status" style="margin-top: 8px; font-size: 0.775rem; text-align: center; font-weight: 500; display: none;"></div>
          </div>

          <!-- STEP 3: MEDIA & BLUEPRINTS -->
          <div id="booking-step-3" class="step-panel" style="display: none;">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Upload Site Blueprints/Photos (Optional)</label>
              
              <!-- File picker dropzone -->
              <label for="file-picker" style="display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--color-input-border); border-radius: var(--radius-md); padding: 32px 16px; cursor: pointer; text-align: center; transition: background-color var(--transition-fast) ease;">
                <input type="file" id="file-picker" multiple accept="image/*,application/pdf" style="display: none;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <i data-lucide="upload-cloud" style="width: 24px; height: 24px;"></i>
                </div>
                <span style="font-size: 0.9rem; font-weight: 600; margin-bottom: 4px;">Choose files to upload</span>
                <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">Supports PDF blueprints or PNG/JPG site images</span>
              </label>
            </div>

            <!-- Uploaded files list -->
            <div id="uploaded-files-list" style="display: flex; flex-direction: column; gap: 10px;">
              <!-- Dynamically populated files -->
            </div>
          </div>

        </div>

        <!-- Sticky buttons for back/next -->
        <div style="display: flex; gap: 12px;">
          <button id="btn-wizard-prev" class="btn btn-outline active-press" style="flex: 1; display: none;">
            <i data-lucide="chevron-left" style="width: 18px; height: 18px;"></i> Back
          </button>
          <button id="btn-wizard-next" class="btn btn-primary active-press" style="flex: 2;">
            Next <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

      </div>

      <!-- SUCCESS MODAL OVERLAY (Hidden initially) -->
      <div id="booking-success-overlay" style="display: none; position: absolute; inset: 0; background-color: var(--color-bg-page); z-index: 2000; align-items: center; justify-content: center; padding: 32px; flex-direction: column; text-align: center;">
        
        <!-- Animated Check Circle -->
        <div class="success-icon-wrapper" style="width: 96px; height: 96px; border-radius: 50%; background-color: var(--color-accent-green-tint); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; border: 4px solid var(--color-success); animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
          <i data-lucide="check" style="width: 48px; height: 48px; stroke-width: 3;"></i>
        </div>

        <h1 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 12px;">Booking Confirmed!</h1>
        <p style="font-size: 0.95rem; max-width: 300px; margin-bottom: 32px;">Your engineering request has been logged. An officer will review and contact you shortly.</p>

        <!-- Booking Tracker Card -->
        <div class="card" style="width: 100%; max-width: 340px; padding: 16px; margin-bottom: 40px; border-color: var(--color-primary); background-color: var(--color-accent-blue-tint);">
          <div style="font-size: 0.775rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase;">Unique Tracker Reference</div>
          <div id="success-tracker-id" style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-top: 4px;">#FES-0000</div>
        </div>

        <!-- Next Action Button -->
        <button id="btn-success-track" class="btn btn-primary active-press" style="width: 100%; max-width: 340px;">
          Track Progress <i data-lucide="activity" style="width:18px;height:18px;"></i>
        </button>
      </div>
    `;
  }

  afterRender() {
    this.btnBack = document.getElementById('btn-booking-back');
    this.btnPrev = document.getElementById('btn-wizard-prev');
    this.btnNext = document.getElementById('btn-wizard-next');
    this.btnFetchGps = document.getElementById('btn-fetch-gps');
    this.filePicker = document.getElementById('file-picker');
    this.successOverlay = document.getElementById('booking-success-overlay');
    this.btnSuccessTrack = document.getElementById('btn-success-track');

    // Populate current date as minimum date limit
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    // Header Back
    this.btnBack.addEventListener('click', () => {
      window.history.back();
    });

    // Navigation Buttons
    this.btnPrev.addEventListener('click', () => this.navigateStep(-1));
    this.btnNext.addEventListener('click', () => this.navigateStep(1));

    // GPS Location Click
    this.btnFetchGps.addEventListener('click', () => this.handleGpsFetch());

    // File picker attachment
    this.filePicker.addEventListener('change', (e) => this.handleFileSelect(e));

    // Track bookings success route
    this.btnSuccessTrack.addEventListener('click', () => {
      router.navigate('#/bookings');
    });
  }

  navigateStep(delta) {
    if (delta === 1 && !this.validateCurrentStep()) {
      return;
    }

    this.saveStepData();
    this.currentStep += delta;

    if (this.currentStep > this.totalSteps) {
      this.submitBooking();
      return;
    }

    // Toggle panel displays
    document.getElementById('booking-step-1').style.display = this.currentStep === 1 ? 'block' : 'none';
    document.getElementById('booking-step-2').style.display = this.currentStep === 2 ? 'block' : 'none';
    document.getElementById('booking-step-3').style.display = this.currentStep === 3 ? 'block' : 'none';

    // Update Progress Bar
    const progressPercent = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('step-progress-bar').style.width = `${progressPercent}%`;

    // Update Step Titles
    const stepTitle = document.getElementById('step-title-text');
    if (this.currentStep === 1) {
      stepTitle.textContent = 'Client Info';
      this.btnPrev.style.display = 'none';
      this.btnNext.innerHTML = 'Next <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>';
    } else if (this.currentStep === 2) {
      stepTitle.textContent = 'Logistics & GPS';
      this.btnPrev.style.display = 'block';
      this.btnNext.innerHTML = 'Next <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>';
    } else if (this.currentStep === 3) {
      stepTitle.textContent = 'Upload Attachments';
      this.btnPrev.style.display = 'block';
      this.btnNext.innerHTML = 'Confirm Booking <i data-lucide="check" style="width: 18px; height: 18px;"></i>';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  saveStepData() {
    if (this.currentStep === 1) {
      this.formData.name = document.getElementById('booking-name').value;
      this.formData.phone = document.getElementById('booking-phone').value;
      this.formData.serviceId = document.getElementById('booking-service').value;
    } else if (this.currentStep === 2) {
      this.formData.date = document.getElementById('booking-date').value;
      this.formData.time = document.getElementById('booking-time').value;
      this.formData.gpsLocation = document.getElementById('booking-gps').value;
    }
  }

  validateCurrentStep() {
    let isValid = true;

    if (this.currentStep === 1) {
      const nameVal = document.getElementById('booking-name').value.trim();
      const phoneVal = document.getElementById('booking-phone').value.trim();
      
      const nameFeedback = document.getElementById('booking-name-feedback');
      const phoneFeedback = document.getElementById('booking-phone-feedback');

      if (!nameVal) {
        document.getElementById('booking-name').classList.add('is-invalid');
        nameFeedback.classList.add('is-error');
        isValid = false;
      } else {
        document.getElementById('booking-name').classList.remove('is-invalid');
        nameFeedback.classList.remove('is-error');
      }

      if (!phoneVal || phoneVal.length < 8) {
        document.getElementById('booking-phone').classList.add('is-invalid');
        phoneFeedback.classList.add('is-error');
        isValid = false;
      } else {
        document.getElementById('booking-phone').classList.remove('is-invalid');
        phoneFeedback.classList.remove('is-error');
      }
    } else if (this.currentStep === 2) {
      const dateVal = document.getElementById('booking-date').value;
      const timeVal = document.getElementById('booking-time').value;
      const gpsVal = document.getElementById('booking-gps').value.trim();

      const dateFeedback = document.getElementById('booking-date-feedback');
      const timeFeedback = document.getElementById('booking-time-feedback');
      const gpsFeedback = document.getElementById('booking-gps-feedback');

      if (!dateVal) {
        document.getElementById('booking-date').classList.add('is-invalid');
        dateFeedback.classList.add('is-error');
        isValid = false;
      } else {
        document.getElementById('booking-date').classList.remove('is-invalid');
        dateFeedback.classList.remove('is-error');
      }

      if (!timeVal) {
        document.getElementById('booking-time').classList.add('is-invalid');
        timeFeedback.classList.add('is-error');
        isValid = false;
      } else {
        document.getElementById('booking-time').classList.remove('is-invalid');
        timeFeedback.classList.remove('is-error');
      }

      if (!gpsVal) {
        document.getElementById('booking-gps').classList.add('is-invalid');
        gpsFeedback.classList.add('is-error');
        isValid = false;
      } else {
        document.getElementById('booking-gps').classList.remove('is-invalid');
        gpsFeedback.classList.remove('is-error');
      }
    }

    return isValid;
  }

  async handleGpsFetch() {
    const statusDiv = document.getElementById('gps-status');
    const gpsTextArea = document.getElementById('booking-gps');
    
    this.btnFetchGps.disabled = true;
    this.btnFetchGps.innerHTML = '<span style="border: 2px solid currentColor; border-top: 2px solid transparent; width:14px; height:14px; border-radius:50%; display:inline-block; animation: spin 1s infinite linear; margin-right:6px;"></span> Getting location...';
    
    statusDiv.style.display = 'block';
    statusDiv.style.color = 'var(--color-text-tertiary)';
    statusDiv.textContent = 'Accessing your device GPS...';

    try {
      const location = await fetchRealLocation();
      gpsTextArea.value = `${location.address}\n(GPS: ${location.latitude}, ${location.longitude})`;
      gpsTextArea.classList.remove('is-invalid');
      document.getElementById('booking-gps-feedback').classList.remove('is-error');
      
      statusDiv.style.color = 'var(--color-success)';
      statusDiv.textContent = `✓ Location locked: ${parseFloat(location.latitude).toFixed(4)}, ${parseFloat(location.longitude).toFixed(4)}`;
      
      this.formData.gpsCoordinates = { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) };
      this.formData.gpsLocation = gpsTextArea.value;
    } catch (err) {
      statusDiv.style.color = 'var(--color-danger)';
      statusDiv.textContent = `⚠ ${err.message} Type address manually above.`;
    } finally {
      this.btnFetchGps.disabled = false;
      this.btnFetchGps.innerHTML = '<i data-lucide="map-pin" style="width: 16px; height: 16px;"></i> Use My Current Location';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      this.uploadedFiles.push({
        id: 'file-' + Date.now() + Math.random().toString(36).substring(2, 5),
        name: file.name,
        size: `${sizeKB} KB`
      });
    });

    this.renderFileList();
  }

  removeFile(id) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== id);
    this.renderFileList();
  }

  renderFileList() {
    const listContainer = document.getElementById('uploaded-files-list');
    if (!listContainer) return;

    if (this.uploadedFiles.length === 0) {
      listContainer.innerHTML = '';
      return;
    }

    listContainer.innerHTML = this.uploadedFiles.map(file => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background-color: var(--color-surface-hover); border: 1px solid var(--color-surface-border); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 80%;">
          <i data-lucide="file-text" style="color: var(--color-primary); width:18px; height:18px; flex-shrink: 0;"></i>
          <div style="display: flex; flex-direction: column; overflow: hidden;">
            <span style="font-size: 0.85rem; font-weight: 600; text-overflow: ellipsis; overflow: hidden;">${file.name}</span>
            <span style="font-size: 0.7rem; color: var(--color-text-tertiary);">${file.size}</span>
          </div>
        </div>
        <button type="button" class="btn-remove-file" data-id="${file.id}" style="background: none; border: none; color: var(--color-danger); cursor: pointer; padding: 4px;">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    `).join('');

    listContainer.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const fileId = e.currentTarget.getAttribute('data-id');
        this.removeFile(fileId);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  async submitBooking() {
    // Show loading state on button
    const btn = this.btnNext;
    btn.innerHTML = '<span style="border:2px solid white;border-top-color:transparent;width:16px;height:16px;border-radius:50%;display:inline-block;animation:spin 1s linear infinite;margin-right:8px;"></span>Saving...';
    btn.disabled = true;

    const trackerId = generateTrackingId();
    const serviceDetails = services.find(s => s.id === this.formData.serviceId);
    const state = store.getState();

    const bookingData = {
      trackerId,
      serviceId: this.formData.serviceId,
      serviceName: serviceDetails ? serviceDetails.title : 'Engineering Work',
      clientName: this.formData.name,
      phone: this.formData.phone,
      date: this.formData.date,
      time: this.formData.time,
      location: this.formData.gpsLocation,
      gpsCoordinates: this.formData.gpsCoordinates || null,
      status: 'Approved',
      statusIndex: 0,
      userId: state.user ? state.user.uid : null,
      userEmail: state.user ? state.user.email : null,
      attachments: this.uploadedFiles.map(f => f.name),
      createdAt: serverTimestamp()
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, 'bookings'), bookingData);
    } catch (firestoreErr) {
      console.warn('Firestore save failed, saving locally:', firestoreErr.message);
      // Fallback: save to store if offline
      const activeBookings = state.bookings || [];
      activeBookings.unshift({ ...bookingData, id: trackerId, createdAt: new Date() });
      store.setState('bookings', activeBookings);
    }

    // Show success screen
    document.getElementById('success-tracker-id').textContent = '#' + trackerId;
    this.successOverlay.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  }
}
