import {browser, element, by } from 'protractor';
import { Credentials } from '../utility.po';

export class LoginPage {
  getErrorElements = () => element(by.css('error'));

  getErrortext = () => element(by.className('error ng-star-inserted'));

  getADServerElement = () => element(by.formControlName('UsernameSuffix'));

  getUserNameElement = () => element(by.id('Username'));

  getPasswordElement = () => element(by.id('Password'));

  getLoginButtonElement = () => element(by.id('LoginButton'));

  loginWithCredential(cred: Credentials) {
    this.getUserNameElement().sendKeys(cred.username);
    this.getPasswordElement().sendKeys(cred.password);
    this.getLoginButtonElement().click();
    browser.sleep(500);
    expect(this.getErrortext().isPresent()).toBe(false, `Login failed for ${cred.username}.`);
    browser.sleep(4000);
  }
  async verifySuccessfulLogin() {
    let error = '';
    if (await this.getErrortext().isPresent()) { error = await this.getErrortext().getText(); }
    expect(this.getErrortext().isPresent()).toBe(false, error);
  }
}
