"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewApplicationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      company_name: formData.get("company_name") as string,
      job_title: formData.get("job_title") as string,
      job_url: (formData.get("job_url") as string) || null,
      location: (formData.get("location") as string) || null,
      status: (formData.get("status") as string) || "applied",
      applied_date: (formData.get("applied_date") as string) || null,
      salary_min: formData.get("salary_min")
        ? parseInt(formData.get("salary_min") as string)
        : null,
      salary_max: formData.get("salary_max")
        ? parseInt(formData.get("salary_max") as string)
        : null,
      notes: (formData.get("notes") as string) || null,
    };

    const { error: insertError } = await supabase
      .from("applications")
      .insert([data]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/applications");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              New Application
            </h1>
            <Link
              href="/applications"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to list
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                id="company_name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Job Title */}
            <div>
              <label
                htmlFor="job_title"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title *
              </label>
              <input
                type="text"
                name="job_title"
                id="job_title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Job URL */}
            <div>
              <label
                htmlFor="job_url"
                className="block text-sm font-medium text-gray-700"
              >
                Job Posting URL
              </label>
              <input
                type="url"
                name="job_url"
                id="job_url"
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                name="location"
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                defaultValue="applied"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              <label
                htmlFor="applied_date"
                className="block text-sm font-medium text-gray-700"
              >
                Applied Date
              </label>
              <input
                type="date"
                name="applied_date"
                id="applied_date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="salary_min"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary Min ($)
                </label>
                <input
                  type="number"
                  name="salary_min"
                  id="salary_min"
                  placeholder="e.g., 80000"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="salary_max"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary Max ($)
                </label>
                <input
                  type="number"
                  name="salary_max"
                  id="salary_max"
                  placeholder="e.g., 120000"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                placeholder="Any additional notes about this application..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Link
                href="/applications"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
