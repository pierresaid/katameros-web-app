import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dcoanbamarc.katamerosmobile',
  appName: 'Katameros',
  webDir: 'dist',
  backgroundColor: '#121212',
  android: {
    // Targeting SDK 36 makes edge-to-edge mandatory on Android 16 (the
    // windowOptOutEdgeToEdgeEnforcement style attribute is ignored there),
    // so let Capacitor margin the webview from the window insets instead.
    // 'auto' only kicks in when the activity theme does NOT set
    // windowOptOutEdgeToEdgeEnforcement, so AppTheme.NoActionBar must not
    // declare it -- see android/app/src/main/res/values/styles.xml.
    adjustMarginsForEdgeToEdge: 'auto',
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFC107',
      overlaysWebView: false,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
