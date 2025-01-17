# Next.js Reusable Table

A highly customizable and reusable table component for Next.js applications, built with TypeScript and TailwindCSS.

## Installation

```bash
npm install nextjs-reusable-table
# or
yarn add nextjs-reusable-table
# or
pnpm add nextjs-reusable-table
```

## Basic Usage

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface User {
  id: number;
  name: string;
  email: string;
  balance: string;
}

const MyTable = () => {
  const data: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", balance: "1200.45" },
    { id: 2, name: "Bob", email: "bob@example.com", balance: "300.00" },
  ];

  const formatValue = (value: string, prop: string) => {
    if (prop === "balance") return `$${Number(value).toFixed(2)}`;
    return value;
  };

  return (
    <TableComponent<User>
      columns={["ID", "Name", "Email", "Balance"]}
      data={data}
      props={["id", "name", "email", "balance"]}
      formatValue={formatValue}
      sortableProps={["name", "balance"]}
      stickyHeader={true}
      stickyColumns={{
        left: ["name"],
        right: ["balance"],
      }}
    />
  );
};
```

## Prerequisites

- Next.js 12 or later
- React 16 or later
- React DOM 16 or later
- Tailwind CSS (optional, for default styling)
- TypeScript (recommended)

## Introduction

The Next.js Reusable Table component is a highly customizable, TypeScript-ready, and production-grade solution for displaying tabular data within Next.js applications. It is designed to handle diverse data structures, integrate smoothly with your styling preferences, and provide a feature set that streamlines data visualization, user interaction, and responsive design.

By adhering to industry standards and best practices, this component ensures maintainability, performance, and ease of integration into both small and large-scale Next.js projects. You can leverage its built-in search, pagination, sorting, formatting, and action dropdown features while maintaining full control over styling and rendering.

Use this documentation as a comprehensive guide to seamlessly integrate the Next.js Reusable Table into your workflow, enhance your frontend data management capabilities, and offer end-users a polished, intuitive interface for exploring tabular information.

## Key Features

- **TypeScript Support**: Strong typing throughout ensures predictable and bug-free integrations
- **Next.js Compatibility**: Built explicitly with Next.js in mind, ensuring optimal SSR/ISR compatibility
- **Sticky Columns & Headers**: Keep important columns and headers visible while scrolling
- **Multi-Select with Checkboxes**: Select multiple rows with accurate state management
- **Customizable Columns**: Easily define which properties map to which columns
- **Integrated Sorting**: Enable sorting for specific columns
- **Built-in Search**: Filter rows by query strings without external dependencies
- **Pagination**: Control data pagination out-of-the-box
- **User-Friendly Styling**: Leverage default Tailwind CSS styles or apply custom class names
- **Robust Data Formatting**: Automatically handle dates, arrays, URLs, numeric values
- **Action Dropdowns**: Add context-specific row actions via dropdown
- **Empty State Handling**: Present informative empty states
- **Dark Mode Support**: Seamless theme adaption
- **Column Resizing**: Dynamically adjust column widths
- **Row Groups**: Group rows with custom headers
- **Performance Optimized**: Crafted for large datasets
- **Cell Editing**: Inline editing capabilities
- **Array Data Handling**: Smart handling of array data with expand/collapse
- **Loading States**: Built-in skeleton loader

## Props Reference

### Core Props

| Prop        | Type                   | Required | Default | Description            |
| ----------- | ---------------------- | -------- | ------- | ---------------------- |
| columns     | string[]               | Yes      | -       | Column headers         |
| data        | T[]                    | Yes      | -       | Array of data objects  |
| props       | ReadonlyArray<keyof T> | Yes      | -       | Object keys to display |
| loading     | boolean                | No       | false   | Show loading state     |
| searchValue | string                 | No       | -       | Filter value for rows  |
| maxHeight   | string \| number       | No       | "100vh" | Maximum table height   |

### Styling Props

| Prop                 | Type                                              | Default | Description             |
| -------------------- | ------------------------------------------------- | ------- | ----------------------- |
| disableDefaultStyles | boolean                                           | false   | Disable built-in styles |
| customClassNames     | Object                                            | {}      | Custom class names      |
| enableDarkMode       | boolean                                           | true    | Enable dark mode        |
| stickyHeader         | boolean                                           | false   | Make header sticky      |
| stickyColumns        | { left?: Array<keyof T>; right?: Array<keyof T> } | -       | Make columns sticky     |

### Feature Props

| Prop             | Type           | Default | Description            |
| ---------------- | -------------- | ------- | ---------------------- |
| enablePagination | boolean        | false   | Enable pagination      |
| page             | number         | 1       | Current page number    |
| itemsPerPage     | number         | 10      | Items per page         |
| sortableProps    | Array<keyof T> | []      | Sortable columns       |
| multiSelect      | boolean        | false   | Enable row selection   |
| columnResizable  | boolean        | false   | Enable column resizing |
| cellEditable     | boolean        | false   | Enable cell editing    |
| groupBy          | keyof T        | -       | Group rows by property |

## Advanced Examples

### With Sticky Columns and MultiSelect

```tsx
const [selectedRows, setSelectedRows] = useState<User[]>([]);

