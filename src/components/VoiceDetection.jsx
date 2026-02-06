import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function VoiceDetection() {
  const [audioFile, setAudioFile] = useState(null);
  const [language, setLanguage] = useState("hindi");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert file → Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      setError("Please upload an audio file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const audioBase64 = await fileToBase64(audioFile);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          language: language,
          audioFormat: "wav",
          audioBase64: audioBase64,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setError("");
  };

  const languages = [
    { code: "english", name: "EN", fullName: "English" },
    { code: "hindi", name: "HI", fullName: "Hindi" },
    { code: "tamil", name: "TA", fullName: "Tamil" },
    { code: "telugu", name: "TE", fullName: "Telugu" },
    { code: "malayalam", name: "ML", fullName: "Malayalam" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white flex flex-col">
      
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Voice Detection</h1>
              <p className="text-xs text-slate-500">Powered by Acube AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 flex">
        <div className="grid lg:grid-cols-5 gap-6 w-full items-stretch">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
            
            {/* Language Card */}
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold tracking-tight text-sm">Language</h3>
                  <p className="text-xs text-slate-500">Select the audio language</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 ${
                        language === lang.code
                          ? "bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-sm"
                          : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Card */}
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-semibold tracking-tight text-sm">Audio File</h3>
                  <p className="text-xs text-slate-500">Upload WAV or MP3 format</p>
                </div>
                <input
                  type="file"
                  accept=".wav,.mp3"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors p-8 border-slate-300"
                >
                  {audioFile ? (
                    <div className="text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{audioFile.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Click to change file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto">
                        <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Choose file or drag & drop</p>
                        <p className="text-xs text-slate-500">WAV, MP3 up to 10MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Voice
                </>
              )}
            </button>

            {/* Error Alert */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Results */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {result ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Classification Card */}
                <div className="rounded-lg border bg-white shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold tracking-tight">Classification Result</h3>
                      {result.status === "success" && (
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                          <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Success
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`h-16 w-16 rounded-lg flex items-center justify-center text-3xl ${
                        result.classification === "AI_GENERATED"
                          ? "bg-orange-100"
                          : "bg-yellow-100"
                      }`}>
                        {result.classification === "AI_GENERATED" ? "🤖" : "👤"}
                      </div>
                      <div className="flex-1">
                        <p className={`text-2xl font-bold ${
                          result.classification === "AI_GENERATED" 
                            ? "text-orange-600" 
                            : "text-yellow-600"
                        }`}>
                          {result.classification === "AI_GENERATED" ? "AI Generated" : "Human Voice"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Voice classification complete</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence & Language Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Confidence Score */}
                  <div className="rounded-lg border bg-white shadow-sm">
                    <div className="p-6">
                      <h3 className="font-semibold tracking-tight text-sm mb-4">Confidence Score</h3>
                      <div className="space-y-3">
                        <div className="flex items-end justify-between">
                          <span className="text-4xl font-bold text-slate-900">
                            {(result.confidenceScore * 100).toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-500 pb-1">Certainty</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidenceScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="rounded-lg border bg-white shadow-sm">
                    <div className="p-6">
                      <h3 className="font-semibold tracking-tight text-sm mb-4">Detected Language</h3>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                          <span className="text-2xl">🌐</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900 capitalize">{result.language}</p>
                          <p className="text-xs text-slate-500">Primary language</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="rounded-lg border bg-white shadow-sm">
                  <div className="p-6">
                    <h3 className="font-semibold tracking-tight text-sm mb-3">Analysis Explanation</h3>
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
                <div className="rounded-lg border bg-white shadow-sm h-full max-h-[600px] lg:min-h-0 flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                  <div className="h-24 w-24 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                    <svg className="h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">Ready to Analyze</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Upload an audio file and select a language to begin voice detection analysis
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white/80 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-slate-500">
            © 2026 Acube AI. Secured by Advanced AI Technology.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default VoiceDetection;
