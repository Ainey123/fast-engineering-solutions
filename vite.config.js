import { defineConfig } from 'vite';

export default defineConfig({
  // Base path config matching GitHub Pages repository naming convention in production
  base: process.env.NODE_ENV === 'production' ? '/fast-engineering-solutions/' : '/'
});
