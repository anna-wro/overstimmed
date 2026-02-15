import { calculateQuadrantStats } from "@/utils/correlationHelpers";

type DataPoint = {
  energy: number;
  stimulation: number;
  type: string;
  comfortable: boolean;
};

const createPoint = (overrides: Partial<DataPoint> = {}): DataPoint => ({
  energy: 5,
  stimulation: 5,
  type: "positive",
  comfortable: true,
  ...overrides,
});

describe("calculateQuadrantStats", () => {
  it("classifies high energy, low stimulation as Q1", () => {
    const data = [createPoint({ energy: 8, stimulation: 2, type: "positive" })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[0].name).toBe("High Energy, Low Stimulation");
    expect(result.quadrants[0].total).toBe(1);
    expect(result.quadrants[0].positive).toBe(1);
  });

  it("classifies high energy, high stimulation as Q2", () => {
    const data = [createPoint({ energy: 8, stimulation: 8, type: "neutral" })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[1].name).toBe("High Energy, High Stimulation");
    expect(result.quadrants[1].total).toBe(1);
    expect(result.quadrants[1].neutral).toBe(1);
  });

  it("classifies low energy, low stimulation as Q3", () => {
    const data = [createPoint({ energy: 2, stimulation: 2, type: "negative" })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[2].name).toBe("Low Energy, Low Stimulation");
    expect(result.quadrants[2].total).toBe(1);
    expect(result.quadrants[2].negative).toBe(1);
  });

  it("classifies low energy, high stimulation as Q4", () => {
    const data = [createPoint({ energy: 2, stimulation: 8, type: "positive" })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[3].name).toBe("Low Energy, High Stimulation");
    expect(result.quadrants[3].total).toBe(1);
  });

  it("calculates percentages correctly", () => {
    const data = [
      createPoint({ energy: 8, stimulation: 2 }), // Q1
      createPoint({ energy: 8, stimulation: 2 }), // Q1
      createPoint({ energy: 2, stimulation: 2 }), // Q3
      createPoint({ energy: 2, stimulation: 8 }), // Q4
    ];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[0].percent).toBe(50); // Q1: 2/4
    expect(result.quadrants[2].percent).toBe(25); // Q3: 1/4
    expect(result.quadrants[3].percent).toBe(25); // Q4: 1/4
    expect(result.total).toBe(4);
  });

  it("calculates positive percent within a quadrant", () => {
    const data = [
      createPoint({ energy: 8, stimulation: 2, type: "positive" }),
      createPoint({ energy: 8, stimulation: 2, type: "negative" }),
      createPoint({ energy: 8, stimulation: 2, type: "positive" }),
    ];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[0].positivePercent).toBe(67); // 2/3 rounded
  });

  it("returns 0 positivePercent for empty quadrants", () => {
    const data = [createPoint({ energy: 8, stimulation: 2 })];
    const result = calculateQuadrantStats(data);

    // Q2, Q3, Q4 are empty
    expect(result.quadrants[1].positivePercent).toBe(0);
    expect(result.quadrants[2].positivePercent).toBe(0);
    expect(result.quadrants[3].positivePercent).toBe(0);
  });

  it("uses boundary value 5 as high energy threshold", () => {
    // energy=5 should be high, stimulation=5 should be high → Q2
    const data = [createPoint({ energy: 5, stimulation: 5 })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[1].total).toBe(1);
  });

  it("treats energy=4 as low and stimulation=4 as low", () => {
    const data = [createPoint({ energy: 4, stimulation: 4 })];
    const result = calculateQuadrantStats(data);

    expect(result.quadrants[2].total).toBe(1); // Q3: low energy, low stim
  });
});
