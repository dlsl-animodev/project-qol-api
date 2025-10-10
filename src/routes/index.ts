import { Router } from "express";
import studentRoutes from "./studentRoutes";
import { getHome } from "../controllers/homeController";

const router = Router();

// Home route
router.get("/", getHome);

// API routes
router.use("/api", studentRoutes);

export default router;
