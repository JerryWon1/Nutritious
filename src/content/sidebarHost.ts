const SIDEBAR_HOST_ID = "nutritious-sidebar-host";
const SIDEBAR_STYLE_ID = "nutritious-sidebar-styles";
export const SIDEBAR_WIDTH_PX = 400;

const PANEL_URL = chrome.runtime.getURL("sidebar.html");

async function requestHostTabId(): Promise<number | undefined> {
  try {
    const res = (await chrome.runtime.sendMessage({ type: "NUTRITIOUS_GET_HOST_TAB" })) as
      | { tabId?: number }
      | undefined;
    return typeof res?.tabId === "number" ? res.tabId : undefined;
  } catch {
    return undefined;
  }
}

function panelUrlForHostTab(tabId: number | undefined): string {
  return tabId != null ? `${PANEL_URL}?hostTabId=${tabId}` : PANEL_URL;
}

function injectStyles(): void {
  if (document.getElementById(SIDEBAR_STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = SIDEBAR_STYLE_ID;
  style.textContent = `
    #${SIDEBAR_HOST_ID} {
      position: fixed;
      top: 0;
      right: 0;
      width: ${SIDEBAR_WIDTH_PX}px;
      height: 100vh;
      height: 100dvh;
      z-index: 2147483647;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.35);
      background: #0f1115;
      box-sizing: border-box;
      pointer-events: auto;
    }
    #${SIDEBAR_HOST_ID} iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      background: #0f1115;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

function removeStyles(): void {
  document.getElementById(SIDEBAR_STYLE_ID)?.remove();
}

export function isSidebarInjected(): boolean {
  return Boolean(document.getElementById(SIDEBAR_HOST_ID));
}

export async function openSidebar(): Promise<void> {
  if (isSidebarInjected()) {
    return;
  }
  injectStyles();

  const host = document.createElement("div");
  host.id = SIDEBAR_HOST_ID;
  host.setAttribute("role", "complementary");
  host.setAttribute("aria-label", "Nutritious nutrition sidebar");

  const iframe = document.createElement("iframe");
  iframe.src = panelUrlForHostTab(await requestHostTabId());
  iframe.title = "Nutritious";
  iframe.allow = "clipboard-read; clipboard-write";

  host.appendChild(iframe);
  document.documentElement.appendChild(host);
}

export function closeSidebar(): void {
  document.getElementById(SIDEBAR_HOST_ID)?.remove();
  if (!isSidebarInjected()) {
    removeStyles();
  }
}

export function toggleSidebar(): boolean {
  if (isSidebarInjected()) {
    closeSidebar();
    return false;
  }
  void openSidebar();
  return true;
}

export async function persistSidebarOpen(open: boolean): Promise<void> {
  await chrome.storage.local.set({ sidebarOpen: open });
}

export async function shouldRestoreSidebar(): Promise<boolean> {
  const raw = await chrome.storage.local.get("sidebarOpen");
  return raw.sidebarOpen === true;
}
