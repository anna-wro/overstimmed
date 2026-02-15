import { renderHook, act } from "@testing-library/react";
import { useJournalEntries } from "@/hooks/features/journal/useJournalEntries";
import { useState } from "react";

const { mockToast } = vi.hoisted(() => ({
  mockToast: vi.fn(),
}));

vi.mock("@/hooks/shared/useToast", () => ({
  useToast: () => ({ toast: mockToast }),
  toast: mockToast,
}));

vi.mock("@/hooks/shared/useLocalStorage", () => ({
  useLocalStorage: <T,>(_key: string, defaultValue: T): [T, (v: T) => void] => {
    const [val, setVal] = useState(defaultValue);
    return [val, setVal];
  },
}));

describe("useJournalEntries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial empty state", () => {
    const { result } = renderHook(() => useJournalEntries());

    expect(result.current.title).toBe("");
    expect(result.current.content).toBe("");
    expect(result.current.copingStrategies).toBe("");
  });

  it("saveEntry returns false and shows toast when title is empty", () => {
    const { result } = renderHook(() => useJournalEntries());

    let saved: boolean;
    act(() => {
      saved = result.current.saveEntry();
    });

    expect(saved!).toBe(false);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  it("saveEntry returns true when title is provided", () => {
    const { result } = renderHook(() => useJournalEntries());

    act(() => {
      result.current.setTitle("Test Title");
    });

    let saved: boolean;
    act(() => {
      saved = result.current.saveEntry();
    });

    expect(saved!).toBe(true);
    expect(mockToast).toHaveBeenCalled();
  });

  it("resetForm clears all fields", () => {
    const { result } = renderHook(() => useJournalEntries());

    act(() => {
      result.current.setTitle("Title");
      result.current.setContent("Content");
      result.current.setCopingStrategies("Strategy");
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.title).toBe("");
    expect(result.current.content).toBe("");
    expect(result.current.copingStrategies).toBe("");
  });

  it("loadEntry populates form fields and shows toast", () => {
    const { result } = renderHook(() => useJournalEntries());
    const entry = {
      id: "1",
      title: "Loaded Title",
      content: "Loaded Content",
      copingStrategies: "Loaded Strategy",
      timestamp: "2024-06-15T10:00:00.000Z",
    };

    act(() => {
      result.current.loadEntry(entry);
    });

    expect(result.current.title).toBe("Loaded Title");
    expect(result.current.content).toBe("Loaded Content");
    expect(result.current.copingStrategies).toBe("Loaded Strategy");
    expect(mockToast).toHaveBeenCalled();
  });
});
