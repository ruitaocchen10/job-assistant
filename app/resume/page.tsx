import { createClient } from "@/lib/supabase/server";
import { Navbar } from "../components/Navbar";
import { ResumeContent } from "../components/resume/ResumeContent";

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
      <Navbar logoSrc="/images/Logo.png" logoAlt="Job Tracker Logo" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="mt-2 text-gray-600">
            Build your resume library and generate tailored resumes for specific
            job applications.
          </p>
        </div>

        {/* Main Content with Tabs */}
        <ResumeContent
          userId={user.id}
          profile={profile}
          workExperiences={workExperiences || []}
          education={education || []}
          skills={skills || []}
          projects={projects || []}
          certifications={certifications || []}
        />
      </main>
    </div>
  );
}
