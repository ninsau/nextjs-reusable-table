# Next.js Reusable Table

A highly customizable and reusable table component for Next.js applications, built with TypeScript and the latest technologies.

## See the [Examples](https://nextjs-reusables.vercel.app/tables)

<!-- [![NPM](https://img.shields.io/npm/v/react-coderenderer.svg)](https://www.npmjs.com/package/react-coderenderer)
[![Downloads](https://img.shields.io/npm/dt/react-coderenderer.svg)](https://www.npmjs.com/package/react-coderenderer)
[![License](https://img.shields.io/npm/l/react-coderenderer.svg)](https://www.npmjs.com/package/react-coderenderer) -->

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Props](#props)
- [Components](#components)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)
- [Code of Conduct](#code-of-conduct)
- [Acknowledgments](#acknowledgments)

## Features

- **TypeScript Support**: Fully typed with generics to ensure type safety and better developer experience.
- **Next.js Optimized**: Specifically designed for seamless integration with Next.js applications, ensuring performance and compatibility.

- **Customizable Columns and Data**: Easily configure columns and map data properties, making the table versatile for various data structures.

- **Action Dropdowns**: Built-in support for row-specific actions with customizable buttons and functions, enabling interactive tables.

- **Loading Skeleton**: Provides a smooth user experience by showing a skeleton loader during data fetch or loading states.

- **No Content Component**: Displays a friendly message when no data is available, enhancing UX for empty states.

- **Styling Flexibility**: Comes with default Tailwind CSS styles but allows opting out to apply custom styles or completely override the design.

- **Search Functionality**: Integrates a search feature to easily filter and search through table data.

- **Handle Various Data Types**: Effortlessly manages data types like dates, arrays, URLs, and strings, automatically formatting and displaying them in a user-friendly way.

- **Dark Mode Compatible**: Supports dark mode themes and can be easily customized to match your application's design.

- **Modern Technologies**: Built with the latest React features and follows best practices for efficient, maintainable code.

## Prerequisites

This package uses [Tailwind CSS](https://tailwindcss.com/) for styling. Ensure you have Tailwind CSS installed and configured in your Next.js project. If you haven't set it up yet, follow the official [Tailwind CSS Next.js Installation Guide](https://tailwindcss.com/docs/guides/nextjs).

`Note:` If you prefer not to use `Tailwind CSS` or want to apply your own styling, you can opt-out of the default styles provided by this package. See the Opting Out of Default Styles section for details.

## Installation

Install the package via npm:

```bash
npm install nextjs-reusable-table
```

Or via yarn:

```bash
yarn add nextjs-reusable-table
```

## Usage

Import the `TableComponent` into your Next.js page or component:

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css"; // Import default styles
```

Pass the required props to the `TableComponent`:

```tsx
<TableComponent
  columns={columns}
  data={data}
  props={props}
  actions={true}
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[handleEdit, handleDelete]}
  loading={false}
  searchValue=""
/>
```

### Basic Example

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css"; // Import default styles

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  // ... more data
];

const columns = ["Name", "Email", "Role"];
const props = ["name", "email", "role"] as const;

const MyTablePage: React.FC = () => {
  const handleEdit = (item: User) => {
    console.log("Edit", item);
  };

  const handleDelete = (item: User) => {
    console.log("Delete", item);
  };

  return (
    <TableComponent<User>
      columns={columns}
      data={data}
      props={props}
      actions={true}
      actionTexts={["Edit", "Delete"]}
      actionFunctions={[handleEdit, handleDelete]}
      loading={false}
      searchValue=""
    />
  );
};

export default MyTablePage;
```

### Opting Out of Default Styles

If you prefer to use your own styling or are not using Tailwind CSS in your project, you can opt-out of the default styles provided by the package. Here's how:

- Do Not `Import` the Default CSS

```tsx
// import "nextjs-reusable-table/dist/index.css"; // Do not import this
```

- Set `disableDefaultStyles` to true

  Pass the `disableDefaultStyles` prop to the TableComponent:

```tsx
<TableComponent
  // ... your props
  disableDefaultStyles={true}
  customClassNames={{
    container: "my-custom-container",
    table: "my-custom-table",
    th: "my-custom-th",
    // ... other custom classes
  }}
/>
```

- Provide Custom Class Names (Optional)

  If you want to apply your own styles, you can pass custom class names via the customClassNames prop. This allows you to fully customize the appearance of the table.

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
// Do not import the default CSS
import "./my-custom-styles.css"; // Your custom styles

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  // ... more data
];

const columns = ["Name", "Email", "Role"];
const props = ["name", "email", "role"] as const;

const MyTablePage: React.FC = () => {
  const handleEdit = (item: User) => {
    console.log("Edit", item);
  };

  const handleDelete = (item: User) => {
    console.log("Delete", item);
  };

  return (
    <TableComponent<User>
      columns={columns}
      data={data}
      props={props}
      actions={true}
      actionTexts={["Edit", "Delete"]}
      actionFunctions={[handleEdit, handleDelete]}
      loading={false}
      searchValue=""
      disableDefaultStyles={true}
      customClassNames={{
        container: "my-custom-container",
        table: "my-custom-table",
        th: "my-custom-th",
        tr: "my-custom-tr",
        td: "my-custom-td",
        actionTd: "my-custom-action-td",
        actionButton: "my-custom-action-button",
        actionSvg: "my-custom-action-svg",
        dropdownMenu: "my-custom-dropdown-menu",
        dropdownItem: "my-custom-dropdown-item",
      }}
    />
  );
};

export default MyTablePage;
```

- Use Custom Rows

  If you want to customize the appearance of the table rows, you can pass a custom renderRow function to the TableComponent. This allows you to fully control the rendering of each row.

```tsx
"use client";
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css"; // Import default styles

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const data: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  // ... more data
];

const columns = ["Name", "Email", "Role", "Status"];

const MyTablePage: React.FC = () => {
  const handleEdit = (item: User) => {
    console.log("Edit", item);
  };

  const handleDelete = (item: User) => {
    console.log("Delete", item);
  };

  const renderCustomRow = (item: User, index: number) => {
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {item.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          <a
            href={`mailto:${item.email}`}
            className="text-blue-500 hover:underline"
          >
            {item.email}
          </a>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {item.role}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              item.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.status}
          </span>
        </td>
      </>
    );
  };

  return (
    <TableComponent<User>
      columns={columns}
      data={data}
      props={["name", "email", "role", "status"] as const}
      loading={false}
      renderRow={renderCustomRow}
    />
  );
};

export default MyTablePage;
```

## Pagination

The `TableComponent` includes built-in pagination support. You can enable pagination by setting the enablePagination prop to true and providing the current page, a setPage function, and optionally the number of items per page via itemsPerPage.

| Prop               | Type                     | Required | Description                                  |
| ------------------ | ------------------------ | -------- | -------------------------------------------- |
| `enablePagination` | `boolean`                | Yes      | Enable pagination.                           |
| `page`             | `number`                 | Yes      | The current page number.                     |
| `setPage`          | `(page: number) => void` | Yes      | Function to set the current page.            |
| `totalPages`     | `number`                 | No       | The total number of pages. |

## Props

## TableComponent

| Prop                   | Type                                          | Required | Description                                                                                   |
| ---------------------- | --------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `columns`              | `string[]`                                    | Yes      | An array of column headers to display.                                                        |
| `data`                 | `T[]`                                         | Yes      | An array of data objects to display in the table.                                             |
| `props`                | `ReadonlyArray<keyof T>`                      | Yes      | The keys from data objects corresponding to each column.                                      |
| `actions`              | `boolean`                                     | No       | Whether to display action buttons.                                                            |
| `actionTexts`          | `string[]`                                    | No       | Labels for the action buttons.                                                                |
| `actionFunctions`      | `Array<(item: T) => void>`                    | No       | Functions to handle action button clicks.                                                     |
| `loading`              | `boolean`                                     | No       | Displays a skeleton loader when `true`.                                                       |
| `searchValue`          | `string`                                      | No       | Current search query, used in the no content message.                                         |
| `disableDefaultStyles` | `boolean`                                     | No       | When set to `true`, disables the default Tailwind CSS styles applied to the table components. |
| `customClassNames`     | `object`                                      | No       | An object containing custom class names for various elements of the table.                    |
| `renderRow`            | `(item: T, index: number) => React.ReactNode` | No       | Custom function to render table rows.                                                         |
| `rowOnClick`           | `(item: T) => void`                           | No       | Function triggered when a row is clicked.                                                     |
| `paginationComponent`  | `React.ReactNode`                             | No       | A custom pagination component to display below the table.                                     |
| `enableDarkMode`       | `boolean`                                     | No       | Enables dark mode styles.                                                                     |

## `customClassNames` Object Keys

| Key            | Description                                          |
| -------------- | ---------------------------------------------------- |
| `container`    | Class for the outer container `<div>`.               |
| `table`        | Class for the `<table>` element.                     |
| `thead`        | Class for the `<thead>` element.                     |
| `th`           | Class for the `<th>` elements.                       |
| `tr`           | Class for the `<tr>` elements.                       |
| `td`           | Class for the `<td>` elements.                       |
| `actionTd`     | Class for the `<td>` containing the action dropdown. |
| `actionButton` | Class for the action button.                         |
| `actionSvg`    | Class for the SVG icon in the action button.         |
| `dropdownMenu` | Class for the dropdown menu container.               |
| `dropdownItem` | Class for each item in the dropdown menu.            |

## Components

## ActionDropdown

A component that renders a dropdown menu with action buttons for each row.

### Props

| Prop                   | Type                       | Required | Description                                         |
| ---------------------- | -------------------------- | -------- | --------------------------------------------------- |
| `item`                 | `T`                        | Yes      | The data item associated with the row.              |
| `index`                | `number`                   | Yes      | The index of the row.                               |
| `actionTexts`          | `string[]`                 | Yes      | An array of labels for the action buttons.          |
| `actionFunctions`      | `Array<(item: T) => void>` | Yes      | An array of functions corresponding to each action. |
| `disableDefaultStyles` | `boolean`                  | No       | Boolean to disable default styles.                  |
| `customClassNames`     | `object`                   | No       | Custom class names for styling.                     |
| `enableDarkMode`       | `boolean`                  | No       | Enables dark mode styles.                           |

### `customClassNames` Object Keys (Optional)

| Key            | Description                                  |
| -------------- | -------------------------------------------- |
| `actionButton` | Class for the action button.                 |
| `dropdownMenu` | Class for the dropdown menu container.       |
| `dropdownItem` | Class for each item in the dropdown menu.    |
| `actionSvg`    | Class for the SVG icon in the action button. |

---

## TableSkeleton

Displays a skeleton loader while the table data is loading.

### Props

| Prop                   | Type      | Required | Description                        |
| ---------------------- | --------- | -------- | ---------------------------------- |
| `disableDefaultStyles` | `boolean` | No       | Boolean to disable default styles. |
| `customClassNames`     | `object`  | No       | Custom class names for styling.    |

### `customClassNames` Object Keys (Optional)

| Key         | Description                              |
| ----------- | ---------------------------------------- |
| `container` | Class for the skeleton loader container. |
| `row`       | Class for the individual skeleton rows.  |

---

## NoContentComponent

Shows a message when there are no items to display in the table.

### Props

| Prop   | Type     | Required | Description                                             |
| ------ | -------- | -------- | ------------------------------------------------------- |
| `name` | `string` | No       | The name of the content type, e.g., "items" or "users". |

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
