"use client";

import { useState } from "react";
import { Project } from "@/lib/types";

interface ProjectFormProps {
  initialData?: Project;
  onSave: (
    data: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ProjectForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    project_name: initialData?.project_name || "",
    description: initialData?.description || "",
    url: initialData?.url || "",
    technologies: initialData?.technologies || [],
    bullets: initialData?.bullets || [],
    display_order: initialData?.display_order || 0,
  });

  const [currentTech, setCurrentTech] = useState("");
  const [currentBullet, setCurrentBullet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.project_name.trim()) {
      alert("Project name is required");
      return;
    }

    const dataToSave = {
      project_name: formData.project_name,
      description: formData.description || null,
      url: formData.url || null,
      technologies:
        formData.technologies.length > 0 ? formData.technologies : null,
      bullets: formData.bullets.length > 0 ? formData.bullets : null,
      display_order: formData.display_order,
    };

    onSave(dataToSave);
  };

  const handleAddTech = () => {
    if (currentTech.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, currentTech.trim()],
      });
      setCurrentTech("");
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {initialData ? "Edit Project" : "Add Project"}
      </h3>

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label
            htmlFor="project_name"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="project_name"
            value={formData.project_name}
            onChange={(e) =>
              setFormData({ ...formData, project_name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* URL */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Project URL
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://github.com/yourusername/project"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
            placeholder="Brief overview of the project..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technologies Used
          </label>
          {formData.technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-300"
                  >
                    <svg
                      className="h-3 w-3"
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
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              placeholder="Add a technology..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bullet Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Features & Achievements
          </label>
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
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={currentBullet}
              onChange={(e) => setCurrentBullet(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddBullet();
                }
              }}
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
