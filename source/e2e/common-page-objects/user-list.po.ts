import { element, by, browser } from 'protractor';

export class UsersList {

  addUserBtn = () => element(by.xpath('//button[contains(text(),\'Add User\')]'));
  usernameTxt = () => element(by.id('txtUserName'));
  emailTxt = () => element(by.id('txtEmail'));
  firstnameTxt = () => element(by.id('txtFirstName'));
  lastnameTxt = () => element(by.id('txtLastName'));
  searchTxt = () => element(by.id('search-box-0'));
  newAddedUserRow_FirstName = (firstname: string) => element(by.xpath('//div[@data-title=\'firstname\' and contains(text(),\'' + firstname + '\')]/..'));

  searchedFirstName = () => element(by.xpath('(//div[@data-title=\'firstname\'])[1]'));
  searchedLastName = () => element(by.xpath('(//div[@data-title=\'lastname\'])[1]'));

  newAddedUserRow_Email = (email: string) => element(by.xpath('//div[@data-title=\'email\']/span[contains(text(),\'' + email + '\')]/../..'));

  userStatus = () => element(by.xpath('//div[@data-title=\'status\']/span'));
  usernameValidationMessage = () => element(by.xpath("//div[text()=' User Name must have minimum 3 characters ']"));
  createUserBtn = () => element(by.xpath('//button[contains(text(),\'Create User\')]'));

  cancelBtn = () => element(by.xpath('//button[contains(text(),\'Cancel\')]'));

  createUser(username: string, email: string, firstname: string, lastname: string) {
    browser.sleep(2000);
    this.addUserBtn().click();
    browser.sleep(3000);
    this.usernameTxt().sendKeys(username);
    browser.sleep(500);
    this.emailTxt().sendKeys(email);
    browser.sleep(500);
    this.firstnameTxt().sendKeys(firstname);
    browser.sleep(500);
    this.lastnameTxt().sendKeys(lastname);
    browser.sleep(2000);
    this.createUserBtn().click();
    browser.sleep(7000);
    this.searchTxt().sendKeys(firstname);
    browser.sleep(7000);
    this.newAddedUserRow_FirstName(firstname).click();
    browser.sleep(7000);
  }
  createUserwithoutdata(username: string, email: string, firstname: string, lastname: string) {
    browser.sleep(2000);
    this.addUserBtn().click();
    browser.sleep(3000);
    if(username === ''){
      this.usernameTxt().sendKeys('a');
      this.usernameTxt().clear();
    }else{
      this.usernameTxt().sendKeys(username);
    }
    browser.sleep(500);
    this.emailTxt().sendKeys(email);
    browser.sleep(500);
    this.firstnameTxt().sendKeys(firstname);
    browser.sleep(500);
    this.lastnameTxt().sendKeys(lastname);
    browser.sleep(2000);
  }

  searchUser(user: string) {
    browser.sleep(12000);
    this.searchTxt().sendKeys(user);
    browser.sleep(12000);
    this.newAddedUserRow_Email(user).click();
    browser.sleep(7000);
  }

}
