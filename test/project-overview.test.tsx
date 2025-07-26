import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectOverview from "@/components/project-overview";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(
      ({ children, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      )
    ),
  },
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return React.forwardRef<HTMLAnchorElement, any>(
    ({ children, href, ...props }, ref) => (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    )
  );
});

// Mock the icons
jest.mock("@/components/icons", () => ({
  VercelIcon: ({ size }: { size?: number }) => (
    <div data-testid="vercel-icon" data-size={size}>
      Vercel Icon
    </div>
  ),
  InformationIcon: () => (
    <div data-testid="information-icon">Information Icon</div>
  ),
}));

describe("ProjectOverview Component", () => {
  it("should render without crashing", () => {
    render(<ProjectOverview />);
    expect(screen.getByText(/useChat/)).toBeInTheDocument();
  });

  it("should display the main title icons", () => {
    render(<ProjectOverview />);

    expect(screen.getByTestId("vercel-icon")).toBeInTheDocument();
    expect(screen.getByTestId("information-icon")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("should render VercelIcon with correct size", () => {
    render(<ProjectOverview />);

    const vercelIcon = screen.getByTestId("vercel-icon");
    expect(vercelIcon).toHaveAttribute("data-size", "16");
  });

  it("should have correct structure and styling classes", () => {
    const { container } = render(<ProjectOverview />);

    // Check outer container
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass("w-full", "max-w-[600px]", "my-4");

    // Check inner container
    const innerDiv = outerDiv.querySelector("div");
    expect(innerDiv).toHaveClass(
      "border",
      "rounded-lg",
      "p-6",
      "flex",
      "flex-col",
      "gap-4"
    );
  });

  it("should render all links with correct hrefs", () => {
    render(<ProjectOverview />);

    const useChatLink = screen.getByText("useChat");
    expect(useChatLink).toHaveAttribute(
      "href",
      "https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat"
    );

    const streamTextLink = screen.getByText("streamText");
    expect(streamTextLink).toHaveAttribute(
      "href",
      "https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text"
    );

    const guideLink = screen.getByText("guide");
    expect(guideLink).toHaveAttribute(
      "href",
      "https://sdk.vercel.ai/docs/guides/rag-chatbot"
    );
  });

  it("should have external link target for guide link", () => {
    render(<ProjectOverview />);

    const guideLink = screen.getByText("guide");
    expect(guideLink).toHaveAttribute("target", "_blank");
  });

  it("should have blue text color for all links", () => {
    render(<ProjectOverview />);

    const links = [
      screen.getByText("useChat"),
      screen.getByText("streamText"),
      screen.getByText("guide"),
    ];

    links.forEach((link) => {
      expect(link).toHaveClass("text-blue-500");
    });
  });

  it("should render the main description text", () => {
    render(<ProjectOverview />);

    expect(
      screen.getByText(
        /allows you to build applications with retrieval augmented generation/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Data is stored as vector embeddings using DrizzleORM and PostgreSQL/
      )
    ).toBeInTheDocument();
  });

  it("should render the learn more text", () => {
    render(<ProjectOverview />);

    expect(
      screen.getByText(/Learn how to build this project by following this/)
    ).toBeInTheDocument();
  });

  it("should have proper text colors for different elements", () => {
    const { container } = render(<ProjectOverview />);

    // Check icon container has dark text
    const iconContainer = screen.getByText("+").parentElement;
    expect(iconContainer).toHaveClass(
      "text-neutral-900",
      "dark:text-neutral-50"
    );

    // Check main container has neutral text
    const mainContainer = container.querySelector(".border");
    expect(mainContainer).toHaveClass(
      "text-neutral-500",
      "dark:text-neutral-400"
    );
  });

  it("should have dark mode styles", () => {
    const { container } = render(<ProjectOverview />);

    const mainContainer = container.querySelector(".border");
    expect(mainContainer).toHaveClass(
      "dark:border-neutral-700",
      "dark:bg-neutral-900"
    );
  });

  it("should render as a motion div", () => {
    const { container } = render(<ProjectOverview />);

    // The motion.div should be rendered as a regular div due to our mock
    const motionDiv = container.firstChild;
    expect(motionDiv).toBeInTheDocument();
  });

  it("should be accessible", () => {
    render(<ProjectOverview />);

    // Check that all links are properly accessible
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });
  });
});
