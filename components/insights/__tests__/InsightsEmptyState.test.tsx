import { render, screen } from "@testing-library/react";
import { InsightsEmptyState } from "@/components/insights/InsightsEmptyState";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("InsightsEmptyState", () => {
  it("renders the empty state title", () => {
    render(<InsightsEmptyState />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<InsightsEmptyState />);

    expect(
      screen.getByText(/Start tracking your energy and stimulation levels to see insights/)
    ).toBeInTheDocument();
  });

  it("renders CTA linking to /track", () => {
    render(<InsightsEmptyState />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/track");
  });
});
