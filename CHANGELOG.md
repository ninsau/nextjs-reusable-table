# 📋 Changelog

All notable changes to **nextjs-reusable-table** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2026-03-08

### Fixed
- CSS style leaking: removed `@import "react-loading-skeleton/dist/skeleton.css"` from `tableStyles.css`; skeleton CSS is now loaded on-demand by `TableSkeleton.tsx` only, preventing it from affecting pages that never use the skeleton
- All `.rtbl-*` CSS is now wrapped in `@layer rtbl` for cascade isolation, ensuring library styles never override unlayered consumer styles

### Added
- `.cursor/rules/*.mdc` — Cursor IDE rules auto-attached per file type for contributors
- `skills/nextjs-reusable-table/SKILL.md` — installable agentskills.io skill for AI editors (Cursor, Claude Code, GitHub Copilot)
- `skills/nextjs-reusable-table/references/api-reference.md` — condensed API reference for AI context windows
- `llms.txt` — AI-discovery index following the llms.txt standard
- `llms-full.txt` — complete inlined library reference for AI context windows
- Exported `formatDate`, `isDateString`, `trimText` from public package index
- Modern `exports` field in `package.json` for proper ESM/CJS resolution and `styles.css` import alias
- `.node-version` pinned to Node 22

### Changed
- Peer dependencies updated: `react >=18`, `react-dom >=18`, `next >=13`, `tailwindcss >=3.0.0`
- `react` and `react-dom` moved from `dependencies` to `devDependencies` (they are peer deps and should not be bundled)
- Dev dependency `@types/react` and `@types/react-dom` updated to v19
- CI matrix updated to Node 20/22 (Node 18 is EOL)
- Consolidated FAQ.md content into TROUBLESHOOTING.md
- SECURITY.md updated to reflect supported versions (4.0.x, 4.1.x)
- README restructured: removed duplicate prop table, added documentation index, updated prerequisites

## [4.0.8] - 2025-09-25

### Fixed
- Resolved Rules of Hooks violations by moving `useMemo` hooks before early returns

## [3.8.0] - 2024-10-15

### 🚀 **Added**
- Comprehensive CI/CD pipeline with GitHub Actions
- Pull Request and Issue templates for consistent contributions
- Security policy and vulnerability reporting process
- Code of Conduct for community guidelines
- AI Agent contribution guide (AGENTS.md)
- Enhanced development scripts and validation pipeline
- Editor configuration and VS Code settings
- Star encouragement for community support

### 📚 **Documentation**
- Added AGENTS.md for AI agent contribution guidelines
- Enhanced CONTRIBUTING.md with detailed processes
- Added SECURITY.md for vulnerability reporting
- Added CODE_OF_CONDUCT.md for community standards
- Created comprehensive FAQ section
- Added build process documentation with performance benchmarks
- Added TESTING.md for testing strategy and coverage
- Added CHANGELOG.md for version history tracking
- Added BUILD.md for build process documentation

### 🛠️ **Developer Experience**
- Added extensive development scripts to package.json
- Added .editorconfig for consistent coding styles
- Enhanced validation pipeline with `npm run validate`
- Improved linting and type checking workflows
- Added performance monitoring and optimization tools

### 🔧 **Technical Improvements**
- Fixed linting issues and improved code quality
- Updated contact information to cassidyblay@gmail.com
- Removed funding references for small library approach
- Enhanced package.json with better scripts and metadata
- Improved CI/CD workflow for better automation

### 📦 **Package**
- Updated package files to exclude documentation from NPM
- Enhanced build process with better optimization
- Improved bundle analysis and size monitoring
- Better TypeScript declarations and ESM support

## [Unreleased]

### 🛠️ **Developer Experience**
- Added `npm run validate` for complete code quality checks
- Added `npm run type-check` for TypeScript validation
- Enhanced package.json scripts for better development workflow
- Added EditorConfig for consistent coding styles
- Added VS Code settings for optimal development experience

