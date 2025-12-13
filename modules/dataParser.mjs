// File content parsing 
import { parseLine } from "./validator.mjs";

export function parseFileContent(fileContent) {
  const lines = fileContent.split("\n");
  const temps = [];
  const timestamps = [];
  let errors = 0;
  const badLines = [];
  let num_blank_lines = 0;

  for (let i = 0; i < lines.length; i++) {
    const result = parseLine(lines[i]);
    if (result.blank) {
      num_blank_lines++;
      continue;
    }
    if (result.error) {
      errors++;
      badLines.push({ index: i, line: lines[i].trim() });
      continue;
    }
    temps.push(result.temp);
    timestamps.push(result.timestamp);
  }

  return {
    lines,
    temps,
    timestamps,
    errors,
    badLines,
    num_blank_lines,
  };
}
