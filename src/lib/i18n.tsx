import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

/* Two languages, German first. Copy lives inline as t("Deutsch", "English") so each
   sentence and its translation sit side by side and cannot drift apart. */
export type Lang = "de" | "en"
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T>(de: T, en: T) => T }

const KEY = "lang"
const LangCtx = createContext<Ctx>({ lang: "de", setLang: () => {}, t: (de) => de })

function initial(): Lang {
  // ?lang=en makes an English link shareable; otherwise the visitor's last choice; otherwise German
  const q = new URLSearchParams(window.location.search).get("lang")
  if (q === "en" || q === "de") return q
  try {
    const s = localStorage.getItem(KEY)
    if (s === "en" || s === "de") return s
  } catch { /* storage blocked: fall through */ }
  return "de"
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (de, en) => (lang === "en" ? en : de) }), [lang, setLang])
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
export const useT = () => useContext(LangCtx).t
