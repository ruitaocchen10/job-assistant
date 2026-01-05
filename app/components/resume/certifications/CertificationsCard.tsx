import { Certification } from "@/lib/types";

interface CertificationCardProps {
  certification: Certification;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
  isLoading,
}: CertificationCardProps) {
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
            {certification.certification_name}
          </h3>
          {certification.issuing_organization && (
            <p className="text-sm font-medium text-gray-700">
              {certification.issuing_organization}
            </p>
          )}
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            {certification.issue_date && (
              <span>Issued: {formatDate(certification.issue_date)}</span>
            )}
            {certification.expiration_date && (
              <>
                <span>•</span>
                <span>
                  Expires: {formatDate(certification.expiration_date)}
                </span>
              </>
            )}
          </div>
          {certification.credential_id && (
            <p className="mt-2 text-sm text-gray-600">
              Credential ID: {certification.credential_id}
            </p>
          )}
          {certification.credential_url && (
            <a
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Credential
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        <div className="ml-4 flex items-center gap-2">
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
    </div>
  );
}
