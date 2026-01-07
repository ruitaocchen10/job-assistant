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
    <div
      className="mx-auto bg-white shadow-lg"
      style={{
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        padding: "50px",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="border-b border-black pb-3 mb-5">
        <h1
          className="font-bold text-black tracking-tight"
          style={{ fontSize: "22px", lineHeight: "1.2" }}
        >
          {data.profile?.full_name?.toUpperCase() || "YOUR NAME"}
        </h1>
        <div
          className="mt-2 flex flex-wrap gap-x-2"
          style={{ fontSize: "11px", lineHeight: "1.4" }}
        >
          {data.profile?.email && <span>{data.profile.email}</span>}
          {data.profile?.phone && <span>•</span>}
          {data.profile?.phone && <span>{data.profile.phone}</span>}
          {data.profile?.location && <span>•</span>}
          {data.profile?.location && <span>{data.profile.location}</span>}
        </div>
        {data.profile?.linkedin_url && (
          <div
            className="mt-0.5"
            style={{ fontSize: "11px", lineHeight: "1.4" }}
          >
            {data.profile.linkedin_url}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Professional Summary
          </h2>
          <div style={{ fontSize: "11px", lineHeight: "1.5" }}>
            <EditableField
              value={data.summary}
              onSave={(value) => onEdit("summary", "text", value)}
              multiline
              className="text-black"
            />
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Experience
          </h2>
          <div className="space-y-3">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between mb-0.5">
                  <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                    <span className="font-bold text-black">
                      {exp.job_title}
                    </span>
                    <span className="text-black"> — {exp.company_name}</span>
                  </div>
                  <div
                    style={{ fontSize: "11px", lineHeight: "1.4" }}
                    className="text-black"
                  >
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </div>
                </div>
                {exp.location && (
                  <div
                    style={{ fontSize: "10px", lineHeight: "1.4" }}
                    className="text-black italic mb-1"
                  >
                    {exp.location}
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1" style={{ marginLeft: "15px" }}>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 text-black mb-0.5"
                        style={{ fontSize: "10px", lineHeight: "1.5" }}
                      >
                        <span
                          style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: "#000",
                            marginTop: "5px",
                            flexShrink: 0,
                          }}
                        />
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
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Education
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <div
                    className="font-bold text-black"
                    style={{ fontSize: "11px", lineHeight: "1.4" }}
                  >
                    {edu.degree}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </div>
                  <div
                    className="text-black"
                    style={{ fontSize: "11px", lineHeight: "1.4" }}
                  >
                    {edu.institution}
                  </div>
                  {edu.gpa && (
                    <div
                      className="text-black"
                      style={{ fontSize: "10px", lineHeight: "1.4" }}
                    >
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
                <div
                  className="text-black"
                  style={{ fontSize: "10px", lineHeight: "1.4" }}
                >
                  {edu.graduation_date && formatDate(edu.graduation_date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Skills
          </h2>
          <div className="space-y-1.5">
            {data.skills.map((skillCategory) => (
              <div key={skillCategory.id} className="flex gap-2">
                <span
                  className="font-bold text-black"
                  style={{ fontSize: "11px", minWidth: "110px" }}
                >
                  {skillCategory.category}:
                </span>
                <span
                  className="text-black"
                  style={{ fontSize: "11px", lineHeight: "1.4" }}
                >
                  {skillCategory.skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div
                  className="font-bold text-black"
                  style={{ fontSize: "11px", lineHeight: "1.4" }}
                >
                  {project.project_name}
                </div>
                {project.description && (
                  <div
                    className="text-black italic mb-1"
                    style={{ fontSize: "10px", lineHeight: "1.4" }}
                  >
                    {project.description}
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div
                    className="text-black mb-1"
                    style={{ fontSize: "10px", lineHeight: "1.4" }}
                  >
                    <span className="font-semibold">Technologies:</span>{" "}
                    {project.technologies.join(", ")}
                  </div>
                )}
                {project.bullets && project.bullets.length > 0 && (
                  <ul className="mt-1" style={{ marginLeft: "15px" }}>
                    {project.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 text-black mb-0.5"
                        style={{ fontSize: "10px", lineHeight: "1.5" }}
                      >
                        <span
                          style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: "#000",
                            marginTop: "5px",
                            flexShrink: 0,
                          }}
                        />
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
        <div className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-black mb-2.5"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            Certifications
          </h2>
          <div className="space-y-1.5">
            {data.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-baseline justify-between"
              >
                <div>
                  <span
                    className="font-bold text-black"
                    style={{ fontSize: "11px", lineHeight: "1.4" }}
                  >
                    {cert.certification_name}
                  </span>
                  {cert.issuing_organization && (
                    <span
                      className="text-black"
                      style={{ fontSize: "11px", lineHeight: "1.4" }}
                    >
                      {" "}
                      — {cert.issuing_organization}
                    </span>
                  )}
                </div>
                {cert.issue_date && (
                  <div
                    className="text-black"
                    style={{ fontSize: "10px", lineHeight: "1.4" }}
                  >
                    {formatDate(cert.issue_date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
