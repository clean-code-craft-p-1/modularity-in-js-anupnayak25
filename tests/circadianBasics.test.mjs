import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeCircadian } from "../features/circadianAnalysis.mjs";

function makeData(timestamps, temps) {
  return { timestamps, temps };
}

describe("summarizeCircadian - basic behavior", () => {
  it("returns zeros and no notes for empty data", () => {
    const result = summarizeCircadian(makeData([], []));
    assert.equal(result.hourlyAverages.length, 24);
    assert(result.hourlyAverages.every((x) => x === 0));
    assert.equal(result.dayAvg, 0);
    assert.equal(result.nightAvg, 0);
    assert.equal(result.nightHigherBy, 0);
    assert.deepEqual(result.notes, []);
  });

  it("ignores invalid hour timestamps", () => {
    const result = summarizeCircadian(
      makeData(
        [
          "24:00:00", // invalid hour, ignored
          "-1:00:00", // invalid, ignored
          "08:00:00", // valid
        ],
        [39.0, 39.0, 37.0]
      )
    );
    // Only 08:00 goes into bucket 8
    assert(result.hourlyAverages[8] > 0);
  });
});
