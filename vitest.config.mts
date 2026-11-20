import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/brain-regions.ts',
        'src/lib/publications.ts',
        'src/lib/speech-story.ts',
        'src/components/brain/**',
        'src/components/research-section.tsx',
      ],
      exclude: ['src/components/brain/brain-canvas.tsx', '**/__tests__/**'],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
