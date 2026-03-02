# AGENTS

## Project Status: Proof of Concept

This is a **POC/prototyping project**. Speed of iteration matters more than production-grade practices:

- **No test suite** — Tests are not configured. Don't try to run Jest, Vitest, or any test runner.
- **Rapid iteration** — Favor working code over perfect abstractions. Refactor later.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite 6 |
| Framework | React 19 |
| Routing | React Router 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 + class-variance-authority |
| UI Primitives | Base UI (`@base-ui/react`) — **NOT Radix** |
| Icons | Lucide React |
| Forms | React Hook Form + Zod validation |
| State | Zustand |
| Animation | Motion library |
| Flow Diagrams | @xyflow/react |
| Linting | Biome |
| Package Manager | pnpm |

## Critical Workflows

```bash
# Development
pnpm dev                    # Start Vite dev server (localhost:3000)

# Build & Deploy
pnpm build                  # Production build (run before committing)
pnpm preview                # Preview production build locally

# Code Quality (use these, NOT eslint/prettier)
pnpm lint                   # Run Biome linter
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Biome
pnpm check                  # Run all Biome checks
pnpm check:fix              # Fix all Biome issues
```

## Architecture Rules

### Components

- All components must be functional components with TypeScript
- All components are client-side (no server components)
- Use the `@/components/ui` alias for shared UI primitives
- Use `cn()` from `@/lib/utils` for conditional class merging

### UI Library

- We use **Base UI** (`@base-ui/react`), NOT Radix UI
- Patterns like Radix's `asChild` do not apply here
- Check `src/components/ui/` for existing component wrappers before creating new ones

### Styling

- Tailwind CSS utility classes only
- Use `class-variance-authority` for component variants
- Keep styles co-located with components
- 100-character line width limit

### UI Design System

This project follows a specific visual language. Apply these patterns consistently:

#### Typography
- **Section headers:** `uppercase tracking-tight font-semibold` — bold, tight, authoritative
- **Titles:** `text-sm font-medium leading-snug`
- **Descriptions:** `text-xs leading-relaxed text-muted-foreground/80`
- **Metadata/timestamps:** `text-[11px] text-muted-foreground/70`

#### Spacing
- **Panel padding:** `px-5 py-4` — generous breathing room
- **List item padding:** `px-4 py-3.5`
- **Gap between sections:** `gap-3` to `gap-5`
- **Margins between major sections:** `mb-5`

#### Border Radius
| Element | Radius | Class |
|---------|--------|-------|
| Panels/containers | Large, soft | `rounded-2xl` |
| List items, cards | Medium-large | `rounded-xl` |
| Buttons (icon) | Medium-large | `rounded-xl` |
| Pill buttons/badges | Full | `rounded-full` |

#### Borders & Depth
- **Panel borders:** Subtle with `border-border/60`
- **Shadows:** Minimal `shadow-sm` on panels only
- **Separators:** Use `opacity-60` for subtler dividers
- **List separation:** Rely on spacing, not dividing borders

#### Interactive States
- **Hover (list items):** `hover:bg-muted/40` — subtle, not harsh
- **Selected state:** `bg-muted/60`
- **Active pill buttons:** Inverted colors `bg-foreground text-background`
- **Inactive pill buttons:** Ghost variant with `text-muted-foreground hover:bg-muted`

#### Component Patterns
- **Search inputs:** No visible border, icon left-aligned, generous placeholder text
- **Filter pills:** Full-round with `h-8 px-5 text-xs font-medium rounded-full`
- **Icon buttons:** Square with `size-9 rounded-xl`
- **Badges:** Pill-shaped with `rounded-full px-2 py-0.5 text-[10px] font-medium`

#### Reference Implementation
See `src/app/inbox/page.tsx` for the canonical example of these patterns.

## Code Style

Enforced via Biome (do not override):

