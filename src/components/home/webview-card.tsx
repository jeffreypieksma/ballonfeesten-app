import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { ErrorBanner } from '@/components/home/error-banner';
import { parseWebviewMessage, WEBVIEW_BRIDGE_SCRIPT } from '@/lib/webview-bridge';

type WebviewCardProps = {
  html: string;
  onAction?: (payload: string) => void;
  minHeight?: number;
};

// Renders remotely-editable content (copy that should update without an app
// store review) inside a native card. Swap `html` for `source={{ uri: CONTENT_BASE_URL + '/...' }}`
// once a real hosted content endpoint exists — the native shell around this never changes.
export function WebviewCard({ html, onAction, minHeight = 80 }: WebviewCardProps) {
  const [height, setHeight] = useState(minHeight);
  const [hasError, setHasError] = useState(false);

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = parseWebviewMessage(event.nativeEvent.data);
    if (!message) return;
    if (message.type === 'height') setHeight(Math.max(minHeight, message.value));
    if (message.type === 'action' && onAction) onAction(message.payload);
  };

  if (hasError) {
    return <ErrorBanner message="Content kon niet worden geladen." onRetry={() => setHasError(false)} />;
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html }}
        onMessage={handleMessage}
        injectedJavaScript={WEBVIEW_BRIDGE_SCRIPT}
        onError={() => setHasError(true)}
        scrollEnabled={false}
        style={styles.webview}
        containerStyle={styles.webview}
        backgroundColor="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});
