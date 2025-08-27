# 🧪 Testing Strategy & Guidelines

This document outlines the testing strategy, coverage requirements, and best practices for the **nextjs-reusable-table** library.

## 📋 **Table of Contents**

- [Testing Framework](#testing-framework)
- [Coverage Requirements](#coverage-requirements)
- [Test Structure](#test-structure)
- [Testing Categories](#testing-categories)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Debugging Tests](#debugging-tests)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## 🛠️ **Testing Framework**

### **Primary Framework**
- **Jest** - Test runner and assertion library
- **React Testing Library** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **@testing-library/user-event** - User interaction testing utilities

### **Configuration**
- Located in `jest.config.js`
- Uses jsdom environment for DOM testing
- Includes coverage collection and reporting
- Supports TypeScript with ts-jest

## 📊 **Coverage Requirements**

### **Minimum Coverage Thresholds**
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}
```

### **Coverage Goals**
- **Branches**: 90%+ - Decision points and conditional logic
- **Functions**: 90%+ - All exported and internal functions
- **Lines**: 90%+ - Executable lines of code
- **Statements**: 90%+ - All statements in the codebase

### **Coverage Exclusions**
```javascript
// Files excluded from coverage
coveragePathIgnorePatterns: [
  "node_modules/",
  "dist/",
  "coverage/",
  "*.config.js",
  "*.config.ts",
  "src/setupTests.ts"
]
```

## 🏗️ **Test Structure**

### **File Organization**
```
src/
  components/
    __tests__/
      ComponentName.test.tsx
      ComponentName.test.tsx
    ComponentName.tsx
  utils/
    __tests__/
      helper.test.ts
    helpers.ts
```

### **Test File Naming**
- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Follows the pattern: `[filename].test.[extension]`

## 📂 **Testing Categories**

### **1. Unit Tests**
- Test individual functions and components in isolation
- Mock external dependencies
- Focus on logic and behavior
- Fast execution and reliable results

### **2. Integration Tests**
- Test component interactions
- Test data flow between components
- Include real dependencies where appropriate
- Verify end-to-end functionality

### **3. Component Tests**
- Test React component rendering
- Test user interactions
- Test accessibility features
- Test responsive behavior

### **4. Utility Function Tests**
- Test data formatting functions
- Test helper utilities
- Test type guards and validation
- Test performance-critical functions

## ✍️ **Writing Tests**

### **Component Test Template**
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TableComponent } from "../TableComponent";

describe("TableComponent", () => {
  const mockData = [
    { id: 1, name: "Test User", email: "test@example.com" }
  ];
  const mockColumns = ["ID", "Name", "Email"];
  const mockProps = ["id", "name", "email"];

  beforeEach(() => {
    // Setup common test data
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders table with data", () => {
      render(
        <TableComponent
          data={mockData}
          columns={mockColumns}
          props={mockProps}
        />
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("renders empty state when no data", () => {
      render(
        <TableComponent
          data={[]}
          columns={mockColumns}
          props={mockProps}
        />
      );

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles row click", () => {
      const mockOnClick = jest.fn();

      render(
        <TableComponent
          data={mockData}
          columns={mockColumns}
          props={mockProps}
          rowOnClick={mockOnClick}
        />
      );

      const row = screen.getByText("Test User").closest("tr");
      fireEvent.click(row!);

      expect(mockOnClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("handles search functionality", () => {
      render(
        <TableComponent
          data={mockData}
          columns={mockColumns}
          props={mockProps}
          searchValue="Test"
        />
      );

      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      render(
        <TableComponent
          data={mockData}
          columns={mockColumns}
          props={mockProps}
        />
      );

      expect(screen.getByRole("table")).toHaveAttribute("aria-label");
    });

    it("supports keyboard navigation", () => {
      render(
        <TableComponent
          data={mockData}
          columns={mockColumns}
          props={mockProps}
        />
      );

      const table = screen.getByRole("table");
      table.focus();

      expect(document.activeElement).toBe(table);
    });
  });
});
```

### **Utility Function Test Template**
```typescript
import { formatDate, isDateString, trimText } from "../helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2023-01-15T10:30:00Z");
      const result = formatDate(date, true);

      expect(result).toBe("Jan 15, 2023 at 10:30 AM");
    });

    it("handles invalid dates", () => {
      const result = formatDate(new Date("invalid"));

      expect(result).toBe("Invalid Date");
    });
  });

  describe("isDateString", () => {
    it("returns true for valid date strings", () => {
      expect(isDateString("2023-01-15")).toBe(true);
      expect(isDateString("2023-01-15T10:30:00Z")).toBe(true);
    });

    it("returns false for invalid date strings", () => {
      expect(isDateString("not-a-date")).toBe(false);
      expect(isDateString("")).toBe(false);
    });
  });

  describe("trimText", () => {
    it("trims text to specified length", () => {
      const result = trimText("This is a long text", 10);

      expect(result).toBe("This is a...");
    });

    it("returns original text if shorter than maxLength", () => {
      const text = "Short text";
      const result = trimText(text, 20);

      expect(result).toBe(text);
    });
  });
});
```

## 🚀 **Running Tests**

### **Available Commands**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Debug tests
npm run test:debug
```

### **Test Scripts Explained**

- **`npm test`** - Runs all tests once
- **`npm run test:watch`** - Runs tests in watch mode for development
- **`npm run test:coverage`** - Runs tests with coverage reporting
- **`npm run test:ci`** - Runs tests optimized for CI environments
- **`npm run test:debug`** - Runs tests with debugging enabled

## 🐛 **Debugging Tests**

### **Debug Mode**
```bash
# Run tests with debugging
npm run test:debug

# Run specific test file
npm test -- --testPathPattern=ComponentName

# Run specific test
npm test -- --testNamePattern="should handle click"
```

### **Coverage Analysis**
```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### **Common Debugging Issues**

1. **Async Operations**
   ```tsx
   it("handles async operation", async () => {
     render(<Component />);

     await waitFor(() => {
       expect(screen.getByText("Loaded")).toBeInTheDocument();
     });
   });
   ```

2. **Mocking Dependencies**
   ```tsx
   const mockFunction = jest.fn();
   jest.mock("../api", () => ({
     fetchData: mockFunction
   }));
   ```

3. **Testing User Events**
   ```tsx
   import userEvent from "@testing-library/user-event";

   it("handles user interaction", async () => {
     const user = userEvent.setup();
     render(<Component />);

     await user.click(screen.getByRole("button"));
     expect(mockFunction).toHaveBeenCalled();
   });
   ```

## 🔄 **Continuous Integration**

### **GitHub Actions**
- Automated testing on push and pull requests
- Coverage reporting with Codecov
- Security scanning with Trivy
- Automated publishing on main branch

### **Coverage Reporting**
- Coverage reports uploaded to Codecov
- Minimum coverage thresholds enforced
- Coverage badges in README

## ✅ **Best Practices**

### **Test Organization**
- [ ] Group related tests in `describe` blocks
- [ ] Use descriptive test names
- [ ] Follow the pattern: "should [expected behavior] when [condition]"
- [ ] Keep tests independent and isolated

### **Test Quality**
- [ ] Test both positive and negative scenarios
- [ ] Test edge cases and error conditions
- [ ] Include accessibility testing
- [ ] Test responsive behavior
- [ ] Mock external dependencies

### **Performance**
- [ ] Keep tests fast and efficient
- [ ] Avoid unnecessary setup/teardown
- [ ] Use appropriate waiting strategies
- [ ] Profile slow tests and optimize

### **Maintenance**
- [ ] Update tests when code changes
- [ ] Remove obsolete tests
- [ ] Keep test data realistic
- [ ] Document complex test scenarios

### **Accessibility Testing**
```tsx
it("is accessible", async () => {
  render(<Component />);

  // Check for ARIA labels
  expect(screen.getByRole("button")).toHaveAttribute("aria-label");

  // Check keyboard navigation
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByRole("button")).toHaveFocus();

  // Check screen reader compatibility
  expect(screen.getByText("Description")).toBeInTheDocument();
});
```

## 📊 **Coverage Goals**

### **Component Coverage**
- [ ] All component props variations
- [ ] Loading and error states
- [ ] User interaction scenarios
- [ ] Accessibility compliance
- [ ] Responsive design breakpoints

### **Utility Coverage**
- [ ] All input/output combinations
- [ ] Error handling paths
- [ ] Edge cases and boundary conditions
- [ ] Performance-critical paths

### **Integration Coverage**
- [ ] Component interaction patterns
- [ ] Data flow between components
- [ ] State management integration
- [ ] Real-world usage scenarios

## 🔗 **Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://testing-library.com/docs/bbb-learning/)
- [Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom/)

---

**Remember**: Well-written tests are documentation that never gets out of date. They serve as examples of how to use the code and help prevent regressions.
