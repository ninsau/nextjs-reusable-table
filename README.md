# nextjs-reusable-table

A highly customizable, TypeScript-ready, and production-grade table component for Next.js applications. Built with performance, flexibility, and developer experience in mind.

## Basic Example

```tsx
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
    />
  );
};
```

## Installation

```bash
npm install nextjs-reusable-table
# or
yarn add nextjs-reusable-table
# or
pnpm add nextjs-reusable-table
```

## Prerequisites

- Next.js 12 or later
- React 16 or later
- React DOM 16 or later
- Tailwind CSS (optional, for default styling)
- TypeScript (recommended)

## Key Features

- 🎯 **TypeScript First**: Built with TypeScript for robust type safety and developer experience
- 🌐 **Next.js Ready**: Optimized for Next.js with SSR/ISR compatibility
- 🎨 **Fully Customizable**: Override any styling using Tailwind CSS or your own classes
- 🌓 **Dark Mode Support**: Automatic dark mode detection and styling
- 📱 **Responsive**: Works seamlessly across all device sizes
- 🔍 **Search & Filter**: Built-in search functionality with custom filtering
- ⚡ **Performance Optimized**: Efficient rendering even with large datasets
- 📊 **Data Export**: Export to CSV, Excel, or PDF formats
- 🎯 **Action Dropdowns**: Customizable action menus for each row
- 🔄 **Sorting**: Sort by any column with custom sort functions
- 📑 **Pagination**: Built-in pagination with customizable controls
- 🎯 **Multi-select**: Select multiple rows with checkboxes
- 📌 **Sticky Headers & Columns**: Keep important information visible
- 📐 **Resizable Columns**: Adjust column widths dynamically
- 📊 **Aggregates**: Calculate totals, averages, and custom aggregations
- ✏️ **Cell Editing**: Edit cell contents inline with validation
- 🎨 **Custom Styling**: Override default styles with your own
- 💀 **Loading Skeletons**: Beautiful loading states
- 🚫 **No Content States**: Customizable empty states
- 📏 **Column Resizing**: Resize columns dynamically
- 📎 **Row Groups**: Group rows with custom headers
- 🎚️ **Column Visibility**: Toggle column visibility
- 🔒 **Fixed Layout**: Option for fixed-width columns
- 🖱️ **Row Click Handling**: Custom click handlers for rows
- 📋 **Copy to Clipboard**: Easy data copying functionality

## Props API

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

| Prop                 | Type             | Default | Description                      |
| -------------------- | ---------------- | ------- | -------------------------------- |
| disableDefaultStyles | boolean          | false   | Disable built-in Tailwind styles |
| customClassNames     | CustomClassNames | {}      | Custom class names object        |
| enableDarkMode       | boolean          | true    | Enable dark mode support         |
| stickyHeader         | boolean          | false   | Make header stick to top         |
| stickyColumns        | StickyColumns    | -       | Make columns stick to sides      |

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

### Action Props

| Prop            | Type                     | Required        | Description          |
| --------------- | ------------------------ | --------------- | -------------------- |
| actions         | boolean                  | No              | Show action dropdown |
| actionTexts     | string[]                 | If actions=true | Action button texts  |
| actionFunctions | Array<(item: T) => void> | If actions=true | Action handlers      |

### Export Props

| Prop          | Type                | Default | Description                 |
| ------------- | ------------------- | ------- | --------------------------- |
| exportOptions | ExportOptions       | -       | Configure export options    |
| aggregates    | AggregateOptions<T> | -       | Configure column aggregates |

### Formatting Props

| Prop        | Type                                                                | Description            |
| ----------- | ------------------------------------------------------------------- | ---------------------- |
| formatValue | (value: string, prop: string, item: T) => React.ReactNode           | Format cell values     |
| formatCell  | (value: string, prop: string, item: T, index: number) => CellFormat | Custom cell formatting |

## Advanced Usage Examples

### With Actions and Custom Formatting

```tsx
const MyTableWithActions = () => {
  const handleEdit = (item: User) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item: User) => {
    console.log("Delete:", item);
  };

  const formatValue = (value: string, prop: string) => {
    switch (prop) {
      case "balance":
        return `$${Number(value).toFixed(2)}`;
      case "email":
        return <a href={`mailto:${value}`}>{value}</a>;
      default:
        return value;
    }
  };

  return (
    <TableComponent<User>
      columns={["Name", "Email", "Balance", "Actions"]}
      data={data}
      props={["name", "email", "balance"]}
      actions={true}
      actionTexts={["Edit", "Delete"]}
      actionFunctions={[handleEdit, handleDelete]}
      formatValue={formatValue}
      sortableProps={["name", "balance"]}
    />
  );
};
```

### With Custom Styling

```tsx
<TableComponent<User>
  columns={columns}
  data={data}
  props={props}
  customClassNames={{
    table: "shadow-lg border-2 border-gray-200",
    th: "bg-blue-50 text-blue-900 font-semibold",
    td: "px-4 py-2 border-b",
    actionButton: "text-blue-600 hover:text-blue-800",
    pagination: {
      container: "mt-4 flex justify-center",
      button: "px-3 py-1 rounded-md bg-blue-500 text-white",
      buttonDisabled: "opacity-50 cursor-not-allowed",
    },
  }}
/>
```

### With Aggregates

```tsx
<TableComponent<Transaction>
  columns={["Date", "Description", "Amount"]}
  data={transactions}
  props={["date", "description", "amount"]}
  aggregates={{
    amount: {
      type: "sum",
      customFn: (values) => values.reduce((sum, val) => sum + Number(val), 0),
    },
  }}
  formatValue={(value, prop) =>
    prop === "amount" ? `$${Number(value).toFixed(2)}` : value
  }
/>
```

### With Row Grouping

```tsx
<TableComponent<Invoice>
  columns={["Date", "Amount", "Status"]}
  data={invoices}
  props={["date", "amount", "status"]}
  groupBy="status"
  groupRenderer={(status, items) => (
    <div className="font-bold bg-gray-100 p-2">
      {status} ({items.length} invoices)
    </div>
  )}
/>
```

### With Multi-select and Batch Actions

```tsx
const MyTableWithMultiSelect = () => {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const handleSelectionChange = (selected: User[]) => {
    setSelectedRows(selected);
  };

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4">
          Selected: {selectedRows.length} users
          <button onClick={() => handleBatchAction(selectedRows)}>
            Batch Action
          </button>
        </div>
      )}
      <TableComponent<User>
        columns={columns}
        data={data}
        props={props}
        multiSelect={true}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};
```

## Performance Optimization

The table component is optimized for performance in several ways:

1. Virtual scrolling for large datasets
2. Memoized row rendering
3. Efficient sorting and filtering algorithms
4. Lazy loading of action dropdowns
5. Optimized re-renders using React.memo

For best performance with large datasets:

```tsx
<TableComponent<User>
  columns={columns}
  data={largeDataset}
  props={props}
  maxHeight="600px"
  itemsPerPage={50}
  enablePagination={true}
/>
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
