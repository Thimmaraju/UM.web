// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
//
//Required resources
const { SpecReporter } = require('jasmine-spec-reporter');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const jasmineReporters = require('jasmine-reporters');
const HTMLReport = require('protractor-html-reporter');
const ts = require('ts-node').register({
  project: 'e2e/tsconfig.e2e.json',
});
require('events').EventEmitter.defaultMaxListeners = Infinity;

//Varables

const testresultsPath = path.resolve('./e2e/testresults');
const screenshotsPath = path.resolve('./e2e/testresults/screenshots');
const reportsPath = path.resolve('./e2e/testresults/reports');
const normalPathtestresults = path.normalize(testresultsPath);
const normalPathscreenshots = path.normalize(screenshotsPath);
const normalPathreports = path.normalize(reportsPath);

exports.config = {
  directConnect: true,
  allScriptsTimeout: 60000,
  specs: ['./e2e/**/1_createuser.e2e.spec.ts'],

  multiCapabilities: [
    {
      browserName: 'chrome',

      chromeOptions: {
        args: [
          //add ignore cert
          //'--headless',
        ],
      },
    },
  ],

  suites: {
    //smoke: './e2e/smoke/**/*.e2e.spec.ts',
    //hardening: './e2e/hardening/**/*.e2e.spec.ts',
    //nightly: './e2e/nightly/**/*.e2e.spec.ts',
  },

  directConnect: true,
  baseUrl: 'http://winwire.localworkflow.omnicellperformancecenter.com:4200',
  framework: 'jasmine2',
  restartBrowserBetweenTests: true,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 9000000,
    print: function() {},
  },
  onPrepare() {
    // delete ./e2e/testresults existing files before tests are run and create the base files

    if (fs.existsSync(normalPathtestresults)) {
      rmDir(normalPathtestresults);
    }
    fs.mkdirSync(normalPathtestresults);
    fs.mkdirSync(normalPathscreenshots);
    fs.mkdirSync(normalPathreports);

    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true, displayDuration: true } }));

    // Create xml report used to create Html report

    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: normalPathreports,
        filePrefix: 'xmloutput',
        takeScreenShotsOnlyForFailedSpecs: true,
      })
    );

    function rmDir(dirPath) {
      try {
        var files = fs.readdirSync(dirPath);
      } catch (e) {
        console.log(e);
        return;
      }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
          else rmDir(filePath);
          console.log(filePath);
        }
      fs.rmdirSync(dirPath);
    }

    by.addLocator('formControlName', function(value, opt_parentElement, opt_rootSelector) {
      var using = opt_parentElement || document;

      return using.querySelectorAll('[formControlName="' + value + '"]');
    });
  },
  //onComplete will be executed once per capability after all tests have finished, but the webdriver instance has not yet been shut down.
  onComplete() {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();

    capsPromise.then(function(caps) {
      browserName = caps.get('browserName');
      browserVersion = caps.get('version');

      testConfig = {
        reportTitle: 'Protractor e2eTest Execution Report',
        outputPath: normalPathreports,
        screenshotPath: normalPathscreenshots,
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: false,
        takeScreenShotsOnlyForFailedSpecs: true,
      };

      new HTMLReport().from(normalPathreports + '/xmloutput.xml', testConfig);
    });
  },
  //will be executed once per capability after all tests have finished and the webdriver instance has been shut down
  onCleanUp() {},
  //will be executed only once before program exits; after all capabilities are finished(after all onCleanup)
  afterLaunch() {},
};
