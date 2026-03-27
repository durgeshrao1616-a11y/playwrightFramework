import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Page Object for OrangeHRM Login.
 */
export class LoginPage extends BasePage {

  // ── Locators ──
  readonly usernameInput:  Locator;
  readonly passwordInput:  Locator;
  readonly loginButton:    Locator;
  readonly errorMessage:   Locator;
  readonly pageTitle:      Locator;
  readonly forgotPassword: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput  = page.locator('[name="username"]');
    this.passwordInput  = page.locator('[name="password"]');
    this.loginButton    = page.locator('button[type="submit"]');
    this.errorMessage   = page.locator('.oxd-alert-content-text');
    this.pageTitle      = page.locator('.orangehrm-login-title');
    this.forgotPassword = page.locator('.orangehrm-login-forgot-header');
  }

  // ── Actions ──
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  // ── Fluent login — returns DashboardPage ──
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    await this.waitForUrl('/dashboard');
  }

  // ── Validations ──
  async isLoginPageVisible(): Promise<boolean> {
    return this.isVisible(this.pageTitle);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async assertLoginPage(): Promise<void> {
    await this.assertVisible(this.pageTitle, 'Login page title should be visible');
    await this.assertVisible(this.usernameInput, 'Username field should be visible');
    await this.assertVisible(this.passwordInput, 'Password field should be visible');
    await this.assertVisible(this.loginButton, 'Login button should be visible');
  }
}
