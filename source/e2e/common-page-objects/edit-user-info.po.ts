import { element, by, browser } from 'protractor';


export interface UserInformation {
  Email: string;
  FirstName: string;
  LastName: string;
}

export class EditUserInfoPage {

  userEmailTxt = element(by.id('userEmailInput'));
  userFirstNameTxt = element(by.id('userFirstNameInput'));
  userLastNameTxt = element(by.id('userLastNameInput'));

  userInfoTab = () => element(by.xpath('//div[contains(text(),"User Information")]/..'));
  rolesTab = () => element(by.xpath('//div[contains(text(),\'Roles\')]/..'));
  siteAssocTab = () => element(by.xpath('//div[contains(text(),\'Site Association\')]/..'));
  auditLogTab = () => element(by.xpath('//div[contains(text(),\'Audit Log\')]/..'));

  pharmAdminRoleBtn = () => element(by.xpath('//div[contains(text(),\'Pharm Admin\')]/..//oc-button-toggle'));

  pharmTechRoleBtn = () => element(by.xpath('//div[contains(text(),\'Pharm Tech\')]/..//oc-button-toggle'));

  userAdminRoleBtn = () => element(by.xpath('//div[contains(text(),\'User Admin\')]/..//oc-button-toggle'));

  addUserBtn = () => element(by.xpath('//button[contains(text(),\'Save\')]'));

  successNotification = () => element(by.xpath('//div[@id=\'notification\']//div[contains(text(),\'User details are successfully updated\')]'));

  profileRdoBtn = () => element(by.xpath('//div[contains(text(),\'Profile\')]/..'));
  credectialsRdoBtn = () => element(by.xpath('//div[contains(text(),\'Credentials\')]/..'));

  activationSlider = () => element(by.tagName('oc-button-toggle'));
  backBtn = () => element(by.className('col-back'));

  auditSearchbox = () => element(by.id('search-box-2'));
  auditLogUpdateInfo_FirstRow = () => element(by.xpath('(//div[@data-title=\'update\'])[1]'));

  assignAllSitesBtn = () => element(by.xpath('//oc-button-action[@ng-reflect-button-text="Assign All Sites"]'));
  unassignAllSitesBtn = () => element(by.xpath('//oc-button-action[@ng-reflect-button-text="Unassign All Sites"]'));



  async verifySuccessfulUpdate() {
    let message = 'User details are successfully updated';
    if (await this.successNotification().isPresent()) { message = await this.successNotification().getText(); }
    expect(this.successNotification().isPresent()).toBe(false, message);
  }


  createUserAdmin() {
    this.rolesTab().click();
    browser.sleep(2000);
    this.userAdminRoleBtn().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  createPharmAdmin() {
    this.rolesTab().click();
    browser.sleep(2000);
    this.pharmAdminRoleBtn().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  createPharmTech() {
    this.rolesTab().click();
    browser.sleep(2000);
    this.pharmTechRoleBtn().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  createAllRoles() {
    this.rolesTab().click();
    browser.sleep(2000);
    this.pharmAdminRoleBtn().click();
    this.pharmTechRoleBtn().click();
    this.userAdminRoleBtn().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  createUA_PA() {
    this.rolesTab().click();
    browser.sleep(2000);
    this.pharmAdminRoleBtn().click();
    this.userAdminRoleBtn().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }


  deactivateUser() {
    this.credectialsRdoBtn().click();
    browser.sleep(2000);
    this.activationSlider().click();
    browser.sleep(500);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(3000);
    this.backBtn().click();
    browser.sleep(7000);
    browser.refresh();
    browser.sleep(7000);
  }

  updateUserInfo(): UserInformation {

    const UserInfo = {} as UserInformation;

    // let email = this.userEmailTxt.getText();
    // UserInfo.Email = email;
    // this.userEmailTxt.clear();
    // this.userEmailTxt.sendKeys(email + 'm');

    const timestamp = Date.now();

    UserInfo.FirstName = 'First' + timestamp;
    this.userFirstNameTxt.clear();
    this.userFirstNameTxt.sendKeys('First' + timestamp);

    UserInfo.LastName = 'Last' + timestamp;
    this.userLastNameTxt.clear();
    this.userLastNameTxt.sendKeys('Last' + timestamp);

    browser.sleep(15000);
    this.addUserBtn().click();
    browser.sleep(5000);
    this.backBtn().click();
    browser.sleep(7000);
    browser.refresh();
    browser.sleep(7000);
    return UserInfo;
  }

  auditUserInfo() {

    const timestamp = Date.now();

    this.userFirstNameTxt.clear();
    this.userFirstNameTxt.sendKeys('First' + timestamp);

    this.userLastNameTxt.clear();
    this.userLastNameTxt.sendKeys('Last' + timestamp);

    browser.sleep(15000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(135000);
    browser.refresh();
    browser.sleep(17000);
    this.auditLogTab().click();
    browser.sleep(7000);
    this.auditSearchbox().sendKeys('Update user profile for Omnicell');
    browser.sleep(7000);
    const logUpdateInfo = this.auditLogUpdateInfo_FirstRow().getText();
    const firstNameTxt = 'First' + timestamp;
    const lastNameTxt = 'Last' + timestamp;

    expect(logUpdateInfo).toContain(firstNameTxt);
    expect(logUpdateInfo).toContain(lastNameTxt);
    browser.sleep(7000);

  }


  assignUserAdmin() {
    this.rolesTab().click();
    browser.sleep(5000);

    this.userAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'User Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);

    this.pharmAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);
    this.pharmTechRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Tech\')]/..//oc-button-toggle'));
        f1.click();
      }
    });


    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  assignPharmAdmin() {
    this.rolesTab().click();
    browser.sleep(5000);

    this.userAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'User Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);

    this.pharmAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);
    this.pharmTechRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Tech\')]/..//oc-button-toggle'));
        f1.click();
      }
    });


    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  assignPharmTech() {
    this.rolesTab().click();
    browser.sleep(5000);

    this.userAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'User Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);

    this.pharmAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'true' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);
    this.pharmTechRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Tech\')]/..//oc-button-toggle'));
        f1.click();
      }
    });


    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  assignAllRoles() {
    this.rolesTab().click();
    browser.sleep(5000);

    this.userAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'User Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);

    this.pharmAdminRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Admin\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);
    this.pharmTechRoleBtn().getAttribute('ng-reflect-model').then(function(result) {
      if ( result === 'false' ) {
        const f1 = element(by.xpath('//div[contains(text(),\'Pharm Tech\')]/..//oc-button-toggle'));
        f1.click();
      }
    });
    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  assignAllSites() {
    this.siteAssocTab().click();
    browser.sleep(5000);

    this.assignAllSitesBtn().click();

    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

  unassignAllSites() {
    this.siteAssocTab().click();
    browser.sleep(5000);

    this.unassignAllSitesBtn().click();

    browser.sleep(2000);
    this.addUserBtn().click();
    this.verifySuccessfulUpdate();
    browser.sleep(7000);
  }

}
