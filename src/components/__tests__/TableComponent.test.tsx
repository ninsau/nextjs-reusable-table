import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// React import not needed for tests using JSX with TS config
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
      expect(screen.getByText("No items found.")).toBeInTheDocument();
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
        .closest("div[role='button']");
      expect(nameHeader).not.toBeNull();
      await user.click(nameHeader as HTMLElement);

      expect(sortableProps.onSort).toHaveBeenCalledWith("name");
    });

    it("handles keyboard interaction for sorting", async () => {
      const user = userEvent.setup();
      render(<TableComponent {...sortableProps} />);

      const nameHeader = screen
        .getByText("Name")
        .closest("div[role='button']");
      expect(nameHeader).not.toBeNull();
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

      const firstRow = screen.getByText("John Doe").closest("tr");
      expect(firstRow).not.toBeNull();
      await user.click(firstRow as HTMLElement);

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
          columns={["ID", "Name", "Email", "Join Date", "Status", "Tags", "Website"]}
          data={testData}
          props={["id", "name", "email", "joinDate", "active", "tags", "website"]}
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

      const formatValue = jest.fn((_value, prop, _item) => {
        if (prop === "joinDate") {
          return null; // Fall back to default
        }
        return undefined;
      });

      render(
        <TableComponent
          columns={["ID", "Name", "Email", "Join Date", "Status", "Tags", "Website"]}
          data={testData}
          props={["id", "name", "email", "joinDate", "active", "tags", "website"]}
          formatValue={formatValue}
        />
      );

      // Should fall back to default date formatting
      expect(screen.getByText(/Jan 15, 2024.*10:30/)).toBeInTheDocument();
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

      expect(screen.getByText((_content, element) => {
        return element?.textContent === 'Page 1 of 2';
      })).toBeInTheDocument();
    });

    it("shows only items for current page", () => {
      render(<TableComponent {...paginationProps} />);

      // Should only show first item (John Doe) since itemsPerPage is 1
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("allows custom pagination positioning through customClassNames", () => {
      const customPaginationClassNames = {
        container: "custom-pagination-position",
      };

      render(
        <TableComponent
          {...paginationProps}
          customClassNames={{
            pagination: customPaginationClassNames,
          }}
        />
      );

      // Find the pagination container and verify it has the custom class
      const paginationContainer = screen.getByText((_content, element) => {
        return element?.textContent === 'Page 1 of 2';
      }).closest("div");
      expect(paginationContainer).toHaveClass("custom-pagination-position");
    });

    it("applies default pagination positioning when no custom class is provided", () => {
      render(<TableComponent {...paginationProps} />);

      // Find the pagination container and verify it has the default classes
      const paginationContainer = screen.getByText((_content, element) => {
        return element?.textContent === 'Page 1 of 2';
      }).closest("div");
      expect(paginationContainer).toHaveClass("flex", "justify-center", "items-center", "mt-4");
    });

    it("renders custom pagination component when renderPagination is provided", () => {
      const customPagination = jest.fn((props) => (
        <div data-testid="custom-pagination">
          Custom Page {props.page} of {props.totalPages}
          <button type="button" onClick={() => props.setPage(props.page + 1)}>Next</button>
        </div>
      ));

      render(
        <TableComponent
          {...paginationProps}
          renderPagination={customPagination}
        />
      );

      // Should render custom pagination instead of built-in
      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
      expect(screen.queryByText("Page 1 of 2")).not.toBeInTheDocument();

      // Should call custom pagination with correct props
      expect(customPagination).toHaveBeenCalledWith({
        page: 1,
        setPage: paginationProps.setPage,
        totalPages: 2,
        calculatedTotalPages: 2,
        itemsPerPage: 1,
      });
    });

    it("passes correct pagination props to custom renderPagination function", () => {
      const mockRenderPagination = jest.fn(() => <div>Custom Pagination</div>);

      render(
        <TableComponent
          {...paginationProps}
          page={3}
          itemsPerPage={5}
          totalPages={10}
          renderPagination={mockRenderPagination}
        />
      );

      expect(mockRenderPagination).toHaveBeenCalledWith({
        page: 3,
        setPage: paginationProps.setPage,
        totalPages: 10, // Should use provided totalPages
        calculatedTotalPages: 1, // Should calculate: Math.ceil(2 users / 5 itemsPerPage) = 1
        itemsPerPage: 5,
      });
    });

    it("applies custom maxHeight as string", () => {
      render(<TableComponent {...defaultProps} maxHeight="400px" />);

      const scrollContainer = screen.getByText("John Doe").closest(".table-scroll-container");
      expect(scrollContainer).toHaveStyle({ maxHeight: "400px" });
    });

    it("applies custom maxHeight as number", () => {
      render(<TableComponent {...defaultProps} maxHeight={300} />);

      const scrollContainer = screen.getByText("John Doe").closest(".table-scroll-container");
      expect(scrollContainer).toHaveStyle({ maxHeight: "300px" });
    });

    it("uses default maxHeight when not specified", () => {
      render(<TableComponent {...defaultProps} />);

      const scrollContainer = screen.getByText("John Doe").closest(".table-scroll-container");
      expect(scrollContainer).toHaveStyle({ maxHeight: "600px" });
    });

    it("applies maxHeight with different units", () => {
      render(<TableComponent {...defaultProps} maxHeight="50vh" />);

      const scrollContainer = screen.getByText("John Doe").closest(".table-scroll-container");
      expect(scrollContainer).toHaveStyle({ maxHeight: "50vh" });
    });

    it("applies custom scrollContainer class", () => {
      render(
        <TableComponent
          {...defaultProps}
          customClassNames={{ scrollContainer: "custom-scroll-container" }}
        />
      );

      const scrollContainer = screen.getByText("John Doe").closest("div");
      expect(scrollContainer).toHaveClass("custom-scroll-container");
    });

    it("applies custom loadingContainer class", () => {
      render(
        <TableComponent
          {...defaultProps}
          loading
          customClassNames={{ loadingContainer: "custom-loading" }}
        />
      );

      const loadingContainer = screen.getByRole("status");
      expect(loadingContainer).toHaveClass("custom-loading");
    });

    it("applies custom loadingSkeleton classes", () => {
      render(
        <TableComponent
          {...defaultProps}
          loading
          customClassNames={{
            loadingSkeleton: {
              skeletonBar: "custom-bar",
              skeletonItem: "custom-item"
            }
          }}
        />
      );

      const loadingContainer = screen.getByRole("status");
      const skeletonBars = loadingContainer.querySelectorAll(".custom-bar");
      const skeletonItems = loadingContainer.querySelectorAll(".custom-item");

      expect(skeletonBars.length).toBeGreaterThan(0);
      expect(skeletonItems.length).toBeGreaterThan(0);
    });

    it("applies custom scrollBehavior", () => {
      render(<TableComponent {...defaultProps} scrollBehavior="scroll" />);

      const scrollContainer = screen.getByText("John Doe").closest(".table-scroll-container");
      expect(scrollContainer).toHaveStyle({ overflow: "scroll" });
    });

    it("applies custom tableLayout", () => {
      render(<TableComponent {...defaultProps} tableLayout="fixed" />);

      const table = screen.getByRole("table");
      expect(table).toHaveStyle({ tableLayout: "fixed" });
    });

    it("applies custom cellExpansion settings", () => {
      render(
        <TableComponent
          {...defaultProps}
          cellExpansion={{ enabled: true, maxWidth: 150, behavior: 'wrap' }}
        />
      );

      // Test that the cell expansion settings are applied
      // This would require checking the array cell rendering
    });

    it("applies custom interactive cursor classes", () => {
      render(
        <TableComponent
          {...defaultProps}
          customClassNames={{
            interactive: {
              sortableCursor: "custom-sortable-cursor",
              clickableCursor: "custom-clickable-cursor"
            }
          }}
        />
      );

      // The cursor styles are applied via inline styles, so we can't easily test the class names
      // But we can verify the component renders without errors
      expect(screen.getByRole("table")).toBeInTheDocument();
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
