# AGENTS

## Commands

- `npm run dev` / `build` / `test` / `lint` / `format`
- `npm run lint:fix` / `format:check` / `test:watch`
- Single test: `npx vitest run <path>`

## Key Conventions

- **`"use client"`** only on files that need it: hooks, event handlers, browser APIs, context, or Radix/shadcn primitives. Pure presentational components (no hooks, no events, no browser APIs) should omit it.
- **Named exports only.** No default exports except Next.js page components. Both `export function` and `export const` are valid.
- **`import type`** for all type imports. Types centralized in `types/`; props interfaces co-located above the component.
- **Prefer `@/*` alias** over relative paths.
- **No external state library.** Auth via `AuthProvider` context; local state via `useState` and custom hooks; persistence via `useLocalStorageState`.

## Error Handling

All toasts go through **`lib/error-handler.ts`** (`showSuccess`, `showError`, `handleError`, `handleSupabaseError`), which wraps **sonner** internally. Never import sonner directly in hooks or components.

## Code Quality

- **Types:** No `any` without justification; prefer `unknown`, generics, or narrowing.
- **A11y:** Semantic HTML, keyboard navigation, visible focus states, ARIA labels on custom controls.
- **Security:** Sanitize untrusted HTML. No secrets in localStorage unless the existing auth flow requires it.
- **Performance:** No re-render storms, heavy work in render, or unbounded lists — virtualize/paginate.
- **Components:** Use shadcn/ui primitives; don't reimplement existing patterns.
- **Resilience:** Handle empty and error states. Optimistic UI where appropriate.
- **One component per file.** Extract types and utils into separate modules.
- **Reuse:** Check for existing helpers before creating new ones.
- **Colors:** Tailwind classes only — no hex/RGB literals.

## Testing

- Co-located `__tests__/*.test.ts(x)`. Coverage: `components/**`, `hooks/**`, `lib/**`; Supabase excluded.
- **Components:** `render()` + `screen` queries (`getByRole`/`getByText`/`getByTestId`). **Hooks:** `renderHook()` + `act()`.
- **Mocks:** `vi.mock()` for modules, `vi.fn()` for callbacks. Sonner mock must precede its import.
- Factory helpers for mock objects. `vi.clearAllMocks()` in `beforeEach`.
- Test success paths, error/empty states, and edge cases.

## Comments

Only comment **why**, never **what**. Acceptable: non-obvious logic, architectural decisions, edge cases, external constraints. If code needs a "what" comment, rename or refactor instead.

Every file must have a short `@fileoverview`. Include an `@example` only when it shows a non-obvious usage pattern (e.g., hook call with arguments, utility with parameters). Skip `@example` for files where usage is self-evident from the name (page components, layouts, route handlers, config files).
