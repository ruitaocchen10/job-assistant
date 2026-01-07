import { Education } from "@/lib/types";

interface EducationCardProps {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function EducationCard({
  education,
  onEdit,
  onDelete,
  isLoading,
}: EducationCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all hover:border-gray-300">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {education.degree}
            {education.field_of_study && ` in ${education.field_of_study}`}
          </h3>
          <p className="text-sm font-medium text-gray-700">
            {education.institution}
          </p>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            {education.graduation_date && (
              <span>{formatDate(education.graduation_date)}</span>
            )}
            {education.location && (
              <>
                <span>•</span>
                <span>{education.location}</span>
              </>
            )}
            {education.gpa && (
              <>
                <span>•</span>
                <span>GPA: {education.gpa}</span>
              </>
            )}
          </div>
          {education.honors && (
            <p className="mt-2 text-sm text-gray-700">{education.honors}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
            className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
    </div>
  );
}
