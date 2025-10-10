# QOL Backend - Refactored Structure

## 📁 Project Structure

```
qol-backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── env.ts       # Environment variables and app config
│   │
│   ├── controllers/     # Route handlers (business logic)
│   │   ├── studentController.ts
│   │   └── homeController.ts
│   │
│   ├── services/        # External API calls and data fetching
│   │   └── studentService.ts
│   │
│   ├── routes/          # Route definitions
│   │   ├── index.ts     # Main router
│   │   └── studentRoutes.ts
│   │
│   ├── middleware/      # Custom middleware
│   │   ├── corsConfig.ts
│   │   └── errorHandler.ts
│   │
│   ├── utils/           # Utility functions
│   │   └── validation.ts
│   │
│   ├── app.ts           # Express app setup
│   └── index.ts         # Server entry point
│
├── index.ts             # Root entry point
└── package.json
```

## 📚 File Descriptions

### **Config** (`src/config/`)

- **`env.ts`**: Centralized configuration including environment variables, API URLs, and port settings

### **Controllers** (`src/controllers/`)

- **`studentController.ts`**: Handles student-related requests
- **`homeController.ts`**: Handles the home page HTML response

### **Services** (`src/services/`)

- **`studentService.ts`**: Contains the logic for fetching student data from external API

### **Routes** (`src/routes/`)

- **`index.ts`**: Main router that combines all route modules
- **`studentRoutes.ts`**: Student-specific route definitions

### **Middleware** (`src/middleware/`)

- **`corsConfig.ts`**: CORS configuration
- **`errorHandler.ts`**: Global error handling and 404 handler

### **Utils** (`src/utils/`)

- **`validation.ts`**: Validation helper functions

### **Core Files**

- **`src/app.ts`**: Express application setup with middleware and routes
- **`src/index.ts`**: Server initialization and port listening
- **`index.ts`**: Root entry point that imports src/index.ts

## 🚀 Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Maintainability**: Easy to locate and update specific functionality
3. **Scalability**: Easy to add new routes, controllers, and services
4. **Testability**: Individual modules can be tested in isolation
5. **Readability**: Clear organization makes the codebase easier to understand

## 🔄 How to Add New Features

### Adding a New Route

1. **Create a controller** in `src/controllers/`:

```typescript
// src/controllers/exampleController.ts
import { Request, Response } from "express";

export async function getExample(req: Request, res: Response) {
  // Your logic here
}
```

2. **Create a route file** in `src/routes/`:

```typescript
// src/routes/exampleRoutes.ts
import { Router } from "express";
import { getExample } from "../controllers/exampleController";

const router = Router();
router.get("/example", getExample);

export default router;
```

3. **Register the route** in `src/routes/index.ts`:

```typescript
import exampleRoutes from "./exampleRoutes";

router.use("/api", exampleRoutes);
```

### Adding a New Service

Create a service file in `src/services/`:

```typescript
// src/services/exampleService.ts
export async function fetchData() {
  // External API calls or business logic
}
```

### Adding Middleware

Create middleware in `src/middleware/`:

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Your middleware logic
  next();
}
```

## 📝 Notes

- The root `index.ts` simply imports `src/index.ts` to maintain compatibility
- All application code now lives in the `src/` directory
- Configuration is centralized in `src/config/env.ts`
- Error handling is separated into its own middleware module
