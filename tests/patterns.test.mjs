import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeCircadian } from "../features/circadianAnalysis.mjs";

function makeData(timestamps, temps) {
  return { timestamps, temps };
}

describe("summarizeCircadian - pattern detection", () => {
  it("adds a note when night-time temperatures are notably higher than daytime", () => {
    const ts = ["08:00:00",  "09:00:00",  "22:00:00", "23:00:00",];
    const temps = [37.0, 37.0, 38.0, 38.0];
    const result = summarizeCircadian(makeData(ts, temps));
    assert(result.nightAvg > result.dayAvg);
    assert(result.nightHigherBy > 0.5);
    assert(result.notes.includes("Night-time temperatures are notably higher than daytime."));
  });

  it("detects a daytime fever pattern", () => {
    const ts = [ "10:00:00",  "11:00:00", "01:00:00", "02:00:00",];
    const temps = [39.0, 38.5, 37.0, 37.2];
    const result = summarizeCircadian(makeData(ts, temps));
    assert(result.dayAvg > 38);
    assert(result.nightAvg <= 37.5);
    assert(result.notes.includes("Potential daytime fever pattern detected."));
  });

  it("detects a night-time fever pattern", () => {
    const ts = ["10:00:00", "11:00:00", "01:00:00", "02:00:00"];
    const temps = [37.0, 37.2, 39.0, 38.5];
    const result = summarizeCircadian(makeData(ts, temps));
    assert(result.nightAvg > 38);
    assert(result.dayAvg <= 37.5);
    assert(result.notes.includes("Potential night-time fever pattern detected."));
  });

  it("does not add notes when both day and night temps are normal", () => {
    const ts = ["10:00:00", "11:00:00", "01:00:00", "02:00:00"];
    const temps = [37.2, 37.3, 37.4, 37.3];
    const result = summarizeCircadian(makeData(ts, temps));
    assert.equal(result.notes.length, 0);
  });
});
