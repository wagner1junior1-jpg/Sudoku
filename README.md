# Sudoku Master Pro

Jogo de Sudoku 100% offline (React + Vite + Tailwind) empacotado para Android com Capacitor.

## Desenvolvimento

```bash
npm install
npm run dev        # servidor local em http://localhost:3000
npm run lint       # checagem de tipos (tsc)
```

## Android

Requer **JDK 21** (o JBR do Android Studio recente é Java 25 e quebra o Gradle 8.14) e Android SDK.

```bash
npm run cap:sync   # vite build + cap sync android
cd android
./gradlew assembleDebug     # APK de teste
./gradlew bundleRelease     # AAB para a Play Store (assinado se keystore.properties existir)
```

Publicação na Google Play: veja [PLAY_STORE.md](PLAY_STORE.md).
