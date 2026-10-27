import { Capacitor } from "@capacitor/core";

// true quando rodando dentro do app Android (Capacitor); false no navegador/PWA
export const isNativeApp = Capacitor.isNativePlatform();
