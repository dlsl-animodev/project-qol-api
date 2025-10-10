# Request Flow Diagram

## Student API Request Flow

```
Client Request
    ↓
[index.ts]
    ↓
[src/index.ts] - Server starts
    ↓
[src/app.ts] - Express app with middleware
    ↓
[Middleware]
    ├── CORS (src/middleware/corsConfig.ts)
    ├── Body Parser (express.json/urlencoded)
    └── Routes (src/routes/index.ts)
        ↓
    [Route Handler]
        ├── GET / → homeController.getHome()
        │              └── Returns HTML page
        │
        └── GET /api/student?id=X
                  ↓
            [src/controllers/studentController.ts]
                  ├── Validate request
                  ↓
            [src/services/studentService.ts]
                  ├── Fetch from external API
                  ↓
            [src/utils/validation.ts]
                  ├── Validate response
                  ↓
            Return JSON response
    ↓
[Error Handlers] (src/middleware/errorHandler.ts)
    ├── 404 Not Found
    └── 500 Internal Server Error
```

## Module Responsibilities

| Module          | Responsibility                         | Dependencies            |
| --------------- | -------------------------------------- | ----------------------- |
| **Config**      | Environment variables & settings       | dotenv                  |
| **Controllers** | Handle HTTP requests/responses         | Services, Utils         |
| **Services**    | External API calls & business logic    | Config, https           |
| **Routes**      | Define URL patterns                    | Controllers             |
| **Middleware**  | Request preprocessing & error handling | -                       |
| **Utils**       | Helper functions                       | -                       |
| **App**         | Express configuration                  | All middleware & routes |
| **Index**       | Server initialization                  | App, Config             |
