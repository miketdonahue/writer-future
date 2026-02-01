# AGENTS

## Project Status: Proof of Concept

This is a **POC/prototyping project**. Speed of iteration matters more than production-grade practices:

- **No database migrations** — Edit `src/server/db/schema.ts` directly, then run `pnpm db:push` to sync changes. Do NOT use `drizzle-kit generate` or create migration files.
- **No test suite** — Tests are not configured. Don't try to run Jest, Vitest, or any test runner.
- **Rapid iteration** — Favor working code over perfect abstractions. Refactor later.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 + class-variance-authority |
| UI Primitives | Base UI (`@base-ui/react`) — **NOT Radix** |
| Icons | Lucide React |
| Forms | React Hook Form + Zod validation |
| State | Zustand |
| API | tRPC with React Query + SuperJSON |
| Database | PostgreSQL via Drizzle ORM |
| AI | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) |
| Animation | Motion library |
| Flow Diagrams | @xyflow/react |
| Linting | Biome |
| Package Manager | pnpm |

## Critical Workflows

```bash
# Development
pnpm dev                    # Start dev server

# Build & Deploy
pnpm build                  # Production build (run before committing)

# Code Quality (use these, NOT eslint/prettier)
pnpm lint                   # Run Biome linter
pnpm lint:fix               # Fix linting issues
pnpm format                 # Format code with Biome
pnpm check                  # Run all Biome checks
pnpm check:fix              # Fix all Biome issues

# Database
pnpm db:up                  # Start PostgreSQL container
pnpm db:down                # Stop database
pnpm db:push                # Push schema changes to database
pnpm db:seed                # Seed database
pnpm db:studio              # Open Drizzle Studio
```

## Architecture Rules

### Database

- Schema lives in `src/server/db/schema.ts`
- **Do NOT create Drizzle migrations.** This is a POC project. Update the schema directly and use `pnpm db:push` to apply changes.
- Database connection via `src/server/db/index.ts`

### API Layer

- All API routes use tRPC (routers in `src/server/trpc/routers/`)
- Use `Zod` for all input validation
- tRPC uses SuperJSON for serialization (dates, Maps, etc. work automatically)

### Components

- All components must be functional components with TypeScript
- Server Components by default; add `"use client"` only when needed
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
├── app/                    # Next.js App Router pages
│   └── api/trpc/          # tRPC API route handler
├── components/
│   └── ui/                # Reusable UI primitives (Base UI wrappers)
├── hooks/                 # Custom React hooks (use-*.tsx)
├── lib/                   # Utility functions
├── server/
│   ├── db/                # Drizzle schema, connection, seeds
│   └── trpc/              # tRPC router definitions
└── trpc/                  # Client-side tRPC setup
```

## Development Tools

- **Context7 MCP Server**: Use for querying up-to-date documentation and code examples for any library in this stack.
- **Drizzle Studio**: Visual database browser (`pnpm db:studio`)

## Common Pitfalls to Avoid

1. **Don't use ESLint or Prettier** — this project uses Biome exclusively
2. **Don't use Radix UI patterns** — we use Base UI
3. **Don't create database migrations** — use `db:push` directly
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