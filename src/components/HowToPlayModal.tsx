import React from "react";
import { HelpCircle, X, CheckCircle, BookOpen, Lightbulb, Keyboard } from "lucide-react";
import { ThemeId } from "../types";
import { getModalTheme } from "../utils/themes";

interface HowToPlayModalProps {
  themeId: ThemeId;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ themeId, onClose }) => {
  const currentTheme = getModalTheme(themeId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${currentTheme.textColor} font-['Outfit']`}>
                Como Jogar Sudoku
              </h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Regras fundamentais, estratégias e atalhos úteis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} transition active:scale-95 cursor-pointer`}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Regras Básicas
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>O objetivo é preencher a grade 9x9 com números de <strong>1 a 9</strong>.</li>
              <li>Cada <strong>linha horizontal</strong> deve conter todos os números de 1 a 9 sem repetições.</li>
              <li>Cada <strong>coluna vertical</strong> deve conter todos os números de 1 a 9 sem repetições.</li>
              <li>Cada um dos <strong>9 blocos 3x3</strong> deve conter os números de 1 a 9 sem repetições.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Dicas e Técnicas
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li><strong>Modo Anotações (Lápis):</strong> Anote possíveis candidatos em células vazias para facilitar a dedução.</li>
              <li><strong>Candidato Único (Naked Single):</strong> Se uma célula só pode receber 1 número após eliminar os da linha, coluna e bloco, preencha-a!</li>
              <li><strong>Verificação em Tempo Real:</strong> Números incorretos ou em conflito são destacados para ajudar no treino.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-indigo-400" /> Atalhos de Teclado
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Números 1-9:</span>
                <span className="font-mono text-indigo-400 font-bold">1..9</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Anotações / Lápis:</span>
                <span className="font-mono text-indigo-400 font-bold">N</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Apagar Célula:</span>
                <span className="font-mono text-indigo-400 font-bold">Del / Backspace</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Desfazer Jogada:</span>
                <span className="font-mono text-indigo-400 font-bold">Ctrl+Z / U</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Pausar / Retomar:</span>
                <span className="font-mono text-indigo-400 font-bold">Espaço</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span>Navegação:</span>
                <span className="font-mono text-indigo-400 font-bold">Setas ← ↑ ↓ →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-black/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
          >
            Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};
