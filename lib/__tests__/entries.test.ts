import {
  mapRowToEntry,
  mapEntryToRow,
  type EntriesRow,
  type TrackingEntry,
} from "@/lib/entries";

const createMockRow = (overrides: Partial<EntriesRow> = {}): EntriesRow => ({
  id: "row-1",
  user_id: "user-1",
  timestamp: "2024-06-15T10:30:00.000Z",
  energy_level: 7,
  stimulation_level: 4,
  stimulation_type: "positive",
  triggers: "coffee",
  feelings: "happy",
  activities: "working",
  notes: "Good morning",
  ...overrides,
});

const createMockEntry = (
  overrides: Partial<TrackingEntry> = {}
): Omit<TrackingEntry, "id"> => ({
  timestamp: "2024-06-15T10:30:00.000Z",
  energyLevel: 7,
  stimulationLevel: 4,
  stimulationType: "positive",
  triggers: "coffee",
  feelings: "happy",
  activities: "working",
  notes: "Good morning",
  ...overrides,
});

describe("mapRowToEntry", () => {
  it("maps a DB row to a TrackingEntry", () => {
    const row = createMockRow();
    const entry = mapRowToEntry(row);

    expect(entry).toEqual({
      id: "row-1",
      timestamp: "2024-06-15T10:30:00.000Z",
      energyLevel: 7,
      stimulationLevel: 4,
      stimulationType: "positive",
      triggers: "coffee",
      feelings: "happy",
      activities: "working",
      notes: "Good morning",
    });
  });

  it("defaults null string fields to empty string", () => {
    const row = createMockRow({
      triggers: null as unknown as string,
      feelings: null as unknown as string,
      activities: null as unknown as string,
      notes: null as unknown as string,
    });
    const entry = mapRowToEntry(row);

    expect(entry.triggers).toBe("");
    expect(entry.feelings).toBe("");
    expect(entry.activities).toBe("");
    expect(entry.notes).toBe("");
  });
});

describe("mapEntryToRow", () => {
  it("maps a TrackingEntry to an insert row with user_id", () => {
    const entry = createMockEntry();
    const row = mapEntryToRow(entry, "user-42");

    expect(row).toEqual({
      user_id: "user-42",
      timestamp: "2024-06-15T10:30:00.000Z",
      energy_level: 7,
      stimulation_level: 4,
      stimulation_type: "positive",
      triggers: "coffee",
      feelings: "happy",
      activities: "working",
      notes: "Good morning",
    });
  });

  it("defaults undefined string fields to empty string", () => {
    const entry = createMockEntry({
      triggers: undefined as unknown as string,
      feelings: undefined,
      activities: undefined as unknown as string,
      notes: undefined as unknown as string,
    });
    const row = mapEntryToRow(entry, "user-1");

    expect(row.triggers).toBe("");
    expect(row.feelings).toBe("");
    expect(row.activities).toBe("");
    expect(row.notes).toBe("");
  });
});
