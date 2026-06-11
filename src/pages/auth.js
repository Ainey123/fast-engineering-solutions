// Page 2: Secure Authentication Hub (Login & Sign Up)
import { router } from '../core/router.js';
import { store } from '../core/store.js';
import { isValidEmail, isValidPassword } from '../core/utils.js';

export default class AuthPage {
  constructor(params = {}) {
    this.params = params;
    this.activeTab = 'signin'; // 'signin' or 'signup'
  }

  async render() {
    const isDark = store.getState().theme === 'dark';
    return `
      <div class="app-view-container no-scrollbar" style="padding: 24px; display: flex; flex-direction: column; justify-content: center; min-height: 100%;">
        
        <!-- Header Brand Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: var(--radius-md); background-color: var(--color-primary); color: #FFF; margin-bottom: 16px; box-shadow: var(--shadow-glow);">
            <i data-lucide="shield-check" style="width: 36px; height: 36px;"></i>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em;">FES Hub</h2>
          <p style="font-size: 0.875rem;">Fast Engineering Solutions (Pvt.) Ltd.</p>
        </div>

        <!-- Tab switcher -->
        <div class="tab-switch">
          <button id="tab-signin" class="tab-btn is-active">Sign In</button>
          <button id="tab-signup" class="tab-btn">Create Account</button>
        </div>

        <!-- Form container -->
        <div class="card" style="margin-bottom: 24px;">
          
          <!-- SIGN IN FORM -->
          <form id="form-signin" style="display: block;">
            <div class="form-group">
              <label class="form-label" for="signin-email">Corporate Email</label>
              <input type="email" id="signin-email" class="form-control" placeholder="name@fastengineering.pk" autocomplete="username">
              <div class="form-feedback" id="signin-email-feedback">Please enter a valid email address.</div>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="signin-password">Password</label>
              <div style="position: relative;">
                <input type="password" id="signin-password" class="form-control" placeholder="••••••••" autocomplete="current-password">
                <button type="button" class="toggle-password" style="position: absolute; right: 12px; top: 12px; background: none; border: none; color: var(--color-text-tertiary); cursor: pointer;" tabindex="-1">
                  <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
              <div class="form-feedback" id="signin-password-feedback">Password must be at least 6 characters.</div>
            </div>

            <div style="text-align: right; margin-bottom: 20px;">
              <a href="javascript:void(0)" id="link-forgot-password" style="font-size: 0.85rem; font-weight: 600;">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary active-press">
              Sign In <i data-lucide="log-in" style="width: 18px; height: 18px;"></i>
            </button>
          </form>

          <!-- SIGN UP FORM -->
          <form id="form-signup" style="display: none;">
            <div class="form-group">
              <label class="form-label" for="signup-name">Full Name</label>
              <input type="text" id="signup-name" class="form-control" placeholder="M. Rafay Malik">
              <div class="form-feedback" id="signup-name-feedback">Name must be at least 3 characters.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-email">Email Address</label>
              <input type="email" id="signup-email" class="form-control" placeholder="name@domain.com">
              <div class="form-feedback" id="signup-email-feedback">Please enter a valid email address.</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-password">Password</label>
              <div style="position: relative;">
                <input type="password" id="signup-password" class="form-control" placeholder="At least 6 characters" autocomplete="new-password">
                <button type="button" class="toggle-password" style="position: absolute; right: 12px; top: 12px; background: none; border: none; color: var(--color-text-tertiary); cursor: pointer;" tabindex="-1">
                  <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
              <div class="form-feedback" id="signup-password-feedback">Password must be at least 6 characters.</div>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label" for="signup-confirm">Confirm Password</label>
              <input type="password" id="signup-confirm" class="form-control" placeholder="••••••••" autocomplete="new-password">
              <div class="form-feedback" id="signup-confirm-feedback">Passwords do not match.</div>
            </div>

            <button type="submit" class="btn btn-primary active-press">
              Register Account <i data-lucide="user-plus" style="width: 18px; height: 18px;"></i>
            </button>
          </form>

        </div>

        <!-- Social login divider -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px;">
          <div style="flex: 1; height: 1px; background-color: var(--color-surface-border);"></div>
          <span style="font-size: 0.775rem; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase;">Or connect with</span>
          <div style="flex: 1; height: 1px; background-color: var(--color-surface-border);"></div>
        </div>

        <!-- Styled Social Button -->
        <button id="btn-google" class="btn btn-outline active-press" style="display: flex; align-items: center; justify-content: center; gap: 12px; border-color: var(--color-input-border); background-color: var(--color-surface);">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.468 0-6.277-2.81-6.277-6.278 0-3.468 2.81-6.278 6.277-6.278 1.56 0 2.973.57 4.067 1.505l3.08-3.08C18.995 1.59 15.82 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.825-.075-1.62-.218-2.395h-12.022z"/>
          </svg>
          Sign in with Google
        </button>

        <!-- Forgot Password Modal dialog (Absolute hidden overlay) -->
        <div id="forgot-modal" style="display: none; position: absolute; inset: 0; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; padding: 24px;">
          <div class="card animate-scale-up" style="width: 100%; max-width: 380px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1.15rem; font-weight: 700;">Reset Password</h3>
              <button id="btn-close-modal" style="background: none; border: none; cursor: pointer; color: var(--color-text-tertiary);">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
              </button>
            </div>
            <p style="font-size: 0.875rem; margin-bottom: 20px;">Enter your registered corporate email below. We'll send a digital link to reset your credentials.</p>
            <div class="form-group">
              <label class="form-label" for="forgot-email">Corporate Email</label>
              <input type="email" id="forgot-email" class="form-control" placeholder="name@fastengineering.pk">
              <div class="form-feedback" id="forgot-email-feedback">Please enter a valid email address.</div>
            </div>
            <button id="btn-submit-forgot" class="btn btn-primary active-press">Send Recovery Link</button>
            <div id="forgot-success-msg" style="display: none; text-align: center; color: var(--color-success); font-size: 0.875rem; font-weight: 600; margin-top: 12px;">
              <i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Recovery email sent successfully!
            </div>
          </div>
        </div>

      </div>
    `;
  }

