// Basic statistics (extracted from original main.mjs)
export function computeStatistics(temps) {
  const max = Math.max(...temps);
  const min = Math.min(...temps);
  const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  return { max, min, avg };
}
