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
            student.checkIn = new Date().toISOString();

            const sheetsUrl = process.env.SHEETS_SCRIPT_WEB_APP_URL;

            if (!sheetsUrl) {
                console.error(
                    "SHEETS_SCRIPT_WEB_APP_URL is not defined in environment variables."
                );
                return res.status(500).json({ error: "Internal server error" });
            }

            await fetch(sheetsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student),
            })
                .then((res) => res.json())
                .then((data) => console.log("Saved to Google Sheets:", data))
                .catch((err) =>
                    console.error("Error saving to Google Sheets:", err)
                );

            return res.json(student);
        } else {
            return res.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        console.error("Error in /api/student:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
