import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import type { JournalEntry } from "@/hooks/features/journal/useJournalEntries";

const createMockJournalEntry = (
  overrides: Partial<JournalEntry> = {}
): JournalEntry => ({
  id: "journal-1",
  title: "My Journal Entry",
  content: "Today was a good day.",
  copingStrategies: "Deep breathing",
  timestamp: "2024-06-15T10:00:00.000Z",
  ...overrides,
});

describe("JournalEntryCard", () => {
  const defaultProps = {
    entry: createMockJournalEntry(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the entry title", () => {
    render(<JournalEntryCard {...defaultProps} />);

    expect(screen.getByText("My Journal Entry")).toBeInTheDocument();
  });

  it("renders the entry content", () => {
    render(<JournalEntryCard {...defaultProps} />);

    expect(screen.getByText("Today was a good day.")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    render(<JournalEntryCard {...defaultProps} onEdit={onEdit} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]); // First button is edit

    expect(onEdit).toHaveBeenCalledWith(defaultProps.entry);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    render(<JournalEntryCard {...defaultProps} onDelete={onDelete} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[buttons.length - 1]); // Last button is delete

    expect(onDelete).toHaveBeenCalledWith("journal-1");
  });
});
