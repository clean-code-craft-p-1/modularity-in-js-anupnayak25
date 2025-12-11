import { writeFile, deleteFile, readFile } from "./modules/fileIO.mjs";
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
console.log(`Test file created: ${testFilename}`);

// Process the test file
processBatch(testFilename);

const parseData = parseFileContent(readFile(testFilename));

// Feature 1: Fever Detection & Alerting
const feverResult = detectSustainedFever(parseData, { threshold: 38.0, minDurationMinutes: 30 });
console.log("\nFever:", feverResult.hasAlert ? `${feverResult.alerts.length} interval(s)` : "none");

// Feature 2: Circadian Pattern Summary
const circadian = summarizeCircadian(parseData);
console.log(
  `\nCircadian: day ${circadian.dayAvg.toFixed(2)}°C, night ${circadian.nightAvg.toFixed(
    2
  )}°C, Δ ${circadian.nightHigherBy.toFixed(2)}°C`
);
if (circadian.notes.length) circadian.notes.forEach((n) => console.log(`Note: ${n}`));

// Clean up
deleteFile(testFilename);
deleteFile(testFilename + "_summary.txt");
