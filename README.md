## Environment Setup

Create a `.env` file in the root directory (use `.env.example` as template):

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```
## Request Flow

```
Client Request (Card Tap)
    ↓
[index.ts] - Server entry point
    ↓
[src/app.ts] - Express app with middleware
    ↓
[Middleware Layer]
    ├── CORS (src/middleware/corsConfig.ts)
    ├── Body Parser (express.json/urlencoded)
    └── Routes (src/routes/index.ts)
        ↓
    [Route Handlers]
        ├── GET / → homeController.getHome()
        │              └── Returns HTML page
        │
        └── GET /api/student?id=X&event_code=Y
                  ↓
            [src/controllers/studentController.ts]
                  ├── 1. Validate request parameters
                  ├── 2. Verify event exists (eventService)
                  ├── 3. Fetch student info (studentService)
                  ├── 4. Check duplicate attendance (attendanceService)
                  ├── 5. Format student name (nameFormatter)
                  ├── 6. Save to Supabase (attendanceService)
                  └── 7. Return success response
                  ↓
            [Services Layer]
            ├── eventService.ts - Event lookup by code
            ├── studentService.ts - External API call
            ├── attendanceService.ts - Supabase CRUD
            └── supabaseClient.ts - DB connection
                  ↓
            [Database Layer]
            └── Supabase PostgreSQL
                ├── events table
                ├── attendance table
                └── codes table
    ↓
[Error Handlers] (src/middleware/errorHandler.ts)
    ├── 404 Not Found
    └── 500 Internal Server Error
```

## Project Structure

```
project-qol-backend/
├── src/
│   ├── config/
│   │   └── env.ts                    # Environment variables
│   ├── controllers/
│   │   ├── homeController.ts         # Home page handler
│   │   └── studentController.ts      # Student attendance handler
│   ├── middleware/
│   │   ├── corsConfig.ts             # CORS configuration
│   │   └── errorHandler.ts           # Error handling middleware
│   ├── routes/
│   │   ├── index.ts                  # Main router
│   │   └── studentRoutes.ts          # Student routes
│   ├── services/
│   │   ├── attendanceService.ts      # Attendance CRUD operations
│   │   ├── eventService.ts           # Event lookup functions
│   │   ├── studentService.ts         # External student API
│   │   └── supabaseClient.ts         # Supabase initialization
│   ├── types/
│   │   └── database.ts               # TypeScript types for DB
│   ├── utils/
│   │   ├── nameFormatter.ts          # Email to name formatter
│   │   └── validation.ts             # Input validation
│   └── app.ts                        # Express app setup
├── index.ts                          # Server entry point
├── test-supabase.ts                  # Connection test script
├── .env.example                      # Environment template
└── package.json                      # Dependencies
```

## Module Responsibilities

| Module              | Responsibility                              | Dependencies                    |
| ------------------- | ------------------------------------------- | ------------------------------- |
| **Config**          | Environment variables & settings            | dotenv                          |
| **Controllers**     | Handle HTTP requests/responses              | Services, Utils                 |
| **Services**        | Business logic & data operations            | Supabase, External APIs         |
| **Routes**          | Define URL patterns & route handlers        | Controllers                     |
| **Middleware**      | Request preprocessing & error handling      | -                               |
| **Utils**           | Helper functions (formatting, validation)   | -                               |
| **Types**           | TypeScript type definitions                 | -                               |
| **App**             | Express configuration & middleware setup    | All middleware & routes         |
| **Index**           | Server initialization                       | App, Config                     |

```