chrome.runtime.onInstalled.addListener(() => {
  // Placeholder service worker for future features (analytics opt-in, API sync, etc.).
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING_NUTRITIOUS") {
    sendResponse({ ok: true, service: "nutritious-background" });
    return true;
  }
  return undefined;
});
