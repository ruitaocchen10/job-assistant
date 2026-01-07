"use client";

import { useState } from "react";
import { Certification } from "@/lib/types";
import { CertificationCard } from "./CertificationsCard";
import { CertificationForm } from "./CertificationsForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CertificationsSectionProps {
  initialData: Certification[];
  userId: string;
}

export function CertificationsSection({
  initialData,
  userId,
}: CertificationsSectionProps) {
  const [certifications, setCertifications] =
    useState<Certification[]>(initialData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (
    data: Omit<Certification, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: newCertification, error } = await supabase
      .from("certifications")
      .insert([
        {
          user_id: userId,
          ...data,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create certification:", error);
      alert("Failed to add certification. Please try again.");
      setIsLoading(false);
      return;
    }

    if (newCertification) {
      setCertifications([newCertification as Certification, ...certifications]);
      setShowAddForm(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleUpdate = async (
    id: string,
    data: Omit<Certification, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    const { data: updatedCertification, error } = await supabase
      .from("certifications")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update certification:", error);
      alert("Failed to update certification. Please try again.");
      setIsLoading(false);
      return;
    }

    if (updatedCertification) {
      setCertifications(
        certifications.map((cert) =>
          cert.id === id ? (updatedCertification as Certification) : cert
        )
      );
      setEditingId(null);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete certification:", error);
      alert("Failed to delete certification. Please try again.");
      setIsLoading(false);
      return;
    }

    setCertifications(certifications.filter((cert) => cert.id !== id));
    router.refresh();
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Certifications
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Add professional certifications and licenses
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
            Add Certification
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <CertificationForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="space-y-4">
        {certifications.length === 0 && !showAddForm ? (
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
              No certifications yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your certifications.
            </p>
          </div>
        ) : (
          certifications.map((cert) =>
            editingId === cert.id ? (
              <CertificationForm
                key={cert.id}
                initialData={cert}
                onSave={(data) => handleUpdate(cert.id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isLoading}
              />
            ) : (
              <CertificationCard
                key={cert.id}
                certification={cert}
                onEdit={() => setEditingId(cert.id)}
                onDelete={() => handleDelete(cert.id)}
                isLoading={isLoading}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