## [3.7.2] - 2024-09-01

### ✨ **Added**
- Enhanced TypeScript support with strict type checking
- Improved accessibility features and ARIA labels
- Better mobile responsiveness and touch interactions
- Enhanced dark mode support across all components
- Improved error handling and loading states

### 🐛 **Fixed**
- Fixed pagination component rendering issues
- Resolved memory leaks in table updates
- Fixed sorting functionality edge cases
- Improved column resizing behavior

### 📚 **Documentation**
- Updated API documentation with new features
- Added comprehensive examples in EXAMPLES.md
- Enhanced TypeScript usage examples
- Improved troubleshooting guide

### 🔧 **Technical Improvements**
- Optimized bundle size and tree-shaking
- Enhanced performance with better memoization
- Improved CSS-in-JS handling
- Better peer dependency management

## [3.7.1] - 2024-07-15

### 🐛 **Fixed**
- Critical bug fix for table rendering in SSR environments
- Fixed action dropdown positioning issues
- Resolved search functionality edge cases
- Fixed column hiding/showing functionality

### 📱 **Mobile Improvements**
- Enhanced mobile responsiveness
- Improved touch interactions
- Better keyboard navigation on mobile devices

## [3.7.0] - 2024-05-01

### 🚀 **Added**
- New `formatHeader` prop for custom header formatting
- Enhanced `customClassNames` support for all components
- Improved TypeScript generics support
- Better integration with Next.js App Router

### 📊 **Enhanced**
- Improved data formatting capabilities
- Better date and time handling
- Enhanced array and object display
- Improved link detection and rendering

### ♿ **Accessibility**
- Enhanced screen reader support
- Improved keyboard navigation
- Better ARIA label implementation
- WCAG 2.1 AA compliance improvements

## [3.6.0] - 2023-12-01

### 🚀 **Added**
- Dark mode support with system preference detection
- Enhanced sorting capabilities
- Improved pagination component
- Better loading states and skeleton screens

### 🎨 **Styling**
- Complete Tailwind CSS integration
- Customizable styling system
- Responsive design improvements
- Better mobile experience

### 📦 **Build**
- Optimized bundle size
- Better tree-shaking support
- Improved TypeScript definitions
- Enhanced build process

## [3.5.0] - 2023-11-01

### 🚀 **Added**
- Action dropdown functionality
- Row click handlers
- Custom row rendering support
- Enhanced search capabilities

### 🔧 **Technical**
- Improved TypeScript support
- Better error handling
- Enhanced performance optimizations
- Memory leak fixes

## [3.0.0] - 2023-10-01

### 💥 **Breaking Changes**
- Complete rewrite with TypeScript
- New component architecture
- Updated API and prop structure
- Enhanced customization options

### 🚀 **Added**
- Full TypeScript support
- Better customization options
- Improved performance
- Enhanced accessibility

### 📚 **Documentation**
- Comprehensive API documentation
- Usage examples
- Migration guide

## [2.x.x] - 2023-08-01

### 🚀 **Added**
- Pagination support
- Sorting functionality
- Search capabilities
- Loading states

## [1.x.x] - 2023-06-01

### 🚀 **Added**
- Initial table component
- Basic functionality
- React support

---

## 📝 **Types of Changes**

- **🚀 Added** - New features
- **🐛 Fixed** - Bug fixes
- **💥 Breaking Change** - Breaking changes
- **📚 Documentation** - Documentation updates
- **🎨 Styling** - Style and UI updates
- **📱 Mobile** - Mobile and responsive improvements
- **♿ Accessibility** - Accessibility enhancements
- **🔧 Technical** - Technical improvements
- **📦 Build** - Build and dependency updates

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🙏 **Contributors**

Thanks to all the contributors who have helped make this project better!

---

**Legend:**
- 🚀 Features
- 🐛 Bug fixes
- 📚 Documentation
- 🎨 Styling
- 📱 Mobile
- ♿ Accessibility
- 🔧 Technical
- 📦 Build
