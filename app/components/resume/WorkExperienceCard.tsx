import { WorkExperience } from "@/lib/types";

interface WorkExperienceCardProps {
  experience: WorkExperience;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function WorkExperienceCard({
  experience,
  onEdit,
  onDelete,
  isLoading,
}: WorkExperienceCardProps) {
  // Format dates for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const startDate = formatDate(experience.start_date);
  const endDate = formatDate(experience.end_date);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all hover:border-gray-300">
      {/* Header with Title and Actions */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {experience.job_title}
          </h3>
          <p className="text-sm font-medium text-gray-700">
            {experience.company_name}
          </p>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            <span>
              {startDate} - {endDate}
            </span>
            {experience.location && (
              <>
                <span>•</span>
                <span>{experience.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
            title="Edit"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            title="Delete"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {experience.description && (
        <p className="mb-3 text-sm text-gray-700">{experience.description}</p>
      )}

      {/* Bullet Points */}
      {experience.bullets && experience.bullets.length > 0 && (
        <ul className="space-y-1">
          {experience.bullets.map((bullet, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
