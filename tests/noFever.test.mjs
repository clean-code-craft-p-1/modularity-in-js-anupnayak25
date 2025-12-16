import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectSustainedFever } from "../features/feverDetection.mjs";

function makeData(timestamps, temps) {
  return { timestamps, temps };
}

describe("detectSustainedFever - no fever scenarios", () => {
  it("returns no alerts for empty data", () => {
    const result = detectSustainedFever(makeData([], []));
    assert.equal(result.hasAlert, false);
    assert.deepEqual(result.alerts, []);
  });

  it("returns no alerts when all temps are below threshold", () => {
    const ts = ["00:00:00", "00:10:00", "00:20:00", "00:30:00"]; // 10 min gaps
    const temps = [37.0, 37.5, 37.8, 37.9];
    const result = detectSustainedFever(makeData(ts, temps), {
      threshold: 38.0,
      minDurationMinutes: 20,
    });
    assert.equal(result.hasAlert, false);
    assert.deepEqual(result.alerts, []);
  });

  it("does not alert for a short hot run below minimum duration", () => {
    const ts = ["00:00:00", "00:05:00", "00:10:00"]; // 5 min gaps
    const temps = [38.5, 38.6, 37.0];
    // Hot only for 10 minutes (< 30 default)
    const result = detectSustainedFever(makeData(ts, temps));
    assert.equal(result.hasAlert, false);
    assert.deepEqual(result.alerts, []);
  });
});
