# Contributing to Next.js Reusable Table

Thank you for considering contributing to the **Next.js Reusable Table** project! Your contributions are highly appreciated.

## Table of Contents

- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
  - [Installing Dependencies](#installing-dependencies)
  - [Building the Project](#building-the-project)
  - [Running Tests](#running-tests)
- [Code Quality Standards](#code-quality-standards)
  - [Biome Linting Rules](#biome-linting-rules)
  - [TypeScript Standards](#typescript-standards)
  - [React Patterns](#react-patterns)
  - [Testing Requirements](#testing-requirements)
- [Style Guidelines](#style-guidelines)
- [AI Agent Support](#ai-agent-support)
- [Versioning](#versioning)
- [License](#license)
- [Contact](#contact)

---

## Getting Started

First off, thank you for taking the time to contribute! Before you start, please make sure to familiarize yourself with the project's codebase and read through this guide.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on the [GitHub Issues](https://github.com/ninsau/nextjs-reusable-table/issues) page with the following information:

- **Describe the bug**: Provide a clear and concise description of what the bug is.
- **Steps to reproduce**: Include steps to reproduce the behavior.
- **Expected behavior**: Describe what you expected to happen.
- **Screenshots**: If applicable, add screenshots to help explain your problem.
- **Environment**: Specify the version of the package, Node.js, and any other relevant information.

### Suggesting Enhancements

Enhancement suggestions are welcome! Please open an issue with:

- **Use case**: Explain the problem you're trying to solve.
- **Proposed solution**: Describe how you think the problem should be solved.
- **Alternatives considered**: Mention any alternative solutions you've considered.

### Submitting Pull Requests

Before submitting a pull request:

1. **Fork the repository** and create your branch from `main`.
2. **Follow the [Code Quality Standards](#code-quality-standards)**.
3. **Include tests** for your changes if applicable.
4. **Ensure all tests pass** by running `npm test`.
5. **Update documentation** if you've made changes to the API or documentation.

#### Pull Request Process

- **Ensure your PR is up-to-date** with the latest `main` branch.
- **Provide a clear description** of your changes.
- **Reference any related issues** in your PR description.
- **Wait for review**: One of the maintainers will review your PR and provide feedback.

## Development Setup

### Installing Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/ninsau/nextjs-reusable-table.git
cd nextjs-reusable-table
npm install
```

### Building the Project

```bash
# Build the package
npm run build

# Build CSS only
npm run build:css

# Watch mode for development
npm run build -- --watch
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Code Quality Standards

### Biome Linting Rules

This project uses **Biome** for code linting and formatting. All code must pass Biome checks before submission.

```bash
# Check code quality
npm run check

# Fix code quality issues automatically
npm run check:fix

# Check linting only
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run all validation checks
npm run validate
```

#### Biome Configuration Rules

- **Indentation**: 2 spaces
- **Line Width**: 80 characters maximum
- **Quotes**: Double quotes for JSX, double quotes for strings
- **Semicolons**: Always required
- **Arrow Functions**: Always use parentheses
- **Line Endings**: LF (Unix style)

### TypeScript Standards

- **Generic Types**: Always use `<T>` for table data types
- **Interface Naming**: Follow `ComponentNameProps<T>` pattern
- **Type Safety**: Never use `any` - always define proper interfaces
- **Readonly Arrays**: Use `ReadonlyArray<keyof T>` for props arrays
- **Strict Mode**: All TypeScript strict checks must pass

### React Patterns

- **Client Components**: Always include `"use client"` directive
- **Props Interface**: Define `ComponentProps` interface in `src/types/index.ts`
- **Default Props**: Use destructuring with defaults: `({ prop = defaultValue })`
- **Event Handlers**: Implement proper keyboard navigation and accessibility
- **State Management**: Use React hooks, prefer Zustand over Context for complex state

### Testing Requirements

- **Framework**: Jest + React Testing Library
- **Coverage**: Minimum 90% coverage for all new code
- **Test Files**: Place in `src/components/__tests__/` with `.test.tsx` extension
- **Required Tests**: Component rendering, user interactions, edge cases

```bash
# Run tests with coverage
npm run test:coverage

# Check test coverage meets requirements
npm run test:ci
```

## Style Guidelines

### File Organization

- **Component Files**: Place in `src/components/`
- **Type Definitions**: Add to `src/types/index.ts`
- **Utility Functions**: Add to `src/utils/helpers.ts`
- **Test Files**: Place in `src/components/__tests__/` with `.test.tsx` extension
- **Styles**: Use Tailwind CSS classes, modify `src/styles/tableStyles.css` for global changes

### Code Style

- **Line Length**: Maximum 80 characters
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for JSX, double quotes for strings
- **Semicolons**: Always required
- **Trailing Commas**: Use in objects and arrays
- **Import Order**: Group imports logically (React, external, internal, relative)

### Accessibility

- **ARIA Labels**: Include proper ARIA labels for interactive elements
- **Keyboard Navigation**: Implement full keyboard navigation support
- **Screen Readers**: Ensure compatibility with screen readers
- **Semantic HTML**: Use appropriate HTML elements for their intended purpose

## AI Agent Support

**🤖 AI Agents Welcome!** If you're using AI tools like Cursor, GitHub Copilot, or similar, we have a dedicated guide for you!

Check out **[AGENTS.md](AGENTS.md)** for:
- AI-specific contribution guidelines
- Automated code quality checks
- Development workflow automation
- Code review checklists for AI agents

AI agents can help with:
- Code generation and refactoring
- Automated testing
- Documentation updates
- Performance optimizations
- Accessibility improvements

## 📋 **Submission Templates**

We use GitHub templates to ensure consistent and high-quality submissions:

### **Pull Requests**
- **[PR Template](.github/PULL_REQUEST_TEMPLATE.md)** - Standardized format for code contributions
- **Required**: All checklist items must be completed
- **Automated**: CI/CD runs on all PRs

### **Issues**
- **[Bug Report](.github/ISSUE_TEMPLATE/bug-report.md)** - Structured bug reporting
- **[Feature Request](.github/ISSUE_TEMPLATE/feature-request.md)** - Feature proposal template
- **[Documentation](.github/ISSUE_TEMPLATE/documentation.md)** - Docs improvement template

## 🔄 **Continuous Integration**

### **GitHub Actions Workflow**
- **Location**: `.github/workflows/ci.yml`
- **Triggers**: Push and PR to main/dev branches
- **Checks**:
  - Testing on Node.js 18.x and 20.x
  - Code linting with Biome
  - TypeScript type checking
  - Security scanning with Trivy
  - Coverage reporting with Codecov
  - Automated publishing on main branch

### **Quality Gates**
All PRs must pass:
- ✅ All tests passing
- ✅ Code coverage > 90%
- ✅ No TypeScript errors
- ✅ Biome linting passing
- ✅ Security scan clean

## 🔒 **Security & Compliance**

### **Security Policy**
- **Location**: [SECURITY.md](SECURITY.md)
- **Vulnerability Reporting**: cassidyblay@gmail.com
- **Supported Versions**: 3.7.x, 3.6.x, 3.5.x
- **Response Time**: Within 48 hours

### **Code of Conduct**
- **Location**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Enforcement**: Community guidelines and moderation
- **Reporting**: cassidyblay@gmail.com

## 📚 **Documentation**

### **Comprehensive Docs**
- **[README.md](../README.md)** - Installation and basic usage
- **[API.md](../API.md)** - Complete API reference
- **[EXAMPLES.md](../EXAMPLES.md)** - Real-world examples and patterns
- **[TESTING.md](../TESTING.md)** - Testing strategy and coverage
- **[BUILD.md](../BUILD.md)** - Build process and performance
- **[TROUBLESHOOTING.md](../TROUBLESHOOTING.md)** - Common issues and solutions
- **[FAQ.md](../FAQ.md)** - Frequently asked questions
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and updates

### **AI-Specific Docs**
- **[AGENTS.md](../AGENTS.md)** - AI agent contribution guidelines

## 🛠️ **Development Environment**

### **Editor Configuration**
- **[.editorconfig](.editorconfig)** - Consistent coding styles across editors
- **Line Endings**: LF (Unix)
- **Indentation**: 2 spaces
- **Encoding**: UTF-8

### **VS Code Support**
- **Settings**: Optimized for the project
- **Extensions**: Recommendations for best experience
- **Debugging**: Built-in debugging configuration

### **Scripts and Automation**
```bash
# Development workflow
npm run dev              # Development build with watch
npm run build:dev        # Development build without minification
npm run build:analyze    # Bundle analysis
npm run validate:quick   # Fast validation for development
npm run clean           # Clean build artifacts
npm run size            # Check bundle size
```

## 📊 **Quality Assurance**

### **Code Quality Tools**
- **Biome**: Linting, formatting, and code quality
- **TypeScript**: Type checking and declarations
- **Jest**: Testing framework with coverage
- **Security**: Automated vulnerability scanning

### **Performance Monitoring**
- **Bundle Size**: Tracked and optimized
- **Build Time**: Monitored for efficiency
- **Coverage**: 90%+ requirement across all metrics
- **Benchmarks**: Performance baselines documented

## 🤝 **Community & Support**

### **Communication Channels**
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community support
- **Discord**: Community chat (invite link in discussions)

### **Support**
- **GitHub Stars**: Show your support by starring the repository ⭐
- **Issues & Discussions**: Report bugs and request features
- **Contributions**: Help improve the library through code contributions

### **Resources for Contributors**
- **Code of Conduct**: Community guidelines
- **Security Policy**: Vulnerability reporting
- **FAQ**: Common questions and answers
- **Troubleshooting**: Common issues and solutions

## Quality Assurance Checklist

Before submitting any changes, ensure:

- [ ] All Biome checks pass: `npm run check`
- [ ] All tests pass: `npm run test`
- [ ] Code builds successfully: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Code is properly formatted: `npm run format`
- [ ] Test coverage meets 90%+ requirement
- [ ] All validation passes: `npm run validate`
- [ ] No `any` types used
- [ ] Proper error handling implemented
- [ ] Accessibility features included
- [ ] Responsive design implemented
- [ ] Dark mode support added (if applicable)

## Common Issues and Solutions

### Biome Formatting Issues

```bash
# If you have formatting issues
npm run format

# If you have linting issues
npm run lint:fix

# Full fix for all issues
npm run check:fix
```

### Test Failures

```bash
# Run tests in watch mode to debug
npm run test:watch

# Check specific test file
npm test -- --testNamePattern="ComponentName"
```

### Build Issues

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/). When contributing:

- **Bug fixes**: Patch version (1.0.0 → 1.0.1)
- **New features**: Minor version (1.0.0 → 1.1.0)
- **Breaking changes**: Major version (1.0.0 → 2.0.0)

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

## Contact

If you have questions about contributing:

- **Issues**: [GitHub Issues](https://github.com/ninsau/nextjs-reusable-table/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ninsau/nextjs-reusable-table/discussions)
- **Documentation**: Check [README.md](README.md) and [API.md](API.md)

---

**Thank you for contributing to Next.js Reusable Table!** 🎉

Your contributions help make this library better for developers around the world.
