import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, type TargetAndTransition, type Transition } from "motion/react"
import { useT } from "@/lib/i18n"
import { img, type Id } from "@/components/ui"
import { cn } from "@/lib/utils"

/* Looping motion previews for the three main cases. Each one tells, abstractly and in 18–20 s,
   what the problem was and how it was solved.
   Rules that keep them clean:
   - every element runs on one keyframe clock (seconds into the loop);
   - the story is split into scenes of (almost) equal length, and a scene fully fades out
     before the next fades in, so nothing ever sits on top of something else;
   - all scenes share one layout grid on a 640×440 canvas: content is centred in the same zone,
     the step caption always sits in the same place below it. */

type Track = [number, number | string][]
type KF = (s: Record<string, Track>) => { animate: TargetAndTransition; transition: Transition; initial: false | TargetAndTransition }

/* keyframes in seconds → motion animate + transition on a loop of length `len` */
function kf(spec: Record<string, Track>, still: boolean, pose: number, len: number) {
  const animate: Record<string, number | string | (number | string)[]> = {}, transition: Record<string, Transition> = {}, first: Record<string, number | string> = {}
  for (const [prop, track] of Object.entries(spec)) {
    if (still) { animate[prop] = valueAt(track, pose); continue }
    animate[prop] = track.map((p) => p[1])
    first[prop] = track[0][1]
    transition[prop] = { duration: len, times: track.map((p) => p[0] / len), ease: track.slice(1).map(() => "easeInOut") }  // one ease per segment, not across the whole loop
  }
  // a remounted loop must start from its first keyframe (initial={false} would jump to the last one)
  return { animate: animate as TargetAndTransition, transition: transition as Transition, initial: still ? (false as const) : (first as TargetAndTransition) }
}
function valueAt(track: Track, t: number) {
  let v = track[0][1]
  for (const [time, val] of track) if (time <= t) v = val
  return v
}

/* a value that is `off` outside [a, b] and `on` inside, with a FADE-long ramp at both ends */
const FADE = 0.4
function span(a: number, b: number, len: number, off: number | string = 0, on: number | string = 1, out: number | string = off): Track {
  const tr: Track = []
  if (a > 0) tr.push([0, off])
  tr.push([a, off], [a + FADE, on], [b - FADE, on], [b, out])
  if (b < len) tr.push([len, out])
  return tr
}
/* a value that switches once, at `at`, and holds until the loop ends */
function step(at: number, from: number | string, to: number | string, len: number, dur = FADE): Track {
  return [[0, from], [at, from], [at + dur, to], [len, to]]
}

/* one clock for everything: seconds into the loop (for captions and counters) and the loop number.
   The animated layer is keyed on the loop number, so every element restarts together each cycle. */
function useLoopTime(still: boolean, pose: number, len: number) {
  const [state, setState] = useState({ t: still ? pose : 0, cycle: 0 })
  useEffect(() => {
    if (still) { setState({ t: pose, cycle: 0 }); return }
    const start = performance.now()
    const id = setInterval(() => {
      const e = (performance.now() - start) / 1000
      setState({ t: e % len, cycle: Math.floor(e / len) })
    }, 100)
    return () => clearInterval(id)
  }, [still, pose, len])
  return state
}

function useStill() {
  const [still, setStill] = useState(false)
  useEffect(() => { setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches) }, [])
  return still
}

/* only animate while visible: offscreen the preview holds a still pose */
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

/* shared setup: clock, still pose, keyframe helper */
function usePreview(len: number, pose: number) {
  const still = useStill()
  const [ref, inView] = useInView<HTMLDivElement>()
  const run = inView && !still
  const { t, cycle } = useLoopTime(!run, pose, len)
  const K: KF = (s) => kf(s, !run, pose, len)
  return { ref, time: t, cycle, K, run }
}

/* every preview is composed on a 640×440 canvas and scaled to fit its card.
   Grid: 32 px side margins, content zone from y 32 to y 368, caption baseline at y 412. */
