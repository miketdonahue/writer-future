# Writer Platform

A modern writing platform built with Next.js 16, featuring workflow management and AI-powered writing capabilities.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 with class-variance-authority
- **UI Components**: Base UI primitives (`@base-ui/react`), Lucide icons, custom shadcn-style components
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **AI**: Vercel AI SDK with OpenAI provider
- **Animation**: Motion library
- **Flow Diagrams**: @xyflow/react
- **Linting/Formatting**: Biome

## Development Tools

- **Context7 MCP Server**: Available for finding documentation about libraries used in this project. Use it to query up-to-date documentation and code examples for any library or framework.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── workflows/         # Workflow pages
├── components/
│   └── ui/                # Reusable UI primitives
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Biome |
| `pnpm check` | Run all Biome checks |
| `pnpm check:fix` | Fix all Biome issues |

## Database

- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: `src/server/db/schema.ts`
- **Important**: This is a POC project. Do NOT create Drizzle migrations. Update the schema directly and apply changes manually to the database.

## Code Style

Enforced via Biome:
- Double quotes for strings
- Semicolons always
- 2-space indentation
- 100 character line width
- ES5 trailing commas
- Unused imports are errors

## Conventions

### File Organization
- Page components in `src/app/` using App Router conventions
- Reusable UI components in `src/components/ui/`
- Feature components in `src/components/`
- **Filenames**: Use hyphen-case only (e.g. `my-component.tsx`, `use-my-hook.ts`). No camelCase, PascalCase, or snake_case for filenames.

### Components
- Use functional components with TypeScript
- Props types defined inline or as separate `type` declarations
- Prefer composition over inheritance
- Use `class-variance-authority` for component variants
- We use **Base UI** (not Radix). Patterns like Radix `asChild` are not applicable; prefer Base UI's APIs and wrappers in `src/components/ui/`.

### Styling
- Tailwind CSS utility classes
- `cn()` helper from `@/lib/utils` for conditional classes
- Keep styles co-located with components

