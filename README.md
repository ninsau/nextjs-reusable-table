# Next.js Reusable Table

A highly customizable and reusable table component for Next.js applications, built with TypeScript and TailwindCSS.

## Installation

```bash
npm install nextjs-reusable-table@latest
# or
yarn add nextjs-reusable-table@latest
# or
pnpm add nextjs-reusable-table@latest
```

## Prerequisites

- Next.js 12 or later
- React 16 or later
- React DOM 16 or later
- Tailwind CSS 3.0 or later
- TypeScript (recommended)

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
  status: string;
  createdAt: string;
  tags: string[];
}

const MyTable = () => {
  const data: User[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      balance: "1200.45",
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
      tags: ["VIP", "Early Adopter"],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      balance: "300.00",
      status: "inactive",
      createdAt: "2024-01-16T15:45:00Z",
      tags: ["Trial"],
    },
  ];

  const formatValue = (value: string, prop: string, item: User) => {
    switch (prop) {
      case "balance":
        return `$${Number(value).toFixed(2)}`;
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
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

  const handleRowClick = (user: User) => {
    console.log("Clicked user:", user);
  };

  return (
    <TableComponent<User>
      columns={[
        "ID",
        "Name",
        "Email",
        "Balance",
        "Status",
        "Created At",
        "Tags",
      ]}
      data={data}
      props={["id", "name", "email", "balance", "status", "createdAt", "tags"]}
      formatValue={formatValue}
      sortableProps={["name", "balance", "status", "createdAt"]}
      rowOnClick={handleRowClick}
      enableDarkMode={true}
    />
  );
};

export default MyTable;
```

## Introduction

The Next.js Reusable Table component is a highly customizable, TypeScript-ready, and production-grade solution for displaying tabular data within Next.js applications. It is designed to handle diverse data structures, integrate smoothly with your styling preferences, and provide a feature set that streamlines data visualization, user interaction, and responsive design.

By adhering to industry standards and best practices, this component ensures maintainability, performance, and ease of integration into both small and large-scale Next.js projects. You can leverage its built-in search, pagination, sorting, formatting, and action dropdown features while maintaining full control over styling and rendering.

Use this documentation as a comprehensive guide to seamlessly integrate the Next.js Reusable Table into your workflow, enhance your frontend data management capabilities, and offer end-users a polished, intuitive interface for exploring tabular information.

## Features

### Column Management

Each column header includes a dropdown menu (⋮) with the following options:

- Stick/unstick horizontally (right-click header)
- Stick/unstick vertically (shift + right-click header)
- Hide/show columns
- Sort columns (when enabled)

```tsx
<TableComponent<User>
  columns={columns}
  data={data}
  props={props}
  sortableProps={["name", "email", "createdAt"]} // Enable sorting for these columns
/>
```

### Smart Row Interactions

The table provides intelligent click handling:

- Click anywhere on a row to trigger row action
- Click on cell content to expand/interact without triggering row action
- Expandable content with "show more" functionality

```tsx
<TableComponent<User>
  // ... other props
  rowOnClick={(user) => console.log("Row clicked:", user)}
  formatValue={(value, prop, item) => {
    if (prop === "description") {
      return <div className="hover:bg-gray-50 cursor-pointer">{value}</div>;
    }
    return value;
  }}
/>
```

### Data Type Handling

The table automatically handles different data types:

#### Arrays

Arrays are displayed as chips with expand/collapse functionality:

```tsx
interface Item {
  tags: string[];
}

const data = [
  {
    tags: ["one", "two", "three", "four", "five", "six"],
  },
];

// Tags will show first 5 items with "+1 more" button
```

#### Dates

Automatic date formatting:

```tsx
interface Item {
  createdAt: string;
}

const data = [
  {
    createdAt: "2024-01-15T10:30:00Z", // Will be formatted as "Jan 15, 2024 10:30 AM"
  },
];
```

#### URLs

Automatic link detection and formatting:

```tsx
interface Item {
  website: string;
}

const data = [
  {
    website: "https://example.com", // Will be rendered as clickable link
  },
];
```

### Action Dropdown

Add row actions with dropdown menu:

```tsx
<TableComponent<User>
  // ... other props
  actions={true}
  actionTexts={["Edit", "Delete", "View Details"]}
  actionFunctions={[
    (user) => handleEdit(user),
    (user) => handleDelete(user),
    (user) => handleView(user),
  ]}
/>
```

### Search and Pagination

Built-in search and pagination support:

```tsx
const [page, setPage] = useState(1);
const [searchTerm, setSearchTerm] = useState("");

<TableComponent<User>
  // ... other props
  searchValue={searchTerm}
  enablePagination={true}
  page={page}
  setPage={setPage}
  itemsPerPage={10}
/>;
```

### Custom Styling

Customize appearance with Tailwind classes:

```tsx
const customClassNames = {
  table: "shadow-lg border-2 border-gray-200",
  thead: "bg-gray-50",
  tbody: "divide-y divide-gray-200",
  th: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tr: "hover:bg-gray-50",
  td: "px-4 py-2",
  actionButton: "text-gray-600 hover:text-gray-900",
  pagination: {
    container: "mt-4",
    button: "px-3 py-1 bg-gray-200 rounded",
    buttonDisabled: "opacity-50",
    pageInfo: "mx-2",
  },
};

<TableComponent<User>
  // ... other props
  customClassNames={customClassNames}
  disableDefaultStyles={false} // Set to true to use only custom classes
/>;
```

### Dark Mode

Built-in dark mode support that respects system preferences:

```tsx
<TableComponent<User>
  // ... other props
  enableDarkMode={true} // Will automatically switch based on system preference
/>
```

### Loading State

Show loading skeleton:

```tsx
<TableComponent<User>
  // ... other props
  loading={true}
/>
```

### Empty State

Custom empty state message:

```tsx
<TableComponent<User>
  // ... other props
  noContentProps={{
    text: "No users found",
    name: "users",
    icon: <CustomIcon />, // Optional
  }}
/>
```

## Props Reference

### Core Props

| Prop        | Type                   | Required | Default | Description            |
| ----------- | ---------------------- | -------- | ------- | ---------------------- |
| columns     | string[]               | Yes      | -       | Column headers         |
| data        | T[]                    | Yes      | -       | Array of data objects  |
| props       | ReadonlyArray<keyof T> | Yes      | -       | Object keys to display |
| loading     | boolean                | No       | false   | Show loading state     |
| searchValue | string                 | No       | -       | Filter value for rows  |

### Column Management Props

| Prop          | Type           | Default | Description                |
| ------------- | -------------- | ------- | -------------------------- |
| sortableProps | Array<keyof T> | []      | Columns that can be sorted |
| formatValue   | Function       | -       | Custom value formatter     |

### Interaction Props

| Prop            | Type              | Default | Description              |
| --------------- | ----------------- | ------- | ------------------------ |
| rowOnClick      | (item: T) => void | -       | Row click handler        |
| actions         | boolean           | false   | Enable action dropdown   |
| actionTexts     | string[]          | -       | Action dropdown labels   |
| actionFunctions | Array<Function>   | -       | Action dropdown handlers |

### Styling Props

| Prop                 | Type    | Default | Description             |
| -------------------- | ------- | ------- | ----------------------- |
| disableDefaultStyles | boolean | false   | Disable built-in styles |
| customClassNames     | Object  | {}      | Custom class names      |
| enableDarkMode       | boolean | true    | Enable dark mode        |

### Pagination Props

| Prop             | Type    | Default | Description          |
| ---------------- | ------- | ------- | -------------------- |
| enablePagination | boolean | false   | Enable pagination    |
| page             | number  | 1       | Current page         |
| itemsPerPage     | number  | 10      | Items per page       |
| totalPages       | number  | -       | Total pages override |

## Types

```typescript
interface TableProps<T> {
  columns: string[];
  data: T[];
  props: ReadonlyArray<keyof T>;
  actions?: boolean;
  actionTexts?: string[];
  loading?: boolean;
  actionFunctions?: Array<(item: T) => void>;
  searchValue?: string;
  disableDefaultStyles?: boolean;
  customClassNames?: {
    container?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    th?: string;
    tr?: string;
    td?: string;
    actionTd?: string;
    actionButton?: string;
    actionSvg?: string;
    dropdownMenu?: string;
    dropdownItem?: string;
    pagination?: {
      container?: string;
      button?: string;
      buttonDisabled?: string;
      pageInfo?: string;
    };
  };
  renderRow?: (item: T, index: number) => React.ReactNode;
  rowOnClick?: (item: T) => void;
  enableDarkMode?: boolean;
  enablePagination?: boolean;
  page?: number;
  setPage?: (page: number) => void;
  itemsPerPage?: number;
  totalPages?: number;
  sortableProps?: Array<keyof T>;
  formatValue?: (value: string, prop: string, item: T) => React.ReactNode;
  noContentProps?: {
    text?: string;
    icon?: React.ReactNode;
    name?: string;
  };
}
```

## ALL ADVANCED FEATURE EXAMPLES

```tsx
"use client";
import React, { useState } from "react";
import "nextjs-reusable-table/dist/index.css";
import { TableComponent } from "nextjs-reusable-table";

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  roles: string[];
  lastLogin: string;
  profileUrl: string;
  tags: string[];
  department: string;
}

