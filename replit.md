# Habit Tracker Application

## Overview

This is a modern habit tracking web application built with React, TypeScript, Express, and PostgreSQL. The application helps users build better habits by tracking daily completions, maintaining streaks, and unlocking achievements. It features a mobile-first design with a clean, responsive interface using Tailwind CSS and shadcn/ui components.

The application stores habit data, completion records, and achievement progress, providing users with calendar views, streak tracking, and gamification elements to encourage consistency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the build tool and development server.

**UI Component System**: The application uses shadcn/ui components (Radix UI primitives) with the "new-york" style preset. Components follow a modular pattern with consistent styling through Tailwind CSS and CSS variables for theming.

**State Management**: Uses React Query (@tanstack/react-query) for server state management and local React hooks for component-level state. Data persistence is currently implemented using localStorage through a custom storage service (`localStorageService`).

**Routing**: Single-page application with tab-based navigation managed through component state. The main App component conditionally renders different pages (Habits, Calendar, Achievements, Settings, Todo) based on the active tab.

**Animation**: Framer Motion is used extensively for animations including confetti effects, achievement unlocks, and smooth transitions.

**Styling**: Tailwind CSS with custom configuration including:
- Dark mode support via class-based theming
- Custom color system using HSL variables
- Custom border radius values
- Elevation system for hover/active states
- Mobile-first responsive design with safe area insets

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Structure**: RESTful API pattern with routes prefixed with `/api`. The application currently has a minimal backend implementation with route registration in `server/routes.ts`.

**Storage Layer**: Abstracted storage interface (`IStorage`) with an in-memory implementation (`MemStorage`). The interface is designed to support CRUD operations for users and can be extended for habits, completions, and achievements.

**Database Ready**: While currently using in-memory and localStorage storage, the application is configured for PostgreSQL via Drizzle ORM with connection pooling through @neondatabase/serverless.

**Development Environment**: In development mode, Vite middleware is integrated into the Express server for hot module replacement and seamless frontend development.

### Data Model

**Schemas** (defined in `shared/schema.ts`):

- **Habit**: Tracks habit details including title, description, frequency type (daily/weekly/custom), custom days, current streak, best streak, and creation date
- **Completion**: Records when habits are completed (habitId, date, completed status)
- **Achievement**: Gamification system with achievements categorized by streak, completion, habit, and consistency milestones

**Frequency Types**: Supports daily, weekly, and custom day patterns for habit scheduling.

**Achievement System**: Predefined achievements in `client/src/lib/achievements.ts` with unlock logic based on user behavior (habit creation, completions, streaks, perfect days/weeks/months).

### Deployment Architecture

**Build Process**: 
- Frontend builds to `dist` directory using Vite
- Server runs from TypeScript source using tsx
- Production mode serves static files from dist

**Deployment Target**: Configured for Replit autoscale deployment. The build runs `npm run build` to generate static assets, and the production server runs `npm run start` using tsx to execute the TypeScript server directly. The Express server serves both API routes (prefixed with `/api`) and static frontend assets from the `dist` directory on port 5000.

**Environment**: 
- Uses cross-env for environment variable management across platforms
- Server binds to port 5000 (configurable via PORT environment variable)
- Development server configured with `allowedHosts: true` for Replit proxy compatibility
- DATABASE_URL environment variable configured for PostgreSQL connection

**Recent Changes (October 6, 2025)**: Migrated from Vercel to Replit. Updated production static file path from `public` to `dist` directory in server/vite.ts. Changed start script to use tsx instead of compiled JavaScript for easier deployment.

## External Dependencies

### Database

**PostgreSQL**: Configured via Drizzle ORM with Neon serverless driver (@neondatabase/serverless). Connection string expected via `DATABASE_URL` environment variable. Database schema migrations are managed in the `migrations` directory.

### Third-Party UI Libraries

- **Radix UI**: Complete set of accessible component primitives (accordion, dialog, dropdown, popover, select, tabs, toast, etc.)
- **Lucide React**: Icon library used throughout the application
- **cmdk**: Command menu component
- **Framer Motion**: Animation library for transitions and effects
- **embla-carousel-react**: Carousel/slider component
- **React Day Picker**: Calendar date picker component
- **Recharts**: Charting library (installed but not yet implemented in visible components)

### Form Handling

- **React Hook Form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **Zod**: Schema validation (used with drizzle-zod for type-safe database schemas)

### Utilities

- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Utility for managing component variants
- **clsx & tailwind-merge**: Utility for conditional className composition
- **jsPDF**: PDF export functionality for habit reports
- **nanoid**: Unique ID generation

### Session Management

**connect-pg-simple**: PostgreSQL session store for Express sessions (installed but session management not yet fully implemented).

### Development Tools

- **Vite plugins**: Runtime error overlay, cartographer (for Replit), dev banner
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Type checking with strict mode enabled
- **Drizzle Kit**: Database migration and schema management tool

### Fonts

**Google Fonts**: Inter (weights 300-700) for body text and DM Mono (weights 400-500) for monospaced text, loaded from Google Fonts CDN.