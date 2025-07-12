import React, { useEffect, useState } from "react";

export default function App() {
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

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
          console.log("📥 Selected via scripting:", selected);
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
 // Replace with real key
      },
      body: JSON.stringify({
        text: selectedText,
        length: "medium", // short | medium | long
        format: "paragraph", // bulleted | paragraph
        model: "command", // or command-nightly (latest)
        extractiveness: "auto" // low | medium | high | auto
      })
    });

    const data = await res.json();
    console.log("🧠 Cohere summary:", data);

    if (data.summary) {
      setSummary(data.summary);
    } else {
      setSummary("No summary generated.");
    }

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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="p-4 w-[320px] bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-blue-700">🔖 Web Clipper</h1>

      <div>
        <p className="text-xs text-gray-500">Selected Text:</p>
        <div className="text-sm text-gray-800 bg-gray-100 rounded p-2 max-h-[100px] overflow-y-auto">
          {selectedText || "No text selected."}
        </div>
      </div>

      <textarea
        placeholder="📝 Add a note..."
        rows={2}
        className="w-full p-2 border border-gray-300 rounded text-sm"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded shadow"
      >
        {loading ? "Summarizing..." : "🧠 Summarize"}
      </button>

      {summary && (
        <div className="text-sm text-gray-800 bg-yellow-100 p-2 rounded">
          <strong>AI Summary:</strong>
          <p>{summary}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded shadow"
      >
        💾 Save Clip
      </button>

      <button
        onClick={openDashboard}
        className="text-blue-500 underline text-sm text-center w-full"
      >
        📂 View Saved Clips
      </button>
    </div>
  );
}
