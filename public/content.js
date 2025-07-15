chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SELECTION") {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ selectedText });
  }
  return true;
});

// Highlight matching text based on URL fragment
window.addEventListener("load", () => {
  const hash = decodeURIComponent(window.location.hash);
  if (!hash.startsWith("#clip=")) return;

  const textToFind = hash.replace("#clip=", "").trim();
  if (!textToFind) return;

  console.log("🔍 Looking for:", textToFind);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) textNodes.push(node);
  }

  highlightMultiNodeText(textNodes, textToFind);
});

function highlightMultiNodeText(nodes, textToFind) {
  const flatTexts = nodes.map((n) => n.textContent);
  const fullText = flatTexts.join("");

  const index = fullText.indexOf(textToFind);
  if (index === -1) {
    console.warn("❌ Text not found in DOM.");
    return;
  }

  // Find the start and end node for the selection
  let charCount = 0;
  let startNode = null,
    endNode = null;
  let startOffset = 0,
    endOffset = 0;

  for (let i = 0; i < nodes.length; i++) {
    const text = nodes[i].textContent;
    const nextCharCount = charCount + text.length;

    if (!startNode && index >= charCount && index < nextCharCount) {
      startNode = nodes[i];
      startOffset = index - charCount;
    }

    if (startNode && index + textToFind.length <= nextCharCount) {
      endNode = nodes[i];
      endOffset = (index + textToFind.length) - charCount;
      break;
    }

    charCount = nextCharCount;
  }

  if (!startNode || !endNode) {
    console.warn("⚠️ Could not resolve start/end nodes for highlight.");
    return;
  }

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  const mark = document.createElement("mark");
  mark.style.backgroundColor = "yellow";
  mark.style.padding = "2px";

  try {
    range.surroundContents(mark);
    mark.scrollIntoView({ behavior: "smooth", block: "center" });

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    console.log("✅ Highlighted full selection across nodes.");
  } catch (err) {
    console.warn("⚠️ Could not surround contents:", err);
  }
}
