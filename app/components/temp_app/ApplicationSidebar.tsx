"use client";

import { Application } from "@/lib/types";
import { useState, useEffect } from "react";

interface ApplicationSidebarProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Application>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ApplicationSidebar({
  application,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({});

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name,
        job_title: application.job_title,
        job_url: application.job_url,
        location: application.location,
        status: application.status,
        applied_date: application.applied_date,
        salary_min: application.salary_min,
        salary_max: application.salary_max,
        notes: application.notes,
      });
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(application.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    setLoading(true);
    try {
      await onDelete(application.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Application" : "Application Details"}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.job_title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, job_title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Posting URL
                </label>
                <input
                  type="url"
                  value={formData.job_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, job_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., San Francisco, CA or Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || "applied"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Application["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {/* Applied Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applied Date
                </label>
                <input
                  type="date"
                  value={formData.applied_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, applied_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Min ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_min || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary_min: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="e.g., 80000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Max ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_max || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary_max: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="e.g., 120000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={6}
                  placeholder="Any additional notes about this application..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      company_name: application.company_name,
                      job_title: application.job_title,
                      job_url: application.job_url,
                      location: application.location,
                      status: application.status,
                      applied_date: application.applied_date,
                      salary_min: application.salary_min,
                      salary_max: application.salary_max,
                      notes: application.notes,
                    });
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* Delete Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Delete Application
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Company & Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {application.company_name}
                </h3>
                <p className="text-lg text-gray-600">{application.job_title}</p>
              </div>

              {/* Job URL */}
              {application.job_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Job Posting
                  </label>
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {application.job_url}
                  </a>
                </div>
              )}

              {/* Location */}
              {application.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900">{application.location}</p>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                <StatusBadge status={application.status} />
              </div>

              {/* Applied Date */}
              {application.applied_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Applied Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(application.applied_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Salary Range */}
              {(application.salary_min || application.salary_max) && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Salary Range
                  </label>
                  <p className="text-gray-900">
                    {application.salary_min &&
                      `$${application.salary_min.toLocaleString()}`}
                    {application.salary_min && application.salary_max && " - "}
                    {application.salary_max &&
                      `$${application.salary_max.toLocaleString()}`}
                  </p>
                </div>
              )}

              {/* Notes */}
              {application.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Notes
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {application.notes}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                <p>
                  Created: {new Date(application.created_at).toLocaleString()}
                </p>
                <p>
                  Updated: {new Date(application.updated_at).toLocaleString()}
                </p>
              </div>

              {/* Delete Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Delete Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const styles = {
    wishlist: "bg-gray-100 text-gray-800",
    applied: "bg-blue-100 text-blue-800",
    interviewing: "bg-yellow-100 text-yellow-800",
    offered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  const labels = {
    wishlist: "Wishlist",
    applied: "Applied",
    interviewing: "Interviewing",
    offered: "Offered",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
