
// This script replaces the default `vite build` command
// It runs both the standard Vite build AND our SSG process
import { buildSSG } from './build-ssg.js';

// Run the SSG build process
buildSSG();
