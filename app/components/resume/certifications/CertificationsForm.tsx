"use client";

import { useState } from "react";
import { Certification } from "@/lib/types";

interface CertificationFormProps {
  initialData?: Certification;
  onSave: (
    data: Omit<Certification, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CertificationForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
}: CertificationFormProps) {
  const [formData, setFormData] = useState({
    certification_name: initialData?.certification_name || "",
    issuing_organization: initialData?.issuing_organization || "",
    issue_date: initialData?.issue_date || "",
    expiration_date: initialData?.expiration_date || "",
    credential_id: initialData?.credential_id || "",
    credential_url: initialData?.credential_url || "",
    display_order: initialData?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.certification_name.trim()) {
      alert("Certification name is required");
      return;
    }

    const dataToSave = {
      certification_name: formData.certification_name,
      issuing_organization: formData.issuing_organization || null,
      issue_date: formData.issue_date || null,
      expiration_date: formData.expiration_date || null,
      credential_id: formData.credential_id || null,
      credential_url: formData.credential_url || null,
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
        {initialData ? "Edit Certification" : "Add Certification"}
      </h3>

      <div className="space-y-4">
        {/* Certification Name */}
        <div>
          <label
            htmlFor="certification_name"
            className="block text-sm font-medium text-gray-700"
          >
            Certification Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="certification_name"
            value={formData.certification_name}
            onChange={(e) =>
              setFormData({ ...formData, certification_name: e.target.value })
            }
            placeholder="e.g., AWS Solutions Architect"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Issuing Organization */}
        <div>
          <label
            htmlFor="issuing_organization"
            className="block text-sm font-medium text-gray-700"
          >
            Issuing Organization
          </label>
          <input
            type="text"
            id="issuing_organization"
            value={formData.issuing_organization}
            onChange={(e) =>
              setFormData({
                ...formData,
                issuing_organization: e.target.value,
              })
            }
            placeholder="e.g., Amazon Web Services"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Issue Date and Expiration Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="issue_date"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Date
            </label>
            <input
              type="date"
              id="issue_date"
              value={formData.issue_date}
              onChange={(e) =>
                setFormData({ ...formData, issue_date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="expiration_date"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <input
              type="date"
              id="expiration_date"
              value={formData.expiration_date}
              onChange={(e) =>
                setFormData({ ...formData, expiration_date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank if it doesn't expire
            </p>
          </div>
        </div>

        {/* Credential ID */}
        <div>
          <label
            htmlFor="credential_id"
            className="block text-sm font-medium text-gray-700"
          >
            Credential ID
          </label>
          <input
            type="text"
            id="credential_id"
            value={formData.credential_id}
            onChange={(e) =>
              setFormData({ ...formData, credential_id: e.target.value })
            }
            placeholder="e.g., ABC123456"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Credential URL */}
        <div>
          <label
            htmlFor="credential_url"
            className="block text-sm font-medium text-gray-700"
          >
            Credential URL
          </label>
          <input
            type="url"
            id="credential_url"
            value={formData.credential_url}
            onChange={(e) =>
              setFormData({ ...formData, credential_url: e.target.value })
            }
            placeholder="https://www.credly.com/badges/..."
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
