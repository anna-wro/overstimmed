import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagBadge } from "@/components/tags/TagBadge";

describe("TagBadge", () => {
  it("renders the tag text", () => {
    render(<TagBadge tag="noise" onRemove={vi.fn()} removeLabel="Remove noise" />);

    expect(screen.getByText("noise")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    render(<TagBadge tag="noise" onRemove={onRemove} removeLabel="Remove noise" />);

    await userEvent.click(screen.getByRole("button"));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("has accessible remove label", () => {
    render(<TagBadge tag="noise" onRemove={vi.fn()} removeLabel="Remove noise" />);

    expect(screen.getByText("Remove noise")).toBeInTheDocument();
  });
});
