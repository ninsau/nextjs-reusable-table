# Nextjs Reusable Table

A highly customizable and reusable table component for Next.js and React applications, built with TypeScript and Tailwind CSS. It includes features like dynamic columns, pagination, dark mode, custom styling, search filtering, and more. It also supports accessibility improvements such as keyboard navigation and custom formatting for data values.

<!-- ## See the [Examples](https://nextjs-reusables.vercel.app/tables) -->

## Key Features

- **Dynamic columns**: Easily pass columns and props to control what data is displayed.
- **Automatic pagination**: Enable pagination, control page, and items per page. Includes a dropdown to select items per page.
- **Search filtering**: Pass a `searchValue` to filter rows by any property.
- **Dark mode support**: Automatically detects system preference and adjusts styling.
- **Customizable styles**: Use Tailwind classes or disable default styles and pass your own custom classes.
- **Action dropdowns**: Add action buttons to each row, enabling operations like "Delete" or "View" inline.
- **Skeleton loading states**: Show a skeleton when loading data.
- **No-content state handling**: Displays a customizable message or component when there's no data.
- **Accessibility improvements**: Navigate rows using the keyboard, improved focus states.
- **Server-side pagination support**: Trigger fetching logic on page changes.
- **Custom value formatting**: Provide a `valueFormatter` for custom display logic of cell data.

## Installation

```bash
npm install nextjs-reusable-table
```

or

```bash
yarn add nextjs-reusable-table
```

## BASIC USAGE

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Created"];
const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-12-11T12:30:00Z",
  },
];

export default function MyTablePage() {
  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email", "createdAt"]}
    />
  );
}
```

## SEARCHING

```tsx
import React, { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Created"];
const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-12-11T12:30:00Z",
  },
];

export default function SearchableTable() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <TableComponent
        columns={columns}
        data={data}
        props={["name", "email", "createdAt"]}
        searchValue={searchValue}
      />
    </>
  );
}
```

## PAGINATION

```tsx
import React, { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Created"];
const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-12-11T12:30:00Z",
  },
  {
    name: "Bob Lee",
    email: "bob@example.com",
    createdAt: "2024-12-12T14:00:00Z",
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    createdAt: "2024-12-13T16:45:00Z",
  },
];

export default function PaginatedTable() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email", "createdAt"]}
      enablePagination={true}
      page={page}
      setPage={setPage}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      itemsPerPageOptions={[2, 5, 10]}
    />
  );
}
```

## ACTION DROPDOWNS

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Actions"];
const data = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
];

function deleteUser(item) {
  console.log("Delete", item);
}

function viewProfile(item) {
  console.log("View Profile", item);
}

export default function ActionTable() {
  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email"]}
      actions={true}
      actionTexts={["Delete", "View"]}
      actionFunctions={[deleteUser, viewProfile]}
    />
  );
}
```

## DARK MODE

Dark mode is automatically detected if enableDarkMode is set to true.

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Created"];
const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-12-11T12:30:00Z",
  },
];

export default function DarkModeTable() {
  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email", "createdAt"]}
      enableDarkMode={true}
    />
  );
}
```

## CUSTOM STYLES

Disable default Tailwind styles and provide your own classes by setting disableDefaultStyles to true and passing customClassNames.

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email", "Created"];
const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-12-11T12:30:00Z",
  },
];

export default function CustomStyledTable() {
  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email", "createdAt"]}
      disableDefaultStyles={true}
      customClassNames={{
        table: "my-custom-table",
        th: "my-custom-th",
        td: "my-custom-td",
      }}
    />
  );
}
```

## LOADING STATES

Show a skeleton when loading = true:

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

export default function LoadingTable() {
  return (
    <TableComponent
      columns={["Name", "Email", "Created"]}
      data={[]}
      props={["name", "email", "createdAt"]}
      loading={true}
    />
  );
}
```

## NO-CONTENT STATE

Customize the no-content message or replace it with a custom component:

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

export default function EmptyTable() {
  return (
    <TableComponent
      columns={["Name", "Email", "Created"]}
      data={[]}
      props={["name", "email", "createdAt"]}
      noContentProps={{
        text: "No users available at the moment.",
        icon: <span>No Data Icon</span>,
      }}
    />
  );
}
```

## VALUE FORMATTING

Use valueFormatter to format cell data (e.g., currency formatting, date formatting, etc.):

```tsx
import React from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Balance"];
const data = [
  { name: "John Doe", balance: 1234.56 },
  { name: "Jane Smith", balance: 890.12 },
];

function formatValue(value, prop, item) {
  if (prop === "balance") {
    return `$${parseFloat(value).toFixed(2)}`;
  }
  return value;
}

export default function FormattedTable() {
  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "balance"]}
      valueFormatter={formatValue}
    />
  );
}
```

## SERVER-SIDE PAGINATION

If you want full control of data fetching on page changes, set enableServerSidePagination = true and use onPageChange to trigger data fetching:

