import { render, screen } from "@testing-library/react";
import React from "react";
import NoContentComponent from "../NoContentComponent";

describe("NoContentComponent", () => {
  describe("Basic Rendering", () => {
    it("renders with default text and icon", () => {
      render(<NoContentComponent />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(screen.getByLabelText("No data")).toBeInTheDocument();
    });

    it("renders with custom text", () => {
      render(<NoContentComponent text="Custom no data message" />);

      expect(screen.getByText("Custom no data message")).toBeInTheDocument();
      expect(screen.queryByText("No data available")).not.toBeInTheDocument();
    });

    it("renders with custom icon", () => {
      const customIcon = <div data-testid="custom-icon">📊</div>;
      render(<NoContentComponent icon={customIcon} />);

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      expect(screen.queryByLabelText("No data")).not.toBeInTheDocument();
    });

    it("renders with both custom text and icon", () => {
      const customIcon = <div data-testid="custom-icon">🔍</div>;
      render(
        <NoContentComponent
          text="Search returned no results"
          icon={customIcon}
        />,
      );

      expect(
        screen.getByText("Search returned no results"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders with name prop for accessibility", () => {
      render(<NoContentComponent name="search results" />);

      expect(screen.getByLabelText("search results")).toBeInTheDocument();
    });
  });

  describe("Icon Handling", () => {
    it("renders default SVG icon when no custom icon provided", () => {
      render(<NoContentComponent />);

      const svgIcon = document.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveAttribute("fill", "none");
      expect(svgIcon).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("does not render default icon when custom icon is provided", () => {
      const customIcon = <span data-testid="custom">Custom</span>;
      render(<NoContentComponent icon={customIcon} />);

      expect(screen.getByTestId("custom")).toBeInTheDocument();
      expect(document.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders null icon correctly", () => {
      render(<NoContentComponent icon={null} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(document.querySelector("svg")).not.toBeInTheDocument();
    });

    it("handles complex custom icons", () => {
      const complexIcon = (
        <div data-testid="complex-icon">
          <svg viewBox="0 0 50 50" role="img" aria-label="complex icon">
            <circle cx="25" cy="25" r="20" />
          </svg>
          <span>Custom</span>
        </div>
      );

      render(<NoContentComponent icon={complexIcon} />);

      expect(screen.getByTestId("complex-icon")).toBeInTheDocument();
      const customSvg = screen.getByTestId("complex-icon").querySelector("svg");
      expect(customSvg).toHaveAttribute("viewBox", "0 0 50 50");
    });
  });

  describe("Text Handling", () => {
    it("handles empty string text", () => {
      render(<NoContentComponent text="" />);

      expect(screen.queryByText("No data available")).not.toBeInTheDocument();
      // Should still render the container but without text
      expect(screen.getByLabelText("No data")).toBeInTheDocument();
    });

    it("handles very long text", () => {
      const longText =
        "This is a very long text that describes in detail why there is no data available in this table and what the user might want to do about it";
      render(<NoContentComponent text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles text with HTML entities", () => {
      const textWithEntities = "No data found &mdash; try searching again";
      render(<NoContentComponent text={textWithEntities} />);

      expect(screen.getByText(textWithEntities)).toBeInTheDocument();
    });

    it("handles multiline text", () => {
      const multilineText = "No data available.\nPlease try again later.";
      render(<NoContentComponent text={multilineText} />);

      expect(screen.getByText((_content, element) => element?.textContent === multilineText)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA label with default name", () => {
      render(<NoContentComponent />);

      const icon = screen.getByLabelText("No data");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-label", "No data");
    });

    it("has proper ARIA label with custom name", () => {
      render(<NoContentComponent name="search results" />);

      const icon = screen.getByLabelText("search results");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-label", "search results");
    });

    it("maintains accessibility when custom icon is provided", () => {
      const customIcon = (
        <div data-testid="accessible-icon" role="img" aria-label="Custom empty state">
          📭
        </div>
      );
      render(<NoContentComponent icon={customIcon} name="mailbox" />);

      expect(screen.getByTestId("accessible-icon")).toBeInTheDocument();
      // Custom icon should handle its own accessibility
      expect(screen.getByTestId("accessible-icon")).toHaveAttribute(
        "aria-label",
        "Custom empty state",
      );
    });

    it("has semantic HTML structure", () => {
      render(<NoContentComponent />);

      const container = screen.getByText("No data available").closest("div");
      expect(container).toBeInTheDocument();

      // Should have proper structure for screen readers
      const textElement = screen.getByText("No data available");
      expect(textElement.tagName).toBe("P");
    });
  });

  describe("Styling and Layout", () => {
    it("has proper CSS classes for styling", () => {
      render(<NoContentComponent />);

      const container = screen.getByText("No data available").closest("div");
      expect(container).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
      );

      const textElement = screen.getByText("No data available");
      expect(textElement).toHaveClass("text-gray-500");
    });

    it("centers content properly", () => {
      render(<NoContentComponent />);

      const container = screen.getByText("No data available").closest("div");
      expect(container).toHaveClass("items-center", "justify-center");
    });

    it("has proper spacing between icon and text", () => {
      render(<NoContentComponent />);

      const container = screen.getByText("No data available").closest("div");
      expect(container).toHaveClass("space-y-4");
    });

    it("handles responsive design", () => {
      render(<NoContentComponent />);

      const icon = screen.getByLabelText("No data");
      expect(icon).toHaveClass("w-16", "h-16");

      const textElement = screen.getByText("No data available");
      expect(textElement).toHaveClass("text-lg");
    });
  });

  describe("Component Props Interface", () => {
    it("accepts all expected props", () => {
      const props = {
        text: "Custom message",
        icon: <div data-testid="test-icon">🎯</div>,
        name: "test-state",
      };

      expect(() => render(<NoContentComponent {...props} />)).not.toThrow();

      expect(screen.getByText("Custom message")).toBeInTheDocument();
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("works with partial props", () => {
      expect(() =>
        render(<NoContentComponent text="Only text" />),
      ).not.toThrow();
      expect(() =>
        render(<NoContentComponent name="Only name" />),
      ).not.toThrow();
      expect(() =>
        render(<NoContentComponent icon={<span>Only icon</span>} />),
      ).not.toThrow();
    });

    it("handles undefined props gracefully", () => {
      expect(() =>
        render(
          <NoContentComponent
            text={undefined}
            icon={undefined}
            name={undefined}
          />,
        ),
      ).not.toThrow();

      // Should fall back to defaults
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  describe("Use Cases", () => {
    it("works as empty state for data tables", () => {
      render(<NoContentComponent text="No users found" name="user list" />);

      expect(screen.getByText("No users found")).toBeInTheDocument();
      expect(screen.getByLabelText("user list")).toBeInTheDocument();
    });

    it("works as search results empty state", () => {
      const searchIcon = <div data-testid="search-icon">🔍</div>;
      render(
        <NoContentComponent
          text="No results found for your search"
          icon={searchIcon}
          name="search results"
        />,
      );

      expect(
        screen.getByText("No results found for your search"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("works as error state", () => {
      const errorIcon = <div data-testid="error-icon">⚠️</div>;
      render(
        <NoContentComponent
          text="Failed to load data"
          icon={errorIcon}
          name="error state"
        />,
      );

      expect(screen.getByText("Failed to load data")).toBeInTheDocument();
      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });

    it("works with loading states", () => {
      const loadingIcon = <div data-testid="loading-icon">⏳</div>;
      render(
        <NoContentComponent
          text="Loading data..."
          icon={loadingIcon}
          name="loading state"
        />,
      );

      expect(screen.getByText("Loading data...")).toBeInTheDocument();
      expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles React fragment as icon", () => {
      const fragmentIcon = (
        <React.Fragment>
          <span data-testid="fragment-1">Part 1</span>
          <span data-testid="fragment-2">Part 2</span>
        </React.Fragment>
      );

      render(<NoContentComponent icon={fragmentIcon} />);

      expect(screen.getByTestId("fragment-1")).toBeInTheDocument();
      expect(screen.getByTestId("fragment-2")).toBeInTheDocument();
    });

    it("handles boolean false as text", () => {
      render(<NoContentComponent text={false as unknown as string} />);

      // Should not crash, might render nothing or fall back to default
      expect(screen.getByLabelText("No data")).toBeInTheDocument();
    });

    it("handles number as text", () => {
      render(<NoContentComponent text={0 as unknown as string} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
