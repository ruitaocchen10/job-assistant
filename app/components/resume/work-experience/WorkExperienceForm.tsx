"use client";

import { useState } from "react";
import { WorkExperience } from "@/lib/types";

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  onSave: (
    data: Omit<WorkExperience, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function WorkExperienceForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
}: WorkExperienceFormProps) {
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || "",
    job_title: initialData?.job_title || "",
    location: initialData?.location || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    description: initialData?.description || "",
    bullets: initialData?.bullets || [],
    display_order: initialData?.display_order || 0,
  });

  const [currentBullet, setCurrentBullet] = useState("");
  const [isCurrentPosition, setIsCurrentPosition] = useState(
    !initialData?.end_date
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.company_name.trim() || !formData.job_title.trim()) {
      alert("Company name and job title are required");
      return;
    }

    if (!formData.start_date) {
      alert("Start date is required");
      return;
    }

    // Prepare data
    const dataToSave = {
      ...formData,
      end_date: isCurrentPosition ? null : formData.end_date || null,
      location: formData.location || null,
      description: formData.description || null,
      bullets: formData.bullets.length > 0 ? formData.bullets : null,
    };

    onSave(dataToSave);
  };

  const handleAddBullet = () => {
    if (currentBullet.trim()) {
      setFormData({
        ...formData,
        bullets: [...formData.bullets, currentBullet.trim()],
      });
      setCurrentBullet("");
    }
  };

  const handleRemoveBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: formData.bullets.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddBullet();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {initialData ? "Edit Work Experience" : "Add Work Experience"}
      </h3>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label
            htmlFor="company_name"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company_name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <label
            htmlFor="job_title"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="job_title"
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
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
            placeholder="e.g., San Francisco, CA"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              disabled={isCurrentPosition}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="current_position"
                checked={isCurrentPosition}
                onChange={(e) => {
                  setIsCurrentPosition(e.target.checked);
                  if (e.target.checked) {
                    setFormData({ ...formData, end_date: "" });
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="current_position"
                className="ml-2 text-sm text-gray-700"
              >
                I currently work here
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder="Brief overview of your role..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Bullet Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Achievements & Responsibilities
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Add bullet points describing your accomplishments
          </p>

          {/* Existing bullets */}
          {formData.bullets.length > 0 && (
            <ul className="mt-2 space-y-2">
              {formData.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-md bg-gray-50 p-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  <span className="flex-1 text-sm text-gray-700">{bullet}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(index)}
                    className="text-red-600 hover:text-red-700"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add bullet input */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={currentBullet}
              onChange={(e) => setCurrentBullet(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a bullet point..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddBullet}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
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
