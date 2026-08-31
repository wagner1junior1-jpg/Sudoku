import React from "react";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const PWAUpdateToast: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      // Periodically check for updates every 60 minutes
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    }
  });

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto p-4 rounded-2xl bg-slate-950/90 border border-blue-500/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-slate-100 animate-slide-up">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-blue-400">
            Atualização Disponível
          </p>
          <p className="text-xs text-slate-300 font-medium truncate">
            Uma nova versão do Sudoku Master Pro está pronta!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar</span>
        </button>

        <button
          onClick={() => setNeedRefresh(false)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
