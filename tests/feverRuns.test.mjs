import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectSustainedFever } from "../features/feverDetection.mjs";

function makeData(timestamps, temps) {
  return { timestamps, temps };
}
describe("detectSustainedFever - fever run scenarios", () => {
  it("detects a single sustained fever run that exceeds minimum duration", () => {
    const ts = ["00:00:00", "00:10:00", "00:20:00", "00:30:00"]; // 10 min gaps
    const temps = [38.0, 38.2, 38.5, 37.0];
    const result = detectSustainedFever(makeData(ts, temps), {
      threshold: 38.0,
      minDurationMinutes: 20,
    });
    assert.equal(result.hasAlert, true);
    assert.equal(result.alerts.length, 1);
    const alert = result.alerts[0];
    assert.equal(alert.startIndex, 0);
    assert.equal(alert.endIndex, 2);
    assert.equal(alert.startTime, "00:00:00");
    assert.equal(alert.endTime, "00:20:00");
    assert.equal(alert.maxTemp, 38.5);
    // duration 20 minutes = 1200 seconds
    assert.equal(alert.durationSeconds, 1200);
  });

  it("detects a fever run that lasts through the final element", () => {
    const ts = ["01:00:00", "01:15:00", "01:30:00"];
    const temps = [38.1, 38.4, 38.3];
    const result = detectSustainedFever(makeData(ts, temps), { threshold: 38.0, minDurationMinutes: 20,});
    assert.equal(result.hasAlert, true);
    assert.equal(result.alerts.length, 1);
    const alert = result.alerts[0];
    assert.equal(alert.startIndex, 0);
    assert.equal(alert.endIndex, 2);
    assert.equal(alert.startTime, "01:00:00");
    assert.equal(alert.endTime, "01:30:00");
  });

  it("does not alert for two short, separated fever runs", () => {
  const ts = ["02:00:00", "02:08:00","02:16:00", "02:30:00",  "02:38:00", "02:46:00",];
  const temps = [38.1, 38.2, 37.0, 38.3, 38.4, 37.0];
  const result = detectSustainedFever(makeData(ts, temps), {threshold: 38.0, minDurationMinutes: 20,}); // higher than each segment's duration
  assert.equal(result.hasAlert, false);
  assert.equal(result.alerts.length, 0);
  });
});
