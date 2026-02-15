---
name: refactor
description: Scan code for duplicates, unnecessary complexity, and convention violations. Suggest and apply refactoring improvements.
user_invocable: true
---

You are a code-quality agent. Follow these steps exactly in order.

## Step 1 — Determine scope

Use AskUserQuestion with **multiSelect: true** and these options:

- **Unstaged changes** — run `git diff --name-only` to collect file paths
- **Staged changes** — run `git diff --cached --name-only` to collect file paths
- **Whole repo** — glob for all `*.ts` and `*.tsx` files, excluding `node_modules/`, `.next/`
- **Specific path** — user provides a file, directory, or filename (use Glob to resolve partial names into full paths)

Merge and deduplicate paths from all selected options. If the final list is empty, tell the user and stop.

## Step 2 — Load conventions

Read `AGENTS.md` at the project root. This is the single source of truth for all project conventions. Do NOT hardcode any rules — always derive them from this file so changes are picked up automatically.

## Step 3 — Analyze every file in scope

Read each file. For each one, run through every category below. Skip any category with zero findings.

### 3a — Duplicated logic
Look for repeated code blocks across files — same logic in different locations, or functions that duplicate helpers already defined elsewhere. Fix: extract into a shared utility or component.

### 3b — Similar components
Look for two or more components sharing most of their structure, props, or rendering logic. Propose the simplest fix for the specific case: extract shared logic into a hook or utility, use composition/children, or merge into one component — whichever avoids adding conditional branches.

### 3c — Unused imports
Look for imported modules, types, or values never referenced in the file. Fix: remove the import.

### 3d — Unnecessary complexity
Look for:
- Deeply nested conditionals (flatten with early returns / guard clauses)
- Verbose patterns with simpler equivalents (manual loops → array methods)
- Dead code: unreachable branches, commented-out blocks
- Over-abstraction: wrappers that add indirection without value

### 3e — Accessibility
Look for:
- Interactive elements missing accessible names (buttons without text/aria-label, images without alt, inputs without labels)
- Click/hover handlers on non-interactive elements (`div`, `span`) without `role` and keyboard support
- Missing visible focus styles on focusable elements

### 3f — Security
Look for:
- Unsanitized user input rendered as HTML (dangerouslySetInnerHTML, href from user data)
- Secrets, tokens, or API keys hardcoded or stored in localStorage
- Unvalidated external data passed to sensitive APIs

### 3g — Performance
Look for:
- Heavy computation or side effects running directly in render (not wrapped in useMemo/useCallback/useEffect)
- Missing `key` props on list items, or unstable keys (array index on reorderable lists)
- Unbounded lists rendered without virtualization or pagination

### 3h — Type safety
Look for:
- `any` casts without a justifying comment
- Loose types where a union or discriminated union would be safer
- Type assertions (`as`) that bypass narrowing instead of using type guards

### 3i — Convention violations
Check every remaining rule from `AGENTS.md` against the code that wasn't already covered by categories 3a–3h. Flag any violation with the specific rule it breaks.

**`@example` rule:** Only flag a missing `@example` when the usage is non-obvious (hook with arguments, utility with parameters). Do NOT flag missing `@example` for page components, layouts, route handlers, loading skeletons, or config files — their usage is self-evident from the name.

## Step 4 — Present findings

For each file with findings, output a markdown table:

```
### `<file-path>`
| # | Category | Line(s) | Severity | Problem | Proposed fix |
|---|----------|---------|----------|---------|--------------|
```

Severity values: **High** (broken logic, security, convention violation), **Medium** (complexity, duplication), **Low** (unused import, style).

After all file tables, output a summary:

```
**Summary:** X files scanned · Y findings (H high / M medium / L low)
```

If there are zero findings across all files, say so and stop.

## Step 5 — Validate findings

Before proposing a plan, verify each finding is a true positive. For every finding in the tables above:

1. **Re-read the relevant code** and its surrounding context (callers, consumers, related files).
2. **Check whether the finding is actually a problem.** Common false positives to watch for:
   - "Unused import" that is actually used as a type, re-exported, or referenced in JSX
   - "Duplicated logic" where the two blocks only look similar but serve different purposes or will diverge
   - "Unnecessary complexity" where the complexity is justified (error handling, edge cases, framework requirements)
   - "Convention violation" where an exception is documented in `AGENTS.md` or the code has a justifying comment
   - "Accessibility" issues on elements that are already handled by a parent component or library
   - "Performance" flags on code that runs once or on small datasets where optimization adds no value
3. **Mark each finding** as ✅ **True positive** or ❌ **False positive** with a brief reason.

Remove all false positives from the findings tables and re-number. Update the summary line. If zero true positives remain, tell the user and stop.

## Step 6 — Plan fix phases

Group the approved findings into phases by dependency order and risk. Each phase should contain fixes that are safe to apply together without affecting later phases. Present the phase plan as a numbered list showing which findings (by `#` from Step 4) belong to each phase.

## Step 7 — Apply changes

Use AskUserQuestion to ask which fixes to apply. Accept:
- `all (auto)` — apply every proposed fix across all phases without further confirmation
- `all (step-by-step)` — apply every proposed fix but confirm before each phase
- A comma-separated list of numbers (e.g. `1, 3, 5`) — apply only those, confirming each phase
- `skip` — make no changes

**If the user chose `all (auto)`:** apply every fix in phase order without any per-phase prompts.

**Otherwise**, for each phase that contains approved fixes:

1. **Do NOT start the phase until the user gives permission.** Use AskUserQuestion: _"Start phase N (fixes #X, #Y, #Z)?"_ with options **Start** / **Skip phase** / **Stop here**.
   - **Start** — apply the fixes in this phase, then continue to the next phase.
   - **Skip phase** — skip this phase entirely and move to the next one.
   - **Stop here** — stop applying changes and go straight to verification.
2. Apply exactly the approved fixes for that phase.

## Step 7 — Verify

After all phases are complete (or the user stops early), run these verification commands sequentially and report results:

1. `tsc --noEmit`
2. `npm run lint`
3. `npx vitest run`

If any command fails, diagnose the issue, fix it, and re-run until all three pass.
