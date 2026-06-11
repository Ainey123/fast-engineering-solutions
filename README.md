# Fast Engineering Solutions (Pvt.) Ltd. — Smart Hub PWA

A production-grade, highly optimized, multi-page Progressive Web App (PWA) built for **Fast Engineering Solutions (Pvt.) Ltd.** It provides corporate clients and site managers with streamlined scheduling, real-time civil construction progress tracking, and 24/7 technical breakdown maintenance logs.

## 🔗 Live Application
* **Live Deployment Link**: [https://ainey123.github.io/fast-engineering-solutions/](https://ainey123.github.io/fast-engineering-solutions/)
* **GitHub Repository**: [https://github.com/Ainey123/fast-engineering-solutions](https://github.com/Ainey123/fast-engineering-solutions)

---

## 📱 Features & Pages Matrix

The application includes 9 interconnected hash-routed views and unified state routing:

1. **Intro Onboarding Carousel (`#/onboarding`)**: A touch-swipeable 3-card carousel featuring SVG illustrations, slide indicators, and routing controls.
2. **Secure Authentication Hub (`#/auth`)**: Tab-driven sign-in/sign-up forms with live email syntax checking, password length gates, and a modal forgot-password wizard.
3. **Smart Services Dashboard (`#/dashboard`)**: A personalized lobby dashboard showing dynamic time-based greetings, monthly discount carousels, active tracking shortcuts, and a 2x2 services grid.
4. **Dynamic Workflow Explainer (`#/service/:id`)**: Parallax category headers, step-by-step connection pipelines, and quick WhatsApp hotline links (`+92 300 4545280`).
5. **Advanced Booking Wizard (`#/booking`)**: A multi-step form wizard incorporating dynamic client input fields, date/time pickers, GPS location coordinates lookup, file selectors, and checkmark overlays.
6. **Progress Tracker (`#/bookings`)**: Dynamic linear progress bars tracking dispatcher status (Approved -> Dispatched -> In Progress -> Completed) and assigned engineer call profiles.
7. **Alerts Inbox (`#/notifications`)**: Relative timestamps, unread indicator lights, bulk read markers, and card dismiss animations.
8. **Technical Support Center (`#/support`)**: Accordion FAQs, voice phone dial links, and WhatsApp hotlines.
9. **Profile Configuration Settings (`#/profile`)**: Light/Dark theme toggles and session logouts.

---

## 🛠️ Technology Stack & Architecture

* **Build Bundler**: [Vite 6+](https://vite.dev/) (lightning-fast dev server and tree-shaken production asset packaging).
* **Script Logic**: Vanilla JavaScript (ES Modules) with custom hash-routing and pub/sub event stores.
* **Styling**: Modern CSS3 custom variables (tokens), flexbox layouts, media query scaling, and keyframe animations.
* **Asset Optimization**: Tree-shaken [Lucide Icons](https://lucide.dev/) (only packaging icons explicitly loaded by views).
* **Design Pattern**: Single Page Application (SPA) with routing guards to prevent unauthenticated access.
* **PWA Configurations**: Configured `manifest.json` and apple-mobile-web-app configuration tags for native mobile installations.

---

## 📂 Project Structure

```
FastEngineeringPWA/
├── index.html               # Main HTML app entry point
├── manifest.json            # Web app installation configuration
├── vite.config.js           # Vite environment configuration
├── package.json             # NPM package scripts & dependencies
├── README.md                # Documentation guide
├── public/                  # Static assets folder
│   ├── favicon.svg          # Brand SVG icon
│   └── manifest.json        # Copied asset config
└── src/
    ├── main.js              # Application bootstrapper
    ├── core/
    │   ├── router.js        # Parameterized hash-based router
    │   ├── store.js         # Pub/Sub reactive global store
    │   └── utils.js         # Form validators and GPS controllers
    ├── styles/
    │   ├── variables.css    # Design colors (Light/Dark themes)
    │   ├── base.css         # Typography, reset, and phone simulator
    │   ├── components.css   # Steppers, cards, badging, form styles
    │   ├── animations.css   # Keyframe pulse, slider, and fades
    │   └── index.css        # Aggregated style imports
    ├── data/
    │   ├── services.js      # Service configuration map
    │   ├── bookings.js      # Mock trackers datastore
    │   └── notifications.js # System alerts datastore
    └── pages/
        ├── onboarding.js    # Swipeable carousel intro card
        ├── auth.js          # Authentication Hub
        ├── dashboard.js     # Main Services Hub
        ├── service.js       # Stepper explainer page
        ├── booking.js       # Advanced booking wizard
        ├── bookings.js      # Progress tracker page
        ├── notifications.js # Alerts repository view
        ├── support.js       # Accordion FAQ help desk
        └── profile.js       # Theme and session managers
```

---

## 🚀 Local Installation & Development

To download the repository and spin up the development environment locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ainey123/fast-engineering-solutions.git
   cd fast-engineering-solutions
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   *The application will boot at `http://localhost:5173/` by default.*

4. **Verify production bundling**:
   ```bash
   npm run build
   ```

---

## 📦 Deployment to GitHub Pages

The application is configured to build and deploy to GitHub Pages automatically:

```bash
npm run deploy
```
*This triggers `predeploy` (which compiles assets using `vite build` into `/dist`) followed by `gh-pages` which pushes the compiled bundle to the `gh-pages` branch on the remote repository.*
