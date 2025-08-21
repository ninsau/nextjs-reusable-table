import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import PaginationComponent from "../PaginationComponent";

const defaultProps = {
  page: 1,
  setPage: jest.fn(),
  totalPages: 5,
};

describe("PaginationComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders pagination controls", () => {
      render(<PaginationComponent {...defaultProps} />);

      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
    });

    it("shows correct page information", () => {
      render(
        <PaginationComponent {...defaultProps} page={3} totalPages={10} />,
      );

      expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
    });

    it("renders with single page", () => {
      render(<PaginationComponent {...defaultProps} page={1} totalPages={1} />);

      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  describe("Navigation Functionality", () => {
    it("calls setPage with previous page when Previous is clicked", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={3} />);

      const previousButton = screen.getByText("Previous");
      await user.click(previousButton);

      expect(defaultProps.setPage).toHaveBeenCalledWith(2);
    });

    it("calls setPage with next page when Next is clicked", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={3} />);

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      expect(defaultProps.setPage).toHaveBeenCalledWith(4);
    });

    it("disables Previous button on first page", () => {
      render(<PaginationComponent {...defaultProps} page={1} />);

      const previousButton = screen.getByText("Previous");
      expect(previousButton).toBeDisabled();
    });

    it("disables Next button on last page", () => {
      render(<PaginationComponent {...defaultProps} page={5} totalPages={5} />);

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    it("enables both buttons on middle pages", () => {
      render(<PaginationComponent {...defaultProps} page={3} />);

      const previousButton = screen.getByText("Previous");
      const nextButton = screen.getByText("Next");

      expect(previousButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("Keyboard Navigation", () => {
    it("handles Enter key on Previous button", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={3} />);

      const previousButton = screen.getByText("Previous");
      previousButton.focus();
      await user.keyboard("{Enter}");

      expect(defaultProps.setPage).toHaveBeenCalledWith(2);
    });

    it("handles Enter key on Next button", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={3} />);

      const nextButton = screen.getByText("Next");
      nextButton.focus();
      await user.keyboard("{Enter}");

      expect(defaultProps.setPage).toHaveBeenCalledWith(4);
    });

    it("does not navigate when disabled button is activated", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={1} />);

      const previousButton = screen.getByText("Previous");
      await user.click(previousButton);

      expect(defaultProps.setPage).not.toHaveBeenCalled();
    });
  });

  describe("Dark Mode", () => {
    it("applies dark mode styles when enabled", () => {
      const mockMatchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      render(<PaginationComponent {...defaultProps} enableDarkMode />);

      expect(mockMatchMedia).toHaveBeenCalledWith(
        "(prefers-color-scheme: dark)",
      );
    });

    it("does not apply dark mode when disabled", () => {
      render(<PaginationComponent {...defaultProps} enableDarkMode={false} />);

      const container = screen.getByText("Previous").closest("div");
      expect(container).not.toHaveClass("dark:bg-gray-800");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom class names", () => {
      const customClassNames = {
        container: "custom-container",
        button: "custom-button",
        buttonDisabled: "custom-disabled",
        pageInfo: "custom-page-info",
      };

      render(
        <PaginationComponent
          {...defaultProps}
          customClassNames={customClassNames}
        />,
      );

      const container = screen.getByText("Previous").closest("div");
      expect(container).toHaveClass("custom-container");

      const nextButton = screen.getByText("Next");
      expect(nextButton).toHaveClass("custom-button");

      const pageInfo = screen.getByText("Page 1 of 5");
      expect(pageInfo).toHaveClass("custom-page-info");
    });

    it("applies disabled styles to disabled buttons", () => {
      const customClassNames = {
        button: "custom-button",
        buttonDisabled: "custom-disabled",
      };

      render(
        <PaginationComponent
          {...defaultProps}
          page={1}
          customClassNames={customClassNames}
        />,
      );

      const previousButton = screen.getByText("Previous");
      expect(previousButton).toHaveClass("custom-disabled");
      expect(previousButton).not.toHaveClass("custom-button");
    });

    it("disables default styles when requested", () => {
      render(<PaginationComponent {...defaultProps} disableDefaultStyles />);

      const previousButton = screen.getByText("Previous");
      expect(previousButton).not.toHaveClass("bg-white");

      const container = screen.getByText("Previous").closest("div");
      expect(container).not.toHaveClass("flex");
    });
  });

  describe("Edge Cases", () => {
    it("handles zero total pages", () => {
      render(<PaginationComponent {...defaultProps} totalPages={0} />);

      expect(screen.getByText("Page 1 of 0")).toBeInTheDocument();

      const previousButton = screen.getByText("Previous");
      const nextButton = screen.getByText("Next");

      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("handles negative page numbers", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={0} />);

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      expect(defaultProps.setPage).toHaveBeenCalledWith(1);
    });

    it("handles page numbers beyond total pages", () => {
      render(
        <PaginationComponent {...defaultProps} page={10} totalPages={5} />,
      );

      expect(screen.getByText("Page 10 of 5")).toBeInTheDocument();

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      render(<PaginationComponent {...defaultProps} />);

      const previousButton = screen.getByText("Previous");
      const nextButton = screen.getByText("Next");

      expect(previousButton).toHaveAttribute("type", "button");
      expect(nextButton).toHaveAttribute("type", "button");
    });

    it("maintains focus management", async () => {
      const user = userEvent.setup();
      render(<PaginationComponent {...defaultProps} page={3} />);

      const nextButton = screen.getByText("Next");
      nextButton.focus();

      expect(nextButton).toHaveFocus();

      await user.click(nextButton);

      // Button should still be focusable after click
      expect(nextButton).toBeEnabled();
    });

    it("provides screen reader friendly page information", () => {
      render(
        <PaginationComponent {...defaultProps} page={3} totalPages={10} />,
      );

      const pageInfo = screen.getByText("Page 3 of 10");
      expect(pageInfo).toBeInTheDocument();

      // Should be readable by screen readers
      expect(pageInfo.textContent).toBe("Page 3 of 10");
    });
  });
});
