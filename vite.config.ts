import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'],
      manifest: {
        name: 'ASMR Pop-It',
        short_name: 'PopIt',
        description: 'A soothing, interactive Pop-It toy experience built with React and Three.js.',
        theme_color: '#90E0EF',
        background_color: '#ffffff',
        display: "standalone",
        scope: "/my-pwa-app/",
        start_url: "/my-pwa-app/",
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  base: '/my-pwa-app/',
});

