---
name: nextjs-reusable-table
description: Use this skill when building or customising data tables with nextjs-reusable-table. Covers installation, all props, sorting, pagination, search, row actions, dark mode, custom styling, and Tailwind setup for Next.js 13+ and React 18+.
license: ISC
metadata:
  author: ninsau
  version: "4.1.0"
  repository: https://github.com/ninsau/nextjs-reusable-table
---

# nextjs-reusable-table Skill

## When to Use This Skill

Invoke this skill when the user is:
- Installing or setting up `nextjs-reusable-table`
- Rendering a `<TableComponent>` with data
- Adding sorting, pagination, search, or row actions to a table
- Customising table styles via `customClassNames` or `disableDefaultStyles`
- Using `TableSkeleton`, `PaginationComponent`, or `ActionDropdown` standalone
- Debugging style leaking, Tailwind config, or dark mode issues

## Installation

```bash
npm install nextjs-reusable-table
```

Then import the CSS (required for `.rtbl-*` scoped styles):

```ts
// In your root layout or _app.tsx
import "nextjs-reusable-table/dist/index.css";
```

**Tailwind v3** — add to `tailwind.config.js` so utilities used inside the library are generated:

```js
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/nextjs-reusable-table/dist/**/*.{js,mjs}",
]
```

**Tailwind v4** — add a `@source` directive:

```css
@import "tailwindcss";
@source "../node_modules/nextjs-reusable-table/dist";
```

## Basic Usage

```tsx
"use client";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
];

export default function UsersTable() {
  return (
    <TableComponent<User>
      columns={["Name", "Email", "Role"]}
      data={users}
      props={["name", "email", "role"]}
    />
  );
}
```

## Core Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `string[]` | required | Column header labels |
| `data` | `T[]` | required | Row data array |
| `props` | `ReadonlyArray<keyof T>` | required | Object keys to display per column |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `searchValue` | `string` | — | Filter rows by this string (searches all columns) |
| `actions` | `boolean` | `false` | Enable per-row action dropdown |
| `actionTexts` | `string[]` | — | Labels for dropdown actions |
| `actionFunctions` | `Array<(item: T) => void>` | — | Handlers for dropdown actions |
| `rowOnClick` | `(item: T) => void` | — | Row click handler |
| `enableDarkMode` | `boolean` | `true` | Auto-detect OS dark mode |
| `disableDefaultStyles` | `boolean` | `false` | Strip all default styles (full headless mode) |
| `enablePagination` | `boolean` | `false` | Enable built-in pagination |
| `page` | `number` | `1` | Current page (controlled) |
| `setPage` | `(page: number) => void` | — | Page change handler |
| `itemsPerPage` | `number` | `10` | Rows per page |
| `totalPages` | `number` | — | Override for server-side pagination |
| `sortableProps` | `Array<keyof T>` | `[]` | Columns that trigger `onSort` |
| `onSort` | `(prop: keyof T) => void` | — | Sort handler |
| `formatValue` | `(value: string, prop: string, item: T) => ReactNode` | — | Custom cell renderer |
| `formatHeader` | `(header: string, prop: string, index: number) => ReactNode` | — | Custom header renderer |
| `renderRow` | `(item: T, index: number) => ReactNode` | — | Full custom row renderer |
| `renderPagination` | `(props) => ReactNode` | — | Custom pagination renderer |
| `showRemoveColumns` | `boolean` | `false` | Show column hide/show controls |
| `maxHeight` | `string \| number` | `"600px"` | Scroll container max height |
| `scrollBehavior` | `"auto" \| "scroll" \| "visible" \| "hidden"` | `"auto"` | Overflow scroll style |
| `tableLayout` | `"auto" \| "fixed" \| "inherit"` | — | CSS `table-layout` |
| `cellExpansion` | `CellExpansionConfig` | `{enabled:true,maxWidth:200,behavior:"truncate"}` | Cell truncation/expansion |
| `accessibility` | `AccessibilityConfig` | `{keyboardNavigation:true}` | ARIA and keyboard config |
| `noContentProps` | `{text?,icon?,name?}` | — | Empty state customisation |
| `customClassNames` | `CustomClassNames` | `{}` | Per-element Tailwind class overrides |
| `customStyles` | `{container?,table?,scrollContainer?,loading?}` | `{}` | Inline style overrides |

