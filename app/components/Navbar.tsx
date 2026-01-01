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
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/applications"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  Job Tracker
                </span>
              )}
            </Link>
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
              href="/applications"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Applications
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
