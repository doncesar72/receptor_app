import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.receptor.app',
  appName: 'РЕЦЕПТОР',
  webDir: 'public',
  version: '1.0.1',
  server: {
    url: 'https://receptor-app-beta.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;
