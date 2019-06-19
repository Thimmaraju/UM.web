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

describe('Associating multiple roles to a user', () => {
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


  it('Associating User Admin role to a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.assignUserAdmin();

  });

  it('Associating Pharm Admin role to a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.assignPharmAdmin();

  });

  it('Associating Pharm Tech role to a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.assignPharmTech();

  });

  it('Associating all roles to a user', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));

    const omniAdminCreds = util.getOmniAdminLogin();
    page.loginWithCredential(omniAdminCreds);

    util.sleep(10000);
    sel.selectSpecificCustomer('WinWire');
    app.usermanagementApp().click();

    userlist.searchUser('anilkumar.indresh');

    edituser.assignAllRoles();

  });

});
