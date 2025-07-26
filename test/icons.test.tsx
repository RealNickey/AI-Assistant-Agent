import React from "react";
import { render } from "@testing-library/react";
import { VercelIcon, InformationIcon, LoadingIcon } from "@/components/icons";

describe("Icon Components", () => {
  describe("VercelIcon", () => {
    it("should render with default size", () => {
      const { container } = render(<VercelIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("height", "17");
      expect(svg).toHaveAttribute("width", "17");
    });

    it("should render with custom size", () => {
      const { container } = render(<VercelIcon size={24} />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("height", "24");
      expect(svg).toHaveAttribute("width", "24");
    });

    it("should have correct viewBox", () => {
      const { container } = render(<VercelIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("should have triangle path", () => {
      const { container } = render(<VercelIcon />);
      const path = container.querySelector("path");

      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute("d", "M8 1L16 15H0L8 1Z");
      expect(path).toHaveAttribute("fill", "currentColor");
    });

    it("should have current color style", () => {
      const { container } = render(<VercelIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("style");
      expect(svg?.getAttribute("style")).toContain("color:");
    });
  });

  describe("InformationIcon", () => {
    it("should render with default size", () => {
      const { container } = render(<InformationIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("height", "17");
      expect(svg).toHaveAttribute("width", "17");
    });

    it("should render with custom size", () => {
      const { container } = render(<InformationIcon size={20} />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("height", "20");
      expect(svg).toHaveAttribute("width", "20");
    });

    it("should have correct viewBox", () => {
      const { container } = render(<InformationIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("should have information icon path", () => {
      const { container } = render(<InformationIcon />);
      const path = container.querySelector("path");

      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute("fill", "currentColor");
      // Note: fillRule and clipRule might be camelCase in React but kebab-case in DOM
      const fillRule =
        path?.getAttribute("fillRule") || path?.getAttribute("fill-rule");
      const clipRule =
        path?.getAttribute("clipRule") || path?.getAttribute("clip-rule");
      expect(fillRule).toBe("evenodd");
      expect(clipRule).toBe("evenodd");
    });

    it("should have current color style", () => {
      const { container } = render(<InformationIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("style");
      expect(svg?.getAttribute("style")).toContain("color:");
    });
  });

  describe("LoadingIcon", () => {
    it("should render with fixed size", () => {
      const { container } = render(<LoadingIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("height", "16");
      expect(svg).toHaveAttribute("width", "16");
    });

    it("should have correct viewBox", () => {
      const { container } = render(<LoadingIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("should have multiple paths with different opacities", () => {
      const { container } = render(<LoadingIcon />);
      const paths = container.querySelectorAll("path");

      expect(paths.length).toBeGreaterThan(1);

      // Check that some paths have opacity attributes
      const pathsWithOpacity = Array.from(paths).filter((path) =>
        path.hasAttribute("opacity")
      );
      expect(pathsWithOpacity.length).toBeGreaterThan(0);
    });

    it("should have clipPath definition", () => {
      const { container } = render(<LoadingIcon />);
      const clipPath = container.querySelector("clipPath");

      expect(clipPath).toBeInTheDocument();
      expect(clipPath).toHaveAttribute("id", "clip0_2393_1490");
    });

    it("should have current color style", () => {
      const { container } = render(<LoadingIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("style");
      expect(svg?.getAttribute("style")).toContain("color:");
    });

    it("should use stroke instead of fill", () => {
      const { container } = render(<LoadingIcon />);
      const paths = container.querySelectorAll("path");

      // All paths should use stroke
      paths.forEach((path) => {
        expect(path).toHaveAttribute("stroke", "currentColor");
        // strokeWidth might be camelCase in React but kebab-case in DOM
        const strokeWidth =
          path?.getAttribute("strokeWidth") ||
          path?.getAttribute("stroke-width");
        expect(strokeWidth).toBe("1.5");
      });
    });
  });

  describe("Icons accessibility", () => {
    it("should have proper SVG structure for screen readers", () => {
      const { container } = render(<VercelIcon />);
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox");
    });

    it("should support color inheritance", () => {
      const { container } = render(
        <div style={{ color: "red" }}>
          <VercelIcon />
        </div>
      );
      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("style");
      expect(svg?.getAttribute("style")).toContain("color:");
    });
  });
});
