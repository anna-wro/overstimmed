import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState />);

    expect(screen.getByText("No entries yet")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<EmptyState />);

    expect(
      screen.getByText(/Start tracking your energy and stimulation levels/)
    ).toBeInTheDocument();
  });

  it("renders CTA button linking to /track", () => {
    render(<EmptyState />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/track");
    expect(screen.getByText("Create Your First Entry")).toBeInTheDocument();
  });
});
