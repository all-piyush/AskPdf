// Project Y: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    
  ],
  server: {
    port: 3002, // Fixed port for local development
    allowedHosts:true,
    host: '0.0.0.0',
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3000, // Fixed port for production preview build
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: {
    target: 'esnext', // Required for module federation
    minify: false,
  },
});