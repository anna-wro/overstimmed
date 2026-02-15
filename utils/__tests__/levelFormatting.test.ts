import {
  getEnergyColor,
  getEnergyTextColor,
  getEnergyText,
  getStimulationColor,
  getStimulationText,
  getEnergyBackgroundColor,
  getEnergyNumberColor,
  getEnergyDescription,
  getStimulationDescription,
} from "@/utils/levelFormatting";

describe("getEnergyText", () => {
  it("returns 'No Energy' for 0", () => {
    expect(getEnergyText(0)).toBe("No Energy");
  });

  it("returns 'Low Energy' for 1-3", () => {
    expect(getEnergyText(1)).toBe("Low Energy");
    expect(getEnergyText(3)).toBe("Low Energy");
  });

  it("returns 'Moderate Energy' for 4-7", () => {
    expect(getEnergyText(4)).toBe("Moderate Energy");
    expect(getEnergyText(7)).toBe("Moderate Energy");
  });

  it("returns 'High Energy' for 8-10", () => {
    expect(getEnergyText(8)).toBe("High Energy");
    expect(getEnergyText(10)).toBe("High Energy");
  });
});

describe("getStimulationText", () => {
  it("returns 'No Stimulation' for 0", () => {
    expect(getStimulationText(0)).toBe("No Stimulation");
  });

  it("returns 'Low Stimulation' for 1-3", () => {
    expect(getStimulationText(1)).toBe("Low Stimulation");
    expect(getStimulationText(3)).toBe("Low Stimulation");
  });

  it("returns 'Moderate Stimulation' for 4-7", () => {
    expect(getStimulationText(4)).toBe("Moderate Stimulation");
    expect(getStimulationText(7)).toBe("Moderate Stimulation");
  });

  it("returns 'High Stimulation' for 8-10", () => {
    expect(getStimulationText(8)).toBe("High Stimulation");
    expect(getStimulationText(10)).toBe("High Stimulation");
  });
});

describe("getEnergyColor", () => {
  it("returns gray for 0", () => {
    expect(getEnergyColor(0)).toContain("gray");
  });

  it("returns blush for low (1-3)", () => {
    expect(getEnergyColor(2)).toContain("blush");
  });

  it("returns sand for moderate (4-7)", () => {
    expect(getEnergyColor(5)).toContain("sand");
  });

  it("returns mint for high (8-10)", () => {
    expect(getEnergyColor(9)).toContain("mint");
  });
});

describe("getEnergyTextColor", () => {
  it("returns gray for 0", () => {
    expect(getEnergyTextColor(0)).toContain("gray");
  });

  it("returns blush for low", () => {
    expect(getEnergyTextColor(2)).toContain("blush");
  });

  it("returns sand for moderate", () => {
    expect(getEnergyTextColor(5)).toContain("sand");
  });

  it("returns mint for high", () => {
    expect(getEnergyTextColor(9)).toContain("mint");
  });
});

describe("getStimulationColor", () => {
  it("returns gray for 0", () => {
    expect(getStimulationColor(0)).toContain("gray");
  });

  it("returns sand for low (1-3)", () => {
    expect(getStimulationColor(2)).toContain("sand");
  });

  it("returns lavender for moderate (4-7)", () => {
    expect(getStimulationColor(5)).toContain("lavender");
  });

  it("returns blush for high (8-10)", () => {
    expect(getStimulationColor(9)).toContain("blush");
  });
});

describe("getEnergyBackgroundColor", () => {
  it("returns gray for 0", () => {
    expect(getEnergyBackgroundColor(0)).toContain("gray");
  });

  it("returns blush for low", () => {
    expect(getEnergyBackgroundColor(2)).toContain("blush");
  });

  it("returns sand for moderate", () => {
    expect(getEnergyBackgroundColor(5)).toContain("sand");
  });

  it("returns mint for high", () => {
    expect(getEnergyBackgroundColor(9)).toContain("mint");
  });
});

describe("getEnergyNumberColor", () => {
  it("returns gray for 0", () => {
    expect(getEnergyNumberColor(0)).toContain("gray");
  });

  it("returns blush for low", () => {
    expect(getEnergyNumberColor(2)).toContain("blush");
  });

  it("returns sand for moderate", () => {
    expect(getEnergyNumberColor(5)).toContain("sand");
  });

  it("returns mint for high", () => {
    expect(getEnergyNumberColor(9)).toContain("mint");
  });
});

describe("getEnergyDescription", () => {
  it("returns depletion text for 0", () => {
    expect(getEnergyDescription(0)).toContain("depletion");
  });

  it("returns below normal for low", () => {
    expect(getEnergyDescription(2)).toContain("Below normal");
  });

  it("returns balanced for moderate", () => {
    expect(getEnergyDescription(5)).toContain("Balanced");
  });

  it("returns energized for high", () => {
    expect(getEnergyDescription(9)).toContain("Energized");
  });
});

describe("getStimulationDescription", () => {
  it("returns understimulated for 0", () => {
    expect(getStimulationDescription(0)).toContain("understimulated");
  });

  it("returns mildly understimulated for low", () => {
    expect(getStimulationDescription(2)).toContain("Mildly");
  });

  it("returns comfortable for moderate", () => {
    expect(getStimulationDescription(5)).toContain("Comfortable");
  });

  it("returns highly stimulated for high", () => {
    expect(getStimulationDescription(9)).toContain("Highly stimulated");
  });
});
