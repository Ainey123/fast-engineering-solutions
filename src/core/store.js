import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

class GlobalStore {
  constructor() {
    this.events = {};
    
    this.state = {
      theme: localStorage.getItem('fes_theme') || 'light',
      user: null,
      userRole: null, // 'admin' or 'client'
      bookings: [],
      notifications: JSON.parse(localStorage.getItem('fes_notifications')) || null,
      onboardingComplete: localStorage.getItem('fes_onboarding_complete') === 'true',
      authInitialized: false
    };

    this.applyTheme(this.state.theme);
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user role from Firestore
          let role = 'client';
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role || 'client';
            }
          } catch (e) {
            console.warn('Could not fetch user role:', e);
          }

          const safeEmail = firebaseUser.email || '';
          const namePrefix = safeEmail.includes('@') ? safeEmail.split('@')[0] : 'User';

          const userPayload = {
            uid: firebaseUser.uid,
            email: safeEmail,
            name: firebaseUser.displayName || namePrefix,
            photoURL: firebaseUser.photoURL,
            role
          };

          this.setState('userRole', role);
          this.setState('user', userPayload);

          // Only listen to bookings for clients
          if (role === 'client') {
            this.initBookingsListener(firebaseUser.uid);
          }
        } else {
          this.setState('user', null);
          this.setState('userRole', null);
          this.setState('bookings', []);

          if (this.unsubBookings) {
            this.unsubBookings();
            this.unsubBookings = null;
          }
        }
      } catch (err) {
        console.error('Auth state listener error:', err);
        this.setState('user', null);
        this.setState('userRole', null);
      } finally {
        // ALWAYS set authInitialized to true to unlock the router!
        this.setState('authInitialized', true);
      }
    });
  }

  initBookingsListener(uid) {
    if (this.unsubBookings) this.unsubBookings();
    const q = query(collection(db, 'bookings'), where('userId', '==', uid));
    this.unsubBookings = onSnapshot(q, (snapshot) => {
      const bookings = [];
      snapshot.forEach(d => bookings.push({ id: d.id, ...d.data() }));
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.setState('bookings', bookings);
    });
  }

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  setState(key, value) {
    this.state[key] = value;
    if (key === 'notifications') localStorage.setItem('fes_notifications', JSON.stringify(value));
    else if (key === 'onboardingComplete') localStorage.setItem('fes_onboarding_complete', value.toString());
    this.publish(key, value);
    this.publish('state_changed', this.state);
  }

  getState() { return this.state; }

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
