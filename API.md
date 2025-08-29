# 📚 API Reference

Comprehensive API documentation for the nextjs-reusable-table component.

## Table of Contents
- [Components](#components)
- [TableComponent Props](#tablecomponent-props)
- [Type Definitions](#type-definitions)
- [Utility Functions](#utility-functions)
- [CSS Classes](#css-classes)

## Components

### TableComponent\<T\>

The main table component that renders your data with all the features.

```tsx
import { TableComponent } from "nextjs-reusable-table";

<TableComponent<YourDataType>
  columns={string[]}
  data={YourDataType[]}
  props={ReadonlyArray<keyof YourDataType>}
  // ... other props
/>
```

### ActionDropdown\<T\>

The dropdown component for row actions. Usually used internally but can be used standalone.

```tsx
import { ActionDropdown } from "nextjs-reusable-table";

<ActionDropdown<YourDataType>
  item={dataItem}
  index={0}
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[editFn, deleteFn]}
/>
```

### TableSkeleton

Loading skeleton component. Used internally but can be used standalone.

```tsx
import { TableSkeleton } from "nextjs-reusable-table";

<TableSkeleton />
```

### NoContentComponent

Empty state component. Used internally but can be used standalone.

```tsx
import { NoContentComponent } from "nextjs-reusable-table";

<NoContentComponent 
  text="No data found"
  icon={<YourIcon />}
/>
```

## TableComponent Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `string[]` | Array of column header names |
| `data` | `T[]` | Array of data objects to display |
| `props` | `ReadonlyArray<keyof T>` | Array of object property keys to display |

### Optional Props

#### Data & Display

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Show loading skeleton |
| `searchValue` | `string` | `undefined` | Filter rows by this search term |
| `noContentProps` | `NoContentProps` | `{}` | Customize empty state |
| `formatValue` | `(value: string, prop: string, item: T) => React.ReactNode` | `undefined` | Custom cell formatter |
| `formatHeader` | `(header: string, prop: string, index: number) => React.ReactNode` | `undefined` | Custom header formatter |
| `renderRow` | `(item: T, index: number) => React.ReactNode` | `undefined` | Completely custom row rendering |

#### Interactions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowOnClick` | `(item: T) => void` | `undefined` | Callback when row is clicked |
| `actions` | `boolean` | `false` | Enable action dropdown |
| `actionTexts` | `string[]` | `[]` | Labels for dropdown actions |
| `actionFunctions` | `Array<(item: T) => void>` | `[]` | Handlers for dropdown actions |

#### Sorting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortableProps` | `Array<keyof T>` | `[]` | Columns that can be sorted |
| `onSort` | `(prop: keyof T) => void` | `undefined` | Callback when sort is triggered |

#### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enablePagination` | `boolean` | `false` | Enable pagination controls |
| `page` | `number` | `1` | Current page (1-indexed) |
| `setPage` | `(page: number) => void` | `undefined` | Page setter callback |
| `itemsPerPage` | `number` | `10` | Number of items per page |
| `totalPages` | `number` | `undefined` | Override total pages calculation |
| `renderPagination` | `(props: PaginationRenderProps) => React.ReactNode` | `undefined` | Custom pagination renderer function |
| `maxHeight` | `string \| number` | `"600px"` | Maximum height of the table container |

#### PaginationRenderProps

```typescript
interface PaginationRenderProps {
  page: number;                    // Current page number
  setPage: (page: number) => void; // Function to change page
  totalPages: number;              // Total pages (from props or calculated)
  calculatedTotalPages: number;    // Pages calculated from data length
  itemsPerPage: number;           // Items per page
}
```

**Note:** Pagination positioning is fully customizable via the `customClassNames.pagination.container` property. You can position pagination at the top, bottom, left, right, or use fixed positioning. For complete custom pagination implementations, use the `renderPagination` prop. See the examples in the [EXAMPLES.md](EXAMPLES.md#custom-pagination-positioning) file for detailed usage patterns.

#### Styling & Theming

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableDarkMode` | `boolean` | `true` | Respect system dark mode |
| `disableDefaultStyles` | `boolean` | `false` | Disable built-in styling |
| `customClassNames` | `CustomClassNames` | `{}` | Override CSS classes |
| `showRemoveColumns` | `boolean` | `false` | Enable column visibility controls |

## Type Definitions

### TableProps\<T\>

```typescript
interface TableProps<T> {
  // Required
  columns: string[];
  data: T[];
  props: ReadonlyArray<keyof T>;
  
  // Optional
  actions?: boolean;
  actionTexts?: string[];
  actionFunctions?: Array<(item: T) => void>;
  loading?: boolean;
  searchValue?: string;
  rowOnClick?: (item: T) => void;
  enableDarkMode?: boolean;
  enablePagination?: boolean;
  page?: number;
  setPage?: (page: number) => void;
  itemsPerPage?: number;
  totalPages?: number;
  sortableProps?: Array<keyof T>;
  formatValue?: (value: string, prop: string, item: T) => React.ReactNode;
  formatHeader?: (header: string, prop: string, index: number) => React.ReactNode;
  noContentProps?: NoContentProps;
  showRemoveColumns?: boolean;
  onSort?: (prop: keyof T) => void;
  disableDefaultStyles?: boolean;
  customClassNames?: CustomClassNames;
  renderRow?: (item: T, index: number) => React.ReactNode;
}
```

### CustomClassNames

```typescript
interface CustomClassNames {
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
}
```

### NoContentProps

```typescript
interface NoContentProps {
  text?: string;
  icon?: React.ReactNode;
  name?: string; // For accessibility
}
```

### ActionDropdownProps\<T\>

```typescript
interface ActionDropdownProps<T> {
  item: T;
  index: number;
  actionTexts: string[];
  actionFunctions: Array<(item: T) => void>;
  disableDefaultStyles?: boolean;
  customClassNames?: {
    actionTd?: string;
    actionButton?: string;
    actionSvg?: string;
    dropdownMenu?: string;
    dropdownItem?: string;
  };
  enableDarkMode?: boolean;
}
```

### TableSkeletonProps

```typescript
interface TableSkeletonProps {
  disableDefaultStyles?: boolean;
  customClassNames?: {
    container?: string;
    table?: string;
    th?: string;
    tr?: string;
    td?: string;
  };
  enableDarkMode?: boolean;
}
```

### PaginationComponentProps

```typescript
interface PaginationComponentProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  disableDefaultStyles?: boolean;
  customClassNames?: {
    container?: string;
    button?: string;
    buttonDisabled?: string;
    pageInfo?: string;
  };
  enableDarkMode?: boolean;
}
```

## Utility Functions

### formatDate

```typescript
formatDate(date: Date, includeTime?: boolean): string
```

Formats a Date object into a human-readable string.

**Parameters:**
- `date` - The Date object to format
- `includeTime` - Whether to include time information (default: false)

**Returns:** Formatted date string (e.g., "Mar 15, 2024" or "Mar 15, 2024, 2:30 PM")

**Example:**
```typescript
import { formatDate } from "nextjs-reusable-table";

const date = new Date("2024-03-15T14:30:00Z");
formatDate(date); // "Mar 15, 2024"
formatDate(date, true); // "Mar 15, 2024, 2:30 PM"
```

### isDateString

```typescript
isDateString(str: string): boolean
```

Checks if a string represents a valid date.

**Parameters:**
- `str` - The string to test

**Returns:** true if the string is a valid date, false otherwise

**Example:**
```typescript
import { isDateString } from "nextjs-reusable-table";

isDateString("2024-03-15T14:30:00Z"); // true
isDateString("invalid date"); // false
isDateString("March 15, 2024"); // true
```

### trimText

```typescript
trimText(text: string, maxLength: number): string
```

Trims text to a maximum length and adds ellipsis if needed.

**Parameters:**
- `text` - The text to trim
- `maxLength` - Maximum length before trimming

**Returns:** Trimmed text with "..." appended if truncated

**Example:**
```typescript
import { trimText } from "nextjs-reusable-table";

trimText("This is a very long text", 10); // "This is a ..."
trimText("Short", 10); // "Short"
```

## CSS Classes

### Default CSS Classes

The component uses these default Tailwind classes:

#### Table Structure
```css
.table-container: "pb-6" (with max-height: 600px, overflow: auto)
.table: "w-full divide-y bg-white text-gray-900 divide-gray-200"
.thead: "bg-gray-50 text-gray-500" (light) / "bg-gray-700 text-gray-300" (dark)
.tbody: "divide-y divide-gray-200" (light) / "divide-gray-700" (dark)
.th: "px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider"
.tr: Alternating "bg-white" / "bg-gray-100" (light) or "bg-gray-800" / "bg-gray-700" (dark)
.td: "px-2 py-2 sm:px-4 sm:py-2 text-sm text-gray-700" (light) / "text-gray-300" (dark)
```

#### Interactive Elements
```css
.action-button: "focus:outline-none text-gray-700 hover:text-gray-900"
.dropdown-menu: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
.dropdown-item: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
```

#### Pagination
```css
.pagination-container: "flex justify-center items-center mt-4"
.pagination-button: "px-3 py-1 mx-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 border"
.pagination-button-disabled: "opacity-50 cursor-not-allowed"
.pagination-info: "px-3 py-1 mx-1 text-sm text-gray-700"
```

### Custom Class Override Examples

#### Professional Theme
```typescript
const professionalTheme = {
  table: "w-full border-collapse bg-white shadow-sm",
  thead: "bg-gray-800 text-white",
  th: "px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-gray-200",
  tr: "border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150",
  td: "px-6 py-4 text-sm text-gray-900",
  pagination: {
    container: "flex justify-between items-center mt-6 px-6 py-4 bg-gray-50 border-t border-gray-200",
    button: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
    buttonDisabled: "px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed",
  }
};
```

#### Colorful Theme
```typescript
const colorfulTheme = {
  table: "w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden shadow-2xl",
  thead: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
  th: "px-6 py-4 text-left text-sm font-bold uppercase tracking-wider",
  tr: "hover:bg-purple-100 transition-all duration-200 border-b border-purple-200",
  td: "px-6 py-4 text-sm text-gray-800",
  pagination: {
    container: "flex justify-center items-center mt-6 space-x-2",
    button: "px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md",
    buttonDisabled: "px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed",
  }
};
```

#### Minimal Theme
```typescript
const minimalTheme = {
  table: "w-full",
  thead: "",
  th: "pb-3 text-left text-sm font-semibold text-gray-900 border-b-2 border-gray-200",
  tr: "border-b border-gray-100",
  td: "py-4 text-sm text-gray-700",
  pagination: {
    container: "flex justify-center items-center mt-8 space-x-1",
    button: "w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors",
    buttonDisabled: "w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-400 cursor-not-allowed rounded-md",
  }
};
```

## Performance Considerations

### Optimization Tips

1. **Memoize formatValue and formatHeader functions**:
```typescript
const formatValue = useCallback((value: string, prop: string, item: T) => {
  // Your formatting logic
}, []);

const formatHeader = useCallback((header: string, prop: string, index: number) => {
  // Your formatting logic
}, []);
```

2. **Use React.memo for custom components in formatValue**:
```typescript
const CustomCell = React.memo(({ value, item }) => {
  return <div>{/* Your custom rendering */}</div>;
});
```

3. **Optimize large datasets with pagination**:
```typescript
// For large datasets, always enable pagination
<TableComponent
  enablePagination
  itemsPerPage={25} // Reasonable page size
  // ... other props
/>
```

4. **Debounce search input**:
```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash'; // or your preferred debounce

const debouncedSearch = useMemo(
  () => debounce((term: string) => setSearchTerm(term), 300),
  []
);
```

### Bundle Size Optimization

- **Tree shaking**: Import only what you need
```typescript
// Good - tree-shakable
import { TableComponent } from "nextjs-reusable-table";

// Also good - specific imports
import { TableComponent, formatDate } from "nextjs-reusable-table";
```

- **CSS optimization**: Only import CSS if you're using default styles
```typescript
// Only include if using default styles
import "nextjs-reusable-table/dist/index.css";
```

### Memory Management

The component automatically handles:
- Event listener cleanup
- Portal cleanup for dropdowns
- State cleanup on unmount

For optimal performance with frequently changing data:
- Use stable object references when possible
- Implement proper key props for dynamic lists
- Consider virtualization for very large datasets (>1000 items)
