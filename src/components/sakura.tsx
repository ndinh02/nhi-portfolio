import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/* Real sakura, cut out of Unsplash photos (credits in public/sakura/CREDITS.txt).
   Single blossoms bob, small blossoms drift down like falling petals. */

export function Bloom({ n, className, delay = 0 }: { n: 1 | 2; className?: string; delay?: number }) {
  return (
    <motion.img src={`/sakura/bloom${n}.webp`} alt="" draggable={false} aria-hidden
      className={cn("pointer-events-none select-none", className)}
      animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }} />
  )
}

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 37 + 11) % 100, size: 18 + ((i * 7) % 4) * 8, dur: 11 + (i % 5) * 2.2, delay: i * 1.3, sway: i % 2 ? 60 : -50, spin: i % 2 ? 540 : -420,
}))

export function FallingPetals({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden", className)} aria-hidden>
      {PETALS.map((p, i) => (
        <motion.img key={i} src="/sakura/petal.webp" alt="" className="absolute top-0" style={{ left: `${p.left}%`, width: p.size }}
          initial={{ y: "-10vh", opacity: 0 }}
          animate={{ y: ["-10vh", "105vh"], x: [0, p.sway, -p.sway / 2, p.sway / 3], rotate: [0, p.spin], opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }} />
      ))}
    </div>
  )
}