const Test = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const sampleData: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2023-01-15T10:30:00Z",
      status: "Active",
      roles: ["Admin", "Editor", "User"],
      lastLogin: "2024-01-20T15:45:00Z",
      profileUrl: "https://example.com/john",
      tags: ["VIP", "Early Adopter"],
      department: "Engineering",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2023-02-20T09:15:00Z",
      status: "Active",
      roles: ["User", "Support"],
      lastLogin: "2024-01-19T12:30:00Z",
      profileUrl: "https://example.com/jane",
      tags: ["Support Team"],
      department: "Customer Support",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      joinDate: "2023-03-10T14:20:00Z",
      status: "Inactive",
      roles: ["User"],
      lastLogin: "2023-12-15T10:00:00Z",
      profileUrl: "https://example.com/bob",
      tags: ["New User"],
      department: "Marketing",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      joinDate: "2023-04-05T11:45:00Z",
      status: "Active",
      roles: ["Editor", "User", "Content Manager"],
      lastLogin: "2024-01-21T09:15:00Z",
      profileUrl: "https://example.com/sarah",
      tags: ["Content Team", "VIP"],
      department: "Content",
    },
    {
      id: "5",
      name: "Mike Brown",
      email: "mike@example.com",
      joinDate: "2023-05-12T13:10:00Z",
      status: "Active",
      roles: ["User", "Analytics"],
      lastLogin: "2024-01-18T16:20:00Z",
      profileUrl: "https://example.com/mike",
      tags: ["Analytics Team"],
      department: "Data Science",
    },
  ];

  const columns = [
    "ID",
    "Name",
    "Email",
    "Join Date",
    "Status",
    "Roles",
    "Last Login",
    "Profile",
    "Tags",
    "Department",
  ];

  const props: Array<keyof User> = [
    "id",
    "name",
    "email",
    "joinDate",
    "status",
    "roles",
    "lastLogin",
    "profileUrl",
    "tags",
    "department",
  ];

  const actionTexts = ["Edit", "Delete", "View Details"];

  const actionFunctions = [
    (user: User) => console.log(`Edit ${user.name}`),
    (user: User) => console.log(`Delete ${user.name}`),
    (user: User) => console.log(`View ${user.name}'s details`),
  ];

  const customFormatValue = (value: string, prop: string, item: User) => {
    switch (prop) {
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              value === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        );
      case "department":
        return (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {value}
          </span>
        );
      case "profileUrl":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Profile
          </a>
        );
      default:
        return value;
    }
  };

  const handleRowClick = (user: User) => {
    console.log(`Clicked row for ${user.name}`);
  };

  const customClassNames = {
    table: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
    thead: "bg-gray-50 dark:bg-gray-800",
    tbody:
      "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700",
    th: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
    tr: "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200",
    td: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
    actionButton:
      "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
    actionSvg: "w-5 h-5",
    dropdownMenu:
      "bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700",
    dropdownItem:
      "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
    pagination: {
      container:
        "bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6",
      button:
        "relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
      buttonDisabled: "opacity-50 cursor-not-allowed",
      pageInfo: "text-sm text-gray-700 dark:text-gray-300",
    },
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Tip: Right-click column headers for sticky options
        </div>
      </div>

      <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
        <TableComponent<User>
          columns={columns}
          data={sampleData}
          props={props}
          actions={true}
          actionTexts={actionTexts}
          actionFunctions={actionFunctions}
          searchValue={searchTerm}
          enablePagination={true}
          page={page}
          setPage={setPage}
          itemsPerPage={5}
          sortableProps={[
            "name",
            "email",
            "joinDate",
            "status",
            "department",
            "lastLogin",
          ]}
          formatValue={customFormatValue}
          rowOnClick={handleRowClick}
          enableDarkMode={true}
          customClassNames={customClassNames}
          noContentProps={{
            text: "No users found",
            name: "users",
          }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Features demonstrated:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Column Header Management (click ⋮ icon):
            <ul className="list-disc pl-5 mt-1">
              <li>Hide/Show columns</li>
              <li>Toggle sticky horizontal/vertical</li>
              <li>Sort columns</li>
            </ul>
          </li>
          <li>
            Smart Row Interaction:
            <ul className="list-disc pl-5 mt-1">
              <li>Click row area for row action</li>
              <li>Click cell content to expand/interact</li>
              <li>Protected link and action clicks</li>
            </ul>
          </li>
          <li>
            Enhanced Data Display:
            <ul className="list-disc pl-5 mt-1">
              <li>Array chips with expand/collapse</li>
              <li>Formatted dates</li>
              <li>Status badges</li>
              <li>Clickable URLs</li>
            </ul>
          </li>
          <li>
            Visual Features:
            <ul className="list-disc pl-5 mt-1">
              <li>Dark mode support</li>
              <li>Loading skeleton</li>
              <li>Custom cell styling</li>
              <li>Responsive layout</li>
            </ul>
          </li>
          <li>
            Functionality:
            <ul className="list-disc pl-5 mt-1">
              <li>Search filtering</li>
              <li>Pagination</li>
              <li>Action dropdown</li>
              <li>Column sorting</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Test;
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
