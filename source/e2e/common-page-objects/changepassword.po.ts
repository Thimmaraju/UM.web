import { element, by, browser } from 'protractor';
import { Passwordinfo } from '../utility.po';
export class ChangepasswordPage {

    menubtn = () => element(by.id('ProfileLogoutButton'));
    changepasswordmenu = () => element(by.xpath('//span[contains(text(),\'Change Password\')]'));
    currentpassword = () => element(by.id('txtCurrentPassword'));
    newpassword = () => element(by.id('txtNewPassword'));
    confirmpassword = () => element(by.id('txtConfirmPassword'));
    cancelbtn = () => element(by.buttonText('Cancel'));
    savebtn = () => element(by.xpath('//oc-button-action[@ng-reflect-button-text=\'Save\']'));
    successNotification = () => element(by.xpath('//div[@id=\'notification\']//div[contains(text(),\'Password is changed successfully\')]'));
    changepassword(cred: Passwordinfo) {

        this.menubtn().click();
        browser.driver.sleep(5000);
        this.changepasswordmenu().click();
        browser.driver.sleep(5000);
        this.currentpassword().sendKeys(cred.currentpass);
        browser.driver.sleep(3000);
        this.newpassword().sendKeys(cred.newpass);
        browser.driver.sleep(3000);
        this.confirmpassword().sendKeys(cred.confirmpass);
        browser.driver.sleep(4000);
        this.savebtn().click();
        browser.driver.sleep(4000);
    }
    async verifySuccessfulPasswordUpdate() {
        let message = 'Password is changed successfully';
        if (await this.successNotification().isPresent()) { message = await this.successNotification().getText(); }
        expect(this.successNotification().isPresent()).toBe(false, message);
      }
}
