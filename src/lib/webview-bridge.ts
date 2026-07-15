export type WebviewBridgeMessage =
  | { type: 'height'; value: number }
  | { type: 'action'; payload: string };

export function parseWebviewMessage(raw: string): WebviewBridgeMessage | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.type === 'height' && typeof parsed.value === 'number') return parsed;
    if (parsed?.type === 'action' && typeof parsed.payload === 'string') return parsed;
    return null;
  } catch {
    return null;
  }
}

// Injected into the WebView so the hosted content page can report its rendered
// height (for auto-sizing the native card) and forward taps back to native
// code (so navigation/haptics stay native even though the content is web-rendered).
export const WEBVIEW_BRIDGE_SCRIPT = `
  (function () {
    function reportHeight() {
      var height = document.documentElement.scrollHeight;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', value: height }));
    }
    window.addEventListener('load', reportHeight);
    window.addEventListener('resize', reportHeight);
    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-action]');
      if (target) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'action', payload: target.getAttribute('data-action') })
        );
      }
    });
    setTimeout(reportHeight, 50);
    true;
  })();
`;
