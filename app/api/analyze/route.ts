const pdf = require("pdf-parse");
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resumeFile") as File | null;
    const jobDesc = (formData.get("jobDesc") as string) || "";

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdf(buffer);

    const resumeText = pdfData.text.toLowerCase();
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

    words.forEach((word) => {
      const cleaned = word.toLowerCase();

      if (
        commonSkills.includes(cleaned) &&
        !extractedSkills.includes(cleaned)
      ) {
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

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Server error while analyzing resume" },
      { status: 500 }
    );
  }
}