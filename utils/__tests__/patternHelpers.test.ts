import { getPatternBadgeColor } from "@/utils/patternHelpers";

describe("getPatternBadgeColor", () => {
  it("returns blush for warning severity", () => {
    expect(getPatternBadgeColor("warning")).toContain("blush");
  });

  it("returns mint for success severity", () => {
    expect(getPatternBadgeColor("success")).toContain("mint");
  });

  it("returns lavender for info severity", () => {
    expect(getPatternBadgeColor("info")).toContain("lavender");
  });

  it("returns lavender for unknown severity (default)", () => {
    expect(getPatternBadgeColor("other")).toContain("lavender");
  });
});
