import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';
import { LoginPage } from '@pages/LoginPage';
import { getEnvConfig } from '@config/envConfig';
const config = getEnvConfig(process.env.ENV || 'qa');

  test('Upload Resume and Download Profile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.enterUsername(config.username);
    await loginPage.enterPassword(config.password);
    await loginPage.clickLogin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToRecruitment();
    await dashboardPage.fillRecruitmentFormAndUploadResume();
    await dashboardPage.downloadProfile();
    await dashboardPage.logout();
    await expect(dashboardPage.page).toHaveURL(/login/);
  });