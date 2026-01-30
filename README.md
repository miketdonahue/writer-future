This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Backend API**: tRPC v11 (type-safe APIs)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query (via tRPC)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker and Docker Compose

### Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory with the following:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=writer_platform
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

# Database Connection String (used by Drizzle)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/writer_platform
```

3. **Start the PostgreSQL database:**

```bash
docker compose up -d db
```

4. **Run database migrations:**

```bash
pnpm db:generate
pnpm db:migrate
```

5. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Commands

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Apply migrations to the database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

### Project Structure

- `src/app/api/trpc/[trpc]/route.ts` - tRPC API route handler
- `src/server/trpc/` - tRPC server setup (context, routers)
- `src/server/db/` - Drizzle ORM schema and client
- `src/trpc/` - tRPC React client and provider

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
