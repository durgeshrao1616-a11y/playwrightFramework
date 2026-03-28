import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage — Page Object for OrangeHRM Dashboard.
 */
export class DashboardPage extends BasePage {

  // ── Locators ──
  readonly headerTitle:      Locator;
  readonly userDropdown:     Locator;
  readonly logoutOption:     Locator;
  readonly leaveMenuItem:    Locator;
  readonly adminMenuItem:    Locator;
  readonly pimMenuItem:      Locator;
  readonly dashboardWidgets: Locator;
  readonly breadcrumb:       Locator;

  private recruitmentMenu: Locator;
  private addButton: Locator;
  private firstName: Locator;
  private lastName: Locator;
  private email: Locator;
  private vacancy: Locator;
  private contactNumber: Locator;
  private chooseFile: Locator;
  private exp: Locator;
  private calendar: Locator;
  private date: Locator;
  private comment: Locator;
  private cehckBox: Locator;
  private saveButton: Locator;
  private download: Locator;
  private userProfile: Locator;
 // private logout: Locator;    

  constructor(page: Page) {
    super(page);
    this.headerTitle      = page.locator('.oxd-topbar-header-title');
    this.userDropdown     = page.locator('.oxd-userdropdown-tab');
    this.logoutOption     = page.locator('//a[text()="Logout"]');
    this.leaveMenuItem    = page.locator('//span[text()="Leave"]');
    this.adminMenuItem    = page.locator('//span[text()="Admin"]');
    this.pimMenuItem      = page.locator('//span[text()="PIM"]');
    this.dashboardWidgets = page.locator('.orangehrm-dashboard-widget');
    this.breadcrumb       = page.locator('.oxd-topbar-body-nav-trail');
    this.recruitmentMenu = page.getByRole('link', { name: 'Recruitment' });
    this.addButton = page.getByRole('button', { name: ' Add' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });  
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.email = page.getByRole('textbox', { name: 'Type here' }).first();
    this.vacancy = page.getByText('Senior QA Lead');
    this.contactNumber = page.getByRole('textbox', { name: 'Type here' }).nth(1);    

    this.chooseFile= page.getByRole('button', { name: 'Choose File' });
  this.exp=page.getByRole('textbox', { name: 'Enter comma seperated words...' });
  //await authenticatedPage.page.getByRole('textbox', { name: 'Enter comma seperated words...' }).fill('Selenium');
 this.calendar=page.locator('.oxd-icon.bi-calendar');
  this.date=page.getByText('27');
  this.comment=page.locator('textarea');
 // await authenticatedPage.page.locator('textarea').fill('Automation Profile attached');
  this.cehckBox=page.locator('.oxd-icon.bi-check');
  this.saveButton=page.getByRole('button', { name: 'Save' });
  //await authenticatedPage.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate/86');
  //const page1Promise = authenticatedPage.page.waitForEvent('popup');
  //const downloadPromise = authenticatedPage.page.waitForEvent('download');
  this.download= page.locator('.oxd-icon.bi-file-earmark-text');
  //const page1 = await page1Promise;
  //const download = await downloadPromise;

 // await authenticatedPage.page.waitForSelector("//p[@class='oxd-userdropdown-name']");
  this.userProfile=page.locator("//p[@class='oxd-userdropdown-name']");
 // this.logout=page.getByRole('menuitem', { name: 'Logout' });
  }

  async navigateToRecruitment(): Promise<void> {
    await this.click(this.recruitmentMenu);
    await this.waitForUrl('/recruitment');
  }
  async fillRecruitmentFormAndUploadResume(): Promise<void> {
  await this.addButton.click();
  await this.firstName.click();
  await this.firstName.fill('Durgesh'+Math.random().toString(36).slice(2, 10));
  await this.firstName.press('Tab');
 // await this.middleName.press('Tab');
  await this.lastName.fill('Rao');
  await this.lastName.press('Tab');
  await this.vacancy.click();
  await this.email.click();
  await this.email.fill('durgeshrao'+Math.random().toString(36).slice(2, 10)+'@gmail.com');
  await this.email.press('Tab');
  await this.contactNumber.fill('8591967159');
  await this.contactNumber.press('Tab');

  
  await this.chooseFile.setInputFiles("./data/web/Durgesh_Rao_Resume.docx");
  await this.exp.click();
  await this.exp.fill('Selenium');
  await this.calendar.click();
  await this.date.click();
  await this.comment.click();
  await this.comment.fill('Automation Profile attached');
  await this.cehckBox.click();
  await this.saveButton.click();
  
  }
  // ── Actions ──
  async navigateToLeave(): Promise<void> {
    await this.click(this.leaveMenuItem);
    await this.waitForUrl('/leave/');
  }
   async downloadProfile(): Promise<void> {
    //await authenticatedPage.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate/86');
 // const page1Promise = authenticatedPage.page.waitForEvent('popup');
  //const downloadPromise = authenticatedPage.page.waitForEvent('download');
  await this.download.click();
  //const page1 = await page1Promise;
  //const download = await downloadPromise;

  await this.userProfile.waitFor({ state: 'visible' });
  }

  async navigateToAdmin(): Promise<void> {
    await this.click(this.adminMenuItem);
    await this.waitForUrl('/admin');
  }

  async navigateToPIM(): Promise<void> {
    await this.click(this.pimMenuItem);
    await this.waitForUrl('/pim');
  }

  async logout(): Promise<void> {
    await this.click(this.userDropdown);
    await this.click(this.logoutOption);
    await this.waitForUrl('/auth/login');
  }

  // ── Validations ──
  async isDashboardVisible(): Promise<boolean> {
    return this.isVisible(this.headerTitle);
  }

  async assertDashboard(): Promise<void> {
    await this.assertVisible(this.headerTitle, 'Dashboard header should be visible');
    await this.assertUrl('/dashboard');
  }

  async getWidgetCount(): Promise<number> {
    return this.dashboardWidgets.count();
  }
}