  afterRender() {
    this.tabSignin = document.getElementById('tab-signin');
    this.tabSignup = document.getElementById('tab-signup');
    this.formSignin = document.getElementById('form-signin');
    this.formSignup = document.getElementById('form-signup');
    this.googleBtn = document.getElementById('btn-google');
    
    this.forgotLink = document.getElementById('link-forgot-password');
    this.forgotModal = document.getElementById('forgot-modal');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnSubmitForgot = document.getElementById('btn-submit-forgot');
    this.forgotEmailInput = document.getElementById('forgot-email');
    this.forgotEmailFeedback = document.getElementById('forgot-email-feedback');
    this.forgotSuccessMsg = document.getElementById('forgot-success-msg');

    // Tab switcher events
    this.tabSignin.addEventListener('click', () => this.switchTab('signin'));
    this.tabSignup.addEventListener('click', () => this.switchTab('signup'));

    // Form submissions
    this.formSignin.addEventListener('submit', (e) => this.handleSignInSubmit(e));
    this.formSignup.addEventListener('submit', (e) => this.handleSignUpSubmit(e));

    // Google Sign-in Mock
    this.googleBtn.addEventListener('click', () => {
      this.googleBtn.innerHTML = 'Connecting Google...';
      this.googleBtn.disabled = true;
      setTimeout(() => {
        store.login('google.user@gmail.com', 'Google User');
        router.navigate('#/dashboard');
      }, 1000);
    });

    // Forgot password modal
    this.forgotLink.addEventListener('click', () => {
      this.forgotModal.style.display = 'flex';
      this.forgotEmailInput.focus();
    });
    this.btnCloseModal.addEventListener('click', () => {
      this.forgotModal.style.display = 'none';
      this.forgotSuccessMsg.style.display = 'none';
      this.forgotEmailInput.value = '';
    });
    this.btnSubmitForgot.addEventListener('click', () => {
      const email = this.forgotEmailInput.value;
      if (!isValidEmail(email)) {
        this.forgotEmailInput.classList.add('is-invalid');
        this.forgotEmailFeedback.classList.add('is-error');
        return;
      }
      this.forgotEmailInput.classList.remove('is-invalid');
      this.forgotEmailFeedback.classList.remove('is-error');
      this.btnSubmitForgot.disabled = true;
      this.btnSubmitForgot.innerHTML = 'Sending...';

      setTimeout(() => {
        this.forgotSuccessMsg.style.display = 'block';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          this.forgotModal.style.display = 'none';
          this.forgotSuccessMsg.style.display = 'none';
          this.forgotEmailInput.value = '';
          this.btnSubmitForgot.disabled = false;
          this.btnSubmitForgot.innerHTML = 'Send Recovery Link';
        }, 1500);
      }, 1000);
    });

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.currentTarget.previousElementSibling;
        const icon = e.currentTarget.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.setAttribute('data-lucide', 'eye-off');
        } else {
          input.type = 'password';
          icon.setAttribute('data-lucide', 'eye');
        }
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  switchTab(tab) {
    this.activeTab = tab;
    if (tab === 'signin') {
      this.tabSignin.classList.add('is-active');
      this.tabSignup.classList.remove('is-active');
      this.formSignin.style.display = 'block';
      this.formSignup.style.display = 'none';
    } else {
      this.tabSignin.classList.remove('is-active');
      this.tabSignup.classList.add('is-active');
      this.formSignin.style.display = 'none';
      this.formSignup.style.display = 'block';
    }
  }

  handleSignInSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');
    const emailFeedback = document.getElementById('signin-email-feedback');
    const passwordFeedback = document.getElementById('signin-password-feedback');

    let isValid = true;

    if (!isValidEmail(emailInput.value)) {
      emailInput.classList.add('is-invalid');
      emailFeedback.classList.add('is-error');
      isValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
      emailFeedback.classList.remove('is-error');
    }

    if (!isValidPassword(passwordInput.value)) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.classList.add('is-error');
      isValid = false;
    } else {
      passwordInput.classList.remove('is-invalid');
      passwordFeedback.classList.remove('is-error');
    }

    if (isValid) {
      store.login(emailInput.value);
      router.navigate('#/dashboard');
    }
  }

  handleSignUpSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm');

    const nameFeedback = document.getElementById('signup-name-feedback');
    const emailFeedback = document.getElementById('signup-email-feedback');
    const passwordFeedback = document.getElementById('signup-password-feedback');
    const confirmFeedback = document.getElementById('signup-confirm-feedback');

    let isValid = true;

    if (!nameInput.value || nameInput.value.trim().length < 3) {
      nameInput.classList.add('is-invalid');
      nameFeedback.classList.add('is-error');
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
      nameFeedback.classList.remove('is-error');
    }

    if (!isValidEmail(emailInput.value)) {
      emailInput.classList.add('is-invalid');
      emailFeedback.classList.add('is-error');
      isValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
      emailFeedback.classList.remove('is-error');
    }

    if (!isValidPassword(passwordInput.value)) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.classList.add('is-error');
      isValid = false;
    } else {
      passwordInput.classList.remove('is-invalid');
      passwordFeedback.classList.remove('is-error');
    }

    if (passwordInput.value !== confirmInput.value) {
      confirmInput.classList.add('is-invalid');
      confirmFeedback.classList.add('is-error');
      isValid = false;
    } else {
      confirmInput.classList.remove('is-invalid');
      confirmFeedback.classList.remove('is-error');
    }

    if (isValid) {
      store.login(emailInput.value, nameInput.value);
      router.navigate('#/dashboard');
    }
  }
}
