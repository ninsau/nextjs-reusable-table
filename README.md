![Maintenance](https://img.shields.io/badge/status-maintained-brightgreen)
[![npm version](https://img.shields.io/npm/v/nextjs-reusable-table.svg)](https://www.npmjs.com/package/nextjs-reusable-table)
[![npm downloads](https://img.shields.io/npm/dm/nextjs-reusable-table.svg)](https://www.npmjs.com/package/nextjs-reusable-table)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/nextjs-reusable-table)](https://bundlephobia.com/package/nextjs-reusable-table)
[![License](https://img.shields.io/npm/l/nextjs-reusable-table.svg)](https://github.com/ninsau/nextjs-reusable-table/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-96%20passed-brightgreen.svg)](#testing)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#installation)

# nextjs-reusable-table

A **production-ready**, highly customizable and reusable table component for Next.js applications. Built with TypeScript, optimized for performance, and designed with developer experience in mind.

## Documentation

| File | Description |
|------|-------------|
| [API.md](API.md) | Complete prop reference, types, and utility functions |
| [EXAMPLES.md](EXAMPLES.md) | Real-world usage patterns and recipes |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues, fixes, and FAQ |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [SECURITY.md](SECURITY.md) | Supported versions and vulnerability reporting |

### AI Tooling

| File | Description |
|------|-------------|
| [llms.txt](llms.txt) | AI-discovery index (llms.txt standard) |
| [llms-full.txt](llms-full.txt) | Complete inlined reference for AI context windows |
| [skills/nextjs-reusable-table/SKILL.md](skills/nextjs-reusable-table/SKILL.md) | Installable skill for Cursor, Claude Code, and agentskills-compatible editors |
| [AGENTS.md](AGENTS.md) | AI agent contribution guide |
| [.cursor/rules/](.cursor/rules/) | Cursor IDE rules (auto-attached per file type) |

## Key Features

- **Zero Configuration** — works out of the box
- **Smart Data Handling** — auto-formats dates, URLs, arrays
- **Built-in Search & Filtering** — no extra setup needed
- **Fully Responsive** — mobile-first design
- **Accessible** — screen reader friendly with ARIA support
- **Dark Mode** — automatic system preference detection
- **High Performance** — optimized renders, ~39KB minified (~12KB gzipped)
- **Truly Headless** — customize every style, behavior, and interaction via `disableDefaultStyles` + `customClassNames`
- **CSS Isolated** — all styles scoped under `@layer rtbl` with `rtbl-` prefix, zero global style leaking

## Installation

```bash
npm install nextjs-reusable-table
# or
yarn add nextjs-reusable-table
# or
pnpm add nextjs-reusable-table
```

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Next.js** | 13+ (App Router and Pages Router supported) |
| **React** | 18+ |
| **React DOM** | 18+ |
| **Tailwind CSS** | 3+ or 4+ |
| **TypeScript** | 4.5+ (recommended) |

> **Note**: All components use the `"use client"` directive. For SSR contexts, wrap in a client component or use `dynamic(() => import(...), { ssr: false })`.

## Quick Start

```tsx
"use client";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
];

export default function UsersTable() {
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
import { useState } from "react";
import { TableComponent } from "nextjs-reusable-table";
import "nextjs-reusable-table/dist/index.css";

export default function SearchableTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <TableComponent<User>
        columns={["ID", "Name", "Email"]}
        data={users}
        props={["id", "name", "email"]}
        searchValue={search}
        enablePagination
        page={page}
        setPage={setPage}
        itemsPerPage={10}
      />
    </div>
  );
}
```

### Tailwind Setup

**Tailwind v3** — add to `content` in `tailwind.config.js`:

```js
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/nextjs-reusable-table/dist/**/*.{js,mjs}",
]
```

**Tailwind v4** — add to your CSS:

```css
@import "tailwindcss";
@source "../node_modules/nextjs-reusable-table/dist";
```

## Features

### Smart Data Handling

- Dates automatically formatted using `Intl.DateTimeFormat`
- Arrays displayed as chips with "+X more" expand button
- URLs detected and rendered as `<Link>` elements

### Column Management

- Sort by specifying `sortableProps` and providing an `onSort` handler
- Hide/show columns via per-header dropdown (`showRemoveColumns={true}`)

### Action Dropdowns

```tsx
<TableComponent
  actions
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[
    (item) => handleEdit(item),
    (item) => handleDelete(item),
  ]}
/>
```

### Custom Cell Rendering

```tsx
<TableComponent<User>
  formatValue={(value, prop, item) => {
    if (prop === "status")
      return <span className={item.active ? "text-green-600" : "text-red-500"}>{value}</span>;
    return value;
  }}
/>
```

### Headless Mode

```tsx
<TableComponent
  disableDefaultStyles
  customClassNames={{
    container: "border rounded-xl overflow-hidden",
    table: "w-full text-sm",
    thead: "bg-slate-100",
    th: "px-4 py-3 font-semibold text-left",
    tr: "border-b hover:bg-slate-50",
    td: "px-4 py-3",
  }}
/>
```

For all prop options, see [API.md](API.md). For more examples, see [EXAMPLES.md](EXAMPLES.md).

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

ISC — see [LICENSE](LICENSE).

## Acknowledgments

Inspired by common data table patterns in React and Next.js applications. Thanks to all contributors and users for their support.
