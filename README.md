# Next.js Reusable Table

## Introduction

The Next.js Reusable Table component is a highly customizable, TypeScript-ready, and production-grade solution for displaying tabular data within Next.js applications. It is designed to handle diverse data structures, integrate smoothly with your styling preferences, and provide a feature set that streamlines data visualization, user interaction, and responsive design.

By adhering to industry standards and best practices, this component ensures maintainability, performance, and ease of integration into both small and large-scale Next.js projects. You can leverage its built-in search, pagination, sorting, formatting, and action dropdown features while maintaining full control over styling and rendering.

Use this documentation as a comprehensive guide to seamlessly integrate the Next.js Reusable Table into your workflow, enhance your frontend data management capabilities, and offer end-users a polished, intuitive interface for exploring tabular information.

## Key Features

- **TypeScript Support**: Strong typing throughout ensures predictable and bug-free integrations.
- **Next.js Compatibility**: Built explicitly with Next.js in mind, ensuring optimal SSR/ISR compatibility and performance.
- **Customizable Columns and Data Mapping**: Easily define which properties of your data objects map to which columns, empowering flexible table structures.
- **Integrated Sorting**: Enable sorting for specific columns, offering ascending and descending order toggling with minimal overhead.
- **Built-in Search**: Filter rows by query strings without external dependencies, streamlining data exploration for end-users.
- **Pagination**: Control data pagination out-of-the-box, complete with a customizable pagination component for large datasets.
- **User-Friendly Styling Options**: Leverage default Tailwind CSS styles, opt out entirely, or apply custom class names to maintain your unique design language.
- **Robust Data Formatting**: Automatically handle dates, arrays, URLs, numeric values, and truncated text, or plug in custom `formatValue` logic for domain-specific formatting.
- **Action Dropdowns**: Add context-specific row actions (e.g., “Edit,” “Delete”) via a built-in dropdown, enabling interactive and stateful table operations.
- **Empty State Handling**: Present informative empty states for when no data matches the filters or queries, customizable to fit any brand tone.
- **Dark Mode Compatibility**: Seamless theme adaption to both light and dark modes, respecting user preferences and boosting accessibility.
- **Performance and Scalability**: Crafted to handle large datasets efficiently with minimal performance overhead, even under SSR or incremental static generation.

These features work cohesively to simplify and elevate the process of presenting and interacting with tabular data in a Next.js environment, ensuring a top-tier developer and end-user experience.

## Prerequisites

Before integrating the Next.js Reusable Table into your project, ensure that your environment meets the following conditions:

- **Next.js Application**: This component is designed for Next.js (version 12 or later). It should function properly in all Next.js environments, including SSR, ISR, and static deployments.
- **React and React-DOM**: Ensure you are using React and React-DOM (version 16 or newer), as these are peer dependencies.
- **Tailwind CSS (Optional)**: The component ships with Tailwind CSS-based default styles. For seamless styling out-of-the-box, have Tailwind CSS configured in your Next.js project. If you prefer alternative styling solutions, you may disable these defaults and apply your own CSS, utility classes, or custom frameworks.
- **TypeScript (Recommended)**: While not mandatory, TypeScript usage is highly recommended to fully leverage the strict typing and generic support built into this component.

Having these prerequisites in place ensures a smooth setup and integration experience, minimizing friction and streamlining your development workflow.

## Installation

### Step 1: Install the Package

Use your preferred package manager to install the `nextjs-reusable-table` package:

```bash
npm install nextjs-reusable-table
```

or

```bash
yarn add nextjs-reusable-table
```

### Step 2: Include Default Styles (Optional)

If you want to leverage the default Tailwind CSS styles, ensure Tailwind is set up in your Next.js project. Then import the stylesheet:

```tsx
import "nextjs-reusable-table/dist/index.css";
```

To customize the table’s appearance or use a different styling approach, skip this import and configure your own styles via `disableDefaultStyles` and `customClassNames`.

### Step 3: Validate Peer Dependencies

Make sure `react`, `react-dom`, and `next` are present and up-to-date in your project.

## Usage

### Basic Example

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

const data: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", balance: "1200.4567" },
  { id: 2, name: "Bob", email: "bob@example.com", balance: "300" },
];

const columns = ["Name", "Email", "Balance"];
const props = ["name", "email", "balance"] as const;

const formatValue = (value: string, prop: string, item: User) => {
  if (prop === "balance") {
    return `$${parseFloat(value).toFixed(2)}`;
  }
  return value;
};

