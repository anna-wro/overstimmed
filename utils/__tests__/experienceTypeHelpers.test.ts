import {
  getExperienceTypeText,
  getExperienceTypeColor,
  getExperienceTypeBgColor,
} from "@/utils/experienceTypeHelpers";

describe("getExperienceTypeText", () => {
  it("returns positive text", () => {
    expect(getExperienceTypeText("positive")).toBe("Positive/Energizing");
  });

  it("returns neutral text", () => {
    expect(getExperienceTypeText("neutral")).toBe("Neutral/Balanced");
  });

  it("returns negative text for 'negative'", () => {
    expect(getExperienceTypeText("negative")).toBe("Negative/Draining");
  });

  it("returns negative text for unknown type", () => {
    expect(getExperienceTypeText("unknown")).toBe("Negative/Draining");
  });
});

describe("getExperienceTypeColor", () => {
  it("returns mint for positive", () => {
    expect(getExperienceTypeColor("positive")).toContain("mint");
  });

  it("returns sand for neutral", () => {
    expect(getExperienceTypeColor("neutral")).toContain("sand");
  });

  it("returns blush for negative", () => {
    expect(getExperienceTypeColor("negative")).toContain("blush");
  });
});

describe("getExperienceTypeBgColor", () => {
  it("returns mint bg for positive", () => {
    expect(getExperienceTypeBgColor("positive")).toContain("bg-mint");
  });

  it("returns sand bg for neutral", () => {
    expect(getExperienceTypeBgColor("neutral")).toContain("bg-sand");
  });

  it("returns blush bg for negative", () => {
    expect(getExperienceTypeBgColor("negative")).toContain("bg-blush");
  });
});
