import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  UserProfile,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@/lib/types";

// Create styles for PDF - Classic Black & White
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000000",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobTitleCompany: {
    fontSize: 10,
    flex: 1,
  },
  jobTitle: {
    fontFamily: "Helvetica-Bold",
  },
  dateText: {
    fontSize: 10,
  },
  location: {
    fontSize: 9,
    fontStyle: "italic",
    marginBottom: 4,
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 15,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bullet: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#000000",
    marginRight: 8,
    marginTop: 5,
  },
  bulletText: {
    fontSize: 9,
    lineHeight: 1.5,
    flex: 1,
  },
  educationItem: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  degree: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  institution: {
    fontSize: 10,
  },
  gpa: {
    fontSize: 9,
  },
  educationRight: {
    fontSize: 9,
    textAlign: "right",
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  skillCategory: {
    width: 110,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  skillsList: {
    fontSize: 10,
    flex: 1,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 9,
    fontStyle: "italic",
    marginBottom: 4,
  },
  projectTech: {
    fontSize: 9,
    marginBottom: 4,
  },
  techLabel: {
    fontFamily: "Helvetica-Bold",
  },
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  certLeft: {
    flex: 1,
  },
  certName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  certOrg: {
    fontSize: 10,
  },
  certDate: {
    fontSize: 9,
  },
});

interface ModernTemplatePDFProps {
  data: {
    profile: UserProfile | null;
    summary: string;
    experiences: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
  };
}

export function ModernTemplatePDF({ data }: ModernTemplatePDFProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.profile?.full_name?.toUpperCase() || "YOUR NAME"}
          </Text>
          <Text style={styles.contactInfo}>
            {[data.profile?.email, data.profile?.phone, data.profile?.location]
              .filter(Boolean)
              .join(" • ")}
          </Text>
          {data.profile?.linkedin_url && (
            <Text style={styles.contactInfo}>{data.profile.linkedin_url}</Text>
          )}
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitleCompany}>
                    <Text style={styles.jobTitle}>{exp.job_title}</Text>
                    {" — "}
                    {exp.company_name}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={styles.location}>{exp.location}</Text>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.degree}>
                    {edu.degree}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </Text>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                </View>
                <View>
                  {edu.graduation_date && (
                    <Text style={styles.educationRight}>
                      {formatDate(edu.graduation_date)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((skillCategory) => (
              <View key={skillCategory.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>
                  {skillCategory.category}:
                </Text>
                <Text style={styles.skillsList}>
                  {skillCategory.skills.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project) => (
              <View key={project.id} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.project_name}</Text>
                {project.description && (
                  <Text style={styles.projectDescription}>
                    {project.description}
                  </Text>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    <Text style={styles.techLabel}>Technologies: </Text>
                    {project.technologies.join(", ")}
                  </Text>
                )}
                {project.bullets && project.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {project.bullets.map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bulletItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <View style={styles.certLeft}>
                  <Text style={styles.certName}>{cert.certification_name}</Text>
                  {cert.issuing_organization && (
                    <Text style={styles.certOrg}>
                      {" — "}
                      {cert.issuing_organization}
                    </Text>
                  )}
                </View>
                {cert.issue_date && (
                  <Text style={styles.certDate}>
                    {formatDate(cert.issue_date)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
