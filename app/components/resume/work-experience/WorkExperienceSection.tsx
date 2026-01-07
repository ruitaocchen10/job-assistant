"use client";

import { useState } from "react";
import { WorkExperience } from "@/lib/types";
import { WorkExperienceCard } from "./WorkExperienceCard";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface WorkExperienceSectionProps {
  initialData: WorkExperience[];
  userId: string;
}

export function WorkExperienceSection({
  initialData,
  userId,
}: WorkExperienceSectionProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(initialData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Handle adding a new work experience
  const handleAdd = async (
    data: Omit<WorkExperience, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: newExperience, error } = await supabase
      .from("work_experiences")
      .insert([
        {
          user_id: userId,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create work experience:", error);
      alert("Failed to add work experience. Please try again.");
      setIsLoading(false);
      return;
    }

    if (newExperience) {
      setExperiences([newExperience as WorkExperience, ...experiences]);
      setShowAddForm(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  // Handle updating an existing work experience
  const handleUpdate = async (
    id: string,
    data: Omit<WorkExperience, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: updatedExperience, error } = await supabase
      .from("work_experiences")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update work experience:", error);
      alert("Failed to update work experience. Please try again.");
      setIsLoading(false);
      return;
    }

    if (updatedExperience) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === id ? (updatedExperience as WorkExperience) : exp
        )
      );
      setEditingId(null);
      router.refresh();
    }

    setIsLoading(false);
  };

  // Handle deleting a work experience
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("work_experiences")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete work experience:", error);
      alert("Failed to delete work experience. Please try again.");
      setIsLoading(false);
      return;
    }

    setExperiences(experiences.filter((exp) => exp.id !== id));
    router.refresh();
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Work Experience
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Add your work history to build your resume library
          </p>
        </div>

        {/* Add Button */}
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
            Add Experience
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6">
          <WorkExperienceForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* List of Experiences */}
      <div className="space-y-4">
        {experiences.length === 0 && !showAddForm ? (
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No work experiences yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first work experience.
            </p>
          </div>
        ) : (
          experiences.map((exp) =>
            editingId === exp.id ? (
              // Edit Form
              <WorkExperienceForm
                key={exp.id}
                initialData={exp}
                onSave={(data) => handleUpdate(exp.id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isLoading}
              />
            ) : (
              // Display Card
              <WorkExperienceCard
                key={exp.id}
                experience={exp}
                onEdit={() => setEditingId(exp.id)}
                onDelete={() => handleDelete(exp.id)}
                isLoading={isLoading}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
