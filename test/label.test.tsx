import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label Component", () => {
  it("should render with default props", () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("text-sm", "font-medium");
  });

  it("should accept custom className", () => {
    render(<Label className="custom-class">Custom Label</Label>);
    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("custom-class");
  });

  it("should associate with form controls using htmlFor", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  it("should forward ref correctly", () => {
    const ref = jest.fn();
    render(<Label ref={ref}>Label with ref</Label>);
    expect(ref).toHaveBeenCalled();
  });

  it("should render children correctly", () => {
    render(
      <Label>
        <span>Complex</span> Label Content
      </Label>
    );

    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText("Label Content")).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Label onClick={handleClick}>Clickable Label</Label>);

    const label = screen.getByText("Clickable Label");
    label.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply peer-disabled styles", () => {
    render(<Label>Peer Disabled Label</Label>);
    const label = screen.getByText("Peer Disabled Label");
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });
});
