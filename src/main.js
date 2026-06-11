// Application entry point
import './styles/index.css';
import { router } from './core/router.js';
import { store } from './core/store.js';

// Import Pages
import OnboardingPage from './pages/onboarding.js';
import AuthPage from './pages/auth.js';
import DashboardPage from './pages/dashboard.js';
import ServiceExplainerPage from './pages/service.js';
import BookingWizardPage from './pages/booking.js';
import BookingsTrackerPage from './pages/bookings.js';
import NotificationsPage from './pages/notifications.js';
import SupportPage from './pages/support.js';
import ProfilePage from './pages/profile.js';

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
  Eye,
  EyeOff,
  X,
  UserPlus,
  CheckCircle,
  Bell,
  Home,
  Calendar,
  Phone,
  User,
  CalendarX,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Check,
  FileText,
  Trash2,
  Mail,
  Moon,
  Sun,
  Building2,
  PhoneCall,
  MapPin,
  PackageSearch,
  BellOff,
  UploadCloud,
  Zap,
  Route
} from 'lucide';

// Expose tree-shaken lucide globally for lifecycle re-render triggers
window.lucide = {
  createIcons: () => createIcons({
    icons: {
      Wrench,
      Settings,
      Activity,
      AlertTriangle,
      ArrowLeft,
      MessageSquare,
      ArrowRight,
      ShieldCheck,
      LogIn,
      Eye,
      EyeOff,
      X,
      UserPlus,
      CheckCircle,
      Bell,
      Home,
      Calendar,
      Phone,
      User,
      CalendarX,
      ChevronDown,
      ChevronLeft,
      ChevronUp,
      Check,
      FileText,
      Trash2,
      Mail,
      Moon,
      Sun,
      Building2,
      PhoneCall,
      MapPin,
      PackageSearch,
      BellOff,
      UploadCloud,
      Zap,
      Route
    }
  })
};

// Register SPA routes
router.register('#/onboarding', OnboardingPage);
router.register('#/auth', AuthPage);
router.register('#/dashboard', DashboardPage);
router.register('#/service/:id', ServiceExplainerPage);
router.register('#/booking', BookingWizardPage);
router.register('#/bookings', BookingsTrackerPage);
router.register('#/notifications', NotificationsPage);
router.register('#/support', SupportPage);
router.register('#/profile', ProfilePage);

// Document load hook initialization
document.addEventListener('DOMContentLoaded', () => {
  // Sync page wrapper
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = '<div id="app-simulator"></div>';
  }
  
  // Start the Router on the mobile simulator container
  router.init('app-simulator');
});