## Common Patterns

### Sorting (client-side)

```tsx
const [sortProp, setSortProp] = useState<keyof User | null>(null);
const [sortAsc, setSortAsc] = useState(true);

const sorted = useMemo(() => {
  if (!sortProp) return users;
  return [...users].sort((a, b) =>
    sortAsc
      ? String(a[sortProp]).localeCompare(String(b[sortProp]))
      : String(b[sortProp]).localeCompare(String(a[sortProp]))
  );
}, [users, sortProp, sortAsc]);

<TableComponent<User>
  columns={["Name", "Email"]}
  data={sorted}
  props={["name", "email"]}
  sortableProps={["name", "email"]}
  onSort={(prop) => {
    if (prop === sortProp) setSortAsc((a) => !a);
    else { setSortProp(prop); setSortAsc(true); }
  }}
/>
```

### Pagination (built-in)

```tsx
const [page, setPage] = useState(1);

<TableComponent<User>
  columns={["Name", "Email"]}
  data={users}
  props={["name", "email"]}
  enablePagination
  page={page}
  setPage={setPage}
  itemsPerPage={20}
/>
```

### Row Actions

```tsx
<TableComponent<User>
  columns={["Name", "Email"]}
  data={users}
  props={["name", "email"]}
  actions
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[
    (user) => router.push(`/users/${user.id}/edit`),
    (user) => deleteUser(user.id),
  ]}
/>
```

### Custom Cell Rendering

```tsx
<TableComponent<User>
  columns={["Name", "Status"]}
  data={users}
  props={["name", "status"]}
  formatValue={(value, prop) => {
    if (prop === "status") {
      return (
        <span className={value === "active" ? "text-green-600" : "text-red-500"}>
          {value}
        </span>
      );
    }
    return value;
  }}
/>
```

### Headless Mode (full style control)

```tsx
<TableComponent<User>
  columns={["Name", "Email"]}
  data={users}
  props={["name", "email"]}
  disableDefaultStyles
  customClassNames={{
    container: "border rounded-xl shadow",
    table: "w-full text-sm",
    thead: "bg-slate-100",
    th: "px-4 py-3 text-left font-semibold",
    tr: "border-b hover:bg-slate-50",
    td: "px-4 py-3",
  }}
/>
```

## Standalone Components

```tsx
import {
  TableSkeleton,
  PaginationComponent,
  ActionDropdown,
  NoContentComponent,
} from "nextjs-reusable-table";

// Loading skeleton
<TableSkeleton enableDarkMode />

// Pagination only
<PaginationComponent
  page={page}
  setPage={setPage}
  totalPages={totalPages}
/>
```

## Utility Functions

```ts
import { formatDate, isDateString, trimText } from "nextjs-reusable-table";

formatDate(new Date(), true);        // "Mar 8, 2026, 09:30 AM"
isDateString("2024-01-15");          // true
trimText("Long string here", 20);    // "Long string here..."
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Tailwind classes not applying | Add library dist to Tailwind `content` / `@source` — see Installation above |
| Styles leaking into other pages | Upgrade to v4.1.0+ (skeleton CSS `@import` removed from `dist/index.css`) |
| React peer dep warning | Library requires `react >=18`. Run `npm install react@latest react-dom@latest` |
| `"use client"` error in Pages Router | Wrap import in a client component or use dynamic import with `ssr: false` |
| Dark mode not activating | Pass `enableDarkMode={true}` (default) and ensure your OS dark mode is on, or toggle manually via `enableDarkMode={false}` |

## Full API Reference

See [references/api-reference.md](references/api-reference.md) for complete type definitions.
