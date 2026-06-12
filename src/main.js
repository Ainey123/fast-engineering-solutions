// Application entry point
import './styles/index.css';
import { router } from './core/router.js';
import { store } from './core/store.js';

// Import Client Pages
import OnboardingPage from './pages/onboarding.js';
import AuthPage from './pages/auth.js';
import DashboardPage from './pages/dashboard.js';
import ServiceExplainerPage from './pages/service.js';
import BookingWizardPage from './pages/booking.js';
import BookingsTrackerPage from './pages/bookings.js';
import NotificationsPage from './pages/notifications.js';
import SupportPage from './pages/support.js';
import ProfilePage from './pages/profile.js';

// Import Admin Pages
import AdminDashboardPage from './pages/admin/admin-dashboard.js';
import AdminBookingsPage from './pages/admin/admin-bookings.js';
import AdminClientsPage from './pages/admin/admin-clients.js';
import AdminAlertsPage from './pages/admin/admin-alerts.js';

// Tree-shake and export only required Lucide Icons to optimize bundle size
import {
  createIcons,
  Wrench,
  Settings,
  Activity,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  X,
  UserPlus,
  CheckCircle,
  Bell,
  Home,
  Calendar,
  Phone,
  PhoneCall,
  User,
  Users,
  CalendarX,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Check,
  FileText,
  Trash2,
  Mail,
  Moon,
  Sun,
  Building2,
  MapPin,
  PackageSearch,
  BellOff,
  UploadCloud,
  Zap,
  Route,
  ClipboardList,
  Inbox,
  Siren,
  ShieldCheck as ShieldCheckIcon
} from 'lucide';

// Expose tree-shaken lucide globally for lifecycle re-render triggers
window.lucide = {
  createIcons: () => createIcons({
    icons: {
      Wrench, Settings, Activity, AlertTriangle, ArrowLeft, MessageSquare, ArrowRight,
      ShieldCheck, LogIn, LogOut, Eye, EyeOff, X, UserPlus, CheckCircle,
      Bell, Home, Calendar, Phone, PhoneCall, User, Users, CalendarX,
      ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Check, FileText, Trash2,
      Mail, Moon, Sun, Building2, MapPin, PackageSearch, BellOff, UploadCloud,
      Zap, Route, ClipboardList, Inbox, Siren
    }
  })
};

// Register Client SPA routes
router.register('#/onboarding', OnboardingPage);
router.register('#/auth', AuthPage);
router.register('#/dashboard', DashboardPage);
router.register('#/service/:id', ServiceExplainerPage);
router.register('#/booking', BookingWizardPage);
router.register('#/bookings', BookingsTrackerPage);
router.register('#/notifications', NotificationsPage);
router.register('#/support', SupportPage);
router.register('#/profile', ProfilePage);

// Register Admin SPA routes
router.register('#/admin/dashboard', AdminDashboardPage);
router.register('#/admin/bookings', AdminBookingsPage);
router.register('#/admin/clients', AdminClientsPage);
router.register('#/admin/alerts', AdminAlertsPage);

function initApp() {
  // Force unregister any stuck service workers to fix caching issues
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('ServiceWorker unregistered to fix cache.');
      }
    });
  }

  // Sync page wrapper
  const appContainer = document.getElementById('app');
  if (appContainer && !document.getElementById('app-simulator')) {
    appContainer.innerHTML = '<div id="app-simulator"></div>';
  }
  
  // Start the Router on the mobile simulator container
  router.init('app-simulator');
}

// Document load hook initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
