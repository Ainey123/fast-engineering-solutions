import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

class GlobalStore {
  constructor() {
    this.events = {};
    
    // Initial state setup (sync)
    this.state = {
      theme: localStorage.getItem('fes_theme') || 'light',
      user: null, // Will be populated by Firebase
      bookings: [], // Will be populated by Firestore
      notifications: JSON.parse(localStorage.getItem('fes_notifications')) || null,
      onboardingComplete: localStorage.getItem('fes_onboarding_complete') === 'true',
      authInitialized: false // To prevent routing before auth state is known
    };

    // Apply theme on init
    this.applyTheme(this.state.theme);

    // Initialize Firebase Auth Listener
    this.initAuthListener();
  }

  // Listen to Firebase auth state
  initAuthListener() {
    onAuthStateChanged(auth, (firebaseUser) => {
      this.setState('authInitialized', true);
      
      if (firebaseUser) {
        // User is logged in
        const userPayload = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL
        };
        this.setState('user', userPayload);
        
        // Setup real-time listener for user bookings in Firestore
        this.initBookingsListener(firebaseUser.uid);
      } else {
        // User logged out
        this.setState('user', null);
        this.setState('bookings', []);
        
        if (this.unsubBookings) {
          this.unsubBookings();
          this.unsubBookings = null;
        }
      }
    });
  }

  initBookingsListener(uid) {
    const q = query(collection(db, 'bookings'), where('userId', '==', uid));
    this.unsubBookings = onSnapshot(q, (snapshot) => {
      const bookings = [];
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      // Sort client-side by date
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.setState('bookings', bookings);
    });
  }

  // Pub/Sub: Subscribe to state changes
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
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
    
    // Persist local UI settings
    if (key === 'notifications') {
      localStorage.setItem('fes_notifications', JSON.stringify(value));
    } else if (key === 'onboardingComplete') {
      localStorage.setItem('fes_onboarding_complete', value.toString());
    }

    this.publish(key, value);
    this.publish('state_changed', this.state);
  }

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
}

export const store = new GlobalStore();
