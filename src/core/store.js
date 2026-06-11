// Simple global state store with reactive pub/sub event updates

class GlobalStore {
  constructor() {
    this.events = {};
    
    // Load initial state from LocalStorage or fallback to defaults
    this.state = {
      theme: localStorage.getItem('fes_theme') || 'light',
      user: JSON.parse(localStorage.getItem('fes_user')) || null,
      bookings: JSON.parse(localStorage.getItem('fes_bookings')) || null,
      notifications: JSON.parse(localStorage.getItem('fes_notifications')) || null,
      onboardingComplete: localStorage.getItem('fes_onboarding_complete') === 'true'
    };

    // Apply theme on init
    this.applyTheme(this.state.theme);
  }

  // Pub/Sub: Subscribe to state changes
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  // Pub/Sub: Publish events
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  // Update specific state slices
  setState(key, value) {
    this.state[key] = value;
    
    // Persist to local storage if necessary
    if (key === 'user') {
      localStorage.setItem('fes_user', JSON.stringify(value));
    } else if (key === 'bookings') {
      localStorage.setItem('fes_bookings', JSON.stringify(value));
    } else if (key === 'notifications') {
      localStorage.setItem('fes_notifications', JSON.stringify(value));
    } else if (key === 'onboardingComplete') {
      localStorage.setItem('fes_onboarding_complete', value.toString());
    }

    this.publish(key, value);
    this.publish('state_changed', this.state);
  }

  // Get current state values
  getState() {
    return this.state;
  }

  // Toggle Theme
  toggleTheme() {
    const nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('fes_theme', nextTheme);
    this.state.theme = nextTheme;
    this.applyTheme(nextTheme);
    this.publish('theme', nextTheme);
    this.publish('state_changed', this.state);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Authentication Helpers
  login(email, name = 'User') {
    const mockUser = {
      email,
      name: name.split('@')[0], // Extract name from email if needed
      avatar: null,
      loggedInAt: new Date().toISOString()
    };
    this.setState('user', mockUser);
  }

  logout() {
    this.setState('user', null);
  }
}

export const store = new GlobalStore();
