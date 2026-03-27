import { defineConfig, devices } from '@playwright/test';
import { getEnvConfig }          from './config/envConfig';
import * as fs                   from 'fs';
import * as path                 from 'path';

/**
 * Get environment-specific auth file
 */
function getAuthFilePath(env: string): string {
  const authFile = path.resolve(`.auth/${env}.json`);
  const exists = fs.existsSync(authFile);
  
  if (!exists) {
    console.warn(`⚠️  Auth file not found: ${authFile}`);
    console.warn(`   Generate it with: ENV=${env} npx playwright codegen`);
  }
  
  return authFile;
}
const env          = process.env.ENV || 'qa';
const envConfig    = getEnvConfig(env);
const authFile     = getAuthFilePath(env);
//const storageState = fs.existsSync(authFile) ? authFile : undefined;

// ── Debug — print what Playwright sees ──
console.log(`ENV        : ${env}`);
console.log(`BASE URL   : ${envConfig.baseUrl}`);
console.log(`AUTH FILE  : ${authFile}`);
console.log(`AUTH EXISTS: ${fs.existsSync(authFile)}`);

export default defineConfig({

  // ✅ Test discovery
  testDir:   './tests',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  fullyParallel: true,
  workers:       5,
  retries:       0,
  timeout:       120_000,
  expect:      { timeout: 15_000 },

  // ✅ Global setup
  globalSetup: './global-setup.ts',

  // ✅ Reporter
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
  ],

  outputDir: 'reports/test-results',

  use: {
    baseURL:           envConfig.baseUrl,
    storageState:      fs.existsSync(authFile) ? authFile : undefined,
    //storageState:      `playwright/.auth/${env}.json`,  // ✅ undefined if missing — won't crash
    headless:          false,
    actionTimeout:     30_000,
    navigationTimeout: 60_000,
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    trace:             'retain-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: `chromium-${env}`,
      use:  { ...devices['Desktop Chrome'] },
    },
  ],
});
