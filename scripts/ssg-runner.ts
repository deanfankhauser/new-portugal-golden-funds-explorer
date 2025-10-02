import 'tsconfig-paths/register';
import { generateStaticFiles } from './ssg/ssg-orchestrator';
import { logEnvSnapshot } from '../src/lib/ssr-env';

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 SSG Runner: Starting static site generation...');
  
  // Log environment snapshot for debugging
  logEnvSnapshot();
  
  generateStaticFiles().catch(error => {
    console.error('💥 SSG: Fatal error:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });
}
