import { supabase } from "@/integrations/supabase/client";

export interface DBBrief {
  id: string;
  platform: string;
  post_url: string | null;
  post_caption: string | null;
  issue_summary: string | null;
  status: string;
  generated_brief: string;
  simplified_brief: string | null;
  created_at: string;
  created_by: string;
}

export const briefService = {
  async getBriefs(): Promise<DBBrief[]> {
    const { data, error } = await (supabase as any)
      .from("issue_briefs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching briefs:", error);
      return [];
    }
    return data || [];
  },

  async createBrief(brief: {
    platform: string;
    post_url?: string;
    post_caption?: string;
    issue_summary?: string;
    status: string;
    generated_brief: string;
    simplified_brief?: string;
  }): Promise<DBBrief | null> {
    const { data, error } = await (supabase as any)
      .from("issue_briefs")
      .insert(brief)
      .select()
      .single();
    if (error) {
      console.error("Error creating brief:", error);
      return null;
    }
    return data;
  },

  async deleteBrief(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from("issue_briefs")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting brief:", error);
      return false;
    }
    return true;
  },
};
