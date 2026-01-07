"use client";

import { useState } from "react";
import { Education } from "@/lib/types";
import { EducationCard } from "./EducationCard";
import { EducationForm } from "./EducationForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface EducationSectionProps {
  initialData: Education[];
  userId: string;
}

export function EducationSection({
  initialData,
  userId,
}: EducationSectionProps) {
  const [education, setEducation] = useState<Education[]>(initialData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (
    data: Omit<Education, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: newEducation, error } = await supabase
      .from("education")
      .insert([
        {
          user_id: userId,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create education:", error);
      alert("Failed to add education. Please try again.");
      setIsLoading(false);
      return;
    }

    if (newEducation) {
      setEducation([newEducation as Education, ...education]);
      setShowAddForm(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleUpdate = async (
    id: string,
    data: Omit<Education, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: updatedEducation, error } = await supabase
      .from("education")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update education:", error);
      alert("Failed to update education. Please try again.");
      setIsLoading(false);
      return;
    }

    if (updatedEducation) {
      setEducation(
        education.map((edu) =>
          edu.id === id ? (updatedEducation as Education) : edu
        )
      );
      setEditingId(null);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("education").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete education:", error);
      alert("Failed to delete education. Please try again.");
      setIsLoading(false);
      return;
    }

    setEducation(education.filter((edu) => edu.id !== id));
    router.refresh();
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add your educational background
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
            Add Education
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <EducationForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        {education.length === 0 && !showAddForm ? (
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No education entries yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your education.
            </p>
          </div>
        ) : (
          education.map((edu) =>
            editingId === edu.id ? (
              <EducationForm
                key={edu.id}
                initialData={edu}
                onSave={(data) => handleUpdate(edu.id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isLoading}
              />
            ) : (
              <EducationCard
                key={edu.id}
                education={edu}
                onEdit={() => setEditingId(edu.id)}
                onDelete={() => handleDelete(edu.id)}
                isLoading={isLoading}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
