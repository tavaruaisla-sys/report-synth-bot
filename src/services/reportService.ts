import { supabase } from "@/integrations/supabase/client";
import { ReportData } from "@/lib/pdf/types";

export interface DBReport {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  brand_name: string;
  data: ReportData;
  user_id?: string;
}

export const reportService = {
  // Create a new report
  async createReport(reportData: ReportData): Promise<DBReport | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: reportData.reportTitle,
          brand_name: reportData.brandName,
          data: reportData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating report:', error);
        return null;
      }

      return data as DBReport;
    } catch (error) {
      console.error('Unexpected error creating report:', error);
      return null;
    }
  },

  // Update an existing report
  async updateReport(id: string, reportData: ReportData): Promise<DBReport | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({
          title: reportData.reportTitle,
          brand_name: reportData.brandName,
          data: reportData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating report:', error);
        return null;
      }

      return data as DBReport;
    } catch (error) {
      console.error('Unexpected error updating report:', error);
      return null;
    }
  },

  // Get all reports
  async getReports(): Promise<DBReport[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }

      return data as DBReport[];
    } catch (error) {
      console.error('Unexpected error fetching reports:', error);
      return [];
    }
  },

  // Get a single report by ID
  async getReportById(id: string): Promise<DBReport | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching report:', error);
        return null;
      }

      return data as DBReport;
    } catch (error) {
      console.error('Unexpected error fetching report:', error);
      return null;
    }
  },

  // Delete a report
  async deleteReport(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting report:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting report:', error);
      return false;
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('report-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      return null;
    }
  }
};
