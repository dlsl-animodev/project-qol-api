import https from "https";
import { config } from "../config/env";

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
    return data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
}
