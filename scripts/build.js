
#!/usr/bin/env node

// This script replaces the default `vite build` command
// It runs both the standard Vite build AND our SSG process
const { buildSSG } = require('./build-ssg');

// Run the SSG build process
buildSSG();
