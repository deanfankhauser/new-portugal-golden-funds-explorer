
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
    rollupOptions: {
      output: {
        // Manual chunk splitting for better optimization
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
          icons: ['lucide-react'],
          carousel: ['embla-carousel-react'],
          
          // App-specific chunks
          pages: [
            'src/pages/Index',
            'src/pages/FundDetails', 
            'src/pages/TagPage',
            'src/pages/CategoryPage'
          ],
          services: [
            'src/services/seoDataService',
            'src/services/seoService',
            'src/data/services/funds-service'
          ],
          data: ['src/data/funds', 'src/data/mock/funds-data']
        },
        // Ensure consistent chunk naming with proper null checking
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          const fileName = facadeModuleId 
            ? facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'chunk'
            : 'chunk';
          return `${fileName}-[hash].js`;
        }
      }
    },
    // Target modern browsers for better compression
    target: 'esnext',
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  }
}));
