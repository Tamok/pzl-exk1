// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({ cssPath: './tailwind.css' }),
  ],
  optimizeDeps: {
    include: ['uuid'],
    exclude: ['@ffmpeg/ffmpeg']
  }
});
