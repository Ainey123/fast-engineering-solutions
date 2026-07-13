// Helper utilities and validators

// Email syntax validator
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength: minimum 6 characters
export function isValidPassword(password) {
  return password && password.length >= 6;
}

// Generate unique tracking IDs for bookings
export function generateTrackingId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FES-${randomNum}`;
}

// Format relative time (e.g., "2m ago", "3h ago", "1d ago")
export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Format phone number to clean string
export function cleanPhoneNumber(phone) {
  return phone.replace(/\D/g, '');
}

/**
 * Real GPS Location fetcher using browser Geolocation API
 * Then does reverse geocoding via OpenStreetMap Nominatim (free, no API key needed)
 */
export function fetchRealLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Free reverse geocoding via OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();

          // Build a clean readable address
          const addr = data.address || {};
          const parts = [
            addr.house_number,
            addr.road,
            addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village,
            addr.state,
            addr.country
          ].filter(Boolean);

          resolve({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            address: parts.length > 0 ? parts.join(', ') : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          });
        } catch (err) {
          // Reverse geocoding failed but we still have coordinates
          resolve({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          });
        }
      },
      (error) => {
        let msg = 'Location access denied.';
        if (error.code === 1) msg = 'Location permission denied. Please allow location access in your browser settings.';
        else if (error.code === 2) msg = 'Location unavailable. Check your device GPS.';
        else if (error.code === 3) msg = 'Location request timed out. Please try again.';
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Keep old name as alias for backward compatibility
export const fetchMockLocation = fetchRealLocation;
