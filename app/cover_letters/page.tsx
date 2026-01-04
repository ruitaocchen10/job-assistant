import { Navbar } from "../components/Navbar";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-25">
      <Navbar logoSrc="/images/Logo.png" logoAlt="Job Tracker Logo" />

      {/* Main content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Coming Soon!
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              This feature will be released soon!
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></div>
              <span>We're working on something exciting</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
