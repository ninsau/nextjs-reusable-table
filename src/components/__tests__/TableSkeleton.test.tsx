import { render, screen } from "@testing-library/react";
import React from "react";
import TableSkeleton from "../TableSkeleton";

describe("TableSkeleton", () => {
  describe("Basic Rendering", () => {
    it("renders skeleton table structure", () => {
      render(<TableSkeleton />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Should have skeleton rows
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // Header + data rows
    });

    it("renders skeleton headers", () => {
      render(<TableSkeleton />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(4); // Default number of skeleton columns
    });

    it("renders skeleton data rows", () => {
      render(<TableSkeleton />);

      // Should have multiple skeleton rows (header is not counted in tbody rows)
      const tbody = document.querySelector("tbody");
      const dataRows = tbody?.querySelectorAll("tr");
      expect(dataRows?.length).toBeGreaterThan(3); // Should have several skeleton rows
    });

    it("contains animate-pulse class for skeleton effect", () => {
      render(<TableSkeleton />);

      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  describe("Dark Mode", () => {
    it("applies dark mode styles when system prefers dark", () => {
      const mockMatchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      render(<TableSkeleton enableDarkMode />);

      expect(mockMatchMedia).toHaveBeenCalledWith(
        "(prefers-color-scheme: dark)",
      );
    });

    it("does not apply dark mode when disabled", () => {
      render(<TableSkeleton enableDarkMode={false} />);

      const table = screen.getByRole("table");
      expect(table).not.toHaveClass("dark:bg-gray-800");
    });

    it("toggles dark mode based on system preference changes", () => {
      const addEventListener = jest.fn();
      const removeEventListener = jest.fn();

      const mockMatchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener,
        removeEventListener,
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      const { unmount } = render(<TableSkeleton enableDarkMode />);

      expect(addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );

      unmount();
      expect(removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies custom class names", () => {
      const customClassNames = {
        container: "custom-container",
        table: "custom-table",
        th: "custom-header",
        td: "custom-cell",
      };

      render(<TableSkeleton customClassNames={customClassNames} />);

      const container = document.querySelector(".custom-container");
      expect(container).toBeInTheDocument();

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table");

      const headers = screen.getAllByRole("columnheader");
      headers.forEach((header) => {
        expect(header).toHaveClass("custom-header");
      });
    });

    it("disables default styles when requested", () => {
      render(<TableSkeleton disableDefaultStyles />);

      const table = screen.getByRole("table");
      expect(table).not.toHaveClass("w-full");
    });

    it("combines custom classes with default styles", () => {
      const customClassNames = {
        table: "custom-table",
      };

      render(<TableSkeleton customClassNames={customClassNames} />);

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table");
      expect(table).toHaveClass("w-full"); // Should still have default class
    });

    it("replaces default styles when disableDefaultStyles is true", () => {
      const customClassNames = {
        table: "custom-table-only",
        container: "custom-container-only",
      };

      render(
        <TableSkeleton
          disableDefaultStyles
          customClassNames={customClassNames}
        />,
      );

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table-only");
      expect(table).not.toHaveClass("w-full");

      const container = document.querySelector(".custom-container-only");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Skeleton Animation", () => {
    it("has proper skeleton styling for headers", () => {
      render(<TableSkeleton />);

      const headers = screen.getAllByRole("columnheader");
      headers.forEach((header) => {
        const skeletonDiv = header.querySelector("div");
        expect(skeletonDiv).toHaveClass("animate-pulse");
      });
    });

    it("has proper skeleton styling for data cells", () => {
      render(<TableSkeleton />);

      const dataCells = document.querySelectorAll("tbody td");
      dataCells.forEach((cell) => {
        const skeletonDiv = cell.querySelector("div");
        expect(skeletonDiv).toHaveClass("animate-pulse");
      });
    });

    it("uses different heights for skeleton elements", () => {
      render(<TableSkeleton />);

      // Headers and cells should have skeleton divs with specific heights
      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(10); // Should have many skeleton elements

      skeletonElements.forEach((element) => {
        expect(element).toHaveClass("bg-gray-300");
      });
    });
  });

  describe("Accessibility", () => {
    it("maintains proper table structure", () => {
      render(<TableSkeleton />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(4);
      expect(screen.getAllByRole("row").length).toBeGreaterThan(4);
    });

    it("provides meaningful content for screen readers", () => {
      render(<TableSkeleton />);

      // While skeleton is primarily visual, structure should be screen-reader friendly
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Should have proper thead and tbody structure
      expect(document.querySelector("thead")).toBeInTheDocument();
      expect(document.querySelector("tbody")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("renders correctly on different screen sizes", () => {
      render(<TableSkeleton />);

      const table = screen.getByRole("table");
      expect(table).toHaveClass("w-full");

      // Should have responsive padding classes
      const cells = document.querySelectorAll("td, th");
      cells.forEach((cell) => {
        expect(cell.className).toMatch(/px-|py-/); // Should have padding classes
      });
    });
  });

  describe("Performance", () => {
    it("renders quickly without heavy computations", () => {
      const startTime = performance.now();

      render(<TableSkeleton />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Skeleton should render very quickly (under 50ms is reasonable)
      expect(renderTime).toBeLessThan(50);
    });

    it("does not cause memory leaks with event listeners", () => {
      const addEventListener = jest.fn();
      const removeEventListener = jest.fn();

      const mockMatchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener,
        removeEventListener,
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      const { unmount } = render(<TableSkeleton enableDarkMode />);

      // Should clean up event listeners on unmount
      unmount();
      expect(removeEventListener).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined customClassNames gracefully", () => {
      expect(() =>
        render(<TableSkeleton customClassNames={undefined} />),
      ).not.toThrow();
    });

    it("handles empty customClassNames object", () => {
      expect(() =>
        render(<TableSkeleton customClassNames={{}} />),
      ).not.toThrow();
    });

    it("works without any props", () => {
      expect(() => render(<TableSkeleton />)).not.toThrow();

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });
});