```tsx
import React, { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

const columns = ["Name", "Email"];
// Initially empty, fetched externally
const initialData = [];

export default function ServerSideTable() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(initialData);

  // Fetch data whenever page changes
  const onPageChange = async (newPage) => {
    // Fetch from your API
    const newData = await fetch(`/api/users?page=${newPage}`).then((res) =>
      res.json()
    );
    setData(newData.items);
  };

  return (
    <TableComponent
      columns={columns}
      data={data}
      props={["name", "email"]}
      enablePagination={true}
      enableServerSidePagination={true}
      page={page}
      setPage={setPage}
      onPageChange={onPageChange}
    />
  );
}
```

## Props

## Props

| Prop                           | Type                                                                      | Default             | Description                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **columns**                    | `string[]`                                                                | -                   | An array of column headers to display.                                                                                                                                  |
| **data**                       | `T[]`                                                                     | -                   | The data array that feeds the table. Each item corresponds to one row in the table.                                                                                     |
| **props**                      | `ReadonlyArray<keyof T>`                                                  | -                   | An array of property keys that determine which data values to display in each row. Must correspond to fields on each data item.                                         |
| **actions**                    | `boolean`                                                                 | `false`             | When true, adds an actions column and renders action buttons (defined by `actionTexts` and `actionFunctions`) in each row.                                              |
| **actionTexts**                | `string[]`                                                                | -                   | An array of text labels for the actions. Used in the actions dropdown. Must be used with `actions` set to true.                                                         |
| **actionFunctions**            | `Array<(item: T) => void>`                                                | -                   | An array of functions, each corresponding to an action in `actionTexts`. Each function is called with the row item when the action is selected.                         |
| **loading**                    | `boolean`                                                                 | `false`             | If true, displays a skeleton loading state instead of table data.                                                                                                       |
| **searchValue**                | `string`                                                                  | `""`                | Filter rows by matching this string against their specified props.                                                                                                      |
| **disableDefaultStyles**       | `boolean`                                                                 | `false`             | If true, disables the default Tailwind-based styling. Use in conjunction with `customClassNames` for full control.                                                      |
| **customClassNames**           | `object` (see types)                                                      | `{}`                | An object containing class names to override default styling. You can define classes for table elements (thead, tbody, th, tr, td), actions, dropdowns, and pagination. |
| **renderRow**                  | `(item: T, index: number) => React.ReactNode`                             | -                   | A custom row rendering function. If provided, the row is rendered entirely by this function instead of using the default `props` mapping.                               |
| **rowOnClick**                 | `(item: T) => void`                                                       | -                   | A function that is called when a row is clicked. Makes rows clickable and accessible by keyboard (Enter/Space triggers this as well).                                   |
| **enableDarkMode**             | `boolean`                                                                 | `true`              | If true, attempts to detect dark mode preference and adjust styling accordingly.                                                                                        |
| **enablePagination**           | `boolean`                                                                 | `false`             | If true, enables pagination controls below the table. Requires `page` and `setPage` to function, and optionally `itemsPerPage`, `totalPages`, etc.                      |
| **page**                       | `number`                                                                  | `1`                 | The current page number (1-indexed). Required if `enablePagination` is true.                                                                                            |
| **setPage**                    | `(page: number) => void`                                                  | -                   | A function to update the current page. Required if `enablePagination` is true.                                                                                          |
| **itemsPerPage**               | `number`                                                                  | `10`                | How many items to show per page. If `enablePagination` is true, this controls pagination slicing.                                                                       |
| **totalPages**                 | `number`                                                                  | Computed internally | The total number of pages. If not provided, it's computed from `data.length / itemsPerPage`. If provided, it can be used to handle server-side pagination.              |
| **itemsPerPageOptions**        | `number[]`                                                                | -                   | An array of options for items per page. Displays a dropdown in pagination controls to change `itemsPerPage`.                                                            |
| **setItemsPerPage**            | `(itemsPerPage: number) => void`                                          | -                   | A function that updates the items per page selection. Used together with `itemsPerPageOptions`.                                                                         |
| **noContentProps**             | `{ text?: string; icon?: React.ReactNode; component?: React.ReactNode; }` | `{}`                | Customize the no-content state. `text` overrides the default message, `icon` sets a custom icon, and `component` can fully replace the entire no-content component.     |
| **valueFormatter**             | `(value: any, prop: keyof T, item: T) => React.ReactNode`                 | -                   | A custom formatter for cell values. Use this to format dates, numbers, currency, or other data before rendering.                                                        |
| **enableServerSidePagination** | `boolean`                                                                 | `false`             | If true, pagination does not slice data locally. Instead, `onPageChange` is called so you can fetch new data from a server or external source.                          |
| **onPageChange**               | `(page: number) => void`                                                  | -                   | A callback that is triggered whenever the page changes, allowing you to fetch new data when `enableServerSidePagination` is true.                                       |

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
