import { writeFile, exists, deleteFile, readFile } from "./modules/fileIO.mjs";
import { parseFileContent } from "./modules/dataParser.mjs";
import { processBatch } from "./main.mjs";
import { detectSustainedFever } from "./features/feverDetection.mjs";
import { summarizeCircadian } from "./features/circadianAnalysis.mjs";

// Main execution (test harness)
const testFilename = "test_temps.csv";
const testData = [
  "09:15:30,23.5",
  "09:16:00,24.1",
  "09:16:30,22.8",
  "09:17:00,25.3",
  "09:17:30,23.9",
  "09:18:00,24.7",
  "09:18:30,22.4",
  "09:19:00,26.1",
  "09:19:30,23.2",
  "09:20:00,25.0",
];

writeFile(testFilename, testData.join("\n") + "\n");
console.log(`Created test file: ${testFilename}`);

// Process the test file
processBatch(testFilename);

// Parse data for feature evaluations
const fileContent = readFile(testFilename);
const parseData = parseFileContent(fileContent);

// Feature 1: Fever Detection & Alerting
const feverResult = detectSustainedFever(parseData, { threshold: 38.0, minDurationMinutes: 30 });
console.log("\nFever Detection:");
if (feverResult.hasAlert) {
  for (const a of feverResult.alerts) {
    console.log(
      `  Sustained fever from ${a.startTime} to ${a.endTime} (${Math.round(
        a.durationSeconds / 60
      )} min), max ${a.maxTemp.toFixed(2)}°C`
    );
  }
} else {
  console.log("  No sustained fever intervals detected.");
}

// Feature 2: Circadian Pattern Summary
const circadian = summarizeCircadian(parseData);
console.log("\nCircadian Summary:");
console.log(
  `  Day avg: ${circadian.dayAvg.toFixed(2)}°C, Night avg: ${circadian.nightAvg.toFixed(
    2
  )}°C, Δ: ${circadian.nightHigherBy.toFixed(2)}°C`
);
if (circadian.notes.length) {
  for (const n of circadian.notes) console.log(`  Note: ${n}`);
} else {
  console.log("  No notable circadian anomalies.");
}

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
