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
import { JobDescriptionInput } from "./JobDescriptionInput";
import { GenerateButton } from "./GenerateButton";
import { LoadingState } from "./LoadingState";
import { ModernTemplate } from "../templates/ModernTemplate";

interface GeneratorViewProps {
  userData: {
    profile: UserProfile | null;
    workExperiences: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
  };
}

type AIGeneratedResume = {
  professionalSummary: string;
  selectedExperiences: Array<{
    id: string;
    include: boolean;
    customBullets?: string[];
    reasoning: string;
  }>;
  selectedEducation: Array<{
    id: string;
    include: boolean;
    reasoning: string;
  }>;
  selectedSkills: Array<{
    category: string;
    skills: string[];
    include: boolean;
    reasoning: string;
  }>;
  selectedProjects: Array<{
    id: string;
    include: boolean;
    customBullets?: string[];
    reasoning: string;
  }>;
  selectedCertifications: Array<{
    id: string;
    include: boolean;
    reasoning: string;
  }>;
  overallReasoning: string;
  keywordsMatched: string[];
};

export function GeneratorView({ userData }: GeneratorViewProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] =
    useState<AIGeneratedResume | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable resume data (starts as AI-generated, can be edited)
  const [editableResumeData, setEditableResumeData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          userData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      setGeneratedResume(data.resume);

      // Transform AI response into editable format
      const transformedData = transformAIResponse(data.resume, userData);
      setEditableResumeData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating resume:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Transform AI selections into resume data for template
  const transformAIResponse = (aiResume: AIGeneratedResume, userData: any) => {
    // Get selected experiences with custom bullets
    const selectedExperiences = aiResume.selectedExperiences
      .filter((item) => item.include)
      .map((item) => {
        const original = userData.workExperiences.find(
          (exp: WorkExperience) => exp.id === item.id
        );
        return {
          ...original,
          bullets: item.customBullets || original?.bullets || [],
        };
      })
      .filter(Boolean);

    // Get selected education
    const selectedEducation = aiResume.selectedEducation
      .filter((item) => item.include)
      .map((item) =>
        userData.education.find((edu: Education) => edu.id === item.id)
      )
      .filter(Boolean);

    // Get selected skills
    const selectedSkills = aiResume.selectedSkills
      .filter((item) => item.include)
      .map((item) => ({
        id: `skill-${item.category}`,
        category: item.category,
        skills: item.skills,
      }));

    // Get selected projects with custom bullets
    const selectedProjects = aiResume.selectedProjects
      .filter((item) => item.include)
      .map((item) => {
        const original = userData.projects.find(
          (proj: Project) => proj.id === item.id
        );
        return {
          ...original,
          bullets: item.customBullets || original?.bullets || [],
        };
      })
      .filter(Boolean);

    // Get selected certifications
    const selectedCertifications = aiResume.selectedCertifications
      .filter((item) => item.include)
      .map((item) =>
        userData.certifications.find(
          (cert: Certification) => cert.id === item.id
        )
      )
      .filter(Boolean);

    return {
      profile: userData.profile,
      summary: aiResume.professionalSummary,
      experiences: selectedExperiences,
      education: selectedEducation,
      skills: selectedSkills,
      projects: selectedProjects,
      certifications: selectedCertifications,
    };
  };

  const handleEdit = (section: string, field: string, value: any) => {
    // Handle inline editing
    setEditableResumeData((prev: any) => {
      const newData = { ...prev };

      if (section === "summary") {
        newData.summary = value;
      } else if (section === "experience") {
        // Handle bullet editing
        const [expId, , bulletIndex] = field.split("-");
        const expIndex = newData.experiences.findIndex(
          (exp: any) => exp.id === expId
        );
        if (expIndex !== -1) {
          newData.experiences[expIndex].bullets[parseInt(bulletIndex)] = value;
        }
      }

      return newData;
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Generate Tailored Resume
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Paste a job description below, and our AI will analyze it and create a
          tailored resume using your profile information.
        </p>

        <JobDescriptionInput
          value={jobDescription}
          onChange={setJobDescription}
          disabled={isGenerating}
        />

        <div className="mt-6">
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!jobDescription.trim() || isGenerating}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div>
          <LoadingState />
        </div>
      )}

      {/* Generated Resume Preview */}
      {editableResumeData && !isGenerating && (
        <div className="space-y-4">
          {/* AI Insights */}
          {generatedResume && (
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                AI Insights
              </h3>
              <p className="mt-2 text-sm text-blue-800">
                {generatedResume.overallReasoning}
              </p>
              {generatedResume.keywordsMatched.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-blue-900">
                    Keywords matched:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {generatedResume.keywordsMatched.map((keyword, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-blue-900"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resume Preview */}
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Resume Preview
              </h3>
              <p className="text-sm text-gray-600">
                Click any text to edit inline
              </p>
            </div>
            <ModernTemplate data={editableResumeData} onEdit={handleEdit} />
          </div>
        </div>
      )}
    </div>
  );
}
