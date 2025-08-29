# 📋 Comprehensive Examples

This document provides extensive examples for all features and use cases of the nextjs-reusable-table component.

## Table of Contents
- [Basic Examples](#basic-examples)
- [Data Formatting](#data-formatting)
- [Interactive Features](#interactive-features)
- [Styling and Theming](#styling-and-theming)
- [Advanced Use Cases](#advanced-use-cases)
- [Real-World Scenarios](#real-world-scenarios)

## Basic Examples

### Simple Data Table

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Chair", price: 299, category: "Furniture" },
  { id: 3, name: "Book", price: 19, category: "Education" },
];

export default function SimpleProductTable() {
  return (
    <TableComponent<Product>
      columns={["ID", "Product Name", "Price", "Category"]}
      data={products}
      props={["id", "name", "price", "category"]}
    />
  );
}
```

### Empty State Handling

```tsx
export default function EmptyStateTable() {
  const emptyData: Product[] = [];

  return (
    <TableComponent<Product>
      columns={["ID", "Product Name", "Price", "Category"]}
      data={emptyData}
      props={["id", "name", "price", "category"]}
      noContentProps={{
        text: "No products found. Add some products to get started!",
        icon: <span className="text-6xl">📦</span>,
      }}
    />
  );
}
```

### Loading State

```tsx
export default function LoadingTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(products);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <TableComponent<Product>
      columns={["ID", "Product Name", "Price", "Category"]}
      data={data}
      props={["id", "name", "price", "category"]}
      loading={isLoading}
    />
  );
}
```

## Data Formatting

### Automatic Data Type Handling

```tsx
interface Employee {
  id: number;
  name: string;
  email: string;
  joinDate: string; // ISO date string
  skills: string[]; // Array
  website: string; // URL
  salary: number;
  active: boolean;
}

const employees: Employee[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    joinDate: "2023-03-15T08:30:00Z",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    website: "https://sarahchen.dev",
    salary: 85000,
    active: true,
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.j@company.com", 
    joinDate: "2022-11-20T09:00:00Z",
    skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes", "Machine Learning"],
    website: "https://mikejohnson.io",
    salary: 92000,
    active: false,
  },
];

export default function AutoFormattedTable() {
  return (
    <TableComponent<Employee>
      columns={["ID", "Name", "Email", "Join Date", "Skills", "Website", "Salary", "Status"]}
      data={employees}
      props={["id", "name", "email", "joinDate", "skills", "website", "salary", "active"]}
    />
  );
}
// This will automatically:
// - Format joinDate as readable date
// - Display skills as chips with "show more" for long arrays
// - Render website as clickable link
// - Show active status as boolean value
```

### Custom Data Formatting

```tsx
export default function CustomFormattedTable() {
  const formatValue = (value: string, prop: string, item: Employee) => {
    switch (prop) {
      case "salary":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(value));
      
      case "active":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.active 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {item.active ? "Active" : "Inactive"}
          </span>
        );
      
      case "name":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {item.name.charAt(0)}
            </div>
            <span className="font-medium">{value}</span>
          </div>
        );
      
      default:
        return value;
    }
  };

  return (
    <TableComponent<Employee>
      columns={["ID", "Name", "Email", "Join Date", "Skills", "Website", "Salary", "Status"]}
      data={employees}
      props={["id", "name", "email", "joinDate", "skills", "website", "salary", "active"]}
      formatValue={formatValue}
    />
  );
}
```

### Custom Header Formatting

```tsx
export default function CustomHeaderTable() {
  const formatHeader = (header: string, prop: string, index: number) => {
    const icons: Record<string, string> = {
      id: "🆔",
      name: "👤", 
      email: "📧",
      salary: "💰",
      active: "⚡",
    };

    return (
      <div className="flex items-center space-x-2">
        <span>{icons[prop] || "📋"}</span>
        <span className="font-bold uppercase tracking-wider text-xs">
          {header}
        </span>
      </div>
    );
  };

  return (
    <TableComponent<Employee>
      columns={["ID", "Name", "Email", "Salary", "Status"]}
      data={employees}
      props={["id", "name", "email", "salary", "active"]}
      formatHeader={formatHeader}
    />
  );
}
```

## Interactive Features

### Row Actions

```tsx
export default function ActionTable() {
  const editEmployee = (employee: Employee) => {
    console.log("Edit employee:", employee);
    // Open edit modal, navigate to edit page, etc.
  };

  const deleteEmployee = (employee: Employee) => {
    if (window.confirm(\`Delete \${employee.name}?\`)) {
      console.log("Delete employee:", employee);
      // Call delete API, update state, etc.
    }
  };

  const viewDetails = (employee: Employee) => {
    console.log("View employee details:", employee);
    // Navigate to details page, open modal, etc.
  };

  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Join Date", "Status"]}
      data={employees}
      props={["name", "email", "joinDate", "active"]}
      actions={true}
      actionTexts={["View", "Edit", "Delete"]}
      actionFunctions={[viewDetails, editEmployee, deleteEmployee]}
    />
  );
}
```

### Row Click Handling

```tsx
export default function ClickableRowsTable() {
  const handleRowClick = (employee: Employee) => {
    console.log("Row clicked:", employee);
    // Navigate to detail page
    router.push(\`/employees/\${employee.id}\`);
  };

  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Join Date", "Status"]}
      data={employees}
      props={["name", "email", "joinDate", "active"]}
      rowOnClick={handleRowClick}
      // Add visual indicator for clickable rows
      customClassNames={{
        tr: "cursor-pointer hover:bg-gray-50 transition-colors",
      }}
    />
  );
}
```

### Sorting

```tsx
export default function SortableTable() {
  const [sortConfig, setSortConfig] = useState<{
    prop: keyof Employee;
    order: "asc" | "desc";
  } | null>(null);

  const handleSort = (prop: keyof Employee) => {
    let order: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.prop === prop) {
      order = sortConfig.order === "asc" ? "desc" : "asc";
    }
    setSortConfig({ prop, order });
  };

  const sortedEmployees = useMemo(() => {
    if (!sortConfig) return employees;

    return [...employees].sort((a, b) => {
      const aValue = a[sortConfig.prop];
      const bValue = b[sortConfig.prop];

      if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });
  }, [employees, sortConfig]);

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        {sortConfig && (
          <span>
            Sorted by {sortConfig.prop} ({sortConfig.order})
          </span>
        )}
      </div>
      
      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Salary"]}
        data={sortedEmployees}
        props={["name", "email", "joinDate", "salary"]}
        sortableProps={["name", "email", "joinDate", "salary"]}
        onSort={handleSort}
      />
    </div>
  );
}
```

### Search and Filtering

```tsx
export default function SearchFilterTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Apply search filter
      const matchesSearch = [
        employee.name,
        employee.email,
        employee.skills.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && employee.active) ||
        (statusFilter === "inactive" && !employee.active);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Employees</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Skills", "Status"]}
        data={filteredEmployees}
        props={["name", "email", "joinDate", "skills", "active"]}
        searchValue={searchTerm} // This enables built-in search highlighting
      />
    </div>
  );
}
```

### Pagination

```tsx
export default function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total: {employees.length} employees
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="per-page" className="text-sm text-gray-600">
            Items per page:
          </label>
          <select
            id="per-page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="p-1 border border-gray-300 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Status"]}
        data={employees}
        props={["name", "email", "joinDate", "active"]}
        enablePagination
        page={currentPage}
        setPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
```

### Custom Pagination Positioning

```tsx
export default function CustomPaginationPositionTable() {
  const [currentPage, setCurrentPage] = useState(1);

  // Example 1: Position pagination at the top
  const topPaginationStyles = {
    pagination: {
      container: "justify-start mt-0 mb-4 pt-4 border-b border-gray-200",
    },
  };

  // Example 2: Position pagination on the right side
  const rightPaginationStyles = {
    pagination: {
      container: "justify-end mt-4",
    },
  };

  // Example 3: Position pagination in the center with custom styling
  const centerCustomStyles = {
    pagination: {
      container: "justify-center mt-6 bg-gray-50 py-3 rounded-lg border",
      button: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 mx-1 rounded-md font-medium",
      buttonDisabled: "bg-gray-300 text-gray-500 px-3 py-2 mx-1 rounded-md font-medium",
      pageInfo: "text-gray-700 font-semibold",
    },
  };

  // Example 4: Fixed pagination at bottom (custom implementation)
  const fixedBottomStyles = {
    pagination: {
      container: "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-50",
    },
  };

  // Example 5: Inline pagination within a card
  const inlineCardStyles = {
    container: "bg-white rounded-lg shadow-md overflow-hidden",
    table: "w-full",
    pagination: {
      container: "bg-gray-50 px-6 py-3 border-t flex justify-between items-center",
    },
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Custom Pagination Positioning</h2>

      {/* Top Positioned Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Positioned Pagination</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={5}
          customClassNames={topPaginationStyles}
        />
      </div>

      {/* Right Positioned Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Right Positioned Pagination</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={5}
          customClassNames={rightPaginationStyles}
        />
      </div>

      {/* Center with Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Center with Custom Styling</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={5}
          customClassNames={centerCustomStyles}
        />
      </div>

      {/* Inline Card Style */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Inline Card Style</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={5}
          customClassNames={inlineCardStyles}
        />
      </div>

      {/* Fixed Bottom (would need additional wrapper) */}
      <div className="relative pb-20">
        <h3 className="text-lg font-semibold mb-4">Table with Fixed Bottom Pagination</h3>
        <p className="text-sm text-gray-600 mb-4">
          Note: For fixed positioning, you'll need to add padding/margin to prevent overlap.
        </p>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={5}
        />

        {/* Fixed pagination would be positioned outside the table container */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-50">
          <div className="max-w-7xl mx-auto flex justify-center">
            <TableComponent<Employee>
              columns={[]}
              data={[]}
              props={[]}
              enablePagination
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={Math.ceil(employees.length / 5)}
              customClassNames={{
                pagination: {
                  container: "mt-0",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Custom Pagination Implementation

```tsx
export default function CustomPaginationTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Example 1: Simple custom pagination with different styling
  const simpleCustomPagination = (props) => (
    <div className="bg-blue-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => props.setPage(props.page - 1)}
          disabled={props.page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          ← Previous
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Page</span>
          <select
            value={props.page}
            onChange={(e) => props.setPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: props.totalPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">of {props.totalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => props.setPage(props.page + 1)}
          disabled={props.page >= props.totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );

  // Example 2: Advanced pagination with page size selector
  const advancedCustomPagination = (props) => (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-4 bg-gray-50 rounded">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Show</span>
        <select
          value={props.itemsPerPage}
          onChange={(e) => {
            const newItemsPerPage = Number(e.target.value);
            // Reset to page 1 when changing page size
            props.setPage(1);
            // You would need to handle itemsPerPage change in parent component
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-600">entries</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => props.setPage(1)}
          disabled={props.page === 1}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          First
        </button>

        <button
          type="button"
          onClick={() => props.setPage(props.page - 1)}
          disabled={props.page === 1}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, props.totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(props.totalPages - 4, props.page - 2)) + i;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => props.setPage(pageNum)}
                className={`px-3 py-1 text-sm rounded ${
                  pageNum === props.page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => props.setPage(props.page + 1)}
          disabled={props.page >= props.totalPages}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => props.setPage(props.totalPages)}
          disabled={props.page >= props.totalPages}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Last
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Showing {((props.page - 1) * props.itemsPerPage) + 1} to{' '}
        {Math.min(props.page * props.itemsPerPage, props.calculatedTotalPages * props.itemsPerPage)}{' '}
        of {props.calculatedTotalPages * props.itemsPerPage} entries
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Custom Pagination Implementation</h2>

      {/* Simple Custom Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Simple Custom Pagination</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          renderPagination={simpleCustomPagination}
        />
      </div>

      {/* Advanced Custom Pagination */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Advanced Custom Pagination</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          enablePagination
          page={currentPage}
          setPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          renderPagination={advancedCustomPagination}
        />
      </div>
    </div>
  );
}
```

## Styling and Theming

### Dark Mode

```tsx
export default function DarkModeTable() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Dark Mode Table</h1>
      
      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Status"]}
        data={employees}
        props={["name", "email", "joinDate", "active"]}
        enableDarkMode={true}
      />
    </div>
  );
}
```

### Custom Styling

```tsx
export default function CustomStyledTable() {
  const customStyles = {
    container: "rounded-xl shadow-2xl overflow-hidden",
    table: "w-full bg-gradient-to-r from-purple-50 to-blue-50",
    thead: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
    tbody: "divide-y divide-purple-200",
    th: "px-6 py-4 text-left text-sm font-bold uppercase tracking-wider",
    tr: "hover:bg-purple-50 transition-all duration-200 ease-in-out",
    td: "px-6 py-4 text-sm text-gray-900",
    pagination: {
      container: "bg-white px-6 py-4 border-t border-purple-200",
      button: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors",
      buttonDisabled: "bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed",
      pageInfo: "text-purple-700 font-medium",
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
        Custom Styled Table
      </h1>
      
      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Status"]}
        data={employees}
        props={["name", "email", "joinDate", "active"]}
        customClassNames={customStyles}
        enablePagination
        page={1}
        setPage={() => {}}
        itemsPerPage={5}
      />
    </div>
  );
}
```

### Minimal Clean Design

```tsx
export default function MinimalTable() {
  const minimalStyles = {
    table: "w-full border-collapse",
    thead: "",
    tbody: "",
    th: "border-b-2 border-gray-200 pb-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide",
    tr: "border-b border-gray-100",
    td: "py-4 text-sm text-gray-800",
  };

  return (
    <div className="p-6 bg-white">
      <TableComponent<Employee>
        columns={["Name", "Email", "Status"]}
        data={employees}
        props={["name", "email", "active"]}
        customClassNames={minimalStyles}
        disableDefaultStyles={false}
      />
    </div>
  );
}
```

### Custom Table Height

```tsx
export default function CustomHeightTable() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Custom Table Height Examples</h2>

      {/* Fixed height in pixels */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fixed Height (400px)</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Join Date", "Status"]}
          data={employees}
          props={["name", "email", "joinDate", "active"]}
          maxHeight="400px"
        />
      </div>

      {/* Height as number (automatically converts to px) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Height as Number (500px)</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Join Date", "Status"]}
          data={employees}
          props={["name", "email", "joinDate", "active"]}
          maxHeight={500}
        />
      </div>

      {/* Viewport height */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Viewport Height (70vh)</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Join Date", "Status"]}
          data={employees}
          props={["name", "email", "joinDate", "active"]}
          maxHeight="70vh"
        />
      </div>

      {/* No max height (unlimited) */}
      <div>
        <h3 className="text-lg font-semibold mb-4">No Height Limit</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Join Date", "Status"]}
          data={employees}
          props={["name", "email", "joinDate", "active"]}
          maxHeight="none"
        />
      </div>

      {/* Small height for compact display */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Display (200px)</h3>
        <TableComponent<Employee>
          columns={["Name", "Email", "Status"]}
          data={employees}
          props={["name", "email", "active"]}
          maxHeight="200px"
        />
      </div>
    </div>
  );
}
```

## True Headless Customization

The library now provides truly headless customization options, allowing you to customize virtually every aspect of the table while maintaining backward compatibility.

### Complete Styling Control

```tsx
export default function TrulyHeadlessTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Status"]}
      data={employees}
      props={["name", "email", "active"]}
      // Complete customization with no defaults
      disableDefaultStyles={true}
      customClassNames={{
        // Core elements
        scrollContainer: "my-scroll-container",
        table: "my-table",
        thead: "my-thead",
        tbody: "my-tbody",
        th: "my-th",
        tr: "my-tr",
        td: "my-td",

        // Loading states
        loadingContainer: "my-loading",
        loadingSkeleton: {
          container: "my-skeleton-container",
          skeletonBar: "my-skeleton-bar",
          skeletonItem: "my-skeleton-item"
        },

        // Cell expansion
        cellExpansion: {
          container: "my-cell-expansion"
        },

        // Interactive states
        interactive: {
          sortableCursor: "my-sortable-cursor",
          clickableCursor: "my-clickable-cursor",
          focusOutline: "my-focus-outline"
        },

        // Action dropdown
        actionButton: "my-action-btn",
        actionSvg: "my-action-svg",
        actionDropdown: {
          container: "my-dropdown-container",
          menu: "my-dropdown-menu",
          item: "my-dropdown-item",
          overlay: "my-dropdown-overlay"
        },

        // Enhanced pagination
        pagination: {
          container: "my-pagination",
          button: "my-pagination-btn",
          buttonDisabled: "my-pagination-btn-disabled",
          pageInfo: "my-pagination-info",
          navigation: {
            first: "my-first-btn",
            previous: "my-prev-btn",
            next: "my-next-btn",
            last: "my-last-btn"
          }
        },

        // Layout customization
        layout: {
          tableMargin: "my-table-margin",
          tablePadding: "my-table-padding",
          containerPadding: "my-container-padding"
        },

        // Responsive design
        responsive: {
          mobile: "my-mobile-styles",
          tablet: "my-tablet-styles",
          desktop: "my-desktop-styles"
        },

        // Theme customization
        theme: {
          colorScheme: "my-color-scheme",
          spacing: "my-spacing",
          typography: "my-typography",
          borderRadius: "my-border-radius",
          shadows: "my-shadows"
        }
      }}

      // Advanced props
      maxHeight="70vh"
      scrollBehavior="auto"
      tableLayout="fixed"
      cellExpansion={{
        enabled: true,
        maxWidth: 300,
        behavior: 'wrap'
      }}
      accessibility={{
        focusStyles: "focus:ring-2 focus:ring-blue-500 focus:outline-none",
        screenReaderLabels: {
          actions: "Table actions",
          pagination: "Table pagination",
          loading: "Loading table data"
        },
        keyboardNavigation: true
      }}

      // Inline style overrides
      customStyles={{
        container: { backgroundColor: '#f8f9fa' },
        table: { borderCollapse: 'separate', borderSpacing: '0 8px' },
        scrollContainer: { borderRadius: '8px' },
        loading: { backgroundColor: '#e9ecef' }
      }}
    />
  );
}
```

### Custom Scroll Container

```tsx
export default function CustomScrollTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Status"]}
      data={employees}
      props={["name", "email", "active"]}
      maxHeight="400px"
      scrollBehavior="scroll" // Options: 'auto', 'scroll', 'visible', 'hidden'
      customClassNames={{
        scrollContainer: "custom-scroll-area scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      }}
      customStyles={{
        scrollContainer: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af #e5e7eb'
        }
      }}
    />
  );
}
```

### Advanced Cell Expansion

```tsx
export default function AdvancedCellExpansionTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Skills", "Projects"]}
      data={employees}
      props={["name", "skills", "projects"]}
      cellExpansion={{
        enabled: true,
        maxWidth: 250, // Custom max width
        behavior: 'wrap' // Options: 'truncate', 'wrap', 'expand'
      }}
      customClassNames={{
        cellExpansion: {
          container: "custom-cell-expansion bg-blue-50 p-2 rounded border"
        }
      }}
    />
  );
}
```

### Custom Loading States

```tsx
export default function CustomLoadingTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Status"]}
      data={employees}
      props={["name", "email", "active"]}
      loading={true}
      customClassNames={{
        loadingContainer: "flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg",
        loadingSkeleton: {
          container: "space-y-3 w-full max-w-md",
          skeletonBar: "h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse",
          skeletonItem: "h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse"
        }
      }}
      customStyles={{
        loading: {
          minHeight: '200px',
          animation: 'fadeIn 0.5s ease-in-out'
        }
      }}
    />
  );
}
```

### Interactive State Customization

```tsx
export default function CustomInteractiveTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Status"]}
      data={employees}
      props={["name", "email", "active"]}
      sortableProps={["name", "email"]}
      customClassNames={{
        interactive: {
          sortableCursor: "cursor-pointer hover:text-blue-600 transition-colors",
          clickableCursor: "cursor-pointer hover:bg-blue-50 transition-colors",
          focusOutline: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }
      }}
    />
  );
}
```

### Advanced Pagination Customization

```tsx
export default function AdvancedPaginationTable() {
  return (
    <TableComponent<Employee>
      columns={["Name", "Email", "Status"]}
      data={employees}
      props={["name", "email", "active"]}
      enablePagination
      page={1}
      setPage={() => {}}
      customClassNames={{
        pagination: {
          container: "flex flex-wrap items-center justify-between gap-2 p-4 bg-white border-t",
          button: "px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
          buttonDisabled: "px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed",
          pageInfo: "text-sm text-gray-700 font-medium",
          navigation: {
            first: "px-3 py-2 bg-blue-600 text-white rounded-l-md hover:bg-blue-700",
            previous: "px-3 py-2 bg-blue-600 text-white hover:bg-blue-700",
            next: "px-3 py-2 bg-blue-600 text-white hover:bg-blue-700",
            last: "px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          }
        }
      }}
    />
  );
}
```

## Advanced Use Cases

### Master-Detail with Expandable Rows

```tsx
interface ExpandableEmployee extends Employee {
  projects: { name: string; status: string; completion: number }[];
  performance: { rating: number; reviews: string[] };
}

export default function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (employeeId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedRows(newExpanded);
  };

  const renderRow = (employee: ExpandableEmployee, index: number) => (
    <>
      {/* Main row */}
      <tr className="border-b hover:bg-gray-50">
        <td className="px-6 py-4">
          <button
            onClick={() => toggleRow(employee.id)}
            className="text-blue-600 hover:text-blue-800 mr-2"
          >
            {expandedRows.has(employee.id) ? "−" : "+"}
          </button>
          {employee.name}
        </td>
        <td className="px-6 py-4">{employee.email}</td>
        <td className="px-6 py-4">{employee.joinDate}</td>
        <td className="px-6 py-4">
          <span className={\`px-2 py-1 rounded-full text-xs \${
            employee.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }\`}>
            {employee.active ? "Active" : "Inactive"}
          </span>
        </td>
      </tr>
      
      {/* Expanded row content */}
      {expandedRows.has(employee.id) && (
        <tr>
          <td colSpan={4} className="px-6 py-4 bg-gray-50">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Current Projects</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {employee.projects.map((project, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{project.name}</span>
                        <span className={\`px-2 py-1 rounded text-xs \${
                          project.status === "active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }\`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: \`\${project.completion}%\` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{project.completion}% complete</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Performance Rating</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">{employee.performance.rating}/5</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <span 
                        key={star}
                        className={star <= employee.performance.rating ? "text-yellow-400" : "text-gray-300"}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Employee Details</h2>
      
      <TableComponent<ExpandableEmployee>
        columns={["Name", "Email", "Join Date", "Status"]}
        data={expandableEmployeesData}
        props={["name", "email", "joinDate", "active"]}
        renderRow={renderRow}
      />
    </div>
  );
}
```

### Data Export Functionality

```tsx
export default function ExportableTable() {
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Join Date", "Status"];
    const csvData = [
      headers,
      ...employees.map(emp => [
        emp.name,
        emp.email, 
        new Date(emp.joinDate).toLocaleDateString(),
        emp.active ? "Active" : "Inactive"
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(employees, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Data</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>📄</span>
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      <TableComponent<Employee>
        columns={["Name", "Email", "Join Date", "Status"]}
        data={employees}
        props={["name", "email", "joinDate", "active"]}
      />
    </div>
  );
}
```

### Column Visibility Controls

```tsx
export default function ColumnControlTable() {
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    joinDate: true,
    skills: true,
    salary: false, // Hidden by default
    active: true,
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const getVisibleColumns = () => {
    const allColumns = [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "joinDate", label: "Join Date" },
      { key: "skills", label: "Skills" },
      { key: "salary", label: "Salary" },
      { key: "active", label: "Status" },
    ];
    
    return allColumns.filter(col => visibleColumns[col.key as keyof typeof visibleColumns]);
  };

  const visibleCols = getVisibleColumns();

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Column Visibility</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(visibleColumns).map(([key, visible]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
              <span className="text-sm capitalize">
                {key === "joinDate" ? "Join Date" : key}
              </span>
            </label>
          ))}
        </div>
      </div>

      <TableComponent<Employee>
        columns={visibleCols.map(col => col.label)}
        data={employees}
        props={visibleCols.map(col => col.key) as (keyof Employee)[]}
        showRemoveColumns={true} // Enable built-in column hiding
      />
    </div>
  );
}
```

## Real-World Scenarios

### E-commerce Product Management

```tsx
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "draft" | "archived";
  images: string[];
  lastModified: string;
  sales: number;
}

export default function ProductManagementTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const editProduct = (product: Product) => {
    // Navigate to edit page or open modal
  };

  const duplicateProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: \`\${product.id}-copy\`,
      name: \`\${product.name} (Copy)\`,
      status: "draft" as const,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const archiveProduct = (product: Product) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === product.id 
          ? { ...p, status: "archived" as const }
          : p
      )
    );
  };

  const formatValue = (value: string, prop: string, item: Product) => {
    switch (prop) {
      case "price":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(value));
      
      case "stock":
        const stock = Number(value);
        return (
          <span className={stock > 10 ? "text-green-600" : stock > 0 ? "text-yellow-600" : "text-red-600"}>
            {stock} {stock === 1 ? "unit" : "units"}
          </span>
        );
      
      case "status":
        const statusColors = {
          active: "bg-green-100 text-green-800",
          draft: "bg-yellow-100 text-yellow-800", 
          archived: "bg-gray-100 text-gray-800",
        };
        return (
          <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColors[item.status]}\`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      
      case "images":
        return (
          <div className="flex -space-x-2">
            {item.images.slice(0, 3).map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="Product" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
            {item.images.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                +{item.images.length - 3}
              </div>
            )}
          </div>
        );
      
      default:
        return value;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Product
        </button>
      </div>

      <TableComponent<Product>
        columns={["Product", "SKU", "Price", "Stock", "Category", "Status", "Images", "Sales"]}
        data={products}
        props={["name", "sku", "price", "stock", "category", "status", "images", "sales"]}
        loading={loading}
        formatValue={formatValue}
        actions={true}
        actionTexts={["Edit", "Duplicate", "Archive"]}
        actionFunctions={[editProduct, duplicateProduct, archiveProduct]}
        enablePagination
        page={1}
        setPage={() => {}}
        itemsPerPage={15}
      />
    </div>
  );
}
```

### Customer Support Ticket System

```tsx
interface Ticket {
  id: string;
  title: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee?: string;
  createdAt: string;
  lastReply: string;
  tags: string[];
}

export default function SupportTicketsTable() {
  const formatValue = (value: string, prop: string, item: Ticket) => {
    switch (prop) {
      case "customer":
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {item.customer.avatar ? (
                <img 
                  src={item.customer.avatar} 
                  alt={item.customer.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                  {item.customer.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{item.customer.name}</div>
              <div className="text-sm text-gray-500">{item.customer.email}</div>
            </div>
          </div>
        );
      
      case "priority":
        const priorityColors = {
          low: "bg-gray-100 text-gray-800",
          medium: "bg-blue-100 text-blue-800",
          high: "bg-orange-100 text-orange-800",
          urgent: "bg-red-100 text-red-800",
        };
        return (
          <span className={\`px-2 py-1 rounded-full text-xs font-medium \${priorityColors[item.priority]}\`}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
          </span>
        );
      
      case "status":
        const statusIcons = {
          open: "🔴",
          "in-progress": "🟡",
          resolved: "🟢", 
          closed: "⚫",
        };
        return (
          <div className="flex items-center space-x-2">
            <span>{statusIcons[item.status]}</span>
            <span className="capitalize">{item.status.replace("-", " ")}</span>
          </div>
        );
      
      case "createdAt":
      case "lastReply":
        return (
          <div className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString()}
            <div className="text-xs text-gray-400">
              {new Date(value).toLocaleTimeString()}
            </div>
          </div>
        );
      
      default:
        return value;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Priorities</option>
            <option>Urgent</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <TableComponent<Ticket>
        columns={["ID", "Title", "Customer", "Priority", "Status", "Assignee", "Created", "Last Reply", "Tags"]}
        data={tickets}
        props={["id", "title", "customer", "priority", "status", "assignee", "createdAt", "lastReply", "tags"]}
        formatValue={formatValue}
        sortableProps={["createdAt", "lastReply", "priority"]}
        enablePagination
        page={1}
        setPage={() => {}}
        itemsPerPage={20}
      />
    </div>
  );
}
```

These examples demonstrate the flexibility and power of the nextjs-reusable-table component. You can mix and match features, customize styling, and adapt the component to fit any data display need in your application.
