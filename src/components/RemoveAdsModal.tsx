import React, { useEffect, useState } from "react";
import { Check, Loader2, ShieldOff, X } from "lucide-react";
import { ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";
import {
  REMOVE_ADS_FALLBACK_PRICE,
  loadRemoveAdsPrice,
  purchaseRemoveAds,
  syncAdsRemoved
} from "../utils/billing";

interface RemoveAdsModalProps {
  themeId: ThemeId;
  adsRemoved: boolean;
  onAdsRemoved: () => void;
  onClose: () => void;
}

const BENEFITS = [
  "Sem a faixa de anúncio na parte de baixo",
  "Sem anúncios para ganhar vidas extras",
  "Pagamento único: vale para sempre, sem assinatura",
  "Ajuda a manter e melhorar o jogo"
];

export const RemoveAdsModal: React.FC<RemoveAdsModalProps> = ({
  themeId,
  adsRemoved,
  onAdsRemoved,
  onClose
}) => {
  const currentTheme = getModalTheme(themeId);
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState<"buy" | "restore" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadRemoveAdsPrice().then(setPrice);
  }, []);

  const handleBuy = async () => {
    setBusy("buy");
    setMessage(null);
    const result = await purchaseRemoveAds();
    setBusy(null);
    if (result === "purchased") onAdsRemoved();
    else if (result === "unavailable") {
      setMessage("Compra indisponível no momento. Verifique sua conexão e tente novamente.");
    }
  };

  const handleRestore = async () => {
    setBusy("restore");
    setMessage(null);
    const owned = await syncAdsRemoved();
    setBusy(null);
    if (owned) onAdsRemoved();
    else setMessage("Nenhuma compra encontrada nesta conta Google.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldOff className="w-6 h-6" />
            </div>
            <h2 className={`text-lg font-black ${currentTheme.textColor} font-['Outfit']`}>
              Remover anúncios
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {adsRemoved ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <Check className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-sm text-slate-200 font-semibold">
              Anúncios removidos. Obrigado por apoiar o Sudoku Master Pro!
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              id="btn-buy-remove-ads"
              onClick={handleBuy}
              disabled={busy !== null}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-70 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:cursor-wait"
            >
              {busy === "buy" && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Remover anúncios · {price ?? REMOVE_ADS_FALLBACK_PRICE}</span>
            </button>

            <button
              onClick={handleRestore}
              disabled={busy !== null}
              className={`w-full py-2.5 rounded-xl ${currentTheme.buttonBg} ${currentTheme.textColor} text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-70`}
            >
              {busy === "restore" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Já comprei: restaurar compra</span>
            </button>

            {message && <p className="text-xs text-amber-400 font-semibold text-center">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};
