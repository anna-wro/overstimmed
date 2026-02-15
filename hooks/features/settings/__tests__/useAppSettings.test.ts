import { renderHook } from "@testing-library/react";
import { useAppSettings } from "@/hooks/features/settings/useAppSettings";

describe("useAppSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default settings", () => {
    const { result } = renderHook(() => useAppSettings());
    const [settings] = result.current;

    expect(settings.theme).toBe("system");
    expect(settings.highContrastMode).toBe(false);
    expect(settings.fontSize).toBe(16);
    expect(settings.reminders).toBe(false);
    expect(settings.lowSpoonMode).toBe(false);
  });

  it("returns a setter function", () => {
    const { result } = renderHook(() => useAppSettings());
    const [, setSettings] = result.current;

    expect(typeof setSettings).toBe("function");
  });
});
