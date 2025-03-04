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

`Note: This is a Client Component ("use client"). Using it in purely SSR contexts may require additional handling to avoid hydration mismatches.`

## Basic Usage

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface User {
  id: number;
  name: string;
}

export default function BasicTable() {
  const data: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  return (
    <TableComponent<User>
      columns={["ID", "Name"]}
      data={data}
      props={["id", "name"]}
    />
  );
}
```

## Introduction

Next.js Reusable Table is designed for easy integration into Next.js apps. It supports sorting, pagination, row actions, and flexible data rendering via custom formatters. Built-in helpers handle arrays, dates, and URLs gracefully.

## Features

### Column Management

- Hide/Show columns: Each column header has a dropdown (⋮) to remove or unhide columns.
- Sorting: Specify which columns can be sorted.

```tsx
<TableComponent
  columns={["Name", "Email"]}
  data={yourData}
  props={["name", "email"]}
  sortableProps={["name"]}
/>
```

### Smart Row Interactions

The table provides intelligent click handling:

- Click anywhere on a row to trigger row action
- Click on cell content to expand/interact without triggering row action
- Expandable content with "show more" functionality

### Built-In Data Handling

- Dates automatically formatted.
- Arrays displayed as chips with “+X more” for large arrays.
- URLs automatically detected and rendered as links.

### Action Dropdowns

- Easily attach row actions via a dropdown button:

```tsx
<TableComponent
  actions
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[(item) => editItem(item), (item) => deleteItem(item)]}
/>
```

### Search and Pagination

- searchValue filters rows against all columns.
- Built-in pagination. Provide page, setPage, and itemsPerPage.

```tsx
<TableComponent
  searchValue={searchTerm}
  enablePagination
  page={page}
  setPage={setPage}
  itemsPerPage={10}
/>
```

### Custom Styling

- Styling with Tailwind. Override default classes or disable them entirely:

```tsx
const customClassNames = {
  table: "my-custom-table-styles",
  thead: "bg-gray-200 text-gray-700",
  tbody: "divide-y divide-gray-200",
  pagination: {
    container: "flex justify-center mt-4",
    button: "px-2 py-1 border",
    pageInfo: "mx-2",
  },
};

<TableComponent
  customClassNames={customClassNames}
  disableDefaultStyles={false}
/>;
```

### Dark Mode

- Automatically respects system preference if enableDarkMode is true.

### Loading Skeleton

- Show a skeleton loader while data is loading.

```tsx
<TableComponent loading />
```

### Empty State

Pass noContentProps to customize text and icon:

```tsx
<TableComponent
  noContentProps={{
    text: "No data found",
    icon: <MyCustomIcon />,
  }}
/>
```

## Advanced Example

```tsx
"use client";
import React, { useState } from "react";
import "nextjs-reusable-table/dist/index.css";
import { TableComponent } from "nextjs-reusable-table";

interface Project {
  id: number;
  title: string;
  tags: string[];
  deadline: string;
  active: boolean;
  link: string;
}

const ProjectTable = () => {
  const [page, setPage] = useState(1);
  const data: Project[] = [
    {
      id: 1,
      title: "Website Redesign",
      tags: ["UI/UX", "Frontend"],
      deadline: "2025-03-15T10:30:00Z",
      active: true,
      link: "https://example.com/project/1",
    },
  ];

  const formatValue = (value: string, prop: string, item: Project) => {
    if (prop === "active") {
      return item.active ? "Active" : "Archived";
    }
    return value;
  };

  return (
    <TableComponent<Project>
      columns={["ID", "Title", "Tags", "Deadline", "Status", "Link"]}
      data={data}
      props={["id", "title", "tags", "deadline", "active", "link"]}
      formatValue={formatValue}
      enablePagination
      page={page}
      setPage={setPage}
      itemsPerPage={5}
      sortableProps={["title", "deadline"]}
    />
  );
};

export default ProjectTable;
```

## Prop Reference

| Prop                 | Type                                 | Default | Description                 |
| -------------------- | ------------------------------------ | ------- | --------------------------- |
| columns              | string[]                             | –       | Column headers              |
| data                 | T[]                                  | –       | Array of data objects       |
| props                | ReadonlyArray<keyof T>               | –       | Object keys to display      |
| actions              | boolean                              | false   | Enable action dropdown      |
| actionTexts          | string[]                             | –       | Labels for dropdown actions |
| loading              | boolean                              | false   | Show loading skeleton       |
| actionFunctions      | Array<Function>                      | –       | Handlers for dropdown items |
| searchValue          | string                               | –       | Filter rows by substring    |
| rowOnClick           | (item: T) => void                    | –       | Callback for row clicks     |
| enablePagination     | boolean                              | false   | Enable pagination           |
| page                 | number                               | 1       | Current page index          |
| setPage              | (page: number) => void               | –       | Page setter callback        |
| itemsPerPage         | number                               | 10      | Rows per page               |
| totalPages           | number                               | –       | Override total pages        |
| sortableProps        | Array<keyof T>                       | []      | Columns that can be sorted  |
| formatValue          | (val, prop, item) => React.ReactNode | –       | Custom cell formatter       |
| enableDarkMode       | boolean                              | true    | Respect system dark mode    |
| disableDefaultStyles | boolean                              | false   | Disable built-in styling    |
| customClassNames     | object                               | {}      | Tailwind class overrides    |
| noContentProps       | object                               | {}      | Custom empty state          |

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
