import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pages = [
  'index.html',
  'programs.html',
  'services.html',
  'partners.html',
  'course-details.html',
  'certificate-verification.html',
];

// Plain (non-module) scripts are left untouched by Vite, so copy them into the output.
const classicScripts = [
  'script.js',
  'contact-config.js',
  'certificate-verification.js',
  'course-details.js',
];

let outDir;

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.replace('.html', ''), resolve(__dirname, page)])),
    },
  },
  plugins: [
    {
      name: 'copy-classic-scripts',
      apply: 'build',
      configResolved(config) {
        outDir = resolve(config.root, config.build.outDir);
      },
      closeBundle() {
        for (const file of classicScripts) {
          copyFileSync(resolve(__dirname, file), resolve(outDir, file));
        }
      },
    },
  ],
});
