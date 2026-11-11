import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sudokumasterpro.app',
  appName: 'Sudoku Master Pro',
  webDir: 'dist',
  // Fundo escuro nativo: se a WebView perder a camada por um instante, não aparece branco
  backgroundColor: '#0b1329',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false
  }
};

export default config;
