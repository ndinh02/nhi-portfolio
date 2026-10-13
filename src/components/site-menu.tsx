import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { EkkodaleMotion, LiveTickerMotion, SiviCampMotion } from "@/components/case-motion"
import { useLang } from "@/lib/i18n"
import { ContactForm } from "@/components/contact-form"

/* Full-screen menu, always exactly one screen tall. The entries are stacked like paper folders in the
   project's own colours; hovering or focusing one lifts it, repaints the screen in its scheme and plays
   the project's preview on the right. */

/* projects: direct links shown inside the folder (phones) and as the clickable preview (desktop) */
type Entry = { to: string; label: string; kicker: string; bg: string; fg: string; accent: string; preview: ReactNode; projects?: [string, string, string][]; openLabel?: string; interactive?: boolean; noOpen?: boolean }


function useEntries(): Entry[] {
  const { t } = useLang()
  const own: [string, string, string][] = [
    ["studio", "Studio", t("KI-System", "AI system")], ["design-system", t("Design-System", "Design system"), "Pipeline"],
    ["voicemeup", "voicemeup", t("Produkt", "Product")], ["jude", t("Jude Fan-Seite", "Jude fan site"), "Website"],
    ["archive-touch", "Archive Touch", t("Experiment", "Experiment")], ["desktop-pet", "Desktop Pet", t("Experiment", "Experiment")],
    ["hf11", "HF-11", t("Figma-Übung", "Figma practice")], ["bershka", "Bershka", t("Figma-Übung", "Figma practice")],
  ]
  return [
    { to: "/liveticker", label: "LiveTicker", kicker: t("UX-Beratung · KI-Modi", "UX consulting · AI modes"), bg: "#0d0d10", fg: "#f5f3ef", accent: "#c9f24a", preview: <LiveTickerMotion /> },
    { to: "/ekkodale", label: "ekkodale", kicker: t("UX-Research · Komponentenbibliothek", "UX research · Component library"), bg: "#075e58", fg: "#ffffff", accent: "#c9f0e6", preview: <EkkodaleMotion /> },
    { to: "/sivicamp", label: "SiviCamp", kicker: t("Kampagne · Marke · Website", "Campaign · Brand · Website"), bg: "#1a0d3d", fg: "#f6efff", accent: "#cab1fd", preview: <SiviCampMotion /> },
    { to: "/projekte", label: t("Eigene Projekte", "Own projects"), kicker: t("Experimente & Übungen", "Experiments & practice"), bg: "#f3dbe4", fg: "#1d1b24", accent: "#8b2f5c",
      projects: own, interactive: true, openLabel: t("Alle Projekte ansehen", "See all projects"),
      preview: (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-4 gap-[2.4cqh] p-[4.5cqh]">
          {own.map(([id, name, tag], i) => (
            <Link key={id} to={`/projekte#${id}`} className="group flex min-h-0 items-center gap-[3cqh] rounded-[6px] bg-white/70 px-[4cqh] text-[#1d1b24] transition-colors hover:bg-white">
              <span className="font-mono text-[clamp(0.6rem,3.2cqh,0.75rem)] text-[#8b2f5c]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="display block truncate text-[clamp(0.9rem,5.2cqh,1.4rem)] leading-tight">{name}</span>
                <span className="block truncate font-mono text-[clamp(0.55rem,2.8cqh,0.7rem)] uppercase tracking-wider text-[#5e4a55]">{tag}</span>
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      ) },
    { to: "/#arbeitsweise", label: t("Wie ich arbeite", "How I work"), kicker: t("Prozess & Werkzeuge", "Process & tools"), bg: "#1d1b24", fg: "#ffffff", accent: "#f5a3c0",
      preview: (
        <div className="absolute inset-0 flex flex-col gap-[2.4cqh] p-[6cqh]">
          {[t("Verstehen", "Understand"), t("Strukturieren", "Structure"), t("Gestalten", "Design"), t("Systematisieren", "Systemise"), t("Ausliefern", "Ship")].map((x, i) => (
            <motion.div key={x} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
              className="flex min-h-0 flex-1 items-center gap-4 rounded-[6px] bg-[#26232f] px-4 text-[#f5a3c0]">
              <span className="font-mono text-xs">0{i + 1}</span><span className="display text-[clamp(1rem,7cqh,1.6rem)] text-white">{x}</span>
            </motion.div>
          ))}
        </div>
      ) },
    { to: "#kontakt", label: t("Kontakt", "Contact"), kicker: t("Schreiben Sie mir", "Write to me"), bg: "#ff5fa2", fg: "#0e1116", accent: "#0e1116",
      interactive: true, noOpen: true,
      /* write to me right here: the form replaces the "open contact" button */
      preview: <div className="absolute inset-0 flex p-[5cqh] text-[#0e1116]"><ContactForm compact className="h-full w-full" buttonClass="bg-[#0e1116] text-white" /></div> },
  ]
}

export function SiteMenu() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const entries = useEntries()
  const { pathname, hash } = useLocation()
  const btn = useRef<HTMLButtonElement>(null)
  /* hover intent: a folder only takes over after the pointer rests on it briefly, so gliding across
     other folders on the way to the preview doesn't swap the preview away */
  const intent = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hover = (i: number) => {
    clearTimeout(intent.current)
    if (active === null) setActive(i)
    else intent.current = setTimeout(() => setActive(i), 160)
  }
  const unhover = () => clearTimeout(intent.current)
  useEffect(() => () => clearTimeout(intent.current), [])

  useEffect(() => { setOpen(false) }, [pathname, hash])
  useEffect(() => {
    if (!open) { setActive(null); return }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus() } }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [open])

  /* at rest the menu wears the colours of the page it was opened on; hovering a folder repaints it */
  const [page, setPage] = useState({ bg: "#f6f7f9", fg: "#0e1116", accent: "#8b2f5c" })
  const openMenu = () => {
    const css = getComputedStyle(document.documentElement)
    const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
    setPage({ bg: v("--paper", "#f6f7f9"), fg: v("--ink", "#0e1116"), accent: v("--accent", "#8b2f5c") })
    setOpen(true)
  }
  const cur = active === null ? page : entries[active]

  return (
    <>
      <button ref={btn} type="button" onClick={openMenu} aria-expanded={open} aria-controls="site-menu"
        className="group flex items-center gap-3 rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper">
        {t("Menü", "Menu")}
        <span aria-hidden className="flex flex-col gap-[3px]"><span className="block h-px w-4 bg-current transition-transform group-hover:translate-x-0.5" /><span className="block h-px w-4 bg-current transition-transform group-hover:-translate-x-0.5" /></span>
      </button>
      {createPortal(
      <AnimatePresence>
        {open && (
          /* always exactly one screen tall: nothing inside may scroll, everything scales with the viewport */
          <motion.div id="site-menu" role="dialog" aria-modal="true" aria-label={t("Menü", "Menu")}
            className="fixed inset-0 z-[90] flex h-[100dvh] flex-col overflow-hidden"
            initial={{ clipPath: "inset(0 0 100% 0)", backgroundColor: page.bg, color: page.fg }} animate={{ clipPath: "inset(0 0 0% 0)", backgroundColor: cur.bg, color: cur.fg }}
            exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ clipPath: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }, backgroundColor: { duration: 0.45 }, color: { duration: 0.45 } }}>
            <div className="gutter flex shrink-0 items-center justify-between py-4">
              <Link to="/" className="font-serif text-2xl italic">Nhi Dinh</Link>
              <button type="button" autoFocus onClick={() => { setOpen(false); btn.current?.focus() }}
                className="flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider" style={{ borderColor: "currentColor" }}>
                {t("Schließen", "Close")} <span aria-hidden className="text-base leading-none">×</span>
              </button>
            </div>
            <div className="gutter grid min-h-0 flex-1 pb-[max(1.25rem,3vh)] lg:[column-gap:var(--gap)] lg:[grid-template-columns:var(--cols)] lg:transition-[grid-template-columns,column-gap] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ ["--cols" as string]: active === null ? "minmax(0,1fr) minmax(0,0fr)" : "minmax(0,7fr) minmax(0,5fr)", ["--gap" as string]: active === null ? "0rem" : "2.5rem" }}
              onMouseLeave={() => { clearTimeout(intent.current); if (!document.activeElement?.closest("[data-preview]")) setActive(null) }}>
              {/* the entries as a stack of paper folders: each one overlaps the one behind it, its tab peeks out on top */}
              <nav aria-label={t("Hauptnavigation", "Main navigation")} className="flex min-h-0 flex-col">
                <ul className="flex min-h-0 flex-1 flex-col pt-[clamp(1.5rem,4vh,2.25rem)]">
                  {entries.map((e, i) => {
                    const on = active === i
                    return (
                      <motion.li key={e.to} className="relative flex min-h-0 flex-1 [&:not(:first-child)]:-mt-[clamp(0.5rem,1.4vh,0.9rem)]" style={{ zIndex: i + 1 }}
                        initial={{ y: 60, opacity: 0 }} animate={{ y: on ? -10 : 0, opacity: 1 }}
                        transition={{ y: { delay: on ? 0 : 0.2 + i * 0.05, type: "spring", stiffness: 380, damping: 30 }, opacity: { delay: 0.2 + i * 0.05, duration: 0.4 } }}>
                        <div onMouseEnter={() => hover(i)} onMouseLeave={unhover}
                          className="relative flex w-full flex-col rounded-[12px] rounded-tl-[4px] border"
                          style={{ background: e.bg, color: e.fg, borderColor: `color-mix(in oklab, ${e.fg} 16%, transparent)`, boxShadow: "0 -10px 24px -14px rgba(0,0,0,0.55)" }}>
                          {/* the whole folder is one link (stretched), so project links can sit on top of it without nesting */}
                          <Link to={e.to} onClick={() => setOpen(false)} onFocus={() => setActive(i)} data-folder aria-label={e.label}
                            className="absolute inset-0 rounded-[12px] rounded-tl-[4px] outline-offset-4" />
                          {/* the folder tab, staggered like index tabs in a real file drawer */}
                          <span aria-hidden className="absolute bottom-[calc(100%-1px)] flex h-[clamp(1.25rem,3.2vh,1.75rem)] items-center rounded-t-[8px] border border-b-0 px-3 font-mono text-[0.68rem] tracking-wider"
                            style={{ left: `${4 + i * 14}%`, background: e.bg, color: e.accent, borderColor: `color-mix(in oklab, ${e.fg} 16%, transparent)` }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex w-full items-baseline justify-between gap-6 px-[clamp(1rem,2vw,1.75rem)] pt-[clamp(0.3rem,1.2vh,0.75rem)]">
                            <span className="display whitespace-nowrap text-[clamp(1.5rem,min(5.4vw,6.6vh),5rem)] leading-[1.02]">{e.label}</span>
                            <span className="hidden min-w-0 truncate text-right font-mono text-[0.7rem] uppercase tracking-wider sm:block lg:hidden xl:block" style={{ color: e.accent }}>{e.kicker}</span>
                          </span>
                          {/* phones and tablets (no preview there): every project is one tap away */}
                          {e.projects && (
                            <div className="relative mt-[clamp(0.4rem,1.2vh,0.75rem)] flex gap-1.5 overflow-x-auto px-[clamp(1rem,2vw,1.75rem)] pb-1 [scrollbar-width:none] lg:hidden [@media(max-height:640px)]:hidden">
                              {e.projects.map(([id, name]) => (
                                <Link key={id} to={`/projekte#${id}`} className="shrink-0 rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-wider"
                                  style={{ borderColor: `color-mix(in oklab, ${e.fg} 30%, transparent)`, background: e.bg }}>{name}</Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
              {/* live preview of the hovered project, sized to whatever space is left (never taller than the screen) */}
              <div data-preview className="hidden min-h-0 min-w-0 items-center justify-center overflow-hidden lg:flex" style={{ containerType: "size" }} onMouseEnter={unhover}>
                <div className="flex flex-col items-end gap-3">
                  {active !== null && (
                  <div className="relative overflow-hidden rounded-[10px]"
                    style={{ containerType: "size", width: "min(100cqw, (100cqh - 3.5rem) * 16 / 11)", height: "min(100cqh - 3.5rem, 100cqw * 11 / 16)", background: "color-mix(in oklab, currentColor 8%, transparent)" }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.35 }}>
                        {entries[active].interactive ? entries[active].preview : (
                          <Link to={entries[active].to} onClick={() => setOpen(false)} tabIndex={-1} aria-hidden className="absolute inset-0 block cursor-pointer">
                            {entries[active].preview}
                          </Link>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  )}
                  <div className="h-11">
                    {active !== null && !entries[active].noOpen && (
                      <Link to={entries[active].to} onClick={() => setOpen(false)}
                        className="group flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs uppercase tracking-wider shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                        style={{ background: entries[active].fg, color: entries[active].bg }}>
                        {entries[active].openLabel ?? `${t("Öffnen", "Open")}: ${entries[active].label}`} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}
