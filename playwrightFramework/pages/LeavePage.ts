import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LeavePage — Page Object for OrangeHRM Leave module.
 */
export class LeavePage extends BasePage {

  // ── Locators ──
  readonly applyLeaveMenu:   Locator;
  readonly leaveTypeDropdown:Locator;
  readonly fromDateInput:    Locator;
  readonly toDateInput:      Locator;
  readonly commentInput:     Locator;
  readonly applyButton:      Locator;
  readonly successToast:     Locator;
  readonly leaveListTable:   Locator;
  readonly pageHeader:       Locator;

  constructor(page: Page) {
    super(page);
    this.applyLeaveMenu    = page.locator('//a[text()="Apply"]');
    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();
    this.fromDateInput     = page.locator('(//input[@placeholder="yyyy-dd-mm"])[1]');
    this.toDateInput       = page.locator('(//input[@placeholder="yyyy-dd-mm"])[2]');
    this.commentInput      = page.locator('textarea.oxd-textarea');
    this.applyButton       = page.locator('button[type="submit"]');
    this.successToast      = page.locator('.oxd-toast-content');
    this.leaveListTable    = page.locator('.oxd-table');
    this.pageHeader        = page.locator('.oxd-text--h5');
  }

  // ── Actions ──
  async clickApplyLeave(): Promise<void> {
    await this.click(this.applyLeaveMenu);
    await this.waitForUrl('/applyLeave');
  }

  async selectLeaveType(type: string): Promise<void> {
    await this.click(this.leaveTypeDropdown);
    await this.page.locator(`//span[text()="${type}"]`).click();
  }

  async enterFromDate(date: string): Promise<void> {
    await this.fill(this.fromDateInput, date);
    await this.page.keyboard.press('Enter');
  }

  async enterToDate(date: string): Promise<void> {
    await this.fill(this.toDateInput, date);
    await this.page.keyboard.press('Enter');
  }

  async enterComment(comment: string): Promise<void> {
    await this.fill(this.commentInput, comment);
  }

  async clickApply(): Promise<void> {
    await this.click(this.applyButton);
  }

  // ── Fluent apply leave ──
  async applyLeave(leaveData: {
    leaveType: string;
    fromDate:  string;
    toDate:    string;
    comment?:  string;
  }): Promise<void> {
    await this.clickApplyLeave();
    await this.selectLeaveType(leaveData.leaveType);
    await this.enterFromDate(leaveData.fromDate);
    await this.enterToDate(leaveData.toDate);
    if (leaveData.comment) {
      await this.enterComment(leaveData.comment);
    }
    await this.clickApply();
  }

  // ── Validations ──
  async isSuccessToastVisible(): Promise<boolean> {
    return this.isVisible(this.successToast);
  }

  async getToastMessage(): Promise<string> {
    return this.getText(this.successToast);
  }

  async assertLeaveApplied(): Promise<void> {
    await this.assertVisible(this.successToast, 'Success toast should appear');
  }
}
