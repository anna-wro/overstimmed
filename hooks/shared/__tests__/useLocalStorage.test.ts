import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/shared/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("returns the default value initially", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("reads existing value from localStorage after mount", async () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    // After useEffect runs, value should update
    await vi.waitFor(() => {
      expect(result.current[0]).toBe("stored-value");
    });
  });

  it("updates state when setter is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
  });

  it("handles complex objects", () => {
    const defaultVal = { theme: "light", fontSize: 14 };
    const { result } = renderHook(() => useLocalStorage("settings", defaultVal));

    act(() => {
      result.current[1]({ theme: "dark", fontSize: 16 });
    });

    expect(result.current[0]).toEqual({ theme: "dark", fontSize: 16 });
  });

  it("falls back to default if localStorage has invalid JSON", async () => {
    localStorage.setItem("bad-key", "not-json{{{");

    const { result } = renderHook(() => useLocalStorage("bad-key", "fallback"));

    // Should stay at default since JSON.parse will fail
    expect(result.current[0]).toBe("fallback");
  });
});
