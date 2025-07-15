import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';


const viteConfig = defineConfig({
  plugins: [react()],
});

const vitestConfig = defineTestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});

export default mergeConfig(viteConfig, vitestConfig);
