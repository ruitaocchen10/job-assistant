import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">JobTracker</div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Track Your Job Hunt
            <span className="block text-blue-600">Stay Organized</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Stop losing track of job applications in endless spreadsheets and
            email threads. Keep all your applications, interviews, and
            opportunities organized in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Start tracking for free
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Track Applications
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Keep all your job applications in one place with detailed notes,
              status updates, and deadlines.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Never Miss a Deadline
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Track application deadlines and interview dates so you never miss
              an opportunity.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Visualize Your Progress
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              See your job search progress at a glance with status tracking and
              insights.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 rounded-2xl bg-blue-600 px-6 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-bold text-white">
            Ready to organize your job search?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join job seekers who are staying on top of their applications.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
          >
            Get started free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 py-8">
        <p className="text-center text-sm text-gray-500">
          © 2025 JobTracker. Built for job seekers, by job seekers.
        </p>
      </footer>
    </div>
  );
}
