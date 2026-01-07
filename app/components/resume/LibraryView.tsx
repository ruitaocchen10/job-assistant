import {
  UserProfile,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@/lib/types";
import { ProfileSection } from "./profile/ProfileSection";
import { WorkExperienceSection } from "./work-experience/WorkExperienceSection";
import { EducationSection } from "./education/EducationSection";
import { SkillsSection } from "./skills/SkillsSection";
import { ProjectsSection } from "./projects/ProjectsSection";
import { CertificationsSection } from "./certifications/CertificationsSection";

interface LibraryViewProps {
  userId: string;
  profile: UserProfile | null;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export function LibraryView({
  userId,
  profile,
  workExperiences,
  education,
  skills,
  projects,
  certifications,
}: LibraryViewProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <ProfileSection initialData={profile} userId={userId} />

      {/* Work Experience */}
      <WorkExperienceSection initialData={workExperiences} userId={userId} />

      {/* Education */}
      <EducationSection initialData={education} userId={userId} />

      {/* Skills */}
      <SkillsSection initialData={skills} userId={userId} />

      {/* Projects */}
      <ProjectsSection initialData={projects} userId={userId} />

      {/* Certifications */}
      <CertificationsSection initialData={certifications} userId={userId} />
    </div>
  );
}
