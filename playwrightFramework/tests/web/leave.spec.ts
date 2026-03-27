import { test, expect } from '../../fixtures/index';
import { LeavePage }    from '../../pages/LeavePage';
import { DataReader }   from '../../utils/DataReader';

const env       = process.env.ENV || 'qa';
const leaveData = DataReader.readJsonForEnv<any[]>('data/web/leaveData.json', env);

test.describe('Leave Module — @regression', () => {

  for (const data of leaveData) {
    test(`Apply leave: ${data.testCase}`, async ({ authenticatedPage, page }) => {
      // ✅ Create LeavePage from authenticatedPage.page
      const leavePage = new LeavePage(page);
       await authenticatedPage.navigateToLeave();
      await leavePage.applyLeave({
        leaveType: data.leaveType,
        fromDate:  data.fromDate,
        toDate:    data.toDate,
        comment:   data.comment,
      });
      await leavePage.assertLeaveApplied();
    });
  }

});