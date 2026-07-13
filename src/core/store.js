import { auth, db, fbSignOut } from './firebase.js';
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
      authInitialized: false,
      location: JSON.parse(localStorage.getItem('fes_location')) || null, // { lat, lng, type: 'precise' | 'approximate' }
      savedAddress: JSON.parse(localStorage.getItem('fes_saved_address')) || null // { home: '', street: '' }
    };

    this.applyTheme(this.state.theme);
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user role from Firestore (with timeout so app works offline)
          let role = 'client';
          try {
            const rolePromise = getDoc(doc(db, 'users', firebaseUser.uid));
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Firestore timeout')), 5000)
            );
            const userDoc = await Promise.race([rolePromise, timeoutPromise]);
            if (userDoc && userDoc.exists()) {
              role = userDoc.data().role || 'client';
            }
          } catch (e) {
            console.warn('Could not fetch user role (using default "client"):', e.message);
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
      snapshot.forEach(d => {
        const data = d.data();
        // Normalize createdAt: Firestore Timestamp -> milliseconds for sorting
        const createdMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
        bookings.push({ id: d.id, ...data, _createdMs: createdMs });
      });
      // Sort newest first
      bookings.sort((a, b) => b._createdMs - a._createdMs);
      this.setState('bookings', bookings);
    }, (err) => {
      console.warn('Bookings listener error:', err.message);
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
    else if (key === 'location') localStorage.setItem('fes_location', JSON.stringify(value));
    else if (key === 'savedAddress') localStorage.setItem('fes_saved_address', JSON.stringify(value));
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

  async logout() {
    try {
      await fbSignOut();
    } catch (e) {
      console.warn('Sign out failed:', e);
    }
    this.setState('user', null);
    this.setState('userRole', null);
    this.setState('bookings', []);
    if (this.unsubBookings) {
      try { this.unsubBookings(); } catch (_) {}
      this.unsubBookings = null;
    }
    this.publish('signed_out', true);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export const store = new GlobalStore();
