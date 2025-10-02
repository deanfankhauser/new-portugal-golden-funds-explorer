import 'tsconfig-paths/register';
import { generateStaticFiles } from './ssg/ssg-orchestrator';

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticFiles().catch(error => {
    console.error('💥 SSG: Fatal error:', error);
    process.exit(1);
  });
}
