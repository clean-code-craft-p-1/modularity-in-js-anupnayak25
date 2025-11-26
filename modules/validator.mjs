// Validation and line parsing (extracted from original main.mjs logic)

export function validateTimestamp(timestamp) {
  return timestamp.split(":").length === 3;
}

export function validateTemperature(value) {
  const temp = parseFloat(value);
  if (isNaN(temp)) return { valid: false };
  if (temp < -100 || temp > 200) return { valid: false };
  return { valid: true, temp };
}

// Parse a single CSV line. Returns
// { blank:true } for blank lines
// { error:true } for invalid lines
// { timestamp, temp } for valid readings
export function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return { blank: true };

  const parts = trimmed.split(",");
  if (parts.length !== 2) return { error: true };

  const timestamp = parts[0].trim();
  const value = parts[1].trim();

  if (!validateTimestamp(timestamp)) return { error: true };
  const tempObj = validateTemperature(value);
  if (!tempObj.valid) return { error: true };

  return { timestamp, temp: tempObj.temp };
}
