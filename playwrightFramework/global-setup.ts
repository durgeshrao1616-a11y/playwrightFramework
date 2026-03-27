import { chromium, FullConfig } from '@playwright/test';
import { getEnvConfig }         from './config/envConfig';
import * as path                from 'path';
import * as fs                  from 'fs';

const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

interface SessionMeta {
  createdAt: number;
  expiresAt: number;
  env:       string;
  username:  string;
}

function getAuthFile(env: string): string {
  return path.resolve(`playwright/.auth/${env}.json`);
}

function getMetaFile(env: string): string {
  return path.resolve(`playwright/.auth/${env}.meta.json`);
}

function isMetaValid(env: string): boolean {
  const metaFile = getMetaFile(env);
  const authFile = getAuthFile(env);

  if (!fs.existsSync(metaFile) || !fs.existsSync(authFile)) {
    console.log(`⚠️  No session files found`);
    return false;
  }

  try {
    const meta: SessionMeta = JSON.parse(
      fs.readFileSync(metaFile, 'utf-8')
    );
    const now       = Date.now();
    const remaining = Math.floor((meta.expiresAt - now) / 60000);

    if (now >= meta.expiresAt) {
      console.log(`⏰ Meta expired`);
      return false;
    }

    console.log(`📋 Meta valid — ${remaining} mins remaining on 8hr window`);
    return true;
  } catch {
    return false;
  }
}

function saveSessionMeta(env: string, username: string): void {
  const now       = Date.now();
  const expiresAt = now + SESSION_EXPIRY_MS;
  const meta: SessionMeta = { createdAt: now, expiresAt, env, username };
  fs.writeFileSync(getMetaFile(env), JSON.stringify(meta, null, 2));
  console.log(`💾 Session meta saved — valid until: ${new Date(expiresAt).toLocaleString()}`);
}

// ✅ KEY FIX — actually load storageState and hit the app
async function isServerSessionAlive(
  authFile: string,
  baseUrl:  string
): Promise<boolean> {
  const browser = await chromium.launch({ headless: true });

  try {
    // ✅ Load existing storageState into browser
    const context = await browser.newContext({
      storageState: authFile,
    });
    const page = await context.newPage();

    console.log(`🔍 Verifying server session is alive...`);

    // ✅ Hit a protected page — if redirected to login → session dead
    await page.goto(
      `${baseUrl}/web/index.php/dashboard/index`,
      { waitUntil: 'domcontentloaded', timeout: 30_000 }
    );

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // ✅ Check if we are on dashboard or got kicked to login
    const isDashboard = currentUrl.includes('/dashboard');
    const isLogin     = currentUrl.includes('/auth/login');

    if (isDashboard) {
      console.log(`✅ Server session ALIVE — reusing storageState`);
      await context.close();
      return true;
    }

    if (isLogin) {
      console.log(`❌ Server session DEAD — redirected to login page`);
      await context.close();
      return false;
    }

    // Double check by looking for dashboard element
    const dashboardVisible = await page
      .locator("//h6[text()='Dashboard']")
      .isVisible()
      .catch(() => false);

    await context.close();
    return dashboardVisible as boolean;

  } catch (error) {
    console.log(`❌ Session check failed: ${error}`);
    return false;
  } finally {
    await browser.close();
  }
}

async function doLogin(
  baseUrl:  string,
  username: string,
  password: string,
  authFile: string,
  env:      string
): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();

  page.setDefaultTimeout(60_000);
  page.setDefaultNavigationTimeout(60_000);

  console.log(`\n🔐 Logging in...`);
  console.log(`   URL  : ${baseUrl}`);
  console.log(`   User : ${username}`);

  try {
    await page.goto(
      `${baseUrl}/web/index.php/auth/login`,
      { waitUntil: 'domcontentloaded', timeout: 120_000 }
    );
    //await page.waitForSelector('//input[@placeholder="Username"]', { timeout: 40_000 });
    await page.fill('//input[@placeholder="Username"]', username);
    await page.fill('//input[@placeholder="Password"]', password);
    await page.locator("//button[@type='submit']").click();
    await page.waitForSelector(
      "//h6[text()='Dashboard']",
      { timeout: 90_000 }
    );

    // ✅ Save auth state
    await context.storageState({ path: authFile });
    saveSessionMeta(env, username);

    console.log(`✅ Login successful — session saved\n`);

  } finally {
    await context.close();
    await browser.close();
  }
}

async function globalSetup(config: FullConfig) {
  const env       = process.env.ENV || 'qa';
  const envConfig = getEnvConfig(env);
  const authDir   = path.resolve('playwright/.auth');
  const authFile  = getAuthFile(env);

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // ══════════════════════════════════════════
  // STEP 1 — Check our 8hr meta timestamp
  // ══════════════════════════════════════════
  if (!isMetaValid(env)) {
    console.log(`🔄 Meta invalid/expired → fresh login`);
    await doLogin(
      envConfig.baseUrl,
      envConfig.username,
      envConfig.password,
      authFile,
      env
    );
    return;
  }

  // ══════════════════════════════════════════
  // STEP 2 — Meta is valid, but verify server
  //          session is actually still alive
  // ══════════════════════════════════════════
  const serverAlive = await isServerSessionAlive(
    authFile,
    envConfig.baseUrl
  );

  if (!serverAlive) {
    console.log(`🔄 Server session dead → re-login`);
    await doLogin(
      envConfig.baseUrl,
      envConfig.username,
      envConfig.password,
      authFile,
      env
    );
    return;
  }

  // ══════════════════════════════════════════
  // STEP 3 — Both valid → reuse session
  // ══════════════════════════════════════════
  console.log(`⚡ Session fully valid — skipping login, saving time!\n`);
}

export default globalSetup;
