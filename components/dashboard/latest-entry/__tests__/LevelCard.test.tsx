import { render, screen } from "@testing-library/react";
import { LevelCard } from "@/components/dashboard/latest-entry/LevelCard";

describe("LevelCard", () => {
  const defaultProps = {
    label: "Energy Level",
    level: 7,
    text: "High Energy",
    description: "Energized - feeling great",
    icon: <span data-testid="icon">icon</span>,
    backgroundColorClass: "bg-mint-100",
    numberColorClass: "bg-mint-50 text-mint-600",
    textColorClass: "text-mint-600",
    progressColorClass: "bg-mint-300",
    progressBackgroundClass: "bg-gray-100",
  };

  it("renders the label", () => {
    render(<LevelCard {...defaultProps} />);

    expect(screen.getByText("Energy Level")).toBeInTheDocument();
  });

  it("renders the level number", () => {
    render(<LevelCard {...defaultProps} />);

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders the text description", () => {
    render(<LevelCard {...defaultProps} />);

    expect(screen.getByText("High Energy")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<LevelCard {...defaultProps} />);

    expect(screen.getByText("Energized - feeling great")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(<LevelCard {...defaultProps} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("sets progress bar width based on level", () => {
    const { container } = render(<LevelCard {...defaultProps} />);

    const progressBar = container.querySelector("[style]");
    expect(progressBar).toHaveStyle({ width: "70%" });
  });
});
