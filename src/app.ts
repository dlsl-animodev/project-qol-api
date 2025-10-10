import express from "express";
import { corsOptions } from "./middleware/corsConfig";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// Middleware
app.use(corsOptions);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
