import * as fs from 'fs';
import * as path from 'path';
import { browser } from 'protractor';

const OUTPUT_DIR = '../source/e2e/testresults/screenshots';
const HEIGHT = 768;
const WIDTH = 1024;

let currentJasmineSpecName = '';

/**  Adds a custom jasmine reporter that simply keeps track of the current test name. */
function initializeEnvironment(jasmine: any) {
  browser
    .manage()
    .window()
    .setSize(WIDTH, HEIGHT);
  const reporter = new jasmine.JsApiReporter({});
  reporter.specStarted = function(result: any) {
    currentJasmineSpecName = result.fullName;
  };
  jasmine.getEnv().addReporter(reporter);
}

initializeEnvironment(jasmine);

export class Screenshot {
  id: string;

  /** The filename used to store the screenshot. */
  get filename(): string {
    return (
      this.id.trim() +
      // .replace(/\s/g, '_')
      // .replace(/[^/a-z0-9_]+/g, '')
      '.png'
    );
  }

  /** The full path to the screenshot */
  get fullPath(): string {
    return path.resolve(OUTPUT_DIR, this.filename);
  }

  /*//fix name need to add browser testBrowser: browserName
    var capsPromise = browser.getCapabilities();

capsPromise.then(function (caps) {
  let browserName = caps.get('browserName');
  // browserVersion = caps.get('version');
});*/

  constructor(id?: string) {
    // tslint:disable-next-line:prefer-const
    let browserName = 'chrome-'; // Change to let went IE testing is added
    this.id = id ? `${browserName}' ${currentJasmineSpecName} ${id}` : browserName + currentJasmineSpecName;
    browser.takeScreenshot().then(png => this.storeScreenshot(png));
  }

  /** Replaces the existing screenshot with the newly generated one. */
  storeScreenshot(png: any) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, '744');
    }

    if (fs.existsSync(OUTPUT_DIR)) {
      fs.writeFileSync(this.fullPath, png, { encoding: 'base64' });
    }
  }
}

export function screenshot(id?: string) {
  return new Screenshot(id);
}
