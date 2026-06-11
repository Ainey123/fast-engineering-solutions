import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base path ensures the app works perfectly on local, GitHub Pages, Vercel, or any other hosting provider without base route modifications.
  base: './'
});
