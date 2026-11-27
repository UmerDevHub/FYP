import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The browser calls /api on its own origin, so the API needs no CORS rule in development.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
