import { supabase } from "./supabaseClient";
import type { AttendanceRecord, TablesInsert } from "../types/database";
import type { StudentInfo } from "./studentService";
import { formatStudentName } from "../utils/nameFormatter";

/**
 * Saves attendance record to Supabase
 * @param student - The student information
 * @param eventId - The UUID of the event
 * @returns Promise<AttendanceRecord>
 */
export async function saveAttendance(
  student: StudentInfo,
  eventId: string
): Promise<AttendanceRecord> {
  try {
    const studentName = formatStudentName(student.email_address);

    const attendanceData: TablesInsert<"attendance"> = {
      event_id: eventId,
      student_id: student.card_tag_uid!,
      student_name: studentName,
      email_address: student.email_address!,
      tapped_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("attendance")
      .insert([attendanceData])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("You have already logged your attendance for this event.");
      }
      throw error;
    }

  return data as AttendanceRecord;
  } catch (error) {
    console.error("Error saving attendance:", error);
    throw error;
  }
}

/**
 * Checks if a student has already logged their attendance for an event
 * @param studentId - The student card tag UID
 * @param eventId - The event UUID
 * @returns Promise<boolean>
 */

export async function hasAttendance(
  studentId: string,
  eventId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("id")
      .eq("student_id", studentId)
      .eq("event_id", eventId)
      .single();

    if (error) {

        if (error.code === "PGRST116") {
        // no rows returned, student hasn't logged their attendance
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking attendance:", error);
    throw error;
  }
}

/**
 * Gets all attendance records for an event
 * @param eventId - The event UUID
 * @returns Promise<AttendanceRecord[]>
 */

export async function getEventAttendance(
  eventId: string
): Promise<AttendanceRecord[]> {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("event_id", eventId)
      .order("tapped_at", { ascending: false });

    if (error) {
      throw error;
    }

  return (data as AttendanceRecord[]) || [];
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    throw error;
  }
}

/**
 * Gets all attendance records for a student
 * @param studentId - The student card tag UID
 * @returns Promise<AttendanceRecord[]>
 */

export async function getStudentAttendance(
  studentId: string
): Promise<AttendanceRecord[]> {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .order("tapped_at", { ascending: false });

    if (error) {
      throw error;
    }

  return (data as AttendanceRecord[]) || [];
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    throw error;
  }
}
