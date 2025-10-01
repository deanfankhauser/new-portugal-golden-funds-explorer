import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting to reduce render-blocking CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Aggressive code splitting for better caching and parallelization
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            return 'vendor';
          }
        },
        // Asset filenames for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    },
    // Target modern browsers for better compression
    target: 'esnext',
    // Enable minification only in production
    minify: mode === 'production' ? 'terser' : false,
    // Terser options only apply when minification is enabled
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          // Additional optimizations to reduce unused code
          dead_code: true,
          unused: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        }
      }
    })
  }
}));