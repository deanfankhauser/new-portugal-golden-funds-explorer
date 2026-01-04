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
  // Ensure Node.js built-in modules are not bundled for client
  optimizeDeps: {
    exclude: ['fs', 'path', 'crypto', 'child_process']
  },
  build: {
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Mark Node.js modules as external to prevent CommonJS leakage
      external: [
        'fs',
        'path', 
        'crypto',
        'child_process',
        'stream',
        'util',
        'os',
        'http',
        'https',
        'url',
        'buffer'
      ],
      output: {
        // Disable manual chunking to prevent module evaluation issues
        manualChunks: undefined,
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