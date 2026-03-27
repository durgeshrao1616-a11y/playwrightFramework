import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { LoginPage } from '@pages/LoginPage';
import { getEnvConfig } from '@config/envConfig';
const config = getEnvConfig(process.env.ENV || 'qa');
test.describe('Login — OrangeHRM', () => {
  test('Should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.enterUsername(config.username);
    await loginPage.enterPassword(config.password);
    await loginPage.clickLogin();
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.logout();
    await expect(dashboardPage.page).toHaveURL(/login/);
  });
});
