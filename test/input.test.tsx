import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("should render with default props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex", "h-10", "w-full");
  });

  it("should accept custom type", () => {
    render(<Input type="email" data-testid="email-input" />);
    const input = screen.getByTestId("email-input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("should accept custom className", () => {
    render(<Input className="custom-class" data-testid="custom-input" />);
    const input = screen.getByTestId("custom-input");
    expect(input).toHaveClass("custom-class");
  });

  it("should handle value changes", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="change-input" />);
    const input = screen.getByTestId("change-input");

    fireEvent.change(input, { target: { value: "test value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled data-testid="disabled-input" />);
    const input = screen.getByTestId("disabled-input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
  });

  it("should forward ref correctly", () => {
    const ref = jest.fn();
    render(<Input ref={ref} data-testid="ref-input" />);
    expect(ref).toHaveBeenCalled();
  });

  it("should handle focus and blur events", () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="focus-input"
      />
    );

    const input = screen.getByTestId("focus-input");

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("should accept default value", () => {
    render(<Input defaultValue="default text" data-testid="default-input" />);
    const input = screen.getByTestId("default-input") as HTMLInputElement;
    expect(input.value).toBe("default text");
  });

  it("should handle controlled input", () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState("");
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled-input"
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByTestId("controlled-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "controlled" } });
    expect(input.value).toBe("controlled");
  });
});
