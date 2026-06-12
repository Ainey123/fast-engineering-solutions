(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new class{constructor(){this.events={},this.state={theme:localStorage.getItem(`fes_theme`)||`light`,user:JSON.parse(localStorage.getItem(`fes_user`))||null,bookings:JSON.parse(localStorage.getItem(`fes_bookings`))||null,notifications:JSON.parse(localStorage.getItem(`fes_notifications`))||null,onboardingComplete:localStorage.getItem(`fes_onboarding_complete`)===`true`},this.applyTheme(this.state.theme)}subscribe(e,t){return this.events[e]||(this.events[e]=[]),this.events[e].push(t),()=>{this.events[e]=this.events[e].filter(e=>e!==t)}}publish(e,t){this.events[e]&&this.events[e].forEach(e=>e(t))}setState(e,t){this.state[e]=t,e===`user`?localStorage.setItem(`fes_user`,JSON.stringify(t)):e===`bookings`?localStorage.setItem(`fes_bookings`,JSON.stringify(t)):e===`notifications`?localStorage.setItem(`fes_notifications`,JSON.stringify(t)):e===`onboardingComplete`&&localStorage.setItem(`fes_onboarding_complete`,t.toString()),this.publish(e,t),this.publish(`state_changed`,this.state)}getState(){return this.state}toggleTheme(){let e=this.state.theme===`light`?`dark`:`light`;localStorage.setItem(`fes_theme`,e),this.state.theme=e,this.applyTheme(e),this.publish(`theme`,e),this.publish(`state_changed`,this.state)}applyTheme(e){document.documentElement.setAttribute(`data-theme`,e)}login(e,t=`User`){let n={email:e,name:t.split(`@`)[0],avatar:null,loggedInAt:new Date().toISOString()};this.setState(`user`,n)}logout(){this.setState(`user`,null)}},t=new class{constructor(){this.routes=[],this.container=null,this.activeView=null,window.addEventListener(`hashchange`,()=>this.handleRouting())}register(e,t){let n=e.replace(/\/:([^/]+)/g,`/([^/]+)`).replace(/\//g,`\\/`),r=(e.match(/:([^/]+)/g)||[]).map(e=>e.slice(1));this.routes.push({path:e,regex:RegExp(`^${n}$`),paramNames:r,component:t})}init(e){if(this.container=document.getElementById(e),!this.container){console.error(`Mount container #${e} not found.`);return}this.handleRouting()}navigate(e){window.location.hash=e}handleRouting(){let[t,n]=(window.location.hash||`#/onboarding`).split(`?`),r=e.getState();if(!r.onboardingComplete&&t!==`#/onboarding`){this.navigate(`#/onboarding`);return}if(r.onboardingComplete&&!r.user&&t!==`#/auth`&&t!==`#/onboarding`){this.navigate(`#/auth`);return}if(r.user&&(t===`#/auth`||t===`#/onboarding`)){this.navigate(`#/dashboard`);return}let i=null,a=null;for(let e of this.routes)if(i=t.match(e.regex),i){a=e;break}if(!a){console.warn(`Route ${t} not found. Fallback to dashboard.`),this.navigate(`#/dashboard`);return}let o={};if(a.paramNames.length>0&&i&&a.paramNames.forEach((e,t)=>{o[e]=decodeURIComponent(i[t+1])}),n){let e=new URLSearchParams(n);for(let[t,n]of e.entries())o[t]=n}this.mount(a.component,o)}async mount(e,t){this.activeView&&typeof this.activeView.destroy==`function`&&this.activeView.destroy();let n=new e(t);this.activeView=n,this.container.innerHTML=`<div class="app-view-container animate-fade-in no-scrollbar"><div style="padding: 40px; text-align: center; color: var(--color-text-tertiary);">Loading...</div></div>`;try{let e=await n.render();this.container.innerHTML=e,typeof n.afterRender==`function`&&n.afterRender(),window.lucide&&typeof window.lucide.createIcons==`function`&&window.lucide.createIcons()}catch(e){console.error(`Render error:`,e),this.container.innerHTML=`
        <div class="app-view-container" style="padding: 40px; text-align: center;">
          <h3 style="color: var(--color-danger)">Render Error</h3>
          <p>${e.message}</p>
          <button class="btn btn-primary" style="margin-top: 20px" onclick="location.hash='#/dashboard'">Back to Home</button>
        </div>
      `}}},n=class{constructor(e={}){this.params=e,this.currentSlide=0,this.totalSlides=3,this.startX=0,this.currentX=0,this.isDragging=!1}async render(){return`
      <div class="app-view-container no-scrollbar" style="padding-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
        <!-- Top Theme Toggle -->
        <div style="display: flex; justify-content: flex-end; padding: 16px;">
          <button id="onboarding-theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
            <i data-lucide="${e.getState().theme===`light`?`moon`:`sun`}"></i>
          </button>
        </div>

        <!-- Carousel track -->
        <div class="carousel-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; position: relative; user-select: none;">
          <div class="carousel-track" id="carousel-track" style="display: flex; width: 300%; height: 75%; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: grab;">
            
            <!-- Slide 1 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-blue-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-primary);">
                <i data-lucide="building-2" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">Smart Construction</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Design-build civil execution managed by expert structural engineers with absolute budget assurance.</p>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-amber-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-secondary-hover);">
                <i data-lucide="phone-call" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">24/7 Tech Support</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Emergency dispatch and electrical/HVAC maintenance teams standing by round the clock.</p>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-slide" style="width: 33.333%; padding: 0 32px; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;">
              <div class="icon-wrapper" style="width: 120px; height: 120px; border-radius: var(--radius-full); background-color: var(--color-accent-green-tint); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; color: var(--color-success);">
                <i data-lucide="map-pin" style="width: 60px; height: 60px;"></i>
              </div>
              <h1 style="font-size: 1.75rem; margin-bottom: 12px; letter-spacing: -0.03em;">Live Tracking</h1>
              <p style="font-size: 0.95rem; max-width: 280px;">Track material dispatch, site inspections, and engineer execution states in real-time.</p>
            </div>

          </div>
        </div>

        <!-- Carousel Controls & Dots -->
        <div style="padding: 24px 32px 48px;">
          <!-- Indicators -->
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 40px;">
            <div class="carousel-dot active" data-index="0" style="width: 24px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-primary); transition: all 0.3s ease; cursor: pointer;"></div>
            <div class="carousel-dot" data-index="1" style="width: 8px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-input-border); transition: all 0.3s ease; cursor: pointer;"></div>
            <div class="carousel-dot" data-index="2" style="width: 8px; height: 8px; border-radius: var(--radius-full); background-color: var(--color-input-border); transition: all 0.3s ease; cursor: pointer;"></div>
          </div>

          <!-- Dual buttons -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <button id="btn-skip" class="btn btn-outline active-press" style="flex: 1; border: none; padding: 14px;">Skip</button>
            <button id="btn-next" class="btn btn-primary active-press" style="flex: 1.5; padding: 14px;">Next</button>
          </div>
        </div>
      </div>
    `}afterRender(){this.track=document.getElementById(`carousel-track`),this.dots=document.querySelectorAll(`.carousel-dot`),this.btnNext=document.getElementById(`btn-next`),this.btnSkip=document.getElementById(`btn-skip`),this.themeToggle=document.getElementById(`onboarding-theme-toggle`),this.themeToggle.addEventListener(`click`,()=>{e.toggleTheme();let t=e.getState().theme===`light`?`moon`:`sun`;this.themeToggle.innerHTML=`<i data-lucide="${t}"></i>`,window.lucide.createIcons()}),this.btnNext.addEventListener(`click`,()=>this.nextSlide()),this.btnSkip.addEventListener(`click`,()=>this.completeOnboarding()),this.track.addEventListener(`touchstart`,e=>this.touchStart(e),{passive:!0}),this.track.addEventListener(`touchmove`,e=>this.touchMove(e),{passive:!0}),this.track.addEventListener(`touchend`,()=>this.touchEnd()),this.track.addEventListener(`mousedown`,e=>this.dragStart(e)),window.addEventListener(`mousemove`,e=>this.dragMove(e)),window.addEventListener(`mouseup`,()=>this.dragEnd()),this.dots.forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.target.getAttribute(`data-index`));this.goToSlide(t)})}),this.autoSlideInterval=setInterval(()=>{this.currentSlide<this.totalSlides-1?this.nextSlide():this.goToSlide(0)},5e3)}destroy(){this.autoSlideInterval&&clearInterval(this.autoSlideInterval)}touchStart(e){this.startX=e.touches[0].clientX,this.isDragging=!0,clearInterval(this.autoSlideInterval)}touchMove(e){this.isDragging&&(this.currentX=e.touches[0].clientX)}touchEnd(){if(!this.isDragging)return;this.isDragging=!1;let e=this.startX-this.currentX;e>50?this.nextSlide():e<-50&&this.prevSlide()}dragStart(e){this.startX=e.clientX,this.isDragging=!0,this.track.style.cursor=`grabbing`,clearInterval(this.autoSlideInterval)}dragMove(e){this.isDragging&&(this.currentX=e.clientX)}dragEnd(){if(!this.isDragging)return;this.isDragging=!1,this.track.style.cursor=`grab`;let e=this.startX-this.currentX;e>50?this.nextSlide():e<-50&&this.prevSlide()}nextSlide(){this.currentSlide<this.totalSlides-1?this.goToSlide(this.currentSlide+1):this.completeOnboarding()}prevSlide(){this.currentSlide>0&&this.goToSlide(this.currentSlide-1)}goToSlide(e){this.currentSlide=e,this.track&&(this.track.style.transform=`translateX(-${e*33.333}%)`),this.dots.forEach((t,n)=>{n===e?(t.classList.add(`active`),t.style.width=`24px`,t.style.backgroundColor=`var(--color-primary)`):(t.classList.remove(`active`),t.style.width=`8px`,t.style.backgroundColor=`var(--color-input-border)`)}),this.btnNext&&(e===this.totalSlides-1?this.btnNext.innerHTML=`Get Started <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>`:this.btnNext.innerHTML=`Next`,window.lucide&&window.lucide.createIcons())}completeOnboarding(){e.setState(`onboardingComplete`,!0),t.navigate(`#/auth`)}};function r(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function i(e){return e&&e.length>=6}function a(){return`#FES-${Math.floor(1e3+Math.random()*9e3)}`}function o(e){let t=new Date(e),n=Math.floor((new Date-t)/1e3);if(n<60)return`Just now`;let r=Math.floor(n/60);if(r<60)return`${r}m ago`;let i=Math.floor(r/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function s(){return new Promise((e,t)=>{if(!navigator.geolocation){setTimeout(()=>{e({latitude:31.5204,longitude:74.3587,address:`Gulberg III, Lahore, Pakistan`})},1200);return}navigator.geolocation.getCurrentPosition(t=>{e({latitude:t.coords.latitude.toFixed(4),longitude:t.coords.longitude.toFixed(4),address:`Fetched via browser GPS`})},t=>{setTimeout(()=>{e({latitude:31.4805,longitude:74.321,address:`Model Town, Lahore, Pakistan (Simulated)`})},1e3)},{timeout:5e3})})}var c=class{constructor(e={}){this.params=e,this.activeTab=`signin`}async render(){return e.getState().theme,`
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
    `}afterRender(){this.tabSignin=document.getElementById(`tab-signin`),this.tabSignup=document.getElementById(`tab-signup`),this.formSignin=document.getElementById(`form-signin`),this.formSignup=document.getElementById(`form-signup`),this.googleBtn=document.getElementById(`btn-google`),this.forgotLink=document.getElementById(`link-forgot-password`),this.forgotModal=document.getElementById(`forgot-modal`),this.btnCloseModal=document.getElementById(`btn-close-modal`),this.btnSubmitForgot=document.getElementById(`btn-submit-forgot`),this.forgotEmailInput=document.getElementById(`forgot-email`),this.forgotEmailFeedback=document.getElementById(`forgot-email-feedback`),this.forgotSuccessMsg=document.getElementById(`forgot-success-msg`),this.tabSignin.addEventListener(`click`,()=>this.switchTab(`signin`)),this.tabSignup.addEventListener(`click`,()=>this.switchTab(`signup`)),this.formSignin.addEventListener(`submit`,e=>this.handleSignInSubmit(e)),this.formSignup.addEventListener(`submit`,e=>this.handleSignUpSubmit(e)),this.googleBtn.addEventListener(`click`,()=>{this.googleBtn.innerHTML=`Connecting Google...`,this.googleBtn.disabled=!0,setTimeout(()=>{e.login(`google.user@gmail.com`,`Google User`),t.navigate(`#/dashboard`)},1e3)}),this.forgotLink.addEventListener(`click`,()=>{this.forgotModal.style.display=`flex`,this.forgotEmailInput.focus()}),this.btnCloseModal.addEventListener(`click`,()=>{this.forgotModal.style.display=`none`,this.forgotSuccessMsg.style.display=`none`,this.forgotEmailInput.value=``}),this.btnSubmitForgot.addEventListener(`click`,()=>{let e=this.forgotEmailInput.value;if(!r(e)){this.forgotEmailInput.classList.add(`is-invalid`),this.forgotEmailFeedback.classList.add(`is-error`);return}this.forgotEmailInput.classList.remove(`is-invalid`),this.forgotEmailFeedback.classList.remove(`is-error`),this.btnSubmitForgot.disabled=!0,this.btnSubmitForgot.innerHTML=`Sending...`,setTimeout(()=>{this.forgotSuccessMsg.style.display=`block`,window.lucide&&window.lucide.createIcons(),setTimeout(()=>{this.forgotModal.style.display=`none`,this.forgotSuccessMsg.style.display=`none`,this.forgotEmailInput.value=``,this.btnSubmitForgot.disabled=!1,this.btnSubmitForgot.innerHTML=`Send Recovery Link`},1500)},1e3)}),document.querySelectorAll(`.toggle-password`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.previousElementSibling,n=e.currentTarget.querySelector(`i`);t.type===`password`?(t.type=`text`,n.setAttribute(`data-lucide`,`eye-off`)):(t.type=`password`,n.setAttribute(`data-lucide`,`eye`)),window.lucide&&window.lucide.createIcons()})})}switchTab(e){this.activeTab=e,e===`signin`?(this.tabSignin.classList.add(`is-active`),this.tabSignup.classList.remove(`is-active`),this.formSignin.style.display=`block`,this.formSignup.style.display=`none`):(this.tabSignin.classList.remove(`is-active`),this.tabSignup.classList.add(`is-active`),this.formSignin.style.display=`none`,this.formSignup.style.display=`block`)}handleSignInSubmit(n){n.preventDefault();let a=document.getElementById(`signin-email`),o=document.getElementById(`signin-password`),s=document.getElementById(`signin-email-feedback`),c=document.getElementById(`signin-password-feedback`),l=!0;r(a.value)?(a.classList.remove(`is-invalid`),s.classList.remove(`is-error`)):(a.classList.add(`is-invalid`),s.classList.add(`is-error`),l=!1),i(o.value)?(o.classList.remove(`is-invalid`),c.classList.remove(`is-error`)):(o.classList.add(`is-invalid`),c.classList.add(`is-error`),l=!1),l&&(e.login(a.value),t.navigate(`#/dashboard`))}handleSignUpSubmit(n){n.preventDefault();let a=document.getElementById(`signup-name`),o=document.getElementById(`signup-email`),s=document.getElementById(`signup-password`),c=document.getElementById(`signup-confirm`),l=document.getElementById(`signup-name-feedback`),u=document.getElementById(`signup-email-feedback`),d=document.getElementById(`signup-password-feedback`),f=document.getElementById(`signup-confirm-feedback`),p=!0;!a.value||a.value.trim().length<3?(a.classList.add(`is-invalid`),l.classList.add(`is-error`),p=!1):(a.classList.remove(`is-invalid`),l.classList.remove(`is-error`)),r(o.value)?(o.classList.remove(`is-invalid`),u.classList.remove(`is-error`)):(o.classList.add(`is-invalid`),u.classList.add(`is-error`),p=!1),i(s.value)?(s.classList.remove(`is-invalid`),d.classList.remove(`is-error`)):(s.classList.add(`is-invalid`),d.classList.add(`is-error`),p=!1),s.value===c.value?(c.classList.remove(`is-invalid`),f.classList.remove(`is-error`)):(c.classList.add(`is-invalid`),f.classList.add(`is-error`),p=!1),p&&(e.login(o.value,a.value),t.navigate(`#/dashboard`))}},l=[{id:`construction`,title:`Construction & Renovation`,shortDesc:`Design-build solutions, layout maps, structural upgrades, and full contracting.`,longDesc:`From blueprint design to full structural execution, our civil and structural engineering teams build premium residential, commercial, and industrial spaces with complete regulatory approvals.`,icon:`wrench`,color:`var(--color-primary)`,badgeColor:`badge-blue`,steps:[{num:1,name:`Structural Planning & Design`,desc:`Detailed architectural blueprints and layout design approval.`},{num:2,name:`Site Inspection & Soil Testing`,desc:`Rigorous engineering evaluation of the ground and surroundings.`},{num:3,name:`Digital Quote & Timeline`,desc:`Itemized material estimates, structural quotes, and milestones.`},{num:4,name:`Execution & Quality Sign-Off`,desc:`Civil construction managed by senior engineers with 100% safety standards.`}]},{id:`maintenance`,title:`Technical Maintenance`,shortDesc:`Preventative audits, HVAC, plumbing, structural repairs, and paint jobs.`,longDesc:`Ensure your building assets remain in peak condition. We provide detailed structural audit checks, central air-conditioning repair, high-grade waterproofing, and professional plumbing.`,icon:`settings`,color:`var(--color-secondary)`,badgeColor:`badge-amber`,steps:[{num:1,name:`Maintenance Logged`,desc:`Submit your structural, plumbing, or electrical issue via the app.`},{num:2,name:`Engineer Inspection`,desc:`Certified technician inspects the premises with thermal imaging tools.`},{num:3,name:`Service Costing Approval`,desc:`Get transparent breakdown pricing directly on your dashboard.`},{num:4,name:`Repair & System Check`,desc:`Rapid resolution of issue followed by post-repair load testing.`}]},{id:`facility`,title:`Facility & Power Management`,shortDesc:`Solar plant setup, diesel generator maintenance, and grid load audits.`,longDesc:`Power assurance and energy conservation. We design, install, and support solar PV arrays, backup industrial power generators, and perform complete energy consumption audits to save you money.`,icon:`activity`,color:`var(--color-info)`,badgeColor:`badge-blue`,steps:[{num:1,name:`Energy Consumption Audit`,desc:`Analysis of billing and electrical distribution boards.`},{num:2,name:`Solar / Power Design`,desc:`Custom specification drawings for solar inverters or generator setup.`},{num:3,name:`Quote & Financial Yield Model`,desc:`Project cost along with calculated ROI and payback timelines.`},{num:4,name:`Grid Integration & Testing`,desc:`Professional hook-up, net-metering setup, and commissioning.`}]},{id:`emergency`,title:`Emergency SOS Repair`,shortDesc:`Critical breakdowns, gas leakage, electrical fires, and water leak patching.`,longDesc:`Immediate dispatch for critical engineering hazards. If you have an electrical short-circuit, catastrophic structural breakdown, or immediate pipe bursts, trigger our emergency dispatch.`,icon:`alert-triangle`,color:`var(--color-danger)`,badgeColor:`badge-red`,isEmergency:!0,steps:[{num:1,name:`SOS Signal Transmitted`,desc:`Live GPS dispatch request logged immediately by operations desk.`},{num:2,name:`Rapid Response Confirmation`,desc:`Assigned emergency response team dials client in under 2 minutes.`},{num:3,name:`On-Site Hazard Mitigation`,desc:`Engineers arrive to isolate electrical, structural, or fluid hazards.`},{num:4,name:`Emergency Repair Execution`,desc:`Immediate work to stabilize systems with detailed report logs.`}]}];function u(e){return l.find(t=>t.id===e)}function d(){let e=new Date;return[{id:`n1`,title:`Quote Approved`,message:`Your electrical panel upgrade budget details have been approved by the planning board.`,timestamp:new Date(e.getTime()-120*1e3).toISOString(),type:`success`,read:!1},{id:`n2`,title:`Weather Warning: Lahore Rain`,message:`Heavy rains are expected in Lahore this week. Protect structures by booking professional waterproofing now.`,timestamp:new Date(e.getTime()-10800*1e3).toISOString(),type:`warning`,read:!1},{id:`n3`,title:`Site Inspector Assigned`,message:`Engr. Ahmed Khan has been dispatched to perform soil quality audits on your booking reference #FES-2194.`,timestamp:new Date(e.getTime()-360*60*1e3).toISOString(),type:`info`,read:!0},{id:`n4`,title:`Security Alert: Login Detected`,message:`A new web login session was initialized from browser Chrome on Windows 11.`,timestamp:new Date(e.getTime()-1440*60*1e3).toISOString(),type:`info`,read:!0}]}var f=class{constructor(e={}){this.params=e,this.activePromo=0,this.promoCount=3}async render(){let t=e.getState(),n=t.user?t.user.name:`Valued Client`;t.notifications||e.setState(`notifications`,d());let r=(e.getState().notifications||[]).filter(e=>!e.read).length,i=new Date().getHours(),a=`Hello`;return a=i<12?`Good Morning`:i<18?`Good Afternoon`:`Good Evening`,`
      <!-- Header Area -->
      <header class="header-nav">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: var(--radius-full); background-color: var(--color-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; border: 2px solid var(--color-surface-border);">
            ${n.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 600;">${a}</div>
            <div style="font-size: 0.95rem; font-weight: 700; letter-spacing: -0.015em;">${n}</div>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Theme Toggle -->
          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
            <i data-lucide="${t.theme===`light`?`moon`:`sun`}"></i>
          </button>
          
          <!-- Notifications Bell -->
          <button id="btn-notifications" style="position: relative; background: none; border: none; cursor: pointer; padding: 8px; color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); transition: background-color var(--transition-fast) ease;">
            <i data-lucide="bell" style="width: 22px; height: 22px;"></i>
            ${r>0?`
              <span style="position: absolute; top: 4px; right: 4px; background-color: var(--color-danger); color: white; font-size: 0.65rem; font-weight: 700; width: 16px; height: 16px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-surface);">
                ${r}
              </span>
            `:``}
          </button>
        </div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Interactive Promo Discount Area -->
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px; border: none; box-shadow: var(--shadow-md); position: relative; height: 140px;">
          <div id="promo-track" style="display: flex; width: 300%; height: 100%; transition: transform 0.5s ease;">
            
            <!-- Promo 1 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-secondary); color: var(--color-text-on-secondary); font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">June Special</span>
                <h3 style="font-size: 1.15rem; color: #FFF; font-weight: 700; margin-bottom: 4px;">50% Off First Soil Test</h3>
                <p style="font-size: 0.775rem; color: rgba(255,255,255,0.85);">Ensure structural safety prior to laying layout maps and bricks.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; opacity: 0.9;">Code: SOIL50</div>
            </div>

            <!-- Promo 2 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #1A1D20 0%, #2D3446 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-danger); color: white; font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Monsoon Prep</span>
                <h3 style="font-size: 1.15rem; color: #FFF; font-weight: 700; margin-bottom: 4px;">Waterproofing — 20% Off</h3>
                <p style="font-size: 0.775rem; color: rgba(255,255,255,0.85);">Complete chemical roof leakage & wall dampness protection before rains.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; opacity: 0.9;">Code: RAIN20</div>
            </div>

            <!-- Promo 3 -->
            <div style="width: 33.333%; padding: 20px; background: linear-gradient(135deg, #FFB000 0%, #E09B00 100%); color: white; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background-color: var(--color-primary); color: white; font-size: 0.65rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Solar Audits</span>
                <h3 style="font-size: 1.15rem; color: var(--color-text-on-primary); font-weight: 700; margin-bottom: 4px;">Save 100k PKR On Solar</h3>
                <p style="font-size: 0.775rem; color: var(--color-text-on-primary); opacity: 0.9;">Sign up for industrial power analysis & commercial net metering today.</p>
              </div>
              <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-on-primary);">Code: SOLARPOW</div>
            </div>

          </div>
          
          <!-- Promo Dots -->
          <div style="position: absolute; bottom: 12px; right: 16px; display: flex; gap: 6px;">
            <div class="promo-dot active" data-idx="0" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.9); transition: all 0.3s;"></div>
            <div class="promo-dot" data-idx="1" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.4); transition: all 0.3s;"></div>
            <div class="promo-dot" data-idx="2" style="width: 6px; height: 6px; border-radius: 50%; background-color: rgba(255,255,255,0.4); transition: all 0.3s;"></div>
          </div>
        </div>

        <!-- Section Title -->
        <div style="margin-bottom: 16px;">
          <h2 style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.025em; display: flex; align-items: center; gap: 8px;">
            Engineering Services
            <span class="badge badge-blue" style="font-size:0.65rem; padding: 2px 6px;">Certified</span>
          </h2>
        </div>

        <!-- Services Grid -->
        <div class="services-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          
          <!-- Construction -->
          <div class="card active-press service-card-item" data-id="construction" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="wrench" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Construction & Renovation</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Build & upgrades</p>
            </div>
          </div>

          <!-- Maintenance -->
          <div class="card active-press service-card-item" data-id="maintenance" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-accent-amber-tint); color: var(--color-secondary-hover); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="settings" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Technical Maintenance</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Audits & repairs</p>
            </div>
          </div>

          <!-- Facility -->
          <div class="card active-press service-card-item" data-id="facility" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: rgba(88, 86, 214, 0.1); color: var(--color-info); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="activity" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">Facility & Power</h3>
              <p style="font-size: 0.725rem; line-height: 1.3;">Solar & generators</p>
            </div>
          </div>

          <!-- Emergency SOS -->
          <div class="card active-press service-card-item pulse-sos-btn" data-id="emergency" style="padding: 16px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border-color: rgba(255, 59, 48, 0.3); background-color: var(--color-accent-red-tint);">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background-color: var(--color-danger); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(255,59,48,0.3);">
              <i data-lucide="alert-triangle" style="width: 22px; height: 22px;"></i>
            </div>
            <div style="margin-top: 16px;">
              <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2; color: var(--color-danger);">Emergency SOS Repair</h3>
              <p style="font-size: 0.725rem; line-height: 1.3; color: var(--color-danger); font-weight: 500;">Critical hazard response</p>
            </div>
          </div>

        </div>

        <!-- Quick Summary Tracker Mini Banner -->
        <div id="mini-tracker-card" class="card active-press" style="cursor: pointer; padding: 14px 16px; display: flex; align-items: center; gap: 14px; background-color: var(--color-surface); border-left: 4px solid var(--color-primary);">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="package-search" style="width: 20px; height: 20px;"></i>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.75rem; color: var(--color-text-tertiary); font-weight: 600;">ACTIVE SERVICE TRACKER</div>
            <div style="font-size: 0.85rem; font-weight: 700;">Job #FES-9842 is In Progress</div>
          </div>
          <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: var(--color-text-tertiary);"></i>
        </div>

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item is-active" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item" data-route="#/bookings">
          <i data-lucide="calendar"></i>
          <span>Bookings</span>
        </button>
        <button class="nav-item" data-route="#/support">
          <i data-lucide="phone"></i>
          <span>Support</span>
        </button>
        <button class="nav-item" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `}afterRender(){this.themeToggle=document.getElementById(`theme-toggle`),this.btnNotifications=document.getElementById(`btn-notifications`),this.promoTrack=document.getElementById(`promo-track`),this.promoDots=document.querySelectorAll(`.promo-dot`),this.serviceCards=document.querySelectorAll(`.service-card-item`),this.miniTracker=document.getElementById(`mini-tracker-card`),this.themeToggle.addEventListener(`click`,()=>{e.toggleTheme();let t=e.getState().theme===`light`?`moon`:`sun`;this.themeToggle.innerHTML=`<i data-lucide="${t}"></i>`,window.lucide.createIcons()}),this.btnNotifications.addEventListener(`click`,()=>{t.navigate(`#/notifications`)}),this.miniTracker&&this.miniTracker.addEventListener(`click`,()=>{t.navigate(`#/bookings`)}),this.serviceCards.forEach(e=>{e.addEventListener(`click`,e=>{let n=e.currentTarget.getAttribute(`data-id`);t.navigate(`#/service/${n}`)})}),this.promoInterval=setInterval(()=>{this.activePromo=(this.activePromo+1)%this.promoCount,this.updatePromoSlide()},4e3),this.promoDots.forEach(e=>{e.addEventListener(`click`,e=>{clearInterval(this.promoInterval);let t=parseInt(e.target.getAttribute(`data-idx`));this.activePromo=t,this.updatePromoSlide()})}),document.querySelectorAll(`.bottom-nav-bar .nav-item`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.currentTarget.getAttribute(`data-route`);t.navigate(n)})})}updatePromoSlide(){this.promoTrack&&(this.promoTrack.style.transform=`translateX(-${this.activePromo*33.333}%)`),this.promoDots.forEach((e,t)=>{t===this.activePromo?(e.classList.add(`active`),e.style.backgroundColor=`rgba(255,255,255,0.9)`,e.style.width=`12px`):(e.classList.remove(`active`),e.style.backgroundColor=`rgba(255,255,255,0.4)`,e.style.width=`6px`)})}destroy(){this.promoInterval&&clearInterval(this.promoInterval)}},p=class{constructor(e={}){this.params=e,this.service=u(e.id)}async render(){if(!this.service)throw Error(`Service ID "${this.params.id}" is invalid.`);let e={construction:`https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80`,maintenance:`https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80`,facility:`https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80`,emergency:`https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=600&auto=format&fit=crop&q=80`};return`
      <!-- Back Navigation Header -->
      <div style="position: absolute; top: 16px; left: 16px; z-index: 10; display: flex; gap: 8px;">
        <button id="btn-back-dashboard" class="active-press" style="width: 40px; height: 40px; border-radius: var(--radius-full); background-color: var(--color-surface); color: var(--color-text-primary); border: 1px solid var(--color-surface-border); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md); cursor: pointer;">
          <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
        </button>
      </div>

      <!-- Scroll container -->
      <div class="app-view-container no-scrollbar" id="service-scroll-container" style="padding-bottom: 96px;">
        
        <!-- Parallax Header Image Banner -->
        <div class="parallax-header" style="height: 240px; position: relative; overflow: hidden; transform-origin: top; background-color: #1A1D20;">
          <img id="parallax-img" src="${e[this.service.id]||e.construction}" alt="${this.service.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.1s linear;">
          <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, var(--color-bg-page) 98%);"></div>
        </div>

        <!-- Content Area -->
        <div style="padding: 20px; position: relative; margin-top: -24px; border-radius: var(--radius-lg) var(--radius-lg) 0 0; background-color: var(--color-bg-page);">
          
          <!-- Category Badge & Service Title -->
          <div style="margin-bottom: 12px;">
            <span class="badge ${this.service.badgeColor}" style="margin-bottom: 8px;">
              ${this.service.isEmergency?`Critical Dispatched`:`Standard Service`}
            </span>
            <h1 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em;">${this.service.title}</h1>
          </div>

          <!-- Description -->
          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 28px; color: var(--color-text-secondary);">
            ${this.service.longDesc}
          </p>

          <!-- Stepper Pipeline Header -->
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="route" style="color: var(--color-primary); width: 22px; height: 22px;"></i>
            Execution Pipeline
          </h2>

          <!-- Vertical Stepper Component -->
          <div class="vertical-stepper" style="position: relative; padding-left: 36px;">
            <!-- Connector Line -->
            <div style="position: absolute; left: 15px; top: 12px; bottom: 32px; width: 3px; background: linear-gradient(to bottom, var(--color-primary) 0%, var(--color-input-border) 80%); border-radius: var(--radius-full);"></div>
            
            <!-- Step Items -->
            ${this.service.steps.map((e,t)=>`
              <div class="stepper-item" style="position: relative; margin-bottom: 28px;">
                <!-- Bullet icon badge -->
                <div style="position: absolute; left: -36px; top: 0; width: 32px; height: 32px; border-radius: var(--radius-full); background-color: ${t===0?`var(--color-primary)`:`var(--color-surface)`}; border: 3px solid ${t===0?`var(--color-primary)`:`var(--color-input-border)`}; display: flex; align-items: center; justify-content: center; font-size: 0.775rem; font-weight: 800; color: ${t===0?`white`:`var(--color-text-tertiary)`}; box-shadow: var(--shadow-sm); z-index: 2;">
                  ${e.num}
                </div>
                <!-- Step description text -->
                <div style="padding-left: 12px;">
                  <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; color: ${t===0?`var(--color-primary)`:`var(--color-text-primary)`};">${e.name}</h3>
                  <p style="font-size: 0.825rem; line-height: 1.4; color: var(--color-text-secondary);">${e.desc}</p>
                </div>
              </div>
            `).join(``)}
          </div>

        </div>
      </div>

      <!-- Sticky Dual Action Buttons at Bottom -->
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: var(--color-nav-bg); border-top: 1px solid var(--color-nav-border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 16px; display: flex; gap: 12px; z-index: 100;">
        <button id="btn-whatsapp" class="btn btn-outline active-press" style="flex: 1; border-color: #25D366; color: #25D366; font-size: 0.9rem; padding: 14px 12px; background-color: transparent;">
          <i data-lucide="message-square" style="width: 18px; height: 18px;"></i> WhatsApp
        </button>
        <button id="btn-book-now" class="btn btn-primary active-press" style="flex: 2; font-size: 0.9rem; padding: 14px;">
          Book Service <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
        </button>
      </div>
    `}afterRender(){this.btnBack=document.getElementById(`btn-back-dashboard`),this.btnBook=document.getElementById(`btn-book-now`),this.btnWhatsapp=document.getElementById(`btn-whatsapp`),this.scrollContainer=document.getElementById(`service-scroll-container`),this.parallaxImg=document.getElementById(`parallax-img`),this.btnBack.addEventListener(`click`,()=>{t.navigate(`#/dashboard`)}),this.btnBook.addEventListener(`click`,()=>{t.navigate(`#/booking?service=${this.service.id}`)}),this.btnWhatsapp.addEventListener(`click`,()=>{let e=encodeURIComponent(`Hello Fast Engineering Solutions. I would like to query about the "${this.service.title}" service.`);window.open(`https://wa.me/923004545280?text=${e}`,`_blank`)}),this.scrollContainer&&this.parallaxImg&&this.scrollContainer.addEventListener(`scroll`,()=>{let e=this.scrollContainer.scrollTop;e>=0&&(this.parallaxImg.style.transform=`translateY(${e*.4}px)`)},{passive:!0})}},ee=class{constructor(t={}){this.params=t,this.currentStep=1,this.totalSteps=3,this.uploadedFiles=[];let n=e.getState();this.formData={name:n.user?n.user.name:``,phone:``,serviceId:this.params.service||`construction`,date:``,time:``,gpsLocation:``,gpsCoordinates:null}}async render(){return`
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
                ${l.map(e=>`
                  <option value="${e.id}" ${e.id===this.formData.serviceId?`selected`:``}>${e.title}</option>
                `).join(``)}
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
              <label class="form-label" for="booking-gps">GPS Location Address</label>
              <textarea id="booking-gps" class="form-control" style="resize: none; height: 80px;" placeholder="Fetch coordinates or type structural site address">${this.formData.gpsLocation}</textarea>
              <div class="form-feedback" id="booking-gps-feedback">Please provide target site coordinates or address.</div>
            </div>

            <button type="button" id="btn-fetch-gps" class="btn btn-secondary active-press btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i> Fetch Current GPS Location
            </button>
            <div id="gps-status" style="margin-top: 8px; font-size: 0.775rem; text-align: center; font-weight: 500; display: none;"></div>
          </div>

          <!-- STEP 3: MEDIA & BLUEPRINTS -->
          <div id="booking-step-3" class="step-panel" style="display: none;">
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label">Upload Site Blueprints/Photos</label>
              
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
            <div class="form-feedback" id="booking-files-feedback" style="margin-top: 8px;">Please upload at least one PDF blueprint or site photo.</div>
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
        <p style="font-size: 0.95rem; max-width: 300px; margin-bottom: 32px;">Your engineering request has been logged successfully. An officer will review details shortly.</p>

        <!-- Booking Tracker Card -->
        <div class="card" style="width: 100%; max-width: 340px; padding: 16px; margin-bottom: 40px; border-color: var(--color-primary); background-color: var(--color-accent-blue-tint);">
          <div style="font-size: 0.775rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase;">Unique Tracker Reference</div>
          <div id="success-tracker-id" style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-top: 4px;">#FES-9842</div>
        </div>

        <!-- Next Action Button -->
        <button id="btn-success-track" class="btn btn-primary active-press" style="width: 100%; max-width: 340px;">
          Track Progress <i data-lucide="activity" style="width:18px;height:18px;"></i>
        </button>
      </div>
    `}afterRender(){this.btnBack=document.getElementById(`btn-booking-back`),this.btnPrev=document.getElementById(`btn-wizard-prev`),this.btnNext=document.getElementById(`btn-wizard-next`),this.btnFetchGps=document.getElementById(`btn-fetch-gps`),this.filePicker=document.getElementById(`file-picker`),this.successOverlay=document.getElementById(`booking-success-overlay`),this.btnSuccessTrack=document.getElementById(`btn-success-track`);let e=document.getElementById(`booking-date`);e&&(e.min=new Date().toISOString().split(`T`)[0]),this.btnBack.addEventListener(`click`,()=>{window.history.back()}),this.btnPrev.addEventListener(`click`,()=>this.navigateStep(-1)),this.btnNext.addEventListener(`click`,()=>this.navigateStep(1)),this.btnFetchGps.addEventListener(`click`,()=>this.handleGpsFetch()),this.filePicker.addEventListener(`change`,e=>this.handleFileSelect(e)),this.btnSuccessTrack.addEventListener(`click`,()=>{t.navigate(`#/bookings`)})}navigateStep(e){if(e===1&&!this.validateCurrentStep())return;if(this.saveStepData(),this.currentStep+=e,this.currentStep>this.totalSteps){this.submitBooking();return}document.getElementById(`booking-step-1`).style.display=this.currentStep===1?`block`:`none`,document.getElementById(`booking-step-2`).style.display=this.currentStep===2?`block`:`none`,document.getElementById(`booking-step-3`).style.display=this.currentStep===3?`block`:`none`;let t=this.currentStep/this.totalSteps*100;document.getElementById(`step-progress-bar`).style.width=`${t}%`;let n=document.getElementById(`step-title-text`);this.currentStep===1?(n.textContent=`Client Info`,this.btnPrev.style.display=`none`,this.btnNext.innerHTML=`Next <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>`):this.currentStep===2?(n.textContent=`Logistics & GPS`,this.btnPrev.style.display=`block`,this.btnNext.innerHTML=`Next <i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i>`):this.currentStep===3&&(n.textContent=`Upload Attachments`,this.btnPrev.style.display=`block`,this.btnNext.innerHTML=`Confirm Booking <i data-lucide="check" style="width: 18px; height: 18px;"></i>`),window.lucide&&window.lucide.createIcons()}saveStepData(){this.currentStep===1?(this.formData.name=document.getElementById(`booking-name`).value,this.formData.phone=document.getElementById(`booking-phone`).value,this.formData.serviceId=document.getElementById(`booking-service`).value):this.currentStep===2&&(this.formData.date=document.getElementById(`booking-date`).value,this.formData.time=document.getElementById(`booking-time`).value,this.formData.gpsLocation=document.getElementById(`booking-gps`).value)}validateCurrentStep(){let e=!0;if(this.currentStep===1){let t=document.getElementById(`booking-name`).value.trim(),n=document.getElementById(`booking-phone`).value.trim(),r=document.getElementById(`booking-name-feedback`),i=document.getElementById(`booking-phone-feedback`);t?(document.getElementById(`booking-name`).classList.remove(`is-invalid`),r.classList.remove(`is-error`)):(document.getElementById(`booking-name`).classList.add(`is-invalid`),r.classList.add(`is-error`),e=!1),!n||n.length<8?(document.getElementById(`booking-phone`).classList.add(`is-invalid`),i.classList.add(`is-error`),e=!1):(document.getElementById(`booking-phone`).classList.remove(`is-invalid`),i.classList.remove(`is-error`))}else if(this.currentStep===2){let t=document.getElementById(`booking-date`).value,n=document.getElementById(`booking-time`).value,r=document.getElementById(`booking-gps`).value.trim(),i=document.getElementById(`booking-date-feedback`),a=document.getElementById(`booking-time-feedback`),o=document.getElementById(`booking-gps-feedback`);t?(document.getElementById(`booking-date`).classList.remove(`is-invalid`),i.classList.remove(`is-error`)):(document.getElementById(`booking-date`).classList.add(`is-invalid`),i.classList.add(`is-error`),e=!1),n?(document.getElementById(`booking-time`).classList.remove(`is-invalid`),a.classList.remove(`is-error`)):(document.getElementById(`booking-time`).classList.add(`is-invalid`),a.classList.add(`is-error`),e=!1),r?(document.getElementById(`booking-gps`).classList.remove(`is-invalid`),o.classList.remove(`is-error`)):(document.getElementById(`booking-gps`).classList.add(`is-invalid`),o.classList.add(`is-error`),e=!1)}else this.currentStep;return e}async handleGpsFetch(){let e=document.getElementById(`gps-status`),t=document.getElementById(`booking-gps`);if(this.btnFetchGps.disabled=!0,this.btnFetchGps.innerHTML=`<span style="border: 2px solid #FFF; border-top: 2px solid transparent; width:12px; height:12px; border-radius:50%; display:inline-block; animation: spin 1s infinite linear; margin-right:6px;"></span> Fetching GPS...`,e.style.display=`block`,e.style.color=`var(--color-text-tertiary)`,e.textContent=`Accessing device location API...`,!document.getElementById(`dynamic-spin-css`)){let e=document.createElement(`style`);e.id=`dynamic-spin-css`,e.textContent=`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,document.head.appendChild(e)}try{let n=await s();t.value=`${n.address}\n(GPS: ${n.latitude}, ${n.longitude})`,t.classList.remove(`is-invalid`),document.getElementById(`booking-gps-feedback`).classList.remove(`is-error`),e.style.color=`var(--color-success)`,e.textContent=`Coordinates locked: ${n.latitude}, ${n.longitude}`,this.formData.gpsCoordinates={lat:n.latitude,lng:n.longitude},this.formData.gpsLocation=t.value}catch{e.style.color=`var(--color-danger)`,e.textContent=`Failed to lock location. Please type manually.`}finally{this.btnFetchGps.disabled=!1,this.btnFetchGps.innerHTML=`<i data-lucide="map-pin" style="width: 16px; height: 16px;"></i> Fetch Current GPS Location`,window.lucide&&window.lucide.createIcons()}}handleFileSelect(e){Array.from(e.target.files).forEach(e=>{let t=(e.size/1024).toFixed(1);this.uploadedFiles.push({id:`file-`+Date.now()+Math.random().toString(36).substring(2,5),name:e.name,size:`${t} KB`})}),this.renderFileList()}removeFile(e){this.uploadedFiles=this.uploadedFiles.filter(t=>t.id!==e),this.renderFileList()}renderFileList(){let e=document.getElementById(`uploaded-files-list`);if(e){if(this.uploadedFiles.length===0){e.innerHTML=``;return}e.innerHTML=this.uploadedFiles.map(e=>`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background-color: var(--color-surface-hover); border: 1px solid var(--color-surface-border); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 80%;">
          <i data-lucide="file-text" style="color: var(--color-primary); width:18px; height:18px; flex-shrink: 0;"></i>
          <div style="display: flex; flex-direction: column; overflow: hidden;">
            <span style="font-size: 0.85rem; font-weight: 600; text-overflow: ellipsis; overflow: hidden;">${e.name}</span>
            <span style="font-size: 0.7rem; color: var(--color-text-tertiary);">${e.size}</span>
          </div>
        </div>
        <button type="button" class="btn-remove-file" data-id="${e.id}" style="background: none; border: none; color: var(--color-danger); cursor: pointer; padding: 4px;">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    `).join(``),e.querySelectorAll(`.btn-remove-file`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.getAttribute(`data-id`);this.removeFile(t)})}),window.lucide&&window.lucide.createIcons()}}submitBooking(){let t=a(),n=l.find(e=>e.id===this.formData.serviceId),r={id:t,serviceId:this.formData.serviceId,serviceName:n?n.title:`Engineering Work`,clientName:this.formData.name,phone:this.formData.phone,date:this.formData.date,time:this.formData.time,location:this.formData.gpsLocation,status:`Approved`,statusIndex:0,engineer:{name:`Engr. Ahmed Khan`,role:`Senior Project Engineer`,phone:`+923004545280`,avatar:`https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80`},gpsAddress:this.formData.gpsLocation,createdDate:new Date().toISOString()},i=e.getState(),o=i.bookings||[];o.unshift(r),e.setState(`bookings`,o);let s=i.notifications||[];s.unshift({id:`n-`+Date.now(),title:`New Service Request`,message:`Your booking for "${r.serviceName}" has been successfully logged with reference ${t}.`,timestamp:new Date().toISOString(),type:`success`,read:!1}),e.setState(`notifications`,s),document.getElementById(`success-tracker-id`).textContent=t,this.successOverlay.style.display=`flex`,window.lucide&&window.lucide.createIcons()}};function m(){return[{id:`FES-9842`,serviceId:`construction`,serviceName:`Construction & Renovation`,clientName:`M. Rafay Malik`,phone:`+92 321 8484123`,date:`2026-06-15`,time:`10:00 AM`,location:`DHA Phase 6, Lahore`,status:`In Progress`,statusIndex:2,engineer:{name:`Engr. Ahmed Khan`,role:`Senior Structural Engineer`,phone:`+923004545280`,avatar:`https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80`},gpsAddress:`DHA Phase 6, Lahore, Pakistan`,createdDate:new Date(Date.now()-2880*60*1e3).toISOString()},{id:`FES-7123`,serviceId:`maintenance`,serviceName:`Technical Maintenance`,clientName:`Zainab Bibi`,phone:`+92 312 9901452`,date:`2026-06-18`,time:`02:30 PM`,location:`Model Town, Lahore`,status:`Approved`,statusIndex:0,engineer:{name:`Engr. Bilal Shah`,role:`HVAC Operations Lead`,phone:`+923004545280`,avatar:`https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80`},gpsAddress:`Model Town Block C, Lahore`,createdDate:new Date(Date.now()-14400*1e3).toISOString()}]}var h=class{constructor(e={}){this.params=e,this.expandedBookingId=null}async render(){let t=e.getState();t.bookings||e.setState(`bookings`,m());let n=e.getState().bookings;!this.expandedBookingId&&n.length>0&&(this.expandedBookingId=n[0].id);let r=[`Approved`,`Dispatched`,`In Progress`,`Completed`];return`
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div> <!-- Spacer -->
        <span class="header-title">My Bookings</span>
        <button id="bookings-theme-toggle" class="theme-toggle-btn">
          <i data-lucide="${t.theme===`light`?`moon`:`sun`}"></i>
        </button>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        ${n.length===0?`
          <div style="text-align: center; padding: 48px 24px; color: var(--color-text-tertiary);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-surface-hover); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <i data-lucide="calendar-x" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">No Bookings Found</h3>
            <p style="font-size: 0.85rem; margin-bottom: 24px;">You have not logged any engineering service requests yet.</p>
            <button class="btn btn-primary" onclick="location.hash='#/booking'">Book A Service Now</button>
          </div>
        `:`
          <!-- Bookings List -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${n.map(e=>{let t=this.expandedBookingId===e.id,n=e.status===`Completed`?`badge-green`:e.status===`In Progress`?`badge-blue`:e.status===`Dispatched`?`badge-amber`:`badge-blue`,i=e.statusIndex/(r.length-1)*100;return`
                <div class="card booking-card" data-id="${e.id}" style="padding: 16px; cursor: pointer; border-color: ${t?`var(--color-primary)`:`var(--color-surface-border)`};">
                  
                  <!-- Card Header -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${t?`16px`:`0`}; transition: margin var(--transition-fast) ease;">
                    <div>
                      <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 600; text-transform: uppercase;">
                        Job Ref: ${e.id}
                      </div>
                      <h3 style="font-size: 1rem; font-weight: 700; margin-top: 2px;">
                        ${e.serviceName}
                      </h3>
                    </div>
                    <span class="badge ${n}">${e.status}</span>
                  </div>

                  ${t?`
                    <!-- Expanded Details Area -->
                    <div class="expanded-booking-details" style="animation: fade-in 0.3s ease;">
                      
                      <!-- Logistics Info Grid -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.8rem; background-color: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-md); margin-bottom: 20px;">
                        <div>
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">DATE & TIME</div>
                          <div style="font-weight: 600; margin-top: 2px;">${e.date} @ ${e.time}</div>
                        </div>
                        <div>
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">CONTACT</div>
                          <div style="font-weight: 600; margin-top: 2px;">${e.clientName}</div>
                        </div>
                        <div style="grid-column: span 2;">
                          <div style="color: var(--color-text-tertiary); font-weight: 600;">SITE ADDRESS</div>
                          <div style="font-weight: 600; margin-top: 2px; line-height: 1.3;">${e.location}</div>
                        </div>
                      </div>

                      <!-- State-driven Progress Tracker Stepper -->
                      <div style="margin-bottom: 24px;">
                        <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 16px;">Job Dispatch Status</h4>
                        
                        <div class="linear-stepper">
                          <!-- Filled line progress track -->
                          <div class="linear-stepper-progress" style="width: ${i}%;"></div>
                          
                          <!-- Step node bubbles -->
                          ${r.map((t,n)=>{let r=n<e.statusIndex,i=n===e.statusIndex,a=``;return r?a=`is-completed`:i&&(a=`is-active`),`
                              <div class="linear-step ${a}">
                                <div class="linear-step-indicator">
                                  ${r?`<i data-lucide="check" style="width:14px;height:14px;stroke-width:3;"></i>`:n+1}
                                </div>
                                <span class="linear-step-label">${t}</span>
                              </div>
                            `}).join(``)}
                        </div>
                      </div>

                      <!-- Assigned Engineer Card -->
                      ${e.engineer?`
                        <div class="card" style="padding: 12px; background-color: var(--color-surface-hover); border-color: var(--color-surface-border); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                          <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${e.engineer.avatar}" alt="${e.engineer.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary);">
                            <div>
                              <div style="font-size: 0.85rem; font-weight: 700;">${e.engineer.name}</div>
                              <div style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 500;">${e.engineer.role}</div>
                            </div>
                          </div>
                          <!-- Call to Dial button -->
                          <a href="tel:${e.engineer.phone}" class="btn btn-primary active-press btn-sm" style="width: auto; padding: 10px 14px; border-radius: var(--radius-full);">
                            <i data-lucide="phone" style="width: 14px; height: 14px;"></i> Dial
                          </a>
                        </div>
                      `:``}

                      <div style="text-align: center; margin-top: 16px; font-size: 0.75rem; color: var(--color-text-tertiary);">
                        Tap cards to collapse or view other bookings.
                      </div>

                    </div>
                  `:`
                    <!-- Collapsed Footer Summary -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--color-surface-border); font-size: 0.775rem; color: var(--color-text-secondary);">
                      <span>Date: ${e.date}</span>
                      <span style="font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 2px;">
                        Track Details <i data-lucide="chevron-down" style="width: 14px; height: 14px;"></i>
                      </span>
                    </div>
                  `}

                </div>
              `}).join(``)}
          </div>
        `}

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item is-active" data-route="#/bookings">
          <i data-lucide="calendar"></i>
          <span>Bookings</span>
        </button>
        <button class="nav-item" data-route="#/support">
          <i data-lucide="phone"></i>
          <span>Support</span>
        </button>
        <button class="nav-item" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `}afterRender(){this.themeToggle=document.getElementById(`bookings-theme-toggle`),this.bookingCards=document.querySelectorAll(`.booking-card`),this.themeToggle.addEventListener(`click`,()=>{e.toggleTheme();let t=e.getState().theme===`light`?`moon`:`sun`;this.themeToggle.innerHTML=`<i data-lucide="${t}"></i>`,window.lucide.createIcons()}),this.bookingCards.forEach(e=>{e.addEventListener(`click`,n=>{if(n.target.closest(`a`)||n.target.closest(`button`))return;let r=e.getAttribute(`data-id`);this.expandedBookingId===r?this.expandedBookingId=null:this.expandedBookingId=r,t.handleRouting()})}),document.querySelectorAll(`.bottom-nav-bar .nav-item`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.currentTarget.getAttribute(`data-route`);t.navigate(n)})})}},g=class{constructor(e={}){this.params=e}async render(){let t=e.getState().notifications||[];return`
      <!-- Header with back button -->
      <header class="header-nav">
        <button id="btn-notify-back" class="theme-toggle-btn" style="color: var(--color-text-primary);">
          <i data-lucide="chevron-left" style="width: 24px; height: 24px;"></i>
        </button>
        <span class="header-title">Notifications</span>
        
        <!-- Mark all as read button -->
        ${t.filter(e=>!e.read).length>0?`
          <button id="btn-mark-read" style="background: none; border: none; color: var(--color-primary); font-size: 0.775rem; font-weight: 700; cursor: pointer; padding: 6px;">
            Mark Read
          </button>
        `:`<div style="width: 50px;"></div>`}
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 80px;">
        
        ${t.length===0?`
          <div style="text-align: center; padding: 64px 24px; color: var(--color-text-tertiary);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-surface-hover); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <i data-lucide="bell-off" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Inbox is Clear</h3>
            <p style="font-size: 0.85rem;">You do not have any pending structural, dispatch, or weather warnings.</p>
          </div>
        `:`
          <!-- Notifications list wrapper -->
          <div id="notifications-list-wrapper" style="display: flex; flex-direction: column; gap: 12px;">
            ${t.map(e=>{let t=`bell`,n=`var(--color-primary)`,r=`var(--color-accent-blue-tint)`;return e.type===`success`?(t=`check-circle`,n=`var(--color-success)`,r=`var(--color-accent-green-tint)`):e.type===`warning`?(t=`alert-triangle`,n=`var(--color-secondary-hover)`,r=`var(--color-accent-amber-tint)`):e.type===`danger`&&(t=`zap`,n=`var(--color-danger)`,r=`var(--color-accent-red-tint)`),`
                <div class="card notif-card-item ${e.read?``:`unread-state`}" data-id="${e.id}" style="padding: 14px 16px; position: relative; overflow: hidden; transition: all 0.3s ease; border-left: 4px solid ${e.read?`var(--color-surface-border)`:`var(--color-primary)`}; display: flex; gap: 12px; align-items: flex-start;">
                  
                  <!-- Left side icon status -->
                  <div style="width: 38px; height: 38px; border-radius: var(--radius-sm); background-color: ${r}; color: ${n}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                    <i data-lucide="${t}" style="width: 20px; height: 20px;"></i>
                  </div>

                  <!-- Notification message details -->
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                      <h3 style="font-size: 0.9rem; font-weight: 700; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${e.title}
                      </h3>
                      <span style="font-size: 0.725rem; color: var(--color-text-tertiary); font-weight: 500; flex-shrink: 0; margin-top: 2px;">
                        ${o(e.timestamp)}
                      </span>
                    </div>
                    <p style="font-size: 0.8rem; line-height: 1.4; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${e.message}
                    </p>
                  </div>

                  <!-- Close/Swipe to dismiss handler -->
                  <button class="btn-dismiss-notif" data-id="${e.id}" style="background: none; border: none; cursor: pointer; color: var(--color-text-tertiary); display: flex; align-items: center; justify-content: center; padding: 4px; margin-top: 2px;" title="Dismiss">
                    <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                  </button>

                </div>
              `}).join(``)}
          </div>
        `}

      </div>

      <!-- Add specific styles for unread indicator -->
      <style>
        .unread-state {
          background-color: var(--color-input-focus) !important;
        }
      </style>
    `}afterRender(){this.btnBack=document.getElementById(`btn-notify-back`),this.btnMarkRead=document.getElementById(`btn-mark-read`),this.btnBack.addEventListener(`click`,()=>{t.navigate(`#/dashboard`)}),this.btnMarkRead&&this.btnMarkRead.addEventListener(`click`,()=>{let n=(e.getState().notifications||[]).map(e=>({...e,read:!0}));e.setState(`notifications`,n),t.handleRouting()}),document.querySelectorAll(`.btn-dismiss-notif`).forEach(n=>{n.addEventListener(`click`,n=>{let r=n.currentTarget.getAttribute(`data-id`),i=n.currentTarget.closest(`.notif-card-item`);i.style.animation=`slide-out-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`,setTimeout(()=>{let n=(e.getState().notifications||[]).filter(e=>e.id!==r);e.setState(`notifications`,n),t.handleRouting()},300)})}),document.querySelectorAll(`.notif-card-item`).forEach(n=>{n.addEventListener(`click`,r=>{if(r.target.closest(`.btn-dismiss-notif`))return;let i=n.getAttribute(`data-id`),a=(e.getState().notifications||[]).map(e=>e.id===i?{...e,read:!0}:e);e.setState(`notifications`,a),t.handleRouting()})})}},te=class{constructor(e={}){this.params=e,this.activeFaq=null}async render(){return`
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div>
        <span class="header-title">Technical Support</span>
        <button id="support-theme-toggle" class="theme-toggle-btn">
          <i data-lucide="${e.getState().theme===`light`?`moon`:`sun`}"></i>
        </button>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Contact Action Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
          
          <!-- Call hotline card -->
          <a href="tel:+923004545280" class="card active-press" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 20px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--color-accent-blue-tint); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              <i data-lucide="phone" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <h3 style="font-size: 0.9rem; font-weight: 700;">Voice Hotline</h3>
              <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 2px;">Direct dialing</p>
            </div>
          </a>

          <!-- WhatsApp hotline card -->
          <button id="btn-support-wa" class="card active-press" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 20px; background: none; border: 1px solid var(--color-surface-border); width: 100%;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background-color: rgba(37, 211, 102, 0.1); color: #25D366; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="message-square" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <h3 style="font-size: 0.9rem; font-weight: 700;">WhatsApp Desk</h3>
              <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 2px;">Chat with operations</p>
            </div>
          </button>

        </div>

        <!-- Section Title -->
        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em;">Frequently Asked Questions</h2>

        <!-- FAQ List -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${[{q:`How long does a site inspection take?`,a:`Standard engineering site inspection takes 2-4 hours. A certified surveyor reviews structural designs and checks for land load ratings.`},{q:`What is included in the digital quote?`,a:`You receive an itemized bill of materials (BOM), project timelines, engineering layout maps, and government authority approval costs.`},{q:`Can I reschedule an approved booking?`,a:`Yes. Tap your booking card under "My Bookings" and contact your assigned engineer or call operations directly.`},{q:`Are solar energy reports net-metering ready?`,a:`Absolutely. All facility energy and solar PV arrays audits comply with local power distribution board guidelines for net metering integration.`}].map((e,t)=>{let n=this.activeFaq===t;return`
              <div class="card faq-card-item" data-idx="${t}" style="padding: 16px; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                  <h3 style="font-size: 0.9rem; font-weight: 700; line-height: 1.3;">${e.q}</h3>
                  <i data-lucide="${n?`chevron-up`:`chevron-down`}" style="width: 18px; height: 18px; color: var(--color-text-tertiary); flex-shrink: 0;"></i>
                </div>
                ${n?`
                  <p style="font-size: 0.8rem; line-height: 1.4; color: var(--color-text-secondary); margin-top: 10px; border-top: 1px dashed var(--color-surface-border); padding-top: 10px; animation: fade-in 0.25s ease;">
                    ${e.a}
                  </p>
                `:``}
              </div>
            `}).join(``)}
        </div>

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item" data-route="#/bookings">
          <i data-lucide="calendar"></i>
          <span>Bookings</span>
        </button>
        <button class="nav-item is-active" data-route="#/support">
          <i data-lucide="phone"></i>
          <span>Support</span>
        </button>
        <button class="nav-item" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `}afterRender(){this.themeToggle=document.getElementById(`support-theme-toggle`),this.faqCards=document.querySelectorAll(`.faq-card-item`),this.btnSupportWa=document.getElementById(`btn-support-wa`),this.themeToggle.addEventListener(`click`,()=>{e.toggleTheme();let t=e.getState().theme===`light`?`moon`:`sun`;this.themeToggle.innerHTML=`<i data-lucide="${t}"></i>`,window.lucide.createIcons()}),this.faqCards.forEach(e=>{e.addEventListener(`click`,()=>{let n=parseInt(e.getAttribute(`data-idx`));this.activeFaq===n?this.activeFaq=null:this.activeFaq=n,t.handleRouting()})}),this.btnSupportWa.addEventListener(`click`,()=>{window.open(`https://wa.me/923004545280?text=Hi%20Fast%20Engineering%20Support%2C%20I%20need%20assistance%20regarding%20an%20ongoing%20project.`,`_blank`)}),document.querySelectorAll(`.bottom-nav-bar .nav-item`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.currentTarget.getAttribute(`data-route`);t.navigate(n)})})}},ne=class{constructor(e={}){this.params=e}async render(){let t=e.getState(),n=t.user?t.user.name:`Valued Client`,r=t.user?t.user.email:`client@domain.com`,i=t.theme===`dark`;return`
      <!-- Header -->
      <header class="header-nav">
        <div style="width: 40px;"></div>
        <span class="header-title">My Profile</span>
        <div style="width: 40px;"></div>
      </header>

      <div class="app-view-container no-scrollbar" style="padding: 16px 16px 88px;">
        
        <!-- Profile Banner -->
        <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-bottom: 24px; padding: 24px 16px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 800; border: 4px solid var(--color-surface-border); box-shadow: var(--shadow-sm);">
            ${n.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">${n}</h2>
            <p style="font-size: 0.8rem; color: var(--color-text-tertiary); margin-top: 2px;">FES-ID: #M-${Math.floor(1e3+Math.random()*9e3)}</p>
          </div>
        </div>

        <!-- Settings Cards Group -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: 12px; padding-left: 4px;">Account Settings</h3>
        
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
          <!-- Profile details row -->
          <div style="padding: 14px 16px; border-bottom: 1px solid var(--color-surface-border); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <i data-lucide="mail" style="color: var(--color-text-tertiary); width: 18px; height: 18px;"></i>
              <span style="font-size: 0.875rem; font-weight: 500;">Email Address</span>
            </div>
            <span style="font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 600;">${r}</span>
          </div>

          <!-- Light/Dark Mode switch row -->
          <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <i data-lucide="${i?`moon`:`sun`}" style="color: var(--color-text-tertiary); width: 18px; height: 18px;"></i>
              <span style="font-size: 0.875rem; font-weight: 500;">Dark Theme</span>
            </div>
            <!-- Toggle Slider Switch -->
            <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
              <input type="checkbox" id="profile-theme-switch" ${i?`checked`:``} style="opacity: 0; width: 0; height: 0;">
              <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-input-border); transition: .3s; border-radius: 34px;"></span>
            </label>
          </div>
        </div>

        <!-- Support Info Group -->
        <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: 12px; padding-left: 4px;">System Information</h3>
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 32px;">
          <div style="padding: 14px 16px; border-bottom: 1px solid var(--color-surface-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <span style="font-weight: 500;">App Version</span>
            <span style="color: var(--color-text-tertiary); font-weight: 600;">v1.0.0 (Production)</span>
          </div>
          <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <span style="font-weight: 500;">PWA Status</span>
            <span style="color: var(--color-success); font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Active
            </span>
          </div>
        </div>

        <!-- Log Out Button -->
        <button id="btn-logout" class="btn btn-outline active-press" style="color: var(--color-danger); border-color: var(--color-danger); background: transparent; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="log-out" style="width: 18px; height: 18px;"></i> Sign Out
        </button>

      </div>

      <!-- Bottom Floating Nav Bar -->
      <nav class="bottom-nav-bar">
        <button class="nav-item" data-route="#/dashboard">
          <i data-lucide="home"></i>
          <span>Home</span>
        </button>
        <button class="nav-item" data-route="#/bookings">
          <i data-lucide="calendar"></i>
          <span>Bookings</span>
        </button>
        <button class="nav-item" data-route="#/support">
          <i data-lucide="phone"></i>
          <span>Support</span>
        </button>
        <button class="nav-item is-active" data-route="#/profile">
          <i data-lucide="user"></i>
          <span>Profile</span>
        </button>
      </nav>

      <!-- Toggle Switcher Custom Styles -->
      <style>
        .switch-toggle input:checked + .slider {
          background-color: var(--color-primary);
        }
        .switch-toggle .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        .switch-toggle input:checked + .slider:before {
          transform: translateX(20px);
        }
      </style>
    `}afterRender(){this.themeSwitch=document.getElementById(`profile-theme-switch`),this.btnLogout=document.getElementById(`btn-logout`),this.themeSwitch.addEventListener(`change`,()=>{e.toggleTheme(),t.handleRouting()}),this.btnLogout.addEventListener(`click`,()=>{e.logout(),t.navigate(`#/auth`)}),document.querySelectorAll(`.bottom-nav-bar .nav-item`).forEach(e=>{e.addEventListener(`click`,e=>{let n=e.currentTarget.getAttribute(`data-route`);t.navigate(n)})})}},_={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":2,"stroke-linecap":`round`,"stroke-linejoin":`round`},v=([e,t,n])=>{let r=document.createElementNS(`http://www.w3.org/2000/svg`,e);return Object.keys(t).forEach(e=>{r.setAttribute(e,String(t[e]))}),n?.length&&n.forEach(e=>{let t=v(e);r.appendChild(t)}),r},y=(e,t={})=>v([`svg`,{..._,...t},e]),b=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},x=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),S=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),C=e=>{let t=S(e);return t.charAt(0).toUpperCase()+t.slice(1)},w=e=>Array.from(e.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),T=e=>typeof e==`string`?e:!e||!e.class?``:e.class&&typeof e.class==`string`?e.class.split(` `):e.class&&Array.isArray(e.class)?e.class:``,E=(e,{nameAttr:t,icons:n,attrs:r})=>{let i=e.getAttribute(t);if(i==null)return;let a=n[C(i)];if(!a)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);let o=w(e),s=b(o)?{}:{"aria-hidden":`true`},c={..._,"data-lucide":i,...s,...r,...o},l=T(o),u=T(r),d=x(`lucide`,`lucide-${i}`,...l,...u);d&&Object.assign(c,{class:d});let f=y(a,c);return e.parentNode?.replaceChild(f,e)},D=[[`path`,{d:`M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2`}]],O=[[`path`,{d:`m12 19-7-7 7-7`}],[`path`,{d:`M19 12H5`}]],k=[[`path`,{d:`M5 12h14`}],[`path`,{d:`m12 5 7 7-7 7`}]],A=[[`path`,{d:`M10.268 21a2 2 0 0 0 3.464 0`}],[`path`,{d:`M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742`}],[`path`,{d:`m2 2 20 20`}],[`path`,{d:`M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05`}]],j=[[`path`,{d:`M10.268 21a2 2 0 0 0 3.464 0`}],[`path`,{d:`M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`}]],M=[[`path`,{d:`M10 12h4`}],[`path`,{d:`M10 8h4`}],[`path`,{d:`M14 21v-3a2 2 0 0 0-4 0v3`}],[`path`,{d:`M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2`}],[`path`,{d:`M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16`}]],N=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`m14 14-4 4`}],[`path`,{d:`m10 14 4 4`}]],P=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}]],F=[[`path`,{d:`M20 6 9 17l-5-5`}]],I=[[`path`,{d:`m6 9 6 6 6-6`}]],L=[[`path`,{d:`m15 18-6-6 6-6`}]],R=[[`path`,{d:`m18 15-6-6-6 6`}]],z=[[`path`,{d:`M21.801 10A10 10 0 1 1 17 3.335`}],[`path`,{d:`m9 11 3 3L22 4`}]],B=[[`path`,{d:`M12 13v8`}],[`path`,{d:`M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242`}],[`path`,{d:`m8 17 4-4 4 4`}]],V=[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`}],[`path`,{d:`m2 2 20 20`}]],re=[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],H=[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`}],[`path`,{d:`M10 9H8`}],[`path`,{d:`M16 13H8`}],[`path`,{d:`M16 17H8`}]],U=[[`path`,{d:`M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`}],[`path`,{d:`M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`}]],W=[[`path`,{d:`m10 17 5-5-5-5`}],[`path`,{d:`M15 12H3`}],[`path`,{d:`M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4`}]],G=[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`}]],K=[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`}],[`circle`,{cx:`12`,cy:`10`,r:`3`}]],q=[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`}]],J=[[`path`,{d:`M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`}]],Y=[[`path`,{d:`M12 22V12`}],[`path`,{d:`M20.27 18.27 22 20`}],[`path`,{d:`M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559`}],[`path`,{d:`M3.29 7 12 12l8.71-5`}],[`path`,{d:`m7.5 4.27 8.997 5.148`}],[`circle`,{cx:`18.5`,cy:`16.5`,r:`2.5`}]],X=[[`path`,{d:`M13 2a9 9 0 0 1 9 9`}],[`path`,{d:`M13 6a5 5 0 0 1 5 5`}],[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],ie=[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`}]],ae=[[`circle`,{cx:`6`,cy:`19`,r:`3`}],[`path`,{d:`M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15`}],[`circle`,{cx:`18`,cy:`5`,r:`3`}]],oe=[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`}],[`circle`,{cx:`12`,cy:`12`,r:`3`}]],se=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`}],[`path`,{d:`m9 12 2 2 4-4`}]],ce=[[`circle`,{cx:`12`,cy:`12`,r:`4`}],[`path`,{d:`M12 2v2`}],[`path`,{d:`M12 20v2`}],[`path`,{d:`m4.93 4.93 1.41 1.41`}],[`path`,{d:`m17.66 17.66 1.41 1.41`}],[`path`,{d:`M2 12h2`}],[`path`,{d:`M20 12h2`}],[`path`,{d:`m6.34 17.66-1.41 1.41`}],[`path`,{d:`m19.07 4.93-1.41 1.41`}]],Z=[[`path`,{d:`M10 11v6`}],[`path`,{d:`M14 11v6`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`}],[`path`,{d:`M3 6h18`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`}]],le=[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`}],[`path`,{d:`M12 9v4`}],[`path`,{d:`M12 17h.01`}]],ue=[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`9`,cy:`7`,r:`4`}],[`line`,{x1:`19`,x2:`19`,y1:`8`,y2:`14`}],[`line`,{x1:`22`,x2:`16`,y1:`11`,y2:`11`}]],de=[[`path`,{d:`M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`}],[`circle`,{cx:`12`,cy:`7`,r:`4`}]],fe=[[`path`,{d:`M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`}]],pe=[[`path`,{d:`M18 6 6 18`}],[`path`,{d:`m6 6 12 12`}]],me=[[`path`,{d:`M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`}]],Q=({icons:e={},nameAttr:t=`data-lucide`,attrs:n={},root:r=document,inTemplates:i}={})=>{if(!Object.values(e).length)throw Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(r===void 0)throw Error("`createIcons()` only works in a browser environment.");if(Array.from(r.querySelectorAll(`[${t}]`)).forEach(r=>E(r,{nameAttr:t,icons:e,attrs:n})),i&&Array.from(r.querySelectorAll(`template`)).forEach(r=>Q({icons:e,nameAttr:t,attrs:n,root:r.content,inTemplates:i})),t===`data-lucide`){let t=r.querySelectorAll(`[icon-name]`);t.length>0&&(console.warn(`[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide`),Array.from(t).forEach(t=>E(t,{nameAttr:`icon-name`,icons:e,attrs:n})))}};window.lucide={createIcons:()=>Q({icons:{Wrench:fe,Settings:oe,Activity:D,AlertTriangle:le,ArrowLeft:O,MessageSquare:q,ArrowRight:k,ShieldCheck:se,LogIn:W,Eye:re,EyeOff:V,X:pe,UserPlus:ue,CheckCircle:z,Bell:j,Home:U,Calendar:P,Phone:ie,User:de,CalendarX:N,ChevronDown:I,ChevronLeft:L,ChevronUp:R,Check:F,FileText:H,Trash2:Z,Mail:G,Moon:J,Sun:ce,Building2:M,PhoneCall:X,MapPin:K,PackageSearch:Y,BellOff:A,UploadCloud:B,Zap:me,Route:ae}})},t.register(`#/onboarding`,n),t.register(`#/auth`,c),t.register(`#/dashboard`,f),t.register(`#/service/:id`,p),t.register(`#/booking`,ee),t.register(`#/bookings`,h),t.register(`#/notifications`,g),t.register(`#/support`,te),t.register(`#/profile`,ne);function $(){let e=document.getElementById(`app`);e&&!document.getElementById(`app-simulator`)&&(e.innerHTML=`<div id="app-simulator"></div>`),t.init(`app-simulator`)}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,$):$();