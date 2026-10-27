import React from "react";
import { Palette, X, Check, Sparkles } from "lucide-react";
import { ThemeId } from "../types";
import { THEMES, getModalTheme } from "../utils/themes";

interface QuickThemeModalProps {
  currentThemeId: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const QuickThemeModal: React.FC<QuickThemeModalProps> = ({
  currentThemeId,
  onSelectTheme,
  onClose
}) => {
  const currentTheme = getModalTheme(currentThemeId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-tight flex items-center gap-1.5 font-['Outfit']">
                Paleta de Cores <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[11px] text-slate-400">
                Toque para trocar instantaneamente o visual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* 8 Themes Grid with Visual Swatches */}
        <div className="p-3.5 grid grid-cols-2 gap-2 max-h-[65vh] overflow-y-auto">
          {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
            const th = THEMES[themeKey];
            const isSelected = currentThemeId === themeKey;

            return (
              <button
                key={themeKey}
                onClick={() => {
                  onSelectTheme(themeKey);
                }}
                className={`p-2.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer relative overflow-hidden active:scale-95 ${
                  isSelected
                    ? "ring-2 ring-blue-400 border-blue-400 shadow-lg scale-[1.02]"
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{
                  backgroundColor: th.swatch.bg
                }}
              >
                {/* Mini Swatch Dots & Badge */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    {/* Primary Color Dot */}
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: th.swatch.accent }}
                    />
                    {/* Secondary Color Dot */}
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: th.swatch.bg }}
                    />
                  </div>

                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-400"
                        : "bg-white/10 text-slate-300 border-white/10"
                    }`}
                  >
                    {th.badge}
                  </span>
                </div>

                {/* Theme Name */}
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-xs font-bold leading-snug"
                    style={{ color: th.swatch.text }}
                  >
                    {th.name}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/30 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            8 paletas otimizadas para leitura e OLED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};
