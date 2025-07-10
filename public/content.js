console.log("✅ Hello from content script!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SELECTION") {
    const selectedText = window.getSelection().toString().trim();
    console.log("📋 Selected Text from content.js:", selectedText);
    sendResponse({ selectedText });
  }
  return true;
});
