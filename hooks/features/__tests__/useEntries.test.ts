import { renderHook, act, waitFor } from "@testing-library/react";
import { useEntries } from "@/hooks/features/useEntries";

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockNeq = vi.fn();
const mockInsert = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      select: (...args: unknown[]) => {
        mockSelect(...args);
        return {
          order: (...oArgs: unknown[]) => {
            mockOrder(...oArgs);
            return Promise.resolve({ data: [], error: null });
          },
        };
      },
      delete: () => {
        mockDelete();
        return {
          eq: (...args: unknown[]) => {
            mockEq(...args);
            return Promise.resolve({ error: null });
          },
          neq: (...args: unknown[]) => {
            mockNeq(...args);
            return Promise.resolve({ error: null });
          },
        };
      },
      insert: (...args: unknown[]) => {
        mockInsert(...args);
        return Promise.resolve({ error: null });
      },
    }),
    auth: {
      getUser: () => {
        mockGetUser();
        return Promise.resolve({ data: { user: { id: "user-1" } } });
      },
    },
  }),
}));

describe("useEntries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches entries on mount", async () => {
    const { result } = renderHook(() => useEntries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(result.current.entries).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("calls deleteEntry with correct id", async () => {
    const { result } = renderHook(() => useEntries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteEntry("entry-123");
    });

    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "entry-123");
  });

  it("calls deleteAll", async () => {
    const { result } = renderHook(() => useEntries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteAll();
    });

    expect(mockDelete).toHaveBeenCalled();
    expect(mockNeq).toHaveBeenCalled();
  });

  it("inserts entries with user id", async () => {
    const { result } = renderHook(() => useEntries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.insertEntries([
        {
          timestamp: "2024-06-15T10:00:00.000Z",
          energyLevel: 7,
          stimulationLevel: 4,
          stimulationType: "positive",
          triggers: "coffee",
          activities: "working",
          notes: "",
        },
      ]);
    });

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalled();
  });

  it("skips insert for empty array", async () => {
    const { result } = renderHook(() => useEntries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.insertEntries([]);
    });

    expect(mockInsert).not.toHaveBeenCalled();
  });
});
