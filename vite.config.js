import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('swiper') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: true,
    // Dev-time proxy to bypass CORS on the legacy PHP API.
    //
    // The browser sees a same-origin request to `/api/v1/...`, Vite then
    // forwards it server-side to https://srishringarr.com/API/v1/... where
    // CORS isn't enforced. Production should hit the API directly via
    // VITE_API_BASE_URL (or share the origin) — see src/utils/api.js.
    proxy: {
      '/api/v1': {
        target: 'https://srishringarr.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/API/v1'),
      },
    },
  },
})
