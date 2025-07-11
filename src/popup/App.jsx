import React, { useEffect, useState } from "react";

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
          console.log("📥 Selected via scripting:", selected);
          setSelectedText(selected);
        }
      );
    });
  }, []);

  const handleSummarize = async () => {
    setLoading(true);
    const response = await fetch("https://api.example.com/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText }),
    });
    const data = await response.json();
    setSummary(data.summary || "Could not summarize.");
    setLoading(false);
  };

 const handleSave = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs.length) {
      alert("❌ Could not get current tab.");
      return;
    }

    const currentTab = tabs[0];
    const clip = {
      text: selectedText,
      note,
      summary,
      url: currentTab.url,       // ✅ This is the real URL!
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("webclips") || "[]");
    existing.push(clip);
    localStorage.setItem("webclips", JSON.stringify(existing));

    alert("📌 Clip Saved Successfully!");
    setNote("");
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
