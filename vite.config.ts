const { defineConfig, mergeConfig } = require('vite');
const { defineConfig: defineTestConfig } = require('vitest/config');
const react = require('@vitejs/plugin-react');

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

module.exports = mergeConfig(viteConfig, vitestConfig);