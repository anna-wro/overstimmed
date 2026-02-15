import { renderHook } from "@testing-library/react";
import { useInsightsExport } from "@/hooks/features/insights/useInsightsExport";
import type { TrackingEntry } from "@/lib/entries";

const createMockEntry = (overrides: Partial<TrackingEntry> = {}): TrackingEntry => ({
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

describe("useInsightsExport", () => {
  let mockClick: ReturnType<typeof vi.fn>;
  let appendedChild: HTMLAnchorElement | null;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClick = vi.fn();
    appendedChild = null;

    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      appendedChild = node as HTMLAnchorElement;
      return node;
    });
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = document.createElementNS("http://www.w3.org/1999/xhtml", tag) as HTMLAnchorElement;
      el.click = mockClick;
      return el;
    });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-url");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing for empty entries", () => {
    const { result } = renderHook(() => useInsightsExport());

    result.current.exportCSV([]);

    expect(mockClick).not.toHaveBeenCalled();
  });

  it("creates a download link and clicks it", () => {
    const { result } = renderHook(() => useInsightsExport());

    result.current.exportCSV([createMockEntry()]);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it("sets the correct filename with date", () => {
    const { result } = renderHook(() => useInsightsExport());

    result.current.exportCSV([createMockEntry()]);

    expect(appendedChild?.getAttribute("download")).toContain("overstimmed-data");
  });
});
