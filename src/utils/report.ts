import * as fs from 'fs';
import * as path from 'path';

const resultsDir = path.join(process.cwd(), 'test-results');
const jsonReportPath = path.join(resultsDir, 'cucumber-report.json');
const htmlReportPath = path.join(resultsDir, 'cucumber-report.html');

interface Scenario {
  steps?: Array<{ result?: { status: string } }>;
}

function generateHtmlReport() {
  try {
    if (!fs.existsSync(jsonReportPath)) {
      console.warn(`JSON report not found at ${jsonReportPath}`);
      return;
    }

    const jsonData: Scenario[] = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
    let passed = 0,
      failed = 0,
      skipped = 0;

    jsonData.forEach((scenario: Scenario) => {
      const stepResults = scenario.steps || [];
      stepResults.forEach((step) => {
        if (step.result?.status === 'passed') passed++;
        else if (step.result?.status === 'failed') failed++;
        else if (step.result?.status === 'skipped') skipped++;
      });
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Catch Recording - Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 15px; border-radius: 5px; color: white; min-width: 100px; text-align: center; }
    .passed { background: #28a745; }
    .failed { background: #dc3545; }
    .skipped { background: #ffc107; color: #333; }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 14px; margin-top: 5px; }
    .timestamp { color: #666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Catch Recording Automation - Test Report</h1>
    <div class="summary">
      <div class="stat passed">
        <div class="stat-value">${passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat failed">
        <div class="stat-value">${failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat skipped">
        <div class="stat-value">${skipped}</div>
        <div class="stat-label">Skipped</div>
      </div>
    </div>
    <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    <div class="timestamp">Environment: ${process.env.TEST_ENV || 'uat'}</div>
  </div>
</body>
</html>`;

    fs.writeFileSync(htmlReportPath, html);
    console.log(`HTML report generated: ${htmlReportPath}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Report generation skipped:', message);
  }
}

generateHtmlReport();
