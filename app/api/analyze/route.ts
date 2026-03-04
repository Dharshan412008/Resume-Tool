export async function POST(req: Request) {
  const body = await req.json();
  const { resume, jobDesc } = body;

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

  const words = jobText.split(/[\s,.;()]+/);
  const extractedSkills: string[] = [];

  words.forEach((word: string) => {
    const cleaned = word.toLowerCase();

    if (commonSkills.includes(cleaned) && !extractedSkills.includes(cleaned)) {
      extractedSkills.push(cleaned);
    }
  });

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  extractedSkills.forEach((skill) => {
    if (resumeText.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const total = matchedSkills.length + missingSkills.length;

  const score =
    total === 0 ? 0 : Math.round((matchedSkills.length / total) * 100);

  return Response.json({
    score,
    matchedSkills,
    missingSkills,
  });
}