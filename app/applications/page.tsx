import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "../auth/signout/SignOutButton";
import { KanbanBoard } from "../components/KanbanBoard";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Job Applications
            </h1>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Kanban Board */}
        <KanbanBoard initialApplications={applications || []} />
      </main>
    </div>
  );
}
