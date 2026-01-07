"use client";

import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "./signout/SignOutButton";

interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
}

export function Navbar({ logoSrc, logoAlt = "Logo" }: NavbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center font-extrabold text-xl">
            Job Tracker
          </div>

          {/* Navigation Section */}
          <nav className="flex items-center gap-6">
            <Link
              href="/applications"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Applications
            </Link>
            <Link
              href="/resume"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Resumes
            </Link>
            <Link
              href="/cover_letters"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cover Letters
            </Link>
          </nav>

          {/* Sign Out Section */}
          <div className="flex items-center">
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
