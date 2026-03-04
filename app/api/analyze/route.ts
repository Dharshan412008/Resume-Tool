export const runtime = "nodejs";
const pdf = require("pdf-parse");
export async function POST(req: Request) {

  const formData = await req.formData();

  const jobDesc = formData.get("jobDesc") as string;
  const resumeInput = formData.get("resume") as string;
  const resumeFile = formData.get("resumeFile") as File | null;

  let resume = resumeInput || "";

  // 📄 If PDF uploaded → extract text
  if (resumeFile) {
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const parsed = await pdf(buffer);
    resume = parsed.text;
  }

  const resumeText = resume.toLowerCase();
  const jobText = jobDesc.toLowerCase();

  const commonSkills = [
    "java",
    "spring",
    "spring boot",
    "mysql",
    "react",
    "node",
    "aws",
    "docker",
    "kubernetes",
    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "mongodb",
    "rest",
    "api",
    "git",
    "linux",
  ];

  // 🔍 Extract skills from job description
  const words = jobText.split(/[\s,.;()]+/);
  const extractedSkills: string[] = [];

  words.forEach((word: string) => {
    const cleaned = word.toLowerCase();

    if (commonSkills.includes(cleaned) && !extractedSkills.includes(cleaned)) {
      extractedSkills.push(cleaned);
    }
  });

  let matchedSkills: string[] = [];
  let missingSkills: string[] = [];

  extractedSkills.forEach((skill) => {
    if (resumeText.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const score = Math.round(
    (matchedSkills.length /
      (matchedSkills.length + missingSkills.length || 1)) * 100
  );

  let suggestions: string[] = [];

  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider adding these skills to your resume: ${missingSkills.join(", ")}`
    );
  }

  if (matchedSkills.length > 0) {
    suggestions.push(
      `Highlight these skills more clearly: ${matchedSkills.join(", ")}`
    );
  }

  if (score < 50) {
    suggestions.push(
      "Your ATS score is low. Try aligning your resume more closely with the job description."
    );
  }

  let rewriteTips: string[] = [];

  if (resumeText.includes("built")) {
    rewriteTips.push(
      "Replace weak verbs like 'built' with stronger ones like 'developed', 'engineered', or 'implemented'."
    );
  }

  if (resumeText.includes("worked on")) {
    rewriteTips.push(
      "Instead of 'worked on', describe your specific contribution and impact."
    );
  }

  if (!resumeText.includes("%")) {
    rewriteTips.push(
      "Try adding measurable results such as percentages, user numbers, or performance improvements."
    );
  }

  return Response.json({
    score,
    matchedSkills,
    missingSkills,
    suggestions,
    rewriteTips,
    resumeText
  });
}