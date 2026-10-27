import React, { useState } from "react";
import { Clapperboard, Loader2, Sparkles, X } from "lucide-react";
import { ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";
import type { RewardedAdResult } from "../utils/ads";

interface HintsAdModalProps {
  themeId: ThemeId;
  hintsPerAd: number;
  onWatchAd: () => Promise<RewardedAdResult>;
  onClose: () => void;
}

export const HintsAdModal: React.FC<HintsAdModalProps> = ({
  themeId,
  hintsPerAd,
  onWatchAd,
  onClose
}) => {
  const currentTheme = getModalTheme(themeId);
  const [adState, setAdState] = useState<"idle" | "loading" | RewardedAdResult>("idle");

  const handleWatchAd = async () => {
    if (adState === "loading") return;
    setAdState("loading");
    setAdState(await onWatchAd());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${currentTheme.textColor}`}>Suas dicas acabaram</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl ${currentTheme.buttonBg} transition cursor-pointer`}
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          As dicas grátis desta partida já foram usadas. Assista a um anúncio curto até o final e ganhe{" "}
          <strong className="text-amber-400">+{hintsPerAd} dicas</strong>. Uma delas já aparece em seguida.
        </p>

        <div className="flex flex-col gap-2">
          <button
            id="btn-watch-ad-hints"
            onClick={handleWatchAd}
            disabled={adState === "loading"}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:cursor-wait"
          >
            {adState === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Clapperboard className="w-4 h-4" />
            )}
            <span>{adState === "loading" ? "Carregando anúncio…" : `Assistir anúncio e ganhar +${hintsPerAd} dicas`}</span>
          </button>

          {adState === "dismissed" && (
            <p className="text-[11px] text-amber-500 font-semibold text-center">
              Assista até o final para ganhar as dicas.
            </p>
          )}
          {adState === "unavailable" && (
            <p className="text-[11px] text-amber-500 font-semibold text-center">
              Anúncio indisponível agora. Tente de novo em instantes.
            </p>
          )}

          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl ${currentTheme.buttonBg} text-xs font-semibold transition active:scale-95 cursor-pointer`}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};
