module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/ui/support/**/*.ts', 'features/**/step-definitions/**/*.ts'],
    format: ['progress-bar', 'json:test-results/cucumber-report.json', 'summary'],
  },
};
