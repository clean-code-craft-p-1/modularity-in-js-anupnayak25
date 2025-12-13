// Fever detection: sustained high temperature for a continuous duration
// Uses parse data from modules/dataParser.mjs: { timestamps: string[], temps: number[] }

function toSeconds(ts) {
  const [hh, mm, ss] = ts.split(":").map((x) => parseInt(x, 10));
  return hh * 3600 + mm * 60 + ss;
}
// Detect intervals where temperature >= threshold for at least minDurationMinutes
// Returns { alerts: [{ startIndex, endIndex, startTime, endTime, durationSeconds, maxTemp }], hasAlert }
export function detectSustainedFever(parseData, options = {}) {
  const threshold = options.threshold ?? 38.0; // Celsius
  const minDurationMinutes = options.minDurationMinutes ?? 30;
  const minDurationSeconds = minDurationMinutes * 60;

  const { timestamps = [], temps = [] } = parseData;
  if (!timestamps.length || !temps.length) return { alerts: [], hasAlert: false };

  const alerts = [];
  let runStart = null; // index
  let runMax = -Infinity;

  for (let i = 0; i < temps.length; i++) {
    const hot = temps[i] >= threshold;
    if (hot) {
      if (runStart === null) {
        runStart = i;
        runMax = temps[i];
      } else {
        runMax = Math.max(runMax, temps[i]);
      }
    }
    const isRunEnding = !hot || i === temps.length - 1;
    if (runStart !== null && isRunEnding) {
      const endIndex = hot ? i : i - 1;
      const startTimeSec = toSeconds(timestamps[runStart]);
      const endTimeSec = toSeconds(timestamps[endIndex]);
      const duration = endTimeSec - startTimeSec;
      if (duration >= minDurationSeconds) {
        alerts.push({
          startIndex: runStart,
          endIndex,
          startTime: timestamps[runStart],
          endTime: timestamps[endIndex],
          durationSeconds: duration,
          maxTemp: runMax,
        });
      }
      runStart = null;
      runMax = -Infinity;
    }
  }

  return { alerts, hasAlert: alerts.length > 0 };
}
