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
  return `#FES-${randomNum}`;
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

// Mock GPS Location fetcher with delay
export function fetchMockLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Return a simulated high-quality coordinate if API is missing
      setTimeout(() => {
        resolve({
          latitude: 31.5204,
          longitude: 74.3587,
          address: 'Gulberg III, Lahore, Pakistan'
        });
      }, 1200);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Reverse geocoding placeholder
        resolve({
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
          address: 'Fetched via browser GPS'
        });
      },
      (error) => {
        // Fallback mock if user denies permission
        setTimeout(() => {
          resolve({
            latitude: 31.4805,
            longitude: 74.3210,
            address: 'Model Town, Lahore, Pakistan (Simulated)'
          });
        }, 1000);
      },
      { timeout: 5000 }
    );
  });
}
