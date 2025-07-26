import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Simple mock Button component for testing
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button className={`btn ${className || ""}`} ref={ref} {...props}>
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Simple mock Input component for testing
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return <input className={`input ${className || ""}`} ref={ref} {...props} />;
});
Input.displayName = "Input";

describe("Component Tests (Simplified)", () => {
  describe("Button Component", () => {
    it("should render button with text", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button", { name: /click me/i });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button", { name: /disabled button/i });
      expect(button).toBeDisabled();
    });

    it("should accept custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button", { name: /custom/i });
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Input Component", () => {
    it("should render input with placeholder", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
    });

    it("should handle value changes", () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} data-testid="test-input" />);

      const input = screen.getByTestId("test-input");
      fireEvent.change(input, { target: { value: "test value" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is true", () => {
      render(<Input disabled data-testid="disabled-input" />);
      const input = screen.getByTestId("disabled-input");
      expect(input).toBeDisabled();
    });

    it("should accept custom className", () => {
      render(<Input className="custom-input" data-testid="custom-input" />);
      const input = screen.getByTestId("custom-input");
      expect(input).toHaveClass("custom-input");
    });
  });

  describe("Form Integration", () => {
    it("should work together in a form", () => {
      const handleSubmit = jest.fn();

      const TestForm = () => {
        const [value, setValue] = React.useState("");

        const onSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          handleSubmit(value);
        };

        return (
          <form onSubmit={onSubmit}>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              data-testid="form-input"
            />
            <Button type="submit">Submit</Button>
          </form>
        );
      };

      render(<TestForm />);

      const input = screen.getByTestId("form-input");
      const button = screen.getByRole("button", { name: /submit/i });

      fireEvent.change(input, { target: { value: "test value" } });
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalledWith("test value");
    });
  });
});
