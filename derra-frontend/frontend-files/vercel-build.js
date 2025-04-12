// This file is used by Vercel to build the project
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

// Add node_modules/.bin to PATH
process.env.PATH = `${process.env.PATH}:${process.cwd()}/node_modules/.bin`;

try {
  // Run TypeScript compiler
  console.log('Running TypeScript compiler...');
  execSync('npx tsc', { stdio: 'inherit' });
  
  // Run Vite build
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}