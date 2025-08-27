# ❓ Frequently Asked Questions

Welcome to the **nextjs-reusable-table** FAQ! Here you'll find answers to common questions about installation, usage, customization, and troubleshooting.

## 📋 **Table of Contents**

- [Getting Started](#getting-started)
- [Installation & Setup](#installation--setup)
- [Usage & Configuration](#usage--configuration)
- [Styling & Theming](#styling--theming)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support](#support)

## 🚀 **Getting Started**

### **What is nextjs-reusable-table?**

nextjs-reusable-table is a production-ready, highly customizable table component for Next.js applications. It features sorting, pagination, search, dark mode, TypeScript support, and zero dependencies.

### **Who should use this library?**

- React/Next.js developers building data-heavy applications
- Teams needing consistent table components across projects
- Developers who want TypeScript support and accessibility
- Anyone seeking a performant, customizable table solution

### **What are the main features?**

- ⚡ **High Performance**: Optimized rendering and tree-shaking
- 🎨 **Customizable**: Override styles and behavior
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: Screen reader friendly with ARIA support
- 🌙 **Dark Mode**: Automatic system preference detection
- 🔍 **Built-in Search**: No extra setup needed
- 📊 **Smart Data Handling**: Auto-formats dates, URLs, arrays

## 📦 **Installation & Setup**

### **How do I install the library?**

```bash
npm install nextjs-reusable-table
# or
yarn add nextjs-reusable-table
# or
pnpm add nextjs-reusable-table
```

### **What are the requirements?**

- **Next.js**: 12.0+
- **React**: 16.0+
- **React DOM**: 16.0+
- **Tailwind CSS**: 3.0+
- **TypeScript**: 4.5+ (recommended)

### **Do I need to install any additional dependencies?**

No! The library has **zero runtime dependencies**. It only requires the peer dependencies listed above, which you likely already have in your Next.js project.

### **How do I import the CSS?**

```tsx
import "nextjs-reusable-table/dist/index.css";
```

Import this once in your app, typically in `_app.tsx` or `layout.tsx`.

## 💻 **Usage & Configuration**

### **How do I create a basic table?**

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
  { id: 1, name: "John Doe", email: "john@example.com" }
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

### **How do I add sorting?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  sortableProps={["name", "email"]}
  onSort={(prop) => {
    // Handle sorting logic
    console.log("Sorting by:", prop);
  }}
/>
```

### **How do I add pagination?**

```tsx
const [page, setPage] = useState(1);

<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  enablePagination={true}
  page={page}
  setPage={setPage}
  itemsPerPage={10}
  totalPages={10}
/>
```

### **How do I handle row clicks?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  rowOnClick={(user) => {
    // Navigate to user detail page
    router.push(`/users/${user.id}`);
  }}
/>
```

### **How do I add custom actions?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  actions={true}
  actionTexts={["Edit", "Delete"]}
  actionFunctions={[
    (user) => handleEdit(user),
    (user) => handleDelete(user)
  ]}
/>
```

## 🎨 **Styling & Theming**

### **How do I customize the table appearance?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  customClassNames={{
    table: "custom-table",
    th: "custom-header",
    td: "custom-cell",
    pagination: {
      container: "custom-pagination",
      button: "custom-button"
    }
  }}
/>
```

### **How do I disable default styles?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  disableDefaultStyles={true}
  customClassNames={{
    // Your custom classes
  }}
/>
```

### **How do I customize data formatting?**

```tsx
<TableComponent<User>
  columns={["ID", "Name", "Email", "Created"]}
  data={users}
  props={["id", "name", "email", "createdAt"]}
  formatValue={(value, prop, item) => {
    if (prop === "createdAt") {
      return formatDate(new Date(value));
    }
    return undefined; // Use default formatting
  }}
/>
```

### **How do I add custom row rendering?**

```tsx
const renderRow = (user: User, index: number) => (
  <>
    <td className="px-4 py-2">{user.id}</td>
    <td className="px-4 py-2 font-semibold">{user.name}</td>
    <td className="px-4 py-2">
      <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
        {user.email}
      </a>
    </td>
  </>
);

<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]}
  renderRow={renderRow}
/>
```

## ⚡ **Performance**

### **How performant is the library?**

- **Bundle Size**: ~39KB minified (~12KB gzipped)
- **Tree-shakable**: Yes, only import what you need
- **Zero Runtime Dependencies**: No additional JavaScript loaded
- **Optimized Rendering**: Efficient re-renders with React best practices

### **How do I optimize for large datasets?**

```tsx
// Use pagination for better performance
<TableComponent<User>
  data={largeDataset}
  enablePagination={true}
  itemsPerPage={50} // Limit items per page
  // ... other props
/>

// Implement search to reduce displayed data
const [searchValue, setSearchValue] = useState("");
// Use searchValue prop to filter data
```

### **How do I handle loading states?**

```tsx
<TableComponent<User>
  data={data}
  loading={isLoading}
  columns={["ID", "Name", "Email"]}
  props={["id", "name", "email"]}
/>
```

### **How do I handle empty states?**

```tsx
<TableComponent<User>
  data={data}
  columns={["ID", "Name", "Email"]}
  props={["id", "name", "email"]}
  noContentProps={{
    text: "No users found. Try adjusting your search.",
    icon: <UserIcon className="w-16 h-16 text-gray-400" />
  }}
/>
```

## 🔧 **Troubleshooting**

### **The table doesn't render correctly**

**Check:**
1. Did you import the CSS? `import "nextjs-reusable-table/dist/index.css";`
2. Are you using the component in a client component? Add `"use client";`
3. Is Tailwind CSS properly configured in your project?

### **TypeScript errors**

**Solutions:**
1. Ensure you have TypeScript 4.5+ installed
2. Check that your data matches the interface
3. Verify prop types are correct

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Correct usage
<TableComponent<User>
  columns={["ID", "Name", "Email"]}
  data={users}
  props={["id", "name", "email"]} // Must match User interface
/>
```

### **Styling issues**

**Check:**
1. Tailwind CSS is properly installed and configured
2. No CSS conflicts with your existing styles
3. Custom classes are properly defined

### **Performance issues**

**Solutions:**
1. Use pagination for large datasets
2. Implement search to reduce displayed data
3. Use `React.memo` for custom components
4. Avoid inline functions in render

### **Dark mode not working**

**Check:**
1. `enableDarkMode` prop is set to `true`
2. System prefers dark mode or manual toggle is implemented
3. No CSS conflicts overriding dark mode styles

## 🤝 **Contributing**

### **How can I contribute?**

1. **Report bugs**: Use our [bug report template](https://github.com/ninsau/nextjs-reusable-table/issues/new?template=bug-report.md)
2. **Request features**: Use our [feature request template](https://github.com/ninsau/nextjs-reusable-table/issues/new?template=feature-request.md)
3. **Submit code**: Follow our [contributing guide](CONTRIBUTING.md)
4. **Improve docs**: Help make documentation clearer

### **How do AI agents contribute?**

AI agents should follow our [AGENTS.md](AGENTS.md) guide which includes:
- Specific coding standards for AI-generated code
- Automated quality checks
- Development workflow automation
- Code review checklists

## 📞 **Support**

### **Where can I get help?**

- **Documentation**: Check [README.md](README.md), [API.md](API.md), [EXAMPLES.md](EXAMPLES.md)
- **Issues**: [GitHub Issues](https://github.com/ninsau/nextjs-reusable-table/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ninsau/nextjs-reusable-table/discussions)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### **I found a bug, what should I do?**

1. Check if the bug is already reported
2. Use our [bug report template](https://github.com/ninsau/nextjs-reusable-table/issues/new?template=bug-report.md)
3. Include as much detail as possible
4. Provide a minimal reproduction case

### **I need a feature, how do I request it?**

1. Check if the feature is already requested
2. Use our [feature request template](https://github.com/ninsau/nextjs-reusable-table/issues/new?template=feature-request.md)
3. Describe your use case clearly
4. Explain why this feature would be valuable

## 🔒 **Security**

### **I found a security issue**

Please report security vulnerabilities by emailing security@nextjs-reusable-table.dev. See our [Security Policy](SECURITY.md) for details.

### **Is the library secure?**

- No external dependencies
- TypeScript for type safety
- Regular security updates
- Security scanning in CI/CD

## 📄 **License**

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.

## 🤖 **AI Agent Support**

**🤖 AI Agents Welcome!** If you're using AI tools, check out:
- [AGENTS.md](AGENTS.md) - AI-specific contribution guidelines
- [TESTING.md](TESTING.md) - Testing strategy and coverage
- [BUILD.md](BUILD.md) - Build process and performance

---

**Still have questions?** Check our [GitHub Discussions](https://github.com/ninsau/nextjs-reusable-table/discussions) or create an issue!

**🎉 Happy coding with nextjs-reusable-table!**
