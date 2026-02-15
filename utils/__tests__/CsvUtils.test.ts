import { entriesToCSV, csvToEntries, validateCSV } from "@/utils/CsvUtils";
import type { TrackingEntry } from "@/lib/entries";

const createMockEntry = (
  overrides: Partial<TrackingEntry> = {}
): TrackingEntry => ({
  id: "entry-1",
  timestamp: "2024-06-15T10:30:00.000Z",
  energyLevel: 7,
  stimulationLevel: 4,
  stimulationType: "positive",
  triggers: "coffee",
  activities: "working",
  notes: "Good day",
  ...overrides,
});

describe("entriesToCSV", () => {
  it("produces correct CSV header", () => {
    const csv = entriesToCSV([createMockEntry()]);
    const header = csv.split("\n")[0];

    expect(header).toBe(
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes"
    );
  });

  it("formats entry fields correctly", () => {
    const csv = entriesToCSV([createMockEntry()]);
    const dataRow = csv.split("\n")[1];

    expect(dataRow).toContain("7");
    expect(dataRow).toContain("4");
    expect(dataRow).toContain("positive");
    expect(dataRow).toContain("coffee");
  });

  it("escapes fields containing commas", () => {
    const csv = entriesToCSV([
      createMockEntry({ triggers: "noise, lights" }),
    ]);
    const dataRow = csv.split("\n")[1];

    expect(dataRow).toContain('"noise, lights"');
  });

  it("escapes fields containing double quotes", () => {
    const csv = entriesToCSV([
      createMockEntry({ notes: 'He said "hello"' }),
    ]);
    const dataRow = csv.split("\n")[1];

    expect(dataRow).toContain('"He said ""hello"""');
  });

  it("handles empty entries array", () => {
    const csv = entriesToCSV([]);
    const lines = csv.split("\n");

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("Date");
  });
});

describe("csvToEntries", () => {
  it("parses a valid CSV back to entries", () => {
    const csv = [
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes",
      "2024-06-15,10:30:00,7,4,positive,coffee,working,Good day",
    ].join("\n");
    const entries = csvToEntries(csv);

    expect(entries).toHaveLength(1);
    expect(entries[0].energyLevel).toBe(7);
    expect(entries[0].stimulationLevel).toBe(4);
    expect(entries[0].stimulationType).toBe("positive");
    expect(entries[0].triggers).toBe("coffee");
  });

  it("returns empty array for header-only CSV", () => {
    const csv = "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes";
    expect(csvToEntries(csv)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(csvToEntries("")).toEqual([]);
  });

  it("skips blank lines", () => {
    const csv = [
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes",
      "2024-06-15,10:30:00,7,4,positive,coffee,working,Good day",
      "",
      "  ",
    ].join("\n");

    expect(csvToEntries(csv)).toHaveLength(1);
  });

  it("handles quoted fields with commas", () => {
    const csv = [
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes",
      '2024-06-15,10:30:00,7,4,positive,"noise, lights",working,Good day',
    ].join("\n");
    const entries = csvToEntries(csv);

    expect(entries[0].triggers).toBe("noise, lights");
  });

  it("handles escaped double quotes", () => {
    const csv = [
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes",
      '2024-06-15,10:30:00,7,4,positive,coffee,working,"He said ""hello"""',
    ].join("\n");
    const entries = csvToEntries(csv);

    expect(entries[0].notes).toBe('He said "hello"');
  });
});

describe("validateCSV", () => {
  it("returns valid for correct CSV", () => {
    const csv = [
      "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes",
      "2024-06-15,10:30:00,7,4,positive,coffee,working,Good day",
    ].join("\n");

    expect(validateCSV(csv)).toEqual({ valid: true });
  });

  it("rejects empty CSV", () => {
    const result = validateCSV("");
    expect(result.valid).toBe(false);
  });

  it("rejects header-only CSV with no data rows", () => {
    const csv = "Date,Time,Energy Level,Stimulation Level,Experience Type,Triggers,Activities,Notes\n";
    const result = validateCSV(csv);
    expect(result.valid).toBe(false);
  });

  it("rejects CSV with too few columns", () => {
    const csv = "Date,Time\n2024-06-15,10:30:00";
    const result = validateCSV(csv);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("missing required columns");
  });
});

describe("round-trip", () => {
  it("preserves data through entriesToCSV → csvToEntries", () => {
    const original = [
      createMockEntry({ triggers: "noise, lights", notes: 'Said "wow"' }),
    ];
    const csv = entriesToCSV(original);
    const restored = csvToEntries(csv);

    expect(restored).toHaveLength(1);
    expect(restored[0].energyLevel).toBe(original[0].energyLevel);
    expect(restored[0].stimulationLevel).toBe(original[0].stimulationLevel);
    expect(restored[0].stimulationType).toBe(original[0].stimulationType);
    expect(restored[0].triggers).toBe(original[0].triggers);
    expect(restored[0].notes).toBe(original[0].notes);
  });
});
