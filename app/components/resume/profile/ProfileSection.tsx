"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { ProfileForm } from "./ProfileForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileSectionProps {
  initialData: UserProfile | null;
  userId: string;
}

export function ProfileSection({ initialData, userId }: ProfileSectionProps) {
  const [profile, setProfile] = useState<UserProfile | null>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSave = async (
    data: Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);

    if (profile) {
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from("user_profiles")
        .update(data)
        .eq("id", profile.id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
        setIsLoading(false);
        return;
      }

      if (updatedProfile) {
        setProfile(updatedProfile as UserProfile);
        setIsEditing(false);
        router.refresh();
      }
    } else {
      // Create new profile
      const { data: newProfile, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            user_id: userId,
            ...data,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Failed to create profile:", error);
        alert("Failed to create profile. Please try again.");
        setIsLoading(false);
        return;
      }

      if (newProfile) {
        setProfile(newProfile as UserProfile);
        setIsEditing(false);
        router.refresh();
      }
    }

    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Your contact information and professional summary
          </p>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
            {profile ? "Edit" : "Add Profile"}
          </button>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <ProfileForm
          initialData={profile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
        />
      ) : profile ? (
        // Display Profile
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile.full_name && (
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-base text-gray-900">
                  {profile.full_name}
                </p>
              </div>
            )}
            {profile.email && (
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-base text-gray-900">{profile.email}</p>
              </div>
            )}
            {profile.phone && (
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1 text-base text-gray-900">{profile.phone}</p>
              </div>
            )}
            {profile.location && (
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1 text-base text-gray-900">
                  {profile.location}
                </p>
              </div>
            )}
            {profile.linkedin_url && (
              <div>
                <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-base text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {profile.linkedin_url}
                </a>
              </div>
            )}
            {profile.portfolio_url && (
              <div>
                <p className="text-sm font-medium text-gray-500">Portfolio</p>
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-base text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {profile.portfolio_url}
                </a>
              </div>
            )}
          </div>
          {profile.professional_summary && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Professional Summary
              </p>
              <p className="mt-1 text-base text-gray-900">
                {profile.professional_summary}
              </p>
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No profile information yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your personal information.
          </p>
        </div>
      )}
    </section>
  );
}
