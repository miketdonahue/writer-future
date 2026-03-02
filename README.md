# Writer Future

A modern React application built with Vite for fast development and optimized production builds.

## Tech Stack

- **Build Tool**: Vite 6
- **Framework**: React 19
- **Routing**: React Router 7
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **UI Components**: Base UI
- **Language**: TypeScript 5.9

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Commands

- `pnpm dev` - Start Vite development server with hot module replacement
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm check` - Run all Biome checks

### Project Structure

```
src/
├── app/                    # Page components
├── components/
│   └── ui/                # Reusable UI primitives (Base UI wrappers)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── stores/                # Zustand state stores
├── App.tsx                # Root component with routes
└── main.tsx               # Vite entry point
```

## Learn More

To learn more about the technologies used in this project:

- [Vite Documentation](https://vite.dev/) - Fast build tool and dev server
- [React Documentation](https://react.dev/) - React library
- [React Router Documentation](https://reactrouter.com/) - Client-side routing
- [Tailwind CSS Documentation](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand Documentation](https://zustand-demo.pmnd.rs/) - State management

## Deployment

This is a static single-page application that can be deployed to any static hosting service:

1. Build the production bundle:
   ```bash
   pnpm build
   ```

2. The `dist/` directory contains the static files ready for deployment.

3. Deploy to services like:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - GitHub Pages
   - Any static file hosting service
