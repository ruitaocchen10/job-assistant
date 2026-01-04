"use client";

import { Application } from "@/lib/types";
import { useState } from "react";

interface QuickAddCardProps {
  status: Application["status"];
  onAdd: (data: {
    company_name: string;
    job_title: string;
    job_url?: string;
    status: Application["status"];
  }) => Promise<void>;
  onCancel: () => void;
}

export function QuickAddCard({ status, onAdd, onCancel }: QuickAddCardProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) return;

    setLoading(true);
    try {
      await onAdd({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_url: jobUrl.trim() || undefined,
        status,
      });
      setCompanyName("");
      setJobTitle("");
      setJobUrl("");
      onCancel();
    } catch (error) {
      console.error("Failed to add application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 p-4 shadow-sm"
    >
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company name"
        autoFocus
        className="w-full mb-2 px-2 py-1 text-sm font-semibold border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Job title"
        className="w-full mb-2 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <input
        type="url"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="Job URL (optional)"
        className="w-full mb-3 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !companyName.trim() || !jobTitle.trim()}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
