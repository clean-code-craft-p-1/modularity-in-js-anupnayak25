// Circadian analysis: summarize 24-hour patterns for abnormal rhythms
// Input: parseData with { timestamps: string[], temps: number[] }

function hourOf(ts) {
  return parseInt(ts.split(":")[0], 10);
}
function avg(arr) {
  return arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0;
}
// Returns a summary with hourly averages and day/night comparison
// { hourlyAverages: number[24], dayAvg, nightAvg, nightHigherBy, notes: string[] }
export function summarizeCircadian(parseData) {
  const { timestamps = [], temps = [] } = parseData;
  const buckets = Array.from({ length: 24 }, () => []);

  for (let i = 0; i < temps.length; i++) {
    const hour = hourOf(timestamps[i]);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) continue;
    buckets[hour].push(temps[i]);
  }

  const hourlyAverages = buckets.map((b) => avg(b));

  // Define day 08:00-20:00, night 20:00-08:00
  const dayHours = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  const nightHours = new Set([0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23]);

  const dayTemps = [];
  const nightTemps = [];
  for (let hour = 0; hour < 24; hour++) {
    const arr = buckets[hour];
    if (dayHours.has(hour)) dayTemps.push(...arr);
    if (nightHours.has(hour)) nightTemps.push(...arr);
  }

  const dayAvg = avg(dayTemps);
  const nightAvg = avg(nightTemps);
  const nightHigherBy = nightAvg - dayAvg;

  const notes = [];
  if (nightTemps.length && dayTemps.length) {
    if (nightHigherBy > 0.5) {
      notes.push("Night-time temperatures are notably higher than daytime.");
    }
    if (dayAvg > 38 && nightAvg <= 37.5) {
      notes.push("Potential daytime fever pattern detected.");
    }
    if (nightAvg > 38 && dayAvg <= 37.5) {
      notes.push("Potential night-time fever pattern detected.");
    }
  }

  return { hourlyAverages, dayAvg, nightAvg, nightHigherBy, notes };
}
