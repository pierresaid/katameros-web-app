import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dcoanbamarc.katamerosmobile',
  appName: 'Katameros',
  webDir: 'dist',
  backgroundColor: '#121212',
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFC107',
      overlaysWebView: false,
    },
  },
};

export default config;
