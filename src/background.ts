chrome.runtime.onInstalled.addListener(() => {
  // Placeholder service worker for future features (analytics opt-in, API sync, etc.).
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    return;
  }
  const url = tab.url ?? "";
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("file://")
  ) {
    return;
  }
  void chrome.tabs.sendMessage(tab.id, { type: "NUTRITIOUS_TOGGLE_SIDEBAR" }).catch(async () => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ["contentScript.js"]
      });
      await chrome.tabs.sendMessage(tab.id!, { type: "NUTRITIOUS_TOGGLE_SIDEBAR" });
    } catch {
      /* restricted page */
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "PING_NUTRITIOUS") {
    sendResponse({ ok: true, service: "nutritious-background" });
    return true;
  }
  if (message?.type === "NUTRITIOUS_GET_HOST_TAB") {
    sendResponse({ tabId: sender.tab?.id });
    return true;
  }
  return undefined;
});
