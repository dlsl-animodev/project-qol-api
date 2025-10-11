// supabase db types

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          event_name: string;
          event_code: string;
          event_date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          event_code: string;
          event_date: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          event_code?: string;
          event_date?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          event_id: string;
          student_id: string;
          student_name: string;
          email_address: string;
          tapped_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          student_id: string;
          student_name: string;
          email_address: string;
          tapped_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          student_id?: string;
          student_name?: string;
          email_address?: string;
          tapped_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      codes: {
        Row: {
          code: string;
          event_id: string;
          created_by: string | null;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          event_id: string;
          created_by?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          event_id?: string;
          created_by?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "codes_event_id_fkey";
            columns: ["event_id"];
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [key: string]: never;
    };
    Functions: {
      [key: string]: never;
    };
    Enums: {
      [key: string]: never;
    };
    CompositeTypes: {
      [key: string]: never;
    };
  };
}

export type Event = Database['public']['Tables']['events']['Row'];
export type AttendanceRecord = Database['public']['Tables']['attendance']['Row'];
export type InsertAttendance = Database['public']['Tables']['attendance']['Insert'];
export type Code = Database['public']['Tables']['codes']['Row'];
export type InsertCode = Database['public']['Tables']['codes']['Insert'];

export type TablesInsert<TableName extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][TableName]['Insert'];
export type TablesRow<TableName extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][TableName]['Row'];

