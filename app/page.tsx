"use client";
import { useState } from "react";

export default function Home() {

  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resume, jobDesc }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-center">
          TailorCV – Resume Optimizer
        </h1>

        <div className="mb-4">
  <label className="block font-semibold mb-2">
    Upload Resume (PDF)
  </label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
    className="w-full border p-2 rounded"
  />
</div>

        {/* Resume */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Paste Your Resume
          </label>

          <textarea
            className="w-full border rounded-lg p-3 h-40"
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Paste Job Description
          </label>

          <textarea
            className="w-full border rounded-lg p-3 h-40"
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAnalyze}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Analyze Resume
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">

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

 {result?.suggestions && (
  <div className="mt-6">
    <p className="font-semibold mb-2">Suggestions</p>

    <ul className="list-disc pl-5 space-y-1">
      {result.suggestions.map((tip: string, index: number) => (
        <li key={index}>{tip}</li>
      ))}
    </ul>
  </div>
)}

          </div>
        )}

      </div>
    </main>
  );
}