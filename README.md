Client Request
    ↓
[index.ts]
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