const W = 640, H = 440
function Stage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [s, setS] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setS(Math.min(e.contentRect.width / W, e.contentRect.height / H)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${s})` }}>{children}</div>
    </div>
  )
}

/* one scene: visible only inside [a, b], content centred in the shared zone */
function Scene({ a, b, len, K, children, className }: { a: number; b: number; len: number; K: KF; children: ReactNode; className?: string }) {
  return (
    <motion.div className={cn("absolute inset-x-8 bottom-[72px] top-8 flex flex-col items-center justify-center", className)}
      {...K({ opacity: span(a, b, len), y: span(a, b, len, 10, 0, -10) })}>
      {children}
    </motion.div>
  )
}

/* small uppercase label above a scene's content */
function Label({ children, color }: { children: ReactNode; color: string }) {
  return <p className="mb-4 font-mono text-[0.8rem] uppercase tracking-wider" style={{ color }}>{children}</p>
}

/* step caption: which part of the story is playing. Same place in every preview. */
function Caption({ steps, t, color, dim }: { steps: [number, string][]; t: number; color: string; dim: string }) {
  let i = 0
  steps.forEach(([at], k) => { if (t >= at) i = k })
  return (
    <div className="absolute inset-x-8 bottom-6 flex h-5 items-center gap-3">
      <div className="flex shrink-0 gap-1">
        {steps.map((_, k) => <span key={k} className="h-1 w-5 rounded-full transition-colors duration-300" style={{ background: k === i ? color : dim }} />)}
      </div>
      <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="truncate font-mono text-[0.8rem] uppercase tracking-wider" style={{ color }}>
        {String(i + 1).padStart(2, "0")} · {steps[i][1]}
      </motion.p>
    </div>
  )
}

/* ================= LiveTicker =================
   One persistent dashboard (it is the product), four beats:
   0–4 goal + AI draft · 4–7 Tab publishes · 7–12.5 five-second undo · 12.5–18 Auto needs confirmation */
export function LiveTickerMotion() {
  const t = useT()
  const L = 18
  const { ref, time, cycle, K, run } = usePreview(L, 8)
  const LIME = "#c9f24a", RED = "#ef5a4c", PAPER = "#f5f3ef", LINE = "#26262c", CARD = "#16161b", MUTED = "#8f8d88"
  const UNDO_FROM = 7.2, UNDO_TO = 12.2
  const undoLeft = Math.min(1, Math.max(0, (UNDO_TO - time) / (UNDO_TO - UNDO_FROM)))
  const countdown = Math.max(1, Math.ceil(undoLeft * 5))
  const scored = time >= 5.8
  const ITEM = "h-[56px] rounded-[4px] p-2.5"
  return (
    <Stage className="bg-[#0d0d10]">
      <div ref={ref} className="absolute inset-x-8 bottom-[68px] top-7 overflow-hidden rounded-[6px] border" style={{ borderColor: LINE }}>
        <motion.div key={cycle} className="relative flex h-full flex-col" {...K({ opacity: span(0, L, L) })}>
          {/* top bar */}
          <div className="grid grid-cols-3 items-center border-b px-4 py-3" style={{ borderColor: LINE }}>
            <div className="flex items-center gap-2 font-mono text-[0.8rem] tracking-wider" style={{ color: RED }}>
              <motion.span className="h-2 w-2 rounded-full" style={{ background: RED }} animate={run ? { opacity: [1, 0.3, 1] } : undefined} transition={{ duration: 1.2, repeat: Infinity }} />
              LIVE 67&apos;
            </div>
            <div className="display flex justify-center gap-2 text-2xl tabular-nums" style={{ color: PAPER }}>
              <motion.span key={String(scored)} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ color: scored ? LIME : PAPER }}>{scored ? 2 : 1}</motion.span>
              <span className="opacity-40">–</span><span>1</span>
            </div>
            {/* mode switch: Co-Op stays selected; Auto is only reachable through a confirmation */}
            <div className="flex justify-end">
              <div className="flex rounded-[4px] border p-0.5 font-mono text-[0.68rem] uppercase" style={{ borderColor: LINE }}>
                <span className="px-2 py-1" style={{ color: MUTED }}>Manual</span>
                <span className="rounded-[3px] px-2 py-1" style={{ background: LIME, color: "#0d0d10" }}>Co-Op</span>
                <motion.span className="rounded-[3px] px-2 py-1" style={{ color: MUTED }}
                  {...K({ boxShadow: span(13, 16.4, L, `inset 0 0 0 1px ${LIME}00`, `inset 0 0 0 1px ${LIME}`), scale: [[0, 1], [13, 1], [13.15, 0.9], [13.3, 1], [L, 1]] })}>Auto</motion.span>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.35fr_0.75fr] gap-4 p-4">
            {/* drafts column: the draft, then (in the same slot) the undo toast */}
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-wider" style={{ color: MUTED }}>{t("KI-Entwürfe", "AI drafts")}</p>
              <motion.div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[0.68rem]" style={{ background: CARD, color: PAPER }}
                {...K({ opacity: span(0.4, 5.4, L), scale: span(0.4, 5.4, L, 0.7, 1, 1) })}>
                ⚽ {t("Tor", "Goal")} 67&apos;
              </motion.div>
              <div className="relative mt-3 h-[104px]">
                <motion.div className="absolute inset-x-0 top-0 rounded-[4px] border p-2.5" style={{ borderColor: LIME, background: CARD }}
                  {...K({ opacity: span(1, 5.4, L), x: span(1, 5.4, L, 0, 0, 16) })}>
                  <p className="font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: LIME }}>{t("KI-Entwurf", "AI draft")}</p>
                  {/* the text types itself in: revealed left to right, never re-wrapped */}
                  <motion.p className="mt-1 whitespace-nowrap text-[0.8rem] leading-snug" style={{ color: PAPER }}
                    {...K({ clipPath: step(1.5, "inset(0 100% 0 0)", "inset(0 0% 0 0)", L, 1.7) })}>
                    {t("Müller trifft zum 2:1.", "Müller scores, 2–1.")}
                  </motion.p>
                  <motion.div className="mt-2 inline-block rounded-[3px] border px-1.5 py-0.5 font-mono text-[0.62rem]" style={{ borderColor: LIME }}
                    {...K({ backgroundColor: span(4.4, 5, L, CARD, LIME), color: span(4.4, 5, L, LIME, "#0d0d10"), scale: [[0, 1], [4.4, 1], [4.55, 0.86], [4.75, 1], [L, 1]] })}>
                    Tab ⇥
                  </motion.div>
                </motion.div>
                <motion.div className="absolute inset-x-0 top-0 overflow-hidden rounded-[4px] border" style={{ borderColor: LINE, background: "#101014" }}
                  {...K({ opacity: span(UNDO_FROM - 0.3, UNDO_TO + 0.3, L), y: span(UNDO_FROM - 0.3, UNDO_TO + 0.3, L, 8, 0, 0) })}>
                  <div className="p-2.5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: LIME }}>{t("Veröffentlicht", "Published")}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[0.78rem]" style={{ color: PAPER }}>{t("Rückgängig", "Undo")}</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[0.72rem] tabular-nums" style={{ borderColor: LIME, color: LIME }}>{countdown}</span>
                    </div>
                  </div>
                  <div className="h-1" style={{ background: LINE }}><div className="h-full transition-[width] duration-100 ease-linear" style={{ width: `${undoLeft * 100}%`, background: LIME }} /></div>
                </motion.div>
              </div>
            </div>

            {/* published feed: the new item opens its own slot, the others move down */}
            <div className="min-w-0 overflow-hidden border-x px-4" style={{ borderColor: LINE }}>
              <p className="font-mono text-[0.68rem] uppercase tracking-wider" style={{ color: MUTED }}>{t("Veröffentlicht", "Published")}</p>
              <div className="mt-3">
                <motion.div className="overflow-hidden" {...K({ height: step(5.2, 0, 64, L, 0.5) })}>
                  <motion.div className={cn(ITEM, "border-l-2")} style={{ borderColor: LIME, background: CARD }} {...K({ opacity: step(5.5, 0, 1, L) })}>
                    <p className="font-mono text-[0.62rem]" style={{ color: MUTED }}>67&apos; · {t("KI", "AI")}</p>
                    <p className="mt-1 truncate text-[0.8rem]" style={{ color: PAPER }}>{t("Müller trifft zum 2:1.", "Müller scores, 2–1.")}</p>
                  </motion.div>
                </motion.div>
                {[["54'", t("Gelbe Karte, Hummels", "Yellow card, Hummels")], ["23'", t("Tor, Kane", "Goal, Kane")]].map(([m, x]) => (
                  <div key={m} className={cn(ITEM, "mb-2")} style={{ background: CARD }}>
                    <p className="font-mono text-[0.62rem]" style={{ color: MUTED }}>{m}</p>
                    <p className="mt-1 truncate text-[0.8rem]" style={{ color: PAPER }}>{x}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* stats update when the goal is published */}
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-wider" style={{ color: MUTED }}>{t("Statistik", "Stats")}</p>
              <div className="mt-3 space-y-3">
                {[58, 13, 6, 8].map((v, i) => (
                  <div key={i} className="h-1.5 overflow-hidden rounded-full" style={{ background: LINE }}>
                    <motion.div className="h-full rounded-full" style={{ background: i % 2 ? "#4d9fff" : RED }} {...K({ width: step(5.8, `${v}%`, `${Math.min(95, v + 12)}%`, L, 0.6) })} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* confirmation before the AI may publish on its own: a real modal with a dimmed backdrop */}
          <motion.div className="absolute inset-0 flex items-center justify-center bg-black/60" {...K({ opacity: span(13.4, 16.4, L) })}>
            <motion.div className="w-[300px] rounded-[6px] border p-4 shadow-2xl" style={{ borderColor: LIME, background: CARD }} {...K({ scale: span(13.4, 16.4, L, 0.94, 1) })}>
              <p className="text-[0.85rem] font-semibold" style={{ color: PAPER }}>{t("Zu Auto wechseln?", "Switch to auto?")}</p>
              <p className="mt-1 text-[0.75rem] leading-snug" style={{ color: MUTED }}>{t("Die KI veröffentlicht dann ohne Prüfung.", "The AI will then publish without review.")}</p>
              <div className="mt-4 flex justify-end gap-2 font-mono text-[0.68rem] uppercase">
                <motion.span className="rounded-[3px] border px-2.5 py-1" style={{ borderColor: LINE, color: PAPER }}
                  {...K({ scale: [[0, 1], [15.6, 1], [15.75, 0.88], [15.95, 1], [L, 1]], backgroundColor: span(15.6, 16.4, L, CARD, "#2a2a31") })}>{t("Abbrechen", "Cancel")}</motion.span>
                <span className="rounded-[3px] px-2.5 py-1" style={{ background: LIME, color: "#0d0d10" }}>{t("Bestätigen", "Confirm")}</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <Caption t={time} color={LIME} dim={LINE} steps={[
        [0, t("Ein Tor fällt, die KI schreibt mit", "A goal: the AI drafts along")], [4, t("Tab übernimmt den Entwurf", "Tab accepts the draft")],
        [7, t("5 Sekunden zum Stornieren", "5 seconds to undo")], [12.5, t("Auto nur mit Bestätigung", "Auto only with confirmation")]]} />
    </Stage>
  )
}

/* ================= ekkodale =================
   Five equal scenes of 4 s: calls · interviews · five steps · components · one package */
export function EkkodaleMotion() {
  const t = useT()
  const L = 20
  const { ref, time, cycle, K } = usePreview(L, 18)
  const NAVY = "#0b1c3d", MINT = "#0a7770", SOFT = "#d6dce6", PAPER = "#ffffff"
  const calls = time < 4 ? Math.min(12, Math.floor(time * 5)) : 12
  const S = { len: L, K }
  return (
    <Stage className="inset-4 rounded-[10px] bg-[#eef6f4] shadow-2xl sm:inset-7">
      <div ref={ref} className="absolute inset-0"><div key={cycle} className="absolute inset-0">
        {/* 1: applicants can't find the form and call support */}
        <Scene a={0} b={4} {...S}>
          <div className="flex w-full items-center justify-center gap-16">
            <div className="flex items-center gap-4">
              <motion.div className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm" style={{ background: PAPER, color: NAVY }}
                {...K({ rotate: [[0, 0], [0.5, -12], [0.7, 12], [0.9, -12], [1.1, 12], [1.3, 0], [2.2, 0], [2.4, -12], [2.6, 12], [2.8, 0], [L, 0]] })}>☎</motion.div>
              <div>
                <p className="font-mono text-[0.8rem] uppercase tracking-wider" style={{ color: MINT }}>{t("Anrufe beim Support", "Calls to support")}</p>
                <p className="display text-5xl tabular-nums" style={{ color: NAVY }}>{calls}</p>
              </div>
            </div>
            <div className="flex w-[210px] flex-col items-start gap-3">
              {[t("Wo bewerbe ich mich?", "Where do I apply?"), t("Gibt es Benefits?", "Any benefits?"), t("Wie ist das Team?", "What’s the team like?")].map((q, i) => (
                <motion.div key={q} className="rounded-[12px] rounded-bl-none px-3.5 py-2 text-[0.85rem] shadow-sm" style={{ background: PAPER, color: NAVY }}
                  {...K({ opacity: step(0.6 + i * 0.6, 0, 1, L, 0.3), y: step(0.6 + i * 0.6, 8, 0, L, 0.3) })}>{q}</motion.div>
              ))}
            </div>
          </div>
        </Scene>

        {/* 2: interviews show what the page is missing */}
        <Scene a={4} b={8} {...S}>
          <Label color={MINT}>{t("Interviews mit Praktikant:innen", "Interviews with interns")}</Label>
          <div className="flex items-start gap-6">
            {[[t("Benefits", "Benefits"), "#fff1b8", -3], [t("Kultur", "Culture"), "#c9f0e6", 2], [t("Abschlussarbeit", "Thesis"), "#dfe6ff", -2]].map(([n, bg, r], i) => (
              <motion.div key={n as string} className="flex h-[104px] w-[150px] items-end rounded-[3px] p-3 shadow-md" style={{ background: bg as string, color: NAVY, rotate: r as number }}
                {...K({ opacity: step(4.5 + i * 0.35, 0, 1, L, 0.3), y: step(4.5 + i * 0.35, 12, 0, L, 0.3) })}>
                <span className="display text-xl">{n as string}</span>
              </motion.div>
            ))}
          </div>
        </Scene>

        {/* 3: the answer is a clear five-step process built from standard blocks (the real step names) */}
        <Scene a={8} b={12} {...S}>
          <div className="flex gap-3">
            {[t("Bewerbung", "Application"), t("Erstgespräch", "First talk"), t("Arbeitsprobe", "Work sample"), t("Team\u00advorstellung", "Meet the team"), "Newcomer"].map((n, i) => (
              <motion.div key={n} className="flex h-[132px] w-[108px] flex-col justify-between rounded-[10px] p-3 shadow-sm" style={{ background: "#f38aa6", color: NAVY }}
                {...K({ opacity: step(8.4 + i * 0.25, 0, 1, L, 0.3), y: step(8.4 + i * 0.25, 12, 0, L, 0.3) })}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs" style={{ background: NAVY, color: PAPER }}>{i + 1}</span>
                <span className="text-[0.85rem] font-semibold leading-tight">{n}</span>
              </motion.div>
            ))}
          </div>
          <motion.p className="mt-6 font-mono text-[0.8rem] uppercase tracking-wider" style={{ color: NAVY }} {...K({ opacity: step(9.8, 0, 1, L) })}>
            {t("Nur TYPO3-Standardbausteine · 0 Anrufe", "Only TYPO3 standard blocks · 0 calls")}
          </motion.p>
        </Scene>

        {/* 4: the blocks become documented components (names from the real Storybook tree) */}
        <Scene a={12} b={16} {...S}>
          <div className="flex w-full items-center justify-center gap-14">
            <div>
              <p className="font-mono text-[0.8rem] uppercase tracking-wider" style={{ color: MINT }}>Storybook</p>
              <p className="display mt-2 text-5xl" style={{ color: NAVY }}>53</p>
              <p className="font-mono text-[0.72rem] uppercase tracking-wider" style={{ color: NAVY }}>{t("Komponenten", "Components")}</p>
              <p className="display mt-3 text-3xl" style={{ color: NAVY }}>190</p>
              <p className="font-mono text-[0.72rem] uppercase tracking-wider" style={{ color: NAVY }}>Stories</p>
            </div>
            <div className="flex gap-6">
              {([["Sections", ["HeroSection", "StepsSection", "PricingSection", "ScheduleSection"]], ["Templates", ["PageShell", "BlogPostPage", "NotFoundPage"]]] as [string, string[]][]).map(([group, items], g) => (
                <div key={group} className="w-[150px]">
                  <p className="mb-2 font-mono text-[0.72rem] uppercase tracking-wider" style={{ color: MINT }}>{group}</p>
                  <div className="flex flex-col gap-1.5">
                    {items.map((n, i) => (
                      <motion.span key={n} className="rounded-[4px] border bg-white px-2.5 py-1.5 font-mono text-[0.72rem]" style={{ borderColor: SOFT, color: NAVY }}
                        {...K({ opacity: step(12.4 + g * 0.8 + i * 0.18, 0, 1, L, 0.25), x: step(12.4 + g * 0.8 + i * 0.18, 10, 0, L, 0.25) })}>{n}</motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Scene>

        {/* 5: shipped as one package the gaeco website installs */}
        <Scene a={16} b={20} {...S}>
          <div className="w-[400px] overflow-hidden rounded-[6px] border bg-white shadow-lg" style={{ borderColor: SOFT }}>
            <div className="flex items-center gap-1 border-b px-2 py-1.5" style={{ borderColor: SOFT }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#d6dce6]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d6dce6]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d6dce6]" />
              <span className="ml-2 font-mono text-[0.62rem]" style={{ color: NAVY }}>gaeco</span>
            </div>
            <img src={img("gaeco-frame", true)} alt="" className="block w-full" />
          </div>
          <motion.div className="mt-4 rounded-[4px] px-3 py-2 font-mono text-[0.72rem]" style={{ background: NAVY, color: PAPER }} {...K({ opacity: step(16.8, 0, 1, L), y: step(16.8, 6, 0, L) })}>
            📦 npm install · v0.1.19
          </motion.div>
        </Scene>
      </div></div>
      <Caption t={time} color={NAVY} dim="#c8d0dc" steps={[
        [0, t("Bewerbende finden das Formular nicht", "Applicants can’t find the form")], [4, t("Interviews zeigen, was fehlt", "Interviews show what’s missing")],
        [8, t("Fünf klare Schritte statt Sonderbausteine", "Five clear steps instead of custom blocks")], [12, t("Bausteine werden zu Komponenten", "Blocks become components")],
        [16, t("Ein Paket für die gaeco-Website", "One package for the gaeco website")]]} />
    </Stage>
  )
}

/* ================= SiviCamp =================
   Four equal scenes of 4.5 s: visual language · templates · reach · seats sold */
export function SiviCampMotion() {
  const t = useT()
  const L = 18
  const { ref, time, cycle, K } = usePreview(L, 17)
  const PURPLE = "#512fad", LILAC = "#cab1fd", INK = "#f6efff", DEEP = "#1a0d3d"
  const views = Math.min(1, Math.max(0, (time - 9.4) / 3))
  const seats = Math.min(80, Math.max(0, Math.round(((time - 14) / 2.4) * 100)))
  const posts: Id[] = ["sc-tpl-title", "sc-tpl-carousel", "sc-tpl-long", "sc-tpl-quote", "sc-tpl-tiles", "sc-tpl-count", "sc-tpl-end", "sc-01-teaser",
    "sc-02-open", "sc-03-early", "sc-04-hack-1", "sc-04-hack-2", "sc-04-hack-3", "sc-04-hack-4", "sc-04-hack-5", "sc-05-pass",
    "sc-06-judges", "sc-06-judge", "sc-07-tour-1", "sc-07-tour-2", "sc-08-top10", "sc-09-count", "sc-sponsor", "sc-tpl-title"]
  const S = { len: L, K }
  return (
    <Stage className="bg-[#1a0d3d] [background-image:linear-gradient(to_right,rgba(202,177,253,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(202,177,253,.08)_1px,transparent_1px)] [background-size:24px_24px]">
      <div ref={ref} className="absolute inset-0"><div key={cycle} className="absolute inset-0">
        {/* 1: the retro desktop opens */}
        <Scene a={0} b={4.5} {...S}>
          <motion.div className="w-[340px] overflow-hidden rounded-[4px] border-2" style={{ borderColor: LILAC, background: DEEP }} {...K({ scale: step(0, 0.9, 1, L, 0.6) })}>
            <div className="flex items-center justify-between px-2 py-1 font-mono text-[0.68rem]" style={{ background: LILAC, color: DEEP }}>RAMMASTIC.EXE <span>_ □ ×</span></div>
            <img src={img("sc-keyvisual", true)} alt="" className="block aspect-[16/10] w-full object-cover" />
          </motion.div>
        </Scene>

        {/* 2: one template becomes a set the whole team can use */}
        <Scene a={4.5} b={9} {...S}>
          <div className="w-full">
            <Label color={LILAC}>{t("1 Vorlage → 39 Vorlagen fürs Team", "1 template → 39 templates for the team")}</Label>
            <div className="grid grid-cols-8 gap-2">
              {posts.map((id, i) => (
                <motion.img key={i} src={img(id, true)} alt="" className="aspect-[4/5] w-full rounded-[3px] border object-cover" style={{ borderColor: LILAC }}
                  {...K({ opacity: step(4.9 + i * 0.05, 0, 1, L, 0.25), scale: step(4.9 + i * 0.05, 0.7, 1, L, 0.25) })} />
              ))}
            </div>
          </div>
        </Scene>

        {/* 3: the posts reach the community */}
        <Scene a={9} b={13.5} {...S}>
          <div className="flex w-full items-center justify-center gap-20">
            <div className="w-[190px]">
              <p className="font-mono text-[0.8rem] uppercase tracking-wider" style={{ color: LILAC }}>Views</p>
              <p className="display mt-1 text-5xl tabular-nums" style={{ color: INK }}>{views >= 1 ? "1 Mio.+" : views > 0 ? `${Math.round(views * 1000)}k` : "0"}</p>
            </div>
            <div className="h-[300px] w-[150px] overflow-hidden rounded-[20px] border-[5px]" style={{ borderColor: INK, background: DEEP }}>
              <motion.div className="space-y-2 p-2" {...K({ y: [[0, "0%"], [9.4, "0%"], [13.2, "-45%"], [L, "-45%"]] })}>
                {(["sc-02-open", "sc-04-hack-1", "sc-06-judge", "sc-05-pass", "sc-07-tour-1", "sc-08-top10", "sc-09-count", "sc-03-early"] as Id[]).map((id) => <img key={id} src={img(id, true)} alt="" className="aspect-[4/5] w-full rounded-[3px] object-cover" />)}
              </motion.div>
            </div>
          </div>
        </Scene>

        {/* 4: the boarding pass fills up */}
        <Scene a={13.5} b={18} {...S}>
          <div className="w-[400px] rounded-[8px] p-5" style={{ background: INK, color: DEEP }}>
            <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-wider">
              <span>Boarding Pass</span><span>FRA · 17–19.09.2026</span>
            </div>
            <p className="display mt-3 text-3xl">SiviCamp 2026</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ background: "#e4dcf5" }}>
              <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${seats}%`, background: PURPLE }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[0.72rem]">
              <span className="tabular-nums">{seats}/100 {t("Plätze", "seats")}</span>
              <motion.span style={{ color: PURPLE }} {...K({ opacity: step(16.5, 0, 1, L, 0.3) })}>{t("80 % verkauft", "80 % sold")}</motion.span>
            </div>
          </div>
        </Scene>
      </div></div>
      <Caption t={time} color={LILAC} dim="#3a2a66" steps={[
        [0, t("Ein Retro-Desktop als Bildsprache", "A retro desktop as the visual language")], [4.5, t("Vorlagen, damit das ganze Team postet", "Templates so the whole team can post")],
        [9, t("Die Kampagne erreicht die Community", "The campaign reaches the community")], [13.5, t("80 von 100 Plätzen verkauft", "80 of 100 seats sold")]]} />
    </Stage>
  )
}
