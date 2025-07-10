console.log("✅ Hello from content script!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 Message received in content.js:", message);

  if (message.type === "GET_SELECTION") {
    const selectedText = window.getSelection().toString().trim();
    console.log("📋 Selected Text:", selectedText);

    sendResponse({ selectedText });
  }

  return true;
});
