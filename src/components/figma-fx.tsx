import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { img, ratio, type Id } from "@/components/ui"
import { cn } from "@/lib/utils"

/* Replays Figma component variants the way they were prototyped:
   "loop"  = After delay → next variant (Smart Animate), plays while on screen
   "hover" = While hovering / on tap → next variant (interactive component) */
export function Variants({ ids, mode = "loop", delay = 1600, alt, className, fit = "cover" }: {
  ids: Id[]; mode?: "loop" | "hover"; delay?: number; alt: string; className?: string; fit?: "cover" | "contain"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || mode !== "loop") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let t: ReturnType<typeof setInterval> | undefined
    const io = new IntersectionObserver(([e]) => {
      clearInterval(t)
      if (e.isIntersecting) t = setInterval(() => setI((n) => (n + 1) % ids.length), delay)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); clearInterval(t) }
  }, [ids.length, delay, mode])
  // hover: step through all states in order while the pointer stays
  useEffect(() => {
    if (mode !== "hover") return
    if (!on) { setI(0); return }
    let n = 0
    const t = setInterval(() => { n = Math.min(n + 1, ids.length - 1); setI(n) }, 420)
    setI(1)
    return () => clearInterval(t)
  }, [on, mode, ids.length])
  return (
    <div ref={ref} className={cn("relative overflow-hidden", mode === "hover" && "cursor-pointer", className)}
      style={{ aspectRatio: ratio(ids[0]) }}
      onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onClick={() => mode === "hover" && setOn((v) => !v)}>
      <AnimatePresence initial={false}>
        <motion.img key={ids[i]} src={img(ids[i])} alt={alt} draggable={false}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeInOut" }}
          className={cn("absolute inset-0 h-full w-full select-none", fit === "cover" ? "object-cover" : "object-contain")} />
      </AnimatePresence>
      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[0.65rem] text-white">
        {i + 1}/{ids.length}
      </span>
    </div>
  )
}

/* Headline that slides in the way the "THE NEW AGE" variant pair animates in Figma */
export function SlideIn({ id, alt }: { id: Id; alt: string }) {
  return (
    <div className="overflow-hidden bg-[#1e1e1e]" style={{ aspectRatio: ratio(id) }}>
      <motion.img src={img(id)} alt={alt} className="h-full w-full object-cover"
        initial={{ x: "55%" }} whileInView={{ x: "0%" }} viewport={{ amount: 0.6 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  )
}

/* Endless horizontal loop of one variant image, like the MANIAC* type band */
export function Marquee({ id, alt, speed = 18, className }: { id: Id; alt: string; speed?: number; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} role="img" aria-label={alt}>
      <div className="flex w-max animate-[fxmarquee_linear_infinite] motion-reduce:animate-none" style={{ animationDuration: `${speed}s` }}>
        {[0, 1, 2, 3].map((k) => <img key={k} src={img(id)} alt="" className="h-full w-auto max-w-none" style={{ height: "100%" }} />)}
      </div>
    </div>
  )
}

/* One effect tile: the demo, what it is, and which Figma feature built it */
export function FxTile({ title, how, children, className }: { title: string; how: string; children: ReactNode; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[6px] border border-line bg-panel">{children}</div>
      <figcaption className="mt-3">
        <p className="font-medium leading-snug">{title}</p>
        <p className="label mt-1">{how}</p>
      </figcaption>
    </figure>
  )
}

/* Brand board pieces: the palette as swatches, and the recorded prototype split into chapters */
export function Palette({ colors }: { colors: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-5">
      {colors.map(([name, hex]) => (
        <div key={hex} className="bg-paper">
          <div className="h-16 sm:h-20" style={{ background: hex }} />
          <div className="px-3 py-2"><p className="text-sm font-medium">{name}</p><p className="font-mono text-xs text-muted">{hex.toUpperCase()}</p></div>
        </div>
      ))}
    </div>
  )
}

export function ChapterClip({ no, title, text, src, className }: { no: string; title: string; text: string; src: string; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[6px] border border-line bg-black">
        <ClipVideo src={src} label={title} />
      </div>
      <figcaption className="mt-3 flex gap-3">
        <span className="font-mono text-xs text-accent">{no}</span>
        <span><span className="font-medium">{title}</span><span className="block text-sm leading-relaxed text-muted">{text}</span></span>
      </figcaption>
    </figure>
  )
}

function ClipVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(r)
    if (r) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} aria-label={label} muted loop playsInline preload="metadata" controls={reduced} className="block aspect-[16/10] w-full object-cover" />
}
