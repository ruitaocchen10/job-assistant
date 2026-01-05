"use client";

import { Application } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
}

export function ApplicationCard({
  application,
  onClick,
}: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatSalaryRange = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const salaryRange = formatSalaryRange(
    application.salary_min,
    application.salary_max
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300"
    >
      {/* Company Name */}
      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
        {application.company_name}
      </h3>

      {/* Job Title */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {application.job_title}
      </p>

      {/* Location */}
      {application.location && (
        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {application.location}
        </p>
      )}

      {/* Salary Range */}
      {salaryRange && (
        <p className="text-xs text-green-700 font-medium bg-green-50 rounded px-2 py-1 inline-block">
          {salaryRange}
        </p>
      )}

      {/* Job URL */}
      {application.job_url && (
        <a
          href={application.job_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1 hover:underline"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Job Posting
        </a>
      )}
    </div>
  );
}