<TableComponent<User>
  columns={columns}
  data={data}
  props={props}
  stickyHeader={true}
  stickyColumns={{
    left: ["name"],
    right: ["actions"],
  }}
  multiSelect={true}
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
/>;
```

### With Custom Formatting

```tsx
const formatValue = (value: string, prop: string, item: User) => {
  switch (prop) {
    case "balance":
      return `$${Number(value).toFixed(2)}`;
    case "status":
      return (
        <span
          className={`px-2 py-1 rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      );
    default:
      return value;
  }
};

<TableComponent
  columns={columns}
  data={data}
  props={props}
  formatValue={formatValue}
/>;
```

### With Row Groups

```tsx
<TableComponent<Transaction>
  columns={columns}
  data={data}
  props={props}
  groupBy="category"
  groupRenderer={(category, items) => (
    <div className="font-bold bg-gray-100 p-2">
      {category} ({items.length} items)
    </div>
  )}
/>
```

## Performance Optimization

For best performance with large datasets:

```tsx
<TableComponent<User>
  columns={columns}
  data={largeDataSet}
  props={props}
  maxHeight="600px"
  itemsPerPage={50}
  enablePagination={true}
  stickyHeader={true}
/>
```

## ALL ADVANCED FEATURE EXAMPLES

```tsx
"use client";
import React, { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

// Define a comprehensive interface for our data
interface Transaction {
  id: number;
  date: string;
  customerName: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  category: string;
  tags: string[];
  assignedTo: string;
  priority: "low" | "medium" | "high";
  notes: string;
  url?: string;
  metadata: {
    createdBy: string;
    lastModified: string;
  };
}

const CompleteTableExample = () => {
  // States
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);

  // Sample data
  const transactions: Transaction[] = [
    {
      id: 1,
      date: "2024-01-15",
      customerName: "John Smith",
      description: "Software License Purchase",
      amount: 1299.99,
      status: "completed",
      category: "Software",
      tags: ["license", "annual", "software"],
      assignedTo: "Alice Johnson",
      priority: "high",
      notes: "Enterprise license for 100 users",
      url: "https://example.com/invoice/1",
      metadata: {
        createdBy: "system",
        lastModified: "2024-01-15T10:30:00",
      },
    },
    {
      id: 2,
      date: "2024-01-16",
      customerName: "Sarah Brown",
      description: "Office Supplies",
      amount: 245.5,
      status: "pending",
      category: "Supplies",
      tags: ["office", "supplies", "monthly"],
      assignedTo: "Bob Wilson",
      priority: "medium",
      notes: "Monthly office supply restock",
      metadata: {
        createdBy: "manual",
        lastModified: "2024-01-16T14:20:00",
      },
    },
    // Add more sample data as needed
  ];

  // Action handlers
  const handleEdit = (item: Transaction) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item: Transaction) => {
    console.log("Delete:", item);
  };

  const handleApprove = (item: Transaction) => {
    console.log("Approve:", item);
  };

  const handleCellEdit = (
    newValue: any,
    prop: keyof Transaction,
    item: Transaction,
    index: number
  ) => {
    console.log(`Cell edited: ${prop}`, { newValue, item, index });
  };

  // Custom formatting function
  const formatValue = (value: string, prop: string, item: Transaction) => {
    switch (prop) {
      case "amount":
        return `$${Number(value).toFixed(2)}`;
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              value === "completed"
                ? "bg-green-100 text-green-800"
                : value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        );
      case "priority":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              value === "high"
                ? "bg-red-100 text-red-800"
                : value === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {value}
          </span>
        );
      case "url":
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Invoice
          </a>
        ) : (
          "-"
        );
      case "metadata":
        const meta = JSON.parse(value);
        return (
          <div className="text-xs">
            <div>Created: {meta.createdBy}</div>
            <div>Modified: {new Date(meta.lastModified).toLocaleString()}</div>
          </div>
        );
      default:
        return value;
    }
  };

  // Custom cell formatting
  const formatCell = (
    value: string,
    prop: string,
    item: Transaction,
    index: number
  ) => {
    if (prop === "description") {
      return {
        content: (
          <div className="group relative">
            <div className="font-medium">{value}</div>
            {item.notes && (
              <div className="hidden group-hover:block absolute z-50 bg-white shadow-lg p-2 rounded mt-1 text-sm">
                {item.notes}
              </div>
            )}
          </div>
        ),
        className: "cursor-help hover:bg-gray-50",
        style: { maxWidth: "300px" },
      };
    }
    return { content: value };
  };

  // Custom row grouping renderer
  const groupRenderer = (category: string, items: Transaction[]) => (
    <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-700">
      {category} ({items.length} transactions, Total: $
      {items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)})
    </div>
  );

  // Custom class names for styling
  const customClassNames = {
    table: "shadow-lg border-2 border-gray-200",
    th: "bg-gray-50 text-gray-600 font-semibold",
    td: "px-4 py-2 border-b",
    tr: "hover:bg-gray-50",
    actionButton: "text-blue-600 hover:text-blue-800",
    pagination: {
      container: "mt-4 flex justify-center",
      button: "px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600",
      buttonDisabled: "opacity-50 cursor-not-allowed",
    },
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search input */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />

        {selectedRows.length > 0 && (
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center space-x-4">
            <span className="text-blue-700">
              Selected: {selectedRows.length} transactions
            </span>
            <button
              onClick={() => setSelectedRows([])}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Table Component */}
      <TableComponent<Transaction>
        columns={[
          "ID",
          "Date",
          "Customer",
          "Description",
          "Amount",
          "Status",
          "Category",
          "Tags",
          "Assigned To",
          "Priority",
          "Metadata",
          "Invoice",
          "Actions",
        ]}
        data={transactions}
        props={
          [
            "id",
            "date",
            "customerName",
            "description",
            "amount",
            "status",
            "category",
            "tags",
            "assignedTo",
            "priority",
            "metadata",
            "url",
          ] as const
        }
        actions={true}
        actionTexts={["Edit", "Delete", "Approve"]}
        actionFunctions={[handleEdit, handleDelete, handleApprove]}
        loading={false}
        searchValue={searchValue}
        customClassNames={customClassNames}
        enableDarkMode={true}
        enablePagination={true}
        page={page}
        setPage={setPage}
        itemsPerPage={10}
        sortableProps={[
          "date",
          "customerName",
          "amount",
          "status",
          "category",
          "priority",
        ]}
        formatValue={formatValue}
        formatCell={formatCell}
        stickyHeader={true}
        stickyColumns={{
          left: ["customerName"],
          right: ["status"],
        }}
        columnResizable={true}
        multiSelect={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        groupBy="category"
        groupRenderer={groupRenderer}
        cellEditable={true}
        onCellEdit={handleCellEdit}
        maxHeight="80vh"
        noContentProps={{
          text: "No transactions found",
          name: "transactions",
        }}
      />
    </div>
  );
};

export default CompleteTableExample;
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## Versioning

We use [Semantic Versioning](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ninsau/nextjs-reusable-table/tags).

To bump the version, update the `version` field in `package.json` and follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Acknowledgments

- Inspired by common data table patterns in React and Next.js applications.
- Thanks to all contributors and users for their support.
