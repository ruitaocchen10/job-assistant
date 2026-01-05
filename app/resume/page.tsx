import { createClient } from "@/lib/supabase/server";
import { Navbar } from "../components/Navbar";
import { ProfileSection } from "../components/resume/profile/ProfileSection";
import { WorkExperienceSection } from "../components/resume/work-experience/WorkExperienceSection";
import { EducationSection } from "../components/resume/education/EducationSection";
import { SkillsSection } from "../components/resume/skills/SkillsSection";
import { ProjectsSection } from "../components/resume/projects/ProjectsSection";
import { CertificationsSection } from "../components/resume/certifications/CertificationsSection";

export default async function ResumePage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  // Fetch all resume data
  const [
    { data: profile },
    { data: workExperiences },
    { data: education },
    { data: skills },
    { data: projects },
    { data: certifications },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("work_experiences")
      .select("*")
      .order("display_order", { ascending: true })
      .order("start_date", { ascending: false }),
    supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true })
      .order("graduation_date", { ascending: false }),
    supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("issue_date", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="mt-2 text-gray-600">
            Build your resume library by adding your work experiences,
            education, skills, and projects. Later, you'll be able to generate
            tailored resumes for specific job applications.
          </p>
        </div>

        {/* All Resume Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <ProfileSection initialData={profile} userId={user.id} />

          {/* Work Experience */}
          <WorkExperienceSection
            initialData={workExperiences || []}
            userId={user.id}
          />

          {/* Education */}
          <EducationSection initialData={education || []} userId={user.id} />

          {/* Skills */}
          <SkillsSection initialData={skills || []} userId={user.id} />

          {/* Projects */}
          <ProjectsSection initialData={projects || []} userId={user.id} />

          {/* Certifications */}
          <CertificationsSection
            initialData={certifications || []}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}
