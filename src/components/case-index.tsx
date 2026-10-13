import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useLang } from "@/lib/i18n"

/* Chapter index for the three case pages, for scanning at a glance.
   Desktop (xl): a sticky column on the left, next to the story. Smaller screens: a slim chip bar under the nav.
   The chapter currently being read is highlighted (scroll spy), and a click jumps straight to it. */

export type Chapter = { id: string; label: string; group?: string }

export function CaseLayout({ title, chapters, children, className }: {
  title: string; chapters: Chapter[]; children: ReactNode; className?: string
}) {
  const active = useActiveChapter(chapters)
  const chips = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useChaptersOpen()
  const { t: lang } = useLang()
  const activeIndex = chapters.findIndex((c) => c.id === active)

  // keep the active chip in view on small screens
  useEffect(() => {
    const el = chips.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (el && chips.current) chips.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" })
  }, [active])

  const jump = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 68
    const chipBar = window.innerWidth < 1280 ? 44 : 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - nav - chipBar - 12, behavior: reduce ? "auto" : "smooth" })
    history.replaceState(null, "", `#${id}`)
  }

  const toggleLabel = open ? `${title} ${lang("einklappen", "collapse")}` : `${title} ${lang("ausklappen", "expand")}`
  let lastGroup: string | undefined
  return (
    <div className={cn("xl:grid xl:transition-[grid-template-columns] xl:duration-300", open ? "xl:grid-cols-[15rem_minmax(0,1fr)]" : "xl:grid-cols-[4rem_minmax(0,1fr)]")}>
      {/* desktop: sticky chapter column, collapsible to a slim strip of numbers */}
      <aside className="hidden xl:block">
        <nav aria-label={title} className={cn("sticky top-[var(--nav-h,4.25rem)] flex max-h-[calc(100svh-var(--nav-h,4.25rem))] flex-col overflow-y-auto overflow-x-hidden border-r border-line py-8",
          open ? "pl-[clamp(1rem,2.4vw,2.5rem)] pr-5" : "items-center px-2")}>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={toggleLabel} title={toggleLabel}
            className={cn("mb-5 flex items-center gap-2 rounded-full border border-line py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted transition-colors hover:border-ink hover:text-ink",
              open ? "self-start px-3" : "px-2")}>
            <span aria-hidden className={cn("inline-block transition-transform duration-300", !open && "rotate-180")}>‹</span>
            {open && <span>{title}</span>}
          </button>
          {!open ? (
            <ol className="grid gap-1">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={(e) => jump(e, c.id)} aria-current={active === c.id ? "location" : undefined} aria-label={c.label} title={c.label}
                    className={cn("flex h-8 w-9 items-center justify-center rounded-full font-mono text-[0.7rem] transition-colors",
                      active === c.id ? "bg-ink text-paper" : "text-muted hover:text-ink")}>
                    {String(i + 1).padStart(2, "0")}
                  </a>
                </li>
              ))}
            </ol>
          ) : (
          <ol className="grid gap-0.5">
            {chapters.map((c, i) => {
              const head = c.group && c.group !== lastGroup ? c.group : null
              lastGroup = c.group
              const on = active === c.id
              return (
                <li key={c.id}>
                  {head && <p className={cn("label pb-2 text-accent", i > 0 && "mt-5")}>{head}</p>}
                  <a href={`#${c.id}`} onClick={(e) => jump(e, c.id)} aria-current={on ? "location" : undefined}
                    className={cn("group flex items-baseline gap-3 border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors",
                      on ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink")}>
                    <span className="font-mono text-[0.68rem]">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn(on && "font-semibold")}>{c.label}</span>
                  </a>
                </li>
              )
            })}
          </ol>
          )}
        </nav>
      </aside>

      {/* smaller screens: slim chip bar that stays under the nav */}
      <div className="sticky top-[var(--nav-h,4.25rem)] z-30 border-b border-line xl:hidden" style={{ background: "color-mix(in oklab, var(--paper) 92%, transparent)" }}>
        <div ref={chips} className="flex h-11 items-center gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]" aria-label={title} role="navigation">
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={toggleLabel}
            className="sticky left-0 z-10 flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted"
            style={{ background: "var(--paper)" }}>
            {open ? <><span aria-hidden>‹</span>{title}</> : <>{title}<span aria-hidden>›</span></>}
          </button>
          {!open && activeIndex >= 0 && (
            <span className="shrink-0 truncate rounded-full bg-ink px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-paper">
              {String(activeIndex + 1).padStart(2, "0")} {chapters[activeIndex].label}
            </span>
          )}
          {open && chapters.map((c, i) => (
            <a key={c.id} data-id={c.id} href={`#${c.id}`} onClick={(e) => jump(e, c.id)} aria-current={active === c.id ? "location" : undefined}
              className={cn("shrink-0 rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider transition-colors",
                active === c.id ? "bg-ink text-paper" : "text-muted hover:text-ink")}>
              {String(i + 1).padStart(2, "0")} {c.label}
            </a>
          ))}
        </div>
      </div>

      <main className={cn("min-w-0", className)}>{children}</main>
    </div>
  )
}

/* open or collapsed, remembered per visitor (a convenience only, so storage failures are ignored) */
function useChaptersOpen() {
  const [open, setOpen] = useState(() => {
    try { return localStorage.getItem("chapters-open") !== "0" } catch { return true }
  })
  const set = (v: boolean) => {
    setOpen(v)
    try { localStorage.setItem("chapters-open", v ? "1" : "0") } catch { /* ignore */ }
  }
  return [open, set] as const
}

/* the chapter whose top has passed the upper third of the screen */
function useActiveChapter(chapters: Chapter[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = chapters.map((c) => c.id).join("|")
  useEffect(() => {
    const ids = key.split("|")
    const onScroll = () => {
      const line = window.innerHeight * 0.35
      let cur: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll) }
  }, [key])
  return active
}
