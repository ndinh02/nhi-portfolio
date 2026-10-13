import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useT } from "@/lib/i18n"

/* Back-to-top button shaped like a sakura blossom, bottom right on every page.
   It appears once you've scrolled a bit and spins in place while hovered. */

// one petal with the little notch at its tip that makes it read as sakura
const PETAL = "M0 -5 C 7 -11, 10 -22, 4 -30 L 0 -26 L -4 -30 C -10 -22, -7 -11, 0 -5 Z"

export function ToTop() {
  const t = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const up = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" onClick={up} aria-label={t("Nach oben", "Back to top")} title={t("Nach oben", "Back to top")}
          className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 h-14 w-14 rounded-full outline-offset-4 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
          initial={{ opacity: 0, scale: 0.4, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 320, damping: 20 }}>
          {/* petals in their own HTML layer: it spins around its true centre while hovered
              (an SVG <g> would rotate around the drawing's corner and drift off to the side) */}
          <span aria-hidden className="absolute inset-0 block group-hover:animate-[spin_2.4s_linear_infinite] motion-reduce:!animate-none">
            <svg viewBox="-34 -34 68 68" className="h-full w-full drop-shadow-[0_6px_14px_rgba(139,47,92,0.35)]">
              {[0, 72, 144, 216, 288].map((r) => (
                <path key={r} d={PETAL} transform={`rotate(${r})`} fill="#f7b6cc" stroke="#8b2f5c" strokeWidth="1.6" strokeLinejoin="round" />
              ))}
              {[36, 108, 180, 252, 324].map((r) => (
                <line key={r} x1="0" y1="-7" x2="0" y2="-13" transform={`rotate(${r})`} stroke="#8b2f5c" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
              ))}
            </svg>
          </span>
          {/* centre and arrow stay upright */}
          <svg viewBox="-34 -34 68 68" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle r="10" fill="#8b2f5c" />
            <path d="M0 5 V -4.5 M-4.5 0 L0 -4.5 L4.5 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
