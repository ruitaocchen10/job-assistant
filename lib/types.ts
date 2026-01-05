export type Application = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  location: string | null;
  status:
    | "wishlist"
    | "applied"
    | "interviewing"
    | "offered"
    | "rejected"
    | "withdrawn";
  applied_date: string | null;
  salary_min: number | null;
  salary_max: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================
// RESUME-RELATED TYPES
// ============================================

export type UserProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  professional_summary: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkExperience = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  location: string | null;
  start_date: string;
  end_date: string | null; // null means current position
  description: string | null;
  bullets: string[] | null; // Array of bullet points
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  graduation_date: string | null;
  gpa: number | null;
  honors: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  category: string;
  skills: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  project_name: string;
  description: string | null;
  technologies: string[] | null;
  url: string | null;
  bullets: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Certification = {
  id: string;
  user_id: string;
  certification_name: string;
  issuing_organization: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Composite type for all resume data
export type ResumeData = {
  profile: UserProfile | null;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
};
