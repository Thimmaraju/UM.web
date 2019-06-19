import { browser, element, by, ProtractorBy } from 'protractor';

export interface Credentials {
  ActiveDirectorySelect: string;
  username: string;
  password: string;
}

export interface Passwordinfo {
  currentpass: string;
  newpass: string;
  confirmpass: string;
}


export class UtilityPage {
  sleep = duration => browser.sleep(duration);
  sortMenuItems = (index: number) => element.all(by.css('[mat-menu-item]')).get(index);
  navigateTo(url: string) {
    browser.driver
      .manage()
      .window()
      .maximize();
      // .setSize(1920, 1080);
    return browser.get(url);
  }

//   getMenuAddedRecommendations = () => element(by.buttonText('Opportunities'));

//   getPharmAdminLogin = () => this.getCred('', 'Pharm001', 'PCUserP@55');
//   getPharmAdminLoginAD = (cust: string) => this.getCred(cust, 'e2epharmAdmin' + cust, '0mn!Cell101');
//   getStrategistLogin = () => this.getCred('', 'Strategist001', 'PCUserP@55');
// // fix when AD update Stary is played.
//   getADPharmAdminLogin = () => this.getCred('', 'eyob.erdachew2', '0mn!Cell101');

  getMenuAddedRecommendations = () => element(by.buttonText('Opportunities'));
  getOmniAdminLogin = () => this.getCred('', 'chinmoyee.p', 'Pass@word123456');
  getPharmAdminLogin = () => this.getCred('', 'chinmoyee.p', 'Pass@word123456');
  getPharmAdminLoginAD = (cust: string) => this.getCred(cust, 'e2epharmAdmin' + cust, '0mn!Cell101');
  getStrategistLogin = () => this.getCred('', 'winwire_s', 'pistafus*iq9PaNedreT');

// fix when AD update Stary is played.
  getADPharmAdminLogin = () => this.getCred('', 'eyob.erdachew2', '0mn!Cell101');

  getpasscredentials = () => this.getpassinfo('Password@12', 'Password@12345', 'Password@12345');

  getTestUserLogin = () => this.getCred('', 'anilkumar.indresh', 'Password@12');

  getCred(cust: string, username: string, password: string): Credentials {
    const creds = {} as Credentials;
    creds.ActiveDirectorySelect = cust;
    creds.username = username;
    creds.password = password;
    return creds;
  }
  getpassinfo( currentpassword: string, newpassword: string, confirmpassword: string): Passwordinfo {
    const creds = {} as Passwordinfo;
    creds.currentpass = currentpassword;
    creds.newpass = newpassword;
    creds.confirmpass = confirmpassword;
    return creds;
  }
}

export function waitForElement(selector: string) {
  return browser.isElementPresent(by.css(selector) as ProtractorBy);
}
