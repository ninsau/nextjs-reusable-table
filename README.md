![Maintenance](https://img.shields.io/badge/status-maintained-brightgreen)
[![npm version](https://img.shields.io/npm/v/nextjs-reusable-table.svg)](https://www.npmjs.com/package/nextjs-reusable-table)
[![npm downloads](https://img.shields.io/npm/dm/nextjs-reusable-table.svg)](https://www.npmjs.com/package/nextjs-reusable-table)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/nextjs-reusable-table)](https://bundlephobia.com/package/nextjs-reusable-table)
[![License](https://img.shields.io/npm/l/nextjs-reusable-table.svg)](https://github.com/ninsau/nextjs-reusable-table/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-96%20passed-brightgreen.svg)](#testing)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#installation)

> ## 📦 This package is actively maintained and improved!
>
> ✅ **Strict TypeScript** compliance with no `any` types  
> ✅ **Modern tooling** with Biome for linting and formatting  
> ✅ **Comprehensive testing** with 96+ test cases  
> ✅ **Zero dependencies** except peer dependencies  
> ✅ **Tree-shakable** ESM/CJS builds  
> ✅ **Accessible** with proper ARIA attributes

# nextjs-reusable-table

A **production-ready**, highly customizable and reusable table component for Next.js applications. Built with TypeScript, optimized for performance, and designed with developer experience in mind.

## 🚀 Key Features

- **🎯 Zero Configuration** - Works out of the box
- **📊 Smart Data Handling** - Automatically formats dates, URLs, arrays  
- **🔍 Built-in Search & Filtering** - No extra setup needed
- **📱 Fully Responsive** - Mobile-first design
- **♿ Accessible** - Screen reader friendly with ARIA support
- **🌙 Dark Mode** - Automatic system preference detection
- **⚡ High Performance** - Optimized renders and lazy loading
- **🎨 Highly Customizable** - Override any style or behavior
- **📦 Lightweight** - ~35KB minified, tree-shakable

## 📦 Installation

```bash
npm install nextjs-reusable-table@latest
# or
yarn add nextjs-reusable-table@latest
# or
pnpm add nextjs-reusable-table@latest
```

### Bundle Size Impact
- **Minified**: ~39KB
- **Minified + Gzipped**: ~12KB  
- **Tree-shakable**: Import only what you need
- **Zero runtime dependencies**: Only peer dependencies on React/Next.js

## ✅ Prerequisites

| Requirement | Version | Notes |
|-------------|---------|--------|
| **Next.js** | 12+ | App Router and Pages Router supported |
| **React** | 16+ | Hooks-based, no class components |
| **React DOM** | 16+ | Standard DOM rendering |
| **Tailwind CSS** | 3.0+ | Required for styling |
| **TypeScript** | 4.5+ | Recommended for best experience |

> **⚠️ Client Component Note**: This uses `"use client"` directive. For SSR contexts, ensure proper hydration handling.

## 🚀 Quick Start

### Basic Usage

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function BasicTable() {
  const users: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Carol Davis", email: "carol@example.com" },
  ];

  return (
    <TableComponent<User>
      columns={["ID", "Name", "Email"]}
      data={users}
      props={["id", "name", "email"]}
    />
  );
}
```

### With Search and Pagination

```tsx
"use client";
import React, { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

export default function SearchableTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      
      <TableComponent<User>
        columns={["ID", "Name", "Email"]}
        data={users}
        props={["id", "name", "email"]}
        searchValue={searchTerm}
        enablePagination
        page={currentPage}
        setPage={setCurrentPage}
        itemsPerPage={5}
      />
    </div>
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
import React, { useState, useMemo } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface Project {
  id: number;
  title: string;
  tags: string[];
  deadline: string;
  active: boolean;
  link: string;
}

export default function AdvancedProjectTable() {
  const initialData: Project[] = [
    {
      id: 1,
      title: "Website Redesign",
      tags: ["UI", "UX", "Frontend"],
      deadline: "2025-03-15T10:30:00Z",
      active: true,
      link: "https://example.com/project/1",
    },
    {
      id: 2,
      title: "Mobile App Development",
      tags: ["iOS", "Android", "Backend"],
      deadline: "2025-04-01T14:00:00Z",
      active: false,
      link: "https://example.com/project/2",
    },
    {
      id: 3,
      title: "Marketing Campaign",
      tags: ["SEO", "Social Media"],
      deadline: "2025-02-20T09:00:00Z",
      active: true,
      link: "https://example.com/project/3",
    },
    {
      id: 4,
      title: "E-commerce Platform",
      tags: ["Frontend", "Backend", "API", "Payments", "Analytics"],
      deadline: "2025-05-05T11:00:00Z",
      active: true,
      link: "https://example.com/project/4",
    },
    {
      id: 5,
      title: "Data Analysis",
      tags: ["Python", "ML", "Data Science"],
      deadline: "2025-03-01T08:00:00Z",
      active: false,
      link: "https://example.com/project/5",
    },
  ];

  const [projects, setProjects] = useState<Project[]>(initialData);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    prop: keyof Project;
    order: "asc" | "desc";
  } | null>(null);

  const handleSort = (prop: keyof Project) => {
    let order: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.prop === prop) {
      order = sortConfig.order === "asc" ? "desc" : "asc";
    }
    setSortConfig({ prop, order });
  };

  const editProject = (project: Project) => {
    alert(`Edit project: ${project.title}`);
  };

  const deleteProject = (project: Project) => {
    alert(`Delete project: ${project.title}`);
  };

  const handleRowClick = (project: Project) => {
    console.log("Row clicked:", project);
  };

  const formatValue = (value: string, prop: string, project: Project) => {
    if (prop === "active") {
      return project.active ? "Active" : "Archived";
    }
    return value;
  };

  const formatHeader = (header: string, prop: string, index: number) => (
    <div>
      <span className="font-semibold uppercase tracking-wide">{header}</span>
    </div>
  );

  const sortedFilteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        String(project.id).includes(searchLower) ||
        project.title.toLowerCase().includes(searchLower) ||
        project.tags.join(" ").toLowerCase().includes(searchLower) ||
        project.deadline.toLowerCase().includes(searchLower) ||
        (project.active ? "active" : "archived").includes(searchLower) ||
        project.link.toLowerCase().includes(searchLower)
      );
    });
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = String(a[sortConfig.prop]).toLowerCase();
        const bValue = String(b[sortConfig.prop]).toLowerCase();
        if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [projects, searchTerm, sortConfig]);

  const customClassNames = {
    table: "border border-gray-300 rounded-md shadow-sm",
    thead: "bg-blue-50 text-blue-700",
    tbody: "",
    th: "px-4 py-2",
    tr: "",
    td: "px-4 py-2",
    pagination: {
      container: "mt-4",
      button: "bg-blue-500 text-white rounded px-3 py-1",
      buttonDisabled: "bg-gray-300 text-gray-700 rounded px-3 py-1",
      pageInfo: "text-blue-700",
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Project Table</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <TableComponent<Project>
        columns={["ID", "Title", "Tags", "Deadline", "Status", "Link"]}
        data={sortedFilteredProjects}
        props={["id", "title", "tags", "deadline", "active", "link"]}
        sortableProps={["title", "deadline"]}
        onSort={handleSort}
        actionTexts={["Edit", "Delete"]}
        actionFunctions={[editProject, deleteProject]}
        rowOnClick={handleRowClick}
        formatValue={formatValue}
        formatHeader={formatHeader}
        enablePagination
        page={page}
        setPage={setPage}
        itemsPerPage={2}
        noContentProps={{ text: "No projects found", icon: null }}
        customClassNames={customClassNames}
      />
    </div>
  );
}
```

## Prop Reference

| Prop                 | Type                                 | Default | Description                                                  |
| -------------------- | ------------------------------------ | ------- | ------------------------------------------------------------ |
| columns              | string[]                             | –       | Column headers                                               |
| data                 | T[]                                  | –       | Array of data objects                                        |
| props                | ReadonlyArray<keyof T>               | –       | Object keys to display                                       |
| actions              | boolean                              | false   | Enable action dropdown                                       |
| actionTexts          | string[]                             | –       | Labels for dropdown actions                                  |
| loading              | boolean                              | false   | Show loading skeleton                                        |
| actionFunctions      | Array<Function>                      | –       | Handlers for dropdown items                                  |
| searchValue          | string                               | –       | Filter rows by substring                                     |
| rowOnClick           | (item: T) => void                    | –       | Callback for row clicks                                      |
| enablePagination     | boolean                              | false   | Enable pagination                                            |
| page                 | number                               | 1       | Current page index                                           |
| setPage              | (page: number) => void               | –       | Page setter callback                                         |
| itemsPerPage         | number                               | 10      | Rows per page                                                |
| totalPages           | number                               | –       | Override total pages                                         |
| sortableProps        | Array<keyof T>                       | []      | Columns that can be sorted                                   |
| formatValue          | (val, prop, item) => React.ReactNode | –       | Custom cell formatter                                        |
| enableDarkMode       | boolean                              | true    | Respect system dark mode                                     |
| disableDefaultStyles | boolean                              | false   | Disable built-in styling                                     |
| customClassNames     | object                               | {}      | Tailwind class overrides                                     |
| noContentProps       | object                               | {}      | Custom empty state                                           |
| onSort               | (prop: keyof T) => void              | –       | Callback triggered when a sortable column header is clicked. |
| formatHeader         | (header: string) => React.ReactNode  | –       | Custom header formatter                                      |

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
