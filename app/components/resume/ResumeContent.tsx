"use client";

import { useState } from "react";
import {
  UserProfile,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@/lib/types";
import { LibraryView } from "./LibraryView";
import { GeneratorView } from "./generator/GeneratorView";

interface ResumeContentProps {
  userId: string;
  profile: UserProfile | null;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export function ResumeContent({
  userId,
  profile,
  workExperiences,
  education,
  skills,
  projects,
  certifications,
}: ResumeContentProps) {
  const [activeTab, setActiveTab] = useState<"library" | "generate">("library");

  const userData = {
    profile,
    workExperiences,
    education,
    skills,
    projects,
    certifications,
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("library")}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "library"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
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
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              My Library
            </div>
          </button>

          <button
            onClick={() => setActiveTab("generate")}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "generate"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate Resume
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "library" ? (
        <LibraryView
          userId={userId}
          profile={profile}
          workExperiences={workExperiences}
          education={education}
          skills={skills}
          projects={projects}
          certifications={certifications}
        />
      ) : (
        <GeneratorView userData={userData} />
      )}
    </div>
  );
}
