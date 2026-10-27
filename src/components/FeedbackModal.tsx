import React, { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bug,
  Lightbulb,
  Copy,
  Check,
  Phone
} from "lucide-react";
import { ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";

interface FeedbackModalProps {
  themeId: ThemeId;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ themeId, onClose }) => {
  const currentTheme = getModalTheme(themeId);
  const [copied, setCopied] = useState(false);

  const rawNumber = "5562992549588";
  const formattedNumber = "(62) 99254-9588";
  const defaultMessage = encodeURIComponent(
    "Olá! Estou jogando o Sudoku Master Pro e gostaria de enviar uma sugestão / relatar um erro:"
  );
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${defaultMessage}`;

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText("62992549588");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard indisponível: o número continua visível na tela
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md p-6 rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col gap-4 animate-scale-up`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-lg font-black ${currentTheme.textColor} font-['Outfit']`}>
                Sugestões ou Erros?
              </h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Fale diretamente com o desenvolvedor
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

        {/* Informative Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem alguma ideia de melhoria, nova funcionalidade ou tema que gostaria de ver no jogo?
            </p>
          </div>

          <div className="flex items-start gap-2.5 border-t border-slate-800/80 pt-2">
            <div className="p-1.5 rounded-xl bg-rose-500/15 text-rose-400 shrink-0 mt-0.5">
              <Bug className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Encontrou algum problema, erro de lógica ou travamento durante suas partidas?
            </p>
          </div>
        </div>

        {/* WhatsApp Main Button */}
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer uppercase tracking-wider border border-emerald-400/40"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Falar no WhatsApp</span>
          </a>

          {/* Quick Copy Number Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/20 border border-white/5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold">{formattedNumber}</span>
            </div>

            <button
              onClick={handleCopyNumber}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 transition active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copiar Número</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
