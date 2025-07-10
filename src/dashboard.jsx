import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Dashboard = () => {
  const [clips, setClips] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("webclips");
    if (data) setClips(JSON.parse(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📂 Saved Clips</h1>
      {clips.length === 0 ? (
        <p className="text-gray-600">No clips saved yet.</p>
      ) : (
        <div className="space-y-4">
          {clips.map((clip, i) => (
            <div key={i} className="bg-white p-4 rounded shadow">
              <p className="text-xs text-gray-500 mb-1">{clip.date}</p>
              <a
                href={clip.url}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                {clip.url}
              </a>
              <p className="text-sm mt-2"><strong>📌 Text:</strong> {clip.text}</p>
              {clip.summary && (
                <p className="text-sm mt-2 text-yellow-800 bg-yellow-50 p-2 rounded">
                  <strong>🧠 Summary:</strong> {clip.summary}
                </p>
              )}
              {clip.note && (
                <p className="text-sm mt-2 italic text-gray-700">
                  <strong>📝 Note:</strong> {clip.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
