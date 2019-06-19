import { element, by, browser, ExpectedConditions } from 'protractor';

export class NavPage {
  getProfileLogoutMenu = () => element(by.css('#ProfileLogoutButton > span > mat-icon'));
  getLogoutButton = () => element(by.id('LogoutButton'));
  getProfileButton = () => element(by.xpath('//*[@id="LogoutButton"]/preceding-sibling::button'));
  getDiscoveryLink = () => element(by.id('NavOpportunityDiscoveryButton'));
  getOpportunitiesLink = () => element(by.id('NavOpportunitiesButton'));
  getStatusLink = () => element(by.id('NavStatusButton'));
  getCustomerDropdown = () => element(by.id('SelectTenantButton'));
  logout() {
    browser.waitForAngularEnabled(false);
    this.getProfileLogoutMenu().click();
    browser.wait(ExpectedConditions.visibilityOf(this.getLogoutButton()));
    browser.sleep(500);
    this.getLogoutButton().click();
  }
}
