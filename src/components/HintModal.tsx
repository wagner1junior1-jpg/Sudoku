import React from "react";
import { Sparkles, X, Check, HelpCircle } from "lucide-react";
import { HintExplanation, ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";

interface HintModalProps {
  hint: HintExplanation;
  themeId: ThemeId;
  onApplyHint: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  hint,
  themeId,
  onApplyHint,
  onClose
}) => {
  const currentTheme = getModalTheme(themeId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Dica Estratégica
              </span>
              <h3 className={`text-base font-bold ${currentTheme.textColor}`}>
                {hint.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl ${currentTheme.buttonBg} transition cursor-pointer`}
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Explanation body */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
          <p className="whitespace-pre-line max-h-[45vh] overflow-y-auto">{hint.explanation}</p>

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Valor a preencher:</span>
            <span className="font-mono font-extrabold text-amber-400 text-lg px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              {hint.value}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl ${currentTheme.buttonBg} text-xs font-semibold transition active:scale-95 cursor-pointer`}
          >
            Entendi, vou preencher
          </button>

          <button
            onClick={onApplyHint}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar no Tabuleiro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
