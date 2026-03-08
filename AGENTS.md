# AI Agent Guide — nextjs-reusable-table

This file is read by AI coding assistants (Cursor, Claude Code, GitHub Copilot, etc.) when contributing to this library.

For full coding standards, setup instructions, and contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Quick Commands

```bash
npm run check:fix   # fix all lint + format issues (run this first)
npm run type-check  # TypeScript validation
npm run test        # Jest test suite
npm run build       # tsup + Tailwind CSS build
npm run validate    # all of the above in sequence
```

## Project Layout

```
src/components/           # React components (TableComponent, ActionDropdown, …)
src/components/__tests__/ # Jest test files (*.test.tsx)
src/types/index.ts        # All TypeScript interfaces — add new ones here
src/utils/helpers.ts      # Pure utility functions
src/styles/tableStyles.css # Scoped @layer rtbl { .rtbl-* } CSS only
src/index.ts              # Public exports
.cursor/rules/            # Cursor IDE rules (auto-attached per file type)
skills/                   # agentskills.io installable skill
```

## AI-Specific Rules

### What to always do
- Check existing patterns in the component being modified before adding new code
- Add any new prop to `src/types/index.ts` (the `TableProps<T>` or relevant sub-interface), never inline
- Verify `useMemo`/`useCallback`/`useState` are called before any early return (Rules of Hooks)
- Run `npm run check:fix && npm run test` before declaring a task complete

### What never to do
- Do not add `@import` of any third-party CSS to `src/styles/tableStyles.css`
- Do not place CSS rules outside `@layer rtbl { ... }` in `tableStyles.css`
- Do not introduce bare element selectors (e.g., `table { }`, `th { }`) — use `.rtbl-table th`
- Do not use `any` type — Biome will reject it
- Do not omit `"use client"` on any component file
- Do not move React hooks below conditional branches

### CSS Style Isolation
The `dist/index.css` ships only `.rtbl-*` classes wrapped in `@layer rtbl`.
The `react-loading-skeleton` CSS is intentionally excluded from the CSS bundle and loaded on-demand by `TableSkeleton.tsx`. This was the source of style leaking in earlier versions — do not revert this.

### Testing
Every changed component needs tests. Minimum: render test, interaction test, edge case. See `.cursor/rules/testing.mdc` for mock patterns.

### Tailwind Consumer Setup
When adding new Tailwind utility classes to JSX, document them in `skills/nextjs-reusable-table/SKILL.md` under the Troubleshooting section so consumers know to add the library to their `content` config.

## Skill & AI Discovery Files

This library ships an [agentskills.io](https://agentskills.io) skill in `skills/nextjs-reusable-table/` and `llms.txt` / `llms-full.txt` for AI discovery. Keep these updated when the public API changes.

## Before Publishing

```bash
npm run validate       # lint + type-check + tests + build
npm version patch      # or minor/major
git push && git push --tags
npm publish
```
