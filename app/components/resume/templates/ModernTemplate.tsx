import {
  UserProfile,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@/lib/types";
import { EditableField } from "../generator/EditableField";

interface ModernTemplateProps {
  data: {
    profile: UserProfile | null;
    summary: string;
    experiences: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
  };
  onEdit: (section: string, field: string, value: any) => void;
}

export function ModernTemplate({ data, onEdit }: ModernTemplateProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">
          {data.profile?.full_name || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          {data.profile?.email && <span>{data.profile.email}</span>}
          {data.profile?.phone && <span>{data.profile.phone}</span>}
          {data.profile?.location && <span>{data.profile.location}</span>}
        </div>
        {data.profile?.linkedin_url && (
          <a
            href={data.profile.linkedin_url}
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        )}
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Professional Summary
          </h2>
          <div className="mt-2 border-l-4 border-blue-500 pl-4">
            <EditableField
              value={data.summary}
              onSave={(value) => onEdit("summary", "text", value)}
              multiline
              className="text-gray-700"
            />
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Experience
          </h2>
          <div className="mt-4 space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.job_title}
                    </h3>
                    <p className="text-md font-medium text-gray-700">
                      {exp.company_name}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                        <EditableField
                          value={bullet}
                          onSave={(value) =>
                            onEdit(
                              "experience",
                              `${exp.id}-bullet-${bulletIndex}`,
                              value
                            )
                          }
                          className="flex-1"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Education
          </h2>
          <div className="mt-4 space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree}
                      {edu.field_of_study && ` in ${edu.field_of_study}`}
                    </h3>
                    <p className="text-md text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {edu.graduation_date && (
                      <p>{formatDate(edu.graduation_date)}</p>
                    )}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Skills
          </h2>
          <div className="mt-4 space-y-2">
            {data.skills.map((skillCategory) => (
              <div key={skillCategory.id} className="flex gap-4">
                <span className="w-32 flex-shrink-0 font-semibold text-gray-900">
                  {skillCategory.category}:
                </span>
                <span className="text-gray-700">
                  {skillCategory.skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Projects
          </h2>
          <div className="mt-4 space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="border-l-2 border-gray-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.project_name}
                </h3>
                {project.description && (
                  <p className="mt-1 text-sm text-gray-700">
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.bullets && project.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {project.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
            Certifications
          </h2>
          <div className="mt-4 space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cert.certification_name}
                  </h3>
                  {cert.issuing_organization && (
                    <p className="text-sm text-gray-700">
                      {cert.issuing_organization}
                    </p>
                  )}
                </div>
                {cert.issue_date && (
                  <p className="text-sm text-gray-600">
                    {formatDate(cert.issue_date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
