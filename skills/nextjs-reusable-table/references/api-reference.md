# nextjs-reusable-table — Full API Reference

## TableProps\<T\>

```ts
interface TableProps<T> {
  // Required
  columns: string[];
  data: T[];
  props: ReadonlyArray<keyof T>;

  // Data features
  searchValue?: string;
  sortableProps?: Array<keyof T>;
  onSort?: (prop: keyof T) => void;
  formatValue?: (value: string, prop: string, item: T) => React.ReactNode;
  formatHeader?: (header: string, prop: string, index: number) => React.ReactNode;
  renderRow?: (item: T, index: number) => React.ReactNode;
  rowOnClick?: (item: T) => void;

  // Actions
  actions?: boolean;
  actionTexts?: string[];
  actionFunctions?: Array<(item: T) => void>;

  // Loading / empty
  loading?: boolean;
  noContentProps?: { text?: string; icon?: React.ReactNode; name?: string };

  // Pagination
  enablePagination?: boolean;
  page?: number;                         // default: 1
  setPage?: (page: number) => void;
  itemsPerPage?: number;                 // default: 10
  totalPages?: number;                   // for server-side pagination
  renderPagination?: (props: {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    calculatedTotalPages: number;
    itemsPerPage: number;
  }) => React.ReactNode;

  // Layout
  maxHeight?: string | number;           // default: "600px"
  scrollBehavior?: "auto" | "scroll" | "visible" | "hidden";  // default: "auto"
  tableLayout?: "auto" | "fixed" | "inherit";
  showRemoveColumns?: boolean;

  // Theme
  enableDarkMode?: boolean;              // default: true

  // Cell expansion
  cellExpansion?: {
    enabled?: boolean;                   // default: true
    maxWidth?: string | number;          // default: 200
    behavior?: "truncate" | "wrap" | "expand";  // default: "truncate"
  };

  // Accessibility
  accessibility?: {
    focusStyles?: string;
    keyboardNavigation?: boolean;        // default: true
    screenReaderLabels?: {
      actions?: string;
      pagination?: string;
      loading?: string;
    };
  };

  // Styling
  disableDefaultStyles?: boolean;
  customStyles?: {
    container?: React.CSSProperties;
    table?: React.CSSProperties;
    scrollContainer?: React.CSSProperties;
    loading?: React.CSSProperties;
  };
  customClassNames?: {
    container?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    th?: string;
    tr?: string;
    td?: string;
    scrollContainer?: string;
    loadingContainer?: string;
    loadingSkeleton?: {
      container?: string;
      skeletonBar?: string;
      skeletonItem?: string;
    };
    cellExpansion?: { container?: string };
    interactive?: {
      sortableCursor?: string;
      clickableCursor?: string;
      focusOutline?: string;
    };
    actionTd?: string;
    actionButton?: string;
    actionSvg?: string;
    actionDropdown?: {
      container?: string;
      menu?: string;
      item?: string;
      overlay?: string;
    };
    // Legacy aliases
    dropdownMenu?: string;
    dropdownItem?: string;
    pagination?: {
      container?: string;
      button?: string;
      buttonDisabled?: string;
      pageInfo?: string;
      navigation?: { first?: string; previous?: string; next?: string; last?: string };
    };
    layout?: {
      tableMargin?: string;
      tablePadding?: string;
      containerPadding?: string;
    };
    responsive?: { mobile?: string; tablet?: string; desktop?: string };
    theme?: {
      colorScheme?: string;
      spacing?: string;
      typography?: string;
      borderRadius?: string;
      shadows?: string;
    };
  };
}
```

## ActionDropdownProps\<T\>

```ts
interface ActionDropdownProps<T> {
  item: T;
  index: number;
  actionTexts: string[];
  actionFunctions: Array<(item: T) => void>;
  disableDefaultStyles?: boolean;
  enableDarkMode?: boolean;
  customClassNames?: {
    actionTd?: string;
    actionButton?: string;
    actionSvg?: string;
    actionDropdown?: { container?: string; menu?: string; item?: string; overlay?: string };
    dropdownMenu?: string;   // legacy
    dropdownItem?: string;   // legacy
  };
}
```

## PaginationComponentProps

```ts
interface PaginationComponentProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  disableDefaultStyles?: boolean;
  enableDarkMode?: boolean;
  customClassNames?: {
    container?: string;
    button?: string;
    buttonDisabled?: string;
    pageInfo?: string;
    navigation?: { first?: string; previous?: string; next?: string; last?: string };
  };
}
```

## TableSkeletonProps

```ts
interface TableSkeletonProps {
  disableDefaultStyles?: boolean;
  enableDarkMode?: boolean;
  customClassNames?: {
    container?: string;
    table?: string;
    th?: string;
    tr?: string;
    td?: string;
  };
}
```

## NoContentProps

```ts
interface NoContentProps {
  text?: string;
  icon?: React.ReactNode;
  name?: string;
}
```

## Utility Functions

```ts
// Format a Date object to a human-readable string
formatDate(date: Date, includeTime?: boolean): string
// Examples:
formatDate(new Date("2024-03-08"))         // "Mar 8, 2024"
formatDate(new Date("2024-03-08"), true)   // "Mar 8, 2024, 09:30 AM"

// Detect whether a string value looks like a date
isDateString(str: string): boolean
// Examples:
isDateString("2024-01-15")       // true
isDateString("hello world")      // false

// Truncate a string to maxLength, appending "..."
trimText(text: string, maxLength: number): string
// Examples:
trimText("Hello World", 5)       // "Hello..."
trimText("Hi", 5)                // "Hi"
```

## Exports

```ts
// Components
export { TableComponent, ActionDropdown, PaginationComponent, TableSkeleton, NoContentComponent }

// Types
export type { TableProps, ActionDropdownProps, PaginationComponentProps, TableSkeletonProps, NoContentProps }

// Utilities
export { formatDate, isDateString, trimText }
```

## CSS Classes (`.rtbl-*`)

All library CSS is scoped under `@layer rtbl` and uses the `rtbl-` prefix:

| Class | Element |
|-------|---------|
| `.rtbl-container` | Outer wrapper div |
| `.rtbl-container.dark` | Dark mode variant |
| `.rtbl-scroll-container` | Overflow scroll div |
| `.rtbl-table` | `<table>` element |
| `.rtbl-sticky-header` | `<thead>` (sticky) |
| `.rtbl-table-cell` | `<td>` default cell |
| `.rtbl-chip` | Array value chip |
| `.rtbl-more-chip` | "+N more" chip |
| `.rtbl-dropdown-menu` | Column header dropdown menu |
| `.rtbl-dropdown-item` | Column header dropdown item |
| `.rtbl-sort-indicator` | Sort arrow wrapper |
| `.rtbl-resizer` | Column resize handle |
| `.rtbl-sticky-left/right` | Sticky columns |
| `.rtbl-freeze-left/right` | Sticky columns with border |
