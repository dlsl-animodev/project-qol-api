import https from "https";
import { config } from "../config/env";
import prisma from "../prisma/client";

export interface StudentInfo {
  email_address?: string;
  card_tag_uid?: string;
  checkIn?: string;
  [key: string]: any;
}

/**
 * Fetches student information from the DLSL portal
 * @param id - The student card tag ID
 * @returns Promise<StudentInfo>
 */
export async function getStudentInfo(
  id: string | number
): Promise<StudentInfo> {
  try {
    // Try to find the student in the database first by cardTagUid (card_tag_uid)
    const cardTagUid = String(id);

    let existing = null;
    try {
      existing = await prisma.student.findFirst({
        where: {
          OR: [
            { cardTagUid: cardTagUid },
            { cardTag: Number.isFinite(Number(id)) ? Number(id) : undefined },
            { schoolId: cardTagUid },
          ],
        },
      });
    } catch (dbReadErr) {
      // If DB read fails (DB down/overloaded), fall back to external API instead of throwing
      console.error("Prisma read failed, falling back to API:", dbReadErr);
      existing = null;
    }

    if (existing) {
      // Build a response object similar to the upstream API so controller logic remains the same
      const result: StudentInfo = {
        ...((existing.member as any) || {}),
        email_address:
          existing.email ||
          ((existing.member as any)?.email_address ?? undefined),
        card_tag_uid:
          existing.cardTagUid ??
          (existing.cardTag ? String(existing.cardTag) : undefined),
        checkIn: existing.checkIn ? existing.checkIn.toISOString() : undefined,
      };

      return result;
    }

    // if not found in database, fetch from school api
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "registration_tapregister",
        regkey: config.regKey || "",
        card_tag: String(id),
      }),
      agent: agent,
    } as RequestInit);

    const data = await response.json();

    // If the API returned a valid student, persist a record in the DB for faster future lookups.
    // Only store when there is an email (validation is done in controller), but we'll still insert
    // a record to cache the response if minimal identifying fields exist.
    try {
      const email = (data && data.email_address) || null;
      const partnerId = (data && data.partner_id) || null;
      const cardTagNum = data && data.card_tag ? Number(data.card_tag) : null;

      await prisma.student.create({
        data: {
          schoolId: partnerId ?? cardTagUid,
          email: email,
          department: data?.department ?? null,
          whitelist: data?.whitelist ?? null,
          cardTag: Number.isFinite(cardTagNum) ? cardTagNum : null,
          cardTagUid: cardTagUid,
          regGuest: data?.reg_guest ?? null,
          regKey: data?.regkey ? Number(data.regkey) : null,
          guestFullname: data?.guest_fullname ?? null,
          member: data ?? {},
        },
      });
    } catch (dbErr) {
      // Log DB errors but don't prevent returning the API data
      console.error("Failed to insert student into DB:", dbErr);
    }

    return data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
}
