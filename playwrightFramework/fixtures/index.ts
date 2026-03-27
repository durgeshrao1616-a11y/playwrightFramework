import { test as base, expect, Page , BrowserContext } from '@playwright/test';
import { DashboardPage }          from '../pages/DashboardPage';
import { getEnvConfig, EnvConfig } from '../config/envConfig';

// ══════════════════════════════════════════
// Only authenticatedPage fixture
// No duplicate login/session logic
// storageState handled by playwright.config.ts
// ══════════════════════════════════════════

type PageFixtures = {
  envConfig:         EnvConfig;
  authenticatedPage: DashboardPage;
  noAuthPage:        Page;  
};

export const test = base.extend<PageFixtures>({

  // ── Env Config ──
  envConfig: async ({}, use) => {
    await use(getEnvConfig(process.env.ENV || 'qa'));
  },
  noAuthPage: async ({ browser }, use) => {
    const context = await browser.newContext();  // no storageState
    const page    = await context.newPage();
    await use(page);
    await context.close();
  },
  // ══════════════════════════════════════════
  // authenticatedPage — only fixture needed
  // 1. storageState auto-loaded by config
  // 2. Navigate to dashboard
  // 3. If session dead → re-login once
  // ══════════════════════════════════════════
  authenticatedPage: async ({ browser }, use) => {
    const config = getEnvConfig(process.env.ENV || 'qa');

    const context: BrowserContext = await browser.newContext({
      storageState: `playwright/.auth/${process.env.ENV || 'qa'}.json`,  // ← Auth file loaded HERE
    });
    const page = await context.newPage();
    // ── Navigate to dashboard ──
    // storageState already loaded by playwright.config.ts
    await page.goto(
      `${config.baseUrl}/web/index.php/dashboard/index`,
      { waitUntil: 'domcontentloaded', timeout: 60_000 }
    );

    // ── Check if session alive ──
    const onLogin = page.url().includes('/auth/login');

    if (onLogin) {
      // ── Session dead → re-login once ──
      console.log(`⚠️  Session expired — re-logging in`);

      await page.waitForSelector(
        '[name="username"]',
        { timeout: 30_000 }
      );
      await page.fill('[name="username"]', config.username);
      await page.fill('[name="password"]', config.password);
      await page.locator("//button[@type='submit']").click();
      await page.waitForSelector(
        "//h6[text()='Dashboard']",
        { timeout: 90_000 }
      );

      console.log(`✅ Re-login done`);

    } else {
      // ── Session alive ──
      console.log(`⚡ Session alive — on dashboard`);
      await page.waitForSelector(
        "//h6[text()='Dashboard']",
        { timeout: 30_000 }
      );
    }

    await use(new DashboardPage(page));
  },

});

export { expect };