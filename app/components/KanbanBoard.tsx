"use client";

import { Application } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationSidebar } from "./ApplicationSidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface KanbanBoardProps {
  initialApplications: Application[];
}

const COLUMNS: { status: Application["status"]; title: string }[] = [
  { status: "wishlist", title: "Wishlist" },
  { status: "applied", title: "Applied" },
  { status: "interviewing", title: "Interviewing" },
  { status: "offered", title: "Offered" },
  { status: "rejected", title: "Rejected" },
  { status: "withdrawn", title: "Withdrawn" },
];

export function KanbanBoard({ initialApplications }: KanbanBoardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Get current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group applications by status
  const groupedApplications = useMemo(() => {
    const grouped: Record<Application["status"], Application[]> = {
      wishlist: [],
      applied: [],
      interviewing: [],
      offered: [],
      rejected: [],
      withdrawn: [],
    };

    applications.forEach((app) => {
      grouped[app.status].push(app);
    });

    return grouped;
  }, [applications]);

  const activeApplication = useMemo(
    () => applications.find((app) => app.id === activeId),
    [activeId, applications]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as Application["status"];

    const application = applications.find((app) => app.id === applicationId);
    if (!application || application.status === newStatus) return;

    // Optimistic update
    setApplications((apps) =>
      apps.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );

    // Update in database
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (error) {
      console.error("Failed to update application status:", error);
      // Revert optimistic update
      setApplications((apps) =>
        apps.map((app) =>
          app.id === applicationId ? { ...app, status: application.status } : app
        )
      );
    } else {
      router.refresh();
    }
  };

  const handleAddApplication = async (data: {
    company_name: string;
    job_title: string;
    status: Application["status"];
  }) => {
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("You must be logged in to create applications");
    }

    const { data: newApp, error } = await supabase
      .from("applications")
      .insert([
        {
          user_id: userId,
          company_name: data.company_name,
          job_title: data.job_title,
          status: data.status,
          applied_date: data.status === "applied" ? new Date().toISOString().split("T")[0] : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create application:", error);
      throw error;
    }

    if (newApp) {
      setApplications((apps) => [newApp as Application, ...apps]);
      router.refresh();
    }
  };

  const handleUpdateApplication = async (id: string, data: Partial<Application>) => {
    const { error } = await supabase
      .from("applications")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Failed to update application:", error);
      throw error;
    }

    // Update local state
    setApplications((apps) =>
      apps.map((app) => (app.id === id ? { ...app, ...data } : app))
    );

    // Update selected application if it's the one being edited
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, ...data } as Application);
    }

    router.refresh();
  };

  const handleDeleteApplication = async (id: string) => {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete application:", error);
      throw error;
    }

    setApplications((apps) => apps.filter((app) => app.id !== id));
    setIsSidebarOpen(false);
    setSelectedApplication(null);
    router.refresh();
  };

  const handleCardClick = (application: Application) => {
    setSelectedApplication(application);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              applications={groupedApplications[column.status]}
              onCardClick={handleCardClick}
              onAddApplication={handleAddApplication}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApplication ? (
            <ApplicationCard
              application={activeApplication}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <ApplicationSidebar
        application={selectedApplication}
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedApplication(null);
        }}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
      />
    </>
  );
}