| Rule | Value |
|------|-------|
| Quotes | Double quotes (`"`) |
| Semicolons | Always |
| Indentation | 2 spaces |
| Line width | 100 characters |
| Trailing commas | ES5 style |
| Unused imports | Error (auto-removed) |

### File Naming

- **Always use hyphen-case** for filenames: `my-component.tsx`, `use-my-hook.ts`
- Never use camelCase, PascalCase, or snake_case for filenames
- Hooks must start with `use-` prefix

### Code Comments

- Comments should be rare; explain "why," not "what"
- Document assumptions, side effects, and non-obvious workarounds
- Link to references for complex algorithms

## Project Structure

```
src/
├── app/                    # Page components (routes defined in App.tsx)
├── components/
│   └── ui/                # Reusable UI primitives (Base UI wrappers)
├── hooks/                 # Custom React hooks (use-*.tsx)
├── lib/                   # Utility functions
├── stores/                # Zustand state stores
├── App.tsx                # Root component with React Router routes
└── main.tsx               # Vite entry point
```

## Development Tools

- **Context7 MCP Server**: Use for querying up-to-date documentation and code examples for any library in this stack.

## Common Pitfalls to Avoid

1. **Don't use ESLint or Prettier** — this project uses Biome exclusively
2. **Don't use Radix UI patterns** — we use Base UI
3. **Don't use Next.js imports** — use React Router (`react-router-dom`) for routing
4. **Don't use Jest** — no test runner is configured yet
5. **Don't use npm or yarn** — use pnpm exclusively
6. **Don't use single quotes** — Biome enforces double quotes

## Available Skills

<skills_system priority="1">

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>brainstorming</name>
<description>"You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."</description>
<location>global</location>
</skill>

<skill>
<name>dispatching-parallel-agents</name>
<description>Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies</description>
<location>global</location>
</skill>

<skill>
<name>executing-plans</name>
<description>Use when you have a written implementation plan to execute in a separate session with review checkpoints</description>
<location>global</location>
</skill>

<skill>
<name>finishing-a-development-branch</name>
<description>Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup</description>
<location>global</location>
</skill>

<skill>
<name>receiving-code-review</name>
<description>Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation</description>
<location>global</location>
</skill>

<skill>
<name>requesting-code-review</name>
<description>Use when completing tasks, implementing major features, or before merging to verify work meets requirements</description>
<location>global</location>
</skill>

<skill>
<name>subagent-driven-development</name>
<description>Use when executing implementation plans with independent tasks in the current session</description>
<location>global</location>
</skill>

<skill>
<name>systematic-debugging</name>
<description>Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes</description>
<location>global</location>
</skill>

<skill>
<name>using-git-worktrees</name>
<description>Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification</description>
<location>global</location>
</skill>

<skill>
<name>using-superpowers</name>
<description>Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions</description>
<location>global</location>
</skill>

<skill>
<name>verification-before-completion</name>
<description>Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always</description>
<location>global</location>
</skill>

<skill>
<name>writing-plans</name>
<description>Use when you have a spec or requirements for a multi-step task, before touching code</description>
<location>global</location>
</skill>

<skill>
<name>writing-skills</name>
<description>Use when creating new skills, editing existing skills, or verifying skills work before deployment</description>
<location>global</location>
</skill>

<skill>
<name>baseline-ui</name>
<description>Enforces an opinionated UI baseline to prevent AI-generated interface slop</description>
<location>global</location>
</skill>

<skill>
<name>frontend-design</name>
<description>Use when building web components, pages, or applications - creates distinctive, production-grade interfaces that avoid generic AI aesthetics</description>
<location>global</location>
</skill>

<skill>
<name>interaction-design</name>
<description>Use when adding polish to UI interactions, implementing loading states, or designing microinteractions and transitions</description>
<location>global</location>
</skill>

<skill>
<name>interface-design</name>
<description>Use for interface design - dashboards, admin panels, apps, tools. NOT for marketing design (landing pages, campaigns)</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>