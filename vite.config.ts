import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  server: {
    port: 5187,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 4187,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('/src/data/')) return 'lab-data';
          if (!normalized.includes('node_modules')) return undefined;
          if (normalized.includes('react-router')) return 'router';
          if (normalized.includes('@supabase')) return 'supabase';
          if (normalized.includes('three')) return 'three';
          if (normalized.includes('p5')) return 'p5';
          if (normalized.includes('zod')) return 'zod';
          if (normalized.includes('react')) return 'react';
          return 'vendor';
        },
      },
    },
  },
})
