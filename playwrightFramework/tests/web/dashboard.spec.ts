import { test, expect } from '../../fixtures/index';
import { LeavePage }    from '../../pages/LeavePage';

test.describe('Dashboard — Recruitment Resume Upload and Profile Download ', () => {

  test('Upload Resume and Download Profile', async ({ authenticatedPage }) => {
    await authenticatedPage.navigateToRecruitment();
    await authenticatedPage.fillRecruitmentFormAndUploadResume();
    await authenticatedPage.downloadProfile();
    await authenticatedPage.logout();
    await expect(authenticatedPage.page).toHaveURL(/login/);
  });
});