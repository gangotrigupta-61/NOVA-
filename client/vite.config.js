import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev: proxies /api → localhost:5000
      // Production (Vercel): VITE_API_URL=https://nova-sp2j.onrender.com/api
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
