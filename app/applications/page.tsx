import { createClient } from "@/lib/supabase/server";
import { Navbar } from "../components/Navbar";
import { KanbanBoard } from "../components/application/KanbanBoard";

export default async function ApplicationsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch applications
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <Navbar logoSrc="/images/Logo.png" logoAlt="Job Tracker Logo" />

      {/* Main content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Kanban Board */}
        <KanbanBoard initialApplications={applications || []} />
      </main>
    </div>
  );
}
