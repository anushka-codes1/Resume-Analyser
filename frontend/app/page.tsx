"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const score = useMemo<number | null>(() => {
    if (!analysis || typeof analysis.ats_score !== "number") return null;
    // clamp score between 0 and 100
    return Math.max(0, Math.min(100, analysis.ats_score));
  }, [analysis]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a PDF resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API Response:", response.data);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-950 text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Upload */}
          <div className="md:col-span-1 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <h1 className="text-3xl font-extrabold mb-2 text-emerald-300">
              AI Resume Analyzer
            </h1>
            <p className="text-zinc-400 mb-6">
              Upload your resume to get an ATS-ready analysis with suggestions
              and an ATS score.
            </p>

            <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="w-full text-sm file:bg-emerald-500 file:text-black file:py-2 file:px-3 file:rounded-md file:border-0 mb-4"
              />

              <button
                onClick={handleUpload}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-black py-3 rounded-lg font-semibold hover:opacity-95 transition duration-200"
              >
                {loading ? "Analyzing Resume..." : "Analyze Resume"}
              </button>

              <p className="mt-3 text-xs text-zinc-500">
                Accepted: PDF. We analyze content for ATS-friendliness and
                provide improvement tips.
              </p>
            </div>

            <div className="mt-6 text-sm text-zinc-400">
              <h3 className="text-zinc-200 font-semibold mb-2">Quick Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Simplify headers and use clear section titles.</li>
                <li>Include measurable achievements.</li>
                <li>Avoid images and unusual fonts for ATS.</li>
              </ul>
            </div>
          </div>

          {/* Right column - Results and Score */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-zinc-700 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Analysis</h2>
                    <p className="text-zinc-400">
                      A concise overview is shown below. Expand for full
                      details.
                    </p>
                  </div>

                  <div className="ml-4 w-48">
                    <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 text-center">
                      <div className="text-sm text-zinc-300">ATS Score</div>
                      <div className="flex items-center justify-center mt-2">
                        <div className="text-3xl font-bold text-emerald-300">
                          {score ?? "--"}
                        </div>

                        <div className="text-sm text-zinc-500 ml-2">/100</div>
                        {/* progress bar */}
                        <div className="mt-3 bg-zinc-800 h-3 rounded-full overflow-hidden w-full">
                          <div
                            className={`h-3 rounded-full transition-all duration-700 ${score !== null ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-zinc-700"}`}
                            style={{
                              width:
                                score !== null
                                  ? `${Math.min(100, score)}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-zinc-900 p-4 rounded-lg border border-zinc-800 prose prose-invert max-w-none text-sm">
                  {analysis && (
                    <div className="space-y-6">
                      {/* TOP GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* ATS SCORE */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-2xl">
                          <p className="text-sm uppercase tracking-wider opacity-80">
                            ATS Score
                          </p>

                          <h2 className="text-6xl font-bold mt-4">
                            {analysis.ats_score}
                          </h2>

                          <p className="mt-2 text-sm opacity-80">out of 100</p>
                        </div>

                        {/* SUMMARY */}
                        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                          <h3 className="text-xl font-semibold mb-4">
                            Resume Summary
                          </h3>

                          <p className="text-zinc-300 leading-7">
                            {analysis.summary}
                          </p>
                        </div>
                      </div>

                      {/* STRENGTHS + WEAKNESSES */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 border border-green-900/40 p-6 rounded-2xl">
                          <h3 className="text-xl font-semibold text-green-400 mb-4">
                            Strengths
                          </h3>

                          <ul className="space-y-3">
                            {(analysis.strengths || []).map(
                              (item: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-zinc-200"
                                >
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div className="bg-zinc-900 border border-red-900/40 p-6 rounded-2xl">
                          <h3 className="text-xl font-semibold text-red-400 mb-4">
                            Weaknesses
                          </h3>

                          <ul className="space-y-3">
                            {(analysis.weaknesses || []).map(
                              (item: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-zinc-200"
                                >
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* KEYWORDS */}
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                          Missing Keywords
                        </h3>

                        <div className="flex flex-wrap gap-3">
                          {(analysis.missing_keywords || []).map(
                            (item: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm"
                              >
                                {item}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* SUGGESTIONS */}
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                          Improvement Suggestions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(analysis.suggestions || []).map(
                            (item: string, idx: number) => (
                              <div
                                key={idx}
                                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl"
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* ROLES */}
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                          Suitable Roles
                        </h3>

                        <div className="flex flex-wrap gap-3">
                          {(analysis.suitable_roles || []).map(
                            (item: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm"
                              >
                                {item}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* FINAL VERDICT */}
                      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">
                          Final Verdict
                        </h3>

                        <p className="text-zinc-300 leading-7">
                          {analysis.final_verdict}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions / Actionable Tips Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-900/5 p-4 rounded-2xl border border-amber-900/10">
                  <h3 className="text-lg font-semibold text-amber-300">
                    Actionable Suggestions
                  </h3>
                  <p className="text-zinc-400 text-sm mt-2">
                    Based on the analysis, the AI will suggest improvements like
                    stronger verbs, quantifiable results, and keyword alignment.
                  </p>
                </div>

                <div className="bg-indigo-900/5 p-4 rounded-2xl border border-indigo-900/10">
                  <h3 className="text-lg font-semibold text-indigo-300">
                    Formatting Tips
                  </h3>
                  <ul className="text-zinc-400 text-sm mt-2 list-disc list-inside space-y-1">
                    <li>
                      Use simple section headers: Summary, Experience,
                      Education, Skills.
                    </li>
                    <li>Keep bullet points concise and achievement-focused.</li>
                    <li>Avoid images, tables, and complex layouts for ATS.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
