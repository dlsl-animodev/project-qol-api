import { Router } from "express";
import { getStudent } from "../controllers/studentController";

const router = Router();

// GET /api/student?id=STUDENT_ID
router.get("/student", getStudent);

export default router;
