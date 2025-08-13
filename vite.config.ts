
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
        // Enhanced manual chunk splitting for optimal code splitting
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('embla-carousel')) {
              return 'carousel';
            }
            return 'vendor';
          }
          
          // Page chunks
          if (id.includes('/pages/')) {
            if (id.includes('FundIndex')) return 'fund-index';
            if (id.includes('FundDetails')) return 'fund-details';
            if (id.includes('Comparison')) return 'comparison';
            if (id.includes('Quiz')) return 'quiz';
            if (id.includes('ROI')) return 'roi-calculator';
            return 'pages';
          }
          
          // Feature chunks
          if (id.includes('/fund-details/')) {
            return 'fund-details-components';
          }
          if (id.includes('/comparison/')) {
            return 'comparison-components';
          }
          if (id.includes('/quiz/')) {
            return 'quiz-components';
          }
          if (id.includes('/roi-calculator/')) {
            return 'roi-components';
          }
          
          // Services and utilities
          if (id.includes('/services/')) {
            return 'services';
          }
          if (id.includes('/utils/')) {
            return 'utils';
          }
          
          return undefined;
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
    // Enable minification only in production
    minify: mode === 'production' ? 'terser' : false,
    // Terser options only apply when minification is enabled
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    })
  }
}));
