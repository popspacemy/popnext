# Popnext

A minimal, modular utilities library for Next.js applications with TypeScript support.

## Features

- **AI Integration** - Built-in AI SDK utilities and handlers
- **Authentication** - Better-auth integration with client/server components  
- **Database** - Drizzle ORM utilities and PostgreSQL support
- **Context Store** - State management utilities
- **Logger** - Pino-based structured logging
- **Validators** - Zod-based input validation
- **Metadata** - Metadata handling utilities
- **Middleware** - Server middleware for auth, error handling, logging

## Installation

```bash
npm install popnext
# or
pnpm add popnext
# or  
yarn add popnext
```

### Peer Dependencies

Popnext requires the following peer dependencies to be installed in your project:

```bash
npm install @ai-sdk/provider ai better-auth date-fns date-fns-tz drizzle-orm next pino postgres react react-dom short-uuid validator zod
```

## Usage

Popnext is designed with modular exports, allowing you to import only what you need:

```typescript
// Core utilities
import { createLogger, createValidator } from 'popnext/core'

// Client-side utilities
import { ClientUtils } from 'popnext/client'

// Server middleware
import { authMiddleware, errorHandler } from 'popnext/server/middlewares'

// Authentication
import { createAuthClient } from 'popnext/core/auth/client'

// AI utilities
import { AIHandler } from 'popnext/core/ai'

// Database utilities
import { createDB } from 'popnext/core/db'

// Types and schemas
import type { AuthUser } from 'popnext/types'
import { commonSchema } from 'popnext/schemas'
```

## Available Exports

- `popnext` - Main entry point with all utilities
- `popnext/client` - Client-side React utilities
- `popnext/core` - Core utilities (AI, auth, db, logger, validators)
- `popnext/core/ai` - AI integration utilities
- `popnext/core/auth` - Authentication utilities
- `popnext/core/auth/client` - Client-side auth utilities
- `popnext/core/auth/schema` - Auth validation schemas
- `popnext/core/context-store` - Context/state management
- `popnext/core/db` - Database utilities
- `popnext/core/logger` - Logging utilities
- `popnext/core/metadata` - Metadata handling
- `popnext/core/validators` - Input validation
- `popnext/constants` - Application constants
- `popnext/server` - Server-side utilities
- `popnext/server/middlewares` - Server middleware
- `popnext/types` - TypeScript type definitions
- `popnext/utils` - General utility functions
- `popnext/schemas` - Validation schemas

## Requirements

- Node.js 18+
- Next.js 15+
- React 19+
- TypeScript 5+

## License

MIT

## Author

akmalmzamri