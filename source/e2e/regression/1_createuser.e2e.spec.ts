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

describe('Create Hospital Users', () => {
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


  xit('Create new hospital user administrator', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUser('useradmin' + timestamp, 'ua' + timestamp + '@testuser.com', 'User' + timestamp, 'Admin');
    edituser.createUserAdmin();
  });


  xit('Create new hospital pharm admin', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUser('phrmadmn' + timestamp, 'pa' + timestamp + '@testuser.com', 'Pharm' + timestamp, 'Admin');
    edituser.createPharmAdmin();
  });

  xit('Create new hospital pharm technician', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUser('phrmtech' + timestamp, 'pt' + timestamp + '@testuser.com', 'Pharm' + timestamp, 'Technician');
    edituser.createPharmTech();
  });

  xit('Create new hospital user with all roles', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUser('testuser' + timestamp, 'tu' + timestamp + '@testuser.com', 'Test' + timestamp, 'User');
    edituser.createAllRoles();
  });

  xit('Create new hospital user with user admin and pharm admin roles', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUser('ua_pa' + timestamp, 'uapa' + timestamp + '@testuser.com', 'Test' + timestamp, 'User');
    edituser.createUA_PA();
  });

  it('User should not be able to create a user without username', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();
    const timestamp = Date.now();
    userlist.createUserwithoutdata('', 'uapa' + timestamp + '@testuser.com', 'Test' + timestamp, 'User');
    browser.sleep(6000);
    expect(userlist.usernameValidationMessage().getText()).toContain('USER NAME MUST HAVE MINIMUM 3 CHARACTERS');
  });

});
