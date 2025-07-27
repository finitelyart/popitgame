import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      minify: false,
      includeAssets: ['vite.svg'], // Only include existing assets
      manifest: {
        name: 'My Awesome PWA', // Your app's full name
        short_name: 'MyPWA',    // Short name for homescreen
        description: 'My awesome React TypeScript PWA!',
        theme_color: '#ffffff', // Theme color for the browser UI
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
      },
    }),
  ],
build: {minify: false},
base: '/my-pwa-app/',
});

