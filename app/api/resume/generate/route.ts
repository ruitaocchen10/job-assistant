import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Parse request body
    const { jobDescription, userData } = await request.json();

    // Validate inputs
    if (!jobDescription || !userData) {
      return NextResponse.json(
        { error: "Missing job description or user data" },
        { status: 400 }
      );
    }

    // Construct the prompt for Gemini
    const prompt = `You are an expert resume writer and career coach. Your task is to create a tailored resume based on a job description and the candidate's experience.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S AVAILABLE INFORMATION:

Profile:
${JSON.stringify(userData.profile, null, 2)}

Work Experiences:
${JSON.stringify(userData.workExperiences, null, 2)}

Education:
${JSON.stringify(userData.education, null, 2)}

Skills:
${JSON.stringify(userData.skills, null, 2)}

Projects:
${JSON.stringify(userData.projects, null, 2)}

Certifications:
${JSON.stringify(userData.certifications, null, 2)}

INSTRUCTIONS:
1. Analyze the job description carefully for key requirements, skills, and keywords
2. Select the MOST RELEVANT experiences, education, skills, projects, and certifications from the candidate's information
3. Generate a compelling professional summary (2-3 sentences) tailored specifically to this role
4. For each selected work experience or project, choose or rewrite the most relevant bullet points that align with the job requirements
5. Ensure the selected content demonstrates how the candidate meets the job requirements

Return your response as a JSON object with this EXACT structure:

{
  "professionalSummary": "A compelling 2-3 sentence summary tailored to the role...",
  "selectedExperiences": [
    {
      "id": "uuid-of-experience",
      "include": true,
      "customBullets": ["Tailored bullet point 1", "Tailored bullet point 2"],
      "reasoning": "Brief explanation of why this experience is relevant"
    }
  ],
  "selectedEducation": [
    {
      "id": "uuid-of-education",
      "include": true,
      "reasoning": "Why this education is relevant"
    }
  ],
  "selectedSkills": [
    {
      "category": "Category name from user's skills",
      "skills": ["skill1", "skill2"],
      "include": true,
      "reasoning": "Why these skills matter"
    }
  ],
  "selectedProjects": [
    {
      "id": "uuid-of-project",
      "include": true,
      "customBullets": ["Tailored bullet 1", "Tailored bullet 2"],
      "reasoning": "Why this project is relevant"
    }
  ],
  "selectedCertifications": [
    {
      "id": "uuid-of-certification",
      "include": true,
      "reasoning": "Why this certification matters"
    }
  ],
  "overallReasoning": "A brief explanation of your overall strategy and how the selected items position the candidate for this role",
  "keywordsMatched": ["keyword1", "keyword2", "keyword3"]
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown code blocks, no additional text
- Include the "id" field exactly as it appears in the user's data
- Set "include" to true only for items that are highly relevant
- For experiences and projects, provide customBullets that are more impactful than the originals
- Be selective - it's better to include fewer, highly relevant items than everything`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Parse the JSON response
    let generatedResume;
    try {
      // Remove any potential markdown code blocks
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      generatedResume = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini's response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Return the generated resume
    return NextResponse.json({
      success: true,
      resume: generatedResume,
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      {
        error: "Failed to generate resume. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
