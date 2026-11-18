import { defineConfig } from 'vitest/config';
import { E2E_DATABASE_URL } from './test/e2e-env.js';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Test files share one database, so they must not run concurrently.
    fileParallelism: false,
    env: {
      JWT_SECRET: 'e2e-test-secret',
      JWT_EXPIRES_IN: '1h',
      DATABASE_URL: E2E_DATABASE_URL,
    },
  },
});
