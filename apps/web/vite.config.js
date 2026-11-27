import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // The browser calls /api on its own origin, so the API needs no CORS rule in development.
    proxy: { '/api': 'http://localhost:3100' },
  },
});
