"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectsCard";
import { ProjectForm } from "./ProjectsForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProjectsSectionProps {
  initialData: Project[];
  userId: string;
}

export function ProjectsSection({ initialData, userId }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>(initialData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (
    data: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: newProject, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create project:", error);
      alert("Failed to add project. Please try again.");
      setIsLoading(false);
      return;
    }

    if (newProject) {
      setProjects([newProject as Project, ...projects]);
      setShowAddForm(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleUpdate = async (
    id: string,
    data: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
      setIsLoading(false);
      return;
    }

    if (updatedProject) {
      setProjects(
        projects.map((project) =>
          project.id === id ? (updatedProject as Project) : project
        )
      );
      setEditingId(null);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
      setIsLoading(false);
      return;
    }

    setProjects(projects.filter((project) => project.id !== id));
    router.refresh();
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-600">
            Showcase your personal and professional projects
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Project
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <ProjectForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        {projects.length === 0 && !showAddForm ? (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first project.
            </p>
          </div>
        ) : (
          projects.map((project) =>
            editingId === project.id ? (
              <ProjectForm
                key={project.id}
                initialData={project}
                onSave={(data) => handleUpdate(project.id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isLoading}
              />
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => setEditingId(project.id)}
                onDelete={() => handleDelete(project.id)}
                isLoading={isLoading}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
