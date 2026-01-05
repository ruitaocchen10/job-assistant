"use client";

import { useState } from "react";
import { Education } from "@/lib/types";

interface EducationFormProps {
  initialData?: Education;
  onSave: (
    data: Omit<Education, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EducationForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
}: EducationFormProps) {
  const [formData, setFormData] = useState({
    institution: initialData?.institution || "",
    degree: initialData?.degree || "",
    field_of_study: initialData?.field_of_study || "",
    location: initialData?.location || "",
    graduation_date: initialData?.graduation_date || "",
    gpa: initialData?.gpa?.toString() || "",
    honors: initialData?.honors || "",
    display_order: initialData?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.institution.trim() || !formData.degree.trim()) {
      alert("Institution and degree are required");
      return;
    }

    const dataToSave = {
      institution: formData.institution,
      degree: formData.degree,
      field_of_study: formData.field_of_study || null,
      location: formData.location || null,
      graduation_date: formData.graduation_date || null,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      honors: formData.honors || null,
      display_order: formData.display_order,
    };

    onSave(dataToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {initialData ? "Edit Education" : "Add Education"}
      </h3>

      <div className="space-y-4">
        {/* Institution */}
        <div>
          <label
            htmlFor="institution"
            className="block text-sm font-medium text-gray-700"
          >
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="institution"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Degree and Field of Study */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-gray-700"
            >
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="degree"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              placeholder="e.g., Bachelor of Science"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="field_of_study"
              className="block text-sm font-medium text-gray-700"
            >
              Field of Study
            </label>
            <input
              type="text"
              id="field_of_study"
              value={formData.field_of_study}
              onChange={(e) =>
                setFormData({ ...formData, field_of_study: e.target.value })
              }
              placeholder="e.g., Computer Science"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location and Graduation Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., Stanford, CA"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="graduation_date"
              className="block text-sm font-medium text-gray-700"
            >
              Graduation Date
            </label>
            <input
              type="date"
              id="graduation_date"
              value={formData.graduation_date}
              onChange={(e) =>
                setFormData({ ...formData, graduation_date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* GPA */}
        <div>
          <label
            htmlFor="gpa"
            className="block text-sm font-medium text-gray-700"
          >
            GPA
          </label>
          <input
            type="number"
            id="gpa"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            placeholder="e.g., 3.85"
            step="0.01"
            min="0"
            max="4"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Honors */}
        <div>
          <label
            htmlFor="honors"
            className="block text-sm font-medium text-gray-700"
          >
            Honors & Awards
          </label>
          <textarea
            id="honors"
            value={formData.honors}
            onChange={(e) =>
              setFormData({ ...formData, honors: e.target.value })
            }
            rows={2}
            placeholder="e.g., Summa Cum Laude, Dean's List"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
