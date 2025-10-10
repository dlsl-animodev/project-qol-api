import { Request, Response } from "express";
import { getStudentInfo } from "../services/studentService";
import { isValidStudent } from "../utils/validation";

export async function getStudent(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const student = await getStudentInfo(id as string);

    if (isValidStudent(student)) {
      student.card_tag_uid = String(id);
      student.checkIn = new Date().toISOString();

      return res.json(student);
    } else {
      return res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error in /api/student:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
