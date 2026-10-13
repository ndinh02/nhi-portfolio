import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { Link, NavLink } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import sizes from "@/data/image-sizes.json"
import { cn } from "@/lib/utils"
import { ContactForm } from "@/components/contact-form"
import UnderlineToBackground from "@/fancy/underline-to-background"
import ScrambleIn from "@/fancy/scramble-in"
import { useLang, useT } from "@/lib/i18n"
import { SiteMenu } from "@/components/site-menu"

export type Id = keyof typeof sizes
export const img = (id: Id, small = false) => `/img/${id}${small ? "-sm" : ""}.webp`
export const ratio = (id: Id) => `${sizes[id][0]} / ${sizes[id][1]}`

/* ---------- Lightbox ---------- */
type Shot = { id: Id; alt: string }
const LightboxCtx = createContext<(s: Shot) => void>(() => {})

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [shot, setShot] = useState<Shot | null>(null)
  const t = useT()
  const close = useCallback(() => setShot(null), [])
  useEffect(() => {
    if (!shot) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [shot, close])

  return (
    <LightboxCtx.Provider value={setShot}>
      {children}
      <AnimatePresence>
        {shot && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={shot.alt}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.img
              src={img(shot.id)}
              alt={shot.alt}
              className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />
            <button
              onClick={close}
              className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/20"
            >
              {t("Schließen", "Close")} <span aria-hidden>×</span>
            </button>
            <p className="absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 text-center text-sm text-white/70">{shot.alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxCtx.Provider>
  )
}

/* ---------- Image ---------- */
export function Pic({
  id,
  alt,
  className,
  imgClassName,
  zoom = true,
  eager = false,
  cover = false,
}: {
  id: Id
  alt: string
  className?: string
  imgClassName?: string
  zoom?: boolean
  eager?: boolean
  cover?: boolean
}) {
  const open = useContext(LightboxCtx)
  const t = useT()
  const inner = (
    <img
      src={img(id)}
      srcSet={`${img(id, true)} 720w, ${img(id)} 1800w`}
      sizes="(max-width: 768px) 100vw, 60vw"
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      style={cover ? undefined : { aspectRatio: ratio(id) }}
      className={cn("block h-auto w-full select-none", cover && "h-full", imgClassName)}
    />
  )
  if (!zoom) return <div className={className}>{inner}</div>
  return (
    <button
      type="button"
      onClick={() => open({ id, alt })}
      className={cn("group block w-full cursor-zoom-in overflow-hidden text-left outline-offset-4", className)}
      aria-label={`${alt}, ${t("vergrößern", "enlarge")}`}
    >
      <div className={cn("transition-transform duration-500 ease-out group-hover:scale-[1.015]", cover && "h-full")}>{inner}</div>
    </button>
  )
}

/* ---------- Layout bits ---------- */
export function Nav({ tone = "default" }: { tone?: "default" | "sivi" | "ekko" }) {
  const { lang, setLang, t } = useLang()
  // publish the header height so sticky bars below it (Projekte filter) sit flush on every screen size
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // inactive links at 70% keep at least 4.5:1 on every theme (60% dropped to 4.4:1 on ekkodale)
  const link = ({ isActive }: { isActive: boolean }) =>
    cn("transition-opacity hover:opacity-100", isActive ? "opacity-100" : "opacity-70")
  return (
    <header ref={headerRef} className="gutter sticky z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 backdrop-blur-md sm:py-4"
      style={{ top: "env(safe-area-inset-top, 0px)", background: "color-mix(in oklab, var(--paper) 94%, transparent)" }}>
      <Link to="/" className="flex shrink-0 items-baseline gap-2">
        <span className="font-serif text-2xl italic leading-none">Nhi Dinh</span>
        <span className="label hidden lg:inline">{tone === "sivi" ? "{#} Portfolio" : "Portfolio"}</span>
      </Link>
      <div className="flex items-center gap-3">
      <div role="group" aria-label={t("Sprache", "Language")}
        className="flex rounded-full border border-line p-0.5 font-mono text-[0.7rem] uppercase tracking-wider">
        {(["de", "en"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} lang={l}
            title={l === "de" ? "Deutsch" : "English"}
            className={cn("min-h-8 min-w-9 rounded-full px-2 transition-colors", lang === l ? "bg-ink text-paper" : "opacity-70 hover:opacity-100")}>
            {l}
          </button>
        ))}
      </div>
      <SiteMenu />
      </div>
    </header>
  )
}

export const EMAIL = "nhidinh.digibeez@gmail.com"

export function Footer() {
  const t = useT()
  return (
    <footer id="kontakt" className="gutter scroll-mt-20 border-t border-line pb-28 pt-24 sm:pb-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="label mb-6">{t("Kontakt", "Contact")}</p>
          <h2 className="display max-w-4xl text-[clamp(2.6rem,6.4vw,6rem)]">
            {t(<>Lassen Sie uns über <span className="font-serif font-normal italic tracking-normal text-accent">Ihr</span> nächstes Produkt sprechen.</>,
              <>Let’s talk about <span className="font-serif font-normal italic tracking-normal text-accent">your</span> next product.</>)}
          </h2>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg">
            <a href={`mailto:${EMAIL}`}>
              <UnderlineToBackground targetTextColor="var(--paper)" className="cursor-pointer">{EMAIL}</UnderlineToBackground>
            </a>
            <a href="https://github.com/ndinh02" target="_blank" rel="noreferrer">
              <UnderlineToBackground targetTextColor="var(--paper)" className="cursor-pointer">github.com/ndinh02</UnderlineToBackground>
            </a>
            <span className="text-muted">Wiesbaden · Mainz · Frankfurt</span>
          </div>
        </div>
        {/* write to me directly, without opening a mail app */}
        <div className="self-end rounded-[10px] border border-line bg-panel p-6 sm:p-8 lg:col-span-5">
          <p className="display mb-4 text-2xl">{t("Direkt schreiben", "Write directly")}</p>
          <ContactForm />
        </div>
      </div>
      <div className="label mt-24 flex flex-wrap justify-between gap-4">
        <span>© 2026 Nhi Ngoc Uyen Dinh · {t("Mit KI-Unterstützung gestaltet", "Designed with AI assistance")}</span>
        <span className="flex gap-6">
          <Link to="/impressum" className="hover:text-ink">{t("Impressum", "Legal notice")}</Link>
          <Link to="/datenschutz" className="hover:text-ink">{t("Datenschutz", "Privacy")}</Link>
        </span>
      </div>
    </footer>
  )
}

export function SectionHead({ no, kicker, title, children, className }: {
  no?: string
  kicker: string
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-12 md:gap-y-8", className)}>
      <p className="label md:col-span-3">{no && <span className="mr-3 text-ink">{no}</span>}{kicker}</p>
      <div className="md:col-span-9">
        <h2 className="display text-[clamp(2rem,4.6vw,4rem)] leading-[1]">{title}</h2>
        {children && <div className="prose-case mt-8 text-lg">{children}</div>}
      </div>
    </div>
  )
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Pager({ to, label, title }: { to: string; label: string; title: string }) {
  return (
    <Link to={to} className="gutter group block border-t border-line py-16">
      <p className="label mb-4">{label}</p>
      <p className="display flex items-center gap-4 text-[clamp(2.2rem,6vw,5.5rem)]">
        {title}
        <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">→</span>
      </p>
    </Link>
  )
}

/* Progressive disclosure: the short version is always visible, the full story is one click away */
export function More({ children }: { children: ReactNode }) {
  const t = useT()
  return (
    <details className="group mt-6 max-w-[58ch]">
      <summary className="label inline-flex cursor-pointer list-none items-center gap-2 py-2 text-ink hover:opacity-70 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{t("Mehr lesen", "Read more")}</span>
        <span className="hidden group-open:inline">{t("Weniger", "Less")}</span>
        <span aria-hidden className="transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="prose-case mt-4 text-base">{children}</div>
    </details>
  )
}

/* Muted looping clip that plays only while on screen. With reduced motion it never
   autoplays and shows native controls instead. */
export function AutoVideo({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(r)
    if (r) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} src={src} aria-label={label} muted loop playsInline preload="metadata" controls={reduced}
      className={cn("block w-full", className)} />
  )
}

/* Hero kicker that scrambles in on load, in each project's own alphabet
   (pixels for SiviCamp, building blocks for ekkodale, match clock for LiveTicker). */
export function ScrambleKicker({ text, chars, className }: { text: string; chars: string; className?: string }) {
  return (
    <span className={cn("font-mono text-xs uppercase tracking-[0.12em] text-accent", className)}>
      <ScrambleIn key={text} text={text} scrambleSpeed={28} scrambledLetterCount={4} characters={chars} scrambledClassName="opacity-50" />
    </span>
  )
}

/* "Meine Rolle" list that closes every case, same pattern as SiviCamp */
export function RoleList({ items, bullet = "›", bulletClassName }: { items: string[]; bullet?: string; bulletClassName?: string }) {
  return (
    <ul className="grid gap-x-8 gap-y-4 text-lg sm:grid-cols-2">
      {items.map((x) => (
        <li key={x} className="flex gap-3 border-t border-line pt-4">
          <span aria-hidden className={cn("font-mono text-accent", bulletClassName)}>{bullet}</span>{x}
        </li>
      ))}
    </ul>
  )
}

/* The backbone of every case: why it existed, what constrained it, how I adapted, and (only if real) the result */
export function Brief({ why, constraint, response, result, className }: {
  why: string; constraint: string; response: string; result?: string; className?: string
}) {
  const t = useT()
  const rows: [string, string][] = [
    [t("Warum", "Why"), why],
    [t("Die Einschränkung", "The constraint"), constraint],
    [t("Wie ich reagiert habe", "How I adapted"), response],
    ...(result ? [[t("Ergebnis", "Result"), result] as [string, string]] : []),
  ]
  return (
    <dl className={cn("grid gap-px overflow-hidden rounded-[6px] border border-line bg-line", rows.length === 4 ? "md:grid-cols-2 2xl:grid-cols-4" : "md:grid-cols-3", className)}>
      {rows.map(([k, v], i) => (
        <div key={k} className={cn("bg-paper p-6 sm:p-7", i === 1 && "bg-panel")}>
          <dt className="label"><span className="mr-2 text-accent">0{i + 1}</span>{k}</dt>
          <dd className="mt-3 leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* What I had to weigh up or accept along the way: the honest part of each story */
export function Tradeoffs({ id, no, items, intro }: { id: string; no?: string; items: [string, string][]; intro: string }) {
  const t = useT()
  return (
    <section id={id} className="gutter section border-t border-line">
      <SectionHead no={no} kicker={t("Abwägungen", "Trade-offs")}
        title={<>{t("Was ich abwägen ", "What I had to weigh up ")}<span className="font-serif font-normal italic tracking-normal">{t("und akzeptieren musste.", "and accept.")}</span></>}>
        <p>{intro}</p>
      </SectionHead>
      <ol className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line md:grid-cols-2">
        {items.map(([title, text], i) => (
          <li key={title} className="bg-paper p-6 sm:p-8">
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="display mt-3 text-[clamp(1.3rem,2vw,1.7rem)] leading-tight">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
