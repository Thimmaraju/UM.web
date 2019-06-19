import { element, by, browser } from 'protractor';

export class SelectCustomersPage {


    getSelectCustomer = () => element(by.id('SelectCustomer'));

    getSelectByCustomer = (customer: string) => element(by.cssContainingText('[role=menuitem]', customer));

    selectSpecificCustomer(customer: string) {
        browser.sleep(3000);
        this.getSelectCustomer().click();
        browser.sleep(5000);
        this.getSelectByCustomer(customer).click();
        browser.sleep(4000);
    }
}
