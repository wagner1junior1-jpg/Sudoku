import React, { useState, useEffect } from "react";
import {
  Download,
  X,
  Smartphone,
  WifiOff,
  Zap,
  Maximize2,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { ThemeId } from "../types";
import { THEMES } from "../utils/themes";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PWAInstallModalProps {
  themeId: ThemeId;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onClose: () => void;
  onInstallSuccess?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  themeId,
  deferredPrompt,
  onClose,
  onInstallSuccess
}) => {
  const currentTheme = THEMES[themeId] || THEMES["dark-slate"];
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if running on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    // Check if already in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(Boolean(standalone));
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Erro ao solicitar instalação PWA:", err);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-5 animate-scale-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center text-white">
                <Download className="w-6 h-6 animate-bounce" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`text-lg font-black ${currentTheme.textColor} font-['Outfit']`}>
                  Instalar Sudoku Pro
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  App PWA
                </span>
              </div>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Tenha a melhor experiência no seu aparelho
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-blue-400">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs font-bold">100% Offline</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Jogue em qualquer lugar, mesmo sem sinal de internet ou dados móveis.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Maximize2 className="w-4 h-4" />
              <span className="text-xs font-bold">Tela Cheia</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Interface imersiva como aplicativo nativo, sem barras do navegador.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold">Super Rápido</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Abertura instantânea e transições suaves com consumo mínimo de memória.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-bold">Ícone Próprio</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Acesso com 1 toque direto na tela inicial do seu celular ou computador.
            </p>
          </div>
        </div>

        {/* Installation Instructions / Action */}
        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold block">Aplicativo já instalado!</span>
              Você já está aproveitando a experiência PWA completa.
            </div>
          </div>
        ) : isIOS ? (
          /* iOS Step-by-Step Instructions */
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instalação no iPhone / iPad (Safari):</span>
            </div>

            <ol className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <span className="flex items-center gap-1.5">
                  Toque no botão <Share2 className="w-4 h-4 text-blue-400 inline mx-0.5" />{" "}
                  <strong>Compartilhar</strong> na barra do Safari.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <span className="flex items-center gap-1.5">
                  Role para baixo e selecione{" "}
                  <PlusSquare className="w-4 h-4 text-emerald-400 inline mx-0.5" />{" "}
                  <strong>Adicionar à Tela de Início</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <span>
                  Confirme tocando em <strong>Adicionar</strong> no canto superior.
                </span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          /* Native Prompt Available (Android / Chrome / Edge / Desktop) */
          <div className="flex flex-col gap-2">
            <button
              onClick={handleNativeInstall}
              disabled={installing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/35 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer uppercase tracking-wider border border-blue-400/40 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{installing ? "Instalando..." : "Instalar Aplicativo Agora"}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Instalação instantânea de 1 clique, sem precisar de loja de apps.
            </p>
          </div>
        ) : (
          /* Generic Fallback */
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 text-center flex flex-col gap-2">
            <p>
              Para instalar este jogo no seu dispositivo, abra o menu do seu navegador (três pontinhos ⋮ ou menu do navegador) e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-xs cursor-pointer self-center"
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
