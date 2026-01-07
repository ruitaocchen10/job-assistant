export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
      {/* Animated Icon */}
      <div className="relative">
        <svg
          className="h-16 w-16 animate-pulse text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="absolute -right-2 -top-2">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        AI is crafting your resume...
      </h3>

      {/* Progress Steps */}
      <div className="mt-6 space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
          <span>Analyzing job description</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 animation-delay-200"></div>
          <span>Selecting relevant experiences</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 animation-delay-400"></div>
          <span>Crafting tailored content</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        This usually takes 10-20 seconds
      </p>
    </div>
  );
}
