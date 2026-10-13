import { useEffect, useId, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/* Nhi's face as a paper cut-out sticker with marker doodles drawn on top.
   Motion: the sticker jitters in stop-motion steps (like cut paper animated frame by frame),
   the doodles draw themselves on, then "boil" with a turbulence filter like hand-drawn animation. */

const PINK = "#ff5fa2", YELLOW = "#ffc933", BLUE = "#8b2f5c"

type Stroke = { d: string; c: string; w?: number; fill?: string }
const FACES: Record<1 | 2 | 3, { w: number; h: number; strokes: Stroke[] }> = {
  // glancing to the side: blush, sparkles, a heart, a flower in the hair
  1: { w: 532, h: 612, strokes: [
    { d: "M178 428 q10 -8 20 0 M196 438 q10 -8 20 0 M214 430 q8 -7 16 0", c: PINK, w: 7 },
    { d: "M388 404 q10 -8 20 0 M404 414 q10 -8 20 0", c: PINK, w: 7 },
    { d: "M468 96 l0 44 M446 118 l44 0 M452 102 l32 32 M484 102 l-32 32", c: YELLOW, w: 7 },
    { d: "M500 186 l0 22 M489 197 l22 0", c: YELLOW, w: 6 },
    { d: "M438 214 l0 16 M430 222 l16 0", c: BLUE, w: 5 },
    { d: "M470 300 c-14 -22 -44 -4 -26 18 l26 26 l26 -26 c18 -22 -12 -40 -26 -18 z", c: PINK, w: 6, fill: "#ffc2da" },
    { d: "M150 150 c-16 -26 14 -34 20 -10 c8 -24 38 -12 22 10 c26 4 16 34 -8 22 c2 26 -30 26 -26 2 c-24 8 -32 -22 -8 -24 z", c: YELLOW, w: 6, fill: "#fff1b8" },
    { d: "M166 158 a8 8 0 1 0 0.1 0", c: PINK, w: 6 },
  ] },
  // winking: a crown, a star at the wink, blush, little hearts
  2: { w: 598, h: 612, strokes: [
    { d: "M210 64 l-10 -70 l58 44 l40 -64 l40 64 l58 -44 l-10 70 q-88 -14 -176 0 z", c: YELLOW, w: 8, fill: "#fff1b8" },
    { d: "M298 -34 a6 6 0 1 0 0.1 0", c: PINK, w: 8 },
    { d: "M530 228 l8 22 l22 2 l-18 14 l6 22 l-18 -12 l-18 12 l6 -22 l-18 -14 l22 -2 z", c: YELLOW, w: 6, fill: "#ffe27a" },
    { d: "M190 420 q12 -10 24 0 M212 432 q12 -10 24 0", c: PINK, w: 8 },
    { d: "M478 404 q12 -10 24 0 M498 416 q12 -10 24 0", c: PINK, w: 8 },
    { d: "M92 180 c-10 -14 -28 -2 -16 12 l16 16 l16 -16 c12 -14 -6 -26 -16 -12 z", c: PINK, w: 5, fill: "#ffc2da" },
    { d: "M60 250 c-7 -10 -20 -2 -12 8 l12 12 l12 -12 c8 -10 -5 -18 -12 -8 z", c: PINK, w: 5, fill: "#ffc2da" },
  ] },
  // straight on: cat ears, whiskers, a tiny cat nose
  3: { w: 491, h: 612, strokes: [
    { d: "M92 120 l-10 -96 l86 62", c: PINK, w: 9, fill: "#ffd6e7" },
    { d: "M322 82 l74 -70 l12 104", c: PINK, w: 9, fill: "#ffd6e7" },
    { d: "M60 400 l76 8 M62 432 l74 -6 M70 462 l68 -18", c: BLUE, w: 5 },
    { d: "M336 390 l84 -12 M338 422 l82 4 M334 452 l74 18", c: BLUE, w: 5 },
    { d: "M214 428 l20 0 l-10 12 z", c: PINK, w: 6, fill: PINK },
    { d: "M424 250 l0 26 M411 263 l26 0", c: YELLOW, w: 6 },
  ] },
}

export function PaperFace({ face, className, delay = 0 }: { face: 1 | 2 | 3; className?: string; delay?: number }) {
  const f = FACES[face]
  const id = useId().replace(/:/g, "")
  const [still, setStill] = useState(false)
  useEffect(() => { setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches) }, [])
  return (
    <div className={cn("group relative", !still && "paper-jitter", className)} style={{ aspectRatio: `${f.w} / ${f.h}`, animationDelay: `${-delay}s` }}>
      <img src={`/face/face-${face}.webp`} alt="" draggable={false}
        className="absolute inset-0 h-full w-full select-none drop-shadow-[0_3px_5px_rgba(14,17,22,0.08)] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.04]" />
      <svg viewBox={`0 -60 ${f.w} ${f.h + 60}`} className="pointer-events-none absolute left-0 w-full overflow-visible" aria-hidden
        style={{ top: `${(-60 / f.h) * 100}%`, height: `${((f.h + 60) / f.h) * 100}%` }}>
        <defs>
          <filter id={`boil-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1">
              {!still && <animate attributeName="seed" values="1;4;7;2" dur="0.4s" calcMode="discrete" repeatCount="indefinite" />}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="7" />
          </filter>
        </defs>
        <g filter={`url(#boil-${id})`} strokeLinecap="round" strokeLinejoin="round">
          {f.strokes.map((s, i) => (
            <motion.path key={i} d={s.d} stroke={s.c} strokeWidth={s.w ?? 6} fill={s.fill ?? "none"}
              initial={still ? false : { pathLength: 0, fillOpacity: 0 }}
              // loop: draw on, hold, wipe off, redraw, one stroke after another
              animate={still ? undefined : { pathLength: [0, 1, 1, 0], fillOpacity: [0, 1, 1, 0] }}
              transition={{ duration: 7, times: [0, 0.18, 0.85, 1], repeat: Infinity, repeatDelay: 0.4, delay: delay + 0.6 + i * 0.22, ease: "easeInOut" }} />
          ))}
        </g>
      </svg>
    </div>
  )
}
