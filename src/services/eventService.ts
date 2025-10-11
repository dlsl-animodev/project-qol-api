import { supabase } from "./supabaseClient";
import type { Event } from "../types/database";

/**
 * Fetches an active event by its event code
 * @param eventCode - The unique event code
 * @returns Promise<Event | null>
 */

export async function getEventByCode(eventCode: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_code", eventCode)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // no rows returned
        return null;
      }
      throw error;
    }

  return data as Event;
  } catch (error) {
    console.error("Error fetching event by code:", error);
    throw error;
  }
}

/**
 * Fetches all active events
 * @returns Promise<Event[]>
 */

export async function getActiveEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      throw error;
    }

  return (data as Event[]) || [];
  } catch (error) {
    console.error("Error fetching active events:", error);
    throw error;
  }
}

/**
 * Fetches an event by its ID
 * @param eventId - The event UUID
 * @returns Promise<Event | null>
 */

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

  return data as Event;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}
