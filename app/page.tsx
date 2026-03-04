"use client";
import { useState } from "react";

export default function Home() {

  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = async () => {

    if (!file) {
      alert("Please upload a resume PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("jobDesc", jobDesc);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          TailorCV – Resume Optimizer
        </h1>

        {/* Upload Resume */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-800">
            Upload Resume (PDF)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded text-gray-900"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            Paste Job Description
          </label>

          <textarea
            className="w-full border rounded-lg p-3 h-40 text-gray-900"
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Analyze Resume
        </button>

        {/* Results */}
        {result && (
          <div className="mt-6 p-5 bg-gray-50 rounded-lg text-gray-900">

            {/* Score */}
            <div className="mt-4">
              <p className="font-semibold mb-2">
                ATS Match Score: {result?.score}%
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${result?.score}%` }}
                ></div>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Matched Skills</p>

              <div className="flex flex-wrap gap-2">
                {result?.matchedSkills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Missing Skills</p>

              <div className="flex flex-wrap gap-2">
                {result?.missingSkills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}