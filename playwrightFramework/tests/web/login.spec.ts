import { test, expect } from '../../fixtures/index';
import { LoginPage }    from '../../pages/LoginPage';

// Login tests don't need authenticatedPage
// Use plain { noAuthPage } fixture from Playwright directly
test.describe('Login Page — @smoke', () => {

  test('should display login page', async ({ noAuthPage }) => {
    const loginPage = new LoginPage(noAuthPage);
    await loginPage.goto();
    await loginPage.assertLoginPage();
  });

  test('should login successfully', async ({ authenticatedPage }) => {

    await expect(authenticatedPage.page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid credentials', async ({ noAuthPage }) => {
    const loginPage = new LoginPage(noAuthPage);
    await loginPage.goto();
    await loginPage.enterUsername('wrong_user');
    await loginPage.enterPassword('wrong_pass');
    await loginPage.clickLogin();

    const errorLocator = noAuthPage.locator('.oxd-alert-content-text')
    errorLocator.waitFor({ timeout: 5000 });
    console.log('Error message:', await errorLocator.textContent());

    expect(await errorLocator.textContent()==='Invalid credentials').toBeTruthy();
    //expect(await loginPage.isErrorVisible()).toBeTruthy();
  
   // await loginPage.clickLogin();
    //expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

});