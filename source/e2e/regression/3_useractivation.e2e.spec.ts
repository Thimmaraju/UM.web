import { LoginPage } from '../common-page-objects/login.po';
import { NavPage } from '../common-page-objects/nav.po';
import { SelectCustomersPage } from '../common-page-objects/select-customer.po';
import { ApplicationsDashboardPage } from '../common-page-objects/applications-dashboard.po';
import { UsersList } from '../common-page-objects/user-list.po';
import { EditUserInfoPage } from '../common-page-objects/edit-user-info.po';
import { UtilityPage } from '../utility.po';
import { screenshot } from '../screenshot';
import { browser, element, by, ExpectedConditions } from 'protractor';
import { getDate } from 'date-fns';

describe('Activation of Users', () => {
  let page: LoginPage;
  let util: UtilityPage;
  let nav: NavPage;
  let sel: SelectCustomersPage;
  let app: ApplicationsDashboardPage;
  let userlist: UsersList;
  let edituser: EditUserInfoPage;

  beforeEach(() => {
    page = new LoginPage();
    nav = new NavPage();
    util = new UtilityPage();
    sel = new SelectCustomersPage();
    app = new ApplicationsDashboardPage();
    userlist = new UsersList();
    edituser = new EditUserInfoPage();
  });

  it('Deactivate a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.deactivateUser();

    util.sleep(10000);
    userlist.searchTxt().sendKeys('anilkumar.indresh');
    util.sleep(10000);

    const status = userlist.userStatus().getText();
    expect(await status).toContain('Deactivated');
    screenshot();

    nav.logout();
    util.sleep(10000);
    nav.logout();
    util.sleep(10000);
    const testUserCreds = util.getTestUserLogin();

    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();

    username.sendKeys(testUserCreds.username);
    password.sendKeys(testUserCreds.password);
    loginButton.click();
    util.sleep(5000);
    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('AUTHENTICATION FAILED');
    screenshot();

  });

  it('Reactivate a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.deactivateUser();

    util.sleep(10000);
    userlist.searchTxt().sendKeys('anilkumar.indresh');
    util.sleep(10000);

    const status = userlist.userStatus().getText();
    expect(await status).toContain('Active');
    screenshot();

    nav.logout();
    util.sleep(10000);
    nav.logout();
    util.sleep(10000);
    const testUserCreds = util.getTestUserLogin();

    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();

    username.sendKeys(testUserCreds.username);
    password.sendKeys(testUserCreds.password);
    loginButton.click();
    util.sleep(5000);
    page.verifySuccessfulLogin();
    screenshot();

  });
});
