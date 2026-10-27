import { ThemeId } from "../types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: "dark" | "light";
  badge: string;
  swatch: {
    bg: string;
    accent: string;
    text: string;
  };
  bg: string;
  cardBg: string;
  boardBg: string;
  cellInitialBg: string;
  cellEmptyBg: string;
  cellSelectedBg: string;
  cellHighlightBg: string;
  cellSameNumberBg: string;
  cellConflictBg: string;
  cellErrorText: string;
  textColor: string;
  textMuted: string;
  initialDigitColor: string;
  userDigitColor: string;
  sameNumberTextColor: string;
  notesColor: string;
  borderColor: string;
  majorBorderColor: string;
  gridLineColor: string;
  majorGridLineColor: string;
  accentColor: string;
  accentHover: string;
  buttonBg: string;
  buttonActiveBg: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  "light-classic": {
    id: "light-classic",
    name: "Minimalista Claro",
    category: "light",
    badge: "Padrão",
    swatch: {
      bg: "#f1f5f9",
      accent: "#2563eb",
      text: "#0f172a"
    },
    bg: "bg-[#f1f5f9]",
    cardBg: "bg-white border-slate-300 shadow-md",
    boardBg: "bg-white",
    cellInitialBg: "bg-slate-100",
    cellEmptyBg: "bg-white",
    cellSelectedBg: "bg-blue-600 ring-2 sm:ring-[3px] ring-blue-300 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-blue-100/90",
    cellSameNumberBg: "bg-blue-600 ring-2 sm:ring-[2.5px] ring-blue-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-rose-100 ring-2 ring-rose-500",
    cellErrorText: "text-rose-600 font-bold",
    textColor: "text-slate-900",
    textMuted: "text-slate-500",
    initialDigitColor: "text-slate-950 font-black",
    userDigitColor: "text-blue-600 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-blue-600 font-bold",
    borderColor: "border-slate-300",
    majorBorderColor: "border-slate-800",
    gridLineColor: "bg-slate-300",
    majorGridLineColor: "bg-slate-800",
    accentColor: "bg-blue-600 text-white font-medium hover:bg-blue-700",
    accentHover: "hover:bg-blue-700",
    buttonBg: "bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300",
    buttonActiveBg: "bg-blue-600 text-white shadow-md shadow-blue-600/30"
  },
  "dark-slate": {
    id: "dark-slate",
    name: "Azul Noturno Pro",
    category: "dark",
    badge: "Safira",
    swatch: {
      bg: "#0b1329",
      accent: "#2563eb",
      text: "#ffffff"
    },
    bg: "bg-[#0b1329]",
    cardBg: "bg-[#111c38]/95 border-blue-900/50 shadow-2xl",
    boardBg: "bg-[#0c142b]",
    cellInitialBg: "bg-[#152140]",
    cellEmptyBg: "bg-[#0f1933]",
    cellSelectedBg: "bg-blue-600 ring-2 sm:ring-[3px] ring-blue-300 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-blue-600/25",
    cellSameNumberBg: "bg-blue-600 ring-2 sm:ring-[2.5px] ring-blue-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-red-950/90 ring-2 ring-red-500",
    cellErrorText: "text-red-400 font-bold",
    textColor: "text-slate-100",
    textMuted: "text-slate-400",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-blue-300 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-blue-300 font-semibold",
    borderColor: "border-slate-800",
    majorBorderColor: "border-blue-500/80",
    gridLineColor: "bg-slate-800",
    majorGridLineColor: "bg-blue-500/80",
    accentColor: "bg-blue-600 text-white hover:bg-blue-500",
    accentHover: "hover:bg-blue-500",
    buttonBg: "bg-[#162347] hover:bg-[#1e2f5d] text-slate-200 border border-blue-900/60",
    buttonActiveBg: "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
  },
  "dark-oled": {
    id: "dark-oled",
    name: "OLED Preto & Âmbar",
    category: "dark",
    badge: "OLED",
    swatch: {
      bg: "#000000",
      accent: "#f59e0b",
      text: "#ffffff"
    },
    bg: "bg-black",
    cardBg: "bg-zinc-950 border-zinc-800 shadow-2xl",
    boardBg: "bg-black",
    cellInitialBg: "bg-zinc-900/90",
    cellEmptyBg: "bg-black",
    cellSelectedBg: "bg-amber-500 ring-2 sm:ring-[3px] ring-amber-200 shadow-xl text-black font-black z-20",
    cellHighlightBg: "bg-amber-500/20",
    cellSameNumberBg: "bg-amber-500 ring-2 sm:ring-[2.5px] ring-amber-300 shadow-md text-black font-black z-15",
    cellConflictBg: "bg-red-950/90 ring-2 ring-red-500",
    cellErrorText: "text-red-400 font-bold",
    textColor: "text-zinc-100",
    textMuted: "text-zinc-400",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-amber-400 font-black",
    sameNumberTextColor: "text-black font-black",
    notesColor: "text-amber-300 font-semibold",
    borderColor: "border-zinc-800",
    majorBorderColor: "border-amber-500",
    gridLineColor: "bg-zinc-800",
    majorGridLineColor: "bg-amber-500",
    accentColor: "bg-amber-500 text-black font-bold hover:bg-amber-400",
    accentHover: "hover:bg-amber-400",
    buttonBg: "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800",
    buttonActiveBg: "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20"
  },
  "dark-cyber": {
    id: "dark-cyber",
    name: "Neon Cyber & Violeta",
    category: "dark",
    badge: "Cyber",
    swatch: {
      bg: "#0d0a1a",
      accent: "#a855f7",
      text: "#ffffff"
    },
    bg: "bg-[#0d0a1a]",
    cardBg: "bg-[#15102a]/95 border-purple-900/50 shadow-2xl",
    boardBg: "bg-[#110d24]",
    cellInitialBg: "bg-[#1f173d]",
    cellEmptyBg: "bg-[#140f29]",
    cellSelectedBg: "bg-purple-600 ring-2 sm:ring-[3px] ring-cyan-300 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-purple-600/25",
    cellSameNumberBg: "bg-purple-600 ring-2 sm:ring-[2.5px] ring-cyan-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-rose-950/90 ring-2 ring-rose-500",
    cellErrorText: "text-rose-400 font-bold",
    textColor: "text-purple-50",
    textMuted: "text-purple-300/70",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-cyan-300 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-purple-300 font-semibold",
    borderColor: "border-purple-950/90",
    majorBorderColor: "border-purple-500",
    gridLineColor: "bg-purple-950",
    majorGridLineColor: "bg-purple-500",
    accentColor: "bg-purple-600 text-white font-bold hover:bg-purple-500",
    accentHover: "hover:bg-purple-500",
    buttonBg: "bg-[#1b1438] hover:bg-[#251c4c] text-purple-200 border border-purple-900/50",
    buttonActiveBg: "bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30"
  },
  "emerald-forest": {
    id: "emerald-forest",
    name: "Floresta Esmeralda",
    category: "dark",
    badge: "Esmeralda",
    swatch: {
      bg: "#061712",
      accent: "#10b981",
      text: "#ffffff"
    },
    bg: "bg-[#061712]",
    cardBg: "bg-[#0d261e]/95 border-emerald-900/50 shadow-2xl",
    boardBg: "bg-[#091f18]",
    cellInitialBg: "bg-[#133d32]",
    cellEmptyBg: "bg-[#0b241c]",
    cellSelectedBg: "bg-emerald-600 ring-2 sm:ring-[3px] ring-emerald-200 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-emerald-600/25",
    cellSameNumberBg: "bg-emerald-600 ring-2 sm:ring-[2.5px] ring-emerald-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-rose-950/90 ring-2 ring-rose-500",
    cellErrorText: "text-rose-400 font-bold",
    textColor: "text-emerald-50",
    textMuted: "text-emerald-300/70",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-emerald-300 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-emerald-300 font-semibold",
    borderColor: "border-emerald-950/90",
    majorBorderColor: "border-emerald-500",
    gridLineColor: "bg-emerald-950",
    majorGridLineColor: "bg-emerald-500",
    accentColor: "bg-emerald-600 text-white font-bold hover:bg-emerald-500",
    accentHover: "hover:bg-emerald-500",
    buttonBg: "bg-[#103328] hover:bg-[#184a3b] text-emerald-200 border border-emerald-900/50",
    buttonActiveBg: "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30"
  },
  "sunset-amber": {
    id: "sunset-amber",
    name: "Pôr do Sol & Cobre",
    category: "dark",
    badge: "Sunset",
    swatch: {
      bg: "#160e0a",
      accent: "#f97316",
      text: "#ffffff"
    },
    bg: "bg-[#160e0a]",
    cardBg: "bg-[#241712]/95 border-orange-900/50 shadow-2xl",
    boardBg: "bg-[#1b120d]",
    cellInitialBg: "bg-[#352118]",
    cellEmptyBg: "bg-[#20140f]",
    cellSelectedBg: "bg-orange-600 ring-2 sm:ring-[3px] ring-amber-200 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-orange-600/25",
    cellSameNumberBg: "bg-orange-600 ring-2 sm:ring-[2.5px] ring-amber-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-rose-950/90 ring-2 ring-rose-500",
    cellErrorText: "text-rose-400 font-bold",
    textColor: "text-orange-50",
    textMuted: "text-orange-300/70",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-orange-400 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-amber-300 font-semibold",
    borderColor: "border-orange-950/90",
    majorBorderColor: "border-orange-500",
    gridLineColor: "bg-orange-950",
    majorGridLineColor: "bg-orange-500",
    accentColor: "bg-orange-600 text-white font-bold hover:bg-orange-500",
    accentHover: "hover:bg-orange-500",
    buttonBg: "bg-[#291a13] hover:bg-[#3d271c] text-orange-200 border border-orange-900/50",
    buttonActiveBg: "bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/30"
  },
  "ruby-crimson": {
    id: "ruby-crimson",
    name: "Rubi & Vinho Noturno",
    category: "dark",
    badge: "Rubi",
    swatch: {
      bg: "#160811",
      accent: "#f43f5e",
      text: "#ffffff"
    },
    bg: "bg-[#160811]",
    cardBg: "bg-[#250d1d]/95 border-rose-900/50 shadow-2xl",
    boardBg: "bg-[#1a0a15]",
    cellInitialBg: "bg-[#38142c]",
    cellEmptyBg: "bg-[#220c1b]",
    cellSelectedBg: "bg-rose-600 ring-2 sm:ring-[3px] ring-pink-200 shadow-xl text-white font-black z-20",
    cellHighlightBg: "bg-rose-600/25",
    cellSameNumberBg: "bg-rose-600 ring-2 sm:ring-[2.5px] ring-pink-300 shadow-md text-white font-black z-15",
    cellConflictBg: "bg-red-950/90 ring-2 ring-red-500",
    cellErrorText: "text-red-400 font-bold",
    textColor: "text-rose-50",
    textMuted: "text-rose-300/70",
    initialDigitColor: "text-white font-black",
    userDigitColor: "text-rose-300 font-black",
    sameNumberTextColor: "text-white font-black",
    notesColor: "text-pink-300 font-semibold",
    borderColor: "border-rose-950/90",
    majorBorderColor: "border-rose-500",
    gridLineColor: "bg-rose-950",
    majorGridLineColor: "bg-rose-500",
    accentColor: "bg-rose-600 text-white font-bold hover:bg-rose-500",
    accentHover: "hover:bg-rose-500",
    buttonBg: "bg-[#2b0f22] hover:bg-[#3f1632] text-rose-200 border border-rose-900/50",
    buttonActiveBg: "bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/30"
  },
  "warm-paper": {
    id: "warm-paper",
    name: "Papel Sépia Clássico",
    category: "light",
    badge: "Sépia",
    swatch: {
      bg: "#f5eee4",
      accent: "#8c5b36",
      text: "#2b1c11"
    },
    bg: "bg-[#f5eee4]",
    cardBg: "bg-[#eae0d2] border-[#d8c8b4] shadow-md",
    boardBg: "bg-[#fcf9f2]",
    cellInitialBg: "bg-[#e8decb]",
    cellEmptyBg: "bg-[#fcf9f2]",
    cellSelectedBg: "bg-[#8c5b36] ring-2 sm:ring-[3px] ring-[#58371f] shadow-xl text-[#fcf9f2] font-black z-20",
    cellHighlightBg: "bg-[#dfba88]/50",
    cellSameNumberBg: "bg-[#8c5b36] ring-2 sm:ring-[2.5px] ring-[#a87449] shadow-md text-[#fcf9f2] font-black z-15",
    cellConflictBg: "bg-red-200/90 ring-2 ring-red-600",
    cellErrorText: "text-red-700 font-bold",
    textColor: "text-[#2b1c11]",
    textMuted: "text-[#7f5539]",
    initialDigitColor: "text-[#2b1c11] font-black",
    userDigitColor: "text-[#8c5b36] font-black",
    sameNumberTextColor: "text-[#fcf9f2] font-black",
    notesColor: "text-[#8c5b36] font-bold",
    borderColor: "border-[#dfd0be]",
    majorBorderColor: "border-[#7f5539]",
    gridLineColor: "bg-[#dfd0be]",
    majorGridLineColor: "bg-[#7f5539]",
    accentColor: "bg-[#7f5539] text-[#fcf9f2] font-semibold hover:bg-[#68432a]",
    accentHover: "hover:bg-[#68432a]",
    buttonBg: "bg-[#ebd9c3] hover:bg-[#dfc8ae] text-[#2b1c11] border border-[#d3c0a9]",
    buttonActiveBg: "bg-[#7f5539] text-[#fcf9f2] shadow-md shadow-[#7f5539]/30"
  }
};

// Modais foram desenhados com superfícies escuras: em temas claros usam o tema escuro padrão
// para manter o contraste de textos e cartões internos.
export function getModalTheme(themeId: ThemeId): ThemeConfig {
  const theme = THEMES[themeId] || THEMES["dark-slate"];
  return theme.category === "light" ? THEMES["dark-slate"] : theme;
}
