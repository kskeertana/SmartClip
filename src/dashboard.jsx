import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Dashboard() {
  const [clips, setClips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNote, setShowNote] = useState(null);
  const [showSummary, setShowSummary] = useState(null);
  const [expandedText, setExpandedText] = useState(null);
  const [loadingClipId, setLoadingClipId] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch("http://localhost:5000/api/clips")
      .then((res) => res.json())
      .then((data) => setClips(data))
      .catch((err) => console.error("❌ Failed to fetch clips:", err));
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const deleteClip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this clip?")) return;
    try {
      await fetch(`http://localhost:5000/api/clips/${id}`, { method: "DELETE" });
      setClips((prev) => prev.filter((clip) => clip._id !== id));
    } catch (err) {
      alert("❌ Failed to delete clip.");
    }
  };

  const deleteAllClips = async () => {
    if (!window.confirm("Are you sure you want to delete ALL clips?")) return;
    try {
      await fetch(`http://localhost:5000/api/clips`, { method: "DELETE" });
      setClips([]);
    } catch (err) {
      alert("❌ Failed to delete all clips.");
    }
  };

  const togglePin = async (id) => {
    const res = await fetch(`http://localhost:5000/api/clips/${id}/pin`, { method: "PUT" });
    const data = await res.json();
    setClips((prev) => prev.map((c) => (c._id === id ? data.clip : c)));
  };

  const summarizeClip = async (clipId, text) => {
    try {
      setLoadingClipId(clipId);
      const res = await fetch("https://api.cohere.ai/v1/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          length: "medium",
          format: "paragraph",
          model: "command",
          extractiveness: "auto",
        }),
      });
      const data = await res.json();
      setClips((prev) =>
        prev.map((c) => (c._id === clipId ? { ...c, summary: data.summary || "No summary." } : c))
      );
      setShowSummary(clipId);
    } catch (err) {
      alert("❌ Failed to summarize.");
    } finally {
      setLoadingClipId(null);
    }
  };

  const sortedClips = [...clips]
    .filter(
      (clip) =>
        clip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clip.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.pin - a.pin);

  return (
    <div className="dashboard">
      <div className="container">
        <header className="header">
          <h1 className="title">📎 Web Clipper Dashboard</h1>
          <div className="header-actions">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search your saved clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="delete-all-btn" onClick={deleteAllClips}>
              🗑️
            </button>
            <button className="toggle-mode-btn" onClick={toggleTheme}>
              {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </header>

        {sortedClips.length === 0 ? (
          <p className="no-clips">No clips saved yet.</p>
        ) : (
          <div className="clip-list">
            {sortedClips.map((clip, index) => (
              <div key={clip._id} className="clip-card">
                <a
                  href={`${clip.url}#clip=${encodeURIComponent(clip.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-page-btn"
                >
                  🌐 Open Saved Page
                </a>

                <div className="clip-content">
                  <p className="clip-date">{clip.date}</p>

                  <div className="clip-text">
                    <h3 className="clip-text-title">📌 Selected Text</h3>
                    <div className="clip-text-body">
                      {expandedText === index
                        ? clip.text
                        : `${clip.text.slice(0, 300)}${clip.text.length > 300 ? "..." : ""}`}
                      {clip.text.length > 300 && (
                        <button
                          onClick={() => setExpandedText(expandedText === index ? null : index)}
                          className="show-more-btn"
                        >
                          {expandedText === index ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>
                  </div>

                  {showNote === index && (
                    <div className="note-box">
                      <strong>Note:</strong>{" "}
                      {clip.note || <span className="faded">No note saved.</span>}
                    </div>
                  )}

                  {showSummary === index && (
                    <div className="summary-box">
                      <strong>Summary:</strong>
                      <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                        {clip.summary || <span className="faded">No summary available.</span>}
                      </div>
                      {clip.summary && (
                        <button
                          className="copy-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(clip.summary);
                            alert("✅ Summary copied!");
                          }}
                        >
                          📋 Copy
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="clip-actions">
                  <button
                    onClick={() => setShowNote(showNote === index ? null : index)}
                    className="btn note-btn"
                  >
                    📝 View Note
                  </button>
                  <button
                    onClick={() => setShowSummary(showSummary === index ? null : index)}
                    className="btn summary-btn"
                  >
                    🧠 View Summary
                  </button>
                  <button
                    onClick={() => summarizeClip(clip._id, clip.text)}
                    className="btn summarize-btn"
                    disabled={loadingClipId === clip._id}
                  >
                    {loadingClipId === clip._id ? "Summarizing..." : "⚡ Summarize"}
                  </button>
                  <button
                    onClick={() => togglePin(clip._id)}
                    className={`btn ${clip.pin ? "unpin-btn" : "pin-btn"}`}
                  >
                    {clip.pin ? "📌 Unpin" : "📍 Pin"}
                  </button>
                  <button
                    onClick={() => deleteClip(clip._id)}
                    className="btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
