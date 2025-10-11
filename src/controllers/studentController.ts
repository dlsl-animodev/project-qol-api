import { Request, Response } from "express";
import { getStudentInfo } from "../services/studentService";
import { isValidStudent } from "../utils/validation";
import { saveAttendance, hasAttendance } from "../services/attendanceService";
import { getEventByCode } from "../services/eventService";

export async function getStudent(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const id = req.query.id;
    const eventCode = req.query.event_code || req.query.eventCode;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    if (!eventCode) {
      return res.status(400).json({ error: "Missing event_code parameter" });
    }

    const event = await getEventByCode(eventCode as string);

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "The event code is invalid"
      });
    }

    const student = await getStudentInfo(id as string);

    if (isValidStudent(student)) {
      student.card_tag_uid = String(id);
      student.checkIn = new Date().toISOString();

      try {
        const alreadyLogged = await hasAttendance(String(id), event.id);

        if (alreadyLogged) {
          return res.status(409).json({
            error: "Duplicate attendance",
            message: "You have already logged your attendance for this event",
            student: student,
            event: {
              name: event.event_name,
              date: event.event_date
            }
          });
        }
      } catch (checkError) {

      }

      try {
        const attendanceRecord = await saveAttendance(student, event.id);

        return res.json({
          success: true,
          message: "Attendance logged successfully",
          student: student,
          attendance: attendanceRecord,
          event: {
            name: event.event_name,
            date: event.event_date
          }
        });
      } catch (dbError: any) {
        return res.json({
          success: false,
          message: "Student verified but attendance logging failed",
          error: dbError?.message || "Database error",
          student: student,
          event: {
            name: event.event_name,
            date: event.event_date
          }
        });
      }
    } else {
      return res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
