import { element, by, browser } from 'protractor';

export class ApplicationsDashboardPage {

  usermanagementApp = () => element(by.xpath('//span[contains(text(),\'User Management\')]//ancestor::a'));

}
