import { useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";

export default function VideoPlayer({ source }) {
  const [loading, setLoading] = useState(true);

  if (!source?.embed) {
    return null;
  }

  const handleNavigation = (event) => {
    const url = event.url;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.log("URL bloqueada:", url);
      return false;
    }
    const blockedDomains = ["ads", "doubleclick", "amskiploomr", "adnxs"];
    if (blockedDomains.some((domain) => url.includes(domain))) {
      console.log("Dominio bloqueado:", url);
      return false;
    }

    return true; 
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#fff" style={styles.loading} />
      )}
      <WebView
        source={{ uri: source.embed }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadEnd={() => setLoading(false)}
        originWhitelist={["*"]}
        allowsFullscreenVideo
        onShouldStartLoadWithRequest={handleNavigation}
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    backgroundColor: "black",
    borderRadius: 12,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: "absolute",
    top: "45%",
    left: "45%",
    zIndex: 2,
  },
});
