import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Make sure your Tailwind styles are imported!

function Dashboard() {
  const [clips, setClips] = useState([]);
  const [showNote, setShowNote] = useState(null);
  const [showSummary, setShowSummary] = useState(null);
  const [expandedText, setExpandedText] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("webclips") || "[]");
    setClips(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-12 flex items-center justify-center gap-2">
          🗂️ Web Clipper Dashboard
        </h1>
        <button
  onClick={() => {
    localStorage.removeItem("webclips");
    setClips([]);
    alert("✅ All clips deleted!");
  }}
  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow mt-4"
>
  🗑️ Delete All Clips
</button>


        {clips.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No clips saved yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clips.map((clip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                  <a
                    href={clip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium text-sm underline truncate max-w-[75%]"
                    title={clip.url}
                  >
                    🌐 {clip.url}
                  </a>
                  <span className="text-xs text-gray-400">{clip.date}</span>
                </div>

                {/* Main Content */}
                <div className="flex gap-4 items-start">
                  {/* Left side: Selected Text */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      📌 Selected Text
                    </h3>
                    <div className="relative text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {expandedText === index ? (
                        clip.text
                      ) : (
                        <>
                          {clip.text?.slice(0, 300) || (
                            <span className="text-gray-400">No text saved.</span>
                          )}
                          {clip.text && clip.text.length > 300 && (
                            <span className="text-gray-400">... </span>
                          )}
                        </>
                      )}
                    </div>
                    {clip.text && clip.text.length > 300 && (
                      <button
                        onClick={() =>
                          setExpandedText(expandedText === index ? null : index)
                        }
                        className="text-xs mt-1 text-blue-600 hover:underline"
                      >
                        {expandedText === index ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>

                  {/* Right side: Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setShowNote(showNote === index ? null : index)
                      }
                      className="text-xs px-4 py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium border border-blue-200 transition"
                    >
                      📝 {showNote === index ? "Hide Note" : "View Note"}
                    </button>
                    <button
                      onClick={() =>
                        setShowSummary(showSummary === index ? null : index)
                      }
                      className="text-xs px-4 py-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium border border-yellow-200 transition"
                    >
                      🧠 {showSummary === index ? "Hide Summary" : "View Summary"}
                    </button>
                  </div>
                </div>

                {/* Note and Summary Sections */}
                {showNote === index && (
                  <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 animate-fade-in">
                    <strong>Note:</strong>{" "}
                    {clip.note ? clip.note : <span className="text-gray-400">No note saved.</span>}
                  </div>
                )}

                {showSummary === index && (
                  <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 animate-fade-in">
                    <strong>Summary:</strong>{" "}
                    {clip.summary ? clip.summary : <span className="text-gray-400">No summary available.</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
