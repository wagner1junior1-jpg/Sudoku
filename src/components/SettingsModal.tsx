import React from "react";
import {
  Settings,
  X,
  Palette,
  Eye,
  Volume2,
  VolumeX,
  Vibrate,
  ShieldCheck,
  Sparkles,
  User,
  Sliders,
  Check
} from "lucide-react";
import { GameSettings, ThemeId, UserProfile } from "../types";
import { THEMES } from "../utils/themes";

interface SettingsModalProps {
  settings: GameSettings;
  userProfile: UserProfile;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  userProfile,
  onUpdateSettings,
  onUpdateProfile,
  onClose
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES["light-classic"];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl ${currentTheme.cardBg} border shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${currentTheme.textColor} font-['Outfit']`}>
                Configurações & Temas
              </h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Personalize a aparência, sons e regras visuais do jogo
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Theme Selector (Custom Dark Mode & Themes) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Modo Escuro & Temas Personalizados
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(THEMES) as ThemeId[]).map((tKey) => {
                const th = THEMES[tKey];
                const isSelected = settings.theme === tKey;

                return (
                  <button
                    key={tKey}
                    onClick={() => onUpdateSettings({ theme: tKey })}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "border-blue-400 ring-2 ring-blue-500 shadow-md"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={{ backgroundColor: th.swatch?.bg || "#111827" }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: th.swatch?.accent || "#3b82f6" }}
                        />
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40 text-white border border-white/10">
                          {th.badge}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 stroke-[3]" />}
                    </div>
                    <span
                      className="text-xs font-bold leading-tight mt-1"
                      style={{ color: th.swatch?.text || "#ffffff" }}
                    >
                      {th.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gameplay & Real-time validation Toggles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Verificação e Assistência Visual
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Real-time Error Check */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Verificação de Erros em Tempo Real
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Destaca em vermelho os números preenchidos incorretamente
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.realTimeValidation}
                  onChange={(e) => onUpdateSettings({ realTimeValidation: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              {/* Highlight Duplicates / Conflicts */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Destacar Conflitos Duplicados
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Alerta instantaneamente quando houver números repetidos na mesma linha, coluna ou bloco
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightDuplicates}
                  onChange={(e) => onUpdateSettings({ highlightDuplicates: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              {/* Highlight Same Numbers */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Destacar Números Iguais
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ilumina no tabuleiro todas as células com o mesmo número selecionado
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightSameNumbers}
                  onChange={(e) => onUpdateSettings({ highlightSameNumbers: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              {/* Highlight Crosshair */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Destaque em Cruz (Linha, Coluna e Bloco)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Facilita a visualização do eixo da célula ativa
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightCrosshair}
                  onChange={(e) => onUpdateSettings({ highlightCrosshair: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              {/* Auto-clear Notes */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Remover Anotações Automaticamente
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Limpa o número anotado da linha, coluna e bloco quando o valor for confirmado
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoClearNotes}
                  onChange={(e) => onUpdateSettings({ autoClearNotes: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              {/* Max Mistakes Limit (3 Strikes) */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-bold text-slate-100">
                    Regra Clássica de 3 Erros (Game Over)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Se desativado, o jogo permite erros ilimitados com penalidade na pontuação final
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maxMistakesLimit}
                  onChange={(e) => onUpdateSettings({ maxMistakesLimit: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Sound & Haptics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Áudio e Vibração
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-100">Sons</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-100">Vibração</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hapticEnabled}
                  onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Player Profile */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Perfil de Jogador para o Ranking
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nome / Apelido</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => onUpdateProfile({ ...userProfile, name: e.target.value })}
                  maxLength={25}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">País (Sigla)</label>
                <input
                  type="text"
                  value={userProfile.country}
                  onChange={(e) => onUpdateProfile({ ...userProfile, country: e.target.value.toUpperCase() })}
                  maxLength={3}
                  placeholder="BR"
                  className="w-24 uppercase font-mono font-bold px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-black/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
          >
            Salvar & Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
