export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: { content: string; created_at: string; id: string; message_type: string | null; role: string; user_id: string }
        Insert: { content: string; created_at?: string; id?: string; message_type?: string | null; role: string; user_id: string }
        Update: { content?: string; created_at?: string; id?: string; message_type?: string | null; role?: string; user_id?: string }
        Relationships: []
      }
      community_videos: {
        Row: { author_name: string; created_at: string; description: string | null; id: string; title: string; user_id: string; video_url: string }
        Insert: { author_name?: string; created_at?: string; description?: string | null; id?: string; title: string; user_id: string; video_url: string }
        Update: { author_name?: string; created_at?: string; description?: string | null; id?: string; title?: string; user_id?: string; video_url?: string }
        Relationships: []
      }
      device_data: {
        Row: { device_id: string; id: string; moisture: number | null; ph: number | null; recorded_at: string; temperature: number | null; user_id: string }
        Insert: { device_id: string; id?: string; moisture?: number | null; ph?: number | null; recorded_at?: string; temperature?: number | null; user_id: string }
        Update: { device_id?: string; id?: string; moisture?: number | null; ph?: number | null; recorded_at?: string; temperature?: number | null; user_id?: string }
        Relationships: []
      }
      farmer_works: {
        Row: { id: string; user_id: string; title: string; type: string | null; description: string | null; created_date: string | null; is_registered: string | null; created_at: string }
        Insert: { id?: string; user_id: string; title: string; type?: string | null; description?: string | null; created_date?: string | null; is_registered?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; title?: string; type?: string | null; description?: string | null; created_date?: string | null; is_registered?: string | null; created_at?: string }
        Relationships: []
      }
      farming_projects: {
        Row: { budget: number | null; created_at: string; crop: string | null; description: string | null; farm_size: number | null; id: string; ip_type: string | null; plan: Json | null; progress: number | null; status: string | null; title: string; updated_at: string; user_id: string }
        Insert: { budget?: number | null; created_at?: string; crop?: string | null; description?: string | null; farm_size?: number | null; id?: string; ip_type?: string | null; plan?: Json | null; progress?: number | null; status?: string | null; title: string; updated_at?: string; user_id: string }
        Update: { budget?: number | null; created_at?: string; crop?: string | null; description?: string | null; farm_size?: number | null; id?: string; ip_type?: string | null; plan?: Json | null; progress?: number | null; status?: string | null; title?: string; updated_at?: string; user_id?: string }
        Relationships: []
      }
      ip_pledges: {
        Row: { id: string; user_id: string; display_name: string; statement: string; created_at: string }
        Insert: { id?: string; user_id: string; display_name: string; statement: string; created_at?: string }
        Update: { id?: string; user_id?: string; display_name?: string; statement?: string; created_at?: string }
        Relationships: []
      }
      learning_progress: {
        Row: { id: string; user_id: string; module_id: string; completed_at: string }
        Insert: { id?: string; user_id: string; module_id: string; completed_at?: string }
        Update: { id?: string; user_id?: string; module_id?: string; completed_at?: string }
        Relationships: []
      }
      quiz_questions: {
        Row: { id: string; question: string; options: Json; correct_index: number; explanation: string | null; category: string | null }
        Insert: { id?: string; question: string; options: Json; correct_index: number; explanation?: string | null; category?: string | null }
        Update: { id?: string; question?: string; options?: Json; correct_index?: number; explanation?: string | null; category?: string | null }
        Relationships: []
      }
      quiz_attempts: {
        Row: { id: string; user_id: string; question_id: string | null; selected_index: number | null; is_correct: boolean | null; created_at: string }
        Insert: { id?: string; user_id: string; question_id?: string | null; selected_index?: number | null; is_correct?: boolean | null; created_at?: string }
        Update: { id?: string; user_id?: string; question_id?: string | null; selected_index?: number | null; is_correct?: boolean | null; created_at?: string }
        Relationships: []
      }
      scenarios: {
        Row: { id: string; story_text: string; options: Json; correct_index: number; explanation: string | null }
        Insert: { id?: string; story_text: string; options: Json; correct_index: number; explanation?: string | null }
        Update: { id?: string; story_text?: string; options?: Json; correct_index?: number; explanation?: string | null }
        Relationships: []
      }
      scenario_attempts: {
        Row: { id: string; user_id: string; scenario_id: string | null; selected_index: number | null; created_at: string }
        Insert: { id?: string; user_id: string; scenario_id?: string | null; selected_index?: number | null; created_at?: string }
        Update: { id?: string; user_id?: string; scenario_id?: string | null; selected_index?: number | null; created_at?: string }
        Relationships: []
      }
      club_sessions: {
        Row: { id: string; title: string; session_date: string; description: string | null; debate_proposition: string | null; created_by: string | null; created_at: string }
        Insert: { id?: string; title: string; session_date: string; description?: string | null; debate_proposition?: string | null; created_by?: string | null; created_at?: string }
        Update: { id?: string; title?: string; session_date?: string; description?: string | null; debate_proposition?: string | null; created_by?: string | null; created_at?: string }
        Relationships: []
      }
      session_attendance: {
        Row: { id: string; session_id: string | null; user_id: string | null; checked_in_at: string }
        Insert: { id?: string; session_id?: string | null; user_id?: string | null; checked_in_at?: string }
        Update: { id?: string; session_id?: string | null; user_id?: string | null; checked_in_at?: string }
        Relationships: []
      }
      debate_posts: {
        Row: { id: string; user_id: string; session_id: string | null; proposition: string | null; position: string | null; argument_text: string; is_featured: boolean | null; created_at: string }
        Insert: { id?: string; user_id: string; session_id?: string | null; proposition?: string | null; position?: string | null; argument_text: string; is_featured?: boolean | null; created_at?: string }
        Update: { id?: string; user_id?: string; session_id?: string | null; proposition?: string | null; position?: string | null; argument_text?: string; is_featured?: boolean | null; created_at?: string }
        Relationships: []
      }
      marketplace_listings: {
        Row: { category: string | null; created_at: string; crop: string; description: string | null; id: string; image_url: string | null; location: string | null; media_urls: string[] | null; price: string; quantity: string; status: string | null; type: string; updated_at: string; user_id: string }
        Insert: { category?: string | null; created_at?: string; crop: string; description?: string | null; id?: string; image_url?: string | null; location?: string | null; media_urls?: string[] | null; price: string; quantity: string; status?: string | null; type?: string; updated_at?: string; user_id: string }
        Update: { category?: string | null; created_at?: string; crop?: string; description?: string | null; id?: string; image_url?: string | null; location?: string | null; media_urls?: string[] | null; price?: string; quantity?: string; status?: string | null; type?: string; updated_at?: string; user_id?: string }
        Relationships: []
      }
      profiles: {
        Row: { created_at: string; crops: string[] | null; display_name: string; farm_size: number | null; farm_type: string | null; has_device: boolean | null; id: string; language: string | null; location_lat: number | null; location_lng: number | null; location_name: string | null; phone: string | null; role: string; updated_at: string; user_id: string }
        Insert: { created_at?: string; crops?: string[] | null; display_name: string; farm_size?: number | null; farm_type?: string | null; has_device?: boolean | null; id?: string; language?: string | null; location_lat?: number | null; location_lng?: number | null; location_name?: string | null; phone?: string | null; role?: string; updated_at?: string; user_id: string }
        Update: { created_at?: string; crops?: string[] | null; display_name?: string; farm_size?: number | null; farm_type?: string | null; has_device?: boolean | null; id?: string; language?: string | null; location_lat?: number | null; location_lng?: number | null; location_name?: string | null; phone?: string | null; role?: string; updated_at?: string; user_id?: string }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
