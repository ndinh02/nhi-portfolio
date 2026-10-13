import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { MotionConfig } from "motion/react"
import { LightboxProvider } from "@/components/ui"
import { ToTop } from "@/components/to-top"
import { useLang } from "@/lib/i18n"
import Home from "@/pages/Home"
import SiviCamp from "@/pages/SiviCamp"
import Ekkodale from "@/pages/Ekkodale"
import Projekte from "@/pages/Projekte"
import LiveTicker from "@/pages/LiveTicker"
import { Datenschutz, Impressum } from "@/pages/Legal"

const THEMES: Record<string, string> = { "/sivicamp": "theme-sivi", "/ekkodale": "theme-ekko", "/liveticker": "theme-lt" }
const TITLES: Record<string, [string, string]> = {
  "/": ["Nhi Dinh | UX/UI & Kommunikationsdesign", "Nhi Dinh | UX/UI & Communication Design"],
  "/sivicamp": ["SiviCamp 2026 | Nhi Dinh", "SiviCamp 2026 | Nhi Dinh"],
  "/ekkodale": ["ekkodale | Nhi Dinh", "ekkodale | Nhi Dinh"],
  "/liveticker": ["LiveTicker | Nhi Dinh", "LiveTicker | Nhi Dinh"],
  "/projekte": ["Eigene Projekte | Nhi Dinh", "Personal Projects | Nhi Dinh"],
  "/impressum": ["Impressum | Nhi Dinh", "Legal Notice | Nhi Dinh"],
  "/datenschutz": ["Datenschutz | Nhi Dinh", "Privacy | Nhi Dinh"],
}

export default function App() {
  const { pathname, hash } = useLocation()
  const { lang } = useLang()

  useEffect(() => {
    // theme lives on <html> so body background and overscroll match the page
    const root = document.documentElement
    root.classList.remove("theme-sivi", "theme-ekko", "theme-lt")
    if (THEMES[pathname]) root.classList.add(THEMES[pathname])
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // wait one frame so the target section exists after a route change
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])

  useEffect(() => {
    document.title = (TITLES[pathname] ?? TITLES["/"])[lang === "en" ? 1 : 0]
  }, [pathname, lang])

  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sivicamp" element={<SiviCamp />} />
          <Route path="/ekkodale" element={<Ekkodale />} />
          <Route path="/liveticker" element={<LiveTicker />} />
          <Route path="/projekte" element={<Projekte />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <ToTop />
      </LightboxProvider>
    </MotionConfig>
  )
}
