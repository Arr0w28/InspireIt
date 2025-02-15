// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env, // Make env variables accessible
  },
  server: {
    proxy: {
      '/recommend': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Add additional proxies as needed
    },
  },
});
