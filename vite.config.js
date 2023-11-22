import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectManifest: {
        globPatterns: ["**/*.{js, html, css}"]
      },
      strategies: 'injectManifest',
      // strategies: 'generateSW',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      // registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
				icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        display: "fullscreen"
      },
      workbox: {
        runtimeCaching: [
          {
            // urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            // handler: 'YourStrategies',
            urlPattern: /^https:\/\/pokeapi.co\/api\/v2\/pokemon$/,
            handler: 'StaleWhileRevalidate',
            options: {
              // cacheName: 'google-fonts-cache',
              cacheName: 'auth-user-cache',
              expiration: {
                maxEntries: 10,
                // maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                maxAgeSeconds: 5
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    
  ],
  
})