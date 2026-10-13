import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type Chapter = { at: number; title: string; text: string }

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/**
 * One demo video split into chapters. Plays only while in view (starts on first scroll-in,
 * pauses when it leaves, resumes on return) and loops. Chapter buttons seek inside the same file.
 * With prefers-reduced-motion it never autoplays; the viewer starts it via a chapter button.
 */
export function ChapterDemo({ src, label, chapters, className = "", videoClassName = "" }: {
  src: string; label: string; chapters: Chapter[]; className?: string; videoClassName?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!reduced.current) v.play().catch(() => {}) } else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const active = chapters.reduce((a, c, i) => (time >= c.at ? i : a), 0)
  const end = (i: number) => chapters[i + 1]?.at ?? duration

  const seek = useCallback((at: number) => {
    const v = ref.current
    if (!v) return
    v.currentTime = at
    v.play().catch(() => {})
  }, [])

  return (
    <div className={cn("grid items-start gap-6 md:gap-10", className)}>
      <video ref={ref} src={src} aria-label={label} muted loop playsInline preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className={cn("block w-full border border-line bg-black", videoClassName)} />
      <ol className="grid gap-1">
        {chapters.map((c, i) => {
          const on = i === active
          const pct = on && end(i) > c.at ? Math.min(100, ((time - c.at) / (end(i) - c.at)) * 100) : 0
          return (
            <li key={c.title}>
              <button type="button" onClick={() => seek(c.at)} aria-current={on}
                className="group relative block w-full overflow-hidden border-t border-line py-3 text-left">
                {/* no opacity dimming: muted text is already the quiet state and must stay at 4.5:1 */}
                <span className={cn("label flex justify-between gap-4", on ? "!text-ink" : "group-hover:!text-ink")}>
                  <span><span className="mr-3 text-ink">{String(i + 1).padStart(2, "0")}</span>{c.title}</span>
                  <span>{fmt(c.at)}</span>
                </span>
                <span className={cn("mt-1 block max-w-md text-sm text-muted", !on && "hidden md:block")}>{c.text}</span>
                <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-ink" style={{ transform: `scaleX(${pct / 100})` }} />
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
