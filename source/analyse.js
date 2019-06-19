const scanner = require('sonarqube-scanner');

scanner(
  {
    // this example uses local instance of SQ
    serverUrl: 'http://10.180.221.72:9000',
    options: {
      'sonar.projectKey': 'CAP-UserManagement.Web',
      'sonar.projectName': 'CAP-UserManagement.Web',
      'sonar.projectVersion': '#{projectVersion}',
      'sonar.branch.name': '#{targetBranch}',
      'sonar.sources': 'src',
      'sonar.exclusions': '**/*.spec.ts, src/environments/*',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    },
  },
  () => {
    // callback is required
  }
);
