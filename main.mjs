import { readFile, writeFile, exists, deleteFile } from "./modules/fileIO.mjs";
import { parseFileContent } from "./modules/dataParser.mjs";
import { computeStatistics } from "./modules/statistics.mjs";
import { printSummary, buildReportContent, saveReport } from "./modules/reporter.mjs";

function processBatch(filename) {
  let fileContent;
  try {
    fileContent = readFile(filename);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Error: File not found.");
      return;
    }
    throw error;
  }
  const parseData = parseFileContent(fileContent);
  if (parseData.temps.length === 0) {
    console.log("No valid temperature data found.");
    return;
  }
  const stats = computeStatistics(parseData.temps);
  printSummary(filename, parseData, stats);
  const reportContent = buildReportContent(filename, parseData, stats);
  saveReport(filename, reportContent);
}
// Main execution
const testFilename = "test_temps.csv";
const testData = [ "09:15:30,23.5","09:16:00,24.1","09:16:30,22.8","09:17:00,25.3","09:17:30,23.9","09:18:00,24.7","09:18:30,22.4","09:19:00,26.1", "09:19:30,23.2","09:20:00,25.0",];
writeFile(testFilename, testData.join("\n") + "\n");
console.log(`Created test file: ${testFilename}`);
// Process the test file
processBatch(testFilename);
// Verify the summary file was created
const summaryFile = testFilename + "_summary.txt";
if (exists(summaryFile)) {
  console.log(`\nSummary file created: ${summaryFile}`);
  const content = readFile(summaryFile);
  const checks = ["Total readings: 10", "Valid readings: 10", "Errors: 0"];
  const allChecksPass = checks.every((check) => content.includes(check));
  if (allChecksPass) {
    console.log("✓ Summary file contents verified");
  } else {
    console.log("✗ Summary file verification failed");
  }
}
// Clean up test files
deleteFile(testFilename);
deleteFile(summaryFile);