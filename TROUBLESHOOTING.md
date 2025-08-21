# 🔧 Troubleshooting Guide

Common issues and solutions when using nextjs-reusable-table.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Styling Problems](#styling-problems)
- [TypeScript Errors](#typescript-errors)
- [Performance Issues](#performance-issues)
- [Functionality Problems](#functionality-problems)
- [SSR/Hydration Issues](#ssrhydration-issues)
- [Browser Compatibility](#browser-compatibility)

## Installation Issues

### Package Not Found

**Problem**: `npm ERR! 404 Not Found - GET https://registry.npmjs.org/nextjs-reusable-table`

**Solution**:
```bash
# Make sure you're installing the correct package name
npm install nextjs-reusable-table@latest

# Clear npm cache if needed
npm cache clean --force

# Try with different registry
npm install nextjs-reusable-table --registry https://registry.npmjs.org/
```

### Peer Dependency Warnings

**Problem**: Warnings about unmet peer dependencies

**Solution**:
```bash
# Install all required peer dependencies
npm install react@^16.8.0 react-dom@^16.8.0 next@^12.0.0

# For TypeScript projects
npm install -D @types/react @types/react-dom
```

### CSS Not Loading

**Problem**: Table appears unstyled

**Solutions**:
1. Import the CSS file:
```typescript
import "nextjs-reusable-table/dist/index.css";
```

2. Add to your global CSS (in `_app.tsx` or `layout.tsx`):
```css
@import "nextjs-reusable-table/dist/index.css";
```

3. Configure your bundler to handle CSS imports from node_modules.

## Styling Problems

### Tailwind Classes Not Working

**Problem**: Custom classes not applying or being overridden

**Solutions**:

1. **Check Tailwind configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/nextjs-reusable-table/**/*.{js,jsx,ts,tsx}", // Add this
  ],
  // ... rest of config
}
```

2. **Use `!important` for overrides**:
```typescript
const customStyles = {
  table: "!bg-red-500", // Force override
  th: "!text-white !font-bold",
};
```

3. **Disable default styles completely**:
```typescript
<TableComponent
  disableDefaultStyles={true}
  customClassNames={yourCompleteCustomStyles}
  // ... other props
/>
```

### Dark Mode Not Working

**Problem**: Dark mode styles not applying

**Solutions**:

1. **Check system preferences**:
```typescript
// Force dark mode for testing
<TableComponent
  enableDarkMode={true}
  customClassNames={{
    table: "dark:bg-gray-800", // Ensure dark: variants are included
  }}
  // ... other props
/>
```

2. **Configure Tailwind for dark mode**:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'media', // or 'class'
  // ... rest of config
}
```

### Responsive Issues

**Problem**: Table not responsive on mobile

**Solutions**:

1. **Enable horizontal scroll**:
```css
.table-container {
  overflow-x: auto;
}
```

2. **Use responsive breakpoints**:
```typescript
const responsiveStyles = {
  th: "px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm",
  td: "px-2 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm",
};
```

## TypeScript Errors

### Generic Type Issues

**Problem**: `Type 'string' is not assignable to type 'keyof T'`

**Solution**:
```typescript
// ❌ Wrong
const props = ["id", "name", "email"]; // string[]

// ✅ Correct
const props = ["id", "name", "email"] as const; // readonly ["id", "name", "email"]

// ✅ Or with proper typing
interface User {
  id: number;
  name: string;
  email: string;
}

const props: (keyof User)[] = ["id", "name", "email"];
```

### Missing Type Definitions

**Problem**: `Cannot find module 'nextjs-reusable-table' or its corresponding type declarations`

**Solution**:
```typescript
// Create a type declaration file: types/nextjs-reusable-table.d.ts
declare module 'nextjs-reusable-table' {
  import { ReactNode } from 'react';
  
  export interface TableProps<T> {
    columns: string[];
    data: T[];
    props: ReadonlyArray<keyof T>;
    // ... add other props you're using
  }
  
  export function TableComponent<T>(props: TableProps<T>): ReactNode;
}
```

### Strict Mode Errors

**Problem**: TypeScript strict mode complaints

**Solutions**:

1. **Proper null checking**:
```typescript
// ❌ Wrong
const formatValue = (value: string, prop: string, item: T) => {
  return item.someProperty.toString(); // might be undefined
};

// ✅ Correct
const formatValue = (value: string, prop: string, item: T) => {
  return item.someProperty?.toString() ?? 'N/A';
};
```

2. **Proper event typing**:
```typescript
// ❌ Wrong
const handleClick = (e: any) => { /* ... */ };

// ✅ Correct  
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { /* ... */ };
```

## Performance Issues

### Slow Rendering with Large Datasets

**Problem**: Table is slow with 1000+ rows

**Solutions**:

1. **Enable pagination**:
```typescript
<TableComponent
  enablePagination
  itemsPerPage={50} // Reasonable page size
  // ... other props
/>
```

2. **Implement virtualization** (custom solution):
```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ data }) => (
  <List
    height={600}
    itemCount={data.length}
    itemSize={60}
    itemData={data}
  >
    {({ index, data, style }) => (
      <div style={style}>
        <TableComponent
          data={[data[index]]}
          // ... other props
        />
      </div>
    )}
  </List>
);
```

3. **Memoize heavy computations**:
```typescript
const formatValue = useCallback((value: string, prop: string, item: T) => {
  // Heavy computation here
  return expensiveFormatting(value);
}, []);

const memoizedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    computedField: heavyComputation(item)
  }));
}, [data]);
```

### Memory Leaks

**Problem**: Component not cleaning up properly

**Solutions**:

1. **Cleanup event listeners**:
```typescript
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

2. **Cancel ongoing operations**:
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal).then(setData);
  
  return () => controller.abort();
}, []);
```

## Functionality Problems

### Search Not Working

**Problem**: Search functionality not filtering data

**Solutions**:

1. **Check search value prop**:
```typescript
// ❌ Wrong - search value not passed
<TableComponent data={data} /* missing searchValue */ />

// ✅ Correct
const [search, setSearch] = useState("");

<TableComponent 
  data={data}
  searchValue={search}
  // ... other props
/>
```

2. **Case sensitivity issues**:
```typescript
// The component does case-insensitive search by default
// If you need custom search, filter data yourself:
const filteredData = useMemo(() => {
  if (!searchTerm) return data;
  
  return data.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}, [data, searchTerm]);
```

### Pagination Not Working

**Problem**: Pagination controls not appearing or not working

**Solutions**:

1. **Check required props**:
```typescript
// ❌ Missing required props
<TableComponent enablePagination />

// ✅ All required props provided
const [page, setPage] = useState(1);

<TableComponent
  enablePagination
  page={page}
  setPage={setPage}
  itemsPerPage={10}
  // ... other props
/>
```

2. **Page state issues**:
```typescript
// ✅ Handle page bounds
const safeSetPage = (newPage: number) => {
  const maxPage = Math.ceil(data.length / itemsPerPage);
  setPage(Math.max(1, Math.min(newPage, maxPage)));
};
```

### Actions Not Triggering

**Problem**: Action dropdown not working or functions not called

**Solutions**:

1. **Check props matching**:
```typescript
// ❌ Arrays don't match
<TableComponent
  actions={true}
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[editFn]} // Missing delete function
/>

// ✅ Arrays match
<TableComponent
  actions={true}
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[editFn, deleteFn]} // Both functions provided
/>
```

2. **Function not defined**:
```typescript
// ❌ Functions not properly defined
const actionFunctions = [undefined, deleteFn]; // undefined function

// ✅ All functions defined
const editFn = useCallback((item: T) => {
  console.log('Edit:', item);
}, []);

const deleteFn = useCallback((item: T) => {
  console.log('Delete:', item);
}, []);

const actionFunctions = [editFn, deleteFn];
```

### Sorting Not Working

**Problem**: Column sorting not functioning

**Solutions**:

1. **Check sortable props**:
```typescript
// ❌ sortableProps not defined
<TableComponent onSort={handleSort} />

// ✅ sortableProps defined
<TableComponent
  sortableProps={["name", "email", "date"]}
  onSort={handleSort}
/>
```

2. **Implement sort handler**:
```typescript
const [sortConfig, setSortConfig] = useState<{
  prop: keyof T;
  order: 'asc' | 'desc';
} | null>(null);

const handleSort = (prop: keyof T) => {
  setSortConfig(prev => ({
    prop,
    order: prev?.prop === prop && prev.order === 'asc' ? 'desc' : 'asc'
  }));
};

const sortedData = useMemo(() => {
  if (!sortConfig) return data;
  
  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.prop];
    const bVal = b[sortConfig.prop];
    
    if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
    return 0;
  });
}, [data, sortConfig]);
```

## SSR/Hydration Issues

### Hydration Mismatch

**Problem**: `Warning: Text content did not match. Server: "..." Client: "..."`

**Solutions**:

1. **Use dynamic imports**:
```typescript
import dynamic from 'next/dynamic';

const TableComponent = dynamic(
  () => import('nextjs-reusable-table').then(mod => mod.TableComponent),
  { ssr: false }
);
```

2. **Handle client-only features**:
```typescript
import { useState, useEffect } from 'react';

const ClientOnlyTable = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div>Loading...</div>;
  
  return <TableComponent data={data} />;
};
```

3. **Suppress hydration warnings** (use sparingly):
```typescript
<div suppressHydrationWarning>
  <TableComponent data={data} />
</div>
```

### Dark Mode SSR Issues

**Problem**: Dark mode flashing or not matching server/client

**Solutions**:

1. **Use next-themes**:
```typescript
// _app.tsx
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

2. **Manual theme handling**:
```typescript
const [theme, setTheme] = useState<'light' | 'dark'>('light');

useEffect(() => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}, []);
```

## Browser Compatibility

### IE11 Support

**Problem**: Not working in Internet Explorer 11

**Solution**: IE11 is not supported. Use modern browsers or:

```javascript
// Add polyfills for IE11 if absolutely necessary
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### Safari Issues

**Problem**: Styling issues in Safari

**Solutions**:

1. **Add webkit prefixes**:
```css
.table-container {
  -webkit-overflow-scrolling: touch;
}
```

2. **Safari-specific styles**:
```typescript
const safariStyles = {
  table: "w-full [-webkit-transform:translateZ(0)]", // Force hardware acceleration
};
```

### Mobile Safari

**Problem**: Touch interactions not working properly

**Solution**:
```css
button, [role="button"] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

## Getting Help

### Debug Information

When reporting issues, include:

1. **Package version**:
```bash
npm list nextjs-reusable-table
```

2. **Environment info**:
- Next.js version
- React version  
- TypeScript version
- Browser and version
- Operating system

3. **Minimal reproduction**:
```typescript
// Create a minimal example that reproduces the issue
import { TableComponent } from "nextjs-reusable-table";

const data = [{ id: 1, name: "Test" }];

export default function MinimalExample() {
  return (
    <TableComponent
      columns={["ID", "Name"]}
      data={data}
      props={["id", "name"]}
    />
  );
}
```

### Community Resources

- **GitHub Issues**: [Report bugs or request features](https://github.com/ninsau/nextjs-reusable-table/issues)
- **Discussions**: [Community Q&A](https://github.com/ninsau/nextjs-reusable-table/discussions)
- **Examples Repository**: [Live examples and demos](https://github.com/ninsau/nextjs-reusable-table-examples)

### Performance Profiling

Use React DevTools Profiler to identify performance bottlenecks:

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Start profiling"
4. Interact with your table
5. Stop profiling and analyze the flame graph

Look for:
- Components rendering too frequently
- Expensive operations in render cycles
- Memory leaks in the profiler

### Enable Debug Mode

For development debugging:

```typescript
// Add to your component for detailed logging
const DebugTable = ({ data }) => {
  useEffect(() => {
    console.log('TableComponent data updated:', data.length, 'items');
  }, [data]);
  
  return (
    <TableComponent
      data={data}
      // ... other props
    />
  );
};
```
