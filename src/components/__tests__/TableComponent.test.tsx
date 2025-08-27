import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import TableComponent from "../TableComponent";

// Mock data for testing
interface TestUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
  tags: string[];
  website?: string;
}

const mockUsers: TestUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    tags: ["admin", "user"],
    website: "https://johndoe.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    active: false,
    tags: ["user", "customer", "premium", "vip", "gold", "platinum"],
  },
];

const defaultProps = {
  columns: ["ID", "Name", "Email", "Status", "Tags", "Website"],
  data: mockUsers,
  props: ["id", "name", "email", "active", "tags", "website"] as const,
};

describe("TableComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders table with data", () => {
      render(<TableComponent {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("renders column headers correctly", () => {
      render(<TableComponent {...defaultProps} />);

      defaultProps.columns.forEach((column) => {
        expect(screen.getByText(column)).toBeInTheDocument();
      });
    });

    it("shows loading skeleton when loading prop is true", () => {
      render(<TableComponent {...defaultProps} loading />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      // Should show skeleton instead
      expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("shows no content component when data is empty", () => {
      render(<TableComponent {...defaultProps} data={[]} />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("filters data based on search value", () => {
      render(<TableComponent {...defaultProps} searchValue="john" />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("shows no content when search yields no results", () => {
      render(<TableComponent {...defaultProps} searchValue="nonexistent" />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("searches across all columns", () => {
      render(<TableComponent {...defaultProps} searchValue="example.com" />);

      // Should find both users since both have example.com in email
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  describe("Sorting Functionality", () => {
    const sortableProps = {
      ...defaultProps,
      sortableProps: ["name", "email"] as (keyof TestUser)[],
      onSort: jest.fn(),
    };

    it("displays sort indicators for sortable columns", () => {
      render(<TableComponent {...sortableProps} />);

      const nameHeader = screen.getByText("Name").closest("th");
      const emailHeader = screen.getByText("Email").closest("th");

      expect(nameHeader).toHaveTextContent("⇅");
      expect(emailHeader).toHaveTextContent("⇅");
    });

    it("calls onSort when sortable column header is clicked", async () => {
      const user = userEvent.setup();
      render(<TableComponent {...sortableProps} />);

      const nameHeader = screen
        .getByText("Name")
        .closest("div[role='button']")!;
      await user.click(nameHeader);

      expect(sortableProps.onSort).toHaveBeenCalledWith("name");
    });

    it("handles keyboard interaction for sorting", async () => {
      const user = userEvent.setup();
      render(<TableComponent {...sortableProps} />);

      const nameHeader = screen
        .getByText("Name")
        .closest("div[role='button']")!;
      (nameHeader as HTMLElement).focus();
      await user.keyboard("{Enter}");

      expect(sortableProps.onSort).toHaveBeenCalledWith("name");
    });
  });

  describe("Action Dropdown", () => {
    const actionProps = {
      ...defaultProps,
      actions: true,
      actionTexts: ["Edit", "Delete"],
      actionFunctions: [jest.fn(), jest.fn()],
    };

    it("renders action dropdown when actions are enabled", () => {
      render(<TableComponent {...actionProps} />);

      const actionButtons = screen.getAllByLabelText("Actions");
      expect(actionButtons).toHaveLength(2); // One for each row
    });

    it("calls action function when action is clicked", async () => {
      const user = userEvent.setup();
      render(<TableComponent {...actionProps} />);

      const firstActionButton = screen.getAllByLabelText("Actions")[0];
      await user.click(firstActionButton);

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByText("Edit")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Edit"));

      expect(actionProps.actionFunctions[0]).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe("Row Click Functionality", () => {
    it("calls rowOnClick when row is clicked", async () => {
      const rowOnClick = jest.fn();
      const user = userEvent.setup();

      render(<TableComponent {...defaultProps} rowOnClick={rowOnClick} />);

      const firstRow = screen.getByText("John Doe").closest("tr")!;
      await user.click(firstRow);

      expect(rowOnClick).toHaveBeenCalledWith(mockUsers[0]);
    });

    it("prevents row click when cell content is clicked", async () => {
      const rowOnClick = jest.fn();
      const user = userEvent.setup();

      render(<TableComponent {...defaultProps} rowOnClick={rowOnClick} />);

      // Click on a cell that has stopPropagation
      const tagsCell = screen.getByText("admin");
      await user.click(tagsCell);

      expect(rowOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Data Formatting", () => {
    it("displays arrays as chips with 'more' indicator", () => {
      render(<TableComponent {...defaultProps} />);

      // Jane Smith has 6 tags, should show 5 + "more" indicator
      expect(screen.getByText("+1 more")).toBeInTheDocument();
    });

    it("formats URLs as clickable links", () => {
      render(<TableComponent {...defaultProps} />);

      const link = screen.getByRole("link", { name: /johndoe.com/i });
      expect(link).toHaveAttribute("href", "https://johndoe.com");
    });

    it("uses custom formatValue function when provided", () => {
      const formatValue = jest.fn((value, prop, item) => {
        if (prop === "active") {
          return item.active ? "✅ Active" : "❌ Inactive";
        }
        return value;
      });

      render(<TableComponent {...defaultProps} formatValue={formatValue} />);

      expect(screen.getByText("✅ Active")).toBeInTheDocument();
      expect(screen.getByText("❌ Inactive")).toBeInTheDocument();
    });

    it("formatValue takes precedence over internal date formatting", () => {
      const testData = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          joinDate: "2024-01-15T10:30:00Z", // This would normally be auto-formatted as date
          tags: ["react"],
          active: true,
          website: "https://johndoe.com",
        },
      ];

      const formatValue = jest.fn((value, prop, _item) => {
        if (prop === "joinDate") {
          return `Custom: ${value}`;
        }
        return undefined; // Return undefined to fall back to default formatting
      });

      render(
        <TableComponent
          {...defaultProps}
          data={testData}
          formatValue={formatValue}
        />
      );

      // Should show custom format instead of auto-formatted date
      expect(screen.getByText("Custom: 2024-01-15T10:30:00Z")).toBeInTheDocument();
      expect(formatValue).toHaveBeenCalledWith("2024-01-15T10:30:00Z", "joinDate", testData[0]);
    });

    it("formatValue can return null/undefined to fall back to default formatting", () => {
      const testData = [
        {
          id: 1,
          name: "John Doe", 
          email: "john@example.com",
          joinDate: "2024-01-15T10:30:00Z",
          tags: ["react"],
          active: true,
          website: "https://johndoe.com",
        },
      ];

      const formatValue = jest.fn((value, prop, _item) => {
        if (prop === "joinDate") {
          return null; // Fall back to default
        }
        return undefined;
      });

      render(
        <TableComponent
          {...defaultProps}
          data={testData}
          formatValue={formatValue}
        />
      );

      // Should fall back to default date formatting
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
      expect(formatValue).toHaveBeenCalledWith("2024-01-15T10:30:00Z", "joinDate", testData[0]);
    });

    it("formatValue takes precedence over URL link formatting", () => {
      const formatValue = jest.fn((value, prop, _item) => {
        if (prop === "website") {
          return `🌐 ${value}`;
        }
        return undefined;
      });

      render(<TableComponent {...defaultProps} formatValue={formatValue} />);

      // Should show custom format instead of link
      expect(screen.getByText("🌐 https://johndoe.com")).toBeInTheDocument();
      // Should not have link behavior 
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("uses custom formatHeader function when provided", () => {
      const formatHeader = jest.fn((header, _prop, index) => (
        <span data-testid={`header-${index}`}>🎯 {header}</span>
      ));

      render(<TableComponent {...defaultProps} formatHeader={formatHeader} />);

      expect(screen.getByText("🎯 ID")).toBeInTheDocument();
      expect(screen.getByText("🎯 Name")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    const paginationProps = {
      ...defaultProps,
      enablePagination: true,
      page: 1,
      setPage: jest.fn(),
      itemsPerPage: 1,
    };

    it("shows pagination controls when enabled", () => {
      render(<TableComponent {...paginationProps} />);

      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    it("shows only items for current page", () => {
      render(<TableComponent {...paginationProps} />);

      // Should only show first item (John Doe) since itemsPerPage is 1
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom class names", () => {
      const customClassNames = {
        table: "custom-table-class",
        thead: "custom-thead-class",
      };

      render(
        <TableComponent
          {...defaultProps}
          customClassNames={customClassNames}
        />,
      );

      const table = screen.getByRole("table");
      expect(table).toHaveClass("custom-table-class");
    });

    it("disables default styles when requested", () => {
      render(<TableComponent {...defaultProps} disableDefaultStyles />);

      const table = screen.getByRole("table");
      expect(table).not.toHaveClass("w-full");
    });
  });

  describe("Dark Mode", () => {
    it("respects system dark mode preference", () => {
      const mockMatchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: mockMatchMedia,
      });

      render(<TableComponent {...defaultProps} enableDarkMode />);

      expect(mockMatchMedia).toHaveBeenCalledWith(
        "(prefers-color-scheme: dark)",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper table structure", () => {
      render(<TableComponent {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(6);
      expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 data rows
    });

    it("has proper ARIA labels for interactive elements", () => {
      const sortableProps = {
        ...defaultProps,
        sortableProps: ["name"] as (keyof TestUser)[],
        onSort: jest.fn(),
      };

      render(<TableComponent {...sortableProps} />);

      const sortableHeader = screen
        .getByText("Name")
        .closest("div[role='button']");
      expect(sortableHeader).toHaveAttribute("tabIndex", "0");
    });
  });
});
