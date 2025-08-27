# 🤖 AI Agent Contribution Guide for Next.js Reusable Table

This document is specifically designed for AI agents (like Cursor, GitHub Copilot, etc.) to efficiently **contribute to** the **nextjs-reusable-table** library while following all coding standards and best practices.

## 🎯 Quick Start for AI Agents Contributing

### Essential Setup Commands
```bash
# Clone and setup
git clone https://github.com/ninsau/nextjs-reusable-table.git
cd nextjs-reusable-table
npm install

# Run all quality checks
npm run check
npm run test
npm run build
```

### Code Quality Commands
```bash
# Fix all issues automatically
npm run check:fix      # Fix code style and quality issues
npm run format         # Format code with Biome
npm run lint:fix       # Fix linting issues

# Check current status
npm run lint           # Check code style
npm run check          # Full code quality check
npm run test           # Run tests
npm run type-check     # TypeScript type checking
npm run validate       # Run all validation checks
```

## 📋 Project Structure for Contributors

### Core Components to Modify
- **Main Table**: `src/components/TableComponent.tsx`
- **Supporting Components**: `src/components/ActionDropdown.tsx`, `src/components/PaginationComponent.tsx`
- **Types**: `src/types/index.ts`
- **Utilities**: `src/utils/helpers.ts`
- **Styles**: `src/styles/tableStyles.css`
- **Tests**: `src/components/__tests__/`

### Configuration Files
- **Code Style**: `biome.json` - Biome linting and formatting rules
- **Build**: `tsup.config.ts` - TypeScript bundling
- **Testing**: `jest.config.js` - Jest configuration
- **Styling**: `tailwind.config.js` - Tailwind CSS configuration

## 🔧 Coding Standards for AI Agents

### Biome Configuration Rules (MUST FOLLOW)
```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "semicolons": "always",
      "arrowParentheses": "always",
      "quoteStyle": "double"
    }
  }
}
```

### TypeScript Standards
- **Generic Types**: Always use `<T>` for table data types
- **Interface Naming**: Follow `ComponentNameProps<T>` pattern
- **Type Safety**: Never use `any` - always define proper interfaces
- **Readonly Arrays**: Use `ReadonlyArray<keyof T>` for props arrays

### React Component Standards
- **Client Components**: Always include `"use client"` directive
- **Props Interface**: Define `ComponentProps` interface in `src/types/index.ts`
- **Default Props**: Use destructuring with defaults: `({ prop = defaultValue })`
- **Event Handlers**: Implement proper keyboard navigation and accessibility

### File Organization Rules
- **Component Files**: Place in `src/components/`
- **Type Definitions**: Add to `src/types/index.ts`
- **Utility Functions**: Add to `src/utils/helpers.ts`
- **Test Files**: Place in `src/components/__tests__/` with `.test.tsx` extension

## 🧪 Testing Requirements for AI Agents

### Test File Structure
```tsx
// src/components/__tests__/NewComponent.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { NewComponent } from "../NewComponent";

describe("NewComponent", () => {
  it("renders correctly", () => {
    render(<NewComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles user interactions", () => {
    const mockHandler = jest.fn();
    render(<NewComponent onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage Requirements
- **Minimum Coverage**: 90%+ for all new code
- **Required Tests**: Component rendering, user interactions, edge cases
- **Mock Data**: Use realistic test data that matches real usage patterns

## 🎨 Styling Standards for AI Agents

### Tailwind CSS Usage
- **Responsive Design**: Always use responsive classes (sm:, md:, lg:)
- **Dark Mode**: Support both light and dark themes
- **Custom Classes**: Use `customClassNames` prop for overrides
- **Consistent Spacing**: Use Tailwind's spacing scale (px-4, py-2, etc.)

### CSS Customization
- **Base Styles**: Modify `src/styles/tableStyles.css` for global changes
- **Component Styles**: Use Tailwind classes in components
- **CSS Variables**: Define custom properties in tableStyles.css

## 📊 Data Handling for AI Agents

### Type Safety Implementation
```tsx
// Always define interfaces for new data types
interface NewDataType {
  id: string;
  name: string;
  metadata: Record<string, unknown>;
}

// Use generic constraints
function processData<T extends { id: string }>(data: T[]): T[] {
  return data.filter(item => item.id);
}
```

### Utility Function Standards
- **Pure Functions**: Avoid side effects, make functions testable
- **Error Handling**: Always handle edge cases and invalid inputs
- **Performance**: Use efficient algorithms, avoid unnecessary loops
- **Documentation**: Add JSDoc comments for complex functions

## 🚀 Feature Development for AI Agents

### Adding New Props
1. **Update Types**: Add to `TableProps<T>` interface in `src/types/index.ts`
2. **Update Component**: Implement in `TableComponent.tsx`
3. **Add Tests**: Test new functionality thoroughly
4. **Update Documentation**: Add examples to `EXAMPLES.md`

### Adding New Components
1. **Create Component**: Place in `src/components/`
2. **Define Props**: Add interface to `src/types/index.ts`
3. **Write Tests**: Create comprehensive test suite
4. **Export**: Add to `src/index.ts`
5. **Document**: Add usage examples

### Performance Considerations
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Lazy Loading**: Implement for large datasets
- **Bundle Size**: Keep dependencies minimal
- **Tree Shaking**: Ensure components are tree-shakable

## 🔍 Code Review Checklist for AI Agents

### Before Submitting Changes
- [ ] All Biome checks pass: `npm run check`
- [ ] All tests pass: `npm run test`
- [ ] Code builds successfully: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Code is properly formatted: `npm run format`
- [ ] Test coverage meets 90%+ requirement
- [ ] All validation passes: `npm run validate`

### Code Quality Checklist
- [ ] No `any` types used
- [ ] Proper error handling implemented
- [ ] Accessibility features included (ARIA labels, keyboard nav)
- [ ] Responsive design implemented
- [ ] Dark mode support added
- [ ] Performance optimizations applied

## 🚨 Common Mistakes to Avoid

### ❌ DON'T
- Don't use `any` types - always define interfaces
- Don't forget the `"use client"` directive
- Don't skip accessibility features
- Don't ignore mobile/responsive design
- Don't forget to handle edge cases
- Don't skip writing tests
- Don't exceed 80-character line width
- Don't use Context providers for simple state

### ✅ DO
- Always use TypeScript generics `<T>`
- Implement proper error boundaries
- Use semantic HTML and ARIA labels
- Follow the established component patterns
- Write comprehensive tests
- Use Tailwind CSS consistently
- Implement proper keyboard navigation
- Handle loading and empty states

## 🔗 Resources for AI Agents

### Documentation Files
- **README.md** - Installation and basic usage
- **EXAMPLES.md** - Real-world examples and patterns
- **API.md** - Complete API reference
- **CONTRIBUTING.md** - Human contribution guidelines

### Development Commands
```bash
# Full development workflow
npm run check:fix      # Fix all issues
npm run test           # Run tests
npm run build          # Build package
npm run lint           # Check style
npm run format         # Format code
npm run type-check     # TypeScript checking
npm run validate       # Run all checks
```

### Quality Assurance
- **Biome**: Code linting and formatting
- **Jest**: Testing framework
- **TypeScript**: Type checking
- **Tailwind**: CSS framework

---

**Remember**: As an AI agent, your contributions should maintain the high quality standards of this library. Always prioritize type safety, accessibility, performance, and maintainability. Follow the established patterns and ensure all quality checks pass before suggesting changes.
