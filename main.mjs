import { readFile } from "./modules/fileIO.mjs";
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
export { processBatch };