export default function MyPage() {
  return (
    <TableComponent<User>
      columns={columns}
      data={data}
      props={props}
      formatValue={formatValue}
      sortableProps={["name", "balance"]}
      noContentProps={{ text: "No users available at the moment." }}
    />
  );
}
```

This example displays a table of users with sortable columns (name and balance) and formatted currency values. By providing `formatValue`, you control how the balance is displayed.

### Props Reference

#### TableComponent Props

| Prop                 | Type                                                        | Required | Description                                                                  |
| -------------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| columns              | `string[]`                                                  | Yes      | Column headers to display.                                                   |
| data                 | `T[]`                                                       | Yes      | An array of data objects representing each row.                              |
| props                | `ReadonlyArray<keyof T>`                                    | Yes      | Keys from data objects that map to each column.                              |
| actions              | `boolean`                                                   | No       | Whether to display an action dropdown for each row.                          |
| actionTexts          | `string[]`                                                  | No       | Labels for action buttons (e.g., `["Edit", "Delete"]`).                      |
| actionFunctions      | `Array<(item: T) => void>`                                  | No       | Functions invoked when action buttons are clicked.                           |
| loading              | `boolean`                                                   | No       | If true, shows a skeleton loader instead of the table.                       |
| searchValue          | `string`                                                    | No       | Filters rows based on this string, checking all specified props for matches. |
| disableDefaultStyles | `boolean`                                                   | No       | When true, disables built-in Tailwind styles.                                |
| customClassNames     | `Object`                                                    | No       | Provides custom classes for various table elements.                          |
| renderRow            | `(item: T, index: number) => React.ReactNode`               | No       | Custom rendering function for each table row.                                |
| rowOnClick           | `(item: T) => void`                                         | No       | Callback for when a row is clicked.                                          |
| enableDarkMode       | `boolean`                                                   | No       | Enables dark mode styling.                                                   |
| enablePagination     | `boolean`                                                   | No       | Enables pagination controls.                                                 |
| page                 | `number`                                                    | No       | Current page number (used with pagination).                                  |
| setPage              | `(page: number) => void`                                    | No       | Callback to update the page number.                                          |
| itemsPerPage         | `number`                                                    | No       | Items per page (defaults to 10) for pagination.                              |
| totalPages           | `number`                                                    | No       | Total number of pages (if known).                                            |
| sortableProps        | `Array<keyof T>`                                            | No       | List of props that should be sortable.                                       |
| formatValue          | `(value: string, prop: string, item: T) => React.ReactNode` | No       | Custom formatting function for cell values.                                  |
| noContentProps       | `{ text?: string; icon?: React.ReactNode; name?: string; }` | No       | Custom text/icon for when no data is available.                              |

#### Custom Class Names Object

| Key                        | Description                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| container                  | Class for the outer container `<div>`.                                                    |
| table                      | Class for the `<table>` element.                                                          |
| thead                      | Class for the `<thead>` element.                                                          |
| tbody                      | Class for the `<tbody>` element.                                                          |
| th                         | Class for the `<th>` elements.                                                            |
| tr                         | Class for the `<tr>` elements.                                                            |
| td                         | Class for the `<td>` elements.                                                            |
| actionTd                   | Class for the `<td>` containing the action dropdown.                                      |
| actionButton               | Class for the action button in the action dropdown.                                       |
| actionSvg                  | Class for the SVG                                                                         |
| icon in the action button. |
| dropdownMenu               | Class for the dropdown menu container in the action dropdown.                             |
| dropdownItem               | Class for each item in the dropdown menu.                                                 |
| pagination                 | Class object for pagination styles (`container`, `button`, `buttonDisabled`, `pageInfo`). |

### Advanced Usage

#### Opting Out of Default Styles

If you choose not to use the built-in Tailwind styles, simply omit the stylesheet import and set `disableDefaultStyles` to `true`. Then supply your own CSS classes through `customClassNames`:

```tsx
<TableComponent
  columns={columns}
  data={data}
  props={props}
  disableDefaultStyles={true}
  customClassNames={{
    container: "my-container",
    table: "my-table",
    th: "my-th",
    // ...
  }}
/>
```

#### Custom Row Rendering

For fine-grained control over row appearance, provide a `renderRow` function:

```tsx
const renderRow = (item: User, index: number) => (
  <>
    <td>{item.name}</td>
    <td>{item.email}</td>
    <td>{item.balance}</td>
  </>
);

<TableComponent
  columns={["Name", "Email", "Balance"]}
  data={data}
  props={["name", "email", "balance"] as const}
  renderRow={renderRow}
/>;
```

This approach gives you complete freedom to structure cell content, apply conditional styling, or integrate external components.

#### Pagination

Enable pagination and control the current page:

```tsx
const [page, setPage] = useState(1);
<TableComponent
  columns={columns}
  data={largeDataSet}
  props={props}
  enablePagination={true}
  page={page}
  setPage={setPage}
  itemsPerPage={20}
/>;
```

If you know the total number of pages, pass `totalPages` for precise pagination controls.

#### Sorting

Declare sortable columns via `sortableProps`, and the table handles sorting logic internally:

```tsx
<TableComponent
  columns={["Name", "Balance"]}
  data={data}
  props={["name", "balance"] as const}
  sortableProps={["name", "balance"]}
/>
```

Columns specified in `sortableProps` will toggle between none, asc, and desc states when clicked.

#### Format Values

For domain-specific formatting, provide a `formatValue` function that receives the raw value, the property name, and the entire item. This allows you to format currency, truncate text differently, or linkify URLs:

```tsx
const formatValue = (value: string, prop: string, item: User) => {
  if (prop === "balance") return `$${Number(value).toFixed(2)}`;
  return value;
};

<TableComponent
  columns={columns}
  data={data}
  props={props}
  formatValue={formatValue}
/>;
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
