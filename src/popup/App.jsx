import React, { useEffect, useState } from "react";
import { COHERE_API_KEY } from "./config";
import "./popup.css";

export default function App() {
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs.length) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => window.getSelection().toString().trim(),
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error("❌ Scripting error:", chrome.runtime.lastError.message);
            return;
          }
          const selected = results?.[0]?.result || "";
          setSelectedText(selected);
        }
      );
    });
  }, []);

  const handleSummarize = async () => {
    if (!selectedText.trim()) {
      alert("❌ No text selected to summarize.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://api.cohere.ai/v1/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          text: selectedText,
          length: "medium",
          format: "paragraph",
          model: "command",
          extractiveness: "auto",
        }),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary generated.");
    } catch (error) {
      console.error("❌ Cohere summarization error:", error);
      alert("Failed to summarize using Cohere.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || !tabs.length) {
        alert("❌ Could not get current tab.");
        return;
      }

      const currentTab = tabs[0];
      const clip = {
        text: selectedText,
        note,
        summary,
        url: currentTab.url,
        date: new Date().toLocaleString(),
      };

      try {
        const res = await fetch("http://localhost:5000/api/clips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clip),
        });

        const data = await res.json();
        if (res.ok) {
          alert("📌 Clip Saved to MongoDB!");
          setNote("");
        } else {
          alert("❌ Failed to save: " + data.error);
        }
      } catch (error) {
        alert("❌ Error: " + error.message);
      }
    });
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  };

  return (
    <div className="popup-container">
      <h1 className="title">🔖 Web Clipper</h1>

      <div>
        <p className="label">Selected Text:</p>
        <div className="text-block">
          {selectedText || "No text selected."}
        </div>
      </div>

      <textarea
        placeholder="📝 Add a note..."
        rows={2}
        className="note-input"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={handleSummarize} className="btn summarize-btn" disabled={loading}>
        {loading ? "Summarizing..." : "🧠 Summarize"}
      </button>

      {summary && (
        <div className="summary-box">
          <strong>AI Summary:</strong>
          <p>{summary}</p>
        </div>
      )}

      <button onClick={handleSave} className="btn save-btn">
        💾 Save Clip
      </button>

      <button onClick={openDashboard} className="btn dashboard-link">

        📂 View Saved Clips
      </button>
    </div>
  );
}
