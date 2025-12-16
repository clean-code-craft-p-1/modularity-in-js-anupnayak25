// Console summary + report generation and saving (extracted from original main.mjs)
import { writeFile } from "./fileIO.mjs";

export function printSummary(filename, parseData, stats) {
  const { lines, temps, errors, badLines, num_blank_lines } = parseData;
  console.log("=".repeat(60));
  console.log("Temperature Analysis Summary");
  console.log("=".repeat(60));
  console.log(`Total readings: ${lines.length - num_blank_lines}`);
  console.log(`Valid readings: ${temps.length}`);
  console.log(`Errors: ${errors}`);
  console.log("-".repeat(60));
  console.log(`Max temperature: ${stats.max.toFixed(2)}`);
  console.log(`Min temperature: ${stats.min.toFixed(2)}`);
  console.log(`Average temperature: ${stats.avg.toFixed(2)}`);
  console.log("-".repeat(60));

  if (errors > 0) {
    console.log("Invalid lines:");
    for (const { index, line } of badLines) {
      console.log(`  Line ${index + 1}: ${line}`);
    }
  }
}

export function buildReportContent(filename, parseData, stats) {
  const { lines, temps, errors, badLines, num_blank_lines } = parseData;
  let content = "Temperature Analysis Summary\n";
  content += "=".repeat(50) + "\n";
  content += `File analyzed: ${filename}\n`;
  content += `Total readings: ${lines.length - num_blank_lines}\n`;
  content += `Valid readings: ${temps.length}\n`;
  content += `Errors: ${errors}\n`;
  content += `Max temperature: ${stats.max.toFixed(2)}\n`;
  content += `Min temperature: ${stats.min.toFixed(2)}\n`;
  content += `Average temperature: ${stats.avg.toFixed(2)}\n`;
  content += "-".repeat(60) + "\n";
  if (errors > 0) {
    content += "\nInvalid lines:\n";
    for (const { index, line } of badLines) {
      content += `  Line ${index + 1}: ${line}\n`;
    }
  }
  return content;
}

export function saveReport(filename, reportContent) {
  const outName = filename + "_summary.txt";
  writeFile(outName, reportContent);
  console.log(`Report saved to ${outName}`);
  return outName;
}
