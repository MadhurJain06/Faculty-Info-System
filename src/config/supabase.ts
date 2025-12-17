// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase configuration
const supabaseUrl = 'https://gkbvpweelhqhhzgckoau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYnZwd2VlbGhxaGh6Z2Nrb2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTQwMjYsImV4cCI6MjA3OTk5MDAyNn0.lDAMDscgqnReBtYB-3XX5g8fMc0nz3TQbgR55plhhlo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching YOUR schema
export interface Department {
  department_id: number;
  department_name: string;
  hod_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Office {
  office_id: number;
  room_number?: string;
  block?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Faculty {
  faculty_id: number;
  name: string;
  designation?: string;
  qualification?: string;
  email?: string;
  phone?: string;
  profile_link?: string;
  department_id?: number;
  office_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
  credits?: number;
  department_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  publication_id: number;
  faculty_id: number;
  title: string;
  journal?: string;
  publication_year?: number;
  link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FacultyCourse {
  id: number;
  faculty_id: number;
  course_id: number;
  semester?: string;
  academic_year?: string;
  created_at?: string;
}

// Department Service
export const departmentService = {
  async getAll(): Promise<Department[]> {
    try {
      const { data, error } = await supabase
        .from('department')
        .select('*')
        .order('department_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAll departments:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Department | null> {
    try {
      const { data, error } = await supabase
        .from('department')
        .select('*')
        .eq('department_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching department:', error);
      return null;
    }
  }
};

// Course Service
export const courseService = {
  async getAll(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('course_code', { ascending: true });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAll courses:', error);
      return [];
    }
  },

  async getByDepartment(departmentId: number): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('department_id', departmentId)
        .order('course_code', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by department:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }
};

// Faculty Service
export const facultyService = {
  async getAll(): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching faculty:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Faculty | null> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('faculty_id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching faculty:', error);
      return null;
    }
  },

  async getByDepartment(departmentId: number): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('department_id', departmentId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching faculty by department:', error);
      return [];
    }
  },

  async add(faculty: Omit<Faculty, 'faculty_id' | 'created_at' | 'updated_at'>): Promise<Faculty | null> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .insert([faculty])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error adding faculty:', error);
      throw error;
    }
  },

  async update(id: number, faculty: Partial<Faculty>): Promise<Faculty | null> {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .update(faculty)
        .eq('faculty_id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('faculty_id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting faculty:', error);
      return false;
    }
  }
};

// Publication Service
export const publicationService = {
  async getAll(): Promise<Publication[]> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('publication_year', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching publications:', error);
      return [];
    }
  },

  async getByFaculty(facultyId: number): Promise<Publication[]> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('publication_year', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching publications:', error);
      return [];
    }
  }
};

// Office Service
export const officeService = {
  async getAll(): Promise<Office[]> {
    try {
      const { data, error } = await supabase
        .from('office')
        .select('*')
        .order('block', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching offices:', error);
      return [];
    }
  }
};