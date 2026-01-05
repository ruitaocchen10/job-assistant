"use client";

import { useState } from "react";
import { Skill } from "@/lib/types";
import { SkillsCard } from "./SkillsCard";
import { SkillsForm } from "./SkillsForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SkillsSectionProps {
  initialData: Skill[];
  userId: string;
}

export function SkillsSection({ initialData, userId }: SkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (
    data: Omit<Skill, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: newSkill, error } = await supabase
      .from("skills")
      .insert([
        {
          user_id: userId,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create skill:", error);
      alert("Failed to add skills. Please try again.");
      setIsLoading(false);
      return;
    }

    if (newSkill) {
      setSkills([newSkill as Skill, ...skills]);
      setShowAddForm(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleUpdate = async (
    id: string,
    data: Omit<Skill, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: updatedSkill, error } = await supabase
      .from("skills")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update skill:", error);
      alert("Failed to update skills. Please try again.");
      setIsLoading(false);
      return;
    }

    if (updatedSkill) {
      setSkills(
        skills.map((skill) =>
          skill.id === id ? (updatedSkill as Skill) : skill
        )
      );
      setEditingId(null);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete skill:", error);
      alert("Failed to delete skills. Please try again.");
      setIsLoading(false);
      return;
    }

    setSkills(skills.filter((skill) => skill.id !== id));
    router.refresh();
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <p className="mt-1 text-sm text-gray-600">
            Organize your skills by category
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
            Add Skills
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <SkillsForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        {skills.length === 0 && !showAddForm ? (
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No skills yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your skills.
            </p>
          </div>
        ) : (
          skills.map((skill) =>
            editingId === skill.id ? (
              <SkillsForm
                key={skill.id}
                initialData={skill}
                onSave={(data) => handleUpdate(skill.id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isLoading}
              />
            ) : (
              <SkillsCard
                key={skill.id}
                skill={skill}
                onEdit={() => setEditingId(skill.id)}
                onDelete={() => handleDelete(skill.id)}
                isLoading={isLoading}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
